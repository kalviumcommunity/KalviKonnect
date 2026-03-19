import React from 'react';
import { Calendar, Users, Trophy, ChevronRight, CheckCircle2, Clock } from 'lucide-react';

const HackathonCard = ({ hackathon }) => {
  const { _id, title, description, date, status, participantsCount, prizePool } = hackathon;
  const isOpen = status === 'Open' || status === 'active';

  return (
    <div className="group bg-neutral-800 border border-neutral-700 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all shadow-xl flex flex-col">
      <div className="h-48 bg-neutral-900 relative p-6 flex flex-col justify-end">
        <div className="absolute top-6 left-6">
          <span className={`flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${isOpen ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {isOpen ? <CheckCircle2 className="w-3 h-3 mr-1.5" /> : <Clock className="w-3 h-3 mr-1.5" />}
            {status}
          </span>
        </div>
        <div className="absolute top-6 right-6 p-3 bg-neutral-800 rounded-2xl border border-neutral-700 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
          <Trophy className="w-6 h-6 text-blue-500 group-hover:text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white font-outfit group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
      </div>

      <div className="p-6 space-y-4 flex-grow flex flex-col">
        <p className="text-gray-400 text-sm line-clamp-2">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-4 h-4 mr-2 text-blue-500" />
            {new Date(date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Users className="w-4 h-4 mr-2 text-blue-500" />
            {participantsCount || 0} Joined
          </div>
        </div>

        <div className="mt-auto pt-6">
          <button className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center ${isOpen ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20' : 'bg-neutral-700 text-gray-400 cursor-not-allowed'}`}>
            {isOpen ? 'Register Now' : 'Closed'}
            {isOpen && <ChevronRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HackathonCard;
