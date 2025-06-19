
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { BedDouble } from 'lucide-react'; // Icon used by SectionTitle in this Server Component
import DreamReadingClient from '@/components/dream-reading/DreamReadingClient'; // Import the new client component

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface DreamReadingPageProps {
  params: { // Params are directly available in Server Components
    locale: Locale;
  };
}

// Page component (default export) - now an async Server Component
export default async function DreamReadingPage({ params }: DreamReadingPageProps) {
  const dictionary = await getDictionary(params.locale); // Resolve the dictionary promise

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['DreamReadingPage.title'] || "Dream Reading"}
        subtitle={dictionary['DreamReadingPage.subtitle'] || "Uncover the hidden meanings and symbols within your dreams."}
        icon={BedDouble}
        className="mb-12"
      />
      {/* Pass resolved data to the client component */}
      <DreamReadingClient dictionary={dictionary} locale={params.locale} />
    </main>
  );
}
