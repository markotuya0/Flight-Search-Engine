/**
 * Basic tests for Duffel normalization
 * Note: This is a minimal test setup since no testing framework is configured
 */

import { normalizeDuffelOffer, normalizeDuffelOffers } from '../normalize';

// Mock Duffel offer interface for testing
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

// Mock Duffel offer for testing
const mockDuffelOffer: DuffelOffer = {
  id: 'test-offer-123',
  live_mode: false,
  total_amount: '299.99',
  total_currency: 'USD',
  slices: [
    {
      id: 'slice-1',
      duration: 'PT2H30M',
      segments: [
        {
          id: 'segment-1',
          origin: {
            id: 'airport-1',
            iata_code: 'JFK',
            name: 'John F. Kennedy International Airport',
            city_name: 'New York',
          },
          destination: {
            id: 'airport-2',
            iata_code: 'LAX',
            name: 'Los Angeles International Airport',
            city_name: 'Los Angeles',
          },
          departing_at: '2024-03-15T10:00:00Z',
          arriving_at: '2024-03-15T12:30:00Z',
          marketing_carrier: {
            id: 'airline-1',
            iata_code: 'AA',
            name: 'American Airlines',
          },
          operating_carrier: {
            id: 'airline-1',
            iata_code: 'AA',
            name: 'American Airlines',
          },
          duration: 'PT2H30M',
        },
      ],
    },
  ],
  passengers: [
    {
      id: 'passenger-1',
      type: 'adult',
    },
  ],
};

// Simple test runner (since no framework is configured)
function runTests() {
  console.log('Running Duffel normalization tests...');
  
  // Test 1: Valid offer normalization
  try {
    const normalized = normalizeDuffelOffer(mockDuffelOffer);
    
    if (!normalized) {
      throw new Error('Expected normalized flight, got null');
    }
    
    if (normalized.id !== 'test-offer-123') {
      throw new Error(`Expected id 'test-offer-123', got '${normalized.id}'`);
    }
    
    if (normalized.priceTotal !== 300) {
      throw new Error(`Expected price 300, got ${normalized.priceTotal}`);
    }
    
    if (normalized.currency !== 'USD') {
      throw new Error(`Expected currency 'USD', got '${normalized.currency}'`);
    }
    
    if (normalized.origin.code !== 'JFK') {
      throw new Error(`Expected origin 'JFK', got '${normalized.origin.code}'`);
    }
    
    if (normalized.destination.code !== 'LAX') {
      throw new Error(`Expected destination 'LAX', got '${normalized.destination.code}'`);
    }
    
    if (normalized.stops !== 0) {
      throw new Error(`Expected 0 stops, got ${normalized.stops}`);
    }
    
    if (!normalized.airlineCodes.includes('AA')) {
      throw new Error(`Expected airline codes to include 'AA', got ${normalized.airlineCodes}`);
    }
    
    console.log('✅ Test 1 passed: Valid offer normalization');
  } catch (error) {
    console.error('❌ Test 1 failed:', error);
  }
  
  // Test 2: Invalid offer handling
  try {
    const invalidOffer = { ...mockDuffelOffer, slices: [] };
    const normalized = normalizeDuffelOffer(invalidOffer as DuffelOffer);
    
    if (normalized !== null) {
      throw new Error('Expected null for invalid offer, got normalized flight');
    }
    
    console.log('✅ Test 2 passed: Invalid offer handling');
  } catch (error) {
    console.error('❌ Test 2 failed:', error);
  }
  
  // Test 3: Multiple offers normalization
  try {
    const offers = [mockDuffelOffer, mockDuffelOffer];
    const normalized = normalizeDuffelOffers(offers);
    
    if (normalized.length !== 2) {
      throw new Error(`Expected 2 normalized flights, got ${normalized.length}`);
    }
    
    console.log('✅ Test 3 passed: Multiple offers normalization');
  } catch (error) {
    console.error('❌ Test 3 failed:', error);
  }
  
  console.log('Duffel normalization tests completed.');
}

// Export for potential use
export { runTests };

// Auto-run in development (can be commented out)
if (import.meta.env.DEV) {
  // runTests();
}