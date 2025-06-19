
// Server Component
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Eye } from 'lucide-react'; // Icon for SectionTitle
import CrystalBallClientContent from '@/components/crystal-ball/CrystalBallClientContent';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface CrystalBallPageProps {
  params: { locale: Locale };
}

export default async function CrystalBallPage({ params }: CrystalBallPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['CrystalBallPage.title'] || "Crystal Ball"}
        subtitle={dictionary['CrystalBallPage.subtitle'] || "Peer into the mists and ask your question to the Crystal Ball."}
        icon={Eye}
        className="mb-12"
      />
      <CrystalBallClientContent dictionary={dictionary} locale={params.locale} />
    </main>
  );
}
