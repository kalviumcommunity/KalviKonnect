import React, { useState } from 'react';
import { Calendar, Users, Trophy, ChevronRight, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { deleteHackathon } from '../../services/hackathons.service';

const HackathonCard = ({ hackathon, onApply, onDelete }) => {
  const { user } = useAuth();
  const { id, title, description, deadline, status, company, _count, author } = hackathon;
  const [deleting, setDeleting] = useState(false);
  const isOpen = status === 'OPEN' || status === 'ACTIVE' || status === 'active';
  const participantsCount = (_count?.applications || 0) + 1; // Include creator as first member

  const isOwner = (user?.id || user?.userId) === author?.id;


  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm('Delete this opportunity? This will also remove all applications.')) return;
    setDeleting(true);
    try {
      await deleteHackathon(id);
      if (onDelete) onDelete(id);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
      setDeleting(false);
    }
  };

  return (
    <div className="group bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-kalvium/30 transition-all shadow-sm hover:shadow-xl hover:shadow-kalvium/5 flex flex-col h-full animate-in fade-in zoom-in-95 duration-500 relative">
      <div className="h-44 bg-slate-50 relative p-8 flex flex-col justify-end overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-40 h-40 bg-kalvium/5 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
        
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${isOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {isOpen ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
            {status}
          </span>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 bg-white hover:bg-red-50 rounded-xl text-slate-300 hover:text-red-500 border border-slate-100 transition-all shadow-sm"
              title="Delete Opportunity"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="absolute top-6 right-6 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm group-hover:bg-kalvium group-hover:border-kalvium group-hover:shadow-kalvium/20 group-hover:scale-110 transition-all duration-300">
          <Trophy className="w-6 h-6 text-kalvium group-hover:text-white" />
        </div>

        <div className="relative z-10">
          <p className="text-kalvium text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{company || 'Kalvium Exclusive'}</p>
          <h3 className="text-2xl font-bold text-slate-900 font-outfit group-hover:text-kalvium transition-colors line-clamp-1">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-8 space-y-6 flex-grow flex flex-col">
        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between py-4 border-y border-slate-50">
          <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <Calendar className="w-4 h-4 mr-2 text-kalvium" />
          {deadline ? new Date(deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
          </div>
          <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <Users className="w-4 h-4 mr-2 text-kalvium" />
            {participantsCount || 0} Joined
          </div>
        </div>

        <div className="mt-auto pt-2">
          {isOwner ? (
            <div className="w-full py-4 rounded-2xl font-bold bg-slate-50 text-slate-500 border border-slate-200 flex items-center justify-center cursor-default">
               Manage Applications
            </div>
          ) : (
            <button 
              disabled={!isOpen}
              onClick={() => onApply(id)}
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg active:scale-95 group/btn ${
                isOpen 
                  ? 'bg-slate-900 text-white hover:bg-kalvium shadow-slate-900/10 hover:shadow-kalvium/20' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200'
              }`}
            >
              {isOpen ? 'Register Now' : 'Event Closed'}
              {isOpen && <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default React.memo(HackathonCard);
