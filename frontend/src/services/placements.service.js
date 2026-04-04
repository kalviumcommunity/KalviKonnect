import api from './api';

export const getPlacements = async (params) => {
  const response = await api.get('/placements', { params });
  return response.data;
};

export const getPlacementById = async (id) => {
  const response = await api.get(`/placements/${id}`);
  return response.data;
};

export const analyzePlacement = async (id) => {
  const response = await api.post(`/placements/${id}/ai/analyze`);
  return response.data;
};
