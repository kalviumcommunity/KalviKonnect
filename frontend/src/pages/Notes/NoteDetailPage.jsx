import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as notesService from '../../services/notes.service';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorBanner from '../../components/shared/ErrorBanner';
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
      const data = await notesService.getNoteById(id);
      setNote(data.data || data);
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
      await notesService.upvoteNote(id);
      // Refresh note data to show updated upvote count
      await fetchNote();
    } catch (err) {
      console.error('Failed to upvote');
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) return <LoadingSpinner size="h-12 w-12" text="Loading note details..." />;
  
  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <ErrorBanner message={error} onRetry={fetchNote} />
        <button 
          onClick={() => navigate('/notes')}
          className="mt-6 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to all notes
        </button>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom duration-500">
      <button 
        onClick={() => navigate('/notes')}
        className="flex items-center text-gray-400 hover:text-white transition-colors group"
      >
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Resources
      </button>

      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold uppercase tracking-wider">
              {note.tags?.[0] || 'General'}
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1.5" />
              {new Date(note.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 font-outfit leading-tight">
            {note.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-neutral-700 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mr-4">
                {note.author?.name?.charAt(0) || <User />}
              </div>
              <div>
                <p className="text-white font-semibold">{note.author?.name || 'Anonymous'}</p>
                <p className="text-gray-500 text-sm">{note.author?.role || 'Contributor'}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button 
                onClick={handleUpvote}
                disabled={upvoting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all ${upvoting ? 'opacity-50' : 'hover:scale-105 active:scale-95'} ${note.hasUpvoted ? 'bg-blue-600 text-white border-blue-600' : 'bg-neutral-900 border-neutral-700 text-gray-400 hover:text-white hover:border-neutral-500'}`}
              >
                <ThumbsUp className={`w-5 h-5 ${note.hasUpvoted ? 'fill-current' : ''}`} />
                <span className="font-bold">{note.upvotes || 0}</span>
              </button>
              <button className="p-2 bg-neutral-900 border border-neutral-700 rounded-xl text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
            {note.description.split('\n').map((para, i) => (
              <p key={i} className="mb-4">{para}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 md:p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <MessageSquare className="w-6 h-6 mr-3 text-blue-500" />
          Comments (0)
        </h3>
        <p className="text-gray-500 text-center py-8 bg-neutral-900/50 rounded-xl border border-dashed border-neutral-700">
          No comments yet. Start the discussion!
        </p>
      </div>
    </div>
  );
};

export default NoteDetailPage;
