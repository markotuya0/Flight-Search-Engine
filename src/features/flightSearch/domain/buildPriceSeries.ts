import type { Flight } from './types';

export interface PriceSeriesPoint {
  hour: number;
  minPrice: number;
}

/**
 * Build price series data from filtered flights for charting
 * Buckets flights by departure hour and finds minimum price for each hour
 * 
 * @param flights - Array of filtered flights
 * @returns Array of price series points suitable for Recharts
 */
export const buildPriceSeries = (flights: Flight[]): PriceSeriesPoint[] => {
  if (flights.length === 0) {
    return [];
  }

  // Filter out flights with invalid prices (too high, negative, or NaN)
  const validFlights = flights.filter(flight => {
    const price = flight.priceTotal;
    return !isNaN(price) && price > 0 && price < 50000; // Reasonable price range
  });

  if (validFlights.length === 0) {
    return [];
  }

  // Group flights by departure hour
  const hourlyFlights = new Map<number, Flight[]>();

  validFlights.forEach(flight => {
    const departureDate = new Date(flight.departAt);
    const hour = departureDate.getHours();
    
    if (!hourlyFlights.has(hour)) {
      hourlyFlights.set(hour, []);
    }
    hourlyFlights.get(hour)!.push(flight);
  });

  // Build price series points
  const priceSeriesPoints: PriceSeriesPoint[] = [];

  hourlyFlights.forEach((flightsInHour, hour) => {
    const prices = flightsInHour.map(flight => flight.priceTotal);
    const minPrice = Math.min(...prices);
    
    // Double-check the min price is valid
    if (!isNaN(minPrice) && minPrice > 0 && minPrice < 50000) {
      priceSeriesPoints.push({
        hour,
        minPrice: Math.round(minPrice), // Round to avoid decimal display issues
      });
    }
  });

  // Sort by hour for consistent chart display
  return priceSeriesPoints.sort((a, b) => a.hour - b.hour);
};