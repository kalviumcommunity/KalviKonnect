import React, { useState } from 'react';
import { X, Send, AlertCircle, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { createNote } from '../../services/notes.service';

const NoteForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    semester: '1',
    content: '',
    tags: [],
    fileUrls: [''] // Start with one empty link
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddLink = () => {
    setFormData({ ...formData, fileUrls: [...formData.fileUrls, ''] });
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...formData.fileUrls];
    newLinks[index] = value;
    setFormData({ ...formData, fileUrls: newLinks });
  };

  const handleRemoveLink = (index) => {
    const newLinks = formData.fileUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, fileUrls: newLinks.length ? newLinks : [''] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Filter out empty links
    const finalData = {
      ...formData,
      fileUrls: formData.fileUrls.filter(link => link.trim() !== '')
    };

    try {
      const res = await createNote(finalData);
      if (res.success) {
        onSuccess(res.data);
        onClose();
        setFormData({ title: '', semester: '1', content: '', tags: [], fileUrls: [''] });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shared resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 max-h-[90vh] flex flex-col">
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Share Learning Resource</h3>
            <p className="text-xs text-slate-500 mt-1">Paste your Google Drive or external links below.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
          {error && (
            <div className="flex items-center p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm italic">
              <AlertCircle className="w-5 h-5 mr-3" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Resource Title</label>
              <input
                required
                type="text"
                placeholder="e.g. Operating Systems - Process Management"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-medium"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Semester</label>
                <select
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all font-bold text-slate-600"
                  value={formData.semester}
                  onChange={e => setFormData({ ...formData, semester: e.target.value })}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Category</label>
                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all font-bold text-slate-400" disabled>
                   <option>Computer Science Core</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Resource Description</label>
              <textarea
                required
                rows={3}
                placeholder="What is this resource about? Any instructions?"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-medium resize-none text-sm"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between pl-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Resource Links (G-Drive, etc.)</label>
                <button 
                  type="button" 
                  onClick={handleAddLink}
                  className="flex items-center text-[10px] font-black text-kalvium uppercase tracking-widest hover:underline"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Another Link
                </button>
              </div>
              
              {formData.fileUrls.map((link, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-grow">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="url"
                      placeholder="https://drive.google.com/..."
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all text-sm font-medium"
                      value={link}
                      onChange={e => handleLinkChange(index, e.target.value)}
                    />
                  </div>
                  {formData.fileUrls.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveLink(index)}
                      className="p-3.5 bg-red-50 text-red-400 hover:text-red-600 rounded-xl border border-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-[10px] text-slate-400 italic pl-1 italic">Make sure to set permissions to "Anyone with the link can view"</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-kalvium hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-kalvium/20 flex items-center justify-center disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Broadcast Resource
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;

