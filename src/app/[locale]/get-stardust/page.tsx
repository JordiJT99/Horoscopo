
// src/app/[locale]/get-stardust/page.tsx

import type { Locale } from '@/types';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import GetStardustCard from '@/components/stardust/GetStardustCard';
import AchievementsCard from '@/components/profile/AchievementsCard';
import { Gem } from 'lucide-react';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale.toString(),
  }));
}

interface GetStardustPageProps {
  params: { locale: Locale };
}

export default async function GetStardustPage({ params }: GetStardustPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['GetStardustPage.title'] || "Stardust & Rewards"}
        subtitle={dictionary['GetStardustPage.subtitle'] || "Power up your cosmic journey."}
        icon={Gem}
        className="mb-12"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <GetStardustCard dictionary={dictionary} />
        <AchievementsCard />
      </div>
    </main>
  );
}
