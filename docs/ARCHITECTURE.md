# 🏗️ Architecture Overview

This document provides a comprehensive overview of the Flight Search Engine's architecture, design patterns, and technical decisions.

## Table of Contents

- [System Architecture](#system-architecture)
- [Frontend Architecture](#frontend-architecture)
- [State Management](#state-management)
- [API Integration Layer](#api-integration-layer)
- [Domain Logic](#domain-logic)
- [Component Structure](#component-structure)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [Performance Optimizations](#performance-optimizations)

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                   │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │  UI Layer   │  │ State Layer  │  │  API Layer  │  │  │
│  │  │  (React)    │◄─┤   (Redux)    │◄─┤  (Clients)  │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           Serverless Functions (API Proxy)             │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │         /api/duffel/search.ts                    │  │  │
│  │  │  - Handles Duffel API requests                   │  │  │
│  │  │  - Keeps API keys secure                         │  │  │
│  │  │  - Implements retry logic                        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
    ┌───────────────────┐   ┌───────────────────┐
    │   Amadeus API     │   │    Duffel API     │
    │   (Primary)       │   │   (Fallback)      │
    └───────────────────┘   └───────────────────┘
```

### Technology Stack

**Frontend:**
- React 19 (UI library)
- TypeScript 5.5 (Type safety)
- Material-UI 6.3 (Component library)
- Redux Toolkit (State management)
- Recharts (Data visualization)
- Vite 6.0 (Build tool)

**Backend/Infrastructure:**
- Vercel (Hosting & Serverless)
- Vercel Edge Functions (API proxy)

**APIs:**
- Amadeus Flight Offers Search API
- Duffel Offer Requests API

## Frontend Architecture

### Feature-Based Structure

The application follows a feature-based architecture where each major feature is self-contained:

```
src/
├── app/                    # Application-level configuration
│   ├── hooks.ts           # Typed Redux hooks
│   ├── providers.tsx      # Context providers
│   └── store.ts           # Redux store configuration
│
├── features/              # Feature modules
│   ├── booking/          # Booking flow feature
│   │   ├── BookingFlow.tsx
│   │   ├── PassengerForm.tsx
│   │   ├── SeatSelection.tsx
│   │   ├── PaymentForm.tsx
│   │   └── Confirmation.tsx
│   │
│   └── flightSearch/     # Flight search feature
│       ├── api/          # API integration
│       │   ├── amadeusClient.ts
│       │   ├── duffelSearchFlights.ts
│       │   └── searchFlights.ts
│       │
│       ├── domain/       # Business logic
│       │   ├── types.ts
│       │   ├── normalize.ts
│       │   ├── applyFilters.ts
│       │   └── buildPriceSeries.ts
│       │
│       ├── state/        # Redux state
│       │   ├── flightSearchSlice.ts
│       │   └── selectors.ts
│       │
│       └── ui/           # UI components
│           ├── FlightSearchPage.tsx
│           ├── SearchForm.tsx
│           ├── ResultsGrid.tsx
│           ├── FiltersPanel.tsx
│           ├── PriceGraph.tsx
│           └── FlightComparison.tsx
│
└── shared/               # Shared utilities
    ├── components/       # Reusable components
    ├── theme/           # Theme configuration
    └── utils/           # Utility functions
```

### Layer Responsibilities

**1. UI Layer (`ui/`)**
- Presentational components
- User interaction handling
- Responsive design
- Accessibility features

**2. State Layer (`state/`)**
- Redux slices
- Selectors
- Async thunks
- State normalization

**3. Domain Layer (`domain/`)**
- Business logic
- Data transformation
- Type definitions
- Pure functions

**4. API Layer (`api/`)**
- API clients
- Request/response handling
- Error handling
- Retry logic

## State Management

### Redux Toolkit Architecture

```typescript
// Store Structure
{
  flightSearch: {
    // Search parameters
    searchParams: SearchParams | null,
    
    // Flight data
    flights: Flight[],
    filteredFlights: Flight[],
    
    // UI state
    loading: boolean,
    error: string | null,
    
    // Filters
    filters: Filters,
    
    // Comparison
    comparisonMode: boolean,
    selectedForComparison: string[],
    
    // Metadata
    usedFallback: boolean,
    lastSearchTime: number | null
  }
}
```

### State Flow

```
User Action
    ↓
Component dispatches action
    ↓
Redux Thunk (async logic)
    ↓
API Call
    ↓
Response normalization
    ↓
State update
    ↓
Selectors compute derived state
    ↓
Components re-render
```

### Key Selectors

```typescript
// Memoized selectors for performance
selectAllFlights          // All flights
selectFilteredFlights     // Filtered & sorted flights
selectFilters             // Current filter state
selectPriceRange          // Min/max prices
selectAvailableAirlines   // Unique airlines
selectFlightsForComparison // Selected flights for comparison
```

## API Integration Layer

### Dual-Provider Strategy

The application implements an intelligent fallback system:

```typescript
// Primary: Amadeus
try {
  const flights = await amadeusClient.searchFlights(params);
  return { flights, usedFallback: false };
} catch (error) {
  // Fallback: Duffel
  if (shouldFallback(error)) {
    const flights = await duffelSearchFlights(params);
    return { flights, usedFallback: true };
  }
  throw error;
}
```

### API Client Architecture

**Amadeus Client:**
```typescript
class AmadeusClient {
  private token: AmadeusToken | null = null;
  
  // OAuth token management
  private async getAccessToken(): Promise<string>
  
  // Flight search
  async searchFlights(params: SearchParams): Promise<Flight[]>
}
```

**Duffel Client:**
```typescript
// Serverless function proxy
export async function duffelSearchFlights(
  params: SearchParams
): Promise<Flight[]> {
  // Calls /api/duffel/search
  // Returns normalized flights
}
```

### Data Normalization

Both APIs return different data structures. We normalize them to a common format:

```typescript
interface Flight {
  id: string;
  origin: Airport;
  destination: Airport;
  departAt: string;
  arriveAt: string;
  durationMinutes: number;
  stops: number;
  airlineCodes: string[];
  priceTotal: number;
  currency: string;
}
```

## Domain Logic

### Pure Functions

All business logic is implemented as pure functions:

```typescript
// Filter application
export const applyFilters = (
  flights: Flight[],
  filters: Filters
): Flight[] => {
  // Pure function - no side effects
  // Testable and predictable
}

// Price series building
export const buildPriceSeries = (
  flights: Flight[]
): PriceDataPoint[] => {
  // Transforms flight data for visualization
}
```

### Benefits

- **Testability**: Easy to unit test
- **Predictability**: Same input = same output
- **Reusability**: Can be used anywhere
- **Performance**: Can be memoized

## Component Structure

### Component Hierarchy

```
App
└── Providers (Theme, Redux)
    └── FlightSearchPage
        ├── SearchForm
        │   ├── OriginAutocomplete
        │   ├── DestinationAutocomplete
        │   ├── DatePicker
        │   └── PassengerSelector
        │
        ├── FiltersPanel
        │   ├── PriceRangeSlider
        │   ├── StopsFilter
        │   └── AirlinesFilter
        │
        ├── ResultsGrid
        │   └── FlightCard[]
        │       └── BookButton
        │           └── BookingFlow (Modal)
        │               ├── PassengerForm
        │               ├── SeatSelection
        │               ├── PaymentForm
        │               └── Confirmation
        │
        ├── PriceGraph
        │   └── Recharts Components
        │
        └── FlightComparison (Modal)
            └── ComparisonCard[]
```

### Component Patterns

**1. Container/Presentational Pattern**

```typescript
// Container (connected to Redux)
export const FlightSearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const flights = useAppSelector(selectFilteredFlights);
  
  return <ResultsGrid flights={flights} />;
};

// Presentational (pure component)
interface ResultsGridProps {
  flights: Flight[];
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ flights }) => {
  return <div>{/* Render flights */}</div>;
};
```

**2. Compound Components**

```typescript
// BookingFlow uses compound component pattern
<BookingFlow open={open} onClose={handleClose}>
  <PassengerForm />
  <SeatSelection />
  <PaymentForm />
  <Confirmation />
</BookingFlow>
```

**3. Render Props / Custom Hooks**

```typescript
// Custom hook for form validation
const useFormValidation = (initialState) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  
  const validate = () => {
    // Validation logic
  };
  
  return { values, errors, validate, setValues };
};
```

## Data Flow

### Search Flow

```
1. User enters search criteria
   ↓
2. SearchForm validates input
   ↓
3. Dispatch searchFlights thunk
   ↓
4. Set loading state
   ↓
5. Call API (Amadeus → Duffel fallback)
   ↓
6. Normalize response data
   ↓
7. Update Redux state
   ↓
8. Selectors compute filtered/sorted results
   ↓
9. Components re-render with new data
   ↓
10. User sees results
```

### Filter Flow

```
1. User adjusts filter
   ↓
2. Dispatch setFilters action
   ↓
3. Update filters in state
   ↓
4. selectFilteredFlights recomputes
   ↓
5. ResultsGrid re-renders
```

### Booking Flow

```
1. User clicks "Book" button
   ↓
2. Open BookingFlow modal
   ↓
3. Step 1: Collect passenger info
   ↓
4. Step 2: Select seat
   ↓
5. Step 3: Enter payment details
   ↓
6. Step 4: Show confirmation
   ↓
7. Close modal
```

## Design Patterns

### 1. Repository Pattern

API clients act as repositories:

```typescript
// Abstract data access
interface FlightRepository {
  search(params: SearchParams): Promise<Flight[]>;
}

// Implementations
class AmadeusRepository implements FlightRepository { }
class DuffelRepository implements FlightRepository { }
```

### 2. Strategy Pattern

Different sorting strategies:

```typescript
const sortStrategies = {
  'price-asc': (a, b) => a.priceTotal - b.priceTotal,
  'price-desc': (a, b) => b.priceTotal - a.priceTotal,
  'duration-asc': (a, b) => a.durationMinutes - b.durationMinutes,
};
```

### 3. Observer Pattern

Redux implements observer pattern:
- Components subscribe to state changes
- State updates trigger re-renders

### 4. Factory Pattern

Flight normalization:

```typescript
function createFlight(apiData: any, source: 'amadeus' | 'duffel'): Flight {
  // Factory creates normalized Flight objects
}
```

### 5. Singleton Pattern

Redux store is a singleton:

```typescript
export const store = configureStore({ /* ... */ });
```

## Performance Optimizations

### 1. Memoization

```typescript
// Memoized selectors
export const selectFilteredFlights = createSelector(
  [selectAllFlights, selectFilters],
  (flights, filters) => applyFilters(flights, filters)
);

// Memoized components
export const FlightCard = React.memo(({ flight }) => {
  // Only re-renders if flight prop changes
});
```

### 2. Code Splitting

```typescript
// Lazy load heavy components
const FlightComparison = lazy(() => import('./FlightComparison'));
const BookingFlow = lazy(() => import('./BookingFlow'));
```

### 3. Debouncing

```typescript
// Debounce filter updates
const debouncedSetFilters = debounce((filters) => {
  dispatch(setFilters(filters));
}, 300);
```

### 4. Virtual Scrolling

For large result sets, consider implementing virtual scrolling to render only visible items.

### 5. Caching

```typescript
// Client-side cache for search results
const cache = new Map<string, CachedResult>();

// Cache key based on search params
const cacheKey = JSON.stringify(searchParams);
```

## Security Considerations

### 1. API Key Protection

- Client-side keys use `VITE_` prefix (exposed)
- Server-side keys have no prefix (secure)
- Duffel API key only in serverless functions

### 2. Input Validation

```typescript
// Validate all user inputs
if (!isValidDate(departDate)) {
  throw new Error('Invalid date');
}

if (!isValidAirportCode(origin)) {
  throw new Error('Invalid airport code');
}
```

### 3. XSS Prevention

- React automatically escapes content
- Use `dangerouslySetInnerHTML` sparingly
- Sanitize any HTML content

### 4. HTTPS Only

- All API calls use HTTPS
- Vercel enforces HTTPS

## Testing Strategy

### Unit Tests

```typescript
describe('applyFilters', () => {
  it('filters by price range', () => {
    const flights = [/* test data */];
    const filters = { price: { min: 100, max: 500 } };
    const result = applyFilters(flights, filters);
    expect(result).toHaveLength(expectedCount);
  });
});
```

### Integration Tests

```typescript
describe('Flight Search Flow', () => {
  it('searches and displays results', async () => {
    render(<FlightSearchPage />);
    // Fill form
    // Submit
    // Wait for results
    // Assert results displayed
  });
});
```

### E2E Tests

```typescript
describe('Complete Booking Flow', () => {
  it('books a flight end-to-end', () => {
    // Search
    // Select flight
    // Fill passenger info
    // Select seat
    // Enter payment
    // Confirm booking
  });
});
```

## Deployment Architecture

```
GitHub Repository
    ↓
Push to main branch
    ↓
Vercel CI/CD
    ↓
Build Process
    ├── Install dependencies
    ├── Type check
    ├── Build frontend (Vite)
    └── Deploy serverless functions
    ↓
Vercel Edge Network
    ├── CDN (static assets)
    ├── Edge Functions (API routes)
    └── Global distribution
```

## Future Enhancements

### Planned Improvements

1. **GraphQL API** - Replace REST with GraphQL for better data fetching
2. **Service Workers** - Offline support and background sync
3. **Web Workers** - Move heavy computations off main thread
4. **Server-Side Rendering** - Improve SEO and initial load time
5. **Real-time Updates** - WebSocket for live price updates
6. **Advanced Caching** - IndexedDB for persistent client-side cache
7. **A/B Testing** - Feature flags and experimentation framework

---

**Next:** Learn about [API Integration](API_INTEGRATION.md) in detail.
