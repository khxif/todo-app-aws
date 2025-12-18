import Dexie from 'dexie';

export const db = new Dexie('todo-db');

db.version(1).stores({
  tasks: 'id, status, position',
});

export async function getTodos() {
  const tasks = (await db.table<Todo>('tasks').toArray()).sort((a, b) => a.position - b.position);

  return {
    todos: tasks.filter(t => t.status === 'todo'),
    inProgress: tasks.filter(t => t.status === 'inProgress'),
    done: tasks.filter(t => t.status === 'done'),
  };
}

export async function insertTask(todo: string) {
  const task: Todo = {
    id: crypto.randomUUID(),
    todo,
    status: 'todo',
    position: Date.now(),
  };

  await db.table<Todo>('tasks').add(task);

  return task;
}

export async function updateTodoStatus(id: string, status: TodoStatus) {
  await db.table<Todo>('tasks').update(id, { status });
}
