import Dexie from 'dexie';
import { generateKeyBetween } from 'fractional-indexing';

export const db = new Dexie('todo-db');

db.version(1).stores({
  tasks: 'id, status, position',
});

export async function getTodos() {
  const tasks = (await db.table<Todo>('tasks').toArray()).sort((a, b) =>
    a.position.localeCompare(b.position),
  );

  return {
    todos: tasks.filter(t => t.status === 'todo'),
    inProgress: tasks.filter(t => t.status === 'inProgress'),
    done: tasks.filter(t => t.status === 'done'),
  };
}

export async function insertTask(todo: string) {
  const lastTodo = await db.table<Todo>('tasks').where('status').equals('todo').last();
  const task: Todo = {
    id: crypto.randomUUID(),
    todo,
    status: 'todo',
    position: generateKeyBetween(lastTodo?.position ?? null, null),
  };

  await db.table<Todo>('tasks').add(task);

  return task;
}

export async function updateTodoStatus(id: string, status: TodoStatus) {
  await db.table<Todo>('tasks').update(id, { status });
}

export async function updateTodoPosition(id: string, position: string) {
  await db.table<Todo>('tasks').update(id, { position });
}
