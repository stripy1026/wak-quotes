import Link from "next/link";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Link href="/">Home</Link>
      <Link href="/list">List</Link>
      {children}
    </>
  );
};
