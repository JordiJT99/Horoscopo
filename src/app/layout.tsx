import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar"; // Keep SidebarProvider for potential future use or if other components depend on its context.

export const metadata: Metadata = {
  title: 'AstroVibes',
  description: 'Your daily source for horoscopes and astrological insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <SidebarProvider defaultOpen={false}>
          {children}
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
