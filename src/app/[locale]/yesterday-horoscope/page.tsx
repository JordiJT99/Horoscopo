
// AstroVibesYesterdayPageWrapper is the async Server Component (default export)
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries'; // Added getSupportedLocales
import { Sparkles as GlobalSparklesIcon } from 'lucide-react';
import { format, subDays } from 'date-fns';

// Import the client component that contains all UI logic and animations
import AstroVibesHomePageContent from '@/components/home/AstroVibesHomePageContent';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface YesterdayHoroscopePageProps {
  params: { locale: Locale }; // Changed from Promise<{ locale: Locale }>
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function YesterdayHoroscopePageWrapper({ params, searchParams }: YesterdayHoroscopePageProps) {
  // const params = await paramsPromise; // Removed this line, params is now direct
  const dictionary = await getDictionary(params.locale);

  if (!dictionary || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <GlobalSparklesIcon className="h-12 w-12 animate-pulse text-primary mx-auto" />
        <p className="mt-4 font-body text-muted-foreground">Loading application data...</p>
      </div>
    );
  }

  const yesterdayDate = subDays(new Date(), 1);
  const targetDateStr = format(yesterdayDate, 'yyyy-MM-dd');

  return (
    <AstroVibesHomePageContent
      dictionary={dictionary}
      locale={params.locale}
      displayPeriod="daily"
      targetDate={targetDateStr}
      activeHoroscopePeriodForTitles="yesterday"
      // searchParams are implicitly available in AstroVibesHomePageContent via useSearchParams if needed
    />
  );
}

