
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from "@/components/ui/button";
import { Sparkles, Users, MessageSquare, BookOpen, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationBarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const BottomNavigationBar = ({ dictionary, currentLocale }: BottomNavigationBarProps) => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    const baseCheck = `/${currentLocale}${path}`;
    // Special handling for the root path to avoid matching all sub-paths
    if (path === "/") {
        const horoscopePaths = [
          `/${currentLocale}`,
          `/${currentLocale}/`,
          `/${currentLocale}/yesterday-horoscope`,
          `/${currentLocale}/weekly-horoscope`,
          `/${currentLocale}/monthly-horoscope`
        ];
        return horoscopePaths.some(p => pathname === p || (pathname.startsWith(p) && p !== `/${currentLocale}`));
    }
    return pathname === baseCheck || pathname.startsWith(`${baseCheck}/`);
  };

  const navItems = [
    { href: "/", labelKey: "BottomNav.horoscopes", icon: Sparkles },
    { href: "/natalchart", labelKey: "BottomNav.natalChart", icon: Orbit },
    { href: "/community", labelKey: "BottomNav.community", icon: Users },
    { href: "/psychic-chat", labelKey: "BottomNav.chat", icon: MessageSquare, notification: true },
    { href: "/more", labelKey: "BottomNav.more", icon: BookOpen },
  ];

  return (
    <footer className={cn(
      "fixed bottom-0 left-0 right-0 z-50 w-full border-t border-border/40 bg-bottom-nav-background shadow-top",
      "backdrop-blur-md" // Added for glassmorphism effect
    )}>
      <div className="container flex h-16 items-center justify-around px-1 sm:px-2 md:px-4 max-w-screen-2xl">
        {navItems.map(item => {
          const DisplayIcon = item.icon; 
          const itemIsActive = isActive(item.href);
          
          return (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "flex flex-col items-center justify-center h-full px-1 py-1 text-[0.65rem] sm:text-xs font-medium text-bottom-nav-foreground hover:text-bottom-nav-active-foreground relative rounded-none flex-1 min-w-0",
                itemIsActive && "text-bottom-nav-active-foreground font-semibold"
              )}
            >
              <Link href={`/${currentLocale}${item.href}`}>
                <div className="relative">
                  <DisplayIcon className={cn("h-5 w-5 sm:h-6 sm:h-6 mb-0.5", itemIsActive && "text-bottom-nav-active-foreground")} />
                  {item.notification && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background transform translate-x-1/2 -translate-y-1/2"></span>
                  )}
                </div>
                  <span className="truncate">{dictionary[item.labelKey] || item.labelKey.split('.').pop()}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </footer>
  );
};

export default BottomNavigationBar;
