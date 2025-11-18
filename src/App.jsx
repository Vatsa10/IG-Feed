import React, { useState } from 'react';
import InstagramWebView from './components/InstagramWebView';

function App() {
  const [username, setUsername] = useState('instagram');
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setUsername(inputValue.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">Instagram Profile Viewer</h1>
        
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter Instagram username"
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
          <button 
            type="submit" 
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
          >
            View Profile
          </button>
        </form>

        <div className="bg-white rounded-xl overflow-hidden shadow-lg" style={{ height: '80vh' }}>
          <InstagramWebView 
            username={username} 
            style={{ height: '100%' }}
          />
        </div>
        
        <p className="text-center text-gray-500 text-sm mt-4">
          Note: This is an embedded view of Instagram. Please log in to view private profiles.
        </p>
      </div>
    </div>
  );
}

export default App;
