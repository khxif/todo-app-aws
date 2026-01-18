import { Header } from '@/components/header';
import { AuthProtected } from '@/providers/auth-protected';

export default function HomeLayout({ children }: LayoutProps<'/'>) {
  return (
    <AuthProtected>
      <Header />
      {children}
    </AuthProtected>
  );
}
