export default function AuthLayout(props: LayoutProps<'/'>) {
  return <main className="w-full h-svh flex items-center justify-center">{props.children}</main>;
}
