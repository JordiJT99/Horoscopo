
'use client';

import { useMemo } from 'react';
import type { Dictionary, Locale, OnboardingFormData, ZodiacSign } from '@/types';
import { getSunSignFromDate, getMoonSign, getAscendantSign, ZODIAC_SIGNS } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Sun, Moon, ArrowUpRight, Edit3 } from 'lucide-react';

interface MySignsCardProps {
  dictionary: Dictionary;
  locale: Locale;
  onboardingData: OnboardingFormData | null;
}

const SignDisplayRow = ({ icon: Icon, label, sign, dictionary }: { icon: React.ElementType; label: string; sign: ZodiacSign | null; dictionary: Dictionary }) => (
  <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-b-0">
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-primary" />
      <span className="font-semibold text-foreground">{label}</span>
    </div>
    {sign ? (
      <div className="flex items-center gap-1.5 font-medium text-muted-foreground">
        <ZodiacSignIcon signName={sign.name} className="w-4 h-4" />
        <span>{dictionary[sign.name] || sign.name}</span>
      </div>
    ) : (
      <span className="text-xs text-muted-foreground/70">{dictionary['Data.notAvailable'] || "N/A"}</span>
    )}
  </div>
);


export default function MySignsCard({ dictionary, locale, onboardingData }: MySignsCardProps) {
  const userSigns = useMemo(() => {
    if (!onboardingData?.dateOfBirth) return { sun: null, moon: null, ascendant: null };

    const birthDate = new Date(onboardingData.dateOfBirth);
    const sun = getSunSignFromDate(birthDate);
    const moon = getMoonSign(birthDate); // simplified
    const ascendantSignObject = onboardingData.timeOfBirth ? getAscendantSign(birthDate, onboardingData.timeOfBirth, onboardingData.cityOfBirth || '') : null;
    const ascendant = ascendantSignObject ? ZODIAC_SIGNS.find(s => s.name === ascendantSignObject.sign) || null : null;


    return { sun, moon, ascendant };
  }, [onboardingData]);

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div>
          <CardTitle className="text-lg">{dictionary['ProfilePage.mySignsTitle'] || "My Signs"}</CardTitle>
          <CardDescription className="text-xs">{dictionary['ProfilePage.mySignsDescription'] || "Your core astrological placements."}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/onboarding?mode=edit`} aria-label={dictionary['ProfilePage.editBirthDataAriaLabel'] || 'Edit birth data'}>
            <Edit3 className="h-4 w-4" />
            <span className="sr-only">{dictionary['ProfilePage.editBirthDataAriaLabel'] || 'Edit birth data'}</span>
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-1">
          <SignDisplayRow icon={Sun} label={dictionary['ProfilePage.sunSignLabel'] || "Sun"} sign={userSigns.sun} dictionary={dictionary} />
          <SignDisplayRow icon={Moon} label={dictionary['ProfilePage.moonSignLabel'] || "Moon"} sign={userSigns.moon} dictionary={dictionary} />
          <SignDisplayRow icon={ArrowUpRight} label={dictionary['ProfilePage.ascendantSignLabel'] || "Ascendant"} sign={userSigns.ascendant} dictionary={dictionary} />
        </div>
      </CardContent>
    </Card>
  );
}
