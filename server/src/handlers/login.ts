import { oauth } from '../config/google';

export const handler = async () => {
  const url = oauth.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
  });

  return { statusCode: 302, headers: { Location: url } };
};
