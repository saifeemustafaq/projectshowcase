export interface FeatureFlags {
  websitePreview: boolean;
  customGalleryTitle: string;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  websitePreview: true,
  customGalleryTitle: 'Project Gallery',
};

export type FeatureFlagKey = keyof FeatureFlags;
