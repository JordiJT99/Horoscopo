
"use client"; 

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect, useState, use, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import '../globals.css';

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
      // For this new design, we won't auto-redirect to login from all pages
      // User can browse content and will be prompted on specific actions or profile page
      // router.push(loginPath); 
      return;
    }
    
    if (user) {
      const onboardingComplete = localStorage.getItem(`onboardingComplete_${user.uid}`) === 'true';
      if (!onboardingComplete && !isOnboardingPage && !isLoginPage) {
        // Only redirect to onboarding if user is logged in but hasn't completed it
        router.push(onboardingPath);
      }
    }
  }, [user, authLoading, pathname, locale, router, hasMountedContext, onboardingPath, loginPath, isLoginPage, isOnboardingPage]);


  if (!hasMountedContext || authLoading && !user && !isOnboardingPage && !isLoginPage) { // Show loader primarily on initial auth check or if explicitly loading
     return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }
  
  // If on onboarding or login, render only children and toaster
  if (isOnboardingPage || isLoginPage) {
    return (
      <div className="flex-grow bg-background text-foreground">
        {children}
      </div>
    );
  }

  // Full app structure for other pages
  return (
    <>
      <Header dictionary={dictionary} currentLocale={locale} />
      <div className="flex-grow">
        {children}
      </div>
      <Footer dictionary={dictionary} />
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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      {/* Ensure the dark class is applied for the new theme */}
      <body className="font-body antialiased min-h-screen flex flex-col text-foreground bg-background dark">
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
