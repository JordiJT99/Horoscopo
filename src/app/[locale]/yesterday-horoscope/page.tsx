
// AstroVibesYesterdayPageWrapper is the async Server Component (default export)
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries'; // Added getSupportedLocales
import { Sparkles as GlobalSparklesIcon } from 'lucide-react';
import { format, subDays } from 'date-fns';

// Import the client component that contains all UI logic and animations
import AstroVibesHomePageContent from '@/components/home/AstroVibesHomePageContent';
import type { HoroscopePeriod } from '@/components/shared/SubHeaderTabs';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface YesterdayHoroscopePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function YesterdayHoroscopePageWrapper({ params: paramsPromise }: YesterdayHoroscopePageProps) {
  const params = await paramsPromise;
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
      initialActivePeriod="yesterday"
    />
  );
}
