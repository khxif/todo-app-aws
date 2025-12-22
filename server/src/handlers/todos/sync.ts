import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async event => {
  try {
    const body = JSON.parse(event.body || '{}');
    if (!body.todos || !Array.isArray(body.todos))
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing todos in request body' }) };

    return { statusCode: 200, body: JSON.stringify({ token: 'hey' }) };
  } catch (error) {
    console.error('ERROR:', error);
    return { statusCode: 500, body: JSON.stringify({ error: (error as Error).message }) };
  }
};
