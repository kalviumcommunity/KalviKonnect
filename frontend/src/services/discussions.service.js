import api from './api';

export const getDiscussions = async (params) => {
  const response = await api.get('/discussions', { params });
  return response.data;
};

export const createThread = async (threadData) => {
  const response = await api.post('/discussions', threadData);
  return response.data;
};
