'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { signInWithRedirect } from 'aws-amplify/auth';

export default function Login() {
  // async function loginWithGoogle() {
  //   const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
  //   const redirect = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL!;
  //   const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

  //   const url =
  //     `${domain}/oauth2/authorize?` +
  //     new URLSearchParams({
  //       identity_provider: 'Google',
  //       response_type: 'code',
  //       client_id: clientId,
  //       redirect_uri: redirect,
  //       scope: 'openid email profile',
  //       prompt: 'select_account',
  //     });

  //   window.location.href = url;
  // }

  async function loginWithGoogle() {
    const data = await signInWithRedirect({ provider: 'Google' });
    console.log(data);
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome to Todo App</CardTitle>
        <CardDescription className="text-muted">Please login to continue</CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        <Button onClick={loginWithGoogle} className="w-full">
          Login with Google.
        </Button>
      </CardContent>
    </Card>
  );
}
