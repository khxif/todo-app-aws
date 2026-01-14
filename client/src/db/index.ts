import { scheduleSync } from '@/lib/sync-todos';
import Dexie from 'dexie';

export const db = new Dexie('todo-db');

db.version(1).stores({
  tasks: 'id, status, position, syncStatus',
});

export async function getTodos() {
  const tasks = (await db.table<Todo>('tasks').toArray()).sort((a, b) => a.position - b.position);

  return {
    todos: tasks.filter(t => t.status === 'todo'),
    inProgress: tasks.filter(t => t.status === 'inProgress'),
    done: tasks.filter(t => t.status === 'done'),
  };
}

export async function getUnsyncedTodos() {
  return await db.table<Todo>('tasks').where('syncStatus').notEqual("synced").toArray();
}

export async function addTodos(todo: string) {
  const task: Todo = {
    id: crypto.randomUUID(),
    todo,
    status: 'todo',
    position: Date.now(),
    syncStatus: 'new',
  };

  await db.table<Todo>('tasks').add(task);
  scheduleSync(await getUnsyncedTodos());

  return task;
}

export async function updateTodoStatus(id: string, status: TodoStatus) {
  await db.table<Todo>('tasks').update(id, { status, syncStatus: 'updated' });
  scheduleSync(await getUnsyncedTodos());
}

export async function updateTodoPosition(id: string, position: number) {
  await db.table<Todo>('tasks').update(id, { position, syncStatus: 'updated' });
  scheduleSync(await getUnsyncedTodos());
}
