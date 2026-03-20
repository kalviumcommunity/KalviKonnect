import React from 'react';
import { Briefcase, MapPin, DollarSign, ExternalLink } from 'lucide-react';

const PlacementCard = ({ placement }) => {
  const { companyName, role, location, salary, experience, author } = placement;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500/50 transition-all flex flex-col md:flex-row md:items-center gap-6 shadow-sm hover:shadow-md">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner">
        <Briefcase className="w-8 h-8 text-blue-600" />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{companyName}</h3>
          <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase tracking-wider border border-slate-200">
            {role}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
            {location || 'Remote'}
          </div>
          {salary && (
            <div className="flex items-center text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
              <DollarSign className="w-4 h-4 mr-0.5" />
              {salary}
            </div>
          )}
        </div>
        
        <p className="text-slate-500 text-sm line-clamp-2 italic leading-relaxed">
          "{experience?.substring(0, 100)}..."
        </p>
      </div>

      <div className="flex md:flex-col items-center justify-between md:justify-center gap-4 pl-0 md:pl-6 md:border-l border-slate-100">
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Shared by</p>
          <p className="text-sm font-bold text-slate-900">{author?.name || 'Fellow Kalvian'}</p>
        </div>
        <button className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm active:scale-95">
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PlacementCard;
