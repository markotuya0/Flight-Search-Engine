import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SearchRequest {
  origin: string;
  destination: string;
  departDate: string;
  adults: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate environment variable
    const duffelToken = process.env.DUFFEL_ACCESS_TOKEN;
    if (!duffelToken) {
      return res.status(500).json({ error: 'Duffel API not configured' });
    }

    // Parse and validate request body
    const { origin, destination, departDate, adults }: SearchRequest = req.body;
    
    if (!origin || !destination || !departDate || !adults) {
      return res.status(400).json({ 
        error: 'Missing required fields: origin, destination, departDate, adults' 
      });
    }

    // Step 1: Create offer request
    const offerRequestResponse = await fetch('https://api.duffel.com/air/offer_requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${duffelToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Duffel-Version': 'v2',
      },
      body: JSON.stringify({
        data: {
          slices: [
            {
              origin,
              destination,
              departure_date: departDate,
            },
          ],
          passengers: Array(adults).fill({ type: 'adult' }),
          cabin_class: 'economy',
        },
      }),
    });

    if (!offerRequestResponse.ok) {
      const errorData = await offerRequestResponse.json().catch(() => ({}));
      return res.status(502).json({ 
        error: 'Duffel offer request failed',
        details: errorData 
      });
    }

    const offerRequestData = await offerRequestResponse.json();
    const offerRequestId = offerRequestData.data.id;

    // Step 2: Get offers (with simple retry logic)
    let offers = [];
    let attempts = 0;
    const maxAttempts = 10;
    const retryDelay = 1000; // 1 second

    while (attempts < maxAttempts) {
      const offersResponse = await fetch(
        `https://api.duffel.com/air/offers?offer_request_id=${offerRequestId}`,
        {
          headers: {
            'Authorization': `Bearer ${duffelToken}`,
            'Accept': 'application/json',
            'Duffel-Version': 'v2',
          },
        }
      );

      if (offersResponse.ok) {
        const offersData = await offersResponse.json();
        offers = offersData.data || [];
        
        if (offers.length > 0) {
          break;
        }
      }

      // Wait before retry (except on last attempt)
      if (attempts < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
      
      attempts++;
    }

    // Return offers (even if empty)
    return res.status(200).json({ data: offers });

  } catch (error) {
    return res.status(502).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}