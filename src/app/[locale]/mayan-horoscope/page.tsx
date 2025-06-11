
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MAYAN_ZODIAC_SIGNS, MayanAstrologyIcon } from '@/lib/constants';

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

      <div className="text-center mt-12 p-6 bg-secondary/30 rounded-lg shadow">
        <p className="text-lg text-muted-foreground font-body">
          {dictionary['MayanHoroscopePage.comingSoon']}
        </p>
      </div>
    </main>
  );
}
