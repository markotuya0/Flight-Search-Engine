/**
 * Rate Limiter for API requests
 * Prevents abuse by limiting the number of searches per time window
 */

interface RateLimitState {
  searches: number[];
  lastReset: number;
}

export class RateLimiter {
  private static readonly MAX_SEARCHES = 10;
  private static readonly WINDOW_MS = 60000; // 1 minute
  private static readonly STORAGE_KEY = 'rateLimitState';

  /**
   * Check if a search can be performed
   * @returns true if search is allowed, false if rate limit exceeded
   */
  static canSearch(): boolean {
    const state = this.getState();
    const now = Date.now();

    // Reset if window expired
    if (now - state.lastReset > this.WINDOW_MS) {
      this.reset();
      return true;
    }

    // Filter searches within current window
    const recentSearches = state.searches.filter(
      (time) => now - time < this.WINDOW_MS
    );

    return recentSearches.length < this.MAX_SEARCHES;
  }

  /**
   * Record a search attempt
   * Should be called after a successful search
   */
  static recordSearch(): void {
    const state = this.getState();
    const now = Date.now();

    // Add current search timestamp
    state.searches.push(now);

    // Keep only searches within the window
    state.searches = state.searches.filter(
      (time) => now - time < this.WINDOW_MS
    );

    this.setState(state);
  }

  /**
   * Get time remaining until rate limit resets (in milliseconds)
   * @returns milliseconds until reset, or 0 if no limit active
   */
  static getTimeUntilReset(): number {
    const state = this.getState();
    const now = Date.now();

    // Find the oldest search in the current window
    const recentSearches = state.searches.filter(
      (time) => now - time < this.WINDOW_MS
    );

    if (recentSearches.length === 0) {
      return 0;
    }

    // Time until the oldest search expires
    const oldestSearch = Math.min(...recentSearches);
    const timeUntilExpiry = this.WINDOW_MS - (now - oldestSearch);

    return Math.max(0, timeUntilExpiry);
  }

  /**
   * Get the number of searches remaining in the current window
   * @returns number of searches remaining
   */
  static getRemainingSearches(): number {
    const state = this.getState();
    const now = Date.now();

    const recentSearches = state.searches.filter(
      (time) => now - time < this.WINDOW_MS
    );

    return Math.max(0, this.MAX_SEARCHES - recentSearches.length);
  }

  /**
   * Reset the rate limiter state
   */
  static reset(): void {
    this.setState({ searches: [], lastReset: Date.now() });
  }

  /**
   * Get the current rate limit state from localStorage
   * @returns current state or default state if not found
   */
  private static getState(): RateLimitState {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return { searches: [], lastReset: Date.now() };
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read rate limit state:', error);
      return { searches: [], lastReset: Date.now() };
    }
  }

  /**
   * Save the rate limit state to localStorage
   * @param state - state to save
   */
  private static setState(state: RateLimitState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save rate limit state:', error);
      // Handle quota exceeded or other localStorage errors gracefully
    }
  }
}
