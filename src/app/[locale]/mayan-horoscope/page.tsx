// Server Component - The new main gallery page for Mayan Horoscope
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { MAYAN_ZODIAC_SIGNS, MayanAstrologyIcon, KinCalculatorIcon, GALACTIC_TONES } from '@/lib/constants';
import SectionTitle from '@/components/shared/SectionTitle';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
import type { MayanZodiacSign } from '@/types';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface MayanHoroscopeGalleryPageProps {
  params: { locale: Locale };
}

export default async function MayanHoroscopeGalleryPage({ params }: MayanHoroscopeGalleryPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary.MayanHoroscopePage?.title || "Mayan Horoscope"}
        subtitle={dictionary.MayanHoroscopePage?.subtitle || "Explore the ancient wisdom of Mayan astrology"}
        icon={MayanAstrologyIcon}
        className="mb-10"
      />

      <div className="flex justify-center mb-12">
        <Button asChild size="lg" className="h-auto py-4">
          <Link href={`/${params.locale}/mayan-horoscope/calculator`}>
            <KinCalculatorIcon className="mr-3 h-6 w-6" />
            <div>
              <p className="font-semibold">{dictionary.MayanHoroscopePage?.discoverKinButton || "Discover Your Kin"}</p>
              <p className="text-xs font-normal opacity-80">{dictionary.MayanHoroscopePage?.discoverKinSubtitle || "Find your sign & galactic tone"}</p>
            </div>
          </Link>
        </Button>
      </div>

      <SectionTitle
        title={dictionary.MayanHoroscopePage?.signsTitle || "The 20 Solar Seals (Nahuales)"}
        className="mb-8 text-2xl"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {MAYAN_ZODIAC_SIGNS.map((sign) => {
          const signNameLowerCase = sign.name.toLowerCase();
          const translatedSignName = dictionary[sign.nameKey] || sign.name;
          const Icon = sign.icon;
          return (
            <Link key={sign.name} href={`/${params.locale}/mayan-horoscope/${signNameLowerCase}`} className="group block">
              <Card className="h-full bg-card/70 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-primary/30 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center text-center">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 text-primary group-hover:text-primary/80 transition-colors flex items-center justify-center">
                    <Icon className="w-full h-full" />
                  </div>
                  <h3 className="font-headline text-base sm:text-lg font-semibold text-foreground">{translatedSignName}</h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Galactic Tones Section */}
      <SectionTitle
        title={dictionary.MayanHoroscopePage?.galacticTonesTitle || "The 13 Galactic Tones"}
        icon={Layers}
        className="mt-16 mb-8 text-2xl"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {GALACTIC_TONES.map((tone) => {
          const translatedToneName = dictionary[`GalacticTone.${tone.nameKey}.name`] || tone.nameKey;
          const translatedKeyword = dictionary[`GalacticTone.${tone.nameKey}.keyword`] || tone.keywordKey;

          return (
            <Card key={tone.id} className="h-full bg-card/70 backdrop-blur-sm border-border/30 shadow-lg">
              <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-3 text-primary flex items-center justify-center border-2 border-primary/20 rounded-full bg-background/30">
                  <span className="text-4xl sm:text-5xl font-bold font-headline">{tone.id}</span>
                </div>
                <h3 className="font-headline text-base sm:text-lg font-semibold text-foreground">{translatedToneName}</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">{translatedKeyword}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
