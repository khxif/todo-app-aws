import { oauth } from '../config/google';

export const handler = async (event: any) => {
  const code = event.queryStringParameters?.code;
  const { tokens } = await oauth.getToken(code);

  // decode id_token
  const ticket = await oauth.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  // SAMPLE: Create your own JWT/session token
  const user = {
    email: payload?.email,
    name: payload?.name,
    picture: payload?.picture,
    googleId: payload?.sub,
  };

  return {
    statusCode: 302,
    headers: { Location: `http://localhost:3000/auth/callback?token=${tokens.id_token}` },
  };
};
