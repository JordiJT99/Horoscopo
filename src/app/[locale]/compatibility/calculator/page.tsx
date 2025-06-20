
// Server Component - Página para SELECCIONAR SIGNOS Y VER INFORME
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import CompatibilityClientContent from '@/components/compatibility/CompatibilityClientContent';
import { Loader2, Heart, Handshake, Briefcase } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';
import type { CompatibilityType } from '@/components/compatibility/CompatibilityClientContent'; // Importar el tipo

export async function generateStaticParams() {
  // No es necesario generar params para type si se usa searchParams
  // Solo necesitamos generar para locale
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface CompatibilityCalculatorPageProps {
  params: {
    locale: Locale;
  };
  searchParams: {
    type?: string; // type vendrá como searchParam
  };
}

export default async function CompatibilityCalculatorPage({ params, searchParams }: CompatibilityCalculatorPageProps) {
  const dictionary = await getDictionary(params.locale);
  const compatibilityType = (searchParams?.type as CompatibilityType) || 'love'; // Default a 'love' si no se provee

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  let pageTitle = dictionary['CompatibilityPage.calculatorTitleDefault'] || "Zodiac Compatibility Calculator";
  let pageSubtitle = dictionary['CompatibilityPage.calculatorSubtitleDefault'] || "Select two signs to see their compatibility report.";
  let Icon = Heart;

  switch (compatibilityType) {
    case 'love':
      pageTitle = dictionary['CompatibilityPage.calculatorTitleLove'] || "Love Compatibility Calculator";
      pageSubtitle = dictionary['CompatibilityPage.calculatorSubtitleLove'] || "Discover how well signs match in romance.";
      Icon = Heart;
      break;
    case 'friendship':
      pageTitle = dictionary['CompatibilityPage.calculatorTitleFriendship'] || "Friendship Compatibility Calculator";
      pageSubtitle = dictionary['CompatibilityPage.calculatorSubtitleFriendship'] || "Explore the dynamics of friendship between signs.";
      Icon = Handshake;
      break;
    case 'work':
      pageTitle = dictionary['CompatibilityPage.calculatorTitleWork'] || "Work Compatibility Calculator";
      pageSubtitle = dictionary['CompatibilityPage.calculatorSubtitleWork'] || "See how signs collaborate in a professional setting.";
      Icon = Briefcase;
      break;
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={pageTitle}
        subtitle={pageSubtitle}
        icon={Icon}
        className="mb-10 sm:mb-12"
      />
      <CompatibilityClientContent
        dictionary={dictionary}
        locale={params.locale}
        compatibilityTypeFromPage={compatibilityType} // Pasar el tipo aquí
      />
    </main>
  );
}
