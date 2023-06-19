import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

import { useUser } from "@auth0/nextjs-auth0/client";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

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
          {!user && (
            <li>
              <Link
                className="text-white hover:text-gray-300"
                href="/api/auth/login"
              >
                Login
              </Link>
            </li>
          )}
          {user && (
            <li>
              <Link
                className="text-white hover:text-gray-300"
                href="/api/auth/logout"
              >
                Logout
              </Link>
            </li>
          )}
          {user && (
            <li>
              <Image
                src={user.picture || ""}
                width={30}
                height={30}
                alt={user.name || "user"}
              />
            </li>
          )}
        </ul>
      </nav>
      {children}
    </>
  );
};
