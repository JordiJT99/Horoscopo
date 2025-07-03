// Server Component - Page for the Chinese Zodiac Calculator
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Calculator } from 'lucide-react';
import ChineseHoroscopeInteractive from '@/components/chinese-horoscope/ChineseHoroscopeInteractive';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface CalculatorPageProps {
  params: { locale: Locale };
}

export default async function ChineseHoroscopeCalculatorPage({ params }: CalculatorPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['ChineseHoroscopePage.discoverSignButton'] || "Discover Your Sign"}
        subtitle={dictionary['ChineseHoroscopePage.discoverSignSubtitle'] || "Find your animal & element by entering your birth year."}
        icon={Calculator}
        className="mb-12"
      />
      <ChineseHoroscopeInteractive dictionary={dictionary} locale={params.locale} mode="calculator" />
    </main>
  );
}
