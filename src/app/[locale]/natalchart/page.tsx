
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import NatalChartClientContent from '@/components/natal-chart/NatalChartClientContent';
import { Sparkles } from 'lucide-react';
import { Suspense } from 'react';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale.toString(),
  }));
}

interface NatalChartPageProps {
  params: { locale: Locale };
}

export default async function NatalChartPage({ params }: NatalChartPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <Suspense fallback={
        <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-screen">
            <Sparkles className="h-12 w-12 text-primary animate-spin mx-auto" />
            <p className="mt-4">Loading Natal Chart...</p>
        </div>
    }>
      <NatalChartClientContent dictionary={dictionary} />
    </Suspense>
  );
}
