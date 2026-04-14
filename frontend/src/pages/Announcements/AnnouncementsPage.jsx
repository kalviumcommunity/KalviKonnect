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
      <div className="space-y-8">
        {/* Sticky/Priority Section */}
        {data.filter(a => a.isSticky).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-kalvium uppercase tracking-[0.3em] pl-1">Priority Broadcasts</h2>
            <div className="space-y-4">
              {data.filter(a => a.isSticky).map(announcement => (
                <div key={announcement.id} className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group border border-slate-800">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-kalvium/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-kalvium/20 transition-all duration-700"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                    <div className="p-4 bg-kalvium rounded-3xl shrink-0 shadow-lg shadow-kalvium/20">
                      <Bell className="w-8 h-8 text-white animate-bounce" />
                    </div>
                    
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">Important</span>
                        <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-3xl font-bold font-outfit tracking-tight">{announcement.title}</h3>
                      <p className="text-white/70 leading-relaxed text-lg font-medium pr-10">
                        {announcement.content}
                      </p>
                    </div>

                    {isManager && (
                      <button 
                        onClick={() => handleDelete(announcement.id)}
                        className="p-3 bg-white/5 hover:bg-red-500 rounded-2xl transition-all border border-white/5 hover:border-red-500 group/del"
                      >
                         <Trash2 className="w-5 h-5 text-white/40 group-hover/del:text-white" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Section */}
        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-1 pt-4">Community Notices</h2>
          <div className="grid gap-6">
            {data.filter(a => !a.isSticky).map(announcement => (
              <div key={announcement.id} className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm hover:border-kalvium/30 transition-all relative group flex flex-col md:flex-row gap-6 items-start">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shrink-0 text-slate-400 group-hover:bg-kalvium/5 group-hover:text-kalvium transition-all">
                  <Info className="w-6 h-6" />
                </div>

                <div className="flex-grow space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{announcement.author?.name || 'Academic Council'}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-outfit">{announcement.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-[15px] font-medium pr-10">
                    {announcement.content}
                  </p>
                </div>

                {isManager && (
                  <button 
                    onClick={() => handleDelete(announcement.id)}
                    className="p-3 bg-slate-50 text-slate-300 hover:text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-slate-100 hover:border-red-100 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-10 duration-1000 pb-20 px-4">
      <AnnouncementForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={() => fetchAnnouncements()} 
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center space-x-6">
          <div className="p-6 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-kalvium opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Megaphone className="w-10 h-10 text-white relative z-10" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900 font-outfit tracking-tighter">Campus <span className="text-kalvium">Pulse</span></h1>
            <p className="text-slate-500 text-lg font-medium">Critical updates and official academic news.</p>
          </div>
        </div>
        
        {isManager && (
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center px-10 py-5 bg-kalvium hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-kalvium/20 active:scale-95 group border-2 border-transparent hover:border-white/20"
          >
            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
            Issue Broadcast
          </button>
        )}
      </div>

      <div className="p-1 bg-slate-100 rounded-[2.2rem]">
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200/50 shadow-inner relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-kalvium/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
           {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;

