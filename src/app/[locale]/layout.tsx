import type { Metadata } from 'next';
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import AppStructure from '@/components/shared/AppStructure';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import FirebaseAnalytics from '@/components/shared/FirebaseAnalytics';
import FirebaseMessagingProvider from '@/components/shared/FirebaseMessagingProvider';
import { Suspense } from 'react';
import Script from 'next/script';
import '../globals.css';

export const metadata: Metadata = {
  title: 'AstroMística: Horóscopo, Tarot y Astrología',
  description: 'Tu guía espiritual diaria: horóscopo, tarot, compatibilidad de signos, carta natal y más. Descubre los secretos del cosmos y alinea tu vida con las estrellas.',
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
   icons: {
    icon: '/custom_assets/logo_192.png',
    apple: '/custom_assets/logo_192.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AstroMística',
  },
};

interface LocaleLayoutParams {
  locale: Locale;
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: LocaleLayoutParams;
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<LocaleLayoutProps>) {
  const currentLocale = params.locale;
  const dictionary = await getDictionary(currentLocale);

  if (Object.keys(dictionary).length === 0) { 
    return (
      <html lang={currentLocale} suppressHydrationWarning>
        <head>
          {/* Font links are now in globals.css via @import */}
        </head>
        <body className="font-body antialiased min-h-screen flex flex-col text-foreground bg-background dark">
           <div className="flex-grow flex items-center justify-center min-h-screen">
            <LoadingSpinner className="h-12 w-12 text-primary" />
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
         <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1601092077557933`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
           <meta name="theme-color" content="#1A142B" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col text-foreground bg-background dark">
        <AuthProvider>
          <FirebaseMessagingProvider>
            <AppStructure locale={currentLocale} dictionary={dictionary}>
              {children}
            </AppStructure>
          </FirebaseMessagingProvider>
        </AuthProvider>
        <Toaster />
        <Suspense fallback={null}>
          <FirebaseAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
