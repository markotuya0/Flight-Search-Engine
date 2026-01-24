import type { Flight, Airport } from './types';
import type { AmadeusFlightOffer, AmadeusFlightSearchResponse } from '../api/searchFlights';
import { logger } from '../../../shared/utils/logger';

// Duffel offer interface for normalization
interface DuffelOffer {
  id: string;
  live_mode: boolean;
  total_amount: string;
  total_currency: string;
  slices: Array<{
    id: string;
    segments: Array<{
      id: string;
      origin: {
        id: string;
        iata_code: string;
        name: string;
        city_name?: string;
      };
      destination: {
        id: string;
        iata_code: string;
        name: string;
        city_name?: string;
      };
      departing_at: string;
      arriving_at: string;
      marketing_carrier: {
        id: string;
        iata_code: string;
        name: string;
      };
      operating_carrier: {
        id: string;
        iata_code: string;
        name: string;
      };
      duration: string;
    }>;
    duration: string;
  }>;
  passengers: Array<{
    id: string;
    type: string;
  }>;
}

/**
 * Convert Amadeus flight offer to our internal Flight type
 */
export const normalizeAmadeusFlightOffer = (
  offer: AmadeusFlightOffer,
  dictionaries?: AmadeusFlightSearchResponse['dictionaries']
): Flight => {
  // Get the first itinerary (outbound)
  const itinerary = offer.itineraries[0];
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];

  // Calculate total stops (sum of stops across all segments)
  const totalStops = itinerary.segments.reduce((sum, segment) => sum + segment.numberOfStops, 0);

  // Get unique airline codes from all segments
  const airlineCodes = [...new Set(itinerary.segments.map(segment => segment.carrierCode))];

  // Parse duration (PT4H30M -> 270 minutes)
  const durationMinutes = parseDuration(itinerary.duration);

  // Create airport objects
  const origin: Airport = {
    code: firstSegment.departure.iataCode,
    name: getLocationName(firstSegment.departure.iataCode, dictionaries),
    city: getLocationName(firstSegment.departure.iataCode, dictionaries),
    country: 'Unknown', // Amadeus doesn't always provide country in basic response
  };

  const destination: Airport = {
    code: lastSegment.arrival.iataCode,
    name: getLocationName(lastSegment.arrival.iataCode, dictionaries),
    city: getLocationName(lastSegment.arrival.iataCode, dictionaries),
    country: 'Unknown',
  };

  return {
    id: offer.id,
    priceTotal: Math.round(parseFloat(offer.price.grandTotal) || 0),
    currency: offer.price.currency,
    airlineCodes,
    stops: totalStops,
    durationMinutes,
    departAt: firstSegment.departure.at,
    arriveAt: lastSegment.arrival.at,
    origin,
    destination,
  };
};

/**
 * Convert Amadeus flight search response to our internal Flight array
 */
export const normalizeAmadeusResponse = (response: AmadeusFlightSearchResponse): Flight[] => {
  const flights = response.data.map(offer => 
    normalizeAmadeusFlightOffer(offer, response.dictionaries)
  );
  
  // Debug: Log price range to identify the issue
  const prices = flights.map(f => f.priceTotal);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  logger.log(`Normalized ${flights.length} flights. Price range: $${minPrice} - $${maxPrice}`);
  
  // Log any suspicious prices
  const suspiciousPrices = flights.filter(f => f.priceTotal > 10000 || f.priceTotal < 0);
  if (suspiciousPrices.length > 0) {
    logger.warn('Found suspicious prices:', suspiciousPrices.map(f => ({ id: f.id, price: f.priceTotal })));
  }
  
  return flights;
};

/**
 * Parse ISO 8601 duration string to minutes
 * Example: "PT4H30M" -> 270 minutes
 */
const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  
  return hours * 60 + minutes;
};

/**
 * Get location name from dictionaries or fallback to code
 */
const getLocationName = (
  code: string, 
  dictionaries?: AmadeusFlightSearchResponse['dictionaries']
): string => {
  if (dictionaries?.locations?.[code]) {
    const location = dictionaries.locations[code];
    return location.name || location.cityName || code;
  }
  return code;
};

/**
 * Convert Duffel offer to our internal Flight type
 */
export const normalizeDuffelOffer = (offer: DuffelOffer): Flight | null => {
  try {
    // Get the outbound slice (first slice)
    const outboundSlice = offer.slices[0];
    if (!outboundSlice || !outboundSlice.segments || outboundSlice.segments.length === 0) {
      logger.warn(`Duffel offer ${offer.id} missing outbound slice or segments`);
      return null;
    }

    const firstSegment = outboundSlice.segments[0];
    const lastSegment = outboundSlice.segments[outboundSlice.segments.length - 1];

    // Validate required fields
    if (!firstSegment.origin?.iata_code || !lastSegment.destination?.iata_code) {
      logger.warn(`Duffel offer ${offer.id} missing required airport codes`);
      return null;
    }

    if (!firstSegment.departing_at || !lastSegment.arriving_at) {
      logger.warn(`Duffel offer ${offer.id} missing required timestamps`);
      return null;
    }

    if (!offer.total_amount || !offer.total_currency) {
      logger.warn(`Duffel offer ${offer.id} missing price information`);
      return null;
    }

    // Calculate stops (segments - 1)
    const stops = Math.max(0, outboundSlice.segments.length - 1);

    // Get unique airline codes from all segments
    const airlineCodes = [...new Set(
      outboundSlice.segments
        .map(segment => segment.marketing_carrier?.iata_code || segment.operating_carrier?.iata_code)
        .filter(Boolean)
    )];

    // Calculate duration in minutes
    const departTime = new Date(firstSegment.departing_at);
    const arriveTime = new Date(lastSegment.arriving_at);
    const durationMinutes = Math.round((arriveTime.getTime() - departTime.getTime()) / (1000 * 60));

    // Create airport objects
    const origin: Airport = {
      code: firstSegment.origin.iata_code,
      name: firstSegment.origin.name || firstSegment.origin.iata_code,
      city: firstSegment.origin.city_name || firstSegment.origin.name || firstSegment.origin.iata_code,
      country: 'Unknown', // Duffel doesn't always provide country in basic response
    };

    const destination: Airport = {
      code: lastSegment.destination.iata_code,
      name: lastSegment.destination.name || lastSegment.destination.iata_code,
      city: lastSegment.destination.city_name || lastSegment.destination.name || lastSegment.destination.iata_code,
      country: 'Unknown',
    };

    const flight: Flight = {
      id: offer.id,
      priceTotal: Math.round(parseFloat(offer.total_amount) || 0),
      currency: offer.total_currency,
      airlineCodes,
      stops,
      durationMinutes,
      departAt: firstSegment.departing_at,
      arriveAt: lastSegment.arriving_at,
      origin,
      destination,
    };

    return flight;
  } catch (error) {
    console.error(`Error normalizing Duffel offer ${offer.id}:`, error);
    return null;
  }
};

/**
 * Convert Duffel offers array to our internal Flight array
 */
export const normalizeDuffelOffers = (offers: DuffelOffer[]): Flight[] => {
  const flights = offers
    .map(offer => normalizeDuffelOffer(offer))
    .filter((flight): flight is Flight => flight !== null);
  
  // Debug: Log price range
  if (flights.length > 0) {
    const prices = flights.map(f => f.priceTotal);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    logger.log(`Normalized ${flights.length} Duffel flights. Price range: ${minPrice} - ${maxPrice}`);
  }
  
  return flights;
};