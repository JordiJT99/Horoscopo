
import { psychics } from '@/lib/psychics';
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import PsychicChatUI from '@/components/psychic-chat/PsychicChatUI';
import SectionTitle from '@/components/shared/SectionTitle';
import { MessageCircle } from 'lucide-react';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  const psychicIds = psychics.map(p => p.id);

  const params: { locale: string; psychicId: string }[] = [];
  locales.forEach(locale => {
    psychicIds.forEach(psychicId => {
      params.push({ locale, psychicId });
    });
  });

  return params;
}

interface PsychicChatPageProps {
  params: { psychicId: string; locale: Locale };
}

const PsychicChatPage = async ({ params }: PsychicChatPageProps) => {
  const { psychicId, locale } = params;

  const dictionary = await getDictionary(locale);

  const psychic = psychics.find((p) => p.id === psychicId);

  if (!psychic) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{dictionary['PsychicChatPage.psychicNotFound'] || 'Psychic not found'}</h1>
        <p>{dictionary['PsychicChatPage.psychicNotFoundMessage'] || 'The psychic you are looking for could not be found.'}</p>
      </div>
    );
  }

  return (
    //  The main container now uses the full viewport height minus nav/header, with minimal padding.
    //  This allows the chat UI to properly fill the screen on mobile.
     <main className="flex-grow px-2 sm:px-4 py-4 md:py-8 flex flex-col h-[calc(100vh-var(--top-bar-height,56px)-var(--bottom-nav-height,64px))]">
       <div className="container mx-auto">
         <SectionTitle
          title={(dictionary['PsychicChatPage.chatWith'] || "Chat with {psychicName}").replace('{psychicName}', psychic.name)}
          subtitle={dictionary[psychic.specialty] || psychic.specialty}
          icon={MessageCircle}
          className="mb-4"
        />
       </div>
      {/* min-h-0 is a flexbox trick to prevent the child from overflowing its container */}
      <div className="flex-grow min-h-0">
        <PsychicChatUI psychic={psychic} dictionary={dictionary} locale={locale} />
      </div>
    </main>
  );
};

export default PsychicChatPage;
