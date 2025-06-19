
// Server Component
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Clover, Loader2 } from 'lucide-react';
import LuckyNumbersClientContent from '@/components/lucky-numbers/LuckyNumbersClientContent';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface LuckyNumbersPageProps {
  params: {
    locale: Locale;
  };
}

export default async function LuckyNumbersPage({ params }: LuckyNumbersPageProps) {
  const dictionary = await getDictionary(params.locale);

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['LuckyNumbersPage.title'] || "Lucky Charms"}
        subtitle={dictionary['LuckyNumbersPage.subtitle'] || "Find out your lucky numbers, color, and gemstone for your sign."}
        icon={Clover}
        className="mb-12"
      />
      <LuckyNumbersClientContent dictionary={dictionary} locale={params.locale} />
    </main>
  );
}
