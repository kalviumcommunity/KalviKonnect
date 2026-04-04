import api from './api';

export const getHackathons = async (params) => {
  const response = await api.get('/hackathons', { params });
  return response.data;
};

export const applyToHackathon = async (id, portfolioLink) => {
  const response = await api.post(`/hackathons/${id}/apply`, { portfolioLink });
  return response.data;
};

export const updateHiringStatus = async (hackathonId, studentId, status) => {
  const response = await api.patch(`/hackathons/${hackathonId}/hired`, { studentId, status });
  return response.data;
};
