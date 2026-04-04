import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink, Info, Award, MessageSquare, Megaphone, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import api from '../../services/api';

const NotificationDropdown = () => {
  const { notifications, setNotifications, unreadCount, setUnreadCount, markAsRead } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchInitialNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        if (response.data.success) {
          setNotifications(response.data.data);
          const unread = response.data.data.filter(n => !n.isRead).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchInitialNotifications();
  }, [setNotifications, setUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'UPVOTE': return <Award className="w-4 h-4 text-kalvium" />;
      case 'REPLY': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'ANNOUNCEMENT': return <Megaphone className="w-4 h-4 text-red-500" />;
      case 'HACKATHON': return <ExternalLink className="w-4 h-4 text-green-500" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-kalvium hover:border-kalvium transition-all shadow-sm active:scale-95"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-kalvium text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white border border-slate-200 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-5 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 font-outfit">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-[10px] font-bold text-slate-400 hover:text-kalvium uppercase tracking-widest transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Bell className="w-8 h-8 opacity-20" />
                </div>
                <p className="text-slate-400 text-sm font-medium">All caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 hover:bg-slate-50 transition-colors flex gap-4 ${!notification.isRead ? 'bg-red-50/30' : ''}`}
                  >
                    <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!notification.isRead ? 'bg-white shadow-sm border border-slate-100' : 'bg-slate-100'}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm font-bold truncate ${!notification.isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <button 
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-1 text-slate-300 hover:text-kalvium transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {notification.link && (
                          <Link 
                            to={notification.link}
                            onClick={() => {
                              setIsOpen(false);
                              if (!notification.isRead) handleMarkAsRead(notification.id);
                            }}
                            className="text-[10px] font-bold text-kalvium hover:underline uppercase tracking-widest"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
            <Link 
              to="/settings/notifications" 
              className="text-[10px] font-bold text-slate-400 hover:text-kalvium uppercase tracking-widest transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Notification Settings
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
