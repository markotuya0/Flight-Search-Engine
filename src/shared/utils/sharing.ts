/**
 * Sharing utilities for generating shareable URLs and copying to clipboard
 */

import type { Flight } from '../../features/flightSearch/domain/types';

/**
 * Generate a shareable URL for a flight
 * @param flight - The flight to share
 * @returns Shareable URL string
 */
export const generateShareUrl = (flight: Flight): string => {
  const params = new URLSearchParams({
    flightId: flight.id,
    origin: flight.origin.code,
    destination: flight.destination.code,
    date: flight.departAt,
    price: flight.priceTotal.toString(),
    airline: flight.airlineCodes.join(','),
  });
  
  return `${window.location.origin}/share?${params.toString()}`;
};

/**
 * Copy text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};

/**
 * Generate a shareable message for a flight
 * @param flight - The flight to share
 * @returns Formatted message string
 */
export const generateShareMessage = (flight: Flight): string => {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return `Check out this flight I found!
${flight.origin.code} → ${flight.destination.code}
${formatDate(flight.departAt)}
${flight.airlineCodes.join(', ')} - ${formatPrice(flight.priceTotal, flight.currency)}
${generateShareUrl(flight)}`;
};
