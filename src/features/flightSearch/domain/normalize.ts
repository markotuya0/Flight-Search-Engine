import type { Flight, Airport } from './types';
import type { AmadeusFlightOffer, AmadeusFlightSearchResponse } from '../api/searchFlights';

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
  console.log(`Normalized ${flights.length} flights. Price range: $${minPrice} - $${maxPrice}`);
  
  // Log any suspicious prices
  const suspiciousPrices = flights.filter(f => f.priceTotal > 10000 || f.priceTotal < 0);
  if (suspiciousPrices.length > 0) {
    console.warn('Found suspicious prices:', suspiciousPrices.map(f => ({ id: f.id, price: f.priceTotal })));
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