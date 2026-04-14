import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDiscussionById, replyToThread, deleteThread } from '../../services/discussions.service';
import { useAuth } from '../../hooks/useAuth';
import { ArrowLeft, MessageCircle, User, Clock, Send, AlertTriangle, Trash2 } from 'lucide-react';

const ThreadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [replyError, setReplyError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this thread and all its replies? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteThread(id);
      navigate('/discussions');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  const fetchThread = async () => {
    try {
      setLoading(true);
      const res = await getDiscussionById(id);
      setThread(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load discussion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThread();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSubmitting(true);
    setReplyError(null);
    try {
      await replyToThread(id, reply);
      setReply('');
      fetchThread();
    } catch (err) {
      setReplyError(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-10 bg-slate-100 rounded-2xl w-1/3" />
      <div className="h-48 bg-slate-100 rounded-3xl" />
      <div className="h-32 bg-slate-100 rounded-3xl" />
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto">
      <Link to="/discussions" className="flex items-center text-slate-500 hover:text-kalvium mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Discussions
      </Link>
      <div className="bg-red-50 border border-red-100 rounded-3xl p-8 text-center">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      <Link to="/discussions" className="flex items-center text-slate-500 hover:text-kalvium font-medium transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Discussions
      </Link>

      {/* Thread */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">{thread?.title}</h1>
          {(user?.id || user?.userId) === thread?.author?.id && (

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-shrink-0 p-2 hover:bg-red-50 rounded-xl text-slate-300 hover:text-red-500 transition-all"
              title="Delete thread"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        <p className="text-slate-600 leading-relaxed mb-6">{thread?.content}</p>
        <div className="flex items-center space-x-4 pt-5 border-t border-slate-100 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-kalvium/10 flex items-center justify-center font-bold text-kalvium text-sm">
              {thread?.author?.name?.charAt(0)}
            </div>
            <span className="font-bold text-slate-700">{thread?.author?.name}</span>
          </div>
          <span className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {new Date(thread?.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center">
            <MessageCircle className="w-3.5 h-3.5 mr-1.5 text-kalvium" />
            {thread?.replies?.length || 0} replies
          </span>
        </div>
      </div>

      {/* Replies */}
      {thread?.replies?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 pl-2 border-l-4 border-kalvium">
            Replies ({thread.replies.length})
          </h2>
          {thread.replies.map(r => (
            <div key={r.id} className={`bg-white border rounded-[2rem] p-6 shadow-sm ${r.isBlocker ? 'border-red-200 bg-red-50/30' : 'border-slate-100'}`}>
              {r.isBlocker && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-widest mb-3">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Blocker
                </span>
              )}
              <p className="text-slate-700 leading-relaxed mb-4">{r.content}</p>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                  {r.author?.name?.charAt(0)}
                </div>
                <span className="font-semibold text-slate-600">{r.author?.name}</span>
                <span>·</span>
                <span>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Form */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Post a Reply</h2>
        <form onSubmit={handleReply} className="space-y-4">
          <textarea
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Share your thoughts or help answer this question..."
            rows={4}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-kalvium/20 focus:border-kalvium resize-none transition-all"
          />
          {replyError && <p className="text-red-500 text-sm">{replyError}</p>}
          <button
            type="submit"
            disabled={submitting || !reply.trim()}
            className="flex items-center justify-center px-8 py-3.5 bg-kalvium hover:bg-red-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-kalvium/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <Send className="w-4 h-4 mr-2" />
            {submitting ? 'Posting...' : 'Post Reply'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThreadDetailPage;
