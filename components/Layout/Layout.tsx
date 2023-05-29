import Link from "next/link";
import { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <nav className="bg-gray-900 p-4 fixed top-0 left-0 right-0 z-10">
        <ul className="flex justify-center space-x-6">
          <li>
            <Link className="text-white hover:text-gray-300" href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300" href="/list">
              List
            </Link>
          </li>
        </ul>
      </nav>
      {children}
    </>
  );
};
