"use client";

import type { Dictionary, Locale } from '@/lib/dictionaries';
import TopBar from '@/components/shared/TopBar'; 
import BottomNavigationBar from '@/components/shared/BottomNavigationBar'; 
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// AppStructure is a Client Component because it uses client-side hooks.
export default function AppStructure({ locale, dictionary, children }: { locale: Locale, dictionary: Dictionary, children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const onboardingPath = `/${locale}/onboarding`;
  const loginPath = `/${locale}/login`;
  const isOnboardingPage = pathname === onboardingPath;
  const isLoginPage = pathname === loginPath;

  useEffect(() => {
    if (!hasMounted || authLoading) { 
      return; 
    }

    if (!user && !isLoginPage && !isOnboardingPage) {
      // If not logged in and not on login/onboarding, let them stay or handle as per specific page logic
      // Some public pages might be accessible.
      // For now, we assume some pages are public.
      // However, if no user is present and they are trying to access a protected route implicitly by not being on login/onboarding,
      // it's safer to redirect to login.
      // For simplicity, we'll let individual pages handle auth checks if they are not login/onboarding
      // This effect primarily handles post-login onboarding checks.
      return; 
    }
    
    if (user) {
      const onboardingComplete = localStorage.getItem(`onboardingComplete_${user.uid}`) === 'true';
      if (!onboardingComplete && !isOnboardingPage && !isLoginPage) {
        router.push(onboardingPath);
      } else if (onboardingComplete && (isLoginPage || isOnboardingPage)) {
        // If onboarding is complete and user is on login/onboarding, redirect to profile or home
        router.push(`/${locale}/`); 
      }
    }
  }, [user, authLoading, pathname, locale, router, hasMounted, onboardingPath, loginPath, isLoginPage, isOnboardingPage]);


  if (!hasMounted || (authLoading && !isLoginPage && !isOnboardingPage)) {
     return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </div>
    );
  }
  
  // For onboarding or login pages, we want a simpler layout (no top/bottom bars)
  // The background is inherited from the body, which has the nebula image.
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
