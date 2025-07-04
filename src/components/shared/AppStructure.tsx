
"use client";

import type { Dictionary, Locale } from '@/lib/dictionaries';
import TopBar from '@/components/shared/TopBar'; 
import BottomNavigationBar from '@/components/shared/BottomNavigationBar'; 
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// AppStructure is a Client Component because it uses client-side hooks.
export default function AppStructure({ locale, dictionary, children }: { locale: Locale, dictionary: Dictionary, children: React.ReactNode }) {
  const { isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const onboardingPath = `/${locale}/onboarding`;
  const loginPath = `/${locale}/login`;
  const isOnboardingPage = pathname === onboardingPath;
  const isLoginPage = pathname === loginPath;

  // All redirection logic has been centralized into AuthContext to prevent race conditions and improve maintainability.
  // This component is now only responsible for the layout structure.

  if (!hasMounted || authLoading) {
     return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }
  
  if (isOnboardingPage || isLoginPage) {
    return (
      <div className="flex-grow min-h-screen flex flex-col">
        {children}
      </div>
    );
  }

  return (
    <>
      <TopBar dictionary={dictionary} currentLocale={locale} />
      <div className="flex-grow pb-16">
        {children}
      </div>
      <BottomNavigationBar dictionary={dictionary} currentLocale={locale} />
    </>
  );
}
