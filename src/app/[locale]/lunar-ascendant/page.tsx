
"use client"; // This page uses client-side hooks

import { useState, useEffect, use, useMemo } from 'react';
import type { LunarData, AscendantData } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries'; // For client-side dictionary
import { getCurrentLunarData, getAscendantSign } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/shared/SectionTitle';
import { Moon, Sunrise, Calendar as CalendarIconLucide, Clock, Wand2 } from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es, enUS, de, fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";

interface LunarAscendantPageProps {
  params: { // params is a promise in client components
    locale: Locale;
  };
}

const dateFnsLocalesMap: Record<Locale, typeof enUS> = {
  es,
  en: enUS,
  de,
  fr,
};

function LunarAscendantContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const [lunarData, setLunarData] = useState<LunarData | null>(null);
  const [ascendantData, setAscendantData] = useState<AscendantData | null>(null);
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [birthTime, setBirthTime] = useState<string>("12:00");
  const [birthCity, setBirthCity] = useState<string>("");
  const [isLoadingLunar, setIsLoadingLunar] = useState(true);
  const [isLoadingAscendant, setIsLoadingAscendant] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [currentYearForCalendar, setCurrentYearForCalendar] = useState<number | undefined>(undefined);

  const currentDfnLocale = dateFnsLocalesMap[locale] || enUS;

  useEffect(() => {
    setHasMounted(true);
    const now = new Date();
    setBirthDate(now); 
    setCurrentYearForCalendar(now.getFullYear());
  }, []); 

  useEffect(() => {
    if (!hasMounted) return;
    setIsLoadingLunar(true);
    const lunarTimer = setTimeout(() => {
      setLunarData(getCurrentLunarData(locale)); 
      setIsLoadingLunar(false);
    }, 400);
    return () => clearTimeout(lunarTimer);
  }, [locale, hasMounted]); 

  const handleCalculateAscendant = () => {
    if (!birthDate || !birthTime || !birthCity) {
      alert(dictionary['LunarAscendantSection.fillAllDetails'] || "Please fill in all birth details.");
      return;
    }
    setIsLoadingAscendant(true);
    const ascendantTimer = setTimeout(() => {
      setAscendantData(getAscendantSign(birthDate, birthTime, birthCity));
      setIsLoadingAscendant(false);
    }, 700);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['LunarAscendantPage.title'] || "Lunar Phase & Ascendant Sign"}
        subtitle={dictionary['LunarAscendantPage.subtitle'] || "Explore current moon phases and discover your ascendant sign."}
        icon={Wand2}
        className="mb-12"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
              <Moon className="w-7 h-7 text-primary" /> {dictionary['LunarAscendantSection.currentLunarPhaseTitle'] || "Current Lunar Phase"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-md shadow min-h-[150px] flex flex-col justify-center">
              {isLoadingLunar && hasMounted ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-3 font-body text-muted-foreground">{dictionary['LunarAscendantSection.loadingLunar'] || "Tracking the moon..."}</p>
                </div>
              ) : lunarData && hasMounted ? (
                <div className="text-center space-y-2">
                  <p className="text-xl font-body"><strong className="font-semibold">{lunarData.phase}</strong> ({lunarData.illumination}%)</p>
                  <p className="text-sm font-body text-muted-foreground">{(dictionary['LunarAscendantSection.nextFullMoon'] || "Next Full Moon: {date}").replace('{date}', lunarData.nextFullMoon)}</p>
                  <p className="text-sm font-body text-muted-foreground">{(dictionary['LunarAscendantSection.nextNewMoon'] || "Next New Moon: {date}").replace('{date}', lunarData.nextNewMoon)}</p>
                  <p className="text-xs font-body text-muted-foreground/80 mt-2 px-2">
                    {dictionary['LunarAscendantSection.lunarPhaseGlobalNote'] || "Lunar phase is global. Exact new/full moon times may vary by your time zone. Info based on your device's current time."}
                  </p>
                </div>
              ) : hasMounted ? (
                <p className="text-center font-body text-destructive">{dictionary['LunarAscendantSection.errorLunar'] || "Could not load lunar data."}</p>
              ) : (
                 <div className="text-center py-4 h-[108px]"></div> // Placeholder for height consistency
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full shadow-xl">
           <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                <Sunrise className="w-7 h-7 text-primary" /> {dictionary['LunarAscendantSection.calculateAscendantTitle'] || "Calculate Your Ascendant Sign"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-secondary/30 rounded-md shadow">
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <Label htmlFor="birth-date-lunar" className="font-body">{dictionary['LunarAscendantSection.birthDateLabel'] || "Birth Date"}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="birth-date-lunar"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal font-body",
                          !birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIconLucide className="mr-2 h-4 w-4" />
                        {birthDate && hasMounted ? format(birthDate, "PPP", { locale: currentDfnLocale }) : <span>{dictionary['LunarAscendantSection.pickDate'] || "Pick a date"}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={birthDate}
                          onSelect={setBirthDate}
                          disabled={
                            hasMounted
                              ? (date: Date) => date > new Date() || date < new Date("1900-01-01")
                              : (date: Date) => date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={currentDfnLocale} 
                          captionLayout="dropdown-buttons"
                          fromYear={1900}
                          toYear={hasMounted ? currentYearForCalendar : undefined}
                        />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="birth-time-lunar" className="font-body">{dictionary['LunarAscendantSection.birthTimeLabel'] || "Birth Time (approx.)"}</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground" />
                    <Input id="birth-time-lunar" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="font-body" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="birth-city-lunar" className="font-body">{dictionary['LunarAscendantSection.birthCityLabel'] || "Birth City"}</Label>
                  <Input id="birth-city-lunar" type="text" placeholder={dictionary['LunarAscendantSection.birthCityPlaceholder'] || "e.g., New York"} value={birthCity} onChange={(e) => setBirthCity(e.target.value)} className="font-body" />
                </div>
                <Button onClick={handleCalculateAscendant} disabled={isLoadingAscendant || !birthDate || !birthTime || !birthCity} className="w-full font-body">
                  {isLoadingAscendant ? (
                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div> {dictionary['LunarAscendantSection.calculatingButton'] || "Calculating..."}</>
                  ) : (dictionary['LunarAscendantSection.calculateButton'] || "Calculate Ascendant")}
                </Button>
              </div>

              {ascendantData && !isLoadingAscendant && hasMounted && (
                <div className="mt-6 text-center p-4 bg-card rounded-md shadow-sm">
                  <h4 className="text-xl font-headline font-semibold text-accent-foreground">{dictionary['LunarAscendantSection.ascendantSignTitle'] || "Your Ascendant Sign:"}</h4>
                  <div className="flex items-center justify-center my-2">
                    <ZodiacSignIcon signName={ascendantData.sign} className="w-10 h-10 text-primary mr-2" />
                    <p className="text-2xl font-bold text-primary font-body">{dictionary[ascendantData.sign] || ascendantData.sign}</p>
                  </div>
                  <p className="font-body text-card-foreground leading-relaxed">{ascendantData.briefExplanation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function LunarAscendantPage({ params: paramsPromise }: LunarAscendantPageProps) {
  const params = use(paramsPromise);
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }
  
  return <LunarAscendantContent dictionary={dictionary} locale={params.locale} />;
}

