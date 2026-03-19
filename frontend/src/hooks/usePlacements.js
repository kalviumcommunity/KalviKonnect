import { useState, useCallback } from 'react';
import * as placementsService from '../services/placements.service';

export const usePlacements = () => {
  const [state, setState] = useState({
    status: 'idle',
    data: [],
    error: null,
  });

  const fetchPlacements = useCallback(async (params = {}) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const result = await placementsService.getPlacements(params);
      setState({
        status: 'success',
        data: result.data || result.placements || [],
        error: null,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch placements';
      setState(prev => ({ ...prev, status: 'error', error: message }));
    }
  }, []);

  return { ...state, fetchPlacements };
};
