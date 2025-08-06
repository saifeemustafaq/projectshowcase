'use client';

import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from '@/types/feature-flags';

/**
 * Client-side function to get feature flags from the API
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    const response = await fetch('/api/feature-flags');
    if (!response.ok) {
      throw new Error('Failed to fetch feature flags');
    }
    const flags = await response.json();
    return { ...DEFAULT_FEATURE_FLAGS, ...flags };
  } catch (error) {
    console.error('Error loading feature flags:', error);
    return DEFAULT_FEATURE_FLAGS;
  }
}

/**
 * Client-side function to update feature flags via API
 */
export async function setFeatureFlags(flags: FeatureFlags): Promise<void> {
  try {
    const response = await fetch('/api/feature-flags', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(flags),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update feature flags');
    }
  } catch (error) {
    console.error('Error saving feature flags:', error);
    throw error;
  }
}

/**
 * Client-side function to update a single feature flag
 */
export async function updateFeatureFlag(key: keyof FeatureFlags, value: boolean): Promise<FeatureFlags> {
  const currentFlags = await getFeatureFlags();
  const updatedFlags = { ...currentFlags, [key]: value };
  await setFeatureFlags(updatedFlags);
  return updatedFlags;
}
