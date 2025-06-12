"use client"; // This layout now needs to be a client component to use hooks

import type { Metadata } from 'next';
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries'; // This will now be a warning but is fine in client components if handled properly
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

// Metadata export has been removed as this is now a Client Component.
// Metadata should be handled in Server Components (e.g., page.tsx or a parent Server Component layout).

// This component will fetch dictionary for its direct children.
// AppSidebar, Header, Footer will get it passed down.
function LayoutContent({ locale, children }: { locale: Locale, children: React.ReactNode }) {
  const dictionary = use(getDictionary(locale)); // Using `use` hook for promises in Client Components
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
            className="w-[16rem] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden" // Using fixed width for mobile sheet
            // style={{ "--sidebar-width-mobile": "16rem" } as React.CSSProperties} // Alternative way if var is defined
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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LocaleLayoutParams;
}>) {
  // The dictionary fetching is moved to LayoutContent
  // const dictionary = use(getDictionary(params.locale)); // This would cause issues with metadata if used directly here.

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <SidebarProvider defaultOpen={true}> {/* SidebarProvider wraps everything */}
          <LayoutContent locale={params.locale}>
            {children}
          </LayoutContent>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
