import React, { useState } from 'react';
import { LogOut, User, Menu, X, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center">
        <button 
          onClick={onMenuToggle}
          className="p-2 mr-2 text-slate-500 hover:text-slate-900 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-kalvium font-outfit lg:hidden">KalviConnect</span>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-slate-400 hover:text-kalvium transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-kalvium rounded-full"></span>
        </button>
        
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
