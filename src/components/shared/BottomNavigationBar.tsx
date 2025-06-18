
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from "@/components/ui/button";
import { Sparkles, Users, Heart, MessageSquare, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationBarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const BottomNavigationBar = ({ dictionary, currentLocale }: BottomNavigationBarProps) => {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    const baseCheck = `/${currentLocale}${path}`;
    if (path === "/") {
        return pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;
    }
    return pathname === baseCheck || pathname.startsWith(`${baseCheck}/`);
  };

  const navItems = [
    { href: "/", labelKey: "BottomNav.horoscopes", icon: Sparkles },
    { href: "/friends", labelKey: "BottomNav.friends", icon: Users, isPlaceholder: true }, // Placeholder for now
    { href: "/compatibility", labelKey: "BottomNav.compatibility", icon: Heart },
    { href: "/chat", labelKey: "BottomNav.chat", icon: MessageSquare, isPlaceholder: true }, // Placeholder for now
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
              disabled={item.isPlaceholder}
              className={cn(
                "flex flex-col items-center justify-center h-full px-1 py-1 text-[0.65rem] sm:text-xs font-medium text-bottom-nav-foreground hover:text-bottom-nav-active-foreground relative rounded-none flex-1 min-w-0",
                itemIsActive && "text-bottom-nav-active-foreground font-semibold",
                item.isPlaceholder && "opacity-50 cursor-not-allowed"
              )}
            >
              <Link href={item.isPlaceholder ? "#" : `/${currentLocale}${item.href}`}>
                <DisplayIcon className={cn("h-5 w-5 sm:h-6 sm:h-6 mb-0.5", itemIsActive && "text-bottom-nav-active-foreground")} />
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

// Add shadow-top utility if it doesn't exist in your globals or tailwind config
// Example for tailwind.config.ts if needed:
// theme: { extend: { boxShadow: { top: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -2px rgba(0, 0, 0, 0.1)' } } }
