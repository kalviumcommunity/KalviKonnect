import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorBanner = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
        <span>{message || 'Something went wrong. Please try again.'}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded border border-red-500/50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorBanner;
