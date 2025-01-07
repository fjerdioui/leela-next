"use client";

import React from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const UserProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default UserProviderWrapper;
