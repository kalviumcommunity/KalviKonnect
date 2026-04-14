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
  // Commented out AI Analysis as per request
  return { success: false, message: "AI Analysis is currently disabled." };
  // const response = await api.post(`/placements/${id}/ai/analyze`);
  // return response.data;
};

export const createPlacement = async (data) => {
  const response = await api.post('/placements', data);
  return response.data;
};


export const deletePlacement = async (id) => {
  const response = await api.delete(`/placements/${id}`);
  return response.data;
};
