import api from './api';

export const getPosts = async (scope = 'COLLEGE', cursor = null) => {
  const url = `/posts?scope=${scope}${cursor ? `&cursor=${cursor}` : ''}`;
  const response = await api.get(url);
  return response.data;
};

export const createPost = async (content, scope = 'COLLEGE') => {
  const response = await api.post('/posts', { content, scope });
  return response.data;
};

export const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

export const toggleLike = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};
