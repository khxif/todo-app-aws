import { Header } from '@/components/header';

export default function HomeLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
