import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * InstagramProxyView component that fetches full Instagram HTML via Puppeteer proxy
 * @param {Object} props - Component props
 * @param {string} props.username - Instagram username to fetch
 * @param {Object} props.style - Additional styles
 * @param {Function} props.onLoad - Callback when content loads
 * @param {Function} props.onError - Callback when error occurs
 */
export default function InstagramProxyView({ username, style = {}, onLoad, onError }) {
  const [loadingState, setLoadingState] = useState('loading');
  const [error, setError] = useState(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchInstagramContent = async () => {
      setLoadingState('loading');
      setError(null);
      setHtmlContent('');

      try {
        console.log('Fetching Instagram content for:', username);
        
        const response = await fetch(`http://localhost:5000/api/instagram/${username}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        setHtmlContent(html);
        setLoadingState('success');
        
        if (onLoad) {
          onLoad();
        }
      } catch (err) {
        console.error('Error fetching Instagram content:', err);
        setError('Failed to load Instagram profile. Make sure the proxy server is running (npm run server).');
        setLoadingState('error');
        
        if (onError) {
          onError(err);
        }
      }
    };

    if (username) {
      fetchInstagramContent();
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
          <LoadingSpinner message="Loading full Instagram profile..." size="lg" />
          <p className="absolute bottom-20 text-sm text-gray-500 dark:text-gray-400">
            This may take 15-30 seconds...
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

      {/* Full HTML Content with proxied resources */}
      {loadingState === 'success' && htmlContent && (
        <iframe
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
          title={`Instagram profile for ${username}`}
        />
      )}
    </div>
  );
}
