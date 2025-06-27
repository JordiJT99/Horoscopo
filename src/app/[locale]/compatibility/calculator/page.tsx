// Server Component - This page now just fetches data and renders the client wrapper.
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import CompatibilityCalculatorClient from '@/components/compatibility/CompatibilityCalculatorClient'; // Import the new client component

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface CompatibilityCalculatorPageProps {
  params: {
    locale: Locale;
  };
  // searchParams is removed as it's now handled on the client
}

export default async function CompatibilityCalculatorPage({ params }: CompatibilityCalculatorPageProps) {
  const dictionary = await getDictionary(params.locale);

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-screen">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  // The logic that used searchParams is now in CompatibilityCalculatorClient.
  // The server page just fetches the dictionary and renders the client component.
  return <CompatibilityCalculatorClient dictionary={dictionary} locale={params.locale} />;
}
