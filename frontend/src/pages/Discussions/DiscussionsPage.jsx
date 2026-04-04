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
            <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-[2rem] p-8 h-48 shadow-sm"></div>
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

    if (status === 'success' && (!data || data.length === 0)) {
      return (
        <div className="mt-12 bg-white rounded-[2.5rem] p-16 border border-dashed border-slate-300 text-center">
          <EmptyState 
            title="No discussions started" 
            message="Have a question or a topic to share? Start the first thread and get help from the community!"
            onAction={() => {}}
            actionLabel="Start First Discussion"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map(thread => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in slide-in-from-right duration-700 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 font-outfit tracking-tight">Community <span className="text-kalvium">Discussions</span></h1>
          <p className="text-slate-500 mt-2 text-lg">Ask questions, share ideas, and connect with other Kalvians.</p>
        </div>
        <button className="flex items-center justify-center px-8 py-4 bg-kalvium hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-kalvium/20 active:scale-95 group">
          <MessageSquarePlus className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
          Start New Thread
        </button>
      </div>

      <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for topics, questions, or tags..." 
            className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default DiscussionsPage;
