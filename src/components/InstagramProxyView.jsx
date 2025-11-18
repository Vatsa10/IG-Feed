import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * InstagramProxyView component that fetches Instagram screenshot via Puppeteer proxy
 * @param {Object} props - Component props
 * @param {string} props.username - Instagram username to fetch
 * @param {Object} props.style - Additional styles
 * @param {Function} props.onLoad - Callback when content loads
 * @param {Function} props.onError - Callback when error occurs
 */
export default function InstagramProxyView({ username, style = {}, onLoad, onError }) {
  const [loadingState, setLoadingState] = useState('loading');
  const [error, setError] = useState(null);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchInstagramScreenshot = async () => {
      setLoadingState('loading');
      setError(null);
      setScreenshotUrl('');

      try {
        console.log('Fetching Instagram screenshot for:', username);
        
        // Use screenshot endpoint to avoid CORS issues
        const url = `http://localhost:5000/api/instagram/${username}/screenshot?t=${Date.now()}`;
        
        // Test if server is reachable
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        setScreenshotUrl(url);
        setLoadingState('success');
        
        if (onLoad) {
          onLoad();
        }
      } catch (err) {
        console.error('Error fetching Instagram screenshot:', err);
        setError('Failed to load Instagram profile. Make sure the proxy server is running (npm run server).');
        setLoadingState('error');
        
        if (onError) {
          onError(err);
        }
      }
    };

    if (username) {
      fetchInstagramScreenshot();
    }
  }, [username, refreshKey, onLoad, onError]);

  const handleRetry = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ width: '100%', height: '100%', ...style }} className="relative bg-white dark:bg-gray-900">
      {/* Loading State */}
      {loadingState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
          <LoadingSpinner message="Capturing Instagram profile..." size="lg" />
          <p className="absolute bottom-20 text-sm text-gray-500 dark:text-gray-400">
            This may take 10-20 seconds...
          </p>
        </div>
      )}

      {/* Error State */}
      {loadingState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 p-4 z-10">
          <ErrorMessage
            message={error}
            onRetry={handleRetry}
            showRetry={true}
          />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Make sure the proxy server is running:
            </p>
            <code className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
              npm run server
            </code>
          </div>
          <div className="mt-4 text-center">
            <a
              href={`https://www.instagram.com/${username}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
            >
              Open profile on Instagram
            </a>
          </div>
        </div>
      )}

      {/* Screenshot Image */}
      {loadingState === 'success' && screenshotUrl && (
        <div className="w-full h-full overflow-auto bg-white dark:bg-gray-900 flex items-start justify-center p-4">
          <img 
            src={screenshotUrl}
            alt={`Instagram profile for ${username}`}
            className="max-w-full h-auto shadow-lg rounded-lg"
            onError={() => {
              setError('Failed to load screenshot');
              setLoadingState('error');
            }}
          />
        </div>
      )}
    </div>
  );
}
