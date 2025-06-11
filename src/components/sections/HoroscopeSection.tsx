
"use client";

import { useState, useEffect } from 'react';
import type { ZodiacSignName, HoroscopeData } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { CalendarDays } from 'lucide-react';

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
            <TabsContent value="daily" className="p-4 bg-secondary/30 rounded-md shadow">
              <h3 className="text-xl font-headline font-semibold mb-2 text-primary">{dictionary['HoroscopeSection.dailyForecastTitle'] || "Daily Forecast"}</h3>
              <p className="font-body text-card-foreground leading-relaxed">{horoscope.daily}</p>
            </TabsContent>
            <TabsContent value="weekly" className="p-4 bg-secondary/30 rounded-md shadow">
              <h3 className="text-xl font-headline font-semibold mb-2 text-primary">{dictionary['HoroscopeSection.weeklyOutlookTitle'] || "Weekly Outlook"}</h3>
              <p className="font-body text-card-foreground leading-relaxed">{horoscope.weekly}</p>
            </TabsContent>
            <TabsContent value="monthly" className="p-4 bg-secondary/30 rounded-md shadow">
              <h3 className="text-xl font-headline font-semibold mb-2 text-primary">{dictionary['HoroscopeSection.monthlyOverviewTitle'] || "Monthly Overview"}</h3>
              <p className="font-body text-card-foreground leading-relaxed">{horoscope.monthly}</p>
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
