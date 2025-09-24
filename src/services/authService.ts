import api from '@/utils/http';

export const loginUser = (username: string, password: string) =>
  api.post('/login', { username, password });

export const registerUser = (username: string, password: string) =>
  api.post('/register', { username, password });
