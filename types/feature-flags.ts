export interface FeatureFlags {
  websitePreview: boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  websitePreview: true,
};

export type FeatureFlagKey = keyof FeatureFlags;
