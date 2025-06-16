
"use client"; 

import { use, useEffect, useMemo, useState } from 'react'; 
import type { Locale, Dictionary } from '@/lib/dictionaries'; 
import { getDictionary } from '@/lib/dictionaries';
import AstroVibesHomePageContent from '@/components/home/AstroVibesHomePageContent';
import { Sparkles } from 'lucide-react';

interface WeeklyHoroscopePageProps {
  params: { 
    locale: Locale;
  };
}

function WeeklyHoroscopePage({ params: paramsPromise }: { params: WeeklyHoroscopePageProps["params"] }) {
  const params = use(paramsPromise); 
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise); 

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

  return (
    <AstroVibesHomePageContent
      dictionary={dictionary}
      locale={params.locale}
      displayPeriod="weekly"
      // targetDate is not needed for weekly as it defaults to current week
      activeHoroscopePeriodForTitles="weekly"
    />
  );
}

export default WeeklyHoroscopePage;
