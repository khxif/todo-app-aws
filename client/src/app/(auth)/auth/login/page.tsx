'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  async function loginWithGoogle() {
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
    const redirect = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL!;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;

    const url =
      `${domain}/oauth2/authorize?` +
      new URLSearchParams({
        identity_provider: 'Google',
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirect,
        scope: 'openid email profile',
        prompt: 'select_account',
      });

    window.location.href = url;
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login Page</CardTitle>
        <CardContent>
          <Button onClick={loginWithGoogle}>Login with Google.</Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
