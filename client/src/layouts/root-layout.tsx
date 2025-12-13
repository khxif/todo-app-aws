'use client';

import { useInitApp } from '@/hooks/use-init-app';
import { useRootLayoutStore } from '@/stores/root-layout-store';

export function RootAppLayout({ children }: { children: React.ReactNode }) {
  const { isAppInitialized } = useRootLayoutStore();
  useInitApp();

  return isAppInitialized ? children : <>Loaidng</>;
}
