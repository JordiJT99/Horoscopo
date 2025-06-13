
"use client"; 

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from '@/components/shared/AppSidebar';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Import useAuth
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState, use, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import '../globals.css';

interface LocaleLayoutParams {
  locale: Locale;
}

// Content component that handles the onboarding redirection logic
function LayoutWithOnboardingCheck({ locale, dictionary, children }: { locale: Locale, dictionary: Dictionary, children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, openMobile, setOpenMobile } = useSidebar(); // For mobile sidebar
  const [hasMountedContext, setHasMountedContext] = useState(false);

  useEffect(() => {
    setHasMountedContext(true);
  }, []);

  useEffect(() => {
    if (!hasMountedContext || authLoading || !user) {
      return; // Wait for auth state and mount
    }

    const onboardingComplete = localStorage.getItem(`onboardingComplete_${user.uid}`) === 'true';
    // Use exact path checks
    const onboardingPath = `/${locale}/onboarding`;
    const loginPath = `/${locale}/login`;

    const isOnboardingPage = pathname === onboardingPath;
    const isLoginPage = pathname === loginPath;

    if (!onboardingComplete && !isOnboardingPage && !isLoginPage) {
      router.push(onboardingPath);
    }
  }, [user, authLoading, pathname, locale, router, hasMountedContext]);

  if (!hasMountedContext) { // Avoid rendering until context and sidebar hooks are ready
     return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }
  
  // Render main layout if onboarding check passes or not applicable
  return (
    <>
      <Sidebar>
        <AppSidebar dictionary={dictionary} currentLocale={locale} />
      </Sidebar>

      {isMobile && (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side="left" 
            className="w-[var(--sidebar-width-mobile)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          >
            <SheetTitle className="sr-only">{dictionary['Header.title'] || "Navigation Menu"}</SheetTitle>
            <AppSidebar dictionary={dictionary} currentLocale={locale} />
          </SheetContent>
        </Sheet>
      )}

      <SidebarInset>
        <Header dictionary={dictionary} currentLocale={locale} />
        <div className="flex-grow">
          {children}
        </div>
        <Footer dictionary={dictionary} />
      </SidebarInset>
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

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col text-foreground">
        <AuthProvider>
          <SidebarProvider defaultOpen={true}> 
            <LayoutWithOnboardingCheck locale={currentLocale} dictionary={dictionary}>
              {children}
            </LayoutWithOnboardingCheck>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
