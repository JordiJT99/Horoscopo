// src/app/[locale]/premium/page.tsx
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Star } from 'lucide-react';
import PremiumClientPage from '@/components/premium/PremiumClientPage'; // Import the new client component
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface PremiumPageProps {
  params: { locale: Locale };
}

export default async function PremiumPage({ params }: PremiumPageProps) {
  const dictionary = await getDictionary(params.locale);

  if (!dictionary) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary.PremiumPage?.title || 'AstroVibes Premium'}
        subtitle={dictionary.PremiumPage?.subtitle || 'Unlock the full power of the cosmos.'}
        icon={Star}
        className="mb-12"
      />
      <PremiumClientPage dictionary={dictionary} locale={params.locale} />
    </main>
  );
}
