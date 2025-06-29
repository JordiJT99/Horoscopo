

"use client";

import { useState, useEffect, useMemo } from 'react';
import type { LunarData, AscendantData } from '@/types';
import type { Dictionary, Locale, MoonPhaseKey, UpcomingPhase } from '@/types';
import { getCurrentLunarData, getAscendantSign, ZODIAC_SIGNS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionTitle from '@/components/shared/SectionTitle';
import { Moon as MoonIconLucide, Sunrise, Calendar as CalendarIconLucide, Clock, Wand2, Share2 } from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es, enUS, de, fr } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import MoonPhaseVisualizer from './MoonPhaseVisualizer'; // Import the new component

interface LunarAscendantClientContentProps {
  dictionary: Dictionary;
  locale: Locale;
}

const dateFnsLocalesMap: Record<Locale, typeof es | typeof enUS | typeof de | typeof fr> = {
  es,
  en: enUS,
  de,
  fr,
};

const getPhaseColorClass = (phaseKey: MoonPhaseKey): string => {
  switch (phaseKey) {
    case 'new':
      return 'border-gray-500/50';
    case 'waxingCrescent':
    case 'firstQuarter':
    case 'waxingGibbous':
      return 'border-green-500/50';
    case 'full':
      return 'border-blue-400/60';
    case 'waningGibbous':
    case 'lastQuarter':
    case 'waningCrescent':
      return 'border-purple-500/50';
    default:
      return 'border-transparent';
  }
};

