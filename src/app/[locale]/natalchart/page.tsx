import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import NatalChartClientWrapper from '@/components/natal-chart/NatalChartClientWrapper';
import { Sparkles } from 'lucide-react';
import { Suspense } from 'react';
import SectionTitle from '@/components/shared/SectionTitle';

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
    <>
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <SectionTitle
          title={dictionary['MorePage.natalChart'] || "Natal Chart"}
          subtitle={dictionary.NatalChartPage?.subtitle || "Discover the planetary positions at your exact time of birth."}
          icon={Sparkles}
          className="mb-8"
        />
        <Suspense fallback={
          <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-screen">
            <Sparkles className="h-12 w-12 text-primary animate-spin mx-auto" />
            <p className="mt-4">Loading Natal Chart...</p>
          </div>
        }>
          <NatalChartClientWrapper dictionary={dictionary} locale={params.locale} />
        </Suspense>
      </main>
    </>
  );
}
