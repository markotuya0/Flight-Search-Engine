# ✈️ Flight Search Engine

A modern flight search app that actually works. Built by Mark Otuya.

## What This Is

Real-time flight search with smart API fallback, clean UI, and a complete booking flow. When Amadeus fails (which happens a lot in test mode), it automatically switches to Duffel - users never know the difference.

## Live Demo

🔗 [Try it here](https://your-deployment-url.vercel.app)

## What I Built

### Core Features
- **Smart Search** - Search flights with automatic API fallback (Amadeus → Duffel)
- **Real-time Filtering** - Price, stops, airlines - all instant
- **Price Graphs** - See price trends at a glance
- **Flight Comparison** - Compare up to 3 flights side-by-side
- **Complete Booking Flow** - Passenger info → Seat selection → Payment → Confirmation
- **Fully Responsive** - Works great on mobile, tablet, and desktop

### Tech Stack
- React 19 + TypeScript
- Redux Toolkit for state
- Material-UI for components
- Vite for blazing fast builds
- Vercel for deployment
- Amadeus & Duffel APIs

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd flight-search-engine
npm install

# Set up your API keys
cp .env.example .env.local
# Add your Amadeus and Duffel credentials

# Run it (needs Vercel CLI for API functions)
npm i -g vercel
vercel dev
```

Open http://localhost:3000 and search for flights!

## Environment Variables

Create `.env.local` with:

```bash
# Amadeus (primary API)
VITE_AMADEUS_CLIENT_ID=your_client_id
VITE_AMADEUS_CLIENT_SECRET=your_client_secret

# Duffel (fallback API)
DUFFEL_ACCESS_TOKEN=your_duffel_token
```

Get your keys:
- Amadeus: https://developers.amadeus.com/
- Duffel: https://duffel.com/

## How It Works

### The Fallback Strategy

Amadeus test environment is unreliable (error 141 all the time). So I built automatic fallback:

```
User searches → Try Amadeus
                    ↓
              Amadeus fails?
                    ↓
              Try Duffel instead
                    ↓
              Show results + info banner
```

Users get results either way. No failed searches.

### Project Structure

```
src/
├── features/
│   ├── flightSearch/    # Main search feature
│   │   ├── api/         # Amadeus & Duffel clients
│   │   ├── domain/      # Business logic
│   │   ├── state/       # Redux state
│   │   └── ui/          # React components
│   └── booking/         # Booking flow
├── shared/              # Reusable stuff
└── app/                 # App setup

api/
└── duffel/
    └── search.ts        # Serverless function for Duffel
```

### Key Design Decisions

**Why two APIs?**
- Amadeus is industry standard but test mode sucks
- Duffel is more reliable for testing
- Automatic fallback = better UX

**Why Redux?**
- Complex state (filters, sorting, comparison)
- Need derived state (filtered flights)
- Memoized selectors for performance

**Why Vercel?**
- Free hosting
- Serverless functions for API proxy
- Automatic deployments
- Fast CDN

## Features Breakdown

### Search & Filters
- Autocomplete for airports
- Date picker with validation
- Price range slider
- Multi-select filters (stops, airlines)
- Real-time filtering (no lag)

### Results Display
- Grid layout with flight cards
- Sort by price, duration, departure time
- Loading skeletons
- Empty states

### Price Visualization
- Line chart showing price trends
- Hover for exact prices
- Responsive sizing

### Flight Comparison
- Select up to 3 flights
- Side-by-side modal
- Highlights best price & fastest
- Mobile-optimized

### Booking Flow
4 steps in a modal:
1. Passenger info (name, email, etc.)
2. Seat selection (interactive seat map)
3. Payment (form validation, no real processing)
4. Confirmation (booking reference, summary)

## Performance Optimizations

- **Memoized selectors** - Filters don't recalculate unnecessarily
- **Debounced inputs** - Smooth filtering without lag
- **Code splitting** - Lazy load heavy components
- **Client-side caching** - Repeated searches are instant
- **Optimized renders** - React.memo on expensive components

Target metrics achieved:
- INP < 200ms
- LCP < 2.5s
- No console logs in production

## Documentation

Detailed docs for reviewers:

- **[Getting Started](docs/GETTING_STARTED.md)** - Setup and first run
- **[Architecture](docs/ARCHITECTURE.md)** - How everything fits together
- **[Features](docs/FEATURES.md)** - Every feature explained
- **[API Integration](docs/API_INTEGRATION.md)** - Working with Amadeus & Duffel

## Testing

```bash
# Run tests
npm test

# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

## Known Issues

- Amadeus test API returns error 141 frequently (expected, fallback handles it)
- Seat selection is demo only (no real booking)
- Payment is simulated (no actual processing)

## What's Next

Ideas for future improvements:
- Real booking integration
- User accounts & saved searches
- Price alerts
- Multi-city search
- Baggage info
- Airline reviews

## Built By

**Mark Otuya**
- Solo developer
- Built this to learn React 19, TypeScript, and API integration
- Open to feedback and suggestions

## License

MIT - do whatever you want with it

---

**Questions?** Open an issue or reach out!
