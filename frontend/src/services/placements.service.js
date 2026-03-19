import api from './api';

export const getPlacements = async (params) => {
  const response = await api.get('/placements', { params });
  return response.data;
};

export const createPlacement = async (placementData) => {
  const response = await api.post('/placements', placementData);
  return response.data;
};
