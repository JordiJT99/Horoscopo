
"use client"; 

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from '@/components/shared/AppSidebar';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState, use, useMemo } from 'react';
import '../globals.css';

interface LocaleLayoutParams {
  locale: Locale;
}

// LayoutContent is now responsible for fetching its own dictionary
function LayoutContent({ locale, children }: { locale: Locale, children: React.ReactNode }) {
  // Fetch dictionary here using React.use
  // This will suspend LayoutContent until the dictionary is loaded.
  const dictionaryPromise = useMemo(() => {
    return getDictionary(locale);
  }, [locale]);
  const dictionary = use(dictionaryPromise);

  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <>
      <Sidebar> {/* This is the DESKTOP sidebar, styled with hidden md:block */}
        <AppSidebar dictionary={dictionary} currentLocale={locale} />
      </Sidebar>

      {/* Mobile Sheet - Rendered conditionally based on client-side state */}
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


export default function LocaleLayout({
  children,
  params: paramsPromise, 
}: Readonly<{
  children: React.ReactNode;
  params: Promise<LocaleLayoutParams>; 
}>) {
  const resolvedParams = use(paramsPromise); 
  const currentLocale = resolvedParams.locale;

  // Dictionary is now fetched within LayoutContent

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <SidebarProvider defaultOpen={true}> 
          {/* Pass only locale to LayoutContent; it will fetch its own dictionary */}
          <LayoutContent locale={currentLocale}>
            {children}
          </LayoutContent>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
    