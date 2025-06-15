
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import Link from 'next/link';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Award, Cookie, Star as CelebrityIcon, GanttChartSquare as ChineseIcon, Leaf as DruidIcon, ArrowUpRight as AscendantIcon,
  Newspaper as ArticlesIcon, BedDouble as DreamIcon, Brain as MeditationIcon, UserCircle, Gift, ChevronRight, Settings, Languages
} from 'lucide-react';

interface MorePageProps {
  params: { locale: Locale };
}

// Helper component for feature cards
const FeatureCard = ({ href, icon: Icon, title, locale, newBadge, isPlaceholder }: { href: string; icon: React.ElementType; title: string; locale: Locale; newBadge?: boolean, isPlaceholder?: boolean }) => {
  const cardClasses = "bg-card/90 hover:bg-primary/20 transition-colors duration-200 p-3 sm:p-4 flex flex-col items-center justify-center text-center aspect-[4/3] sm:aspect-square shadow-lg rounded-xl";
  const content = (
    <>
      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary mb-1.5 sm:mb-2" />
      <CardTitle className="text-xs sm:text-sm font-headline text-foreground leading-tight">{title}</CardTitle>
      {newBadge && <Badge variant="destructive" className="mt-1 absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[0.6rem] px-1.5 py-0.5">NUEVO</Badge>}
    </>
  );

  if (isPlaceholder) {
    return (
      <div className={`${cardClasses} opacity-60 cursor-not-allowed relative`}>
        {content}
      </div>
    );
  }

  return (
    <Link href={`/${locale}${href}`} passHref>
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
    <Link href={`/${locale}${href}`} passHref>
      <div className={itemClasses}>
       {content}
      </div>
    </Link>
  );
};


export default async function MorePage({ params }: MorePageProps) {
  const dictionary = await getDictionary(params.locale);

  const allFeatures = [
    { href: "/premium", icon: Award, titleKey: "MorePage.premi", newBadge: false, isPlaceholder: true },
    { href: "/fortune-cookie", icon: Cookie, titleKey: "MorePage.fortuneCookie", newBadge: false, isPlaceholder: true },
    { href: "/celebrity-compatibility", icon: CelebrityIcon, titleKey: "MorePage.celebrityCompatibility", newBadge: false, isPlaceholder: true },
    { href: "/chinese-horoscope", icon: ChineseIcon, titleKey: "MorePage.chineseHoroscope", newBadge: false, isPlaceholder: false },
    { href: "/druid-horoscope", icon: DruidIcon, titleKey: "MorePage.druidHoroscope", newBadge: false, isPlaceholder: true },
    { href: "/lunar-ascendant", icon: AscendantIcon, titleKey: "MorePage.risingSign", newBadge: false, isPlaceholder: false },
    { href: "/articles", icon: ArticlesIcon, titleKey: "MorePage.articles", newBadge: false, isPlaceholder: true },
    { href: "/dream-reading", icon: DreamIcon, titleKey: "MorePage.dreamInterpretation", newBadge: false, isPlaceholder: false },
    { href: "/meditation", icon: MeditationIcon, titleKey: "MorePage.meditation", newBadge: true, isPlaceholder: true },
  ];

  const accountItems = [
    { href: "/profile", icon: UserCircle, titleKey: "MorePage.profile", isPlaceholder: false },
    { href: "/invite-earn", icon: Gift, titleKey: "MorePage.inviteAndEarn", isPlaceholder: true },
  ];

  const settingsItems = [
     { href: "/notifications-settings", icon: Settings, titleKey: "MorePage.notifications", isPlaceholder: true },
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
          {dictionary['MorePage.allFunctionsTitle'] || "Todas las Funciones"}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {allFeatures.map(feature => (
            <FeatureCard
              key={feature.href}
              href={feature.href}
              icon={feature.icon}
              title={dictionary[feature.titleKey] || feature.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
              locale={params.locale}
              newBadge={feature.newBadge}
              isPlaceholder={feature.isPlaceholder}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary mb-3 sm:mb-4 px-1 sm:px-2 text-left">
          {dictionary['MorePage.accountTitle'] || "Cuenta"}
        </h2>
        <div className="space-y-2.5 sm:space-y-3.5">
          {accountItems.map(item => (
            <AccountItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={dictionary[item.titleKey] || item.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
              locale={params.locale}
              isPlaceholder={item.isPlaceholder}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl sm:text-2xl font-headline font-semibold text-primary mb-3 sm:mb-4 px-1 sm:px-2 text-left">
          {dictionary['MorePage.settingsTitle'] || "Ajustes"}
        </h2>
        <div className="space-y-2.5 sm:space-y-3.5">
           {settingsItems.map(item => (
            <AccountItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={dictionary[item.titleKey] || item.titleKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
              locale={params.locale}
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
                <Link key={lang.code} href={`/${lang.code}${params.locale === lang.code ? '/more' : '/more'}`} passHref legacyBehavior>
                  <a className={`w-full ${params.locale === lang.code ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'} text-xs sm:text-sm font-medium py-2 px-3 rounded-md text-center transition-colors`}>
                    {lang.name}
                  </a>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>

    </main>
  );
}

