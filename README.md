# ✈️ Flight Search Engine

A modern, responsive flight search application with intelligent API fallback and real-time filtering.

## 🎥 Demo & Links

- **🎬 Video Demo:** [Watch on Loom](https://www.loom.com/share/7718cd3c0c0d4cb9b6e63ce95425b3b3)
- **🚀 Live App:** [flight-search-engine-six.vercel.app](https://flight-search-engine-six.vercel.app/)
- **💻 Source Code:** [GitHub Repository](https://github.com/markotuya0/Flight-Search-Engine)

## Overview

Real-time flight search with smart API fallback, clean UI, and complete booking flow. When Amadeus fails (common in test mode), it automatically switches to Duffel - users never know the difference.

## Key Features

- **Smart Search** - Automatic API fallback (Amadeus → Duffel)
- **Real-time Filtering** - Price, stops, airlines with instant updates
- **Price Visualization** - Interactive price trend graphs
- **Flight Comparison** - Compare up to 3 flights side-by-side
- **Complete Booking Flow** - Passenger info → Seat selection → Payment → Confirmation
- **Fully Responsive** - Optimized for mobile, tablet, and desktop

## Tech Stack

- **Frontend:** React 19, TypeScript, Redux Toolkit, Material-UI
- **Build:** Vite with code splitting and optimization
- **APIs:** Amadeus (primary), Duffel (fallback)
- **Deployment:** Vercel with serverless functions

## Quick Start

```bash
# Clone and install
git clone https://github.com/markotuya0/Flight-Search-Engine.git
cd flight-search-engine
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API credentials (see below)

# Run locally (requires Vercel CLI for API functions)
npm i -g vercel
vercel dev
```

Open http://localhost:3000 and search for flights!

## Environment Setup

Create `.env.local` with your API credentials:

```bash
# Amadeus (primary API)
VITE_AMADEUS_CLIENT_ID=your_client_id
VITE_AMADEUS_CLIENT_SECRET=your_client_secret

# Duffel (fallback API)
DUFFEL_ACCESS_TOKEN=your_duffel_token
```

**Get API Keys:**
- [Amadeus for Developers](https://developers.amadeus.com/)
- [Duffel API](https://duffel.com/)

## Architecture Highlights

### Intelligent Fallback System
```
User Search → Amadeus API
                ↓ (if fails)
              Duffel API
                ↓
            Normalized Results
```

### Project Structure
```
src/
├── features/
│   ├── flightSearch/     # Core search functionality
│   │   ├── api/          # API clients & normalization
│   │   ├── domain/       # Business logic
│   │   ├── state/        # Redux state management
│   │   └── ui/           # React components
│   └── booking/          # Booking flow
├── shared/               # Reusable utilities & components
└── app/                  # App configuration

api/
└── duffel/
    └── search.ts         # Serverless function for Duffel API
```

## Performance Features

- **Memoized Selectors** - Efficient state derivation
- **Code Splitting** - Lazy-loaded components
- **Client-side Caching** - Instant repeated searches
- **Debounced Inputs** - Smooth filtering experience
- **Optimized Renders** - React.memo for expensive components

## Development

```bash
# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# Production build
npm run build
```

## Built By

**Mark Otuya** - Frontend React Engineer Assessment

---

*Questions? Open an issue or reach out!*
