import React from 'react';
import { Home, Globe } from 'lucide-react';

const FeedTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-neutral-800 p-1.5 rounded-2xl border border-neutral-700 w-fit">
      <button
        onClick={() => onTabChange('college')}
        className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all ${
          activeTab === 'college'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : 'text-gray-400 hover:text-white hover:bg-neutral-700'
        }`}
      >
        <Home className="w-4 h-4 mr-2" />
        My College
      </button>
      <button
        onClick={() => onTabChange('network')}
        className={`flex items-center px-6 py-2.5 rounded-xl font-bold transition-all ${
          activeTab === 'network'
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
            : 'text-gray-400 hover:text-white hover:bg-neutral-700'
        }`}
      >
        <Globe className="w-4 h-4 mr-2" />
        Kalvium Network
      </button>
    </div>
  );
};

export default FeedTabs;
