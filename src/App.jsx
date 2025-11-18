import { useState } from 'react';
import InstagramWebView from './components/InstagramWebView';
import SearchForm from './components/SearchForm';
import ThemeToggle from './components/ThemeToggle';
import DeviceFrame from './components/DeviceFrame';

function App() {
  const [username, setUsername] = useState('instagram');
  const [isLoading, setIsLoading] = useState(false);

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
        <div className="mb-8">
          <SearchForm 
            onSearch={handleSearch} 
            isLoading={isLoading}
            initialValue={username}
          />
        </div>

        {/* Instagram WebView in Device Frame */}
        <DeviceFrame>
          <InstagramWebView 
            username={username} 
            style={{ height: '100%', width: '100%' }}
            onLoad={handleLoad}
            onError={handleError}
          />
        </DeviceFrame>
        
        {/* Footer note */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6 transition-colors duration-300">
          Note: This is an embedded view of Instagram. Some content may not be available due to browser restrictions.
        </p>
      </div>
    </div>
  );
}

export default App;
