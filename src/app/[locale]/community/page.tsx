
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Users } from 'lucide-react';
import CommunityFeed from '@/components/community/CommunityFeed';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale.toString(),
  }));
}

interface CommunityPageProps {
  params: {
    locale: Locale;
  };
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-2 sm:px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['CommunityPage.title'] || "Community"}
        subtitle={dictionary['CommunityPage.subtitle'] || "Share your thoughts and connect with others."}
        icon={Users}
        className="mb-8"
      />
      <Suspense fallback={
        <div className="text-center">
          <LoadingSpinner className="h-12 w-12 text-primary" />
        </div>
      }>
        <CommunityFeed dictionary={dictionary} locale={params.locale} />
      </Suspense>
    </main>
  );
}
