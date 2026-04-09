import React, { useState, useEffect } from 'react';
import { usePlacements } from '../../hooks/usePlacements';
import PlacementCard from '../../components/placements/PlacementCard';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import PlacementForm from '../../components/placements/PlacementForm';
import { Plus, Search } from 'lucide-react';

const PlacementsPage = () => {
  const { status, data, error, fetchPlacements } = usePlacements();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlacements({ company: searchTerm });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchPlacements]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <PlacementForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={() => fetchPlacements()} 
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-outfit tracking-tight">Placement <span className="text-kalvium">Stories</span></h1>
          <p className="text-slate-500 mt-1">Real interview insights shared by fellow Kalvians.</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center px-8 py-4 bg-kalvium hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-kalvium/20 hover:scale-105 active:scale-95 group"
        >
          <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
          Share Your Experience
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search company or role..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {status === 'loading' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : status === 'error' ? (
        <ErrorBanner message={error} onRetry={() => fetchPlacements()} />
      ) : !data || data.length === 0 ? (
        <div className="py-20">
          <EmptyState 
            title="No placement stories found" 
            message="Be the first to help your batchmates by sharing your journey!"
            onAction={() => setIsFormOpen(true)}
            actionLabel="Share Your Story"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(placement => (
            <PlacementCard 
              key={placement.id} 
              placement={placement} 
              onDelete={() => fetchPlacements()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacementsPage;
