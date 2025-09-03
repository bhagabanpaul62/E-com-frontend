const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-6 sm:p-8 text-center shadow-lg max-w-sm sm:max-w-md w-full">
        <div className="text-red-600 text-base sm:text-lg mb-4 sm:mb-6">
          {error}
        </div>
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto text-sm sm:text-base font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
