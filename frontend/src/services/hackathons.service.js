import api from './api';

export const getHackathons = async (params) => {
  const response = await api.get('/hackathons', { params });
  return response.data;
};

export const applyToHackathon = async (id, data) => {
  const response = await api.post(`/hackathons/${id}/apply`, data);
  return response.data;
};


export const updateHiringStatus = async (applicationId) => {
  const response = await api.patch(`/hackathons/applications/${applicationId}/hire`);
  return response.data;
};
export const createHackathon = async (data) => {
  const response = await api.post('/hackathons', data);
  return response.data;
};
export const deleteHackathon = async (id) => {
  const response = await api.delete(`/hackathons/${id}`);
  return response.data;
};
