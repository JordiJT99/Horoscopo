
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Rabbit } from 'lucide-react'; // Example icon

interface ChineseHoroscopePageProps {
  params: {
    locale: Locale;
  };
}

export default async function ChineseHoroscopePage({ params }: ChineseHoroscopePageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['ChineseHoroscopePage.title'] || "Chinese Horoscope"}
        subtitle={dictionary['ChineseHoroscopePage.subtitle'] || "Explore the wisdom of the Chinese zodiac."}
        icon={Rabbit} // Example icon
        className="mb-12"
      />
      <div className="text-center">
        <p className="text-lg text-muted-foreground">
          {dictionary['ChineseHoroscopePage.comingSoon'] || "Content for the Chinese Horoscope section is coming soon!"}
        </p>
        {/* Placeholder for Chinese Horoscope content */}
      </div>
    </main>
  );
}

    