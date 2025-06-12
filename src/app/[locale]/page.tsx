
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import HoroscopeSection from '@/components/sections/HoroscopeSection';
import { Sparkles } from 'lucide-react'; // Changed from LayoutDashboard

interface AstroVibesPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function AstroVibesHomePage({ params: paramsPromise }: AstroVibesPageProps) {
  const params = await paramsPromise;
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['HomePage.dailyHoroscopeTitle'] || "Today's Horoscope"}
        subtitle={dictionary['HomePage.dailyHoroscopeSubtitle'] || "Your daily astrological insights."}
        icon={Sparkles} // Changed icon
        className="mb-12"
      />
      
      <div className="grid grid-cols-1 gap-8 md:gap-12">
        <div> {/* Removed lg:col-span-2 to make it single column */}
          <HoroscopeSection dictionary={dictionary} locale={params.locale} period="daily" />
        </div>
      </div>

      {/* Ad Placeholder */}
      <div className="mt-12 p-6 bg-muted/20 border-2 border-dashed border-muted-foreground/30 rounded-lg text-center text-muted-foreground font-body">
        <p className="text-sm">{dictionary['HomePage.adPlaceholderText'] || "Advertisement Placeholder - Your ad could be here!"}</p>
      </div>
    </main>
  );
}
