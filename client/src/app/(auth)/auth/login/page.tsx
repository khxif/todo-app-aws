'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  async function googleLogin() {
    window.location.href = 'http://localhost:8888/api/auth/login/google';
  }

  return (
    <Card className="max-w-md w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login Page</CardTitle>
        <CardContent>
          <Button onClick={googleLogin}>Login with Google.</Button>
        </CardContent>
      </CardHeader>
    </Card>
  );
}
