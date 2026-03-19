import React from 'react';
import { Database, Plus } from 'lucide-react';

const EmptyState = ({ title, message, onAction, actionLabel }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-800/50 rounded-2xl border-2 border-dashed border-neutral-700">
      <div className="bg-neutral-700/50 p-4 rounded-full mb-4">
        <Database className="w-8 h-8 text-neutral-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title || 'No results found'}</h3>
      <p className="text-gray-400 max-w-sm mb-6">
        {message || "We couldn't find any data here. Be the first to add something!"}
      </p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
