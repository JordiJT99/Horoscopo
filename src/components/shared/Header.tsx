
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Wand, Eye, MoreHorizontal, UserCircle, Languages, Settings, Info, Sparkles, HeartHandshake, Clover, Wand2 as LunarIcon, GanttChartSquare, AlignJustify } from 'lucide-react';
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
    { href: "/crystal-ball", labelKey: "Header.crystalBall", icon: Eye, notificationCount: 1 },
    { href: "/more", labelKey: "Header.more", icon: AlignJustify }, // Consistent icon for "More"
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-header-background/95 backdrop-blur supports-[backdrop-filter]:bg-header-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-around px-1 sm:px-2 md:px-4">
        {mainNavItems.map(item => {
          const IconComponent = item.icon;
          // The variable holding the component must start with an uppercase letter.
          const DisplayIcon = item.icon; 
          
          return (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "flex flex-col items-center justify-center h-full px-1.5 py-1 sm:px-2 text-[0.6rem] sm:text-xs font-medium text-header-foreground hover:bg-header-background/50 hover:text-header-icon-active relative rounded-none flex-1 min-w-0",
                isActive(item.href) && "text-header-icon-active"
              )}
            >
              <Link href={`/${currentLocale}${item.href}`}>
                <DisplayIcon className="h-4 w-4 sm:h-5 sm:w-5 mb-0.5" />
                <span className="truncate">{dictionary[item.labelKey] || item.labelKey.split('.').pop()}</span>
                {item.notificationCount && item.notificationCount > 0 && (
                  <Badge variant="destructive" className="absolute top-0.5 right-0 sm:right-0.5 transform translate-x-1/3 -translate-y-1/3 p-0 h-3.5 w-3.5 min-w-[0.875rem] text-[0.55rem] flex items-center justify-center">
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

