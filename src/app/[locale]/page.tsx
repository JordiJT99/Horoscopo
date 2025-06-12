
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import HoroscopeSection from '@/components/sections/HoroscopeSection';
import { LayoutDashboard } from 'lucide-react'; // Changed from Sparkles

interface AstroVibesPageProps {
  params: {
    locale: Locale;
  };
}

export default async function AstroVibesHomePage({ params }: AstroVibesPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['HomePage.dailyHoroscopeTitle'] || "Today's Horoscope"}
        subtitle={dictionary['HomePage.dailyHoroscopeSubtitle'] || "Your daily astrological insights."}
        icon={LayoutDashboard} // Changed icon
        className="mb-12"
      />
      
      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <div> {/* Removed lg:col-span-2 to make it single column */}
          <HoroscopeSection dictionary={dictionary} locale={params.locale} period="daily" />
        </div>
      </div>
    </main>
  );
}
