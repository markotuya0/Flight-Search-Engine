# Flight Search Engine

A modern flight search application built with React, TypeScript, and Vite. Features intelligent fallback between Amadeus and Duffel APIs for reliable flight data.

## 🚀 Features

- **Smart API Fallback**: Amadeus primary, Duffel fallback for reliability
- **Real-time Search**: Fast flight search with live filtering and sorting
- **Modern UI**: Clean, responsive interface with Material-UI components
- **Price Visualization**: Interactive price graphs and trend analysis
- **Advanced Filtering**: Filter by price, stops, airlines, and more

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Material-UI
- **State Management**: Redux Toolkit
- **Build Tool**: Vite
- **API Integration**: Amadeus + Duffel (serverless fallback)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Amadeus API credentials ([Get them here](https://developers.amadeus.com/))
- Duffel API credentials ([Get them here](https://duffel.com/))

## 🔧 Environment Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd flight-search-engine
   npm install
   ```

2. **Set up environment variables:**
   
   Copy `.env.example` to `.env.local` and fill in your API credentials:
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables in `.env.local`:
   ```bash
   # Amadeus API (Primary Provider)
   VITE_AMADEUS_CLIENT_ID=your_amadeus_client_id
   VITE_AMADEUS_CLIENT_SECRET=your_amadeus_client_secret
   
   # Duffel API (Fallback Provider)
   DUFFEL_ACCESS_TOKEN=your_duffel_test_token
   ```

## 🚀 Development

**Important**: Use Vercel dev server for full functionality (required for API fallback):

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Start development server with serverless functions
vercel dev
```

The app will be available at `http://localhost:3000`

**Alternative** (limited functionality - no fallback):
```bash
npm run dev  # Only use for UI development
```

## 🔄 Fallback Strategy

The application implements intelligent API fallback:

1. **Primary**: Amadeus API (industry standard)
2. **Fallback**: Duffel API (when Amadeus fails)
3. **Triggers**: Error 141, 5xx server errors
4. **User Experience**: Seamless with clear notification

### How It Works

```
User Search Request
       ↓
1. Try Amadeus (Primary)
       ↓
   Success? → Display Results
       ↓
   Failure (141/5xx)? → Try Duffel (Fallback)
       ↓
   Success? → Display Results + Info Banner
       ↓
   Both Fail? → Show Error Message
```

## 🧪 Testing

### Manual Testing Scenarios

1. **Normal Flow**: Search JFK → LAX (future date)
   - Should show Amadeus results (if working) or Duffel fallback
   
2. **Fallback Flow**: 
   - Amadeus typically fails with error 141 in test environment
   - Duffel automatically activates
   - Blue info banner appears: "Amadeus test environment is unavailable..."

3. **UI Functionality**:
   - Filters work with both providers
   - Sorting functions correctly  
   - Price graph displays properly
   - All existing features preserved

## 📦 Production Deployment

### Vercel Deployment

1. **Set environment variables in Vercel Dashboard:**
   ```
   Project → Settings → Environment Variables
   
   DUFFEL_ACCESS_TOKEN = your_duffel_token
   VITE_AMADEUS_CLIENT_ID = your_amadeus_id  
   VITE_AMADEUS_CLIENT_SECRET = your_amadeus_secret
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

### Build Locally
```bash
npm run build
npm run preview
```

## 🔒 Security

- ✅ No API keys committed to repository
- ✅ Environment variables for all credentials  
- ✅ Server-side API calls (no CORS issues)
- ✅ `.env.local` properly gitignored

## 🏗️ Architecture

```
src/
├── features/flightSearch/
│   ├── api/           # API integrations
│   ├── domain/        # Business logic & types
│   ├── state/         # Redux state management
│   └── ui/            # React components
├── shared/            # Shared utilities
└── app/               # App configuration

api/
└── duffel/
    └── search.ts      # Serverless fallback function
```

## 🤝 Contributing

1. Create feature branch: `git checkout -b feat/your-feature`
2. Make changes and test locally with `vercel dev`
3. Commit: `git commit -m "feat: description"`
4. Push: `git push origin feat/your-feature`
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details
