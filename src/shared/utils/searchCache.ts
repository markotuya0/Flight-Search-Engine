import type { Flight, SearchParams } from '../../features/flightSearch/domain/types';
import { logger } from './logger';

interface CacheEntry {
  searchParams: SearchParams;
  flights: Flight[];
  timestamp: number;
  usedFallback?: boolean;
}

const CACHE_KEY = 'flight_search_cache';
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const MAX_CACHE_ENTRIES = 10; // Keep only last 10 searches

/**
 * Generate a unique cache key from search parameters
 */
const generateCacheKey = (params: SearchParams): string => {
  const { origin, destination, departDate, returnDate, adults } = params;
  return `${origin}-${destination}-${departDate}-${returnDate || 'oneway'}-${adults}`;
};

/**
 * Get all cache entries from localStorage
 */
const getAllCacheEntries = (): Record<string, CacheEntry> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return {};
    return JSON.parse(cached);
  } catch (error) {
    console.error('Error reading cache:', error);
    return {};
  }
};

/**
 * Save all cache entries to localStorage
 */
const saveAllCacheEntries = (entries: Record<string, CacheEntry>): void => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving cache:', error);
  }
};

/**
 * Check if a cache entry is still valid
 */
const isCacheValid = (entry: CacheEntry): boolean => {
  const now = Date.now();
  const age = now - entry.timestamp;
  return age < CACHE_DURATION;
};

/**
 * Clean up expired cache entries
 */
const cleanupExpiredEntries = (entries: Record<string, CacheEntry>): Record<string, CacheEntry> => {
  const validEntries: Record<string, CacheEntry> = {};
  
  Object.entries(entries).forEach(([key, entry]) => {
    if (isCacheValid(entry)) {
      validEntries[key] = entry;
    }
  });
  
  return validEntries;
};

/**
 * Limit cache size by keeping only the most recent entries
 */
const limitCacheSize = (entries: Record<string, CacheEntry>): Record<string, CacheEntry> => {
  const sortedEntries = Object.entries(entries)
    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
    .slice(0, MAX_CACHE_ENTRIES);
  
  return Object.fromEntries(sortedEntries);
};

/**
 * Get cached flight results for given search parameters
 */
export const getCachedFlights = (searchParams: SearchParams): { flights: Flight[]; usedFallback?: boolean } | null => {
  const cacheKey = generateCacheKey(searchParams);
  const allEntries = getAllCacheEntries();
  const entry = allEntries[cacheKey];
  
  if (!entry) {
    logger.log('Cache miss: No entry found for', cacheKey);
    return null;
  }
  
  if (!isCacheValid(entry)) {
    logger.log('Cache expired for', cacheKey);
    return null;
  }
  
  logger.log('Cache hit! Using cached results for', cacheKey);
  return {
    flights: entry.flights,
    usedFallback: entry.usedFallback,
  };
};

/**
 * Save flight results to cache
 */
export const cacheFlightResults = (
  searchParams: SearchParams,
  flights: Flight[],
  usedFallback?: boolean
): void => {
  const cacheKey = generateCacheKey(searchParams);
  let allEntries = getAllCacheEntries();
  
  // Add new entry
  allEntries[cacheKey] = {
    searchParams,
    flights,
    timestamp: Date.now(),
    usedFallback,
  };
  
  // Cleanup and limit
  allEntries = cleanupExpiredEntries(allEntries);
  allEntries = limitCacheSize(allEntries);
  
  saveAllCacheEntries(allEntries);
  logger.log('Cached flight results for', cacheKey);
};

/**
 * Clear all cached flight results
 */
export const clearFlightCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
    logger.log('Flight cache cleared');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = (): {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  oldestEntry: number | null;
  newestEntry: number | null;
} => {
  const allEntries = getAllCacheEntries();
  const entries = Object.values(allEntries);
  
  const validEntries = entries.filter(isCacheValid);
  const timestamps = entries.map(e => e.timestamp);
  
  return {
    totalEntries: entries.length,
    validEntries: validEntries.length,
    expiredEntries: entries.length - validEntries.length,
    oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : null,
    newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : null,
  };
};
