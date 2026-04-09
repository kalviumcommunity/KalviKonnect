import React, { useState } from 'react';
import { X, Send, AlertCircle, Megaphone, CheckCircle2 } from 'lucide-react';
import { createAnnouncement } from '../../services/announcements.service';

const AnnouncementForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isSticky: false,
    visibility: 'UNIVERSITY_ONLY'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await createAnnouncement(formData);
      if (res.success) {
        onSuccess(res.data);
        onClose();
        setFormData({ title: '', content: '', isSticky: false, visibility: 'UNIVERSITY_ONLY' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-4">
             <div className="p-3 bg-kalvium rounded-2xl">
                <Megaphone className="w-6 h-6 text-white" />
             </div>
             <div>
                <h3 className="text-xl font-bold text-slate-900">New Campus Broadcast</h3>
                <p className="text-xs text-slate-500 mt-0.5">Post an important update or notice for students.</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="flex items-center p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm italic">
              <AlertCircle className="w-5 h-5 mr-3" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Broadcast Title</label>
              <input
                required
                type="text"
                placeholder="e.g. End Semester Exam Schedule Released"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-bold text-slate-900"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Broadcast Content</label>
              <textarea
                required
                rows={5}
                placeholder="Write the details of your announcement here..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-medium text-slate-700 resize-none"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <input 
                 type="checkbox" 
                 id="isSticky" 
                 className="w-5 h-5 rounded-lg border-slate-300 text-kalvium focus:ring-kalvium"
                 checked={formData.isSticky}
                 onChange={e => setFormData({...formData, isSticky: e.target.checked})}
               />
               <label htmlFor="isSticky" className="text-sm font-bold text-slate-600 select-none cursor-pointer">
                 Mark as Priority (Pin to top)
               </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <>
                <Send className="w-4 h-4 mr-3" />
                Broadcast to Campus
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AnnouncementForm;
