'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Generator } from './generator';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Using a timeout to allow auth state to be read from context
    // This prevents a flash of the dashboard for unauthenticated users
    const timer = setTimeout(() => {
      if (isAuthenticated === false) {
        router.push('/login');
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  if (isAuthenticated === null || isAuthenticated === false) {
    return (
      <div className="container max-w-5xl py-8">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.email}! Here you can use the AI-powered code generator.
        </p>
      </div>
      <Generator />
    </div>
  );
}
