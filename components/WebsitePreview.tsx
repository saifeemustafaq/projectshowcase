'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getRandomFallbackImage, isValidUrl } from '@/lib/fallback-utils';

interface WebsitePreviewProps {
  url: string;
  title: string;
  className?: string;
  projectId?: string;
  useFallbackImage?: boolean;
}

export default function WebsitePreview({ url, title, className = "", projectId, useFallbackImage = false }: WebsitePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [backgroundRetrying, setBackgroundRetrying] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 5000; // 5 seconds
  const LOAD_TIMEOUT = 10000; // 10 seconds timeout for iframe loading

  // Get fallback image from random selection
  const fallbackImage = getRandomFallbackImage(projectId || title);

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  const retryLoad = useCallback(() => {
    if (retryCount < MAX_RETRY_ATTEMPTS && isValidUrl(url)) {
      setBackgroundRetrying(true);
      retryTimeoutRef.current = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsLoading(true);
        setHasError(false);
        setShowFallback(false);
        
        // Force iframe reload by changing src
        if (iframeRef.current) {
          const currentSrc = iframeRef.current.src;
          iframeRef.current.src = '';
          setTimeout(() => {
            if (iframeRef.current) {
              iframeRef.current.src = currentSrc;
              // Start timeout for retry attempt  
              clearLoadTimeout();
              loadTimeoutRef.current = setTimeout(() => {
                setIsLoading(currentLoading => {
                  if (currentLoading) {
                    setHasError(true);
                    setShowFallback(true);
                    return false;
                  }
                  return currentLoading;
                });
              }, LOAD_TIMEOUT);
            }
          }, 100);
        }
      }, RETRY_DELAY);
    } else {
      setBackgroundRetrying(false);
    }
  }, [retryCount, url, clearLoadTimeout]);

  const startLoadTimeout = useCallback(() => {
    clearLoadTimeout();
    loadTimeoutRef.current = setTimeout(() => {
      // Use a state check function to get current values
      setIsLoading(currentLoading => {
        if (currentLoading) {
          // Still loading after timeout, treat as error
          setHasError(true);
          setShowFallback(true);
          return false;
        }
        return currentLoading;
      });
    }, LOAD_TIMEOUT);
  }, [clearLoadTimeout]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setShowFallback(false);
    setRetryCount(0);
    setBackgroundRetrying(false);
    clearRetryTimeout();
    clearLoadTimeout();
    
    // Start load timeout when URL changes
    if (url && isValidUrl(url)) {
      startLoadTimeout();
    }
  }, [url, clearRetryTimeout, clearLoadTimeout, startLoadTimeout]);

  useEffect(() => {
    return () => {
      clearRetryTimeout();
      clearLoadTimeout();
    };
  }, [clearRetryTimeout, clearLoadTimeout]);

  const handleIframeLoad = () => {
    // Check if iframe actually loaded content or if it's blocked
    if (iframeRef.current) {
      try {
        // Try to access iframe content to detect if it's actually loaded
        // Accessing the document will throw if cross-origin, which is what we want
        void (iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document);
        
        // If we can't access the document, it might be cross-origin but still loaded
        // Check if the iframe has actually navigated to the URL
        if (iframeRef.current.contentWindow && iframeRef.current.src) {
          // Add a small delay to check if content actually loaded
          setTimeout(() => {
            if (iframeRef.current) {
              try {
                // Check if the iframe is still at about:blank or failed to load
                const currentLocation = iframeRef.current.contentWindow?.location.href;
                if (currentLocation === 'about:blank' || currentLocation === '') {
                  handleIframeError();
                  return;
                }
              } catch {
                // Cross-origin error is expected for successful loads
              }
            }
          }, 2000);
        }
      } catch {
        // Cross-origin error is expected for successful loads
      }
    }
    
    setIsLoading(false);
    setHasError(false);
    setShowFallback(false);
    setBackgroundRetrying(false);
    clearRetryTimeout();
    clearLoadTimeout();
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    setShowFallback(true);
    clearLoadTimeout();
    
    // Start background retrying if demo URL exists and we haven't exceeded retry limit
    if (isValidUrl(url) && retryCount < MAX_RETRY_ATTEMPTS) {
      retryLoad();
    }
  };

  const handleFallbackImageError = () => {
    // If fallback image fails, don't show it
    setShowFallback(false);
  };

  // If user opted for fallback image or no valid demo URL, show fallback immediately (no retry)
  if (useFallbackImage || !url || !isValidUrl(url)) {
    return (
      <div className={`relative bg-gray-200 flex items-center justify-center ${className}`}>
        <Image
          src={fallbackImage}
          alt={title}
          fill
          className="object-cover"
          onError={handleFallbackImageError}
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {useFallbackImage ? 'Fallback Image' : 'No Demo URL'}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading State */}
      {isLoading && !showFallback && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Fallback Image State */}
      {showFallback && (
        <div className="absolute inset-0 z-5">
          <Image
            src={fallbackImage}
            alt={title}
            fill
            className="object-cover"
            onError={handleFallbackImageError}
          />
          {/* Background retry indicator */}
          {backgroundRetrying && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
              Retrying...
            </div>
          )}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {backgroundRetrying ? 'Loading...' : 'Preview Failed'}
          </div>
        </div>
      )}

      {/* Error State without Fallback (shouldn't happen with new logic) */}
      {hasError && !showFallback && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <p className="text-sm">Preview Unavailable</p>
            <p className="text-xs text-gray-400 mt-1">
              Site may not allow embedding
            </p>
          </div>
        </div>
      )}

      {/* Website Preview Iframe */}
      <iframe
        ref={iframeRef}
        src={url}
        title={`Preview of ${title}`}
        className={`w-full h-full border-0 transition-opacity duration-300 ${
          isLoading || hasError ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{
          transform: 'scale(0.75)',
          transformOrigin: '0 0',
          width: '133.33%',
          height: '133.33%',
        }}
      />

      {/* Overlay for interaction blocking */}
      <div className="absolute inset-0 bg-transparent cursor-pointer" />

      {/* Preview Label - only show when iframe is successfully loaded */}
      {!isLoading && !hasError && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          Live Preview
        </div>
      )}
    </div>
  );
}
