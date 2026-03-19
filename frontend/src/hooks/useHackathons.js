import { useState, useCallback } from 'react';
import * as hackathonsService from '../services/hackathons.service';

export const useHackathons = () => {
  const [state, setState] = useState({
    status: 'idle',
    data: [],
    error: null,
  });

  const fetchHackathons = useCallback(async (params = {}) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const result = await hackathonsService.getHackathons(params);
      setState({
        status: 'success',
        data: result.data || result.hackathons || [],
        error: null,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch hackathons';
      setState(prev => ({ ...prev, status: 'error', error: message }));
    }
  }, []);

  return { ...state, fetchHackathons };
};
