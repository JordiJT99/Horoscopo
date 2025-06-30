// Server Component - Detail page for a specific Mayan Sign
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { MAYAN_ZODIAC_SIGNS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { MayanZodiacSign } from '@/types';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  const signs = MAYAN_ZODIAC_SIGNS.map(s => s.name.toLowerCase());
  const params: { locale: string; sign: string }[] = [];

  locales.forEach(locale => {
    signs.forEach(sign => {
      params.push({ locale, sign });
    });
  });

  return params;
}

export default async function MayanHoroscopeDetailPage({ params }: { params: { locale: Locale, sign: string } }) {
  const dictionary = await getDictionary(params.locale);
  const signData = MAYAN_ZODIAC_SIGNS.find(s => s.name.toLowerCase() === params.sign.toLowerCase());

  if (!signData) {
    notFound();
  }

  const translatedSignName = dictionary[signData.nameKey] || signData.name;
  const description = dictionary[signData.descriptionKey] || 'Description not available.';
  const detailedInterpretation = dictionary.MayanSign?.[signData.name]?.interpretation || "Detailed interpretation coming soon.";
  const Icon = signData.icon;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 text-primary">
            <Icon className="w-full h-full" />
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mb-2">{translatedSignName}</h1>
      </div>

      <Card className="max-w-3xl mx-auto bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-headline">
            {dictionary.MayanHoroscopeDetailPage?.aboutTitle.replace('{signName}', translatedSignName) || `About ${translatedSignName}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-base text-foreground/90 leading-relaxed space-y-4">
            <p className="italic">{description}</p>
            <p className="whitespace-pre-line">{detailedInterpretation}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
