import api from './api';

export const getDiscussions = async (params) => {
  const response = await api.get('/discussions', { params });
  return response.data;
};

export const getDiscussionById = async (id) => {
  const response = await api.get(`/discussions/${id}`);
  return response.data;
};

export const replyToThread = async (id, content, isBlocker = false) => {
  const response = await api.post(`/discussions/${id}/reply`, { content, isBlocker });
  return response.data;
};
export const createThread = async (data) => {
  const response = await api.post('/discussions', data);
  return response.data;
};

export const deleteThread = async (id) => {
  const response = await api.delete(`/discussions/${id}`);
  return response.data;
};
