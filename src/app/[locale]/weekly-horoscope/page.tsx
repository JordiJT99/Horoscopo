
// AstroVibesWeeklyPageWrapper is the async Server Component (default export)
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { Sparkles as GlobalSparklesIcon } from 'lucide-react';

// Import the client component that contains all UI logic and animations
import AstroVibesHomePageContent from '@/components/home/AstroVibesHomePageContent';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface WeeklyHoroscopePageProps {
  params: { locale: Locale }; // Changed from Promise<{ locale: Locale }>
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function WeeklyHoroscopePageWrapper({ params, searchParams }: WeeklyHoroscopePageProps) {
  // params.locale is directly available now
  const dictionary = await getDictionary(params.locale);

  if (!dictionary || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <GlobalSparklesIcon className="h-12 w-12 animate-pulse text-primary mx-auto" />
        <p className="mt-4 font-body text-muted-foreground">Loading application data...</p>
      </div>
    );
  }

  return (
    <AstroVibesHomePageContent
      dictionary={dictionary}
      locale={params.locale}
      displayPeriod="weekly"
      // targetDate is not needed for weekly as flow defaults to current week
      activeHoroscopePeriodForTitles="weekly"
      // searchParams are implicitly available in AstroVibesHomePageContent via useSearchParams if needed
    />
  );
}

