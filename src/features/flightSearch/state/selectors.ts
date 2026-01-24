import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';
import type { Flight } from '../domain/types';
import { applyFilters } from '../domain/applyFilters';
import { buildPriceSeries } from '../domain/buildPriceSeries';

// Base selectors
export const selectFlightSearchState = (state: RootState) => state.flightSearch;

export const selectSearchParams = (state: RootState) => state.flightSearch.searchParams;
export const selectFilters = (state: RootState) => state.flightSearch.filters;
export const selectAllFlights = (state: RootState) => state.flightSearch.allFlights;
export const selectSelectedForComparison = (state: RootState) => state.flightSearch.selectedForComparison;
export const selectComparisonMode = (state: RootState) => state.flightSearch.comparisonMode;
export const selectBookingOpen = (state: RootState) => state.flightSearch.bookingOpen;
export const selectSelectedFlightForBooking = (state: RootState) => state.flightSearch.selectedFlightForBooking;
export const selectStatus = (state: RootState) => state.flightSearch.status;
export const selectError = (state: RootState) => state.flightSearch.error;
export const selectUsedFallback = (state: RootState) => state.flightSearch.usedFallback;

// Computed selectors
export const selectIsLoading = (state: RootState) => state.flightSearch.status === 'loading';
export const selectHasError = (state: RootState) => !!state.flightSearch.error;

// Filtered flights selector - uses pure domain function
export const selectFilteredFlights = createSelector(
  [selectAllFlights, selectFilters],
  (flights: Flight[], filters) => {
    return applyFilters(flights, filters);
  }
);

// Price series selector - derived from filtered flights
export const selectPriceSeries = createSelector(
  [selectFilteredFlights],
  (filteredFlights) => {
    return buildPriceSeries(filteredFlights);
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


// Comparison selectors
export const selectFlightsForComparison = createSelector(
  [selectAllFlights, selectSelectedForComparison],
  (allFlights, selectedIds) => {
    return allFlights.filter(flight => selectedIds.includes(flight.id));
  }
);

export const selectCanCompare = createSelector(
  [selectSelectedForComparison],
  (selectedIds) => selectedIds.length >= 2 && selectedIds.length <= 3
);
