import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getUniversities = async () => {
  const response = await axios.get(`${API_URL}/universities`);
  return response.data;
};

export const updateOnboarding = async (token, universityId) => {
  const response = await axios.patch(
    `${API_URL}/users/me`,
    { universityId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
