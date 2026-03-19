import React from 'react';

const SkeletonCard = ({ type = 'card' }) => {
  if (type === 'list') {
    return (
      <div className="w-full h-20 bg-neutral-800 rounded-lg animate-pulse mb-4 flex items-center px-4">
        <div className="h-12 w-12 bg-neutral-700 rounded-full mr-4"></div>
        <div className="flex-1">
          <div className="h-4 w-1/2 bg-neutral-700 rounded mb-2"></div>
          <div className="h-3 w-1/4 bg-neutral-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 animate-pulse">
      <div className="flex items-center mb-4">
        <div className="h-10 w-10 bg-neutral-700 rounded-full mr-3"></div>
        <div className="flex-1">
          <div className="h-4 w-1/3 bg-neutral-700 rounded mb-2"></div>
          <div className="h-3 w-1/4 bg-neutral-700 rounded"></div>
        </div>
      </div>
      <div className="h-6 w-3/4 bg-neutral-700 rounded mb-4"></div>
      <div className="h-20 bg-neutral-700 rounded mb-4"></div>
      <div className="flex space-x-2">
        <div className="h-8 w-16 bg-neutral-700 rounded"></div>
        <div className="h-8 w-16 bg-neutral-700 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
