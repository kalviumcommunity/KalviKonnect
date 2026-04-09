import React, { useState } from 'react';
import { ThumbsUp, User, Tag, Calendar, ExternalLink, Download, Trash2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const NoteCard = ({ note, onDelete }) => {
  const { id, _id, title, content, description, semester, author, upvoteCount, createdAt, fileUrl } = note;
  const noteId = id || _id;
  const displayDescription = content || description || '';
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  const isOwner = user?.userId === author?.id;

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm('Delete this note? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await api.delete(`/notes/${noteId}`);
      if (onDelete) onDelete(noteId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group flex flex-col h-full shadow-sm relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-kalvium/10 rounded-lg">
            <Tag className="w-4 h-4 text-kalvium" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
            Semester {semester}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {new Date(createdAt).toLocaleDateString()}
          </div>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 hover:bg-red-50 rounded-lg text-slate-300 hover:text-red-500 transition-all"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-kalvium transition-colors line-clamp-1 font-outfit tracking-tight">
        {title}
      </h3>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
        {displayDescription}
      </p>

      {fileUrl && (
          <a 
            href={fileUrl.startsWith('http') ? fileUrl : `${import.meta.env.VITE_API_URL}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center w-full py-3 bg-kalvium/5 hover:bg-kalvium/10 text-kalvium text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-kalvium/10 mb-6"
          >
            <Download className="w-4 h-4 mr-2" />
            View Attachment
          </a>
      )}

      <div className="pt-4 border-t border-slate-50 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-slate-600">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 border border-slate-200">
              <User className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm font-bold">{author?.name || 'Anonymous'}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-slate-400 group/vote cursor-pointer">
              <ThumbsUp className="w-4 h-4 mr-1.5 group-hover/vote:text-kalvium transition-colors" />
              <span className="text-xs font-bold">{upvoteCount || 0}</span>
            </div>
            <Link 
              to={`/notes/${noteId}`}
              className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-slate-900/10 flex items-center group/ai"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 text-orange-400 group-hover/ai:rotate-12 transition-transform" />
              AI Study Plan
            </Link>
            <Link 
              to={`/notes/${noteId}`}
              className="p-2 hover:bg-kalvium/10 rounded-xl text-slate-400 hover:text-kalvium transition-all border border-slate-200"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(NoteCard);
