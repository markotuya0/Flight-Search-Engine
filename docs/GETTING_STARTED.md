# 🚀 Getting Started Guide

This guide will help you set up and run the Flight Search Engine on your local machine.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [First Search](#first-search)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js** (v18.0.0 or higher)
  ```bash
  node --version  # Should be v18+
  ```

- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
  ```bash
  npm --version   # Should be v9+
  ```

- **Git**
  ```bash
  git --version
  ```

### API Credentials

You'll need API credentials from two providers:

1. **Amadeus API** (Primary Provider)
   - Visit [Amadeus for Developers](https://developers.amadeus.com/)
   - Create a free account
   - Create a new app to get your Client ID and Client Secret
   - Note: Test environment has limitations but is free

2. **Duffel API** (Fallback Provider)
   - Visit [Duffel](https://duffel.com/)
   - Sign up for an account
   - Get your test API token from the dashboard
   - Note: Test mode is free with limited functionality

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd flight-search-engine
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

This will install all required dependencies including:
- React and React DOM
- TypeScript
- Material-UI
- Redux Toolkit
- Vite
- And more...

### Step 3: Install Vercel CLI (Required for Development)

The application uses Vercel serverless functions for API proxying. Install the Vercel CLI globally:

```bash
npm install -g vercel
```

Verify installation:
```bash
vercel --version
```

## Configuration

### Step 1: Create Environment File

Copy the example environment file:

```bash
cp .env.example .env.local
```

### Step 2: Add Your API Credentials

Open `.env.local` in your text editor and add your credentials:

```bash
# Amadeus API (Primary Provider)
VITE_AMADEUS_CLIENT_ID=your_amadeus_client_id_here
VITE_AMADEUS_CLIENT_SECRET=your_amadeus_client_secret_here

# Duffel API (Fallback Provider)
DUFFEL_ACCESS_TOKEN=duffel_test_your_token_here
```

**Important Notes:**
- Replace the placeholder values with your actual API credentials
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- The `VITE_` prefix is required for client-side environment variables
- `DUFFEL_ACCESS_TOKEN` is server-side only (no prefix needed)

### Step 3: Verify Configuration

Check that your `.env.local` file exists and has the correct format:

```bash
cat .env.local
```

You should see your credentials (keep them secret!).

## Running the Application

### Development Mode (Recommended)

Start the development server with Vercel CLI to enable serverless functions:

```bash
vercel dev
```

The application will be available at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.x.x:3000 (for testing on mobile devices)

**What happens when you run `vercel dev`:**
1. Vite dev server starts for the frontend
2. Serverless functions are available at `/api/*`
3. Hot module replacement (HMR) is enabled
4. TypeScript compilation happens in real-time

### Alternative: Vite Only (Limited Functionality)

If you only want to work on the UI without API functionality:

```bash
npm run dev
```

**Limitations:**
- Duffel API fallback won't work
- Only Amadeus API will be available
- Some features may not function correctly

## First Search

### Step 1: Open the Application

Navigate to http://localhost:3000 in your browser.

### Step 2: Perform a Search

1. **Select Origin**: Type "JFK" or "New York"
2. **Select Destination**: Type "LAX" or "Los Angeles"
3. **Select Date**: Choose a date at least 7 days in the future
4. **Select Passengers**: Choose number of adults (default is 1)
5. **Click "Search Flights"**

### Step 3: Explore Results

You should see:
- List of available flights
- Price range and filters on the left
- Sorting options at the top
- Flight cards with details

### Step 4: Try Features

**Filtering:**
- Adjust the price range slider
- Select number of stops
- Filter by specific airlines

**Sorting:**
- Sort by lowest price
- Sort by shortest duration
- Sort by earliest departure

**Comparison:**
- Select up to 3 flights using checkboxes
- Click "Compare Flights" button
- View side-by-side comparison

**Booking:**
- Click "Book" on any flight
- Follow the 4-step booking process
- Complete passenger, seat, and payment information

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
vercel dev --listen 3001
```

#### 2. API Credentials Not Working

**Error:** `401 Unauthorized` or `Invalid credentials`

**Solution:**
- Double-check your credentials in `.env.local`
- Ensure there are no extra spaces or quotes
- Verify credentials are active in the provider dashboard
- Try regenerating your API keys

#### 3. Amadeus Returns Error 141

**Behavior:** Blue banner appears saying "Using alternative provider"

**Explanation:** This is normal! Amadeus test environment has limitations. The app automatically falls back to Duffel.

**Solution:** No action needed - this is expected behavior.

#### 4. No Flights Found

**Possible Causes:**
- Date is too far in the future (try within 30 days)
- Route not available in test environment
- API rate limits exceeded

**Solution:**
- Try popular routes (JFK-LAX, LHR-JFK, etc.)
- Wait a few minutes if rate limited
- Check browser console for specific errors

#### 5. Vercel CLI Not Found

**Error:** `command not found: vercel`

**Solution:**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Or use npx (no installation needed)
npx vercel dev
```

#### 6. TypeScript Errors

**Error:** Type errors in the console

**Solution:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite

# Restart the dev server
vercel dev
```

### Getting Help

If you encounter issues not covered here:

1. **Check the Console**: Open browser DevTools (F12) and check for errors
2. **Check Terminal**: Look for error messages in the terminal where you ran `vercel dev`
3. **Review Logs**: Check `vercel dev` output for API errors
4. **Search Issues**: Look for similar issues in the GitHub repository
5. **Ask for Help**: Create a new issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node version, etc.)

## Next Steps

Now that you have the application running:

1. **Explore Features**: Try all the features mentioned in [FEATURES.md](FEATURES.md)
2. **Understand Architecture**: Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand how it works
3. **Learn APIs**: Check [API_INTEGRATION.md](API_INTEGRATION.md) for API details
4. **Optimize Performance**: Review [PERFORMANCE.md](PERFORMANCE.md) for best practices
5. **Start Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Development Tips

### Hot Reload

The application supports hot module replacement (HMR):
- Changes to React components reload instantly
- Changes to TypeScript files trigger recompilation
- Changes to CSS/styles update without full reload

### Browser DevTools

Useful shortcuts:
- **F12** or **Cmd+Option+I** (Mac): Open DevTools
- **Cmd+Shift+C** (Mac) / **Ctrl+Shift+C** (Windows): Inspect element
- **Cmd+K** (Mac) / **Ctrl+K** (Windows): Clear console

### VS Code Extensions (Recommended)

- **ESLint**: Real-time linting
- **Prettier**: Code formatting
- **TypeScript**: Enhanced TypeScript support
- **ES7+ React/Redux/React-Native snippets**: Code snippets

### Useful Commands

```bash
# Check for TypeScript errors
npm run type-check

# Format code
npm run format

# Lint code
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**Ready to dive deeper?** Check out the [Architecture Overview](ARCHITECTURE.md) next!
