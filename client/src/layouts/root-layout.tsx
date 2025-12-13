'use client';

import { Spinner } from '@/components/ui/spinner';
import { useInitApp } from '@/hooks/use-init-app';
import { useRootLayoutStore } from '@/stores/root-layout-store';

export function RootAppLayout({ children }: { children: React.ReactNode }) {
  const { isAppInitialized } = useRootLayoutStore();
  useInitApp();

  return isAppInitialized ? (
    children
  ) : (
    <div className="w-full h-svh flex items-center justify-center">
      <Spinner className="w-10 h-10 text-primary" />
    </div>
  );
}
