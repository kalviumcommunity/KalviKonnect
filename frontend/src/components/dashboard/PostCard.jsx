import React from 'react';
import { User, MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post }) => {
  const { author, content, createdAt, likes, comments } = post;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-slate-300 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 overflow-hidden">
            {author?.name?.charAt(0) || <User className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-slate-900 font-bold leading-none">{author?.name || 'Kalvian'}</h4>
            <p className="text-slate-400 text-xs mt-1">
              {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-900 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="text-slate-600 mb-6 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-slate-400 hover:text-red-500 transition-colors group">
            <Heart className="w-5 h-5 group-hover:fill-current" />
            <span className="text-sm font-medium">{likes || 0}</span>
          </button>
          <button className="flex items-center space-x-2 text-slate-400 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{comments?.length || 0}</span>
          </button>
        </div>
        <button className="text-slate-400 hover:text-slate-900 transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
