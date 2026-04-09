import React, { useState } from 'react';
import { X, Send, AlertCircle, MessageSquare } from 'lucide-react';
import { createThread } from '../../services/discussions.service';

const ThreadForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await createThread(formData);
      if (res.success) {
        onSuccess(res.data);
        onClose();
        setFormData({ title: '', content: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start discussion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Start Discussion</h3>
            <p className="text-xs text-slate-500 mt-1">Ask a question or share a thought with the Kalvium community.</p>
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
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Topic Title</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                  required
                  type="text"
                  placeholder="e.g. How to optimize React context re-renders?"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-medium"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Description</label>
              <textarea
                required
                rows={6}
                placeholder="Provide more context for your question..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-medium resize-none"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-kalvium hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-kalvium/20 flex items-center justify-center disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Start Discussion
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThreadForm;
