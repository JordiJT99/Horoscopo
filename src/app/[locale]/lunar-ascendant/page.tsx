
// Server Component
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import LunarAscendantClientContent from '@/components/lunar-ascendant/LunarAscendantClientContent'; // Import the new client component
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface LunarAscendantPageProps {
  params: {
    locale: Locale;
  };
}

export default async function LunarAscendantPage({ params }: LunarAscendantPageProps) {
  const dictionary = await getDictionary(params.locale);

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return <LunarAscendantClientContent dictionary={dictionary} locale={params.locale} />;
}
