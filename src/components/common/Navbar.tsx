"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client'; /* UPDATED: Added useUser import */

const Navbar: React.FC = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isLoading } = useUser(); /* UPDATED: Added user authentication state */

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleProfileClick = () => { /* UPDATED: New function for profile navigation */
    if (isLoading) {
      console.log('User authentication is still loading...');
      return;
    }

    if (user) {
      router.push('/profile'); /* UPDATED: Redirect to profile if authenticated */
    } else {
      router.push('/api/auth/login'); /* UPDATED: Redirect to login if not authenticated */
    }
  };

  const handleLogout = () => {
    router.push('/api/auth/logout'); /* UPDATED: Redirect to Auth0 logout endpoint */
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="text-lg font-bold cursor-pointer" onClick={() => router.push('/')}>
        Leela
      </div>

      <div className="relative">
        <button onClick={toggleDropdown} className="flex items-center space-x-2 focus:outline-none">
          <img
            src={user?.picture || '/icons/default-avatar.png'} /* UPDATED: Use dynamic user avatar */
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
                onClick={handleProfileClick} /* UPDATED: Use handleProfileClick for profile navigation */
              >
                Profile
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push('/settings')}
              >
                Settings
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push('/help')}
              >
                Help & Support
              </li>
              <li
                className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                onClick={handleLogout} /* UPDATED: Use handleLogout for logout functionality */
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
