const LoadingSpinner = ({ message, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${spinnerSize} border-blue-500 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
