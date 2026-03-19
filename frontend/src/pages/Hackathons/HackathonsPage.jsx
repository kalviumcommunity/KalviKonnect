import React, { useEffect } from 'react';
import { useHackathons } from '../../hooks/useHackathons';
import HackathonCard from '../../components/hackathons/HackathonCard';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { Search, Trophy } from 'lucide-react';

const HackathonsPage = () => {
  const { status, data, error, fetchHackathons } = useHackathons();

  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="max-w-2xl mx-auto mt-12">
          <ErrorBanner message={error} onRetry={() => fetchHackathons()} />
        </div>
      );
    }

    if (status === 'success' && data.length === 0) {
      return (
        <div className="mt-12">
          <EmptyState 
            title="No Hackathons found" 
            message="There are no active hackathons available right now. Stay tuned for future events!"
            onAction={() => window.open('https://kalvium.com/events', '_blank')}
            actionLabel="View All Events"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map(item => (
          <HackathonCard key={item._id} hackathon={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-top duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/30">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white font-outfit">Exclusive Hackathons</h1>
            <p className="text-gray-400">Compete, collaborate, and win prizes in Kalvium-only challenges.</p>
          </div>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full pl-12 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default HackathonsPage;
