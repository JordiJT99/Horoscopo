
"use client";

import { useEffect, useState, useMemo, use } from 'react';
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { format, subDays } from 'date-fns';
import AstroVibesHomePageContent from '@/components/home/AstroVibesHomePageContent';
import { Sparkles } from 'lucide-react';

interface YesterdayHoroscopePageProps {
  params: { locale: Locale };
}

// Wrapper to resolve dictionary on server for initial load, if desired,
// or pass it down if this page becomes a server component itself.
// For now, keeping it client-side for consistency with other similar pages.
function YesterdayHoroscopePage({ params: paramsPromise }: YesterdayHoroscopePageProps) {
  const params = use(paramsPromise); // Resolve promise for params
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise); // Resolve promise for dictionary

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || Object.keys(dictionary).length === 0 || !params) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <Sparkles className="h-12 w-12 animate-pulse text-primary mx-auto" />
        {Object.keys(dictionary).length > 0 && <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>}
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
    />
  );
}

export default YesterdayHoroscopePage;
