'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from '@/types/feature-flags';
import { getFeatureFlags, updateFeatureFlag, setFeatureFlags } from '@/lib/feature-flags';

interface FeatureFlagsContextType {
  flags: FeatureFlags;
  loading: boolean;
  updateFlag: (key: keyof FeatureFlags, value: boolean | string) => Promise<void>;
  resetFlags: () => Promise<void>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      setLoading(true);
      const currentFlags = await getFeatureFlags();
      setFlags(currentFlags);
    } catch (error) {
      console.error('Error loading feature flags:', error);
      setFlags(DEFAULT_FEATURE_FLAGS);
    } finally {
      setLoading(false);
    }
  };

  const updateFlag = async (key: keyof FeatureFlags, value: boolean | string) => {
    try {
      const updatedFlags = await updateFeatureFlag(key, value);
      setFlags(updatedFlags);
    } catch (error) {
      console.error('Error updating feature flag:', error);
      // Revert to current state on error
      await loadFlags();
    }
  };

  const resetFlags = async () => {
    try {
      await setFeatureFlags(DEFAULT_FEATURE_FLAGS);
      setFlags(DEFAULT_FEATURE_FLAGS);
    } catch (error) {
      console.error('Error resetting feature flags:', error);
    }
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, loading, updateFlag, resetFlags }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
}
