import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { CHINESE_ZODIAC_SIGNS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChineseZodiacSign } from '@/types';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  const signs = CHINESE_ZODIAC_SIGNS.map(s => s.name.toLowerCase());
  const params: { locale: string; sign: string }[] = [];

  locales.forEach(locale => {
    signs.forEach(sign => {
      params.push({ locale, sign });
    });
  });

  return params;
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

export default async function ChineseHoroscopeDetailPage({ params }: { params: { locale: Locale, sign: string } }) {
  const dictionary = await getDictionary(params.locale);
  const signData = CHINESE_ZODIAC_SIGNS.find(s => s.name.toLowerCase() === params.sign.toLowerCase());

  if (!signData) {
    notFound();
  }
  
  const translatedSignName = dictionary[signData.name] || signData.name;
  const translatedElement = dictionary[signData.element] || signData.element;
  const descriptionKey = signData.descriptionKey || `ChineseHoroscopePage.descriptions.${signData.name}`;
  const briefDescription = dictionary[descriptionKey] || signData.description;
  const detailedInterpretation = dictionary.ChineseHoroscopeDetail?.[signData.name]?.interpretation;


  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 text-primary">
                    <AnimalIcon sign={signData} size={192} dictionary={dictionary} />
                </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mb-2">{translatedSignName}</h1>
        </div>

        <Card className="max-w-3xl mx-auto bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
            <CardHeader>
                <CardTitle className="text-2xl text-primary font-headline">{dictionary.ChineseHoroscopeDetail?.traitsTitle?.replace('{signName}', translatedSignName) || `Traits of ${translatedSignName}`}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-secondary/30 rounded-md">
                        <p className="font-semibold text-sm text-muted-foreground">{dictionary['ChineseHoroscopePage.element']}</p>
                        <Badge variant="secondary">{translatedElement}</Badge>
                    </div>
                    <div className="p-3 bg-secondary/30 rounded-md">
                        <p className="font-semibold text-sm text-muted-foreground">{dictionary['ChineseHoroscopePage.years']}</p>
                        <p className="text-xs font-body">{signData.years.slice(0, 5).join(', ')}...</p>
                    </div>
                </div>

                <div className="text-base text-foreground/90 leading-relaxed space-y-4">
                    <p className="italic">{briefDescription}</p>
                    <p>{detailedInterpretation || "Detailed interpretation coming soon."}</p>
                </div>
            </CardContent>
        </Card>
    </main>
  );
}
