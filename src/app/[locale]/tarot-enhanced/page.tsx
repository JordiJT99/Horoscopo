/**
 * @fileOverview Página del Sistema de Tarot Mejorado
 * Página completa que integra la experiencia mejorada de tarot con interfaz similar a tarot-spread
 */

// THIS IS NOW A SERVER COMPONENT
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/types';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Sparkles } from 'lucide-react';
import TarotEnhancedClient from '@/components/tarot-enhanced/TarotEnhancedClient';
import AdMobBanner from '@/components/shared/AdMobBanner';
import { BannerAdPosition } from '@capacitor-community/admob';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface TarotEnhancedPageProps {
  params: Promise<{ locale: Locale }>; // Params are now Promise in Next.js 15
}

export default async function TarotEnhancedPage({ params }: TarotEnhancedPageProps) {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      {/* Banner superior */}
      <AdMobBanner position={BannerAdPosition.TOP_CENTER} />
      
      <SectionTitle
        title={dictionary?.TarotEnhanced?.pageTitle || "Tirada del Tarot"}
        subtitle={dictionary?.TarotEnhanced?.pageDescription || "Descubre tu Pasado, Presente y Futuro"}
        icon={Sparkles}
        className="mb-8"
      />
      
      <TarotEnhancedClient dictionary={dictionary} locale={locale} />
      
      {/* Banner inferior */}
      <AdMobBanner position={BannerAdPosition.BOTTOM_CENTER} />
    </main>
  );
}
