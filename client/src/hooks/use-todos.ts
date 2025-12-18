import { useLiveQuery } from 'dexie-react-hooks';
import { db, Task } from '@/db';

export function useTodos() {
  return useLiveQuery(
    async () => {
      const tasks = (await db.table<Task>('tasks').toArray()).sort(
        (a, b) => a.position - b.position,
      );
      console.log(tasks);

      return {
        todos: tasks.filter(t => t.status === 'todo'),
        inProgress: tasks.filter(t => t.status === 'inProgress'),
        done: tasks.filter(t => t.status === 'done'),
      };
    },
    [],
    {
      todos: [],
      inProgress: [],
      done: [],
    },
  );
}
