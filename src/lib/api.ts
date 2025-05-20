import axios from 'axios';

const api = axios.create({
  baseURL: 'https://money2025-api01peak.krkzfx.easypanel.host'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.Authorization;
    }
    return Promise.reject(error);
  }
);

export default api;