import React from 'react';
import { MessageSquare, User, Clock, ArrowUpCircle } from 'lucide-react';

const ThreadCard = ({ thread }) => {
  const { title, content, author, replyCount, createdAt } = thread;

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center space-x-2 text-gray-500 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-700">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-bold">{replyCount || 0}</span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-6 line-clamp-2">
        {content}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-neutral-700 mt-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-gray-400">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{author?.name || 'Anonymous'}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              {new Date(createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <button className="flex items-center text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
          View Thread
          <ArrowUpCircle className="w-4 h-4 ml-2 rotate-45" />
        </button>
      </div>
    </div>
  );
};

export default ThreadCard;
