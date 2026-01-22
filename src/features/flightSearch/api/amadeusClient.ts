/**
 * Amadeus API Client
 * Handles OAuth authentication and token management
 */

interface AmadeusToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  expiresAt: number; // Calculated expiry timestamp
}

class AmadeusClient {
  private token: AmadeusToken | null = null;
  private readonly baseUrl = 'https://test.api.amadeus.com'; // Test environment
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor() {
    this.clientId = import.meta.env.VITE_AMADEUS_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_AMADEUS_CLIENT_SECRET;

    if (!this.clientId || !this.clientSecret) {
      throw new Error(
        'Amadeus credentials not found. Please set VITE_AMADEUS_CLIENT_ID and VITE_AMADEUS_CLIENT_SECRET in your .env.local file'
      );
    }
  }

  /**
   * Get a valid access token, refreshing if necessary
   */
  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.token && Date.now() < this.token.expiresAt) {
      return this.token.access_token;
    }

    // Fetch new token
    await this.fetchToken();
    return this.token!.access_token;
  }

  /**
   * Fetch OAuth token from Amadeus
   */
  private async fetchToken(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to authenticate with Amadeus: ${response.status} ${errorText}`);
    }

    const tokenData = await response.json();
    
    // Calculate expiry time (subtract 5 minutes for safety)
    const expiresAt = Date.now() + (tokenData.expires_in - 300) * 1000;
    
    this.token = {
      ...tokenData,
      expiresAt,
    };

    console.log('Amadeus token obtained, expires at:', new Date(expiresAt).toISOString());
  }

  /**
   * Make authenticated API request to Amadeus
   */
  async request<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const accessToken = await this.getAccessToken();
    
    // Build URL with query parameters
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Amadeus API error: ${response.status} ${errorText}`);
    }

    return response.json();
  }
}

// Export singleton instance
export const amadeusClient = new AmadeusClient();