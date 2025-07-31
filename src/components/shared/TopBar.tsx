
"use client";

import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from "@/components/ui/button";
import { Settings, Wand2, ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface TopBarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const TopBar = ({ dictionary, currentLocale }: TopBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // This check ensures we only determine navigation capability on the client side.
    setCanGoBack(window.history.length > 1);
  }, [pathname]);

  const handleSettingsClick = () => {
    router.push(`/${currentLocale}/more`); 
  };

  const mainNavPaths = [
    `/${currentLocale}/`,
    `/${currentLocale}/natalchart`,
    `/${currentLocale}/community`,
    `/${currentLocale}/psychic-chat`,
    `/${currentLocale}/more`,
  ];
  
  const isMainPage = mainNavPaths.includes(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-top-bar-background">
      <div className="container flex h-14 items-center justify-between px-4 max-w-screen-2xl">
        <div className="flex items-center gap-1">
          {canGoBack && !isMainPage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              aria-label={dictionary['TopBar.backAriaLabel'] || "Go back"}
              className="text-top-bar-foreground h-12 w-12 rounded-full hover:bg-muted/50"
            >
              <ArrowLeft size={32} /> 
            </Button>
          )}
          <Link href={`/${currentLocale}/`} passHref className="flex items-center group">
            <Wand2 className={cn("h-7 w-7 text-primary-foreground animated-header-logo group-hover:opacity-80 transition-opacity", "sm:h-8 sm:w-8")} />
            <span className="sr-only">{dictionary['TopBar.horoscopeTitle'] || "Horoscope"}</span>
          </Link>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSettingsClick}
          aria-label={dictionary['TopBar.settingsAriaLabel'] || "Settings"}
          className="text-top-bar-foreground hover:bg-muted/30"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};

export default TopBar;
