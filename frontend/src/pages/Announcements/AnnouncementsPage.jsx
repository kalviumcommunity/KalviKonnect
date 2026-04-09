import React, { useEffect, useState } from 'react';
import { useAnnouncements } from '../../hooks/useAnnouncements';
import { useAuth } from '../../hooks/useAuth';
import SkeletonCard from '../../components/shared/SkeletonCard';
import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import AnnouncementForm from '../../components/announcements/AnnouncementForm';
import { deleteAnnouncement } from '../../services/announcements.service';
import { Megaphone, Plus, Bell, Clock, Info, Trash2 } from 'lucide-react';

const AnnouncementsPage = () => {
  const { status, data, error, fetchAnnouncements } = useAnnouncements();
  const { user } = useAuth();
  const isManager = user?.role === 'CAMPUS_MANAGER';
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    setDeletingId(id);
    try {
      await deleteAnnouncement(id);
      fetchAnnouncements();
    } catch (err) {
      alert("Failed to delete announcement");
    } finally {
      setDeletingId(null);
    }
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-3xl p-8 h-32 shadow-sm"></div>
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

    if (status === 'success' && (!data || data.length === 0)) {
      return (
        <div className="mt-12 bg-white rounded-3xl p-16 border border-dashed border-slate-300 text-center">
          <EmptyState 
            title="Clean slate!" 
            message="No active announcements at the moment. Check back later for campus updates."
            onAction={isManager ? () => setIsFormOpen(true) : null}
            actionLabel={isManager ? "Create Announcement" : null}
          />
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {data.map(announcement => (
          <div key={announcement.id} className="group bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:border-kalvium/20 transition-all hover:shadow-xl hover:shadow-kalvium/5 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            
            {isManager && (announcement.authorId === user.userId || user.role === 'CAMPUS_MANAGER') && (
              <button 
                onClick={() => handleDelete(announcement.id)}
                disabled={deletingId === announcement.id}
                className="absolute top-8 right-8 p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-50 rounded-2xl border border-red-100">
                  <Bell className="w-5 h-5 text-kalvium" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight font-outfit pr-10">{announcement.title}</h3>
                  <div className="flex items-center text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-kalvium" />
                    {new Date(announcement.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    <span className="mx-2">•</span>
                    {announcement.author?.name || 'Management'}
                  </div>
                </div>
              </div>
              {announcement.isSticky && (
                <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-red-600/20 tracking-widest">
                  Priority
                </span>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed text-[15px] pl-16">
              {announcement.content}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in zoom-in-95 duration-700 pb-12 px-4 md:px-0">
      <AnnouncementForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={() => fetchAnnouncements()} 
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-kalvium rounded-3xl shadow-xl shadow-kalvium/20">
            <Megaphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 font-outfit tracking-tight">Campus <span className="text-kalvium">Broadcasting</span></h1>
        </div>
        
        {isManager && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-8 py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/10 active:scale-95 group"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
            New Broadcast
          </button>
        )}
      </div>

      <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 flex items-start space-x-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-kalvium/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="mt-1 relative z-10">
          <Info className="w-5 h-5 text-kalvium" />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed relative z-10 font-medium">
          Stay updated with the latest news, events, and important notices from the Kalvium campus management team.
        </p>
      </div>

      {renderContent()}
    </div>
  );
};

export default AnnouncementsPage;
