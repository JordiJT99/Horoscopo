
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MAYAN_ZODIAC_SIGNS, GALACTIC_TONES, MayanAstrologyIcon, GalacticTonesIcon } from '@/lib/constants';
import { Separator } from '@/components/ui/separator';

interface MayanHoroscopePageProps {
  params: {
    locale: Locale;
  };
}

export default async function MayanHoroscopePage({ params }: MayanHoroscopePageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['MayanHoroscopePage.title']}
        subtitle={dictionary['MayanHoroscopePage.subtitle']}
        icon={MayanAstrologyIcon}
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {MAYAN_ZODIAC_SIGNS.map((sign) => {
          const SignIcon = sign.icon;
          // Mayan sign names in locales might include a suffix like "(Dragon/Crocodile)". 
          // We use the base name for the key if the full one isn't found.
          const baseSignName = sign.name.split(" ")[0]; // e.g., "Imix" from "Imix (Dragon/Crocodile)"
          const translatedSignName = dictionary[sign.name] || dictionary[baseSignName] || sign.name;
          
          return (
            <Card key={sign.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="items-center text-center">
                <SignIcon className="w-12 h-12 text-primary mb-2" />
                <CardTitle className="font-headline text-xl text-primary">{translatedSignName}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="font-semibold text-sm text-muted-foreground mb-1">{dictionary['MayanHoroscopePage.description']}</p>
                <p className="text-sm font-body text-card-foreground/90">{sign.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator className="my-12" />

      <SectionTitle
        title={dictionary['MayanHoroscopePage.galacticTonesTitle']}
        icon={GalacticTonesIcon}
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {GALACTIC_TONES.map((tone) => {
          const translatedToneName = dictionary[`GalacticTone.${tone.nameKey}.name`] || tone.nameKey;
          const translatedKeyword = dictionary[`GalacticTone.${tone.nameKey}.keyword`] || tone.keywordKey;
          const translatedQuestion = dictionary[`GalacticTone.${tone.nameKey}.question`] || tone.questionKey;
          const toneLabel = `${dictionary['MayanHoroscopePage.tone'] || 'Tone'} ${tone.id}:`;

          return (
            <Card key={tone.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="text-center">
                <CardTitle className="font-headline text-xl text-primary">
                  {toneLabel} <span className="font-bold">{translatedToneName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">{dictionary['MayanHoroscopePage.keyword']}</p>
                  <p className="text-md font-body text-card-foreground/90">{translatedKeyword}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm text-muted-foreground">{dictionary['MayanHoroscopePage.question']}</p>
                  <p className="text-sm font-body text-card-foreground/90 italic">{translatedQuestion}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12 p-6 bg-secondary/30 rounded-lg shadow">
        <p className="text-lg text-muted-foreground font-body">
          {dictionary['MayanHoroscopePage.comingSoon']}
        </p>
      </div>
    </main>
  );
}

