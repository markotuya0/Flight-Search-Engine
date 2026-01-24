import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FlightSearchState, SearchParams, Filters, Flight } from '../domain/types';
import { searchFlights } from '../api/searchFlights';
import { duffelSearchFlights } from '../api/duffelSearchFlights';
import { normalizeAmadeusResponse, normalizeDuffelOffers } from '../domain/normalize';

/**
 * Check if an error should trigger Duffel fallback
 */
const shouldUseFallback = (error: any): boolean => {
  // Check for HTTP not ok responses
  if (error?.response && !error.response.ok) {
    const status = error.response.status;
    
    // Check for 5xx server errors
    if (status >= 500 && status < 600) {
      console.log(`Amadeus 5xx error (${status}), triggering fallback`);
      return true;
    }
  }

  // Check for Amadeus error code 141
  if (error?.response?.data?.errors) {
    const hasError141 = error.response.data.errors.some((err: any) => err.code === "141");
    if (hasError141) {
      console.log('Amadeus error 141 detected, triggering fallback');
      return true;
    }
  }

  // Check error message for common patterns
  const errorMessage = error?.message || '';
  if (errorMessage.includes('141') || errorMessage.includes('5')) {
    console.log('Error message suggests fallback condition:', errorMessage);
    return true;
  }

  return false;
};

// Async thunk for fetching flights with fallback support
export const fetchFlights = createAsyncThunk(
  'flightSearch/fetchFlights',
  async (searchParams: SearchParams, { rejectWithValue }) => {
    console.log('Starting flight search with params:', searchParams);
    
    try {
      // Try Amadeus first (primary provider)
      console.log('Attempting Amadeus search...');
      const amadeusResponse = await searchFlights(searchParams);
      const flights = normalizeAmadeusResponse(amadeusResponse);
      
      console.log(`Amadeus search successful: ${flights.length} flights found`);
      return { 
        flights, 
        searchParams, 
        usedFallback: false 
      };
    } catch (amadeusError) {
      console.error('Amadeus search failed:', amadeusError);
      
      // Check if we should try Duffel fallback
      if (shouldUseFallback(amadeusError)) {
        try {
          console.log('Attempting Duffel fallback...');
          const duffelOffers = await duffelSearchFlights(searchParams);
          const flights = normalizeDuffelOffers(duffelOffers);
          
          console.log(`Duffel fallback successful: ${flights.length} flights found`);
          return { 
            flights, 
            searchParams, 
            usedFallback: true 
          };
        } catch (duffelError) {
          console.error('Duffel fallback also failed:', duffelError);
          
          // Both providers failed
          const combinedMessage = 'Flight search unavailable (Amadeus + fallback failed). Please try again.';
          return rejectWithValue(combinedMessage);
        }
      } else {
        // Don't use fallback for other types of errors
        const message = amadeusError instanceof Error ? amadeusError.message : 'Amadeus search failed';
        return rejectWithValue(message);
      }
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
    sortBy: 'price-asc',
  },
  allFlights: [],
  status: 'idle',
  error: undefined,
  usedFallback: false,
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
        sortBy: 'price-asc',
      };
    },
    
    setFlights: (state, action: PayloadAction<Flight[]>) => {
      state.allFlights = action.payload;
      state.status = 'succeeded';
      state.error = undefined;
      state.usedFallback = false; // Reset fallback flag when manually setting flights
      
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
      state.usedFallback = false; // Reset fallback flag when starting new search
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
        state.usedFallback = false; // Reset fallback flag when starting new search
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = undefined;
        state.allFlights = action.payload.flights;
        state.searchParams = { ...state.searchParams, ...action.payload.searchParams };
        state.usedFallback = action.payload.usedFallback || false;
        
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
        state.usedFallback = false;
      });
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