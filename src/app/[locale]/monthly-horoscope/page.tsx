
"use client"; // Mark as client component

import { use, useEffect, useMemo, useState } from 'react'; // Added imports
import { useRouter } from 'next/navigation'; // Added useRouter
import type { Locale, Dictionary } from '@/lib/dictionaries'; // Dictionary import
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import HoroscopeSection from '@/components/sections/HoroscopeSection';
import SubHeaderTabs, { type HoroscopePeriod } from '@/components/shared/SubHeaderTabs'; // Import SubHeaderTabs
import { Calendar } from 'lucide-react';
import { Sparkles } from 'lucide-react'; // For loading fallback

interface MonthlyHoroscopePageProps {
  params: { // No longer a promise for client components using use(paramsPromise)
    locale: Locale;
  };
}

// Content component to handle client-side logic
function MonthlyHoroscopeContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const router = useRouter();

  const handleSubHeaderTabSelect = (tab: HoroscopePeriod) => {
    if (tab === 'weekly') {
      router.push(`/${locale}/weekly-horoscope`);
    } else if (tab === 'yesterday' || tab === 'today' || tab === 'tomorrow') {
      router.push(`/${locale}`); // Navigate to main page, default to 'today'
    }
    // If 'monthly' is clicked, do nothing or could refresh data if desired
  };
  
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SubHeaderTabs 
        dictionary={dictionary} 
        activeTab="monthly" 
        onTabChange={handleSubHeaderTabSelect} 
      />
      <SectionTitle 
        title={dictionary['MonthlyHoroscopePage.title'] || "Monthly Horoscope"}
        subtitle={dictionary['MonthlyHoroscopePage.subtitle'] || "Your astrological forecast for the month."}
        icon={Calendar}
        className="mb-12 mt-6" // Added mt-6 for spacing after tabs
      />
      
      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <div>
          <HoroscopeSection dictionary={dictionary} locale={locale} period="monthly" />
        </div>
      </div>
    </main>
  );
}


export default function MonthlyHoroscopePageWrapper({ params: paramsPromise }: { params: Promise<MonthlyHoroscopePageProps["params"]> }) {
  const params = use(paramsPromise);
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

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
  
  return <MonthlyHoroscopeContent dictionary={dictionary} locale={params.locale} />;
}

