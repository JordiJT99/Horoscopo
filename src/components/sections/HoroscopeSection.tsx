"use client";

import { useState, useMemo, useEffect } from 'react';
import type { ZodiacSignName, HoroscopeData } from '@/types';
import { ZODIAC_SIGNS, getHoroscope } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { CalendarDays, BookOpen } from 'lucide-react';

const HoroscopeSection = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSignName>(ZODIAC_SIGNS[0].name);
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      setHoroscope(getHoroscope(selectedSign));
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedSign]);

  const handleSignChange = (value: string) => {
    setSelectedSign(value as ZodiacSignName);
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-2">
          <ZodiacSignIcon signName={selectedSign} className="w-12 h-12 text-primary mr-2" />
          <CardTitle className="font-headline text-3xl">{selectedSign} Horoscope</CardTitle>
        </div>
        <CardDescription className="font-body">
          Select your sign to view your astrological forecast.
        </CardDescription>
        <div className="mt-4 max-w-xs mx-auto">
          <Select value={selectedSign} onValueChange={handleSignChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Sign" />
            </SelectTrigger>
            <SelectContent>
              {ZODIAC_SIGNS.map((sign) => (
                <SelectItem key={sign.name} value={sign.name}>
                  <div className="flex items-center">
                    <ZodiacSignIcon signName={sign.name} className="w-5 h-5 mr-2" />
                    {sign.name} ({sign.dateRange})
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
            <p className="mt-4 font-body text-muted-foreground">Loading your cosmic insights...</p>
          </div>
        ) : horoscope ? (
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="daily" className="font-body flex items-center gap-2"><CalendarDays size={16}/>Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="font-body flex items-center gap-2"><CalendarDays size={16}/>Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="font-body flex items-center gap-2"><CalendarDays size={16}/>Monthly</TabsTrigger>
            </TabsList>
            <TabsContent value="daily" className="p-4 bg-secondary/30 rounded-md shadow">
              <h3 className="text-xl font-headline font-semibold mb-2 text-primary">Daily Forecast</h3>
              <p className="font-body text-card-foreground leading-relaxed">{horoscope.daily}</p>
            </TabsContent>
            <TabsContent value="weekly" className="p-4 bg-secondary/30 rounded-md shadow">
              <h3 className="text-xl font-headline font-semibold mb-2 text-primary">Weekly Outlook</h3>
              <p className="font-body text-card-foreground leading-relaxed">{horoscope.weekly}</p>
            </TabsContent>
            <TabsContent value="monthly" className="p-4 bg-secondary/30 rounded-md shadow">
              <h3 className="text-xl font-headline font-semibold mb-2 text-primary">Monthly Overview</h3>
              <p className="font-body text-card-foreground leading-relaxed">{horoscope.monthly}</p>
            </TabsContent>
          </Tabs>
        ) : (
          <p className="text-center font-body text-destructive">Could not load horoscope data.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default HoroscopeSection;
