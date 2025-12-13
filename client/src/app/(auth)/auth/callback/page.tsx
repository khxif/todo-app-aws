'use client';

import { Card, CardContent } from '@/components/ui/card';
import { apiClient } from '@/data-fetchers/apiClient';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authenticate = useAuthStore(state => state.authenticate);

  useEffect(() => {
    const code = searchParams.get('code');

    async function get() {
      const { data } = await apiClient.post('/auth/callback/google', { code });
      authenticate(data.user, data.token);
      router.push('/');
    }
    get();
  }, [authenticate, searchParams, router]);

  return (
    <Card>
      <CardContent>Loading....</CardContent>
    </Card>
  );
}
