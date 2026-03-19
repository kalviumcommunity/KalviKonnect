import React from 'react';
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react';

const PlacementCard = ({ placement }) => {
  const { companyName, role, location, salary, experience, author } = placement;

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all flex flex-col md:flex-row md:items-center gap-6 shadow-lg">
      <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-700">
        <Briefcase className="w-8 h-8 text-blue-500" />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white uppercase tracking-tight">{companyName}</h3>
          <span className="text-xs font-semibold px-2 py-1 bg-neutral-700 text-gray-400 rounded uppercase">
            {role}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1.5" />
            {location || 'Remote'}
          </div>
          {salary && (
            <div className="flex items-center text-emerald-500 font-semibold">
              <DollarSign className="w-4 h-4 mr-1" />
              {salary}
            </div>
          )}
        </div>
        
        <p className="text-gray-400 text-sm line-clamp-2 italic">
          "{experience?.substring(0, 100)}..."
        </p>
      </div>

      <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 pl-0 md:pl-6 md:border-l border-neutral-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Shared by</p>
          <p className="text-sm font-medium text-white">{author?.name || 'Fellow Kalvian'}</p>
        </div>
        <button className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PlacementCard;
