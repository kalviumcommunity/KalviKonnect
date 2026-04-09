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
  // Use FormData for file upload
  const formData = new FormData();
  Object.keys(noteData).forEach(key => {
    if (key === 'tags') {
      formData.append(key, JSON.stringify(noteData[key]));
    } else {
      formData.append(key, noteData[key]);
    }
  });

  const response = await api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
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
