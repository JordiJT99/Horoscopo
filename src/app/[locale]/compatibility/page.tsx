
// Server Component - Ahora es la página de SELECCIÓN DE TIPO DE COMPATIBILIDAD
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { Users } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import CompatibilityTypeSelectorCards from '@/components/compatibility/CompatibilityTypeSelectorCards'; // Nuevo componente cliente
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface CompatibilityPageProps {
  params: {
    locale: Locale;
  };
}

export default async function CompatibilityTypeSelectionPage({ params }: CompatibilityPageProps) {
  const dictionary = await getDictionary(params.locale);

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-screen">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['CompatibilityPage.selectTypeTitle'] || "Explore Connections"}
        subtitle={dictionary['CompatibilityPage.selectTypeSubtitle'] || "Choose a relationship type to explore zodiac compatibility."}
        icon={Users} 
        className="mb-10 sm:mb-12"
      />
      <CompatibilityTypeSelectorCards dictionary={dictionary} locale={params.locale} />
    </main>
  );
}
