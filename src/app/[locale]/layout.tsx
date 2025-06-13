
"use client"; 

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from '@/components/shared/AppSidebar';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState, use, useMemo } from 'react';
import '../globals.css';

interface LocaleLayoutParams {
  locale: Locale;
}

// LayoutContent now receives dictionary as a prop
function LayoutContent({ locale, dictionary, children }: { locale: Locale, dictionary: Dictionary, children: React.ReactNode }) {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Dictionary is now passed as a prop, no need to fetch it here
  // const dictionaryPromise = useMemo(() => {
  //   return getDictionary(locale);
  // }, [locale]);
  // const dictionary = use(dictionaryPromise); // THIS WAS THE ERROR SOURCE

  return (
    <>
      <Sidebar>
        <AppSidebar dictionary={dictionary} currentLocale={locale} />
      </Sidebar>

      {hasMounted && isMobile && (
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

  // Fetch dictionary here and pass it down
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
            {/* Pass resolved dictionary to LayoutContent */}
            <LayoutContent locale={currentLocale} dictionary={dictionary}>
              {children}
            </LayoutContent>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
