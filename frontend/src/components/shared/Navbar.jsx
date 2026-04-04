import { LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

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

      <div className="flex items-center space-x-5">
        <NotificationDropdown />
        
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
