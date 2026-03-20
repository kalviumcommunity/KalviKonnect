import React from 'react';
import { Home, Globe } from 'lucide-react';

const FeedTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 w-fit">
      <button
        onClick={() => onTabChange('college')}
        className={`flex items-center px-6 py-2 rounded-xl text-sm font-bold transition-all ${
          activeTab === 'college'
            ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-4 h-4 mr-2" />
        My College
      </button>
      <button
        onClick={() => onTabChange('network')}
        className={`flex items-center px-6 py-2 rounded-xl text-sm font-bold transition-all ${
          activeTab === 'network'
            ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Globe className="w-4 h-4 mr-2" />
        Kalvium Network
      </button>
    </div>
  );
};

export default FeedTabs;
