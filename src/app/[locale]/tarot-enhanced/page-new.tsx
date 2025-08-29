/**
 * @fileOverview Página del Sistema de Tarot Mejorado
 * Página completa que integra la experiencia mejorada de tarot
 */

// THIS IS NOW A SERVER COMPONENT
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/types';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import TarotEnhancedClient from '@/components/tarot-enhanced/TarotEnhancedClient';

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

  return <TarotEnhancedClient dictionary={dictionary} locale={locale} />;
}
