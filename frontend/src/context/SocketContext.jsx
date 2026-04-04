import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
        withCredentials: true,
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        newSocket.emit('join_user', user.id);
      });

      newSocket.on('new_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Browser Notification if permitted
        if (Notification.permission === 'granted') {
          new NativeNotification(notification.title, {
            body: notification.message,
            icon: '/favicon.ico'
          });
        }
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  const markAsRead = useCallback((notificationId) => {
     setNotifications(prev => prev.map(n => 
       n.id === notificationId ? { ...n, isRead: true } : n
     ));
     setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadCount, setNotifications, setUnreadCount, markAsRead }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
