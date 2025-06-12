
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import HoroscopeSection from '@/components/sections/HoroscopeSection';
import { CalendarRange } from 'lucide-react';

interface WeeklyHoroscopePageProps {
  params: Promise<{ // Updated type
    locale: Locale;
  }>;
}

export default async function WeeklyHoroscopePage({ params: paramsPromise }: WeeklyHoroscopePageProps) { // Renamed and will await
  const params = await paramsPromise; // Await params
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['WeeklyHoroscopePage.title'] || "Weekly Horoscope"}
        subtitle={dictionary['WeeklyHoroscopePage.subtitle'] || "Your astrological forecast for the week."}
        icon={CalendarRange}
        className="mb-12"
      />
      
      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <div>
          <HoroscopeSection dictionary={dictionary} locale={params.locale} period="weekly" />
        </div>
      </div>
    </main>
  );
}
