import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { ZODIAC_SIGNS } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import SectionTitle from '@/components/shared/SectionTitle';
import { Orbit } from 'lucide-react';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({ locale }));
}

interface ZodiacGalleryPageProps {
  params: {
    locale: Locale;
  };
}

export default async function ZodiacGalleryPage({ params }: ZodiacGalleryPageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['ZodiacGalleryPage.title'] || "Zodiac Signs"}
        subtitle={dictionary['ZodiacGalleryPage.subtitle'] || "Explore the characteristics of each astrological sign."}
        icon={Orbit}
        className="mb-10"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {ZODIAC_SIGNS.map((sign) => {
          const signNameLowerCase = sign.name.toLowerCase();
          const translatedSignName = dictionary[sign.name] || sign.name;
          const imagePath = sign.customIconPath || `https://placehold.co/150x150.png?text=${sign.name.substring(0, 2).toUpperCase()}`;
          const aiHint = sign.customIconPath ? `${sign.name.toLowerCase()} zodiac symbol illustration` : "zodiac placeholder";

          return (
            <Link key={sign.name} href={`/${params.locale}/zodiac/${signNameLowerCase}`} className="group block">
              <Card className="h-full bg-card/70 backdrop-blur-sm border-border/30 shadow-lg hover:shadow-primary/30 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-3 sm:p-4 flex flex-col items-center justify-center">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3">
                    <Image
                      src={imagePath}
                      alt={translatedSignName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                      className="rounded-full group-hover:scale-105 transition-transform duration-300 object-cover"
                      data-ai-hint={aiHint}
                    />
                  </div>
                  <h3 className="font-headline text-lg sm:text-xl font-semibold text-foreground text-center">{translatedSignName}</h3>
                  <p className="text-xs text-muted-foreground">{sign.dateRange}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
