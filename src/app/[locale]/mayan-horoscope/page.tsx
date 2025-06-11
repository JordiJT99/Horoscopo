
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { MayanAstrologyIcon } from '@/lib/constants';
import MayanHoroscopeInteractive from '@/components/mayan-horoscope/MayanHoroscopeInteractive';

interface MayanHoroscopePageProps {
  params: {
    locale: Locale;
  };
}

export default async function MayanHoroscopePage({ params }: MayanHoroscopePageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['MayanHoroscopePage.title']}
        subtitle={dictionary['MayanHoroscopePage.subtitle']}
        icon={MayanAstrologyIcon}
        className="mb-12"
      />
      <MayanHoroscopeInteractive dictionary={dictionary} locale={params.locale} />
    </main>
  );
}