export default function LunarAscendantClientContent({ dictionary, locale }: LunarAscendantClientContentProps) {
  const [lunarData, setLunarData] = useState<LunarData | null>(null);
  const [ascendantData, setAscendantData] = useState<AscendantData | null>(null);
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(1990,0,1));
  const [birthTime, setBirthTime] = useState<string>("12:00");
  const [birthCity, setBirthCity] = useState<string>("");
  const [birthCountry, setBirthCountry] = useState<string>("");
  const [isLoadingAscendant, setIsLoadingAscendant] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { toast } = useToast();
  const currentYearForCalendar = useMemo(() => new Date().getFullYear(), []);

  const currentDfnLocale = dateFnsLocalesMap[locale] || enUS;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !dictionary || Object.keys(dictionary).length === 0) return;
    
    const fetchAndSetLunarData = async () => {
      const data = await getCurrentLunarData(dictionary, locale);
      setLunarData(data);
    };
    
    fetchAndSetLunarData();
    
  }, [locale, hasMounted, dictionary]);

  const handleShare = async () => {
    if (!lunarData) return;

    const shareTitle = dictionary['Share.lunarPhaseTitle'] || "Current Moon Phase from AstroVibes";
    const shareText = (dictionary['Share.lunarPhaseText'] || "Right now, the moon is a {phaseName} in {signName} ({illumination}% illuminated). Check it out on AstroVibes!")
        .replace('{phaseName}', lunarData.phase)
        .replace('{signName}', lunarData.moonInSign || 'the cosmos')
        .replace('{illumination}', lunarData.illumination.toString());
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
          title: dictionary['Share.copiedTitle'] || "Copied!",
          description: dictionary['Share.copiedLinkMessage'] || "The lunar phase info has been copied to your clipboard.",
        });
      } catch (copyError) {
        toast({
          title: dictionary['Share.errorTitle'] || "Sharing Error",
          description: dictionary['Share.errorMessageClipboard'] || "Could not copy. Please try sharing manually.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleCalculateAscendant = () => {
    if (!birthDate || !birthTime || !birthCity) {
      toast({title: "Error", description: dictionary['LunarAscendantSection.fillAllDetails'] || "Please fill in all birth details.", variant: 'destructive'});
      return;
    }
    setIsLoadingAscendant(true);
    const ascendantTimer = setTimeout(() => {
      setAscendantData(getAscendantSign(birthDate, birthTime, birthCity));
      setIsLoadingAscendant(false);
    }, 700);
    return () => clearTimeout(ascendantTimer);
  };

  if (!hasMounted || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="mt-4">Loading content...</p>
      </div>
    );
  }

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
            {lunarData ? (
                lunarData.error ? (
                  <p className="text-center font-body text-destructive py-10">
                    {dictionary['LunarAscendantSection.errorLunar'] || "Could not load lunar data."}
                    {lunarData.error && `: ${lunarData.error}`}
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 p-3 bg-secondary/30 rounded-lg">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={lunarData.phaseKey}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.5 }}
                        >
                          <MoonPhaseVisualizer
                            illumination={lunarData.illumination}
                            phaseKey={lunarData.phaseKey}
                            size={72}
                          />
                        </motion.div>
                      </AnimatePresence>
                      <div className="flex-1">
                        <p className="text-lg sm:text-xl font-semibold text-foreground">{lunarData.phase}</p>
                        {lunarData.moonInSign && lunarData.moonSignIcon && (
                          <p className="text-sm text-muted-foreground flex items-center">
                            {(dictionary['LunarAscendantPage.moonInSignText'] || "in {signName}").replace('{signName}', lunarData.moonInSign)}
                            <ZodiacSignIcon signName={lunarData.moonSignIcon} className="w-4 h-4 ml-1.5 text-primary" />
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {typeof lunarData.illumination === 'number'
                            ? (dictionary['LunarAscendantPage.illuminationText'] || "Illumination: {percentage}%").replace('{percentage}', lunarData.illumination.toString())
                            : `${dictionary['LunarAscendantPage.illuminationText']?.split(':')[0] || "Illumination"}: ${dictionary['Data.notAvailable'] || 'N/A'}`}
                        </p>
                         {lunarData.synodicProgress !== undefined && (
                          <div className="mt-2">
                             <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Progress value={lunarData.synodicProgress} className="h-1.5" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{dictionary['LunarAscendantPage.synodicCycle'] || 'Synodic Cycle Progress'}: {Math.round(lunarData.synodicProgress)}%</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="font-headline text-lg text-primary text-center">{dictionary['LunarAscendantPage.upcomingPhasesTitle'] || "Upcoming Phases"}</h4>
                        <TooltipProvider>
                            <ScrollArea className="w-full whitespace-nowrap rounded-md border border-border/30 bg-background/30 p-2">
                                <div className="flex w-max space-x-4">
                                {lunarData.upcomingPhases.map((phase, index) => (
                                    <Tooltip key={index} delayDuration={100}>
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-col items-center p-1.5 rounded-md w-20 shrink-0 cursor-default">
                                                <div className={cn("p-1 rounded-full border-2", getPhaseColorClass(phase.phaseKey))}>
                                                <MoonPhaseVisualizer
                                                  illumination={phase.phaseKey === 'new' ? 0 : phase.phaseKey === 'full' ? 100 : 50}
                                                  phaseKey={phase.phaseKey}
                                                  size={40}
                                                />
                                                </div>
                                                <p className="text-xs font-semibold text-muted-foreground mt-1.5 truncate">{phase.date}</p>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-semibold">{dictionary[phase.nameKey] || phase.phaseKey}</p>
                                            <p className="text-sm text-muted-foreground">{phase.date} &bull; {phase.time}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </TooltipProvider>
                    </div>
                     <div className="pt-2 flex justify-center">
                        <Button onClick={handleShare} variant="outline" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            {dictionary['Share.buttonLabelLunar'] || "Share Current Phase"}
                        </Button>
                    </div>

                  </div>
                )
              ) : (
                <div className="text-center py-10 h-[200px]">
                    <LoadingSpinner className="h-10 w-10 text-primary" />
                    <p className="mt-3 font-body text-muted-foreground">{dictionary['LunarAscendantSection.loadingLunar'] || "Tracking the moon..."}</p>
                </div>
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
                  <Label htmlFor="birth-date-lunar-client" className="font-body">{dictionary['LunarAscendantSection.birthDateLabel'] || "Birth Date"}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="birth-date-lunar-client"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal font-body",
                          !birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIconLucide className="mr-2 h-4 w-4" />
                        {birthDate ? format(birthDate, "PPP", { locale: currentDfnLocale }) : <span>{dictionary['LunarAscendantSection.pickDate'] || "Pick a date"}</span>}
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
                          captionLayout="dropdown-buttons" 
                          fromYear={1900}
                          toYear={currentYearForCalendar}
                          classNames={{ caption_dropdowns: "flex gap-1 py-1", dropdown_month: "text-sm", dropdown_year: "text-sm" }}
                          className="rounded-md border shadow"
                        />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="birth-time-lunar-client" className="font-body">{dictionary['LunarAscendantSection.birthTimeLabel'] || "Birth Time (approx.)"}</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="text-muted-foreground" />
                    <Input id="birth-time-lunar-client" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="font-body" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="birth-city-lunar-client" className="font-body">{dictionary['LunarAscendantSection.birthCityLabel'] || "Birth City"}</Label>
                  <Input id="birth-city-lunar-client" type="text" placeholder={dictionary['LunarAscendantSection.birthCityPlaceholder'] || "e.g., New York"} value={birthCity} onChange={(e) => setBirthCity(e.target.value)} className="font-body" />
                </div>
                 <div>
                    <Label htmlFor="birth-country-lunar-client" className="font-body">{dictionary['birthForm.countryLabel'] || 'Birth Country'}</Label>
                    <Input
                      id="birth-country-lunar-client"
                      type="text"
                      placeholder={dictionary['OnboardingPage.cityOfBirthPlaceholder'] || 'e.g., United States'}
                      value={birthCountry}
                      onChange={(e) => setBirthCountry(e.target.value)}
                      className="font-body"
                    />
                  </div>
                <Button onClick={handleCalculateAscendant} disabled={isLoadingAscendant || !birthDate || !birthTime || !birthCity} className="w-full font-body">
                  {isLoadingAscendant ? (<><LoadingSpinner className="h-4 w-4 text-primary-foreground mr-2" /> {dictionary['LunarAscendantSection.calculatingButton'] || "Calculating..."}</>) : (dictionary['LunarAscendantSection.calculateButton'] || "Calculate Ascendant")}
                </Button>
              </div>

              {ascendantData && !isLoadingAscendant && (
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
