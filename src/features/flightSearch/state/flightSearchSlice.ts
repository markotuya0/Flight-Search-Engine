import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FlightSearchState, SearchParams, Filters, Flight } from '../domain/types';

// Initial state
const initialState: FlightSearchState = {
  searchParams: {
    origin: '',
    destination: '',
    departDate: '',
    returnDate: undefined,
    adults: 1,
  },
  filters: {
    stops: [0, 1, 2], // Allow all stop options by default
    airlines: [], // Empty means all airlines allowed
    price: {
      min: 0,
      max: 2000,
    },
  },
  allFlights: [],
  status: 'idle',
  error: undefined,
};

const flightSearchSlice = createSlice({
  name: 'flightSearch',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<Partial<SearchParams>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    setFlights: (state, action: PayloadAction<Flight[]>) => {
      state.allFlights = action.payload;
      state.status = 'succeeded';
      state.error = undefined;
    },
    
    setLoading: (state) => {
      state.status = 'loading';
      state.error = undefined;
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = undefined;
    },
  },
});

export const {
  setSearchParams,
  setFilters,
  resetFilters,
  setFlights,
  setLoading,
  setError,
  clearError,
} = flightSearchSlice.actions;

export default flightSearchSlice.reducer;