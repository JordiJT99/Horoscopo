import PsychicChatClient from '@/components/psychic-chat/PsychicChatClient';
import SectionTitle from '@/components/shared/SectionTitle';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { MessageSquare } from 'lucide-react';

export async function generateStaticParams() {
    const locales = getSupportedLocales();
    return locales.map((locale) => ({
      locale: locale.toString(),
    }));
}

export default async function PsychicChatPage({ params }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(params.locale);
  
  const title = dictionary['PsychicChatPage.title'] || "Psychic Chat";
  const subtitle = dictionary['PsychicChatPage.subtitle'] || "Connect with a mystical guide for personalized insights.";
  
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex flex-col h-[calc(100vh-var(--top-bar-height,56px)-var(--bottom-nav-height,64px))]">
      <SectionTitle
        title={title}
        subtitle={subtitle}
        icon={MessageSquare}
        className="mb-8"
      />
      <div className="flex-grow">
        <PsychicChatClient dictionary={dictionary} locale={params.locale} />
      </div>
    </main>
  );
}
