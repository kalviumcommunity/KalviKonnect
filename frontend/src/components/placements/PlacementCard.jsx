import React, { useState } from 'react';
import { ThumbsUp, User, Building2, Briefcase, View, Download, Trash2, ExternalLink } from 'lucide-react';

import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { deletePlacement } from '../../services/placements.service';

const PlacementCard = ({ placement, onDelete }) => {
  const { user } = useAuth();
  const { id, _id, company, role, content, author, upvoteCount, createdAt, fileUrls } = placement;

  const placementId = id || _id;
  const [deleting, setDeleting] = useState(false);

  const isOwner = (user?.id || user?.userId) === author?.id;


  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm('Delete this placement story? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deletePlacement(placementId);
      if (onDelete) onDelete(placementId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-kalvium/5 transition-all group flex flex-col h-full shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-kalvium/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-kalvium/10 rounded-2xl">
            <Building2 className="w-5 h-5 text-kalvium" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-kalvium transition-colors font-outfit tracking-tight">{company}</h3>
            <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              <Briefcase className="w-3.5 h-3.5 mr-1.5" />
              {role}
            </div>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 hover:bg-red-50 rounded-xl text-slate-300 hover:text-red-500 transition-all"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-slate-600 text-sm mb-8 line-clamp-4 flex-grow leading-relaxed italic">
        "{content}"
      </p>

      {placement.fileUrls && placement.fileUrls.length > 0 && (
        <div className="space-y-2 mb-8 relative z-10">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Experience Assets ({placement.fileUrls.length})</p>
          {placement.fileUrls.map((url, idx) => (
            <a 
              key={idx}
              href={url} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-between w-full p-4 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-900/10 group/link active:scale-95"
            >
              <div className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                <span>Supporting Doc #{idx + 1}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-kalvium" />
            </a>
          ))}
        </div>
      )}


      <div className="pt-6 border-t border-slate-50 mt-auto relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-slate-600">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-3 border border-slate-200">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900">{author?.name || 'Anonymous'}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{new Date(createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-slate-400 group/vote cursor-pointer bg-slate-50 px-4 py-2 rounded-xl hover:bg-kalvium/10 hover:text-kalvium transition-colors border border-slate-100">
              <ThumbsUp className="w-4 h-4 mr-2" />
              <span className="text-xs font-bold">{upvoteCount || 0}</span>
            </div>
            <Link 
              to={`/placements/${placementId}`}
              className="p-3 hover:bg-kalvium/10 rounded-2xl text-slate-400 hover:text-kalvium transition-all border border-slate-200"
            >
              <View className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PlacementCard);
