
"use client";

import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from "@/components/ui/button";
import { Settings, Wand2, ArrowLeft } from 'lucide-react';
import { StardustIcon } from '@/components/shared/StardustIcon';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';

interface TopBarProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const TopBar = ({ dictionary, currentLocale }: TopBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);
  const { stardust } = useCosmicEnergy();

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, [pathname]);

  const mainNavPaths: { [key: string]: string } = {
    '/': dictionary['BottomNav.horoscopes'] || 'Horoscopes',
    '/yesterday-horoscope': dictionary['HomePage.horoscopeTitleYesterday'] || 'Yesterday',
    '/weekly-horoscope': dictionary['HomePage.horoscopeTitleWeekly'] || 'Weekly',
    '/monthly-horoscope': dictionary['HomePage.horoscopeTitleMonthly'] || 'Monthly',
    '/natalchart': dictionary['BottomNav.natalChart'] || 'Natal Chart',
    '/community': dictionary['BottomNav.community'] || 'Community',
    '/psychic-chat': dictionary['BottomNav.chat'] || 'Psychics',
    '/more': dictionary['BottomNav.more'] || 'More',
    '/profile': dictionary['ProfilePage.title'] || 'Profile',
    '/get-stardust': dictionary['GetStardustPage.title'] || 'Stardust',
    '/tarot-reading': dictionary['TarotReadingPage.title'] || 'Tarot Reading',
    '/tarot-spread': dictionary['TarotSpreadPage.title'] || 'Tarot Spread',
    '/tarot-personality-test': dictionary['TarotDailyReading.title'] || 'Daily Tarot',
    '/crystal-ball': dictionary['CrystalBallPage.title'] || 'Crystal Ball',
    '/dream-reading': dictionary['DreamReadingPage.title'] || 'Dream Reading',
    '/compatibility/calculator': dictionary['CompatibilityPage.title'] || 'Compatibility',
    '/lucky-numbers': dictionary['LuckyNumbersPage.title'] || 'Lucky Numbers',
    '/lunar-ascendant': dictionary['LunarAscendantPage.title'] || 'Lunar Phase',
    '/chinese-horoscope': dictionary['ChineseHoroscopePage.title'] || 'Chinese Horoscope',
    '/mayan-horoscope': dictionary['MayanHoroscopePage.title'] || 'Mayan Horoscope',
    '/zodiac': dictionary['MorePage.zodiacSigns'] || 'Zodiac Signs',
    '/premium': dictionary['PremiumPage.title'] || 'Premium',
    '/privacy': dictionary['PrivacyPolicy.title'] || 'Privacy Policy',
    '/login': dictionary['Auth.loginTitle'] || 'Login',
    '/onboarding': dictionary['OnboardingPage.title'] || 'Onboarding',
  };

  const getPageTitle = () => {
    const basePath = pathname.replace(`/${currentLocale}`, '') || '/';
    const specificMatch = Object.keys(mainNavPaths).find(key => basePath.startsWith(key) && key !== '/');
    if (specificMatch) return mainNavPaths[specificMatch];
    return mainNavPaths[basePath] || '';
  };

  const pageTitle = getPageTitle();

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push(`/${currentLocale}`);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-lg">
      <div className="container flex h-14 items-center justify-between px-4 max-w-screen-2xl">
        {/* Left side: Back button */}
        <div className="flex-1 flex justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            aria-label={dictionary['TopBar.backAriaLabel'] || "Go back"}
            className="text-top-bar-foreground h-12 w-12 rounded-full hover:bg-muted/50"
          >
            <ArrowLeft size={24} />
          </Button>
        </div>

        {/* Center: Title */}
        <div className="flex-1 text-center">
            <h1 className="text-lg font-headline font-semibold text-foreground truncate">
                {pageTitle}
            </h1>
        </div>

        {/* Right side: Stardust balance */}
        <div className="flex-1 flex justify-end">
             <Link href={`/${currentLocale}/get-stardust`} passHref>
                <Button
                    variant="ghost"
                    className="flex items-center gap-1.5 h-10 px-3 rounded-full text-foreground hover:bg-muted/50"
                    aria-label={`${stardust} Stardust`}
                >
                    <StardustIcon className="h-14 w-14" />
                    <span className="font-bold text-sm">{stardust}</span>
                </Button>
            </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
