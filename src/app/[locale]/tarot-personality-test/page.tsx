
// THIS IS NOW A SERVER COMPONENT
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { User } from 'lucide-react'; // Icon for SectionTitle
import TarotPersonalityTestClientPage from '@/components/tarot-personality/TarotPersonalityTestClientPage'; // Import the new client component

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface TarotPersonalityTestPageProps {
  params: { locale: Locale };
}

export default async function TarotPersonalityTestPage({ params }: TarotPersonalityTestPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['TarotPersonalityPage.title'] || "What Tarot Card Are You?"}
        subtitle={dictionary['TarotPersonalityPage.subtitle'] || "Answer a few questions to discover your tarot card."}
        icon={User}
        className="mb-12"
      />
      <TarotPersonalityTestClientPage dictionary={dictionary} locale={params.locale} />
    </main>
  );
}
