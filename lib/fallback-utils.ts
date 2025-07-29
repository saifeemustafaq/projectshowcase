/**
 * Utility functions for handling fallback images
 */

const FALLBACK_IMAGES = [
  '/assets/fallbacks/1.jpg',
  '/assets/fallbacks/2.jpg',
  '/assets/fallbacks/3.jpg',
];

/**
 * Get a random fallback image from the available set
 * Uses a deterministic approach based on project ID to ensure consistency
 */
export function getRandomFallbackImage(seed?: string): string {
  if (seed) {
    // Use seed to generate consistent random selection for same project
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const index = Math.abs(hash) % FALLBACK_IMAGES.length;
    return FALLBACK_IMAGES[index];
  }
  
  // True random selection
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  return FALLBACK_IMAGES[randomIndex];
}

/**
 * Check if a URL is valid
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.trim() === '') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
