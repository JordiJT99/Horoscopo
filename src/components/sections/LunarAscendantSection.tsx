"use client";

import { useState, useEffect } from 'react';
import type { LunarData, AscendantData, UserBirthData } from '@/types';
import { getCurrentLunarData, getAscendantSign, ZODIAC_SIGNS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Moon, Sunrise, Calendar as CalendarIcon, Clock } from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const LunarAscendantSection = () => {
  const [lunarData, setLunarData] = useState<LunarData | null>(null);
  const [ascendantData, setAscendantData] = useState<AscendantData | null>(null);
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date());
  const [birthTime, setBirthTime] = useState<string>("12:00");
  const [birthCity, setBirthCity] = useState<string>("");
  const [isLoadingLunar, setIsLoadingLunar] = useState(true);
  const [isLoadingAscendant, setIsLoadingAscendant] = useState(false);

  useEffect(() => {
    setIsLoadingLunar(true);
    // Simulate API call for lunar data
    const lunarTimer = setTimeout(() => {
      setLunarData(getCurrentLunarData());
      setIsLoadingLunar(false);
    }, 400);
    return () => clearTimeout(lunarTimer);
  }, []);

  const handleCalculateAscendant = () => {
    if (!birthDate || !birthTime || !birthCity) {
      // Basic validation, consider using react-hook-form for robust validation
      alert("Please fill in all birth details.");
      return;
    }
    setIsLoadingAscendant(true);
    // Simulate API call / calculation
    const ascendantTimer = setTimeout(() => {
      setAscendantData(getAscendantSign(birthDate, birthTime, birthCity));
      setIsLoadingAscendant(false);
    }, 700);
    return () => clearTimeout(ascendantTimer);
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
          <Moon className="w-8 h-8 text-primary" /> Lunar & <Sunrise className="w-8 h-8 text-primary" /> Ascendant
        </CardTitle>
        <CardDescription className="font-body">
          Explore current moon phases and discover your ascendant sign.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Lunar Section */}
        <div className="p-4 bg-secondary/30 rounded-md shadow">
          <h3 className="text-2xl font-headline font-semibold mb-3 text-primary text-center">Current Lunar Phase</h3>
          {isLoadingLunar ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
              <p className="mt-3 font-body text-muted-foreground">Tracking the moon...</p>
            </div>
          ) : lunarData ? (
            <div className="text-center space-y-2">
              <p className="text-xl font-body"><strong className="font-semibold">{lunarData.phase}</strong> ({lunarData.illumination}%)</p>
              <p className="text-sm font-body text-muted-foreground">Next Full Moon: {lunarData.nextFullMoon}</p>
              <p className="text-sm font-body text-muted-foreground">Next New Moon: {lunarData.nextNewMoon}</p>
            </div>
          ) : (
            <p className="text-center font-body text-destructive">Could not load lunar data.</p>
          )}
        </div>

        {/* Ascendant Section */}
        <div className="p-4 bg-secondary/30 rounded-md shadow">
          <h3 className="text-2xl font-headline font-semibold mb-4 text-primary text-center">Calculate Your Ascendant Sign</h3>
          <div className="space-y-4 max-w-md mx-auto">
            <div>
              <Label htmlFor="birth-date" className="font-body">Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal font-body",
                      !birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={birthDate}
                    onSelect={setBirthDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="birth-time" className="font-body">Birth Time (approx.)</Label>
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground" />
                <Input id="birth-time" type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)} className="font-body" />
              </div>
            </div>
            <div>
              <Label htmlFor="birth-city" className="font-body">Birth City</Label>
              <Input id="birth-city" type="text" placeholder="e.g., New York" value={birthCity} onChange={(e) => setBirthCity(e.target.value)} className="font-body" />
            </div>
            <Button onClick={handleCalculateAscendant} disabled={isLoadingAscendant} className="w-full font-body">
              {isLoadingAscendant ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div> Calculating...</>
              ) : "Calculate Ascendant"}
            </Button>
          </div>

          {ascendantData && !isLoadingAscendant && (
            <div className="mt-6 text-center p-4 bg-card rounded-md shadow-sm">
              <h4 className="text-xl font-headline font-semibold text-accent-foreground">Your Ascendant Sign:</h4>
              <div className="flex items-center justify-center my-2">
                <ZodiacSignIcon signName={ascendantData.sign} className="w-10 h-10 text-primary mr-2" />
                <p className="text-2xl font-bold text-primary font-body">{ascendantData.sign}</p>
              </div>
              <p className="font-body text-card-foreground leading-relaxed">{ascendantData.briefExplanation}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LunarAscendantSection;
