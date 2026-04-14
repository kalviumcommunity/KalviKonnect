import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  Trophy, 
  MessageSquare, 
  Megaphone,
  Calendar,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Learning Resources', icon: BookOpen, path: '/notes' },
    { name: 'Placements', icon: Briefcase, path: '/placements' },
    { name: 'Hackathons', icon: Trophy, path: '/hackathons' },
    { name: 'Discussions', icon: MessageSquare, path: '/discussions' },
    { name: 'Announcements', icon: Megaphone, path: '/announcements' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden" 
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Content */}
      <aside className={`fixed lg:sticky top-0 h-screen inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 shrink-0">

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded flex items-center justify-center">
              <img src="/logo.jpeg" alt="Kalvium" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold text-slate-900 font-outfit">KalviConnect</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 rounded-lg transition-all group ${
                  isActive 
                    ? 'bg-kalvium/10 text-kalvium font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 mr-3 transition-colors ${
                    isActive ? 'text-kalvium' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span className="text-sm">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-900 mb-1 uppercase tracking-wider">Upcoming</p>
            <p className="text-xs text-slate-500 mb-3">Join the next exclusive hackathon today!</p>
            <button 
              onClick={() => {
                navigate('/calendar');
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full py-2 bg-white border border-slate-200 hover:border-kalvium hover:text-kalvium text-xs font-bold rounded-lg transition-all shadow-sm"
            >
              View Calendar
            </button>
          </div>
        </div>
        </div>
      </aside>

    </>
  );
};

export default Sidebar;
