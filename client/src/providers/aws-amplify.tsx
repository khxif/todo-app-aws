'use client';

import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_REDIRECT_SIGNIN!],
          redirectSignOut: [process.env.NEXT_PUBLIC_REDIRECT_SIGNOUT!],
          responseType: 'code',
          providers: ['Google'],
        },
      },
    },
  },
});

export function AWSAmplify({ children }: { children: React.ReactNode }) {
  return children;
}
