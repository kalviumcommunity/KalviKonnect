import React, { useState } from 'react';
import { X, Send, AlertCircle, Building2, Briefcase, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';
import { createPlacement } from '../../services/placements.service';

const PlacementForm = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    content: '',
    fileUrls: ['']
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
    
    const finalData = {
      ...formData,
      fileUrls: formData.fileUrls.filter(link => link.trim() !== '')
    };

    try {
      const res = await createPlacement(finalData);
      if (res.success) {
        onSuccess(res.data);
        onClose();
        setFormData({ company: '', role: '', content: '', fileUrls: [''] });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share experience');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 max-h-[90vh] flex flex-col">
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Share Placement Story</h3>
            <p className="text-xs text-slate-500 mt-1">Help juniors by sharing your interview journey and prep links.</p>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Google"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-medium"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Job Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. SDE-1"
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-medium"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Interview Narrative</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your rounds, questions, and overall experience..."
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-kalvium/10 focus:border-kalvium outline-none transition-all placeholder:text-slate-300 font-medium resize-none text-sm"
                value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
              ></textarea>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between pl-1">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Supporting Links (G-Drive, Resume, etc.)</label>
                <button 
                  type="button" 
                  onClick={handleAddLink}
                  className="flex items-center text-[10px] font-black text-kalvium uppercase tracking-widest hover:underline"
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Link
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
                Share Experience
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlacementForm;

