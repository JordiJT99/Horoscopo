
"use client";

import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/types';
import TopBar from '@/components/shared/TopBar'; 
import BottomNavigationBar from '@/components/shared/BottomNavigationBar'; 
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { adMobManager } from '@/lib/admob';
import { Capacitor } from '@capacitor/core';

// AppStructure is a Client Component because it uses client-side hooks.
export default function AppStructure({ locale, dictionary, children }: { locale: Locale, dictionary: Dictionary, children: React.ReactNode }) {
  const { isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

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
  }, []);

  // Initialize AdMob for native platforms
  useEffect(() => {
    const initAdMob = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await adMobManager.initialize();
          console.log('AdMob initialized successfully');
          
          // Pre-load interstitial and rewarded ads
          await adMobManager.loadInterstitial();
          await adMobManager.loadRewarded();
        } catch (error) {
          console.error('Failed to initialize AdMob:', error);
        }
      }
    };

    initAdMob();
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
