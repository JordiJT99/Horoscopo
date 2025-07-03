// Server Component - The new main gallery page for Chinese Horoscope
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { CHINESE_ZODIAC_SIGNS, ChineseAstrologyIcon } from '@/lib/constants';
import SectionTitle from '@/components/shared/SectionTitle';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Users } from 'lucide-react';
import type { ChineseZodiacSign } from '@/types';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface ChineseHoroscopeGalleryPageProps {
  params: { locale: Locale };
}

const AnimalIcon = ({ sign, size, dictionary }: { sign: ChineseZodiacSign, size: number, dictionary: any }) => {
  const IconComponent = sign.icon;
  if (IconComponent) {
    return <IconComponent className="w-full h-full" />;
  }
  return (
    <Image
      src={`https://placehold.co/${size}x${size}.png`}
      alt={dictionary[sign.name] || sign.name}
      width={size}
      height={size}
      className="rounded-sm"
      data-ai-hint={`${sign.name.toLowerCase()}`}
    />
  );
};

export default async function ChineseHoroscopeGalleryPage({ params }: ChineseHoroscopeGalleryPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['ChineseHoroscopePage.title']}
        subtitle={dictionary['ChineseHoroscopePage.subtitle']}
        icon={ChineseAstrologyIcon}
        className="mb-10"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
        <Button asChild size="lg" className="h-auto py-4">
          <Link href={`/${params.locale}/chinese-horoscope/calculator`}>
            <Calculator className="mr-3 h-6 w-6" />
            <div>
              <p className="font-semibold">{dictionary['ChineseHoroscopePage.discoverSignButton'] || "Discover Your Sign"}</p>
              <p className="text-xs font-normal opacity-80">{dictionary['ChineseHoroscopePage.discoverSignSubtitle'] || "Find your animal & element"}</p>
            </div>
          </Link>
        </Button>
        <Button asChild size="lg" variant="secondary" className="h-auto py-4">
          <Link href={`/${params.locale}/chinese-horoscope/compatibility`}>
            <Users className="mr-3 h-6 w-6" />
             <div>
              <p className="font-semibold">{dictionary['ChineseHoroscopePage.checkCompatibilityButtonTitle'] || "Check Compatibility"}</p>
              <p className="text-xs font-normal opacity-80">{dictionary['ChineseHoroscopePage.checkCompatibilitySubtitle'] || "See how signs match up"}</p>
            </div>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {CHINESE_ZODIAC_SIGNS.map((sign) => {
          const signNameLowerCase = sign.name.toLowerCase();
          const translatedSignName = dictionary[sign.name] || sign.name;
          return (
            <Link key={sign.name} href={`/${params.locale}/chinese-horoscope/${signNameLowerCase}`} className="group block">
              <Card className="h-full bg-card/70 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-primary/30 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 text-primary group-hover:text-primary/80 transition-colors">
                    <AnimalIcon sign={sign} size={96} dictionary={dictionary} />
                  </div>
                  <h3 className="font-headline text-base sm:text-lg font-semibold text-foreground text-center">{translatedSignName}</h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
