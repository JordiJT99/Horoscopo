import type { Metadata } from 'next';
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import '../globals.css'; // Adjusted path for globals.css

// Define a type for the params
interface LocaleLayoutParams {
  locale: Locale;
}

export async function generateMetadata({ params }: { params: LocaleLayoutParams }): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale);
  return {
    title: dictionary['App.title'] || 'AstroVibes',
    description: dictionary['App.description'] || 'Your daily source for horoscopes and astrological insights.',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LocaleLayoutParams;
}>) {
  const dictionary = await getDictionary(params.locale);

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <SidebarProvider defaultOpen={false}>
          <Header dictionary={dictionary} currentLocale={params.locale} />
          <div className="flex-grow"> {/* This div ensures main content takes up available space */}
            {children}
          </div>
          <Footer dictionary={dictionary} />
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
