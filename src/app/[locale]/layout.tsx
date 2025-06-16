
"use client"; 

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import TopBar from '@/components/shared/TopBar'; 
import BottomNavigationBar from '@/components/shared/BottomNavigationBar'; 
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect, useState, use, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import '../globals.css'; // globals.css now imports fonts

interface LocaleLayoutParams {
  locale: Locale;
}

function AppStructure({ locale, dictionary, children }: { locale: Locale, dictionary: Dictionary, children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasMountedContext, setHasMountedContext] = useState(false);

  useEffect(() => {
    setHasMountedContext(true);
  }, []);

  const onboardingPath = `/${locale}/onboarding`;
  const loginPath = `/${locale}/login`;
  const isOnboardingPage = pathname === onboardingPath;
  const isLoginPage = pathname === loginPath;

  useEffect(() => {
    if (!hasMountedContext || authLoading) { 
      return; 
    }

    if (!user && !isLoginPage && !isOnboardingPage) {
      // If not logged in and not on login/onboarding, let them stay or handle as per specific page logic
      // Some public pages might be accessible.
      // If strict auth is needed for all pages except login/onboarding, redirect here.
      // For now, we assume some pages are public.
      return; 
    }
    
    if (user) {
      const onboardingComplete = localStorage.getItem(`onboardingComplete_${user.uid}`) === 'true';
      if (!onboardingComplete && !isOnboardingPage && !isLoginPage) {
        router.push(onboardingPath);
      }
    }
  }, [user, authLoading, pathname, locale, router, hasMountedContext, onboardingPath, loginPath, isLoginPage, isOnboardingPage]);


  if (!hasMountedContext || authLoading && !user && !isOnboardingPage && !isLoginPage) {
     return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }
  
  // For onboarding or login pages, we might want a simpler layout (no top/bottom bars)
  if (isOnboardingPage || isLoginPage) {
    return (
      <div className="flex-grow bg-background text-foreground font-body"> {/* Apply font-body here too */}
        {children}
      </div>
    );
  }

  return (
    <>
      <TopBar dictionary={dictionary} currentLocale={locale} />
      <div className="flex-grow pb-16"> {/* Add padding-bottom to avoid overlap with BottomNav */}
        {children}
      </div>
      <BottomNavigationBar dictionary={dictionary} currentLocale={locale} />
    </>
  );
}


interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<LocaleLayoutParams>;
}

export default function LocaleLayout({
  children,
  params: paramsPromise,
}: Readonly<LocaleLayoutProps>) {
  const resolvedParams = use(paramsPromise); 
  const currentLocale = resolvedParams.locale;

  const dictionaryPromise = useMemo(() => getDictionary(currentLocale), [currentLocale]);
  const dictionary = use(dictionaryPromise);

  if (Object.keys(dictionary).length === 0) { 
    return (
      <html lang={currentLocale} suppressHydrationWarning>
        <head>
          {/* Font links are now in globals.css via @import */}
        </head>
        <body className="font-body antialiased min-h-screen flex flex-col text-foreground bg-background dark">
           <div className="flex-grow flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
          <Toaster />
        </body>
      </html>
    );
  }

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <head>
         {/* Font links are now in globals.css via @import */}
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col text-foreground bg-background dark"> {/* Ensure font-body is applied */}
        <AuthProvider>
          <AppStructure locale={currentLocale} dictionary={dictionary}>
            {children}
          </AppStructure>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
