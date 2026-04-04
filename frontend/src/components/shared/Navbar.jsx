import React, { useState, useEffect } from 'react';
import { LogOut, User, Menu, X, Search, Command } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';
import GlobalSearch from './GlobalSearch';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className="h-[72px] bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuToggle}
          className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 hover:text-kalvium lg:hidden transition-all active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-2xl font-black text-slate-900 font-outfit lg:hidden tracking-tighter italic">
          K<span className="text-kalvium">C</span>
        </span>
      </div>

      {/* Global Search Trigger */}
      <button 
        onClick={() => setIsSearchOpen(true)}
        className="hidden md:flex items-center gap-6 px-6 py-2.5 bg-slate-50 border border-slate-200/60 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all group w-80 lg:w-96"
      >
        <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-medium flex-1 text-left">OmniSearch...</span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black tracking-widest text-slate-400">
          <Command className="w-2.5 h-2.5" />
          K
        </div>
      </button>

      <div className="flex items-center space-x-5">
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-kalvium md:hidden transition-all active:scale-95"
        >
          <Search className="w-5 h-5" />
        </button>
        <NotificationDropdown />
        <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        
        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold overflow-hidden shadow-sm">
            {user?.name?.charAt(0) || <User className="w-5 h-5 text-slate-400" />}
          </div>
          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-kalvium transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
