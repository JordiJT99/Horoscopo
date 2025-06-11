
"use client";

import { useState, useEffect } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import type { MayanKinInfo, MayanZodiacSign, GalacticTone } from '@/types';
import {
  MAYAN_ZODIAC_SIGNS,
  GALACTIC_TONES,
  GalacticTonesIcon,
  KinCalculatorIcon,
  MayanAstrologyIcon, // Asegúrate que este ícono está correctamente definido y exportado en constants.ts
  calculateMayanKin
} from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import SectionTitle from '@/components/shared/SectionTitle';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIconLucide } from "lucide-react"; // Renombrado para evitar conflicto con el componente Calendar
import { Calendar } from "@/components/ui/calendar"; // Componente Calendar de ShadCN
import { format } from "date-fns";
import { es, enUS, de, fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";

interface MayanHoroscopeInteractiveProps {
  dictionary: Dictionary;
  locale: Locale;
}

const dateLocales: Record<Locale, typeof enUS> = {
  es,
  en: enUS,
  de,
  fr,
};

// Cambiado a una declaración de función estándar
function CustomLabel({ htmlFor, children, className }: { htmlFor: string, children: React.ReactNode, className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("block text-sm font-medium text-foreground mb-1", className)}>
      {children}
    </label>
  );
}

export default function MayanHoroscopeInteractive({ dictionary, locale }: MayanHoroscopeInteractiveProps) {
  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | undefined>(undefined);
  const [mayanKin, setMayanKin] = useState<MayanKinInfo | null>(null);
  const [isLoadingKin, setIsLoadingKin] = useState(false);
  const [errorKin, setErrorKin] = useState<string | null>(null);

  useEffect(() => {
    setSelectedBirthDate(new Date());
  }, []);

  const handleCalculateKin = () => {
    if (!selectedBirthDate) {
      setErrorKin(dictionary['MayanHoroscopePage.selectDatePrompt'] || "Please select a birth date.");
      return;
    }
    setIsLoadingKin(true);
    setErrorKin(null);
    setMayanKin(null);

    setTimeout(() => {
      const result = calculateMayanKin(selectedBirthDate);
      if (result) {
        setMayanKin(result);
      } else {
        setErrorKin(dictionary['MayanHoroscopePage.errorCalculatingKin'] || "Error calculating Kin.");
      }
      setIsLoadingKin(false);
    }, 500);
  };
  
  const currentDfnlocale = dateLocales[locale] || enUS;

  return (
    <>
      <Card className="mb-12 shadow-lg">
        <CardHeader>
          <SectionTitle
            title={dictionary['MayanHoroscopePage.kinCalculatorTitle']}
            icon={KinCalculatorIcon}
            className="mb-0"
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-auto">
              <CustomLabel htmlFor="birth-date-mayan">
                {dictionary['MayanHoroscopePage.birthDateLabel']}
              </CustomLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="birth-date-mayan"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedBirthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIconLucide className="mr-2 h-4 w-4" />
                    {selectedBirthDate ? format(selectedBirthDate, "PPP", { locale: currentDfnlocale }) : <span>{dictionary['MayanHoroscopePage.pickDate']}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedBirthDate}
                    onSelect={setSelectedBirthDate}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleCalculateKin} disabled={isLoadingKin || !selectedBirthDate} className="w-full sm:w-auto mt-4 sm:mt-0 self-end">
              {isLoadingKin ? (dictionary['MayanHoroscopePage.calculatingKin'] || "Calculating...") : (dictionary['MayanHoroscopePage.calculateKinButton'])}
            </Button>
          </div>

          {isLoadingKin && (
            <div className="text-center p-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
          {errorKin && <p className="text-destructive text-center">{errorKin}</p>}
          
          {mayanKin && !isLoadingKin && (
            <Card className="bg-secondary/30 p-6 rounded-lg shadow">
              <CardHeader className="p-0 pb-4 text-center">
                <CardTitle className="font-headline text-2xl text-primary">{dictionary['MayanHoroscopePage.yourMayanKinTitle']}</CardTitle>
                 <CardDescription>{dictionary['MayanHoroscopePage.kinNumber']} {mayanKin.kinNumber}</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div>
                  <h4 className="font-semibold text-lg text-accent-foreground mb-1">{dictionary['MayanHoroscopePage.yourDaySign']}</h4>
                  <div className="flex items-center gap-2">
                     <mayanKin.daySign.icon className="w-8 h-8 text-primary" />
                    <span className="font-bold text-xl">{dictionary[mayanKin.daySign.name] || mayanKin.daySign.name}</span>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">{mayanKin.daySign.description}</p>
                  <p className="text-sm mt-2">{mayanKin.daySign.detailedInterpretation}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-lg text-accent-foreground mb-1">{dictionary['MayanHoroscopePage.yourGalacticTone']}</h4>
                   <div className="flex items-center gap-2">
                    <span className="font-bold text-xl">
                        {dictionary['MayanHoroscopePage.tone'] || "Tone"} {mayanKin.tone.id}: {dictionary[`GalacticTone.${mayanKin.tone.nameKey}.name`] || mayanKin.tone.nameKey}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">
                    <strong>{dictionary['MayanHoroscopePage.keyword']}</strong> {dictionary[`GalacticTone.${mayanKin.tone.nameKey}.keyword`] || mayanKin.tone.keywordKey}
                  </p>
                  <p className="text-sm italic mt-1 text-muted-foreground">
                    <strong>{dictionary['MayanHoroscopePage.question']}</strong> {dictionary[`GalacticTone.${mayanKin.tone.nameKey}.question`] || mayanKin.tone.questionKey}
                  </p>
                  <p className="text-sm mt-2">{mayanKin.tone.detailedInterpretation}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {!mayanKin && !isLoadingKin && !errorKin && (
             <p className="text-center text-muted-foreground">{dictionary['MayanHoroscopePage.selectDatePrompt']}</p>
          )}
        </CardContent>
      </Card>

      <Separator className="my-12" />

      <SectionTitle
        title={dictionary['MayanHoroscopePage.signsTitle'] || "The 20 Solar Seals (Nahuales)"}
        icon={MayanAstrologyIcon}
        className="mb-8"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {MAYAN_ZODIAC_SIGNS.map((sign) => {
          const SignIcon = sign.icon;
          const translatedSignName = dictionary[sign.name] || sign.name;
          return (
            <Card key={sign.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="items-center text-center">
                <SignIcon className="w-12 h-12 text-primary mb-2" />
                <CardTitle className="font-headline text-xl text-primary">{translatedSignName}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-2">
                <div>
                    <p className="font-semibold text-sm text-muted-foreground">{dictionary['MayanHoroscopePage.description']}</p>
                    <p className="text-sm font-body text-card-foreground/90">{sign.description}</p>
                </div>
                 <div>
                    <p className="font-semibold text-sm text-muted-foreground">{dictionary['MayanHoroscopePage.detailedInterpretation']}</p>
                    <p className="text-xs font-body text-card-foreground/80 leading-relaxed">{sign.detailedInterpretation}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Separator className="my-12" />

      <SectionTitle
        title={dictionary['MayanHoroscopePage.galacticTonesTitle']}
        icon={GalacticTonesIcon}
        className="mb-8"
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
                 <div>
                    <p className="font-semibold text-sm text-muted-foreground">{dictionary['MayanHoroscopePage.detailedInterpretation']}</p>
                    <p className="text-xs font-body text-card-foreground/80 leading-relaxed">{tone.detailedInterpretation}</p>
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
    </>
  );
}
