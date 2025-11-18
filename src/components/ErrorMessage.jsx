/**
 * ErrorMessage component displays error messages with optional retry functionality
 * Styled with appropriate error colors and icons for theme compatibility
 */
export default function ErrorMessage({ message, onRetry, showRetry = true }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 max-w-md mx-auto">
      {/* Error icon */}
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-600 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      {/* Error message */}
      <p className="text-center text-gray-800 dark:text-gray-200 text-base">
        {message}
      </p>

      {/* Retry button */}
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-w-[120px] min-h-[44px]"
          aria-label="Try again"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
