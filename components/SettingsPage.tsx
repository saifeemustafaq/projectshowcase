'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFeatureFlags } from './FeatureFlagsProvider';
import { FeatureFlags } from '@/types/feature-flags';
import { isAuthenticated } from '@/lib/auth';
import AuthModal from './AuthModal';

export default function SettingsPage() {
  const { flags, loading, updateFlag, resetFlags } = useFeatureFlags();
  const [isAuthenticated_, setIsAuthenticated_] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    if (typeof window !== 'undefined') {
      const authenticated = isAuthenticated();
      setIsAuthenticated_(authenticated);
      if (!authenticated) {
        setShowAuthModal(true);
      }
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated_(true);
    setShowAuthModal(false);
  };

  const handleBack = () => {
    router.back();
  };

  const handleFeatureFlagChange = async (key: keyof FeatureFlags, value: boolean) => {
    setIsUpdating(true);
    try {
      await updateFlag(key, value);
    } catch (error) {
      console.error('Failed to update feature flag:', error);
      alert('Failed to update setting. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetFlags = async () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setIsUpdating(true);
      try {
        await resetFlags();
      } catch (error) {
        console.error('Failed to reset feature flags:', error);
        alert('Failed to reset settings. Please try again.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (!isAuthenticated_) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
              Authentication Required
            </h1>
            <p style={{ color: 'var(--muted-foreground)' }}>
              You need to be authenticated to access settings.
            </p>
          </div>
        </div>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => router.push('/projects')}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--card-background)' }}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
                Settings
              </h1>
              <p className="mt-3 text-lg" style={{ color: 'var(--muted-foreground)' }}>
                Configure your application preferences
              </p>
            </div>
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{ 
                backgroundColor: 'var(--secondary)', 
                color: 'var(--secondary-foreground)' 
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Feature Flags Section */}
          <div 
            className="rounded-xl p-6 border"
            style={{ 
              backgroundColor: 'var(--card-background)',
              borderColor: 'var(--border-color)'
            }}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
                Feature Flags
              </h2>
              <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
                Enable or disable specific features of the application
              </p>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                    <p style={{ color: 'var(--muted-foreground)' }}>Loading settings...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Website Preview Feature Flag */}
                  <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>
                        Website Preview
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Show live website previews in project cards and modals. When disabled, projects will display without preview functionality.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={flags.websitePreview}
                        onChange={(e) => handleFeatureFlagChange('websitePreview', e.target.checked)}
                        disabled={isUpdating}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* Reset Section */}
            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>
                    Reset Settings
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    Reset all feature flags to their default values
                  </p>
                </div>
                <button
                  onClick={handleResetFlags}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg font-medium border transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: 'var(--border-color)',
                    color: 'var(--foreground)',
                    backgroundColor: 'transparent'
                  }}
                >
                  {isUpdating ? 'Resetting...' : 'Reset to Defaults'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
