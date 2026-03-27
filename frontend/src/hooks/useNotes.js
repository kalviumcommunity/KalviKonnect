import { useState, useCallback, useEffect } from 'react';
import * as notesService from '../services/notes.service';

export const useNotes = () => {
  const [state, setState] = useState({
    status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    data: [],
    error: null,
    pagination: {
      page: 1,
      totalPages: 1,
      totalNotes: 0
    }
  });

  const fetchNotes = useCallback(async (params = {}) => {
    setState(prev => ({ ...prev, status: 'loading', error: null }));
    try {
      const result = await notesService.getNotes(params);
      // Backend shape from Milestone 4 usually: { success: true, count, pagination, data } 
      // or similar. Adjusting to a likely shape.
      setState({
        status: 'success',
        data: result.notes || [],
        error: null,
        pagination: {
          page: result.page,
          totalPages: result.totalPages,
          total: result.total,
          hasNextPage: result.hasNextPage
        }
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch notes';
      setState(prev => ({ ...prev, status: 'error', error: message }));
    }
  }, []);

  return { ...state, fetchNotes };
};
