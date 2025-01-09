"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';

const Navbar: React.FC = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isLoading } = useUser();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogin = () => {
    // Force Auth0 to show the login page
    window.location.href = '/api/auth/login?prompt=login';
  };

  const handleProfileClick = () => {
    if (isLoading) {
      console.log('User authentication is still loading...');
      return;
    }
    console.log("User: profile----", user);
    console.log("Is Loading:", isLoading);
    if (user) {
      router.push('/profile');
    } else {
      handleLogin();
    }
  };

  const handleLogout = () => {
    router.push('/api/auth/logout');
    console.log("User: logout------", user);
    console.log("Is Loading:", isLoading);
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="text-lg font-bold cursor-pointer" onClick={() => router.push('/')}>
        Leela
      </div>

      <div className="relative">
        {!user && !isLoading ? (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
          >
            Login
          </button>
        ) : (
          <>
            <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
              <img
                src={user?.picture || '/icons/default-avatar.png'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
                onError={(e) => (e.currentTarget.src = '/icons/default-avatar.png')}
              />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50">
                <ul className="py-1">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleProfileClick();
                    }}
                  >
                    Profile
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push('/settings');
                    }}
                  >
                    Settings
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      router.push('/help');
                    }}
                  >
                    Help & Support
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </li>
                </ul>

              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
