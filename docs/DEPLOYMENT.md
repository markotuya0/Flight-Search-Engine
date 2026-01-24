# 🚀 Deployment Guide

Complete guide to deploying the Flight Search Engine to production.

## Table of Contents

- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [Build Configuration](#build-configuration)
- [Domain Setup](#domain-setup)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Vercel Deployment

### Prerequisites

- Vercel account ([sign up here](https://vercel.com/signup))
- GitHub repository with your code
- API credentials (Amadeus & Duffel)

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the repository
5. Click "Import"

### Step 2: Configure Project

**Framework Preset:** Vite
**Root Directory:** `./` (leave as default)
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Step 3: Set Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Amadeus API (Primary Provider)
VITE_AMADEUS_CLIENT_ID=your_amadeus_client_id
VITE_AMADEUS_CLIENT_SECRET=your_amadeus_client_secret

# Duffel API (Fallback Provider)
DUFFEL_ACCESS_TOKEN=your_duffel_token
```

**Important:**
- Set for all environments (Production, Preview, Development)
- Use production API keys for production environment
- Use test API keys for preview/development

### Step 4: Deploy

Click "Deploy" button. Vercel will:
1. Clone your repository
2. Install dependencies
3. Run build command
4. Deploy to CDN
5. Provide deployment URL

**Deployment URL:** `https://your-project.vercel.app`

### Automatic Deployments

Vercel automatically deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

## Environment Variables

### Production vs Development

**Production (Live API Keys):**
```bash
VITE_AMADEUS_CLIENT_ID=prod_client_id
VITE_AMADEUS_CLIENT_SECRET=prod_client_secret
DUFFEL_ACCESS_TOKEN=duffel_live_token
```

**Development (Test API Keys):**
```bash
VITE_AMADEUS_CLIENT_ID=test_client_id
VITE_AMADEUS_CLIENT_SECRET=test_client_secret
DUFFEL_ACCESS_TOKEN=duffel_test_token
```

### Security Best Practices

1. **Never commit API keys** to repository
2. **Use different keys** for each environment
3. **Rotate keys regularly** (every 90 days)
4. **Monitor API usage** for suspicious activity
5. **Set up alerts** for unusual patterns

### Environment-Specific Variables

```bash
# Vercel automatically sets these
VERCEL=1
VERCEL_ENV=production  # or preview, development
VERCEL_URL=your-project.vercel.app
```

## Build Configuration

### Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
```

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 10
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

### Build Optimization

**1. Code Splitting:**
```typescript
// Lazy load heavy components
const FlightComparison = lazy(() => import('./FlightComparison'));
const BookingFlow = lazy(() => import('./BookingFlow'));
```

**2. Tree Shaking:**
```typescript
// Import only what you need
import { Button } from '@mui/material';  // ✅ Good
import * as MUI from '@mui/material';    // ❌ Bad
```

**3. Bundle Analysis:**
```bash
npm run build -- --mode analyze
```

## Domain Setup

### Custom Domain

1. Go to Vercel Dashboard → Project → Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `flightsearch.com`)
4. Follow DNS configuration instructions

### DNS Configuration

**Option 1: Vercel Nameservers (Recommended)**
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

**Option 2: CNAME Record**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Option 3: A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

### SSL Certificate

Vercel automatically provisions SSL certificates:
- Free SSL via Let's Encrypt
- Auto-renewal
- HTTPS enforced by default

## Monitoring

### Vercel Analytics

Enable in Dashboard → Project → Analytics:
- Page views
- Unique visitors
- Top pages
- Referrers
- Devices

### Performance Monitoring

```typescript
// Add Web Vitals reporting
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Tracking

**Sentry Integration:**
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.VERCEL_ENV,
  tracesSampleRate: 1.0,
});
```

### API Monitoring

Monitor API usage and errors:
```typescript
// Log API calls
logger.info('API call', {
  provider: 'amadeus',
  endpoint: '/flight-offers',
  duration: 1234,
  status: 200,
});

// Track errors
logger.error('API error', {
  provider: 'amadeus',
  error: error.message,
  code: error.code,
});
```

## Troubleshooting

### Build Failures

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Error: "Out of memory"**
```json
// Increase Node memory in package.json
{
  "scripts": {
    "build": "NODE_OPTIONS=--max_old_space_size=4096 vite build"
  }
}
```

### Runtime Errors

**Error: "Failed to fetch"**
- Check API credentials in environment variables
- Verify API endpoints are accessible
- Check CORS configuration

**Error: "Serverless function timeout"**
```json
// Increase timeout in vercel.json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Performance Issues

**Slow initial load:**
1. Enable code splitting
2. Optimize images
3. Use CDN for static assets
4. Enable compression

**Slow API responses:**
1. Implement caching
2. Use edge functions
3. Optimize API calls
4. Add loading states

### Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Environment variables set
- [ ] API keys are production keys
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] SSL certificate active
- [ ] Custom domain configured
- [ ] Monitoring set up
- [ ] Backup plan ready
- [ ] Documentation updated

---

**Congratulations!** Your Flight Search Engine is now deployed! 🎉
