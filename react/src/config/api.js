import axios from 'axios';

const LOCALHOST = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5454';
export const API_BASE_URL = LOCALHOST;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

// ✅ Thêm phần này: tự động logout khi token hết hạn
api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 500) {
        const msg = error.response?.data?.message || '';
        if (msg.includes('token') || msg.includes('jwt') || msg.includes('expired')) {
          localStorage.removeItem('jwt');
          window.location.href = '/';
        }
      }
      return Promise.reject(error);
    }
);

api.defaults.headers.post['Content-Type'] = 'application/json';

export default api;