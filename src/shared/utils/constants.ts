// Application constants
export const APP_NAME = 'Flight Search Engine';

// API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 5000,
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const;