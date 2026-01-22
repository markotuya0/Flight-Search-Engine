import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FlightSearchState, SearchParams, Filters, Flight } from '../domain/types';
import { searchFlights } from '../api/searchFlights';
import { normalizeAmadeusResponse } from '../domain/normalize';

// Async thunk for fetching flights from Amadeus API
export const fetchFlights = createAsyncThunk(
  'flightSearch/fetchFlights',
  async (searchParams: SearchParams, { rejectWithValue }) => {
    try {
      const response = await searchFlights(searchParams);
      const flights = normalizeAmadeusResponse(response);
      return { flights, searchParams };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch flights';
      return rejectWithValue(message);
    }
  }
);

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
    stops: [], // Empty means no filter - show all flights
    airlines: [], // Empty means all airlines allowed
    price: {
      min: 0,
      max: 2000,
    },
  },
  sortBy: 'best', // Default sort
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
    
    setSortBy: (state, action: PayloadAction<'best' | 'cheapest' | 'fastest'>) => {
      state.sortBy = action.payload;
    },
    
    resetFilters: (state) => {
      // Calculate current price range from flights
      let minPrice = 0;
      let maxPrice = 2000;
      
      if (state.allFlights.length > 0) {
        const prices = state.allFlights.map(flight => flight.priceTotal);
        minPrice = Math.min(...prices);
        maxPrice = Math.max(...prices);
      }
      
      state.filters = {
        stops: [],
        airlines: [],
        price: {
          min: minPrice,
          max: maxPrice,
        },
      };
    },
    
    setFlights: (state, action: PayloadAction<Flight[]>) => {
      state.allFlights = action.payload;
      state.status = 'succeeded';
      state.error = undefined;
      
      // Initialize price range based on actual flight data
      if (action.payload.length > 0) {
        const prices = action.payload.map(flight => flight.priceTotal);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        
        // Only update if we're still at default values (0, 2000)
        if (state.filters.price.min === 0 && state.filters.price.max === 2000) {
          state.filters.price.min = minPrice;
          state.filters.price.max = maxPrice;
        }
      }
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlights.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = undefined;
        state.allFlights = action.payload.flights;
        state.searchParams = { ...state.searchParams, ...action.payload.searchParams };
        
        // Initialize price range based on actual flight data
        if (action.payload.flights.length > 0) {
          const prices = action.payload.flights.map(flight => flight.priceTotal);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          
          // Reset filters to show all results from new search
          state.filters = {
            stops: [],
            airlines: [],
            price: {
              min: minPrice,
              max: maxPrice,
            },
          };
        }
      })
      .addCase(fetchFlights.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.allFlights = [];
      });
  },
});

export const {
  setSearchParams,
  setFilters,
  setSortBy,
  resetFilters,
  setFlights,
  setLoading,
  setError,
  clearError,
} = flightSearchSlice.actions;

export default flightSearchSlice.reducer;