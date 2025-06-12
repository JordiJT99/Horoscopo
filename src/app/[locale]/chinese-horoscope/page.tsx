
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { ChineseAstrologyIcon } from '@/lib/constants';
import ChineseHoroscopeInteractive from '@/components/chinese-horoscope/ChineseHoroscopeInteractive';

interface ChineseHoroscopePageProps {
  params: Promise<{ // Updated type
    locale: Locale;
  }>;
}

export default async function ChineseHoroscopePage({ params: paramsPromise }: ChineseHoroscopePageProps) { // Renamed and will await
  const params = await paramsPromise; // Await params
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
