// Server Component
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import PrivacyClientContent from '@/components/privacy/PrivacyClientContent';
import { Shield } from 'lucide-react';
import SectionTitle from '@/components/shared/SectionTitle';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface PrivacyPageProps {
  params: { locale: Locale };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary.PrivacyPolicy?.title || 'Privacy Policy'}
        subtitle={dictionary.PrivacyPolicy?.subtitle || 'Your privacy is important to us.'}
        icon={Shield}
        className="mb-8"
      />
      <PrivacyClientContent dictionary={dictionary} />
    </main>
  );
}
