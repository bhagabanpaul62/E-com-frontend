const EmptyState = ({ onRefresh }) => {
  return (
    <div className="bg-white mx-4 my-6 rounded-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-gray-500 text-lg mb-6">
          No products available at the moment
        </div>
        <button
          onClick={onRefresh}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
