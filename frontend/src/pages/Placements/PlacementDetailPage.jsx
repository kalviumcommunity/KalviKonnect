import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, ChevronLeft, ThumbsUp, User, Share2, Download } from 'lucide-react';
import * as placementsService from '../../services/placements.service';
import PlacementAIInsights from '../../components/placements/PlacementAIInsights';
import ErrorBanner from '../../components/shared/ErrorBanner';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const PlacementDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete this placement story?')) return;
    setDeleting(true);
    try {
      await placementsService.deletePlacement(id);
      navigate('/placements');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
      setDeleting(false);
    }
  };


  const fetchPlacement = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await placementsService.getPlacementById(id);
      if (response.success) {
        setPlacement(response.data);
      } else {
        throw new Error('Experience details not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load placement experience.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlacement();
  }, [fetchPlacement]);

  if (loading) return <LoadingSpinner size="h-12 w-12" text="Curating interview insights..." />;
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ErrorBanner message={error} onRetry={fetchPlacement} />
        <button 
          onClick={() => navigate('/placements')}
          className="mt-8 flex items-center text-slate-500 hover:text-kalvium transition-colors font-bold uppercase tracking-widest text-[10px]"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Placements
        </button>
      </div>
    );
  }

  if (!placement) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/placements')}
          className="flex items-center text-slate-400 hover:text-kalvium transition-colors group font-bold uppercase tracking-[0.2em] text-[10px]"
        >
          <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Experience Vault
        </button>

        {(user?.userId || user?.id) === placement?.author?.id && (
          <button 
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center px-6 py-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-all font-bold text-[10px] uppercase tracking-widest gap-2 border border-red-100"
          >
            DELETE STORY
          </button>
        )}
      </div>


      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 md:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 pb-10 border-b border-slate-50">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-kalvium shadow-inner border border-red-100">
                  <Building2 size={40} />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-none mb-3 font-outfit">
                    {placement.company}
                  </h1>
                  <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <span className="text-kalvium bg-red-50 px-2 py-1 rounded-lg">{placement.role}</span>
                    <span>•</span>
                    <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {placement.author?.name || 'Kalvian'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-10 overflow-hidden">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 font-outfit">Interview Narrative</h3>
              <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
                {placement.content}
              </div>
            </div>

            {placement.fileUrls && placement.fileUrls.length > 0 && (
              <div className="mt-12 pt-10 border-t border-slate-50">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6 pl-1">Supporting Assets ({placement.fileUrls.length})</h4>
                <div className="grid gap-3">
                  {placement.fileUrls.map((url, idx) => (
                    <a 
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-kalvium/30 hover:bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-kalvium/5 flex items-center justify-center text-kalvium group-hover:bg-kalvium group-hover:text-white transition-colors">
                          <Download size={18} />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Reference Asset #{idx + 1}</span>
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-300 group-hover:text-kalvium tracking-widest transition-colors">Direct Access</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            
            {/* Commented out AI Insights as per request */}
            {/* <div className="bg-slate-50 p-1 rounded-[2rem]">
               <PlacementAIInsights 
                placementId={id} 
                initialData={placement.aiAnalyzedAt ? {
                  roundBreakdown: placement.aiRoundBreakdown,
                  prepTopics: placement.aiPrepTopics,
                  prepChecklist: placement.aiPrepChecklist,
                  lastAnalyzed: placement.aiAnalyzedAt
                } : null}
              />
            </div> */}

          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-8 border-b border-slate-50 pb-4">Experience Stats</h4>
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Broadcast Date</span>
                <span className="font-bold text-slate-900 text-sm">{new Date(placement.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Community Impact</span>
                <div className="flex items-center gap-2">
                   <ThumbsUp size={16} className="text-kalvium" />
                   <span className="font-bold text-slate-900 text-sm">{placement.upvoteCount || 0} Upvotes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
             <h4 className="font-bold text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-8 border-b border-slate-50 pb-4">The Author</h4>
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 text-kalvium border border-slate-100 flex items-center justify-center font-bold text-xl shadow-inner">
                  {placement.author?.name?.charAt(0) || <User />}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg leading-tight">{placement.author?.name || 'Kalvian'}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">
                    {placement.author?.role || 'Student'}
                  </div>
                </div>
             </div>
          </div>
          
          <button className="w-full bg-slate-900 hover:bg-black py-5 rounded-2xl text-white font-bold text-sm transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group">
            <Share2 size={20} className="group-hover:rotate-12 transition-transform" />
            Empower Peers
          </button>
        </div>
      </div>
    </div>
  );
};
;

export default PlacementDetailPage;
