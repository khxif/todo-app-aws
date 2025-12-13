import { APIGatewayProxyHandler } from 'aws-lambda';
import jwt, { JwtPayload } from 'jsonwebtoken';
import fetch from 'node-fetch';

interface CognitoTokenResponse {
  id_token: string;
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

export const handler: APIGatewayProxyHandler = async event => {
  try {
    const body = JSON.parse(event.body || '{}');
    const code = body.code;

    if (!code) return { statusCode: 400, body: 'Missing authorization code' };

    const tokenUrl = `${process.env.COGNITO_DOMAIN}/oauth2/token`;

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.COGNITO_CLIENT_ID!,
      client_secret: process.env.COGNITO_CLIENT_SECRET!,
      redirect_uri: process.env.COGNITO_REDIRECT_URI!,
      code,
    });

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const tokens = (await response.json()) as CognitoTokenResponse;
    const decoded = jwt.decode(tokens.id_token) as JwtPayload;

    const user = {
      email: decoded.email,
      picture: decoded.picture,
      name: decoded.name,
    };

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: tokens.id_token, user }),
    };
  } catch (error: any) {
    console.error('ERROR:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
