"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

const Navbar: React.FC = () => {
  const { user, isLoading } = useUser();
  const [isHydrated, setIsHydrated] = useState(false);

  // Ensure the component is fully hydrated before rendering
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null; // Avoid rendering until hydration is complete
  }

  return (
    <nav className="p-4 flex justify-between items-center bg-gray-100 shadow">
      <h1 className="text-xl font-bold">Leela</h1>
      <div>
        {isLoading ? (
          <span>Loading...</span>
        ) : user ? (
          <>
            <span>Welcome, {user.name}</span>
            <a
              href="/api/auth/logout"
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Log Out
            </a>
          </>
        ) : (
          <a
            href="/api/auth/login?returnTo=/"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Log In
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
