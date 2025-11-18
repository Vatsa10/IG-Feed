import { useState } from 'react';
import InstagramWebView from './components/InstagramWebView';
import InstagramProxyView from './components/InstagramProxyView';
import SearchForm from './components/SearchForm';
import ThemeToggle from './components/ThemeToggle';
import ViewModeToggle from './components/ViewModeToggle';
import DeviceFrame from './components/DeviceFrame';

function App() {
  const [username, setUsername] = useState('instagram');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('embed'); // 'embed' or 'proxy'

  const handleSearch = (searchUsername) => {
    setUsername(searchUsername);
    setIsLoading(true);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
  };

  const handleModeChange = (mode) => {
    setViewMode(mode);
    setIsLoading(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Main container with max width and responsive padding */}
      <div className="max-w-[1200px] mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Header with title and theme toggle */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center md:text-left text-black dark:text-white">
            Instagram Profile Viewer
          </h1>
          <ThemeToggle />
        </header>

        {/* Search form */}
        <div className="mb-6">
          <SearchForm 
            onSearch={handleSearch} 
            isLoading={isLoading}
            initialValue={username}
          />
        </div>

        {/* View Mode Toggle */}
        <div className="mb-8 flex justify-center">
          <ViewModeToggle mode={viewMode} onModeChange={handleModeChange} />
        </div>

        {/* Instagram WebView in Device Frame */}
        <DeviceFrame>
          {viewMode === 'embed' ? (
            <InstagramWebView 
              username={username} 
              style={{ height: '100%', width: '100%' }}
              onLoad={handleLoad}
              onError={handleError}
            />
          ) : (
            <InstagramProxyView 
              username={username} 
              style={{ height: '100%', width: '100%' }}
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </DeviceFrame>
        
        {/* Footer note */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6 transition-colors duration-300">
          {viewMode === 'embed' 
            ? 'Note: Embed mode shows limited posts. Switch to Proxy mode for full profile access.'
            : 'Note: Proxy mode requires the backend server to be running (npm run server).'}
        </p>
      </div>
    </div>
  );
}

export default App;
