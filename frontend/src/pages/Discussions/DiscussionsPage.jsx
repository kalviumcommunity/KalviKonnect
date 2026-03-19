import React, { useEffect } from 'react';
import { useDiscussions } from '../../hooks/useDiscussions';
import ThreadCard from '../../components/discussions/ThreadCard';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { MessageSquarePlus, Search } from 'lucide-react';

const DiscussionsPage = () => {
  const { status, data, error, fetchDiscussions } = useDiscussions();

  useEffect(() => {
    fetchDiscussions();
  }, [fetchDiscussions]);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="max-w-2xl mx-auto mt-12">
          <ErrorBanner message={error} onRetry={() => fetchDiscussions()} />
        </div>
      );
    }

    if (status === 'success' && data.length === 0) {
      return (
        <div className="mt-12">
          <EmptyState 
            title="No discussions started" 
            message="Have a question or a topic to share? Start the first thread!"
            onAction={() => console.log('Open Thread Modal')}
            actionLabel="Start Discussion"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map(thread => (
          <ThreadCard key={thread._id} thread={thread} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white font-outfit">Community Discussions</h1>
          <p className="text-gray-400 mt-1">Ask questions, share ideas, and connect with other Kalvians.</p>
        </div>
        <button className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
          <MessageSquarePlus className="w-5 h-5 mr-2" />
          Start New Thread
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search for topics, questions..." 
          className="w-full pl-12 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white shadow-inner"
        />
      </div>

      {renderContent()}
    </div>
  );
};

export default DiscussionsPage;
