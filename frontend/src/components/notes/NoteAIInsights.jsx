import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronRight, Loader2, Award, Lightbulb, BookOpen } from 'lucide-react';
import { analyzeNote } from '../../services/notes.service';

const NoteAIInsights = ({ noteId, initialData }) => {
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({
    summary: true,
    keyPoints: false,
    topics: false
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await analyzeNote(noteId);
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error || 'AI analysis failed');
      }
    } catch (err) {
      console.error('AI Analysis Error:', err);
      setError(err.response?.data?.message || 'AI analysis is temporarily unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ id, title, icon: Icon, children, colorClass }) => (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between py-4 hover:bg-slate-50/50 transition-colors px-2 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon size={18} />
          </div>
          <span className="font-semibold text-slate-700">{title}</span>
        </div>
        {expanded[id] ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
      </button>
      {expanded[id] && (
        <div className="pb-6 pt-2 px-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );

  if (!data && !loading && !error) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-indigo-50 rounded-2xl p-8 text-center border border-orange-100 shadow-sm mt-8">
        <div className="bg-white p-3 rounded-2xl w-fit mx-auto mb-4 shadow-sm border border-orange-100">
          <Sparkles className="text-orange-500" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Academic AI Insights</h3>
        <p className="text-slate-600 mb-6 max-w-sm mx-auto">
          Generate a concise summary, key takeaways, and likely exam questions from these notes using Gemini AI.
        </p>
        <button 
          onClick={handleAnalyze}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 flex items-center gap-2 mx-auto active:scale-95"
        >
          <Sparkles size={18} />
          Analyze Notes
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mt-8 overflow-hidden">
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-orange-500 p-1.5 rounded-lg shadow-sm shadow-orange-200">
            <Sparkles size={16} className="text-white" />
          </div>
          <h3 className="font-bold text-slate-800 uppercase tracking-tight text-sm">AI Study Assistant</h3>
        </div>
        {data?.lastAnalyzed && (
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            Last Analyzed: {new Date(data.lastAnalyzed).toLocaleDateString()}
          </span>
        )}
      </div>

      <div className="p-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="text-orange-500 animate-spin" size={40} />
            <p className="text-slate-500 font-medium animate-pulse">Consulting the Academic Oracle...</p>
          </div>
        ) : error ? (
          <div className="py-12 px-6 text-center">
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <button 
              onClick={handleAnalyze}
              className="text-orange-500 font-bold border border-orange-200 px-6 py-2 rounded-xl hover:bg-orange-50 transition-colors"
            >
              Retry Analysis
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <Section 
              id="summary" 
              title="Concise Summary" 
              icon={BookOpen} 
              colorClass="bg-blue-50 text-blue-600"
            >
              <p className="text-slate-600 leading-relaxed text-sm">
                {data.summary}
              </p>
            </Section>

            <Section 
              id="keyPoints" 
              title="Key Takeaways" 
              icon={Award} 
              colorClass="bg-orange-50 text-orange-600"
            >
              <ul className="space-y-3">
                {data.keyPoints?.map((point, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-600">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section 
              id="topics" 
              title="Exam Topics & Questions" 
              icon={Lightbulb} 
              colorClass="bg-indigo-50 text-indigo-600"
            >
              <div className="flex flex-wrap gap-2">
                {data.topics?.map((topic, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-600 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                    {topic}
                  </span>
                ))}
                {data.examTopics?.map((topic, idx) => (
                  <span key={idx} className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-lg text-xs font-medium">
                    {topic}
                  </span>
                ))}
              </div>
            </Section>
            
            <button 
              onClick={handleAnalyze}
              className="mt-4 text-[10px] text-slate-400 hover:text-orange-500 transition-colors uppercase font-bold tracking-widest text-center"
            >
              Refresh Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteAIInsights;
