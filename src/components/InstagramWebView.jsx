import { useState, useEffect, useRef } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const InstagramWebView = ({ username, style = {}, onLoad, onError }) => {
  const [loadingState, setLoadingState] = useState('loading');
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const iframeRef = useRef(null);

  // Use Instagram's embed endpoint
  const instagramUrl = `https://www.instagram.com/${username}/embed/`;

  useEffect(() => {
    // Reset state when username changes
    setLoadingState('loading');
    setError(null);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set 5-second timeout to detect load failures
    timeoutRef.current = setTimeout(() => {
      setLoadingState('error');
      setError('Instagram profile embedding is not available. Click below to view the profile directly on Instagram.');
      
      if (onError) {
        onError(new Error('Load timeout'));
      }
    }, 5000);

    // Cleanup timeout on unmount or username change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [username, onError]);

  const handleIframeLoad = () => {
    // Clear timeout on successful load
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoadingState('success');
    setError(null);

    if (onLoad) {
      onLoad();
    }
  };

  const handleIframeError = () => {
    // Clear timeout on error
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setLoadingState('error');
    setError('Unable to load Instagram content. The profile may not be available or Instagram may be blocking the embed');
    console.error('Instagram iframe failed to load');

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
      {/* Loading State */}
      {loadingState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
          <LoadingSpinner message="Loading profile..." size="lg" />
        </div>
      )}

      {/* Error State */}
      {loadingState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4">
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            showRetry={true}
          />
          {/* Fallback link */}
          <div className="mt-4 text-center">
            <a
              href={`https://www.instagram.com/${username}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
            >
              Open profile in new tab
            </a>
          </div>
        </div>
      )}

      {/* Iframe using Instagram's embed endpoint */}
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
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          visibility: loadingState === 'success' ? 'visible' : 'hidden',
          position: loadingState === 'success' ? 'relative' : 'absolute'
        }}
        title={`Instagram profile for ${username}`}
      />
    </div>
  );
};

export default InstagramWebView;
