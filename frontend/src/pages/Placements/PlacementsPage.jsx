import React, { useEffect } from 'react';
import { usePlacements } from '../../hooks/usePlacements';
import PlacementCard from '../../components/placements/PlacementCard';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { Plus, Info } from 'lucide-react';

const PlacementsPage = () => {
  const { status, data, error, fetchPlacements } = usePlacements();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlacements({ company: searchTerm });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchPlacements]);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-3xl p-6 h-32 shadow-sm"></div>
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="max-w-2xl mx-auto mt-12">
          <ErrorBanner message={error} onRetry={() => fetchPlacements({ company: searchTerm })} />
        </div>
      );
    }

    if (status === 'success' && (!data || data.length === 0)) {
      return (
        <div className="mt-12 bg-white rounded-3xl p-12 border border-dashed border-slate-300">
          <EmptyState 
            title="No placement stories found" 
            message={searchTerm ? `No results for "${searchTerm}". Try a different company.` : "Help your juniors by sharing your interview and placement experiences."}
            onAction={() => {}}
            actionLabel="Share Experience"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map(item => (
          <PlacementCard key={item.id} placement={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="relative bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-60"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 font-outfit mb-4 tracking-tight">Placement <span className="text-kalvium">Stories</span></h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Real interview cases, salary insights, and preparation tips from Kalvium seniors at top tech companies.
            </p>
          </div>
          <button className="whitespace-nowrap flex items-center px-8 py-4 bg-kalvium text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-kalvium/20 hover:scale-105 active:scale-95 group">
            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
            Share Your Experience
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm flex flex-col sm:flex-row items-stretch gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by company name (e.g. Google, Amazon)..." 
            className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium"
          />
        </div>
        <div className="hidden sm:flex items-center px-4 border-l border-slate-100 text-slate-400">
          <Info className="w-4 h-4 mr-2" />
          <span className="text-xs font-semibold uppercase tracking-wider">Search active</span>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default PlacementsPage;
