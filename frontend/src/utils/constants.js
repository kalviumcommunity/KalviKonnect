export const API_BASE_URL = import.meta.env.VITE_API_URL;

export const ROLES = {
  STUDENT: 'STUDENT',
  MENTOR: 'MENTOR',
  MANAGER: 'CAMPUS_MANAGER',
};

export const ASYNC_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};
