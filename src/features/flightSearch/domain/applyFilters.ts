import type { Flight, Filters } from './types';

/**
 * Pure function to apply filters and sorting to flights array
 * This is the single source of truth for filtering logic
 * 
 * @param flights - Array of flights to filter
 * @param filters - Filter criteria to apply
 * @returns Filtered and sorted array of flights
 */
export const applyFilters = (flights: Flight[], filters: Filters): Flight[] => {
  // First, filter the flights
  const filtered = flights.filter((flight) => {
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

  // Then, sort the filtered results
  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-asc':
        return a.priceTotal - b.priceTotal;
      case 'price-desc':
        return b.priceTotal - a.priceTotal;
      case 'duration-asc':
        return a.durationMinutes - b.durationMinutes;
      case 'departure-asc':
        return new Date(a.departAt).getTime() - new Date(b.departAt).getTime();
      default:
        return 0;
    }
  });

  return sorted;
};