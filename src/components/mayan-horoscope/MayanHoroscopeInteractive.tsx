

"use client";

import { useState, useEffect } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import type { MayanKinInfo } from '@/types';
import {
  KinCalculatorIcon,
  calculateMayanKin
} from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SectionTitle from '@/components/shared/SectionTitle';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIconLucide, HelpCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es, enUS, de, fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import LoadingSpinner from '@/components/shared/LoadingSpinner';

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
  const [showCalculationExplanation, setShowCalculationExplanation] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [currentYearForCalendar, setCurrentYearForCalendar] = useState<number | undefined>(undefined);
  
  const currentDfnlocale = dateLocales[locale] || enUS;

  useEffect(() => {
    setHasMounted(true);
    const now = new Date();
    setSelectedBirthDate(new Date(1990, 0, 1)); 
    setCurrentYearForCalendar(now.getFullYear());
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
  
  return (
    <>
      <Card className="mb-12 shadow-lg max-w-2xl mx-auto">
        <CardHeader>
          <SectionTitle
            title={dictionary['MayanHoroscopePage.kinCalculatorTitle']}
            icon={KinCalculatorIcon}
            className="mb-2" // Adjusted margin
          />
          <CardDescription className="text-center font-body text-muted-foreground mb-4">
            {dictionary['MayanHoroscopePage.kinCalculatorDescription'] || "El Kin Maya es tu firma galáctica personal basada en el calendario Tzolkin."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="w-full sm:w-auto flex-grow">
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
                    {selectedBirthDate && hasMounted ? format(selectedBirthDate, "PPP", { locale: currentDfnlocale }) : <span>{dictionary['MayanHoroscopePage.pickDate']}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedBirthDate}
                      onSelect={setSelectedBirthDate}
                      disabled={
                        hasMounted
                          ? (date: Date) => date > new Date() || date < new Date("1900-01-01")
                          : (date: Date) => date < new Date("1900-01-01") 
                      }
                      initialFocus
                      captionLayout="dropdown-buttons"
                      fromYear={1900}
                      toYear={hasMounted ? currentYearForCalendar : undefined}
                    />
                </PopoverContent>
              </Popover>
            </div>
            <Button onClick={handleCalculateKin} disabled={isLoadingKin || !selectedBirthDate} className="w-full sm:w-auto">
              {isLoadingKin ? (dictionary['MayanHoroscopePage.calculatingKin'] || "Calculating...") : (dictionary['MayanHoroscopePage.calculateKinButton'])}
            </Button>
          </div>

          {isLoadingKin && (
            <div className="text-center p-4">
              <LoadingSpinner className="h-10 w-10 text-primary" />
            </div>
          )}
          {errorKin && <p className="text-destructive text-center">{errorKin}</p>}
          
          {mayanKin && !isLoadingKin && hasMounted && (
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
                    <span className="font-bold text-xl">{dictionary[mayanKin.daySign.nameKey] || mayanKin.daySign.name}</span>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground">{dictionary[mayanKin.daySign.descriptionKey]}</p>
                </div>
                
                <div className="mt-4">
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
                </div>

                <div className="mt-4 text-center">
                  <Button variant="link" onClick={() => setShowCalculationExplanation(!showCalculationExplanation)} className="text-sm text-primary hover:underline">
                    <HelpCircle size={16} className="mr-1" />
                    {showCalculationExplanation 
                      ? (dictionary['MayanHoroscopePage.hideCalculationExplanation'] || "Hide explanation") 
                      : (dictionary['MayanHoroscopePage.showCalculationExplanation'] || "See how your Kin is calculated")}
                  </Button>
                </div>
                {showCalculationExplanation && (
                  <Card className="mt-4 p-4 bg-card text-card-foreground">
                    <CardTitle className="text-md font-semibold mb-2">{dictionary['MayanHoroscopePage.calculationExplanationTitle']}</CardTitle>
                    <ol className="list-decimal list-inside space-y-2 text-xs">
                      <li>{dictionary['MayanHoroscopePage.calcExplainStep1']}</li>
                      <li>{dictionary['MayanHoroscopePage.calcExplainStep2']}</li>
                      <li>{dictionary['MayanHoroscopePage.calcExplainStep3']}</li>
                      <li>{dictionary['MayanHoroscopePage.calcExplainStep4']}</li>
                      <li>{dictionary['MayanHoroscopePage.calcExplainStep5']}</li>
                    </ol>
                    <p className="text-xs mt-3 italic">{dictionary['MayanHoroscopePage.calcExplainNote']}</p>
                  </Card>
                )}
              </CardContent>
            </Card>
          )}
          {!mayanKin && !isLoadingKin && !errorKin && hasMounted && (
             <p className="text-center text-muted-foreground">{dictionary['MayanHoroscopePage.selectDatePrompt']}</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
