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
export const createPlacement = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== undefined && data[key] !== null) {
      formData.append(key, data[key]);
    }
  });

  const response = await api.post('/placements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deletePlacement = async (id) => {
  const response = await api.delete(`/placements/${id}`);
  return response.data;
};
