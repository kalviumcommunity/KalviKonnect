import { useState, useCallback } from 'react';
import * as discussionsService from '../services/discussions.service';

export const useDiscussions = () => {
  const [state, setState] = useState({
    status: 'idle',
    data: [],
    error: null,
  });

  const fetchDiscussions = useCallback(async (params = {}) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const result = await discussionsService.getDiscussions(params);
      setState({
        status: 'success',
        data: result.data || result.discussions || [],
        error: null,
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch discussions';
      setState(prev => ({ ...prev, status: 'error', error: message }));
    }
  }, []);

  return { ...state, fetchDiscussions };
};
