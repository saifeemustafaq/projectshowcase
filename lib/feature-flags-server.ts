import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from '@/types/feature-flags';
import { getDatabase } from './mongodb';

const FEATURE_FLAGS_ID = 'app_feature_flags';

/**
 * Server-side function to get feature flags from MongoDB
 */
export async function getFeatureFlagsServer(): Promise<FeatureFlags> {
  try {
    const db = await getDatabase();
    const collection = db.collection('settings');
    
    const document = await collection.findOne({ id: FEATURE_FLAGS_ID });
    
    if (!document) {
      // If no flags exist, create default ones
      await setFeatureFlagsServer(DEFAULT_FEATURE_FLAGS);
      return DEFAULT_FEATURE_FLAGS;
    }
    
    // Merge with defaults to ensure all flags are present
    return { ...DEFAULT_FEATURE_FLAGS, ...document.flags };
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return DEFAULT_FEATURE_FLAGS;
  }
}

/**
 * Server-side function to set feature flags in MongoDB
 */
export async function setFeatureFlagsServer(flags: FeatureFlags): Promise<void> {
  try {
    const db = await getDatabase();
    const collection = db.collection('settings');
    
    await collection.replaceOne(
      { id: FEATURE_FLAGS_ID },
      { 
        id: FEATURE_FLAGS_ID,
        flags,
        updatedAt: new Date()
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error saving feature flags:', error);
    throw error;
  }
}

/**
 * Server-side function to update a single feature flag
 */
export async function updateFeatureFlagServer(key: keyof FeatureFlags, value: boolean | string): Promise<void> {
  try {
    const currentFlags = await getFeatureFlagsServer();
    const updatedFlags = { ...currentFlags, [key]: value };
    await setFeatureFlagsServer(updatedFlags);
  } catch (error) {
    console.error('Error updating feature flag:', error);
    throw error;
  }
}
