
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, HeartHandshake, Wand, Eye, MoreHorizontal, AlignJustify } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const Header = ({ dictionary, currentLocale }: HeaderProps) => {
  const pathname = usePathname();
  const isActive = (path: string) => {
    const baseCheck = `/${currentLocale}${path}`;
    if (path === "/") { // Special case for home
        return pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;
    }
    return pathname === baseCheck || pathname.startsWith(`${baseCheck}/`);
  };

  const mainNavItems = [
    { href: "/", labelKey: "Header.horoscopes", icon: Sparkles },
    { href: "/compatibility", labelKey: "Header.compatibility", icon: HeartHandshake },
    { href: "/tarot-reading", labelKey: "Header.tarot", icon: Wand },
    { href: "/crystal-ball", labelKey: "Header.crystalBall", icon: Eye, notificationCount: 1 }, // Static notification count
    { href: "/more", labelKey: "Header.more", icon: MoreHorizontal }, // Using MoreHorizontal to match image
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-header-background/95 backdrop-blur supports-[backdrop-filter]:bg-header-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-around px-1 sm:px-2 md:px-4"> {/* Increased height to h-16 */}
        {mainNavItems.map(item => {
          const DisplayIcon = item.icon; 
          
          return (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "flex flex-col items-center justify-center h-full px-1 py-1 sm:px-1.5 text-[0.65rem] sm:text-xs font-medium text-header-foreground hover:bg-header-background/50 hover:text-header-icon-active relative rounded-none flex-1 min-w-0",
                isActive(item.href) && "text-header-icon-active font-semibold" // Added font-semibold for active
              )}
            >
              <Link href={`/${currentLocale}${item.href}`}>
                <DisplayIcon className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5" /> {/* Adjusted icon size */}
                <span className="truncate">{dictionary[item.labelKey] || item.labelKey.split('.').pop()}</span>
                {item.notificationCount && item.notificationCount > 0 && (
                  <Badge variant="destructive" className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 transform translate-x-1/2 -translate-y-1/2 p-0 h-4 w-4 min-w-[1rem] text-[0.6rem] flex items-center justify-center">
                    {item.notificationCount}
                  </Badge>
                )}
              </Link>
            </Button>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
