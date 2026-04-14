import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token (Protected against header leaks)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Only attach token to internal API requests
    // (A relative URL like '/notes' or a URL starting with API_BASE_URL)
    const isInternalRequest = !config.url.startsWith('http') || config.url.startsWith(API_BASE_URL);

    if (token && isInternalRequest) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and let 403 pass to UI
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Log out immediately
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // 403 is intentionally not caught here so individual pages can show toasts/errors
    }
    return Promise.reject(error);
  }
);

export default api;
