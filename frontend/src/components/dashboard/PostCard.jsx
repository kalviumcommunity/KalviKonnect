import React from 'react';
import { User, MessageCircle, Heart, Share2, MoreHorizontal } from 'lucide-react';

const PostCard = ({ post }) => {
  const { author, content, createdAt, likes, comments } = post;

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 shadow-lg hover:border-neutral-600 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500 font-bold border border-blue-500/20">
            {author?.name?.charAt(0) || <User className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="text-white font-bold leading-none">{author?.name || 'Kalvian'}</h4>
            <p className="text-gray-500 text-xs mt-1">
              {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-700">
        <div className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors group">
            <Heart className="w-5 h-5 group-hover:fill-current" />
            <span className="text-sm font-medium">{likes || 0}</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{comments?.length || 0}</span>
          </button>
        </div>
        <button className="text-gray-500 hover:text-white transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
