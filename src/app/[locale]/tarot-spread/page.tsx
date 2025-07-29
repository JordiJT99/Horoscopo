
// Server Component for the Tarot Spread page
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Layers } from 'lucide-react';
import TarotSpreadClient from '@/components/tarot-spread/TarotSpreadClient';
import AdMobBanner from '@/components/shared/AdMobBanner';
import { BannerAdPosition } from '@capacitor-community/admob';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale.toString(),
  }));
}

interface TarotSpreadPageProps {
  params: {
    locale: Locale;
  };
}

export default async function TarotSpreadPage({ params }: TarotSpreadPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      {/* Banner superior */}
      <AdMobBanner position={BannerAdPosition.TOP_CENTER} />
      
      <SectionTitle
        title={dictionary['TarotSpreadPage.title'] || "Tarot Spread"}
        subtitle={dictionary['TarotSpreadPage.subtitle'] || "Select two cards to reveal their combined message for you."}
        icon={Layers}
        className="mb-8"
      />
      
      <TarotSpreadClient dictionary={dictionary} locale={params.locale} />
      
      {/* Banner inferior */}
      <AdMobBanner position={BannerAdPosition.BOTTOM_CENTER} />
    </main>
  );
}
