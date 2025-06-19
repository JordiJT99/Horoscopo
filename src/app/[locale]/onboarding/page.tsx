
// src/app/[locale]/onboarding/page.tsx
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import OnboardingClientContent from '@/components/onboarding/OnboardingClientContent';
import SectionTitle from '@/components/shared/SectionTitle';
import { Edit, Loader2 } from 'lucide-react';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface OnboardingPageProps {
  params: { locale: Locale };
}

export default async function OnboardingPage({ params }: OnboardingPageProps) {
  const dictionary = await getDictionary(params.locale);

  // Initial loading state (e.g., if dictionary is still resolving or for other server-side checks)
  // This is usually handled by Suspense if components within AstroVibesHomePageContent are async.
  // For now, we assume dictionary is resolved here.

  if (Object.keys(dictionary).length === 0) { // Basic check if dictionary failed to load server-side
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <SectionTitle
          title="Loading..."
          icon={Loader2}
          className="mb-8 animate-pulse"
        />
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
        <p className="mt-4 font-body">Loading onboarding experience...</p>
      </div>
    );
  }
  
  // Render the client component with fetched data
  return <OnboardingClientContent dictionary={dictionary} locale={params.locale} />;
}
