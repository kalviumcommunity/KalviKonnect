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
      // Handle response structure { success: true, data: { announcements: [], total: 0 } }
      const announcementsArray = result.data?.announcements || result.announcements || result.data || [];
      setState({
        status: 'success',
        data: Array.isArray(announcementsArray) ? announcementsArray : [],
        error: null,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch announcements';
      setState(prev => ({ ...prev, status: 'error', error: message }));
    }
  }, []);

  return { ...state, fetchAnnouncements };
};
