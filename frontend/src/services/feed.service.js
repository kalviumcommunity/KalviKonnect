import api from './api';

export const getDashboardFeed = async (page = 1) => {
  const response = await api.get(`/feed/dashboard?page=${page}`);
  return response.data;
};
