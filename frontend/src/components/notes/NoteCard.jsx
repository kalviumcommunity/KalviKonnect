import React from 'react';
import { ThumbsUp, User, Tag, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note }) => {
  const { id, _id, title, content, description, tags, author, upvotes, createdAt } = note;
  const noteId = id || _id;
  const displayDescription = content || description || '';

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 hover:border-blue-500/50 transition-all group flex flex-col h-full shadow-lg hover:shadow-blue-500/5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <Tag className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
            {tags && tags[0] ? tags[0] : 'General'}
          </span>
        </div>
        <div className="flex items-center text-gray-400 text-xs">
          <Calendar className="w-3.5 h-3.5 mr-1" />
          {new Date(createdAt).toLocaleDateString()}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">
        {title}
      </h3>
      
      <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
        {displayDescription}
      </p>

      <div className="pt-4 border-t border-neutral-700 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-300">
            <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center mr-2">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm font-medium">{author?.name || 'Anonymous'}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-400">
              <ThumbsUp className="w-4 h-4 mr-1.5" />
              <span className="text-sm">{upvotes || 0}</span>
            </div>
            <Link 
              to={`/notes/${noteId}`}
              className="p-1.5 hover:bg-neutral-700 rounded-lg text-gray-400 hover:text-white transition-colors"
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
