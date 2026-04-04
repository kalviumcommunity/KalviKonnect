import React, { useState } from 'react';
import { Send, Image, Link2, Smile, Globe, Home } from 'lucide-react';
import { createPost } from '../../services/post.service';
import { useAuth } from '../../hooks/useAuth';

const PostForm = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [scope, setScope] = useState('COLLEGE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || content.length < 10) return;

    setIsSubmitting(true);
    try {
      await createPost(content, scope);
      setContent('');
      if (onPostCreated) onPostCreated();
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-8 transition-all hover:shadow-md">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-kalvium font-bold text-lg flex-shrink-0 border border-slate-200">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={scope === 'COLLEGE' ? "What's happening in your college?" : "Share with the Kalvium Network..."}
            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 text-lg placeholder-slate-400 resize-none h-24 pt-2"
          ></textarea>
          
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-100 gap-4">
            <div className="flex items-center space-x-2">
              <button 
                type="button"
                onClick={() => setScope('COLLEGE')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  scope === 'COLLEGE' 
                    ? 'bg-red-50 text-kalvium border-red-100 shadow-sm' 
                    : 'text-slate-400 border-transparent hover:bg-slate-50'
                }`}
              >
                <Home className="w-3.5 h-3.5 mr-1.5" />
                My College
              </button>
              <button 
                type="button"
                onClick={() => setScope('KALVIUM')}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  scope === 'KALVIUM' 
                    ? 'bg-sky-50 text-sky-600 border-sky-100 shadow-sm' 
                    : 'text-slate-400 border-transparent hover:bg-slate-50'
                }`}
              >
                <Globe className="w-3.5 h-3.5 mr-1.5" />
                Network
              </button>
            </div>
            
            <button 
              disabled={isSubmitting || content.length < 10}
              className={`px-6 py-2.5 bg-kalvium hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-kalvium/20 active:scale-95 flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
              <Send className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PostForm;
