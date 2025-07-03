// Server Component - Detail page for a specific Mayan Galactic Tone
import type { Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import { GALACTIC_TONES } from '@/lib/constants';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';

export async function generateStaticParams() {
  const locales = getSupportedLocales();
  const tones = GALACTIC_TONES.map(t => t.id.toString());
  const params: { locale: string; toneId: string }[] = [];

  locales.forEach(locale => {
    tones.forEach(toneId => {
      params.push({ locale, toneId });
    });
  });

  return params;
}

export default async function MayanToneDetailPage({ params }: { params: { locale: Locale, toneId: string } }) {
  const dictionary = await getDictionary(params.locale);
  const toneData = GALACTIC_TONES.find(t => t.id.toString() === params.toneId);

  if (!toneData) {
    notFound();
  }

  const translatedToneName = dictionary[`GalacticTone.${toneData.nameKey}.name`] || toneData.nameKey;
  const translatedKeyword = dictionary[`GalacticTone.${toneData.nameKey}.keyword`] || toneData.keywordKey;
  const translatedQuestion = dictionary[`GalacticTone.${toneData.nameKey}.question`] || toneData.questionKey;
  const detailedInterpretation = dictionary[toneData.detailedInterpretationKey] || "Detailed interpretation coming soon.";
  
  const pageTitle = `${dictionary['MayanHoroscopePage.tone'] || 'Tone'} ${toneData.id}: ${translatedToneName}`;

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 text-primary flex items-center justify-center border-4 border-primary/20 rounded-full bg-background/50 shadow-lg">
            <span className="text-7xl sm:text-8xl font-bold font-headline">{toneData.id}</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mb-2">{pageTitle}</h1>
        <p className="text-lg text-muted-foreground uppercase tracking-widest">{translatedKeyword}</p>
      </div>

      <Card className="max-w-3xl mx-auto bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary font-headline flex items-center gap-2">
            <Layers className="w-6 h-6" />
            {dictionary['MayanHoroscopeDetailPage.aboutTitle']?.replace('{signName}', translatedToneName) || `About ${translatedToneName}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground/90">
            {translatedQuestion}
          </blockquote>
          <div className="text-base text-foreground/90 leading-relaxed space-y-4 whitespace-pre-line">
            <p>{detailedInterpretation}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
