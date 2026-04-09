import api from './api';

export const getHackathons = async (params) => {
  const response = await api.get('/hackathons', { params });
  return response.data;
};

export const applyToHackathon = async (id, portfolioLink) => {
  const response = await api.post(`/hackathons/${id}/apply`, { portfolioLink });
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
