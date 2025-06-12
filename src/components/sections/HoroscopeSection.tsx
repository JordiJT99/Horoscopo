
"use client";

import { useState, useEffect } from 'react';
import type { ZodiacSignName } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Heart, CircleDollarSign, Activity } from 'lucide-react';

interface HoroscopeSectionProps {
  dictionary: Dictionary;
  locale: Locale;
}

const HoroscopeSection = ({ dictionary, locale }: HoroscopeSectionProps) => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSignName>(ZODIAC_SIGNS[0].name);
  const [horoscope, setHoroscope] = useState<HoroscopeFlowOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!selectedSign || !locale) return;

      setIsLoading(true);
      setError(null);
      setHoroscope(null); 

      try {
        const input: HoroscopeFlowInput = {
          sign: selectedSign,
          locale: locale,
        };
        const result = await getHoroscopeFlow(input);
        setHoroscope(result);
      } catch (err) {
        console.error("Error fetching horoscope from Genkit flow:", err);
        setError(dictionary['HoroscopeSection.error'] || "Could not load horoscope data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHoroscope();
  }, [selectedSign, locale, dictionary]);

  const handleSignChange = (value: string) => {
    setSelectedSign(value as ZodiacSignName);
  };
  
  const translatedSignName = dictionary[selectedSign] || selectedSign;

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <ZodiacSignIcon signName={selectedSign} className="w-12 h-12 text-primary mr-2" />
          <CardTitle className="font-headline text-3xl">
            {(dictionary['HoroscopeSection.title'] || '{signName} Horoscope').replace('{signName}', translatedSignName)}
          </CardTitle>
        </div>
        <CardDescription className="font-body">
          {dictionary['HoroscopeSection.description'] || "Select your sign to view your astrological forecast."}
        </CardDescription>
        <div className="mt-4 max-w-xs mx-auto">
          <Select value={selectedSign} onValueChange={handleSignChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={dictionary['HoroscopeSection.selectSignPlaceholder'] || "Select Sign"} />
            </SelectTrigger>
            <SelectContent>
              {ZODIAC_SIGNS.map((sign) => (
                <SelectItem key={sign.name} value={sign.name}>
                  <div className="flex items-center">
                    <ZodiacSignIcon signName={sign.name} className="w-5 h-5 mr-2" />
                    {dictionary[sign.name] || sign.name} ({sign.dateRange})
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 font-body text-muted-foreground">{dictionary['HoroscopeSection.loading'] || "Loading your cosmic insights..."}</p>
          </div>
        ) : error ? (
           <p className="text-center font-body text-destructive p-4">{error}</p>
        ) : horoscope ? (
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="daily" className="font-body flex items-center gap-2"><CalendarDays size={16}/>{dictionary['HoroscopeSection.dailyTab'] || "Daily"}</TabsTrigger>
              <TabsTrigger value="weekly" className="font-body flex items-center gap-2"><CalendarDays size={16}/>{dictionary['HoroscopeSection.weeklyTab'] || "Weekly"}</TabsTrigger>
              <TabsTrigger value="monthly" className="font-body flex items-center gap-2"><CalendarDays size={16}/>{dictionary['HoroscopeSection.monthlyTab'] || "Monthly"}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4 p-4 bg-secondary/30 rounded-md shadow">
              <div>
                <h3 className="text-xl font-headline font-semibold mb-2 text-primary">{dictionary['HoroscopeSection.dailyForecastTitle'] || "Daily Forecast"}</h3>
                <p className="font-body text-card-foreground leading-relaxed">{horoscope.daily.main}</p>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                    <Heart size={20} className="text-red-500" /> {dictionary['HoroscopeSection.loveTitle'] || "Love"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-sm">{horoscope.daily.love}</p>
                </div>
                <div>
                  <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                    <CircleDollarSign size={20} className="text-green-500" /> {dictionary['HoroscopeSection.moneyTitle'] || "Money"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-sm">{horoscope.daily.money}</p>
                </div>
                <div>
                  <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                    <Activity size={20} className="text-blue-500" /> {dictionary['HoroscopeSection.healthTitle'] || "Health"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-sm">{horoscope.daily.health}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4 p-4 bg-secondary/30 rounded-md shadow">
              <div>
                <h3 className="text-xl font-headline font-semibold mb-2 text-primary">{dictionary['HoroscopeSection.weeklyOutlookTitle'] || "Weekly Outlook"}</h3>
                <p className="font-body text-card-foreground leading-relaxed">{horoscope.weekly.main}</p>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                    <Heart size={20} className="text-red-500" /> {dictionary['HoroscopeSection.loveTitle'] || "Love"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-sm">{horoscope.weekly.love}</p>
                </div>
                <div>
                  <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                    <CircleDollarSign size={20} className="text-green-500" /> {dictionary['HoroscopeSection.moneyTitle'] || "Money"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-sm">{horoscope.weekly.money}</p>
                </div>
                <div>
                  <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                    <Activity size={20} className="text-blue-500" /> {dictionary['HoroscopeSection.healthTitle'] || "Health"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-sm">{horoscope.weekly.health}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4 p-4 bg-secondary/30 rounded-md shadow">
              <div>
                <h3 className="text-xl font-headline font-semibold mb-2 text-primary">{dictionary['HoroscopeSection.monthlyOverviewTitle'] || "Monthly Overview"}</h3>
                <p className="font-body text-card-foreground leading-relaxed">{horoscope.monthly.main}</p>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                    <Heart size={20} className="text-red-500" /> {dictionary['HoroscopeSection.loveTitle'] || "Love"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-sm">{horoscope.monthly.love}</p>
                </div>
                <div>
                  <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                    <CircleDollarSign size={20} className="text-green-500" /> {dictionary['HoroscopeSection.moneyTitle'] || "Money"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-sm">{horoscope.monthly.money}</p>
                </div>
                <div>
                  <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                    <Activity size={20} className="text-blue-500" /> {dictionary['HoroscopeSection.healthTitle'] || "Health"}
                  </h4>
                  <p className="font-body text-card-foreground leading-relaxed text-sm">{horoscope.monthly.health}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-center font-body text-muted-foreground p-4">{dictionary['HoroscopeSection.noData'] || "No horoscope data available. Please select a sign."}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default HoroscopeSection;
