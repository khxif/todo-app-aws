import { apiClient } from './apiClient';

export const verifyAuth = async () => {
  const { data } = await apiClient.get('/auth/verify');
  return data;
};
