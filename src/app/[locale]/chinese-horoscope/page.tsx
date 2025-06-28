// Server Component
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { ChineseAstrologyIcon } from '@/lib/constants';
import ChineseHoroscopeClientWrapper from '@/components/chinese-horoscope/ChineseHoroscopeClientWrapper'; // Import the new wrapper
import { Suspense } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';


// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale.toString(), // Ensure it's a string
  }));
}

interface ChineseHoroscopePageProps {
  params: { // Standard params object for page components
    locale: Locale;
  };
}

export default async function ChineseHoroscopePage({ params }: ChineseHoroscopePageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['ChineseHoroscopePage.title']}
        subtitle={dictionary['ChineseHoroscopePage.subtitle']}
        icon={ChineseAstrologyIcon}
        className="mb-12"
      />
      <Suspense fallback={
        <div className="text-center py-10">
          <LoadingSpinner className="h-12 w-12" />
        </div>
      }>
        <ChineseHoroscopeClientWrapper dictionary={dictionary} locale={params.locale} />
      </Suspense>
    </main>
  );
}
