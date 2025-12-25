import { db } from '@/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function useTodos() {
  return useLiveQuery(
    async () => {
      const tasks = (await db.table<Todo>('tasks').toArray()).sort(
        (a: Todo, b: Todo) => a.position - b.position,
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
