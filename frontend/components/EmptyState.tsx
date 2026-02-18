import React from 'react';
import { SearchX } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-dashed border-gray-200">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <SearchX className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">No bikes found</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        Sorry, we couldn't find any bikes matching your current search filters. Try changing the city or bike type.
      </p>
      <button 
        onClick={() => window.location.reload()} // Simple reload or reset action
        className="mt-6 text-green-600 font-medium hover:text-green-700"
      >
        Clear all filters
      </button>
    </div>
  );
};

export default EmptyState;