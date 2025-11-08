'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface User {
  identifier: string; // Can be email or username
}

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: User | null;
  login: (identifier: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
