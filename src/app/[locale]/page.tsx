// AstroVibesHomePageWrapper is the async Server Component (default export)
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { Sparkles as GlobalSparklesIcon } from 'lucide-react';

// Import the new client component
import AstroVibesHomePageContent from '@/components/home/AstroVibesHomePageContent';
import type { HoroscopePeriod } from '@/components/shared/SubHeaderTabs';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface AstroVibesHomePageProps {
  params: { locale: Locale }; // Corrected type for server component params
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function AstroVibesHomePageWrapper({ params, searchParams }: AstroVibesHomePageProps) {
  // params.locale is directly available
  const dictionary = await getDictionary(params.locale);

  if (!dictionary || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <GlobalSparklesIcon className="h-12 w-12 animate-pulse text-primary mx-auto" />
        <p className="mt-4 font-body text-muted-foreground">Loading application data...</p>
      </div>
    );
  }

  const periodParam = searchParams?.period;
  let activePeriodForTitles: HoroscopePeriod = 'today';
  if (periodParam === 'tomorrow') {
    activePeriodForTitles = 'tomorrow';
  }
  
  return (
    <AstroVibesHomePageContent 
      dictionary={dictionary} 
      locale={params.locale}
      displayPeriod="daily" // For 'today' and 'tomorrow', we always display daily data
      // targetDate is not needed for today/tomorrow as flow defaults to current day
      activeHoroscopePeriodForTitles={activePeriodForTitles}
    />
  );
}
