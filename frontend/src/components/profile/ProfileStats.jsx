import React from 'react';

const ProfileStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">My Notes</div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-slate-800">{stats?.notesCount || 0}</span>
          <span className="text-slate-400 text-sm mb-1 px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">Contributed</span>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Placements</div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-slate-800">{stats?.placementsCount || 0}</span>
          <span className="text-slate-400 text-sm mb-1 px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">Experiences shared</span>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Impact Score</div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-brand-orange">{stats?.totalUpvotes || 0}</span>
          <span className="text-brand-orange/60 text-sm mb-1 px-2 py-0.5 bg-brand-orangeLight rounded-full border border-orange-100">Community points</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
