
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Wand, Eye, MoreHorizontal, UserCircle, Languages, Settings, Info, Sparkles, HeartHandshake, Clover, Wand2 as LunarIcon, GanttChartSquare } from 'lucide-react';
import { cn } from '@/lib/utils'; // Added missing import

interface HeaderProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const availableLocales = [
  { code: 'es' as Locale, name: 'Español' },
  { code: 'en' as Locale, name: 'English' },
  { code: 'de' as Locale, name: 'Deutsch' },
  { code: 'fr' as Locale, name: 'Français' },
];

const Header = ({ dictionary, currentLocale }: HeaderProps) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === `/${currentLocale}${path}`;

  const getLocalizedPath = (locale: Locale, currentPathWithoutLocale: string) => {
    return `/${locale}${currentPathWithoutLocale}`;
  };
  const currentPathWithoutLocale = pathname.startsWith(`/${currentLocale}`) ? pathname.substring(currentLocale.length + 1) : pathname;


  const mainNavItems = [
    { href: "/", labelKey: "Header.horoscopes", icon: Sparkles },
    { href: "/compatibility", labelKey: "Header.compatibility", icon: HeartHandshake },
    { href: "/tarot-reading", labelKey: "Header.tarot", icon: Wand },
    { href: "/crystal-ball", labelKey: "Header.crystalBall", icon: Eye, notificationCount: 1 },
  ];

  const moreMenuItems = [
    { href: "/lucky-numbers", labelKey: "Sidebar.luckyNumbers", icon: Clover },
    { href: "/lunar-ascendant", labelKey: "Sidebar.lunarAscendant", icon: LunarIcon },
    { href: "/chinese-horoscope", labelKey: "Sidebar.chineseHoroscope", icon: GanttChartSquare },
    { href: "/mayan-horoscope", labelKey: "Sidebar.mayanHoroscope", icon: GanttChartSquare },
    { href: "/dream-reading", labelKey: "Sidebar.dreamReading", icon: Users }, // Users as placeholder for BedDouble
    { href: "/tarot-personality-test", labelKey: "Sidebar.tarotPersonalityTest", icon: Home }, // Home as placeholder for TarotPersonalityTestIcon
    { type: 'separator' as const },
    { href: "/profile", labelKey: "Header.profile", icon: UserCircle },
    // { href: "/settings", labelKey: "Header.settings", icon: Settings }, // Example, if needed
    // { href: "/about", labelKey: "Header.about", icon: Info }, // Example, if needed
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-header-background/95 backdrop-blur supports-[backdrop-filter]:bg-header-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-around px-2 sm:px-4">
        {mainNavItems.map(item => (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className={cn(
              "flex flex-col items-center justify-center h-full px-1 sm:px-2 text-xs sm:text-sm font-medium text-header-foreground hover:bg-header-background/50 hover:text-header-icon-active relative",
              isActive(item.href) && "text-header-icon-active"
            )}
          >
            <Link href={`/${currentLocale}${item.href}`}>
              <item.icon className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5" />
              {dictionary[item.labelKey] || item.labelKey.split('.').pop()}
              {item.notificationCount && item.notificationCount > 0 && (
                <Badge variant="destructive" className="absolute top-1 right-0.5 sm:right-1 transform translate-x-1/2 -translate-y-1/2 p-0.5 h-4 w-4 min-w-[1rem] text-xs flex items-center justify-center">
                  {item.notificationCount}
                </Badge>
              )}
            </Link>
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex flex-col items-center justify-center h-full px-1 sm:px-2 text-xs sm:text-sm font-medium text-header-foreground hover:bg-header-background/50 hover:text-header-icon-active">
              <MoreHorizontal className="h-5 w-5 sm:h-6 sm:w-6 mb-0.5" />
              {dictionary['Header.more'] || "More"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {moreMenuItems.map((item, index) => {
              if (item.type === 'separator') {
                return <DropdownMenuSeparator key={`sep-${index}`} />;
              }
              return (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={`/${currentLocale}${item.href}`} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    {dictionary[item.labelKey] || item.labelKey.split('.').pop()}
                  </Link>
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuTrigger asChild>
                 <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span>{dictionary['Header.changeLanguage'] || "Language"}</span>
                </div>
            </DropdownMenuTrigger>
            {availableLocales.map((locale) => (
              <DropdownMenuItem key={locale.code} asChild>
                <Link href={getLocalizedPath(locale.code, currentPathWithoutLocale)} className={cn(currentLocale === locale.code && "font-bold")}>
                  {locale.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
