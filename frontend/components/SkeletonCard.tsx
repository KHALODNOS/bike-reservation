import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="h-56 bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col space-y-4">
        <div className="flex justify-between">
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        </div>
        
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="space-y-2">
             <div className="h-3 bg-gray-200 rounded w-10"></div>
             <div className="h-5 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-9 bg-gray-200 rounded-lg w-24"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;