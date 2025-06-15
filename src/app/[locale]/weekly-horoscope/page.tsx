
"use client"; // Mark as client component

import { use, useEffect, useMemo, useState } from 'react'; // Added imports
import { useRouter } from 'next/navigation'; // Added useRouter
import type { Locale, Dictionary } from '@/lib/dictionaries'; // Dictionary import
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import HoroscopeSection from '@/components/sections/HoroscopeSection';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs'; // Import SubHeaderTabs
import { CalendarRange } from 'lucide-react';
import { Sparkles } from 'lucide-react'; // For loading fallback

interface WeeklyHoroscopePageProps {
  params: { // No longer a promise for client components using use(paramsPromise)
    locale: Locale;
  };
}

// Content component to handle client-side logic
function WeeklyHoroscopeContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const router = useRouter();

  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    if (tab === 'monthly') {
      router.push(`/${locale}/monthly-horoscope`);
    } else if (tab === 'yesterday' || tab === 'today' || tab === 'tomorrow') {
      router.push(`/${locale}`); // Navigate to main page, default to 'today'
    }
    // If 'weekly' is clicked, do nothing or could refresh data if desired
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
       <SubHeaderTabs 
        dictionary={dictionary} 
        activeTab="weekly" 
        onTabChange={handleSubHeaderTabSelect} 
      />
      <SectionTitle 
        title={dictionary['WeeklyHoroscopePage.title'] || "Weekly Horoscope"}
        subtitle={dictionary['WeeklyHoroscopePage.subtitle'] || "Your astrological forecast for the week."}
        icon={CalendarRange}
        className="mb-12 mt-6" // Added mt-6 for spacing after tabs
      />
      
      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <div>
          <HoroscopeSection dictionary={dictionary} locale={locale} period="weekly" />
        </div>
      </div>
    </main>
  );
}

export default function WeeklyHoroscopePageWrapper({ params: paramsPromise }: { params: Promise<WeeklyHoroscopePageProps["params"]> }) {
  const params = use(paramsPromise); // Resolve params for Server Component part
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise); // Resolve dictionary

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <Sparkles className="h-12 w-12 animate-pulse text-primary mx-auto" />
        <p className="mt-4 font-body text-muted-foreground">{dictionary['HomePage.loadingDashboard'] || "Loading Cosmic Dashboard..."}</p>
      </div>
    );
  }

  return <WeeklyHoroscopeContent dictionary={dictionary} locale={params.locale} />;
}

