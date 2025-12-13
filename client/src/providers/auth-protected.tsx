'use client';

import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export function AuthProtected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (!user) router.push('/auth/login');
  }, [user, router]);

  return children;
}
