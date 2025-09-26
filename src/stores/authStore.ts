// stores/authStore.ts
import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { loginUser, registerUser } from '@/services/authService';
import { useDeckStore } from '@/stores/deckStore';

export const useAuthStore = defineStore('authStore', () => {
  // State
  const error = ref('');
  const loading = ref(false);
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref(null);

  // Computed
  const isLoggedIn = computed(() => !!token.value);

  // Helper function
  function resetDeckStore() {
    const deckStore = useDeckStore();
    deckStore.resetStore();
  }

  // Login
  async function login(username: string, password: string) {
    error.value = '';
    loading.value = true;

    try {
      const response = await loginUser(username, password);
      const tokenValue = response.data.token;
      localStorage.setItem('token', tokenValue);
      token.value = tokenValue;
      resetDeckStore();
      return { success: true };
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      error.value = axiosError.response?.data?.message || 'Login failed.';
      return { success: false };
    } finally {
      loading.value = false;
    }
  }

  // Register
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
      // Auto-login after registration - same as your logic
      const loginResult = await login(username, password);
      return loginResult;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      error.value = axiosError.response?.data?.message || 'Registration failed.';
      return { success: false };
    } finally {
      loading.value = false;
    }
  }

  // Logout - same as your composable logout function
  function logout() {
    localStorage.removeItem('token');
    token.value = null;
    user.value = null;
    error.value = '';
    resetDeckStore();
  }

  // Helper to clear errors (useful for forms)
  function clearError() {
    error.value = '';
  }

  return {
    // State
    error,
    loading,
    token,
    user,
    // Getters
    isLoggedIn,
    // Actions
    login,
    register,
    logout,
    clearError,
  };
});
