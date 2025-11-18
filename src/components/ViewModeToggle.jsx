/**
 * ViewModeToggle component to switch between embed and proxy viewing modes
 * @param {Object} props - Component props
 * @param {string} props.mode - Current viewing mode ('embed' or 'proxy')
 * @param {Function} props.onModeChange - Callback when mode changes
 */
export default function ViewModeToggle({ mode, onModeChange }) {
  return (
    <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-lg p-1 transition-colors duration-300">
      <button
        onClick={() => onModeChange('embed')}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${mode === 'embed'
            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }
        `}
        aria-label="Switch to embed mode"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Embed Mode</span>
        </div>
      </button>
      
      <button
        onClick={() => onModeChange('proxy')}
        className={`
          px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
          ${mode === 'proxy'
            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }
        `}
        aria-label="Switch to proxy mode"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <span>Proxy Mode</span>
        </div>
      </button>
    </div>
  );
}
