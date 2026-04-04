import React, { useState } from 'react';
import { User, MessageCircle, Heart, Share2, MoreHorizontal, Globe, Home } from 'lucide-react';
import { toggleLike } from '../../services/post.service';

const PostCard = ({ post }) => {
  const { id, author, content, createdAt, likeCount: initialLikeCount, scope, hasLiked: initialHasLiked } = post;
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [hasLiked, setHasLiked] = useState(initialHasLiked || false);

  const handleToggleLike = async () => {
    try {
      const response = await toggleLike(id);
      if (response.success) {
        setHasLiked(response.data.liked);
        setLikeCount(prev => response.data.liked ? prev + 1 : prev - 1);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-kalvium font-bold border border-slate-200 overflow-hidden shadow-inner">
            {author?.name?.charAt(0) || <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-slate-900 font-bold leading-none">{author?.name || 'Kalvian'}</h4>
              {scope === 'KALVIUM' ? (
                <Globe className="w-3 h-3 text-sky-500" title="Network Wide" />
              ) : (
                <Home className="w-3 h-3 text-red-400" title="College Only" />
              )}
            </div>
            <p className="text-slate-400 text-[10px] mt-1 font-medium">
              {new Date(createdAt).toLocaleDateString(undefined, { 
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-900 transition-colors p-1.5 hover:bg-slate-50 rounded-lg">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="text-slate-600 mb-6 leading-relaxed whitespace-pre-wrap text-[15px]">
        {content}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-6">
          <button 
            onClick={handleToggleLike}
            className={`flex items-center space-x-2 transition-all group p-1 ${
              hasLiked ? 'text-red-500 scale-105' : 'text-slate-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : 'group-hover:fill-current'}`} />
            <span className="text-sm font-bold">{likeCount}</span>
          </button>
          <button className="flex items-center space-x-2 text-slate-400 hover:text-blue-500 transition-colors p-1 group">
            <MessageCircle className="w-5 h-5 group-hover:fill-current" />
            <span className="text-sm font-bold">0</span>
          </button>
        </div>
        <button className="text-slate-400 hover:text-sky-600 transition-colors p-1 hover:bg-sky-50 rounded-lg">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(PostCard);
