
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import HoroscopeSection from '@/components/sections/HoroscopeSection';
import { Calendar } from 'lucide-react';

interface MonthlyHoroscopePageProps {
  params: {
    locale: Locale;
  };
}

export default async function MonthlyHoroscopePage({ params }: MonthlyHoroscopePageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['MonthlyHoroscopePage.title'] || "Monthly Horoscope"}
        subtitle={dictionary['MonthlyHoroscopePage.subtitle'] || "Your astrological forecast for the month."}
        icon={Calendar}
        className="mb-12"
      />
      
      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <div>
          <HoroscopeSection dictionary={dictionary} locale={params.locale} period="monthly" />
        </div>
      </div>
    </main>
  );
}
