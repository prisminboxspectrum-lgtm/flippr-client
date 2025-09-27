import axios from 'axios';

import { useAuthStore } from '@/stores/authStore';
import { notifySessionExpired } from '@/utils/session';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  // Only notify if token is missing or expired AND we're not in the middle of login
  if (authStore.isTokenExpired && !authStore.loading) {
    authStore.logout();
    notifySessionExpired();
    return Promise.reject(new axios.Cancel('Token expired'));
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore();
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      authStore.logout();
      notifySessionExpired(); // toast only once
    }

    return Promise.reject(error);
  }
);

export default api;
