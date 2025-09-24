import { AxiosError } from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { loadDecksBatch } from '@/composables/useDecks';
import { loginUser, registerUser } from '@/services/authService';

export function useAuth() {
  const router = useRouter();

  const username = ref('');
  const password = ref('');
  const error = ref('');
  const loading = ref(false);
  const isLoggedIn = ref(!!localStorage.getItem('token'));

  async function preloadDashboardData() {
    try {
      await loadDecksBatch(0, 12);
    } catch (err) {
      console.warn('Deck preload failed:', err);
    }
  }

  async function login() {
    error.value = '';
    loading.value = true;

    try {
      const response = await loginUser(username.value, password.value);
      const token = response.data.token;

      localStorage.setItem('token', token);
      isLoggedIn.value = true;

      await preloadDashboardData();
      router.push('/dashboard');
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      error.value = axiosError.response?.data?.message || 'Login failed.';
    } finally {
      loading.value = false;
    }
  }

  async function register(confirmPassword: string) {
    error.value = '';
    loading.value = true;

    if (password.value !== confirmPassword) {
      error.value = 'Passwords do not match.';
      loading.value = false;
      return;
    }

    try {
      await registerUser(username.value, password.value);
      await login();
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      error.value = axiosError.response?.data?.message || 'Registration failed.';
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    isLoggedIn.value = false;
    router.push('/login');
  }

  function checkSession() {
    if (isLoggedIn.value) {
      router.push('/dashboard');
    }
  }

  return {
    username,
    password,
    error,
    loading,
    isLoggedIn,
    login,
    register,
    logout,
    checkSession,
  };
}
