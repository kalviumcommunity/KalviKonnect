import React, { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, ListChecks, Flag, Terminal, Briefcase } from 'lucide-react';
import { analyzePlacement } from '../../services/placements.service';

const PlacementAIInsights = ({ placementId, initialData }) => {
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzePlacement(placementId);
      if (response.success && response.data) {
        setData(response.data);
      } else {
        // Backend returned 200 but AI failed internally
        setError(response.message || response.error || 'AI analysis is temporarily unavailable. Please try again shortly.');
      }
    } catch (err) {
      console.error('Placement AI Error:', err);
      const status = err.response?.status;
      if (status === 503) {
        setError('🤖 AI service is temporarily unavailable. This is usually due to API quota limits. Please try again in a few minutes.');
      } else if (status === 429) {
        setError('⏱️ Too many requests. Please wait a minute and try again.');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'AI preparation guide is temporarily unavailable.');
      }
    } finally {
      setLoading(false);
    }
  };

  const RoundTimeline = ({ rounds }) => (
    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-orange-100 before:to-transparent">
      {rounds.map((round, idx) => (
        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-orange-100 bg-white text-orange-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
            <span className="text-xs font-bold">{idx + 1}</span>
          </div>
          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-slate-50/30 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between space-x-2 mb-1">
              <div className="font-bold text-slate-800">{round.round}</div>
            </div>
            <div className="text-slate-500 text-xs mb-2 italic">Focus: {round.focus}</div>
            <p className="text-slate-600 text-sm leading-relaxed">{round.tips}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const Checklist = ({ checklist }) => (
    <div className="grid md:grid-cols-2 gap-6">
      {checklist.map((group, idx) => (
        <div key={idx} className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
            <ListChecks size={18} />
            <h4 className="font-bold text-sm tracking-tight">{group.category}</h4>
          </div>
          <ul className="space-y-3">
            {group.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 group cursor-default">
                <div className="mt-1 h-4 w-4 rounded border border-slate-300 bg-white flex items-center justify-center text-transparent group-hover:text-orange-500/30 transition-colors">
                  <CheckCircle2 size={12} />
                </div>
                <span className="text-sm text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  if (!data && !loading && !error) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-orange-50 rounded-3xl p-10 text-center border border-slate-100 shadow-sm mt-12 mb-12">
        <div className="bg-white p-4 rounded-full w-fit mx-auto mb-6 shadow-md border border-orange-100">
          <Briefcase className="text-orange-500" size={32} />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">AI Interview Structuring</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Transform this raw experience into a professional round-by-round breakdown and target preparation checklist using Gemini AI.
        </p>
        <button 
          onClick={handleGenerate}
          className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl flex items-center gap-3 mx-auto active:scale-95 group"
        >
          <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
          Generate Interview Roadmap
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 mt-12 mb-20 animate-in fade-in duration-700">
      <div className="flex items-center gap-3">
        <div className="h-[1px] bg-slate-200 grow" />
        <div className="flex items-center gap-2 px-6 py-2 bg-orange-50 border border-orange-100 rounded-full shadow-sm">
          <Sparkles size={16} className="text-orange-500" />
          <span className="text-xs font-black text-orange-600 uppercase tracking-widest">AI Intelligence Layer</span>
        </div>
        <div className="h-[1px] bg-slate-200 grow" />
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="animate-spin text-orange-500 mx-auto mb-6" size={48} />
          <h4 className="text-lg font-bold text-slate-700 animate-pulse">Structuring Experience...</h4>
          <p className="text-slate-400 text-sm mt-2">Gemini is mapping interview rounds and topics</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center bg-red-50 rounded-3xl border border-red-100">
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button 
            onClick={handleGenerate}
            className="bg-white text-red-600 border border-red-200 px-8 py-2 rounded-xl hover:bg-red-100 transition-colors font-bold text-sm"
          >
            Retry Analysis
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <Flag size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Interview Round Roadmap</h3>
                <p className="text-slate-400 text-sm">Step-by-step breakdown of the selection process</p>
              </div>
            </div>
            <RoundTimeline rounds={data.roundBreakdown} />
          </section>

          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <Terminal size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Personalized Prep Topics</h3>
                <p className="text-slate-400 text-sm">Targeted domains to focus your study sessions</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {data.prepTopics?.map((topic, idx) => (
                <span key={idx} className="bg-white border-2 border-slate-100 px-5 py-2.5 rounded-2xl text-sm font-bold text-slate-700 shadow-sm hover:border-blue-200 transition-colors cursor-default">
                  {topic}
                </span>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                <ListChecks size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Preparation Checklist</h3>
                <p className="text-slate-400 text-sm">Interactive list for your final pre-interview review</p>
              </div>
            </div>
            <Checklist checklist={data.prepChecklist} />
          </section>

          <div className="text-center pt-8">
             <button 
                onClick={handleGenerate}
                className="text-[10px] font-black text-slate-300 hover:text-orange-500 uppercase tracking-[0.2em] transition-colors"
              >
                Re-generate analysis
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementAIInsights;
