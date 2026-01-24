# ✨ Features Documentation

Comprehensive guide to all features in the Flight Search Engine.

## Table of Contents

- [Flight Search](#flight-search)
- [Advanced Filtering](#advanced-filtering)
- [Sorting Options](#sorting-options)
- [Price Visualization](#price-visualization)
- [Flight Comparison](#flight-comparison)
- [Booking Flow](#booking-flow)
- [Search Caching](#search-caching)
- [Share Functionality](#share-functionality)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)

## Flight Search

### Overview

The core feature that allows users to search for flights across multiple airlines and routes.

### Features

**Search Parameters:**
- **Origin Airport** - Autocomplete with IATA codes
- **Destination Airport** - Autocomplete with IATA codes
- **Departure Date** - Calendar picker with date validation
- **Return Date** (Optional) - For round-trip searches
- **Passengers** - Number of adult passengers (1-9)
- **Trip Type** - One-way or Round-trip

### How It Works

1. User enters search criteria
2. Form validates inputs (required fields, valid dates, etc.)
3. Search button triggers API call
4. Loading state shows skeleton screens
5. Results display in grid format
6. Filters and sorting become available

### API Fallback

The search automatically falls back to Duffel if Amadeus fails:

```
Amadeus API (Primary)
    ↓
  Success? → Display Results
    ↓
  Error 141/5xx? → Try Duffel
    ↓
  Success? → Display Results + Info Banner
    ↓
  Both Fail? → Show Error Message
```

### User Experience

- **Fast Response**: Results typically load in 1-3 seconds
- **Clear Feedback**: Loading indicators and progress states
- **Error Handling**: Friendly error messages with retry options
- **Fallback Notification**: Blue banner when using alternative provider

## Advanced Filtering

### Price Range Filter

**Type:** Slider

**Features:**
- Drag handles to set min/max price
- Real-time filtering as you drag
- Shows current range values
- Automatically adjusts to available price range

**Implementation:**
```typescript
<Slider
  value={[filters.price.min, filters.price.max]}
  onChange={handlePriceChange}
  min={priceRange.min}
  max={priceRange.max}
  valueLabelDisplay="auto"
/>
```

### Stops Filter

**Type:** Checkbox group

**Options:**
- Non-stop flights only
- 1 stop
- 2+ stops

**Behavior:**
- Multiple selections allowed
- Instant filtering
- Shows count of flights for each option

### Airlines Filter

**Type:** Checkbox group

**Features:**
- Lists all airlines in results
- Shows airline codes (e.g., AA, DL, UA)
- Multiple selections allowed
- Alphabetically sorted

**Dynamic Updates:**
- Only shows airlines present in current results
- Updates when search changes

### Filter Persistence

Filters persist during the session:
- Survives page refresh (sessionStorage)
- Resets when new search is performed
- Can be manually reset with "Reset Filters" button

## Sorting Options

### Available Sort Methods

**1. Lowest Price**
- Sorts flights by total price (ascending)
- Default sort option
- Best for budget-conscious travelers

**2. Highest Price**
- Sorts flights by total price (descending)
- Useful for finding premium options

**3. Shortest Duration**
- Sorts by total flight time
- Best for time-sensitive travelers
- Considers layover time

**4. Earliest Departure**
- Sorts by departure time
- Useful for morning flights

### Sort UI

```
┌─────────────────────────────────┐
│ Sort by: [Lowest Price ▼]      │
└─────────────────────────────────┘
```

- Dropdown selector
- Instant re-sorting
- Maintains filter selections

## Price Visualization

### Price Trend Graph

**Type:** Line chart (Recharts)

**Features:**
- X-axis: Time of day
- Y-axis: Price
- Hover tooltips with exact prices
- Responsive sizing

**Insights:**
- Identify cheapest times to fly
- See price distribution
- Spot outliers

### Price Statistics

Displayed above the graph:
- **Lowest Price**: Minimum price in results
- **Average Price**: Mean price across all flights
- **Highest Price**: Maximum price in results

### Graph Interactions

- **Hover**: Shows exact price and time
- **Responsive**: Adapts to screen size
- **Animated**: Smooth transitions

## Flight Comparison

### Overview

Compare up to 3 flights side-by-side to make informed decisions.

### How to Use

1. **Select Flights**: Check boxes on flight cards
2. **Open Comparison**: Click "Compare Flights" button
3. **Review**: See side-by-side comparison
4. **Select**: Choose best option

### Comparison View

```
┌──────────────┬──────────────┬──────────────┐
│   Flight 1   │   Flight 2   │   Flight 3   │
│  [Best Price]│              │              │
├──────────────┼──────────────┼──────────────┤
│   $299       │   $349       │   $399       │
│   2h 30m     │   2h 15m     │   3h 45m     │
│   Non-stop   │   Non-stop   │   1 stop     │
│   AA         │   DL         │   UA         │
└──────────────┴──────────────┴──────────────┘
```

### Highlights

- **Best Price**: Green badge on cheapest flight
- **Fastest**: Blue badge on shortest duration
- **Clear Layout**: Easy to scan and compare

### Features

- Responsive grid (1 column mobile, 2-3 desktop)
- Synchronized scrolling
- Quick selection buttons
- Clear comparison button

## Booking Flow

### 4-Step Process

#### Step 1: Passenger Details

**Fields:**
- First Name (required)
- Last Name (required)
- Email (required, validated)
- Phone Number (optional)
- Date of Birth (required)
- Passport Number (optional)

**Validation:**
- Real-time field validation
- Email format check
- Required field indicators
- Error messages below fields

#### Step 2: Seat Selection

**Features:**
- Interactive seat map
- Color-coded availability:
  - 🟢 Available
  - 🔴 Occupied
  - 🔵 Selected
- Seat categories:
  - Window
  - Middle
  - Aisle
- Extra legroom indicators

**Interaction:**
- Click to select seat
- Visual feedback on selection
- Can change selection before proceeding

#### Step 3: Payment

**Fields:**
- Card Number (validated)
- Cardholder Name
- Expiration Date (MM/YY)
- CVV (3-4 digits)
- Billing Address

**Security:**
- No actual payment processing (demo)
- Client-side validation only
- Secure input fields
- Card type detection

#### Step 4: Confirmation

**Display:**
- Booking reference number
- Flight details summary
- Passenger information
- Seat assignment
- Payment method (masked)
- Confirmation email notification

**Actions:**
- Download confirmation (future)
- Email confirmation (simulated)
- Return to search

### Progress Indicator

```
✓ Passenger → ✓ Seat → ✓ Payment → ④ Confirmation
```

- Shows current step
- Completed steps marked with checkmark
- Can go back to previous steps
- Cannot skip steps

### Mobile Optimization

- Full-screen modal on mobile
- Touch-friendly controls
- Optimized keyboard for inputs
- Swipe gestures (future)

## Search Caching

### Client-Side Cache

**Purpose:** Improve performance for repeated searches

**Implementation:**
- Uses localStorage
- Caches search results
- 30-minute expiration
- Automatic cleanup

**Cache Key:**
```typescript
const cacheKey = `${origin}-${destination}-${date}-${tripType}-${passengers}`;
```

**Benefits:**
- Instant results for repeated searches
- Reduced API calls
- Lower costs
- Better user experience

### Cache Management

**Automatic:**
- Expires after 30 minutes
- Clears on new search
- Removes oldest entries when full

**Manual:**
- "Clear Cache" button in settings
- Clears all cached searches

## Share Functionality

### Share Search Results

**Methods:**
1. **Copy Link** - Copies URL to clipboard
2. **Email** - Opens email client with link
3. **Social Media** - Share to Facebook, Twitter (future)

**URL Structure:**
```
https://app.com/search?origin=JFK&destination=LAX&date=2024-01-25
```

**Features:**
- Shareable search parameters
- Deep linking support
- Preserves filters (future)

### Share Individual Flight

**Information Shared:**
- Flight number
- Route
- Departure/arrival times
- Price
- Airline

## Responsive Design

### Breakpoints

```typescript
const breakpoints = {
  xs: 0,      // Mobile
  sm: 600,    // Tablet
  md: 960,    // Desktop
  lg: 1280,   // Large desktop
  xl: 1920    // Extra large
};
```

### Mobile (< 600px)

- Single column layout
- Stacked filters
- Full-width cards
- Bottom navigation
- Touch-optimized controls

### Tablet (600px - 960px)

- Two-column grid
- Side filters panel
- Compact cards
- Touch and mouse support

### Desktop (> 960px)

- Three-column grid
- Fixed filters sidebar
- Detailed cards
- Hover interactions
- Keyboard shortcuts

### Adaptive Features

- **Images**: Responsive sizing
- **Text**: Scalable typography
- **Spacing**: Fluid margins/padding
- **Navigation**: Adaptive menu

## Accessibility

### WCAG 2.1 Level AA Compliance

**Keyboard Navigation:**
- Tab through all interactive elements
- Enter/Space to activate buttons
- Arrow keys for dropdowns
- Escape to close modals

**Screen Reader Support:**
- ARIA labels on all controls
- ARIA live regions for updates
- Semantic HTML structure
- Alt text for images

**Visual Accessibility:**
- High contrast mode support
- Minimum 4.5:1 contrast ratio
- Focus indicators
- No color-only information

**Motor Accessibility:**
- Large click targets (44x44px minimum)
- No time-based interactions
- Forgiving click areas
- Undo/redo support

### Accessibility Features

**1. Skip Links**
```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

**2. Focus Management**
- Trap focus in modals
- Return focus on close
- Visible focus indicators

**3. Error Handling**
- Clear error messages
- Error summaries
- Inline validation
- Recovery suggestions

**4. Announcements**
```typescript
<div role="status" aria-live="polite">
  {searchResults.length} flights found
</div>
```

## Performance Features

### Optimizations

**1. Code Splitting**
- Lazy load routes
- Dynamic imports
- Smaller initial bundle

**2. Image Optimization**
- WebP format
- Lazy loading
- Responsive images
- Placeholder blur

**3. Caching Strategy**
- Service worker (future)
- HTTP caching headers
- Client-side cache
- CDN distribution

**4. Rendering**
- Virtual scrolling for large lists
- Memoized components
- Debounced inputs
- Throttled scroll handlers

### Performance Metrics

Target metrics:
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **INP** (Interaction to Next Paint): < 200ms

---

**Next:** Learn about [Performance Optimization](PERFORMANCE.md) techniques.
