import PsychicGallery from '@/components/psychic-chat/PsychicGallery';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale.toString(),
  }));
}

export default async function PsychicChatPage({ params }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(params.locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">{dictionary['PsychicGallery.title'] || "Select Your Psychic Guide"}</h1>
      <PsychicGallery dictionary={dictionary} locale={params.locale} />
    </div>
  );
}
