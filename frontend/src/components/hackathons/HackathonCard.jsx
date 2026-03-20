import React from 'react';
import { Calendar, Users, Trophy, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

const HackathonCard = ({ hackathon }) => {
  const { id, _id, title, description, date, status, participantsCount, prizePool } = hackathon;
  const hackId = id || _id;
  const isOpen = status === 'Open' || status === 'active';

  return (
    <div className="group bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all shadow-sm hover:shadow-md flex flex-col">
      <div className="h-48 bg-slate-50 relative p-6 flex flex-col justify-end overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute top-6 left-6">
          <span className={`flex items-center px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${isOpen ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
            {isOpen ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
            {status}
          </span>
        </div>
        <div className="absolute top-6 right-6 p-2.5 bg-white rounded-2xl border border-slate-200 shadow-sm group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:shadow-blue-600/20 transition-all">
          <Trophy className="w-6 h-6 text-blue-600 group-hover:text-white" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 font-outfit group-hover:text-blue-600 transition-colors relative z-10">
          {title}
        </h3>
      </div>

      <div className="p-6 space-y-4 flex-grow flex flex-col">
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {new Date(date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right justify-end">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            {participantsCount || 0} Joined
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button className={`w-full py-3.5 rounded-2xl font-bold transition-all flex items-center justify-center shadow-lg active:scale-[0.98] ${isOpen ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200'}`}>
            {isOpen ? 'Register Now' : 'Closed'}
            {isOpen && <ChevronRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;
