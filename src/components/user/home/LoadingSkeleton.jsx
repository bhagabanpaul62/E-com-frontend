const LoadingSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner Skeleton */}
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-300 animate-pulse"></div>

      {/* Content Skeletons */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4 sm:space-y-6">
        {/* Categories Skeleton */}
        <div className="bg-white rounded-lg p-4 sm:p-6">
          <div className="h-4 sm:h-6 bg-gray-300 rounded w-32 sm:w-48 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-300 rounded-full mx-auto mb-2 animate-pulse"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Products Skeleton */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg p-4 sm:p-6">
            <div className="h-4 sm:h-6 bg-gray-300 rounded w-48 sm:w-64 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-lg p-2 sm:p-3">
                  <div className="aspect-square bg-gray-300 rounded mb-2 sm:mb-3 animate-pulse"></div>
                  <div className="h-3 sm:h-4 bg-gray-300 rounded mb-1 sm:mb-2 animate-pulse"></div>
                  <div className="h-4 sm:h-6 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
