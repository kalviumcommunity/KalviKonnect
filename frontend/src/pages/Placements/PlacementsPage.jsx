import React, { useEffect } from 'react';
import { usePlacements } from '../../hooks/usePlacements';
import PlacementCard from '../../components/placements/PlacementCard';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { Plus, Info } from 'lucide-react';

const PlacementsPage = () => {
  const { status, data, error, fetchPlacements } = usePlacements();

  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements]);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <SkeletonCard key={i} type="list" />
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="max-w-2xl mx-auto mt-12">
          <ErrorBanner message={error} onRetry={() => fetchPlacements()} />
        </div>
      );
    }

    if (status === 'success' && data.length === 0) {
      return (
        <div className="mt-12">
          <EmptyState 
            title="No placement stories found" 
            message="Help your juniors by sharing your interview and placement experiences."
            onAction={() => console.log('Open Placement Modal')}
            actionLabel="Share Experience"
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {data.map(item => (
          <PlacementCard key={item._id} placement={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold text-slate-900 font-outfit mb-3">Placement Experiences</h1>
          <p className="text-slate-600">
            Real interview stories, salary insights, and preparation tips from Kalvium seniors who made it to top tech companies.
          </p>
        </div>
        <button className="whitespace-nowrap flex items-center px-8 py-4 bg-white text-neutral-900 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-xl hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5 mr-2" />
          Share Your Story
        </button>
      </div>

      <div className="flex items-center space-x-2 text-sm text-slate-500 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <Info className="w-4 h-4 text-blue-500" />
        <p>Filter by company or role to find specific insights for your target goal.</p>
      </div>

      {renderContent()}
    </div>
  );
};

export default PlacementsPage;
