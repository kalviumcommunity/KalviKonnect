import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { createNote } from '../../services/notes.service';

const NoteForm = ({ isOpen, onClose, onSuccess }) => {
  const availableTags = [
    { id: 'tag-react', name: 'React' },
    { id: 'tag-exams', name: 'Exams' },
    { id: 'tag-notes', name: 'Notes' },
    { id: 'tag-placements', name: 'Placements' },
    { id: 'tag-hackathons', name: 'Hackathons' },
    { id: 'tag-workshops', name: 'Workshops' },
  ];
  const [formData, setFormData] = useState({
    title: '',
    semester: '1',
    content: '',
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await createNote(formData);
      if (res.success) {
        onSuccess(res.data);
        onClose();
        setFormData({ title: '', semester: '1', content: '', tags: [] });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Share Resource</h3>
            <p className="text-xs text-slate-500 mt-1">Help your fellow Kalvians by sharing your learning notes.</p>
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
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Category (Tags)</label>
                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all font-bold text-slate-400" disabled>
                   <option>CS Core</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Resource Content</label>
              <textarea
                required
                rows={4}
                placeholder="Paste your notes here or describe the resource details..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-medium resize-none"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Attachment (Optional PDF, ZIP, DOC)</label>
              <div className="flex items-center justify-center w-full px-5 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-kalvium transition-colors group cursor-pointer relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
                />
                <div className="text-center">
                   <p className="text-sm font-bold text-slate-400 group-hover:text-kalvium transition-colors">
                     {formData.file ? formData.file.name : 'Click to select or drag and drop'}
                   </p>
                   <p className="text-[10px] text-slate-300 mt-1 uppercase tracking-wider">Max 10MB • PDF, Images, ZIP</p>
                </div>
              </div>
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
                Upload Resource
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
