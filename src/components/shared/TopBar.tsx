
"use client";

import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from "@/components/ui/button";
import { Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const TopBar = ({ dictionary, currentLocale }: TopBarProps) => {
  const router = useRouter();

  const handleSettingsClick = () => {
    // Navigate to a future settings page or open a settings modal
    // For now, it can navigate to the 'More' page which has language settings
    router.push(`/${currentLocale}/more`); 
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-top-bar-background">
      <div className="container flex h-14 items-center justify-between px-4 max-w-screen-2xl">
        <Link href={`/${currentLocale}/`} passHref>
          <h1 className="text-xl font-bold font-headline text-top-bar-foreground">
            {dictionary['TopBar.horoscopeTitle'] || "Horoscope"}
          </h1>
        </Link>
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
