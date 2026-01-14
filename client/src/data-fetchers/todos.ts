import { apiClient } from './apiClient';

export async function syncTodos(todos: Todo[]) {
  const { data } = await apiClient.post('/todos/sync', { todos });
  return data;
}
