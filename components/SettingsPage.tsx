'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFeatureFlags } from './FeatureFlagsProvider';
import { FeatureFlags } from '@/types/feature-flags';
import { isAuthenticated } from '@/lib/auth';
import AuthModal from './AuthModal';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { getCurrentSession } from '@/lib/auth';

interface SettingsSectionProps {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function SettingsSection({ title, description, isOpen, onToggle, children }: SettingsSectionProps) {
  return (
    <div 
      className="rounded-xl p-6 border mb-6"
      style={{ 
        backgroundColor: 'var(--card-background)',
        borderColor: 'var(--border-color)'
      }}
    >
      <button 
        onClick={onToggle}
        className="w-full text-left mb-6 flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
            {title}
          </h2>
          <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
            {description}
          </p>
        </div>
        {isOpen ? (
          <FiChevronDown className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
        ) : (
          <FiChevronRight className="w-6 h-6" style={{ color: 'var(--muted-foreground)' }} />
        )}
      </button>
      
      {isOpen && children}
    </div>
  );
}

export default function SettingsPage() {
  const { flags, loading, updateFlag, resetFlags } = useFeatureFlags();
  const [isAuthenticated_, setIsAuthenticated_] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tempGalleryTitle, setTempGalleryTitle] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const router = useRouter();

  // Section collapse states - all sections start collapsed
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  useEffect(() => {
    checkAuthentication();
    setTempGalleryTitle(flags.customGalleryTitle);
  }, [flags.customGalleryTitle]);

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

  const handleFeatureFlagChange = async (key: keyof FeatureFlags, value: boolean | string) => {
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

  const handleGalleryTitleSave = async () => {
    if (tempGalleryTitle.trim() === '') return;
    setIsUpdating(true);
    try {
      await updateFlag('customGalleryTitle', tempGalleryTitle.trim());
    } catch (error) {
      console.error('Failed to update gallery title:', error);
      alert('Failed to update gallery title. Please try again.');
      setTempGalleryTitle(flags.customGalleryTitle);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      const session = getCurrentSession();
      if (!session) {
        setPasswordError('Session expired. Please log in again.');
        return;
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
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
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p style={{ color: 'var(--muted-foreground)' }}>Loading settings...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Security Section */}
              <SettingsSection
                title="Security"
                description="Manage your authentication settings"
                isOpen={openSection === 'security'}
                onToggle={() => toggleSection('security')}
              >
                <div className="space-y-4">
                  {/* Password Change Form */}
                  <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-lg font-medium mb-4" style={{ color: 'var(--foreground)' }}>
                      Change Password
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          style={{ 
                            backgroundColor: 'var(--background)',
                            color: 'var(--foreground)',
                            borderColor: 'var(--border-color)'
                          }}
                          disabled={isChangingPassword}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                          New Password
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          style={{ 
                            backgroundColor: 'var(--background)',
                            color: 'var(--foreground)',
                            borderColor: 'var(--border-color)'
                          }}
                          disabled={isChangingPassword}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          style={{ 
                            backgroundColor: 'var(--background)',
                            color: 'var(--foreground)',
                            borderColor: 'var(--border-color)'
                          }}
                          disabled={isChangingPassword}
                        />
                      </div>
                      {passwordError && (
                        <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                      )}
                      <div className="flex justify-end mt-4">
                        <button
                          onClick={handlePasswordChange}
                          disabled={isChangingPassword}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ 
                            backgroundColor: 'var(--accent)',
                            color: 'var(--accent-foreground)'
                          }}
                        >
                          {isChangingPassword ? 'Changing Password...' : 'Change Password'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </SettingsSection>

              {/* Appearance Section */}
              <SettingsSection
                title="Appearance"
                description="Customize how the application looks"
                isOpen={openSection === 'appearance'}
                onToggle={() => toggleSection('appearance')}
              >
                <div className="space-y-4">
                  {/* Gallery Title Setting */}
                  <div className="flex items-center justify-between p-4 rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium" style={{ color: 'var(--foreground)' }}>
                        Gallery Title
                      </h3>
                      <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        Customize the title shown at the top of the project gallery
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <input
                        type="text"
                        value={tempGalleryTitle}
                        onChange={(e) => setTempGalleryTitle(e.target.value)}
                        className="px-3 py-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        style={{ 
                          backgroundColor: 'var(--background)',
                          color: 'var(--foreground)',
                          borderColor: 'var(--border-color)'
                        }}
                        disabled={isUpdating}
                      />
                      <button
                        onClick={handleGalleryTitleSave}
                        disabled={isUpdating || tempGalleryTitle.trim() === flags.customGalleryTitle}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ 
                          backgroundColor: 'var(--accent)',
                          color: 'var(--accent-foreground)'
                        }}
                      >
                        {isUpdating ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </SettingsSection>

              {/* Feature Flags Section */}
              <SettingsSection
                title="Feature Flags"
                description="Enable or disable specific features of the application"
                isOpen={openSection === 'featureFlags'}
                onToggle={() => toggleSection('featureFlags')}
              >
                <div className="space-y-4">
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
              </SettingsSection>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
