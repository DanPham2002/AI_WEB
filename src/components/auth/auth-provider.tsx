'use client';

import { AuthContext } from '@/contexts/auth-context';
import { useState, type ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useCallback((email: string) => {
    // This is a mock login. In a real app, you'd verify credentials.
    setIsAuthenticated(true);
    setUser({ email });
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  }, [router]);

  const value = { isAuthenticated, user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
