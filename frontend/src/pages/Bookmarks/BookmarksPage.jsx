import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const BookmarksPage = () => {
  const { token } = useContext(AuthContext);
  const [bookmarks, setBookmarks] = useState({ notes: [], placements: [], hackathons: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        // Group bookmarks by type
        const grouped = response.data.data.reduce((acc, current) => {
          if (current.note) acc.notes.push(current.note);
          if (current.placement) acc.placements.push(current.placement);
          if (current.hackathon) acc.hackathons.push(current.hackathon);
          return acc;
        }, { notes: [], placements: [], hackathons: [] });
        
        setBookmarks(grouped);
      }
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeBookmark = async (type, id) => {
    try {
      // Find the bookmark ID for this specific content
      const response = await axios.delete(`${API_URL}/bookmarks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setBookmarks(prev => ({
          ...prev,
          [type]: prev[type].filter(item => item.id !== id)
        }));
      }
    } catch (err) {
      console.error('Error removing bookmark:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-orange"></div>
      </div>
    );
  }

  const sections = [
    { id: 'notes', label: 'Saved Notes', items: bookmarks.notes, icon: '📝', link: '/notes' },
    { id: 'placements', label: 'Placement Stories', items: bookmarks.placements, icon: '💼', link: '/placements' },
    { id: 'hackathons', label: 'Hackathons', items: bookmarks.hackathons, icon: '🚀', link: '/hackathons' },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-orangeLight rounded-2xl border border-orange-100">
          <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Bookmarks</h1>
          <p className="text-slate-400 font-medium">Quick access to everything you've saved</p>
        </div>
      </div>

      <div className="space-y-12">
        {sections.map(section => (
          <section key={section.id}>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span>{section.icon}</span> {section.label}
              </h2>
              <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{section.items.length} items</span>
            </div>

            {section.items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map(item => (
                  <div key={item.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group relative">
                    <Link to={`${section.link}/${item.id}`} className="block">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 truncate group-hover:text-brand-orange transition-colors">
                        {item.title || item.company || item.name}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                        {item.content || item.description || item.role || 'No description available.'}
                      </p>
                    </Link>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={() => removeBookmark(section.id, item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                        title="Remove bookmark"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl py-12 text-center">
                <p className="text-slate-400 font-medium">Nothing saved here yet.</p>
                <Link to={section.link} className="text-brand-orange font-bold text-sm hover:underline mt-2 inline-block">Explore {section.label.toLowerCase()} →</Link>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default BookmarksPage;
