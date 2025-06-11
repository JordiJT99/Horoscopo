
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import HoroscopeSection from '@/components/sections/HoroscopeSection';
import CompatibilitySection from '@/components/sections/CompatibilitySection';
import LuckyNumbersSection from '@/components/sections/LuckyNumbersSection';
import LunarAscendantSection from '@/components/sections/LunarAscendantSection';
import { Sparkles } from 'lucide-react';

interface AstroVibesPageProps {
  params: {
    locale: Locale;
  };
}

export default async function AstroVibesPage({ params }: AstroVibesPageProps) {
  const dictionary = await getDictionary(params.locale);
  const currentYear = new Date().getFullYear();

  return (
    // The main Header and Footer are now in [locale]/layout.tsx
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['Page.welcomeTitle']} 
        subtitle={dictionary['Page.welcomeSubtitle']}
        icon={Sparkles}
        className="mb-12"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <div className="lg:col-span-2">
          <HoroscopeSection dictionary={dictionary} locale={params.locale} />
        </div>
        <CompatibilitySection dictionary={dictionary} />
        <LuckyNumbersSection dictionary={dictionary} />
        <div className="lg:col-span-2">
          <LunarAscendantSection dictionary={dictionary} locale={params.locale} />
        </div>
      </div>
    </main>
  );
}
