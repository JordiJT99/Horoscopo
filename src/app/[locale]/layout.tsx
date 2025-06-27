import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import AppStructure from '@/components/shared/AppStructure';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import '../globals.css';

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
      </head>
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
