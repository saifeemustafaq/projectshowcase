'use client';

import { useState } from 'react';
import { verifyPassword, createSession } from '@/lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const isValid = await verifyPassword(password);
      if (isValid) {
        createSession();
        onSuccess();
        onClose();
        setPassword('');
      } else {
        setError('Invalid password. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="rounded-2xl shadow-2xl max-w-md w-full border"
        style={{ 
          backgroundColor: 'var(--card-background)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>
              Enter Password
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="mb-6 text-lg" style={{ color: 'var(--muted-foreground)' }}>
            Please enter the password to access edit mode.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                style={{ 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)',
                  borderColor: 'var(--border-color)'
                }}
                required
                autoFocus
              />
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 rounded-lg font-medium border transition-all duration-200 hover:scale-105"
                style={{ 
                  borderColor: 'var(--border-color)',
                  color: 'var(--foreground)'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !password.trim()}
                className="flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ 
                  backgroundColor: 'var(--accent)', 
                  color: 'var(--accent-foreground)' 
                }}
              >
                {isLoading ? 'Verifying...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
