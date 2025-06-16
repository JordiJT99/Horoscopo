

"use client";

import { useState, useEffect, use, useMemo } from 'react';
import type { LunarData, AscendantData } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { getCurrentLunarData, getAscendantSign, ZODIAC_SIGNS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/shared/SectionTitle';
import { Moon as MoonIconLucide, Sunrise, Calendar as CalendarIconLucide, Clock, Wand2 } from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es, enUS, de, fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface LunarAscendantPageProps {
  params: {
    locale: Locale;
  };
}

const dateFnsLocalesMap: Record<Locale, typeof es | typeof enUS | typeof de | typeof fr> = {
  es,
  en: enUS,
  de,
  fr,
};

function LunarAscendantContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const [lunarData, setLunarData] = useState<LunarData | null>(null);
  const [ascendantData, setAscendantData] = useState<AscendantData | null>(null);
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(1990,0,1));
  const [birthTime, setBirthTime] = useState<string>("12:00");
  const [birthCity, setBirthCity] = useState<string>("");
  const [isLoadingLunar, setIsLoadingLunar] = useState(true);
  const [isLoadingAscendant, setIsLoadingAscendant] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const currentYearForCalendar = useMemo(() => new Date().getFullYear(), []);

  const currentDfnLocale = dateFnsLocalesMap[locale] || enUS;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !dictionary) return;
    
    const fetchLunar = async () => {
      setIsLoadingLunar(true);
      try {
        // Pass dictionary and locale to getCurrentLunarData for translations
        const data = await getCurrentLunarData(dictionary, locale);
        setLunarData(data);
      } catch (error) {
        console.error("Failed to fetch lunar data in component:", error);
        setLunarData({
            phase: dictionary['MoonPhase.Unknown'] || "Unknown Phase",
            phaseKey: 'unknown',
            illumination: 0,
            currentMoonImage: "https://placehold.co/80x80/CBD5E0/1E293B.png?text=?",
            upcomingPhases: [],
            error: dictionary['LunarAscendantSection.errorLunar'] || "Could not load lunar data."
        });
      } finally {
        setIsLoadingLunar(false);
      }
    };
    
    fetchLunar();
  }, [locale, hasMounted, dictionary]);

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
        <Card className="w-full shadow-xl bg-card/70 backdrop-blur-sm border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2 text-primary">
              <MoonIconLucide className="w-7 h-7" /> {dictionary['LunarAscendantPage.lunarCalendarTitle'] || "Lunar Calendar"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-3 py-4 sm:px-4">
            {isLoadingLunar && hasMounted ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                <p className="mt-3 font-body text-muted-foreground">{dictionary['LunarAscendantSection.loadingLunar'] || "Tracking the moon..."}</p>
              </div>
            ) : lunarData && hasMounted ? (
              lunarData.error ? (
                <p className="text-center font-body text-destructive py-10">{lunarData.error}</p>
              ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 sm:gap-4 p-3 bg-secondary/30 rounded-lg">
                  <Image
                    src={lunarData.currentMoonImage}
                    alt={dictionary['LunarAscendantPage.currentMoonAlt'] || `Current moon phase: ${lunarData.phase}`}
                    width={72}
                    height={72}
                    className="rounded-full bg-slate-700 object-cover"
                    data-ai-hint="moon phase realistic"
                  />
                  <div className="flex-1">
                    <p className="text-lg sm:text-xl font-semibold text-foreground">{lunarData.phase}</p>
                    {lunarData.moonInSign && lunarData.moonSignIcon && (
                      <p className="text-sm text-muted-foreground flex items-center">
                        {(dictionary['LunarAscendantPage.moonInSignText'] || "in {signName}").replace('{signName}', lunarData.moonInSign)}
                        <ZodiacSignIcon signName={lunarData.moonSignIcon} className="w-4 h-4 ml-1.5 text-primary" />
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {(dictionary['LunarAscendantPage.illuminationText'] || "Illumination: {percentage}%").replace('{percentage}', lunarData.illumination.toString())}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  {lunarData.upcomingPhases.map((phase, index) => (
                    <div key={index} className="flex flex-col items-center p-1.5 bg-secondary/20 rounded-md">
                      <Image
                        src={phase.iconUrl}
                        alt={dictionary[phase.nameKey] || phase.nameKey.split('.').pop() || phase.phaseKey}
                        width={36}
                        height={36}
                        className="rounded-full bg-slate-600 object-cover mb-1"
                        data-ai-hint="moon phase icon"
                      />
                      <p className="text-xs text-muted-foreground">{phase.date}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground/80 text-center pt-2">
                  {dictionary['LunarAscendantPage.easternTimeNote'] || "Nota: Todos los horarios ET"}
                </p>
              </div>
              )
            ) : hasMounted ? (
              <p className="text-center font-body text-destructive py-10">{dictionary['LunarAscendantSection.errorLunar'] || "Could not load lunar data."}</p>
            ) : (
              <div className="text-center py-10 h-[200px]"></div> 
            )}
          </CardContent>
        </Card>

        <Card className="w-full shadow-xl bg-card/70 backdrop-blur-sm border border-white/10">
           <CardHeader className="text-center">
            <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2 text-primary">
                <Sunrise className="w-7 h-7" /> {dictionary['LunarAscendantSection.calculateAscendantTitle'] || "Calculate Your Ascendant Sign"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-3 py-4 sm:px-4">
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
                          defaultMonth={birthDate || new Date(currentYearForCalendar - 30, 0, 1)}
                          locale={currentDfnLocale}
                          fromDate={new Date(1900, 0, 1)}
                          toDate={new Date()}
                          captionLayout="dropdown" 
                          fromYear={1900}
                          toYear={currentYearForCalendar}
                          classNames={{ caption_dropdowns: "flex gap-1 py-1", dropdown_month: "text-sm", dropdown_year: "text-sm" }}
                          className="rounded-md border shadow"
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

  // To prevent hydration mismatch for client-side only logic like `hasMounted`
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);


  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return <LunarAscendantContent dictionary={dictionary} locale={params.locale} />;
}

