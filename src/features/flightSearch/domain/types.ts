// Flight search domain types and models

export interface Flight {
  id: string;
  priceTotal: number;
  currency: string;
  airlineCodes: string[];
  stops: number;
  durationMinutes: number;
  departAt: string; // ISO date string
  arriveAt: string; // ISO date string
  origin: Airport;
  destination: Airport;
}

export interface Airport {
  code: string; // IATA code (e.g., 'JFK')
  name: string; // Full airport name
  city: string; // City name
  country: string; // Country name
}

export interface SearchParams {
  origin: string; // Airport code
  destination: string; // Airport code
  departDate: string; // ISO date string
  returnDate?: string; // ISO date string for round trip
  adults: number;
}

export interface PriceFilter {
  min: number;
  max: number;
}

export interface Filters {
  stops: number[]; // Array of allowed stop counts (0 = non-stop, 1 = 1 stop, etc.)
  airlines: string[]; // Array of airline codes
  price: PriceFilter;
  sortBy: 'price-asc' | 'price-desc' | 'duration-asc' | 'departure-asc';
}

export type LoadingStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface FlightSearchState {
  searchParams: SearchParams;
  filters: Filters;
  allFlights: Flight[];
  selectedForComparison: string[]; // Flight IDs selected for comparison
  comparisonMode: boolean; // Whether comparison dialog is open
  bookingOpen: boolean; // Whether booking flow is open
  selectedFlightForBooking: Flight | null; // Flight selected for booking
  status: LoadingStatus;
  error?: string;
  usedFallback?: boolean; // Track if last search used Duffel fallback
}