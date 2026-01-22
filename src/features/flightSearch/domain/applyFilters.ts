import type { Flight, Filters } from './types';

/**
 * Pure function to apply filters to flights array
 * This is the single source of truth for filtering logic
 * 
 * @param flights - Array of flights to filter
 * @param filters - Filter criteria to apply
 * @returns Filtered array of flights
 */
export const applyFilters = (flights: Flight[], filters: Filters): Flight[] => {
  return flights.filter((flight) => {
    // Filter by stops - only apply if stops are selected
    if (filters.stops.length > 0) {
      const matchesStops = filters.stops.some(selectedStops => {
        if (selectedStops === 2) {
          // "2+ stops" means 2 or more stops
          return flight.stops >= 2;
        }
        return flight.stops === selectedStops;
      });
      
      if (!matchesStops) {
        return false;
      }
    }

    // Filter by airlines - only apply if airlines are selected
    if (filters.airlines.length > 0) {
      const hasMatchingAirline = flight.airlineCodes.some(code => 
        filters.airlines.includes(code)
      );
      if (!hasMatchingAirline) {
        return false;
      }
    }

    // Filter by price - always apply price range
    if (flight.priceTotal < filters.price.min || flight.priceTotal > filters.price.max) {
      return false;
    }

    return true;
  });
};