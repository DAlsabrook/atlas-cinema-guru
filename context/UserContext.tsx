"use client"

import React, { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

type UserContextType = {
  user: any;
  loading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <UserContext.Provider value={{ user: session?.user, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
