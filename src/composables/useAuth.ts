import { ref } from 'vue';
import { loginUser, registerUser } from '@/services/authService';

export function useAuth() {
  const username = ref('');
  const password = ref('');
  const error = ref('');
  const loading = ref(false);
  const isLoggedIn = ref(!!localStorage.getItem('token'));

  async function login() {
    error.value = '';
    loading.value = true;

    try {
      const response = await loginUser(username.value, password.value);
      const token = response.data.token;

      localStorage.setItem('token', token);
      isLoggedIn.value = true;
      window.location.href = '/dashboard';
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed.';
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
      await login(); // auto-login after registration
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed.';
      loading.value = false;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    isLoggedIn.value = false;
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  }

  function checkSession() {
    if (isLoggedIn.value) {
      window.location.href = '/dashboard';
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
