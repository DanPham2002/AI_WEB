'use client';

import { User } from 'firebase/auth';
import { createContext, useContext } from 'react';
import { UserHookResult } from '@/firebase';


export const AuthContext = createContext<UserHookResult | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
