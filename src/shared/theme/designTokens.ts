/**
 * Design Tokens - Centralized constants for consistent styling
 * 
 * This file contains all the design tokens used throughout the application
 * to ensure consistent styling and easy maintenance of the design system.
 */

export const designTokens = {
  colors: {
    primary: {
      main: '#14b8a6',      // Teal/turquoise
      light: '#2dd4bf',     // Lighter variant
      dark: '#0f9688',      // Darker variant
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    secondary: {
      main: '#f59e0b',      // Accent amber
      light: '#fbbf24',     // Lighter variant
      dark: '#d97706',      // Darker variant
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    semantic: {
      success: '#10b981',   // Green for positive actions
      warning: '#f59e0b',   // Amber for warnings
      error: '#ef4444',     // Red for errors
      info: '#3b82f6',      // Blue for information
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    unit: 8,              // Base spacing unit (8px)
    xs: 4,                // 4px
    sm: 8,                // 8px
    md: 16,               // 16px
    lg: 24,               // 24px
    xl: 32,               // 32px
    xxl: 48,              // 48px
  },
  elevation: {
    card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    hover: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    tooltip: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    sm: 4,                // 4px for small elements
    md: 8,                // 8px for cards
    lg: 12,               // 12px for large containers
    xl: 16,               // 16px for very large containers
    full: '50%',          // 50% for circular elements
  },
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
} as const;

// Type definitions for better TypeScript support
export type DesignTokens = typeof designTokens;
export type ColorScale = keyof typeof designTokens.colors.primary;
export type SpacingKey = keyof typeof designTokens.spacing;
export type BorderRadiusKey = keyof typeof designTokens.borderRadius;
export type ElevationKey = keyof typeof designTokens.elevation;

// Utility functions for accessing design tokens
export const getColor = (color: keyof typeof designTokens.colors, scale?: ColorScale) => {
  const colorObj = designTokens.colors[color];
  if (scale && typeof colorObj === 'object' && scale in colorObj) {
    return (colorObj as any)[scale];
  }
  return typeof colorObj === 'string' ? colorObj : (colorObj as any).main;
};

export const getSpacing = (key: SpacingKey) => designTokens.spacing[key];
export const getBorderRadius = (key: BorderRadiusKey) => designTokens.borderRadius[key];
export const getElevation = (key: ElevationKey) => designTokens.elevation[key];