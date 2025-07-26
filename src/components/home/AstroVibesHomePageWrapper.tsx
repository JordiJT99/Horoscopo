"use client";

import { Suspense } from 'react';
import type { Locale } from '@/types';
import type { Dictionary } from '@/lib/dictionaries';
import type { HoroscopePeriod } from '@/components/shared/SubHeaderTabs';
import AstroVibesHomePageContent from './AstroVibesHomePageContent';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface AstroVibesHomePageWithSuspenseProps {
  dictionary: Dictionary;
  locale: Locale;
  displayPeriod: 'daily' | 'weekly' | 'monthly';
  targetDate?: string;
  activeHoroscopePeriodForTitles: HoroscopePeriod;
}

export default function AstroVibesHomePageWithSuspense({ 
  dictionary, 
  locale, 
  displayPeriod,
  targetDate,
  activeHoroscopePeriodForTitles
}: AstroVibesHomePageWithSuspenseProps) {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>}>
      <AstroVibesHomePageContent
        dictionary={dictionary}
        locale={locale}
        displayPeriod={displayPeriod}
        targetDate={targetDate}
        activeHoroscopePeriodForTitles={activeHoroscopePeriodForTitles}
      />
    </Suspense>
  );
}
