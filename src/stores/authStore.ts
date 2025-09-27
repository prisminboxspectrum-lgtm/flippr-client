import { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';

import { loginUser, registerUser } from '@/services/authService';
import { useDeckStore } from '@/stores/deckStore';
import type { JwtPayload } from '@/types/jwt';
import { resetSessionExpiredFlag } from '@/utils/session';

export const useAuthStore = defineStore('authStore', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<JwtPayload | null>(null);
  const loading = ref(false);
  const error = ref('');

  // Decode token on init
  const decodeToken = (tokenValue: string) => {
    try {
      const decoded = jwtDecode<JwtPayload>(tokenValue);
      if (decoded.exp < Date.now() / 1000) throw new Error('Token expired');
      user.value = decoded;
      return true;
    } catch {
      token.value = null;
      user.value = null;
      return false;
    }
  };

  if (token.value) decodeToken(token.value);

  const isLoggedIn = computed(() => !!token.value);
  const isTokenExpired = computed(() => {
    if (!token.value || !user.value) return true;
    return user.value.exp < Date.now() / 1000;
  });

  watch(token, (newToken) => {
    if (newToken) decodeToken(newToken);
    else user.value = null;
  });

  const resetDeckStore = () => useDeckStore().resetStore();

  async function login(username: string, password: string) {
    error.value = '';
    loading.value = true;
    try {
      const response = await loginUser(username, password);
      const tokenValue = response.data.token;

      if (!decodeToken(tokenValue)) {
        error.value = 'Received invalid token';
        return { success: false };
      }

      localStorage.setItem('token', tokenValue);
      token.value = tokenValue;
      resetDeckStore();
      resetSessionExpiredFlag();
      return { success: true };
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      error.value = axiosError.response?.data?.message || 'Login failed.';
      return { success: false };
    } finally {
      loading.value = false;
    }
  }

  async function register(username: string, password: string, confirmPassword: string) {
    error.value = '';
    loading.value = true;

    if (password !== confirmPassword) {
      error.value = 'Passwords do not match.';
      loading.value = false;
      return { success: false };
    }

    try {
      await registerUser(username, password);
      return await login(username, password);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      error.value = axiosError.response?.data?.message || 'Registration failed.';
      return { success: false };
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    token.value = null;
    user.value = null;
    error.value = '';
    resetDeckStore();
  }

  function clearError() {
    error.value = '';
  }

  return {
    token,
    user,
    loading,
    error,
    isLoggedIn,
    isTokenExpired,
    login,
    register,
    logout,
    clearError,
  };
});
