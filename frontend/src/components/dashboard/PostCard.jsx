import React, { useState } from 'react';
import { User, Heart, MoreHorizontal, Globe } from 'lucide-react';
import { toggleLike, deletePost } from '../../services/post.service';
import { useAuth } from '../../hooks/useAuth';


const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const { id, author, content, createdAt, likeCount: initialLikeCount, scope, hasLiked: initialHasLiked } = post;
  const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
  const [hasLiked, setHasLiked] = useState(initialHasLiked || false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthor = user?.userId === author?.id || user?.id === author?.id;

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

  const handleDelete = async () => {
    if (!window.confirm('Delete this broadcast? This cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await deletePost(id);
      if (onDelete) onDelete();
    } catch (err) {
      alert('Failed to delete post');
      setIsDeleting(false);
    }
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-kalvium/20 transition-all ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-kalvium font-bold border border-slate-200 overflow-hidden shadow-inner uppercase tracking-widest text-xs">
            {author?.name?.charAt(0) || <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-slate-900 font-bold leading-none font-outfit">{author?.name || 'Kalvian'}</h4>
              <Globe className="w-3 h-3 text-kalvium opacity-50" />
            </div>
            <p className="text-slate-400 text-[10px] mt-1 font-black uppercase tracking-widest">
              {new Date(createdAt).toLocaleDateString(undefined, { 
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-slate-900 transition-colors p-1.5 hover:bg-slate-50 rounded-lg"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showMenu && isAuthor && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">
              <button 
                onClick={handleDelete}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors flex items-center"
              >
                Delete Broadcast
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-slate-600 mb-6 leading-relaxed whitespace-pre-wrap text-[15px] font-medium pl-1">
        {content}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
        <div className="flex items-center">
          <button 
            onClick={handleToggleLike}
            className={`flex items-center space-x-2 transition-all group p-2 rounded-xl ${
              hasLiked ? 'text-kalvium bg-red-50 border border-red-100' : 'text-slate-400 hover:text-kalvium hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : 'group-hover:fill-current'}`} />
            <span className="text-sm font-bold">{likeCount}</span>
          </button>
        </div>
        <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
        </div>
      </div>
    </div>
  );
};


export default React.memo(PostCard);
