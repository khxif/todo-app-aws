'use client';

import { getCurrentUser } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export function AuthProtected({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        if (!user) router.push('/auth/login');
      } catch (error) {
        router.push('/auth/login');
      }
    }
    fetchUser();
  }, [router]);

  return children;
}
