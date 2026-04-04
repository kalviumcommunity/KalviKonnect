import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as notesService from '../../services/notes.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorBanner from '../../components/shared/ErrorBanner';
import NoteAIInsights from '../../components/Notes/NoteAIInsights';
import { ChevronLeft, ThumbsUp, User, Calendar, Tag, Share2, MessageSquare } from 'lucide-react';

const NoteDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvoting, setUpvoting] = useState(false);

  const fetchNote = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notesService.getNoteById(id);
      if (response.success) {
        setNote(response.data);
      } else {
        throw new Error('Note not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load note details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const handleUpvote = async () => {
    if (upvoting) return;
    setUpvoting(true);
    try {
      const res = await notesService.upvoteNote(id);
      if (res.success) {
        setNote(prev => ({
          ...prev,
          upvotes: res.data.liked ? prev.upvotes + 1 : prev.upvotes - 1,
          hasUpvoted: res.data.liked
        }));
      }
    } catch (err) {
      console.error('Failed to upvote');
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) return <LoadingSpinner size="h-12 w-12" text="Curating note details..." />;
  
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 px-4">
        <ErrorBanner message={error} onRetry={fetchNote} />
        <button 
          onClick={() => navigate('/notes')}
          className="mt-8 flex items-center text-slate-500 hover:text-kalvium transition-colors font-bold uppercase tracking-widest text-[10px]"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Resources
        </button>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-700 pb-20 px-4 md:px-0">
      <button 
        onClick={() => navigate('/notes')}
        className="flex items-center text-slate-400 hover:text-kalvium transition-colors group font-bold uppercase tracking-widest text-[10px]"
      >
        <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        All Resources
      </button>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 md:p-12">
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <span className="px-4 py-1.5 bg-red-50 text-kalvium rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-red-100 italic">
              {note.semester ? `Semester ${note.semester}` : 'General'}
            </span>
            <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <Calendar className="w-4 h-4 mr-2 text-kalvium" />
              {new Date(note.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            {note.university && (
              <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <Tag className="w-4 h-4 mr-2 text-kalvium" />
                {note.university}
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 font-outfit tracking-tight leading-[1.1]">
            {note.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-8 border-y border-slate-50 mb-10 gap-6">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-kalvium text-2xl font-bold mr-5 border border-slate-100 shadow-inner">
                {note.author?.name?.charAt(0) || <User />}
              </div>
              <div>
                <p className="text-slate-900 font-bold text-lg leading-tight">{note.author?.name || 'Kalvian'}</p>
                <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-wider">{note.author?.role || 'STUDENT'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={handleUpvote}
                disabled={upvoting}
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl border transition-all ${upvoting ? 'opacity-50' : 'hover:scale-105 active:scale-95'} ${note.hasUpvoted ? 'bg-kalvium text-white border-kalvium shadow-lg shadow-kalvium/20' : 'bg-white border-slate-200 text-slate-500 hover:text-kalvium hover:border-kalvium'}`}
              >
                <ThumbsUp className={`w-5 h-5 ${note.hasUpvoted ? 'fill-current' : 'group-hover:fill-current'}`} />
                <span className="font-bold text-lg">{note.upvotes || 0}</span>
              </button>
              <button className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-kalvium transition-colors shadow-inner">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg mb-12">
            {(note.content || note.description || '').split('\n').map((para, i) => (
              <p key={i} className="mb-6">{para}</p>
            ))}
          </div>
          
          <div className="bg-slate-50 p-1 rounded-[2rem]">
            <NoteAIInsights 
              noteId={id} 
              initialData={note.aiSummary ? {
                summary: note.aiSummary,
                keyPoints: note.aiKeyPoints,
                topics: note.aiTopics,
                lastAnalyzed: note.aiAnalyzedAt
              } : null} 
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center font-outfit">
          <MessageSquare className="w-6 h-6 mr-4 text-kalvium" />
          Collaborative Discussion
        </h3>
        <p className="text-slate-400 text-center py-10 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 font-medium">
          No comments yet. Start the conversation with your fellow Kalvians!
        </p>
      </div>
    </div>
  );
};

export default NoteDetailPage;
