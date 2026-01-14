import { syncTodos } from '@/data-fetchers/todos';

let syncTimer: number | null = null;

export function scheduleSync(todos: Todo[]) {
  if (syncTimer) clearTimeout(syncTimer);

  syncTimer = window.setTimeout(async () => {
    await syncTodos(todos);
  }, 4000);
}
