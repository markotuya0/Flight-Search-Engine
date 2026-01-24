import type { SearchParams } from '../domain/types';
import { logger } from '../../shared/utils/logger';

// Duffel offer interface for type safety
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
 * Search flights using Duffel API via serverless function (to avoid CORS)
 */
export const duffelSearchFlights = async (searchParams: SearchParams): Promise<DuffelOffer[]> => {
  // Validate required parameters
  if (!searchParams.origin || !searchParams.destination || !searchParams.departDate) {
    throw new Error('Origin, destination, and departure date are required');
  }

  logger.log('Duffel search params:', {
    origin: searchParams.origin,
    destination: searchParams.destination,
    departDate: searchParams.departDate,
    adults: searchParams.adults || 1,
  });

  try {
    logger.log('Calling Duffel serverless function...');
    
    // Call our serverless function instead of Duffel directly
    const response = await fetch('/api/duffel/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        origin: searchParams.origin,
        destination: searchParams.destination,
        departDate: searchParams.departDate,
        adults: searchParams.adults || 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Duffel serverless function failed:', response.status, errorData);
      throw new Error(`Duffel search failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const offers: DuffelOffer[] = data.data || [];

    if (offers.length === 0) {
      logger.warn('No offers found from Duffel');
    } else {
      logger.log(`Found ${offers.length} Duffel offers`);
    }

    return offers;
  } catch (error) {
    console.error('Duffel search failed:', error);
    throw error;
  }
};