import { useState, useEffect } from 'react';
import { validateUsername } from '../utils/validation';

/**
 * SearchForm component for Instagram username search with validation
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback function when form is submitted with valid username
 * @param {boolean} props.isLoading - Whether the search is currently loading
 * @param {string} props.initialValue - Initial value for the input field
 */
export default function SearchForm({ onSearch, isLoading = false, initialValue = '' }) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [validationError, setValidationError] = useState(null);

  // Update input value when initialValue prop changes
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate username
    const validation = validateUsername(inputValue);
    
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }
    
    // Clear any previous validation errors
    setValidationError(null);
    
    // Call the onSearch callback with the valid username
    onSearch(inputValue.trim());
  };

  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter Instagram username"
            disabled={isLoading}
            className={`
              flex-1 px-4 py-3 rounded-lg
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              border-2 border-gray-300 dark:border-gray-600
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:border-blue-500 dark:focus:border-blue-400
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              ${validationError ? 'border-red-500 dark:border-red-400' : ''}
            `}
            aria-label="Instagram username"
            aria-invalid={validationError ? 'true' : 'false'}
            aria-describedby={validationError ? 'username-error' : undefined}
          />
          
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={`
              px-6 py-3 min-w-[120px] min-h-[44px]
              bg-blue-600 hover:bg-blue-700 active:bg-blue-800
              dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700
              text-white font-medium rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600
              dark:disabled:hover:bg-blue-500
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900
            `}
            aria-label="Search Instagram profile"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {validationError && (
          <div
            id="username-error"
            className="text-red-600 dark:text-red-400 text-sm px-1"
            role="alert"
          >
            {validationError}
          </div>
        )}
      </div>
    </form>
  );
}
