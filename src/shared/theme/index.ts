/**
 * Theme System Exports
 * 
 * This file provides a centralized export point for the modernized theme system,
 * including the Material-UI theme and design tokens.
 */

export { theme } from './theme';
export { 
  designTokens, 
  getColor, 
  getSpacing, 
  getBorderRadius, 
  getElevation,
  type DesignTokens,
  type ColorScale,
  type SpacingKey,
  type BorderRadiusKey,
  type ElevationKey
} from './designTokens';