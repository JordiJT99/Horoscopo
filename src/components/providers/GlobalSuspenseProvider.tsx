"use client";

import { Suspense } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface GlobalSuspenseProviderProps {
  children: React.ReactNode;
}

export default function GlobalSuspenseProvider({ children }: GlobalSuspenseProviderProps) {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    }>
      {children}
    </Suspense>
  );
}
