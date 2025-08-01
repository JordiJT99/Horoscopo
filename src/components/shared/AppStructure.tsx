
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/types';
import TopBar from '@/components/shared/TopBar'; 
import BottomNavigationBar from '@/components/shared/BottomNavigationBar'; 
import { useAuth } from '@/context/AuthContext';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { getSupportedLocales } from '@/lib/dictionaries';
import { match } from '@formatjs/intl-localematcher';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { cn } from '@/lib/utils';

// AppStructure is a Client Component because it uses client-side hooks.
export default function AppStructure({ locale, dictionary, children }: { locale: Locale, dictionary: Dictionary, children: React.ReactNode }) {
  const { isLoading: authLoading } = useAuth();
  const { checkAndAwardDailyStardust } = useCosmicEnergy();
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Effect to handle language persistence
  useEffect(() => {
    if (hasMounted) {
      const savedLocale = localStorage.getItem('userLocale') as Locale | null;
      const currentPathLocale = pathname.split('/')[1] as Locale;

      if (savedLocale && savedLocale !== currentPathLocale) {
        const newPath = pathname.replace(`/${currentPathLocale}`, `/${savedLocale}`);
        router.replace(newPath);
      } else if (!savedLocale) {
        // If no locale is saved, detect from browser and redirect if necessary
        const locales = getSupportedLocales();
        const browserLanguages = navigator.languages || [navigator.language];
        // @ts-ignore
        const detectedLocale = match(browserLanguages, locales, 'es') as Locale;
        if (detectedLocale !== currentPathLocale) {
           const newPath = pathname.replace(`/${currentPathLocale}`, `/${detectedLocale}`);
           router.replace(newPath);
        }
      }
    }
  }, [hasMounted, pathname, router]);

  // Effect to award daily stardust
  useEffect(() => {
    if (hasMounted) {
      const awarded = checkAndAwardDailyStardust();
      if (awarded) {
        toast({
          title: dictionary['Toast.dailyStardustTitle'] || 'Daily Stardust Reward!',
          description: dictionary['Toast.dailyStardustDescription'] || 'You received your daily 100 Stardust!',
        });
      }
    }
  }, [hasMounted, checkAndAwardDailyStardust, toast, dictionary]);

  // Effect to register the Service Worker for PWA functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/firebase-messaging-sw.js').then(registration => {
          console.log('Service Worker registered: ', registration);
        }).catch(registrationError => {
          console.log('Service Worker registration failed: ', registrationError);
        });
      });
    }

    // Capacitor App Listener for the back button
    if (Capacitor.isNativePlatform()) {
      CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          CapacitorApp.exitApp();
        }
      });
    }
    
    // Cleanup the listener when the component unmounts
    return () => {
      if (Capacitor.isNativePlatform()) {
        CapacitorApp.removeAllListeners();
      }
    };
  }, []);


  const onboardingPath = `/${locale}/onboarding`;
  const loginPath = `/${locale}/login`;
  const isOnboardingPage = pathname === onboardingPath;
  const isLoginPage = pathname === loginPath;

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

  // Se añade `pt-14` para dejar espacio al AdMob banner superior
  return (
    <>
      <TopBar dictionary={dictionary} currentLocale={locale} />
      <div className={cn("flex-grow pb-16 pt-14")}>
        {children}
      </div>
      <BottomNavigationBar dictionary={dictionary} currentLocale={locale} />
    </>
  );
}
