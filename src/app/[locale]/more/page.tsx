

'use client'; // This component now needs client-side logic for localStorage

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
 Award, Cookie, Star as CelebrityIcon, GanttChartSquare as ChineseIcon, Leaf as DruidIcon, MessageSquare, Users,
  Newspaper as ArticlesIcon, BedDouble as DreamIcon, Brain as MeditationIcon, UserCircle, Gift, ChevronRight, Settings, Languages,
  Wand2 as TarotIcon, Eye as CrystalBallIcon, Moon as LunarIcon, Clover as LuckyNumbersIcon, Hand, Sparkles, Orbit, Atom, ShoppingBag, Gem, Layers
} from 'lucide-react';
import { MayanAstrologyIcon } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';


// Helper component for feature cards
const FeatureCard = ({ href, icon: Icon, title, locale, newBadge, isPlaceholder, currentDictionary }: { href: string; icon: React.ElementType; title: string; locale: Locale; newBadge?: boolean, isPlaceholder?: boolean, currentDictionary: Record<string, any> }) => {
  const cardClasses = "bg-card/90 hover:bg-primary/20 transition-colors duration-200 p-3 sm:p-4 flex flex-col items-center justify-center text-center aspect-[4/3] sm:aspect-square shadow-lg rounded-xl";
  
  if (isPlaceholder) {
    return (
      <div className={`${cardClasses} opacity-60 cursor-not-allowed relative`}>
        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary/50 mb-1.5 sm:mb-2" />
        <CardTitle className="text-xs sm:text-sm font-headline text-foreground/60 leading-tight">{title}</CardTitle>
        <Badge variant="destructive" className="mt-1 absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[0.6rem] px-1.5 py-0.5">{currentDictionary['MorePage.comingSoon'] || 'Próximamente'}</Badge>
      </div>
    );
  }

  const content = (
    <>
      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-1.5 sm:mb-2" />
      <CardTitle className="text-xs sm:text-sm font-headline text-foreground leading-tight">{title}</CardTitle>
      {newBadge && <Badge variant="destructive" className="mt-1 absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[0.6rem] px-1.5 py-0.5">{currentDictionary['MorePage.newBadge'] || 'NUEVO'}</Badge>}
    </>
  );

  return (
    <Link href={`/${locale}${href}`}>
      <Card className={`${cardClasses} relative`}>
        {content}
      </Card>
    </Link>
  );
};


// Helper component for account/settings items
const AccountItem = ({ href, icon: Icon, title, locale, isPlaceholder }: { href:string; icon: React.ElementType; title: string; locale: Locale, isPlaceholder?: boolean }) => {
  const itemClasses = "bg-card/90 hover:bg-primary/20 transition-colors duration-200 p-3 sm:p-4 rounded-xl flex items-center justify-between shadow-md";
  const content = (
     <>
        <div className="flex items-center gap-2 sm:gap-3">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <span className="text-sm sm:text-base font-body text-foreground">{title}</span>
        </div>
        {!isPlaceholder && <ChevronRight className="w-5 h-5 text-muted-foreground" />}
     </>
  );

  if (isPlaceholder) {
    return (
        <div className={`${itemClasses} opacity-60 cursor-not-allowed`}>
            {content}
        </div>
    );
  }
  
  return (
    <Link href={`/${locale}${href}`}>
      <div className={itemClasses}>
       {content}
      </div>
    </Link>
  );
};


