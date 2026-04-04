import React from 'react';
import { MessageSquare, User, Clock, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThreadCard = ({ thread }) => {
  const { id, title, content, author, replyCount, createdAt, tags } = thread;

  return (
    <Link to={`/discussions/${id}`} className="block h-full">
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 hover:border-kalvium/30 hover:shadow-xl hover:shadow-kalvium/5 transition-all cursor-pointer group flex flex-col h-full shadow-sm">
        <div className="flex items-start justify-between mb-4 gap-4">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-kalvium transition-colors line-clamp-2 font-outfit leading-snug">
            {title}
          </h3>
          <div className="flex items-center space-x-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 flex-shrink-0">
            <MessageCircle className="w-4 h-4 text-kalvium" />
            <span className="text-sm font-bold">{replyCount || 0}</span>
          </div>
        </div>

        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
          {content}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {tags?.map((t, idx) => (
            <span key={idx} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              {t.tag?.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden shadow-inner">
              {author?.name?.charAt(0) || <User className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">{author?.name || 'Kalvian'}</p>
              <div className="flex items-center text-[10px] text-slate-400 mt-1 font-medium">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
          
          <div className="text-kalvium opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;
