import type { VercelRequest, VercelResponse } from '@vercel/node';

interface DuffelSearchRequest {
  origin: string;
  destination: string;
  departDate: string;
  adults: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { origin, destination, departDate, adults }: DuffelSearchRequest = req.body;

    // Validate required parameters
    if (!origin || !destination || !departDate || !adults) {
      return res.status(400).json({ 
        error: 'Missing required parameters: origin, destination, departDate, adults' 
      });
    }

    const duffelToken = process.env.DUFFEL_ACCESS_TOKEN;
    if (!duffelToken) {
      return res.status(500).json({ error: 'Duffel API token not configured' });
    }

    // Create Duffel offer request
    const offerRequestResponse = await fetch('https://api.duffel.com/air/offer_requests', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${duffelToken}`,
        'Content-Type': 'application/json',
        'Duffel-Version': 'beta',
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
      const errorData = await offerRequestResponse.text();
      console.error('Duffel offer request failed:', errorData);
      return res.status(502).json({ 
        error: 'Failed to create offer request',
        details: errorData 
      });
    }

    const offerRequestData = await offerRequestResponse.json();
    const offerRequestId = offerRequestData.data.id;

    // Fetch offers from the created offer request
    const offersResponse = await fetch(
      `https://api.duffel.com/air/offers?offer_request_id=${offerRequestId}`,
      {
        headers: {
          'Authorization': `Bearer ${duffelToken}`,
          'Duffel-Version': 'beta',
        },
      }
    );

    if (!offersResponse.ok) {
      const errorData = await offersResponse.text();
      console.error('Duffel offers fetch failed:', errorData);
      return res.status(502).json({ 
        error: 'Failed to fetch offers',
        details: errorData 
      });
    }

    const offersData = await offersResponse.json();
    
    // Return the offers
    return res.status(200).json(offersData);

  } catch (error) {
    console.error('Duffel API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}