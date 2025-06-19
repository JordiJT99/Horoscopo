
// THIS IS NOW A SERVER COMPONENT
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Wand } from 'lucide-react';
import TarotReadingClient from '@/components/tarot-reading/TarotReadingClient'; // Import the new client component

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface TarotReadingPageProps {
  params: { locale: Locale }; // Params are directly available in Server Components
}

export default async function TarotReadingPage({ params }: TarotReadingPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['TarotReadingPage.title'] || "Tarot Reading"}
        subtitle={dictionary['TarotReadingPage.subtitle'] || "Ask a question and draw a card for guidance."}
        icon={Wand}
        className="mb-12"
      />
      <TarotReadingClient dictionary={dictionary} locale={params.locale} />
    </main>
  );
}

