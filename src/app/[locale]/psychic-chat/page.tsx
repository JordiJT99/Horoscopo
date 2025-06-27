
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { psychics, type Psychic } from '@/lib/psychics';
import SectionTitle from '@/components/shared/SectionTitle';
import Link from 'next/link';
import { ChevronRight, Heart, Search, Star, Target, ThumbsUp } from 'lucide-react';
import PsychicCard from '@/components/psychic-chat/PsychicCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale.toString(),
  }));
}

interface PsychicCategoryRowProps {
  title: string;
  description: string;
  icon: React.ElementType;
  psychics: Psychic[];
  dictionary: Dictionary;
  locale: Locale;
}

const PsychicCategoryRow: React.FC<PsychicCategoryRowProps> = ({ title, description, icon: Icon, psychics, dictionary, locale }) => {
  if (psychics.length === 0) {
    return null; // Don't render the section if there are no psychics for it
  }
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-3 px-2">
        <div className="flex items-center gap-2">
          <Icon className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold font-headline text-foreground">{title}</h2>
        </div>
        <Button variant="link" asChild className="text-primary">
          <Link href="#">{dictionary['PsychicGallery.viewAll'] || 'View all'}</Link>
        </Button>
      </div>
      <p className="text-muted-foreground text-sm mb-4 px-2">{description}</p>
      <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar px-2">
        {psychics.map(psychic => (
          <div key={psychic.id} className="flex-shrink-0 w-[160px]">
            <PsychicCard
              psychic={psychic}
              dictionary={dictionary}
              locale={locale}
            />
          </div>
        ))}
      </div>
    </section>
  );
};


export default async function PsychicChatPage({ params }: { params: { locale: Locale } }) {
  const dictionary = await getDictionary(params.locale);

  // --- Logic for Categorizing Psychics ---

  // "Your Affinity Psychics" - Based on most reviews (loyal followers)
  const affinityPsychics = [...psychics].sort((a, b) => b.reviews - a.reviews);

  // "The Most Accurate" - Based on highest rating
  const mostAccuratePsychics = [...psychics].sort((a, b) => b.rating - a.rating);

  // "Best Love Readings" - Filtered by specialty
  const loveReadingPsychics = psychics.filter(p => p.specialty === 'PsychicSpecialty.loveRelationships');

  // --- End of Logic ---


  return (
    <main className="container mx-auto px-2 sm:px-4 py-6">
      <h1 className="text-3xl font-bold font-headline text-center mb-6">{dictionary['PsychicGallery.title'] || "Psychics"}</h1>

      <Link href={`/${params.locale}/psychic-chat/match`} className={cn(
        "mb-8 p-4 rounded-lg text-white flex items-center justify-between cursor-pointer",
        "bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg hover:shadow-primary/40 transition-shadow"
        )}>
        <div className='flex items-center gap-3'>
            <div className='bg-white/20 p-2 rounded-full'>
                <Search className="h-6 w-6" />
            </div>
            <div>
                <h3 className="font-bold font-headline">{dictionary['PsychicGallery.findPerfectPsychicTitle'] || 'Ready to find the perfect psychic?'}</h3>
                <p className="text-sm opacity-90">{dictionary['PsychicGallery.findPerfectPsychicSubtitle'] || "Let us assign someone to you!"}</p>
            </div>
        </div>
        <ChevronRight className="h-6 w-6" />
      </Link>

      <PsychicCategoryRow
        title={dictionary['PsychicGallery.affinityPsychicsTitle'] || 'Your Affinity Psychics'}
        description={dictionary['PsychicGallery.affinityPsychicsDescription'] || 'Psychics who best fit your profile and are highly recommended by their loyal followers.'}
        icon={ThumbsUp}
        psychics={affinityPsychics}
        dictionary={dictionary}
        locale={params.locale}
      />
      
      <PsychicCategoryRow
        title={dictionary['PsychicGallery.mostAccurateTitle'] || 'The Most Accurate'}
        description={dictionary['PsychicGallery.mostAccurateDescription'] || 'Psychics recognized for their exceptional precision in predictions and guidance.'}
        icon={Target}
        psychics={mostAccuratePsychics}
        dictionary={dictionary}
        locale={params.locale}
      />

      <PsychicCategoryRow
        title={dictionary['PsychicGallery.loveReadingsTitle'] || 'Best Love Readings'}
        description={dictionary['PsychicGallery.loveReadingsDescription'] || 'Specialists in matters of the heart, relationships, and soulmates.'}
        icon={Heart}
        psychics={loveReadingPsychics}
        dictionary={dictionary}
        locale={params.locale}
      />
      
    </main>
  );
}
