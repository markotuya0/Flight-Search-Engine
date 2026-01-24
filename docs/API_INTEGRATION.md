# 🔌 API Integration Guide

Complete guide to integrating with Amadeus and Duffel flight APIs.

## Table of Contents

- [Overview](#overview)
- [Amadeus API](#amadeus-api)
- [Duffel API](#duffel-api)
- [Fallback Strategy](#fallback-strategy)
- [Data Normalization](#data-normalization)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Testing APIs](#testing-apis)

## Overview

The Flight Search Engine integrates with two flight data providers:

1. **Amadeus** - Primary provider (industry standard)
2. **Duffel** - Fallback provider (high reliability)

### Why Two Providers?

- **Reliability**: If one fails, the other provides backup
- **Coverage**: Different providers have different route coverage
- **Cost Optimization**: Use cheaper provider when primary fails
- **User Experience**: Seamless fallback without user intervention

## Amadeus API

### Getting Started

1. **Sign Up**: Visit [Amadeus for Developers](https://developers.amadeus.com/)
2. **Create App**: Go to "My Apps" → "Create New App"
3. **Get Credentials**: Copy Client ID and Client Secret
4. **Choose Environment**:
   - **Test**: Free, limited data, some routes unavailable
   - **Production**: Paid, full data, all routes

### Authentication

Amadeus uses OAuth 2.0 Client Credentials flow:

```typescript
// Token request
POST https://test.api.amadeus.com/v1/security/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials
&client_id=YOUR_CLIENT_ID
&client_secret=YOUR_CLIENT_SECRET
```

**Response:**
```json
{
  "access_token": "AnT9g5...",
  "token_type": "Bearer",
  "expires_in": 1799
}
```

### Flight Search Endpoint

```typescript
GET https://test.api.amadeus.com/v2/shopping/flight-offers
```

**Parameters:**
- `originLocationCode` (required): IATA code (e.g., "JFK")
- `destinationLocationCode` (required): IATA code (e.g., "LAX")
- `departureDate` (required): YYYY-MM-DD format
- `adults` (required): Number of passengers (1-9)
- `returnDate` (optional): For round-trip
- `max` (optional): Max results (default: 250)
- `currencyCode` (optional): Currency (default: USD)

**Example Request:**
```typescript
const response = await fetch(
  'https://test.api.amadeus.com/v2/shopping/flight-offers?' +
  'originLocationCode=JFK&' +
  'destinationLocationCode=LAX&' +
  'departureDate=2024-02-15&' +
  'adults=1&' +
  'max=50',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);
```

### Response Structure

```json
{
  "data": [
    {
      "id": "1",
      "type": "flight-offer",
      "source": "GDS",
      "instantTicketingRequired": false,
      "nonHomogeneous": false,
      "oneWay": false,
      "lastTicketingDate": "2024-02-14",
      "numberOfBookableSeats": 9,
      "itineraries": [
        {
          "duration": "PT5H30M",
          "segments": [
            {
              "departure": {
                "iataCode": "JFK",
                "terminal": "4",
                "at": "2024-02-15T08:00:00"
              },
              "arrival": {
                "iataCode": "LAX",
                "terminal": "4",
                "at": "2024-02-15T11:30:00"
              },
              "carrierCode": "AA",
              "number": "123",
              "aircraft": {
                "code": "321"
              },
              "duration": "PT5H30M",
              "numberOfStops": 0
            }
          ]
        }
      ],
      "price": {
        "currency": "USD",
        "total": "299.00",
        "base": "250.00",
        "fees": [
          {
            "amount": "49.00",
            "type": "SUPPLIER"
          }
        ]
      }
    }
  ]
}
```

### Common Errors

**Error 141: No Result Found**
```json
{
  "errors": [
    {
      "status": 400,
      "code": 141,
      "title": "NO_RESULT_FOUND",
      "detail": "No flight offers found for the given search criteria"
    }
  ]
}
```

**Solution**: This is common in test environment. App automatically falls back to Duffel.

**Error 38190: Invalid Date**
```json
{
  "errors": [
    {
      "status": 400,
      "code": 38190,
      "title": "INVALID DATE",
      "detail": "Date is in the past or too far in the future"
    }
  ]
}
```

**Solution**: Validate dates before API call.

### Rate Limits

**Test Environment:**
- 10 requests per second
- 1,000 requests per month (free tier)

**Production:**
- Varies by plan
- Contact Amadeus for details

## Duffel API

### Getting Started

1. **Sign Up**: Visit [Duffel](https://duffel.com/)
2. **Get API Key**: Dashboard → API Keys → Create Test Key
3. **Choose Environment**:
   - **Test**: Free, test data only
   - **Live**: Paid, real bookings

### Authentication

Duffel uses Bearer token authentication:

```typescript
headers: {
  'Authorization': 'Bearer duffel_test_...',
  'Content-Type': 'application/json',
  'Duffel-Version': 'v1'
}
```

### Offer Request Flow

Duffel uses a two-step process:

#### Step 1: Create Offer Request

```typescript
POST https://api.duffel.com/air/offer_requests
```

**Request Body:**
```json
{
  "data": {
    "slices": [
      {
        "origin": "JFK",
        "destination": "LAX",
        "departure_date": "2024-02-15"
      }
    ],
    "passengers": [
      {
        "type": "adult"
      }
    ],
    "cabin_class": "economy"
  }
}
```

**Response:**
```json
{
  "data": {
    "id": "orq_123...",
    "live_mode": false,
    "slices": [...],
    "passengers": [...],
    "created_at": "2024-01-24T10:00:00Z"
  }
}
```

#### Step 2: Get Offers

```typescript
GET https://api.duffel.com/air/offers?offer_request_id=orq_123...
```

**Response:**
```json
{
  "data": [
    {
      "id": "off_123...",
      "live_mode": false,
      "total_amount": "299.00",
      "total_currency": "USD",
      "slices": [
        {
          "id": "sli_123...",
          "origin": {
            "iata_code": "JFK",
            "name": "John F. Kennedy International Airport"
          },
          "destination": {
            "iata_code": "LAX",
            "name": "Los Angeles International Airport"
          },
          "duration": "PT5H30M",
          "segments": [
            {
              "id": "seg_123...",
              "origin": {
                "iata_code": "JFK"
              },
              "destination": {
                "iata_code": "LAX"
              },
              "departing_at": "2024-02-15T08:00:00Z",
              "arriving_at": "2024-02-15T11:30:00Z",
              "marketing_carrier": {
                "iata_code": "AA",
                "name": "American Airlines"
              },
              "aircraft": {
                "iata_code": "321",
                "name": "Airbus A321"
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Retry Logic

Duffel offers may not be immediately available. Implement retry:

```typescript
const maxAttempts = 3;
const retryDelay = 2000; // 2 seconds

for (let attempt = 0; attempt < maxAttempts; attempt++) {
  const offers = await getOffers(offerRequestId);
  
  if (offers.length > 0) {
    return offers;
  }
  
  if (attempt < maxAttempts - 1) {
    await new Promise(resolve => setTimeout(resolve, retryDelay));
  }
}
```

### Rate Limits

**Test Environment:**
- 100 requests per minute
- Unlimited requests per month

**Live Environment:**
- Varies by plan
- Contact Duffel for details

## Fallback Strategy

### Decision Logic

```typescript
async function searchFlights(params: SearchParams) {
  try {
    // Try Amadeus first
    const flights = await amadeusClient.searchFlights(params);
    return { flights, usedFallback: false };
  } catch (error) {
    // Check if we should fallback
    if (shouldFallbackToDuffel(error)) {
      try {
        // Try Duffel
        const flights = await duffelSearchFlights(params);
        return { flights, usedFallback: true };
      } catch (duffelError) {
        // Both failed
        throw new Error('All providers failed');
      }
    }
    // Don't fallback for other errors
    throw error;
  }
}
```

### Fallback Triggers

```typescript
function shouldFallbackToDuffel(error: any): boolean {
  // Error 141: No results found
  if (error.code === 141) return true;
  
  // 5xx server errors
  if (error.status >= 500) return true;
  
  // Timeout errors
  if (error.code === 'ETIMEDOUT') return true;
  
  // Network errors
  if (error.code === 'ECONNREFUSED') return true;
  
  return false;
}
```

### User Notification

When fallback is used, show an info banner:

```typescript
{usedFallback && (
  <Alert severity="info">
    Using alternative flight data provider. 
    All features remain fully functional.
  </Alert>
)}
```

## Data Normalization

### Why Normalize?

Different APIs return different data structures. Normalization provides:
- Consistent interface for UI components
- Easier testing
- Simpler state management
- Provider-agnostic code

### Normalized Flight Interface

```typescript
interface Flight {
  id: string;
  origin: Airport;
  destination: Airport;
  departAt: string;          // ISO 8601
  arriveAt: string;           // ISO 8601
  durationMinutes: number;
  stops: number;
  airlineCodes: string[];
  priceTotal: number;
  currency: string;
}

interface Airport {
  code: string;    // IATA code
  name: string;
  city: string;
  country: string;
}
```

### Amadeus Normalization

```typescript
function normalizeAmadeusOffer(offer: AmadeusOffer): Flight {
  const segment = offer.itineraries[0].segments[0];
  const lastSegment = offer.itineraries[0].segments[
    offer.itineraries[0].segments.length - 1
  ];
  
  return {
    id: offer.id,
    origin: {
      code: segment.departure.iataCode,
      name: segment.departure.name || '',
      city: segment.departure.city || '',
      country: segment.departure.country || ''
    },
    destination: {
      code: lastSegment.arrival.iataCode,
      name: lastSegment.arrival.name || '',
      city: lastSegment.arrival.city || '',
      country: lastSegment.arrival.country || ''
    },
    departAt: segment.departure.at,
    arriveAt: lastSegment.arrival.at,
    durationMinutes: parseDuration(offer.itineraries[0].duration),
    stops: offer.itineraries[0].segments.length - 1,
    airlineCodes: [...new Set(
      offer.itineraries[0].segments.map(s => s.carrierCode)
    )],
    priceTotal: parseFloat(offer.price.total),
    currency: offer.price.currency
  };
}
```

### Duffel Normalization

```typescript
function normalizeDuffelOffer(offer: DuffelOffer): Flight {
  const slice = offer.slices[0];
  const firstSegment = slice.segments[0];
  const lastSegment = slice.segments[slice.segments.length - 1];
  
  return {
    id: offer.id,
    origin: {
      code: firstSegment.origin.iata_code,
      name: firstSegment.origin.name,
      city: firstSegment.origin.city_name || '',
      country: firstSegment.origin.country_code || ''
    },
    destination: {
      code: lastSegment.destination.iata_code,
      name: lastSegment.destination.name,
      city: lastSegment.destination.city_name || '',
      country: lastSegment.destination.country_code || ''
    },
    departAt: firstSegment.departing_at,
    arriveAt: lastSegment.arriving_at,
    durationMinutes: parseDuration(slice.duration),
    stops: slice.segments.length - 1,
    airlineCodes: [...new Set(
      slice.segments.map(s => s.marketing_carrier.iata_code)
    )],
    priceTotal: parseFloat(offer.total_amount),
    currency: offer.total_currency
  };
}
```

## Error Handling

### Error Types

**1. Network Errors**
```typescript
try {
  const response = await fetch(url);
} catch (error) {
  if (error.message === 'Failed to fetch') {
    // Network error - no internet or CORS issue
    showError('Network error. Please check your connection.');
  }
}
```

**2. API Errors**
```typescript
if (!response.ok) {
  const error = await response.json();
  
  switch (error.code) {
    case 141:
      // No results - fallback to Duffel
      break;
    case 38190:
      // Invalid date
      showError('Please select a valid date');
      break;
    default:
      showError('Search failed. Please try again.');
  }
}
```

**3. Validation Errors**
```typescript
if (!isValidIATACode(origin)) {
  throw new Error('Invalid origin airport code');
}

if (new Date(departDate) < new Date()) {
  throw new Error('Departure date must be in the future');
}
```

### Error Recovery

```typescript
// Retry with exponential backoff
async function fetchWithRetry(
  fn: () => Promise<any>,
  maxRetries: number = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## Rate Limiting

### Client-Side Rate Limiting

```typescript
class RateLimiter {
  private requests: number[] = [];
  private limit: number;
  private window: number;
  
  constructor(limit: number, windowMs: number) {
    this.limit = limit;
    this.window = windowMs;
  }
  
  async throttle(): Promise<void> {
    const now = Date.now();
    
    // Remove old requests outside window
    this.requests = this.requests.filter(
      time => now - time < this.window
    );
    
    if (this.requests.length >= this.limit) {
      const oldestRequest = this.requests[0];
      const waitTime = this.window - (now - oldestRequest);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.requests.push(now);
  }
}

// Usage
const limiter = new RateLimiter(10, 1000); // 10 requests per second

await limiter.throttle();
const response = await fetch(url);
```

### Server-Side Rate Limiting

```typescript
// In Vercel serverless function
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later'
});

export default limiter(async (req, res) => {
  // Handle request
});
```

## Testing APIs

### Test Credentials

**Amadeus Test:**
- Endpoint: `https://test.api.amadeus.com`
- Limited routes available
- Free tier: 1,000 requests/month

**Duffel Test:**
- Endpoint: `https://api.duffel.com`
- Test mode: `live_mode: false`
- Unlimited requests

### Test Routes

Routes that work well in test environments:

```typescript
const testRoutes = [
  { origin: 'JFK', destination: 'LAX' },  // New York to LA
  { origin: 'LHR', destination: 'JFK' },  // London to New York
  { origin: 'CDG', destination: 'JFK' },  // Paris to New York
  { origin: 'SFO', destination: 'JFK' },  // San Francisco to New York
];
```

### Mock Data

For development without API calls:

```typescript
const mockFlights: Flight[] = [
  {
    id: 'mock-1',
    origin: { code: 'JFK', name: 'JFK Airport', city: 'New York', country: 'US' },
    destination: { code: 'LAX', name: 'LAX Airport', city: 'Los Angeles', country: 'US' },
    departAt: '2024-02-15T08:00:00Z',
    arriveAt: '2024-02-15T11:30:00Z',
    durationMinutes: 330,
    stops: 0,
    airlineCodes: ['AA'],
    priceTotal: 299,
    currency: 'USD'
  },
  // More mock flights...
];
```

### API Testing Tools

**Postman Collection:**
```json
{
  "info": {
    "name": "Flight Search APIs"
  },
  "item": [
    {
      "name": "Amadeus - Get Token",
      "request": {
        "method": "POST",
        "url": "https://test.api.amadeus.com/v1/security/oauth2/token",
        "body": {
          "mode": "urlencoded",
          "urlencoded": [
            { "key": "grant_type", "value": "client_credentials" },
            { "key": "client_id", "value": "{{amadeus_client_id}}" },
            { "key": "client_secret", "value": "{{amadeus_client_secret}}" }
          ]
        }
      }
    }
  ]
}
```

---

**Next:** Explore [Deployment Options](DEPLOYMENT.md).
