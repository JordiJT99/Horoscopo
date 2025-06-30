// Server Component - Page for the Mayan Kin Calculator
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import MayanHoroscopeInteractive from '@/components/mayan-horoscope/MayanHoroscopeInteractive';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface CalculatorPageProps {
  params: { locale: Locale };
}

export default async function MayanHoroscopeCalculatorPage({ params }: CalculatorPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <MayanHoroscopeInteractive dictionary={dictionary} locale={params.locale} />
    </main>
  );
}
