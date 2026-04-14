import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useHackathons } from '../../hooks/useHackathons';
import { applyToHackathon } from '../../services/hackathons.service';
import HackathonCard from '../../components/hackathons/HackathonCard';
import HackathonApplyModal from '../../components/hackathons/HackathonApplyModal';
import HackathonForm from '../../components/hackathons/HackathonForm';

import ErrorBanner from '../../components/shared/ErrorBanner';
import EmptyState from '../../components/shared/EmptyState';
import { Trophy, Search, PlusCircle } from 'lucide-react';


const HackathonsPage = () => {
  const { user } = useAuth();
  const { status, data, error, fetchHackathons } = useHackathons();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  useEffect(() => {
    fetchHackathons();
  }, [fetchHackathons]);

  const handleApplyClick = (hackathon) => {
    setSelectedHackathon(hackathon);
    setIsApplyModalOpen(true);
  };

  const handleApplySubmit = async (applicationData) => {
    try {
      const res = await applyToHackathon(selectedHackathon.id, applicationData);
      if (res.success) {
        alert("Application submitted successfully!");
        fetchHackathons();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
      throw err; // Re-throw to show error in modal
    }
  };


  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-[2.5rem] p-8 h-80 shadow-sm"></div>
          ))}
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div className="max-w-2xl mx-auto mt-12">
          <ErrorBanner message={error} onRetry={() => fetchHackathons()} />
        </div>
      );
    }

    if (status === 'success' && (!data || data.length === 0)) {
      return (
        <div className="mt-12 bg-white rounded-[2.5rem] p-16 border border-dashed border-slate-300 text-center">
          <EmptyState 
            title="No Hackathons found" 
            message="No active hackathons or opportunities right now. Be the first to post a new challenge!"
            onAction={() => setIsFormOpen(true)}
            actionLabel="Post New Opportunity"
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map(item => (
          <HackathonCard 
            key={item.id} 
            hackathon={item} 
            onApply={() => handleApplyClick(item)}
            onDelete={() => fetchHackathons()}
          />

        ))}

      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in slide-in-from-top duration-700 pb-12">
      <HackathonForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={() => fetchHackathons()} 
      />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="p-5 bg-kalvium rounded-[2rem] shadow-2xl shadow-kalvium/20 group">
            <Trophy className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 font-outfit tracking-tight">Exclusive <span className="text-kalvium">Hackathons</span></h1>
            <p className="text-slate-500 text-lg">Compete, collaborate, and win prizes in Kalvium-only challenges.</p>
          </div>
        </div>
        
          <button 
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center px-8 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 group"
          >
             <PlusCircle className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform" />
             Create New Opportunity
          </button>
      </div>

      <div className="bg-white border border-slate-200 p-2 rounded-2xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search active hackathons..." 
            className="w-full pl-12 pr-4 py-4 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium"
          />
        </div>
      </div>

      {renderContent()}

      <HackathonApplyModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleApplySubmit}
        hackathonTitle={selectedHackathon?.title}
      />
    </div>

  );
};

export default HackathonsPage;
