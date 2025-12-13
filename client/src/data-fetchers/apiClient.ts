import { tokenStorage } from '@/stores/token-store';
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:8888/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = tokenStorage.get();
  if (token) config.headers.authorization = token;

  return config;
});
