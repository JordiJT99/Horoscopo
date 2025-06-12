
"use client";

import { useState, useEffect } from 'react';
import type { ZodiacSignName } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { getHoroscopeFlow, type HoroscopeFlowInput, type HoroscopeFlowOutput } from '@/ai/flows/horoscope-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Heart, CircleDollarSign, Activity } from 'lucide-react';

interface HoroscopeSectionProps {
  dictionary: Dictionary;
  locale: Locale;
  period: 'daily' | 'weekly' | 'monthly';
}

const HoroscopeSection = ({ dictionary, locale, period }: HoroscopeSectionProps) => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSignName>(ZODIAC_SIGNS[0].name);
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeFlowOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoroscope = async () => {
      if (!selectedSign || !locale) return;

      setIsLoading(true);
      setError(null);
      setHoroscopeData(null); 

      try {
        const input: HoroscopeFlowInput = {
          sign: selectedSign,
          locale: locale,
        };
        const result = await getHoroscopeFlow(input);
        setHoroscopeData(result);
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

  let cardTitleKey = 'HoroscopeSection.title'; // Default
  let periodContentKey: 'daily' | 'weekly' | 'monthly' = period;
  let periodTitleKey = `HoroscopeSection.${period}ForecastTitle`;
  
  if (period === 'daily') {
    cardTitleKey = 'HoroscopeSection.dailyTitleTemplate';
    periodTitleKey = 'HoroscopeSection.dailyForecastTitle';
  } else if (period === 'weekly') {
    cardTitleKey = 'HoroscopeSection.weeklyTitleTemplate';
    periodTitleKey = 'HoroscopeSection.weeklyOutlookTitle';
  } else if (period === 'monthly') {
    cardTitleKey = 'HoroscopeSection.monthlyTitleTemplate';
    periodTitleKey = 'HoroscopeSection.monthlyOverviewTitle';
  }

  const currentHoroscope = horoscopeData ? horoscopeData[periodContentKey] : null;

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <ZodiacSignIcon signName={selectedSign} className="w-12 h-12 text-primary mr-2" />
          <CardTitle className="font-headline text-3xl">
            {(dictionary[cardTitleKey] || '{signName} Horoscope').replace('{signName}', translatedSignName)}
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
        ) : currentHoroscope ? (
          <div className="space-y-4 p-4 bg-secondary/30 rounded-md shadow">
            <div>
              <h3 className="text-xl font-headline font-semibold mb-2 text-primary flex items-center gap-2">
                <CalendarDays size={20} /> {dictionary[periodTitleKey] || "Forecast"}
              </h3>
              <p className="font-body text-card-foreground leading-relaxed">{currentHoroscope.main}</p>
            </div>
            <Separator />
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                  <Heart size={20} className="text-red-500" /> {dictionary['HoroscopeSection.loveTitle'] || "Love"}
                </h4>
                <p className="font-body text-card-foreground leading-relaxed text-sm">{currentHoroscope.love}</p>
              </div>
              <div>
                <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                  <CircleDollarSign size={20} className="text-green-500" /> {dictionary['HoroscopeSection.moneyTitle'] || "Money"}
                </h4>
                <p className="font-body text-card-foreground leading-relaxed text-sm">{currentHoroscope.money}</p>
              </div>
              <div>
                <h4 className="text-lg font-headline font-medium flex items-center gap-2 text-accent-foreground mb-1">
                  <Activity size={20} className="text-blue-500" /> {dictionary['HoroscopeSection.healthTitle'] || "Health"}
                </h4>
                <p className="font-body text-card-foreground leading-relaxed text-sm">{currentHoroscope.health}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center font-body text-muted-foreground p-4">{dictionary['HoroscopeSection.noData'] || "No horoscope data available. Please select a sign."}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default HoroscopeSection;
