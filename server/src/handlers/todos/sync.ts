import { APIGatewayProxyHandler } from 'aws-lambda';
import { db } from '../../db';
import { todoTable } from '../../db/schema';
import { eq } from 'drizzle-orm';

type TodoStatus = 'todo' | 'inProgress' | 'done';

interface Todo {
  id: string;
  todo: string;
  status: TodoStatus;
  position: number;
  syncStatus: 'synced' | 'new' | 'updated' | 'deleted';
}

export const handler: APIGatewayProxyHandler = async event => {
  try {
    const body = JSON.parse(event.body || '{}');
    console.log(body);
    if (!body.todos || !Array.isArray(body.todos))
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing todos in request body' }) };

    for (const todo of body.todos as Todo[]) {
      const { syncStatus, ...filteredTodo } = todo;

      if (todo.syncStatus === 'new') await db.insert(todoTable).values(filteredTodo);

      if (todo.syncStatus === 'updated')
        await db.update(todoTable).set(filteredTodo).where(eq(todoTable.id, todo.id));

      if (todo.syncStatus === 'deleted')
        await db.delete(todoTable).where(eq(todoTable.id, todo.id));
    }

    return { statusCode: 200, body: JSON.stringify({ token: 'hey' }) };
  } catch (error) {
    console.error('ERROR:', error);
    return { statusCode: 500, body: JSON.stringify({ error: (error as Error).message }) };
  }
};
