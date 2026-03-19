import React from 'react';

const LoadingSpinner = ({ size = 'h-8 w-8', text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-blue-500 ${size}`}></div>
      {text && <p className="mt-4 text-gray-400 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
