import { useState, useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const InstagramWebView = ({ username, style = {}, onLoad, onError }) => {
  const [loadingState, setLoadingState] = useState('loading');
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const iframeRef = useRef(null);
  const loadedRef = useRef(false);

  // Use Instagram's embed endpoint
  const instagramUrl = `https://www.instagram.com/${username}/embed/`;

  useEffect(() => {
    // Reset state when username changes
    console.log('Username changed to:', username);
    setLoadingState('loading');
    setError(null);
    loadedRef.current = false;

    // Clear any existing timeout
    if (timeoutRef.current) {
      console.log('Clearing existing timeout');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Set 20-second timeout to detect load failures
    timeoutRef.current = setTimeout(() => {
      console.log('Timeout reached for username:', username, 'loadedRef.current:', loadedRef.current);
      if (!loadedRef.current) {
        setLoadingState('error');
        setError('Instagram profile embedding is not available. Click below to view the profile directly on Instagram.');
        
        if (onError) {
          onError(new Error('Load timeout'));
        }
      }
    }, 20000);

    // Cleanup timeout on unmount or username change
    return () => {
      if (timeoutRef.current) {
        console.log('Cleanup: clearing timeout');
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [username]);

  const handleIframeLoad = () => {
    console.log('Iframe onLoad fired for username:', username);
    loadedRef.current = true;
    
    // Clear timeout on successful load
    if (timeoutRef.current) {
      console.log('Clearing timeout after successful load');
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Small delay to ensure iframe content is rendered before hiding overlay
    setTimeout(() => {
      console.log('Setting loadingState to success');
      setLoadingState('success');
      setError(null);

      if (onLoad) {
        onLoad();
      }
    }, 500);
  };

  const handleIframeError = (e) => {
    console.error('Iframe onError fired:', e);
    
    // Clear timeout on error
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoadingState('error');
    setError('Unable to load Instagram content. The profile may not be available or Instagram may be blocking the embed');

    if (onError) {
      onError(new Error('Iframe load error'));
    }
  };

  const handleRetry = () => {
    setLoadingState('loading');
    setError(null);

    // Force iframe reload by updating key
    if (iframeRef.current) {
      iframeRef.current.src = instagramUrl;
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setLoadingState('error');
      setError('Loading is taking longer than expected. The profile may not be available');
    }, 15000);
  };

  return (
    <div style={{ width: '100%', height: '100%', ...style }} className="relative">
      {/* Iframe using Instagram's embed endpoint - always rendered */}
      <iframe
        key={username}
        ref={iframeRef}
        src={instagramUrl}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        allow="encrypted-media"
        loading="eager"
        referrerPolicy="no-referrer-when-downgrade"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
        title={`Instagram profile for ${username}`}
      />

      {/* Loading State Overlay */}
      {loadingState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
          <LoadingSpinner message="Loading profile..." size="lg" />
        </div>
      )}

      {/* Error State Overlay */}
      {loadingState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4 z-10">
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            showRetry={true}
          />
          {/* Fallback link */}
          <div className="mt-4 text-center">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
            >
              Open profile in new tab
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstagramWebView;
