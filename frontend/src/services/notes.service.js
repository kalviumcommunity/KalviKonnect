import api from './api';

export const getNotes = async (params) => {
  const response = await api.get('/notes', { params });
  return response.data;
};

export const getNoteById = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

export const upvoteNote = async (id) => {
  const response = await api.post(`/upvotes`, { noteId: id });
  return response.data;
};

export const analyzeNote = async (id) => {
  const response = await api.post(`/notes/${id}/ai/analyze`);
  return response.data;
};
