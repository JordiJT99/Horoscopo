
"use client"; // This layout now needs to be a client component to use hooks

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider, Sidebar, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import AppSidebar from '@/components/shared/AppSidebar';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useEffect, useState, use } from 'react'; // `use` for promise in client component
import '../globals.css';

interface LocaleLayoutParams {
  locale: Locale;
}

// This component now receives the resolved dictionary directly.
function LayoutContent({ locale, dictionary, children }: { locale: Locale, dictionary: Dictionary, children: React.ReactNode }) {
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
            side="left" // Assuming sidebar is on the left
            className="w-[var(--sidebar-width-mobile)] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden" // Using var for mobile sheet width
          >
            <SheetTitle className="sr-only">{dictionary['Header.title'] || "Navigation Menu"}</SheetTitle> {/* Accessibility */}
            {/* AppSidebar needs dictionary and locale */}
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
  params: paramsPromise, // Renamed to indicate it's a Promise
}: Readonly<{
  children: React.ReactNode;
  params: Promise<LocaleLayoutParams>; // Updated type to Promise
}>) {
  const resolvedParams = use(paramsPromise); // Unwrap the params Promise
  const currentLocale = resolvedParams.locale;

  // Fetch dictionary here using React.use
  // This will suspend LocaleLayout (and its children) until the dictionary is loaded.
  const dictionary = use(getDictionary(currentLocale));

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <SidebarProvider defaultOpen={true}> {/* SidebarProvider wraps everything */}
          {/* Pass the resolved locale and dictionary to LayoutContent */}
          <LayoutContent locale={currentLocale} dictionary={dictionary}>
            {children}
          </LayoutContent>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
