import { APIGatewayProxyHandler } from 'aws-lambda';
import jwt, { JwtHeader, JwtPayload } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch';

export const handler: APIGatewayProxyHandler = async event => {
  try {
    const authHeader = event.headers.Authorization || event.headers.authorization;

    if (!authHeader) return { statusCode: 401, body: 'Missing Authorization header' };

    const token = authHeader.replace('Bearer ', '');
    const decoded = await verifyCognitoToken(token);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        authenticated: true,
        user: decoded,
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 401,
      body: `Invalid token: ${err.message}`,
    };
  }
};

// ---------- TYPES FOR JWKS ----------
interface JwkKey {
  kid: string;
  kty: 'RSA'; // MUST be RSA for Cognito
  n: string;
  e: string;
  alg: string;
  use: string;
}

interface JwksResponse {
  keys: JwkKey[];
}

let pems: Record<string, string> | null = null;

async function getCognitoPems() {
  if (pems) return pems;

  const region = process.env.COGNITO_REGION!;
  const poolId = process.env.COGNITO_USER_POOL_ID!;

  const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`;

  const res = await fetch(jwksUrl);
  const data = (await res.json()) as JwksResponse;

  pems = {};
  data.keys.forEach(key => {
    pems![key.kid] = jwkToPem(key);
  });

  return pems!;
}

// ---------- VERIFY TOKEN ----------
async function verifyCognitoToken(token: string): Promise<JwtPayload> {
  const decoded = jwt.decode(token, { complete: true }) as {
    header: JwtHeader;
    payload: JwtPayload;
  } | null;

  if (!decoded) throw new Error('Invalid token: cannot decode');

  const kid = decoded.header.kid;
  if (!kid) throw new Error('Invalid token: no kid found');

  const pems = await getCognitoPems();
  const pem = pems[kid];

  if (!pem) throw new Error('Invalid token: signature key not found');

  return jwt.verify(token, pem) as JwtPayload;
}
