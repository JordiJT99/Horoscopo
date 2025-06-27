import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Handshake } from 'lucide-react';
import PsychicMatchForm from '@/components/psychic-chat/PsychicMatchForm';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface PsychicMatchPageProps {
  params: {
    locale: Locale;
  };
}

export default async function PsychicMatchPage({ params }: PsychicMatchPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['PsychicMatch.title'] || "Find Your Psychic"}
        subtitle={dictionary['PsychicMatch.subtitle'] || "Answer a few questions to connect with the right guide for you."}
        icon={Handshake}
        className="mb-8"
      />
      <PsychicMatchForm dictionary={dictionary} locale={params.locale} />
    </main>
  );
}
