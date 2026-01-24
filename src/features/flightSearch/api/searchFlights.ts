import { logger } from '../../shared/utils/logger';
import { amadeusClient } from './amadeusClient';
import type { SearchParams } from '../domain/types';

/**
 * Amadeus Flight Offers Search API response types
 */
export interface AmadeusFlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: AmadeusItinerary[];
  price: AmadeusPrice;
  pricingOptions: AmadeusPricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: AmadeusTravelerPricing[];
}

export interface AmadeusItinerary {
  duration: string;
  segments: AmadeusSegment[];
}

export interface AmadeusSegment {
  departure: AmadeusEndpoint;
  arrival: AmadeusEndpoint;
  carrierCode: string;
  number: string;
  aircraft: AmadeusAircraft;
  operating?: AmadeusOperating;
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface AmadeusEndpoint {
  iataCode: string;
  terminal?: string;
  at: string;
}

export interface AmadeusAircraft {
  code: string;
}

export interface AmadeusOperating {
  carrierCode: string;
}

export interface AmadeusPrice {
  currency: string;
  total: string;
  base: string;
  fees: AmadeusFee[];
  grandTotal: string;
}

export interface AmadeusFee {
  amount: string;
  type: string;
}

export interface AmadeusPricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface AmadeusTravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: AmadeusPrice;
  fareDetailsBySegment: AmadeusFareDetails[];
}

export interface AmadeusFareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags: AmadeusCheckedBags;
}

export interface AmadeusCheckedBags {
  weight?: number;
  weightUnit?: string;
}

export interface AmadeusFlightSearchResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: AmadeusFlightOffer[];
  dictionaries?: {
    locations?: Record<string, any>;
    aircraft?: Record<string, any>;
    currencies?: Record<string, any>;
    carriers?: Record<string, any>;
  };
}

/**
 * Search flights using Amadeus Flight Offers Search API
 */
export const searchFlights = async (searchParams: SearchParams): Promise<AmadeusFlightSearchResponse> => {
  // Validate required parameters
  if (!searchParams.origin || !searchParams.destination || !searchParams.departDate) {
    throw new Error('Origin, destination, and departure date are required');
  }

  // Build API parameters
  const apiParams: Record<string, any> = {
    originLocationCode: searchParams.origin,
    destinationLocationCode: searchParams.destination,
    departureDate: searchParams.departDate,
    adults: searchParams.adults || 1,
    max: 50, // Limit results for better performance
    currencyCode: 'USD',
  };

  // Add return date if provided (round trip)
  if (searchParams.returnDate) {
    apiParams.returnDate = searchParams.returnDate;
  }

  logger.log('Searching flights with params:', apiParams);

  try {
    const response = await amadeusClient.request<AmadeusFlightSearchResponse>(
      '/v2/shopping/flight-offers',
      apiParams
    );

    logger.log(`Found ${response.data.length} flight offers`);
    return response;
  } catch (error) {
    console.error('Flight search failed:', error);
    throw error;
  }
};