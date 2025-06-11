
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Feather } from 'lucide-react'; // Example icon

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
        title={dictionary['MayanHoroscopePage.title'] || "Mayan Horoscope"}
        subtitle={dictionary['MayanHoroscopePage.subtitle'] || "Discover the ancient insights of Mayan astrology."}
        icon={Feather} // Example icon
        className="mb-12"
      />
      <div className="text-center">
        <p className="text-lg text-muted-foreground">
          {dictionary['MayanHoroscopePage.comingSoon'] || "Content for the Mayan Horoscope section is coming soon!"}
        </p>
        {/* Placeholder for Mayan Horoscope content */}
      </div>
    </main>
  );
}

    