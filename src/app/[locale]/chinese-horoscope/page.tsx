
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { ChineseAstrologyIcon } from '@/lib/constants';
import ChineseHoroscopeInteractive from '@/components/chinese-horoscope/ChineseHoroscopeInteractive';

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
  // params.locale is directly available now
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['ChineseHoroscopePage.title']}
        subtitle={dictionary['ChineseHoroscopePage.subtitle']}
        icon={ChineseAstrologyIcon}
        className="mb-12"
      />
      <ChineseHoroscopeInteractive dictionary={dictionary} />
    </main>
  );
}
