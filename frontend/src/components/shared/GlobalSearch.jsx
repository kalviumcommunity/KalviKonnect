import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, FileText, Briefcase, MessageSquare, Terminal, ArrowRight, Loader2, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import debounce from 'lodash/debounce';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await api.get(`/search?q=${searchQuery}`);
        if (response.data.success) {
          setResults(response.data.data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (result) => {
    navigate(result.link);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-6">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center gap-4">
          <Search className="w-6 h-6 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search notes, placements, or discussions..."
            className="flex-1 bg-transparent border-none text-xl font-medium text-slate-900 placeholder:text-slate-400 focus:ring-0 outline-none font-outfit"
          />
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="w-5 h-5 text-kalvium animate-spin" />}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
          {query.length < 2 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Command className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold mb-2">OmniSearch Discovery</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                Start typing to instantly find resources shared by the Kalvian community.
              </p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 font-medium italic">No matches found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${selectedIndex === index ? 'bg-slate-50 border-slate-200 shadow-sm' : 'border-transparent'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                    result.type === 'NOTE' ? 'bg-red-50 text-kalvium border-red-100' :
                    result.type === 'PLACEMENT' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    result.type === 'DISCUSSION' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                    'bg-green-50 text-green-600 border-green-100'
                  }`}>
                    {result.type === 'NOTE' && <FileText size={22} />}
                    {result.type === 'PLACEMENT' && <Briefcase size={22} />}
                    {result.type === 'DISCUSSION' && <MessageSquare size={22} />}
                    {result.type === 'HACKATHON' && <Terminal size={22} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate">{result.title}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {result.subtitle} • {result.type}
                    </p>
                  </div>
                  <ArrowRight className={`w-5 h-5 transition-transform ${selectedIndex === index ? 'translate-x-0 opacity-100 text-kalvium' : '-translate-x-2 opacity-0'}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-900">↑↓</span>
              Navigate
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-900">Enter</span>
              Select
            </div>
          </div>
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">
            KalviConnect Unified Discovery
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