export default function MorePage() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = pathname.split('/')[1] as Locale;
  const [dictionary, setDictionary] = useState<any | null>(null);

  useEffect(() => {
    getDictionary(currentLocale).then(setDictionary);
  }, [currentLocale]);

  const handleLanguageChange = (newLocale: Locale) => {
    localStorage.setItem('userLocale', newLocale);
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.replace(newPath);
  };
  
  if (!dictionary) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-screen">
        <LoadingSpinner className="h-12 w-12 text-primary" />
      </main>
    );
  }

  const allFeatures = [
    { href: "/tarot-reading", icon: TarotIcon, titleKey: "TarotReadingPage.title", newBadge: false, isPlaceholder: false },
    { href: "/tarot-personality-test", icon: Sparkles, titleKey: "TarotPersonalityPage.title", newBadge: false, isPlaceholder: false },
    { href: "/tarot-spread", icon: Layers, titleKey: "TarotSpreadPage.title", newBadge: true, isPlaceholder: false },
    { href: "/crystal-ball", icon: CrystalBallIcon, titleKey: "CrystalBallPage.title", newBadge: false, isPlaceholder: false },
    { href: "/dream-reading", icon: DreamIcon, titleKey: "DreamReadingPage.title", newBadge: false, isPlaceholder: false },
    { href: "/compatibility", icon: Users, titleKey: "CompatibilityPage.title", newBadge: false, isPlaceholder: false },
    { href: "/lucky-numbers", icon: LuckyNumbersIcon, titleKey: "LuckyNumbersPage.title", newBadge: false, isPlaceholder: false },
    { href: "/lunar-ascendant", icon: LunarIcon, titleKey: "LunarAscendantPage.title", newBadge: false, isPlaceholder: false },
    { href: "/chinese-horoscope", icon: ChineseIcon, titleKey: "ChineseHoroscopePage.title", newBadge: false, isPlaceholder: false },
    { href: "/mayan-horoscope", icon: MayanAstrologyIcon, titleKey: "MayanHoroscopePage.title", newBadge: false, isPlaceholder: false },
    { href: "/zodiac", icon: Atom, titleKey: "MorePage.zodiacSigns", newBadge: false, isPlaceholder: false },
    { href: "/natalchart", icon: Orbit, titleKey: "MorePage.natalChart", newBadge: false, isPlaceholder: false },
    { href: "/psychic-chat", icon: MessageSquare, titleKey: "PsychicChatPage.title", newBadge: false, isPlaceholder: false },
    { href: "/community", icon: Users, titleKey: "CommunityPage.title", newBadge: true, isPlaceholder: false },
    { href: "/store", icon: ShoppingBag, titleKey: "StorePage.title", newBadge: true, isPlaceholder: true },
    { href: "/palm-reading", icon: Hand, titleKey: "MorePage.palmReading", newBadge: true, isPlaceholder: true },
    { href: "/articles", icon: ArticlesIcon, titleKey: "MorePage.articles", newBadge: false, isPlaceholder: true },
    { href: "/meditation", icon: MeditationIcon, titleKey: "MorePage.meditation", newBadge: true, isPlaceholder: true },
  ];

  const accountItems = [
    { href: "/profile", icon: UserCircle, titleKey: "MorePage.profile", isPlaceholder: false },
    { href: "/invite-earn", icon: Gift, titleKey: "MorePage.inviteAndEarn", isPlaceholder: true },
  ];
  
  const premiumItem = { href: "/premium", icon: Award, titleKey: "MorePage.premium", newBadge: false, isPlaceholder: false };


  const stardustItems = [
     { href: "/get-stardust", icon: Gem, titleKey: "MorePage.getStardust", isPlaceholder: false }
  ];

  const settingsItems = [
     { href: "/notifications-settings", icon: Settings, titleKey: "MorePage.notifications", isPlaceholder: true },
  ];
  
  const legalItems = [
    { href: "/privacy", icon: Cookie, titleKey: "PrivacyPolicy.title", isPlaceholder: false },
  ];

  const availableLocales = [
    { code: 'es' as Locale, name: dictionary['Language.es'] || 'Español' },
    { code: 'en' as Locale, name: dictionary['Language.en'] || 'English' },
    { code: 'de' as Locale, name: dictionary['Language.de'] || 'Deutsch' },
    { code: 'fr' as Locale, name: dictionary['Language.fr'] || 'Français' },
  ];


  return (
    <main className="flex-grow container mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-10 space-y-8 sm:space-y-10">
      <div>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary mb-3 sm:mb-4 px-1 sm:px-2 text-left">
          {dictionary['MorePage.allFunctionsTitle'] || "All Functions"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3.5">
          {allFeatures.map(feature => (
            <FeatureCard
              key={feature.href}
              href={feature.href}
              icon={feature.icon}
              title={dictionary[feature.titleKey] || feature.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
              locale={currentLocale}
              newBadge={feature.newBadge}
              isPlaceholder={feature.isPlaceholder}
              currentDictionary={dictionary}
            />
          ))}
        </div>
      </div>
      
       <div>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary mb-3 sm:mb-4 px-1 sm:px-2 text-left">
          {dictionary['PremiumPage.title'] || "AstroVibes Premium"}
        </h2>
        <div className="space-y-2.5 sm:space-y-3.5">
          <AccountItem
              key={premiumItem.href}
              href={premiumItem.href}
              icon={premiumItem.icon}
              title={dictionary[premiumItem.titleKey] || premiumItem.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
              locale={currentLocale}
              isPlaceholder={premiumItem.isPlaceholder}
            />
        </div>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary mb-3 sm:mb-4 px-1 sm:px-2 text-left">
          {dictionary['MorePage.accountTitle'] || "Account"}
        </h2>
        <div className="space-y-2.5 sm:space-y-3.5">
          {accountItems.map(item => (
            <AccountItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={dictionary[item.titleKey] || item.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
              locale={currentLocale}
              isPlaceholder={item.isPlaceholder}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary mb-3 sm:mb-4 px-1 sm:px-2 text-left">
          {dictionary['MorePage.stardustTitle'] || "Stardust & Rewards"}
        </h2>
        <div className="space-y-2.5 sm:space-y-3.5">
          {stardustItems.map(item => (
            <AccountItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={dictionary[item.titleKey] || item.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
              locale={currentLocale}
              isPlaceholder={item.isPlaceholder}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary mb-3 sm:mb-4 px-1 sm:px-2 text-left">
          {dictionary['MorePage.settingsTitle'] || "Settings"}
        </h2>
        <div className="space-y-2.5 sm:space-y-3.5">
           {settingsItems.map(item => (
            <AccountItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={dictionary[item.titleKey] || item.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
              locale={currentLocale}
              isPlaceholder={item.isPlaceholder}
            />
          ))}
          <Card className="bg-card/90 p-3 sm:p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Languages className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="text-sm sm:text-base font-body text-foreground">{dictionary['Header.changeLanguage'] || "Idioma"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {availableLocales.map(lang => (
                <Button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full ${currentLocale === lang.code ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'} text-xs sm:text-sm font-medium py-2 px-3 rounded-md text-center transition-colors`}
                >
                  {lang.name}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary mb-3 sm:mb-4 px-1 sm:px-2 text-left">
          {dictionary['MorePage.legalTitle'] || "Legal"}
        </h2>
        <div className="space-y-2.5 sm:space-y-3.5">
          {legalItems.map(item => (
            <AccountItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={dictionary.PrivacyPolicy?.title || 'Privacy Policy'}
              locale={currentLocale}
              isPlaceholder={item.isPlaceholder}
            />
          ))}
        </div>
      </div>

    </main>
  );
}
