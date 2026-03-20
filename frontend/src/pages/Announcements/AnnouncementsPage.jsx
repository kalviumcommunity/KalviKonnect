import React, { useEffect } from 'react';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useAuth } from '../../hooks/useAuth';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { Megaphone, Plus, Bell, Clock, Info } from 'lucide-react';

const AnnouncementsPage = () => {
  const { status, data, error, fetchAnnouncements } = useAnnouncements();
  const { user } = useAuth();
  const isManager = user?.role === 'CampusManager';

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <SkeletonCard key={i} type="list" />
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="max-w-2xl mx-auto mt-12">
          <ErrorBanner message={error} onRetry={() => fetchAnnouncements()} />
        </div>
      );
    }

    if (status === 'success' && data.length === 0) {
      return (
        <div className="mt-12">
          <EmptyState 
            title="Clean slate!" 
            message="No active announcements at the moment. Check back later for campus updates."
            onAction={isManager ? () => console.log('Open Announcement Modal') : null}
            actionLabel={isManager ? "Create Announcement" : null}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {data.map(announcement => (
          <div key={announcement._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{announcement.title}</h3>
                  <div className="flex items-center text-xs text-slate-400 mt-1">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {announcement.isPriority && (
                <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded border border-red-100 shadow-sm">
                  Priority
                </span>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Megaphone className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900 font-outfit">Announcements</h1>
        </div>
        
        {isManager && (
          <button className="flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95">
            <Plus className="w-5 h-5 mr-2" />
            Post Update
          </button>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start space-x-4">
        <div className="mt-1">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Stay updated with the latest news, events, and important notices from the Kalvium campus management team.
        </p>
      </div>

      {renderContent()}
    </div>
  );
};

export default AnnouncementsPage;
