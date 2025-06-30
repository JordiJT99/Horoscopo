// Server Component - Page for the Chinese Zodiac Compatibility tool
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Users } from 'lucide-react';
import ChineseHoroscopeInteractive from '@/components/chinese-horoscope/ChineseHoroscopeInteractive';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface CompatibilityPageProps {
  params: { locale: Locale };
}

export default async function ChineseHoroscopeCompatibilityPage({ params }: CompatibilityPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['ChineseHoroscopePage.compatibilityTitle'] || "Chinese Zodiac Compatibility"}
        subtitle={dictionary['ChineseHoroscopePage.checkCompatibilitySubtitle'] || "See how two animal signs match up."}
        icon={Users}
        className="mb-12"
      />
      <ChineseHoroscopeInteractive dictionary={dictionary} locale={params.locale} mode="compatibility" />
    </main>
  );
}
