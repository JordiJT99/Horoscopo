
"use client";

import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from "@/components/ui/button";
import { Settings, Wand2 } from 'lucide-react'; // Importado Wand2
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TopBarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const TopBar = ({ dictionary, currentLocale }: TopBarProps) => {
  const router = useRouter();

  const handleSettingsClick = () => {
    router.push(`/${currentLocale}/more`); 
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-top-bar-background">
      <div className="container flex h-14 items-center justify-between px-4 max-w-screen-2xl">
        <Link href={`/${currentLocale}/`} passHref className="flex items-center group">
          <Wand2 className={cn("h-7 w-7 text-primary-foreground animated-header-logo group-hover:opacity-80 transition-opacity", "sm:h-8 sm:w-8")} />
          {/* El título de texto se ha eliminado para dar protagonismo al logo animado */}
          <span className="sr-only">{dictionary['TopBar.horoscopeTitle'] || "Horoscope"}</span>
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
