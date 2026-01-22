import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { Flight } from '../domain/types';

// Base selectors
export const selectFlightSearchState = (state: RootState) => state.flightSearch;

export const selectSearchParams = (state: RootState) => state.flightSearch.searchParams;
export const selectFilters = (state: RootState) => state.flightSearch.filters;
export const selectAllFlights = (state: RootState) => state.flightSearch.allFlights;
export const selectStatus = (state: RootState) => state.flightSearch.status;
export const selectError = (state: RootState) => state.flightSearch.error;

// Computed selectors
export const selectIsLoading = (state: RootState) => state.flightSearch.status === 'loading';
export const selectHasError = (state: RootState) => !!state.flightSearch.error;

// Filtered flights selector
export const selectFilteredFlights = createSelector(
  [selectAllFlights, selectFilters],
  (flights: Flight[], filters) => {
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

      // Filter by airlines
      if (filters.airlines.length > 0) {
        const hasMatchingAirline = flight.airlineCodes.some(code => 
          filters.airlines.includes(code)
        );
        if (!hasMatchingAirline) {
          return false;
        }
      }

      // Filter by price
      if (flight.priceTotal < filters.price.min || flight.priceTotal > filters.price.max) {
        return false;
      }

      return true;
    });
  }
);

// Flight statistics selectors
export const selectFlightStats = createSelector(
  [selectFilteredFlights],
  (flights) => {
    if (flights.length === 0) {
      return {
        count: 0,
        minPrice: 0,
        maxPrice: 0,
        avgPrice: 0,
        airlines: [],
      };
    }

    const prices = flights.map(f => f.priceTotal);
    const allAirlines = [...new Set(flights.flatMap(f => f.airlineCodes))];

    return {
      count: flights.length,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgPrice: Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length),
      airlines: allAirlines,
    };
  }
);