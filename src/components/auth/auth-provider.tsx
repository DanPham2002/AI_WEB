'use client';

import { AuthContext } from '@/contexts/auth-context';
import { type ReactNode } from 'react';
import { useUser, UserHookResult } from '@/firebase';


export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();

  const value: UserHookResult = {
    user,
    isUserLoading,
    userError: null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
