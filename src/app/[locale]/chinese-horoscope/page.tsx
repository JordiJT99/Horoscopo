
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CHINESE_ZODIAC_SIGNS, ChineseAstrologyIcon } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';

interface ChineseHoroscopePageProps {
  params: {
    locale: Locale;
  };
}

export default async function ChineseHoroscopePage({ params }: ChineseHoroscopePageProps) {
  const dictionary = await getDictionary(params.locale);

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['ChineseHoroscopePage.title']}
        subtitle={dictionary['ChineseHoroscopePage.subtitle']}
        icon={ChineseAstrologyIcon}
        className="mb-12"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {CHINESE_ZODIAC_SIGNS.map((sign) => {
          const SignIcon = sign.icon;
          const translatedSignName = dictionary[sign.name] || sign.name;
          return (
            <Card key={sign.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="items-center text-center">
                <SignIcon className="w-16 h-16 text-primary mb-3" />
                <CardTitle className="font-headline text-2xl text-primary">{translatedSignName}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">{dictionary['ChineseHoroscopePage.years']}</p>
                    <p className="text-sm font-body">{sign.years.join(', ')}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">{dictionary['ChineseHoroscopePage.element']}</p>
                    <Badge variant="secondary">{dictionary[sign.element] || sign.element}</Badge>
                  </div>
                  {sign.description && (
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">{dictionary['ChineseHoroscopePage.description']}</p>
                      <p className="text-sm font-body text-card-foreground/90">{sign.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12 p-6 bg-secondary/30 rounded-lg shadow">
        <p className="text-lg text-muted-foreground font-body">
          {dictionary['ChineseHoroscopePage.comingSoon']}
        </p>
      </div>
    </main>
  );
}
