'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  console.log(token);

  useEffect(() => {
    router.push('/');
  },[])

  return (
    <Card>
      <CardContent>Loading....</CardContent>
    </Card>
  );
}
