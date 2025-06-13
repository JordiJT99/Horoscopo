
"use client"; 

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from '@/components/shared/AppSidebar';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState, use, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import '../globals.css';

interface LocaleLayoutParams {
  locale: Locale;
}

// Componente que maneja la lógica de redirección de onboarding Y la estructura condicional del layout
function ConditionalAppLayout({ locale, dictionary, children }: { locale: Locale, dictionary: Dictionary, children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const [hasMountedContext, setHasMountedContext] = useState(false);

  useEffect(() => {
    setHasMountedContext(true);
  }, []);

  const onboardingPath = `/${locale}/onboarding`;
  const loginPath = `/${locale}/login`;
  const isOnboardingPage = pathname === onboardingPath;
  const isLoginPage = pathname === loginPath;

  useEffect(() => {
    if (!hasMountedContext || authLoading) { // No redirigir si auth está cargando
      return; 
    }

    // Si no hay usuario y no estamos en la página de login, redirigir a login
    // Esto permite que el onboarding cargue si ya está en esa ruta, incluso sin usuario (aunque la página de onboarding luego redirigirá si no hay usuario)
    if (!user && !isLoginPage && !isOnboardingPage) {
      router.push(loginPath);
      return;
    }
    
    // Si hay usuario, verificar onboarding
    if (user) {
      const onboardingComplete = localStorage.getItem(`onboardingComplete_${user.uid}`) === 'true';
      if (!onboardingComplete && !isOnboardingPage && !isLoginPage) {
        router.push(onboardingPath);
      }
    }
  }, [user, authLoading, pathname, locale, router, hasMountedContext, onboardingPath, loginPath, isLoginPage, isOnboardingPage]);


  if (!hasMountedContext || authLoading) {
     return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  // Si estamos en la página de onboarding, renderizar solo el contenido y el toaster
  if (isOnboardingPage) {
    return (
      <div className="flex-grow bg-background text-foreground">
        {children}
        {/* Toaster puede ser útil aquí también para mensajes de validación del onboarding */}
      </div>
    );
  }

  // Si no es la página de onboarding, renderizar la estructura completa de la app
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

  if (Object.keys(dictionary).length === 0) { // Simple check, AuthProvider/SidebarProvider might not like null dictionary
    return (
      <html lang={currentLocale} suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
        </head>
        <body className="font-body antialiased min-h-screen flex flex-col text-foreground bg-background">
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
      <body className="font-body antialiased min-h-screen flex flex-col text-foreground">
        <AuthProvider>
          <SidebarProvider defaultOpen={true}> 
            <ConditionalAppLayout locale={currentLocale} dictionary={dictionary}>
              {children}
            </ConditionalAppLayout>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
