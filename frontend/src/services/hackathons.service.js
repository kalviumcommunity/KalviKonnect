import api from './api';

export const getHackathons = async (params) => {
  const response = await api.get('/hackathons', { params });
  return response.data;
};

export const createHackathon = async (hackathonData) => {
  const response = await api.post('/hackathons', hackathonData);
  return response.data;
};
