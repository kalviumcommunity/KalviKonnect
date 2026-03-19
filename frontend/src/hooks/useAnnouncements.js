import { useState, useCallback } from 'react';
import * as announcementsService from '../services/announcements.service';

export const useAnnouncements = () => {
  const [state, setState] = useState({
    status: 'idle',
    data: [],
    error: null,
  });

  const fetchAnnouncements = useCallback(async () => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const result = await announcementsService.getAnnouncements();
      setState({
        status: 'success',
        data: result.data || result.announcements || [],
        error: null,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch announcements';
      setState(prev => ({ ...prev, status: 'error', error: message }));
    }
  }, []);

  return { ...state, fetchAnnouncements };
};
