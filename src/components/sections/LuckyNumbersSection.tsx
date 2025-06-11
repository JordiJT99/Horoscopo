"use client";

import { useState, useEffect } from 'react';
import type { ZodiacSignName, LuckyNumbersData } from '@/types';
import { ZODIAC_SIGNS, getLuckyNumbers } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { Clover, Palette, Gem } from 'lucide-react';

const LuckyNumbersSection = () => {
  const [selectedSign, setSelectedSign] = useState<ZodiacSignName>(ZODIAC_SIGNS[0].name);
  const [luckyInfo, setLuckyInfo] = useState<LuckyNumbersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    const timer = setTimeout(() => {
      setLuckyInfo(getLuckyNumbers(selectedSign));
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedSign]);

  const handleSignChange = (value: string) => {
    setSelectedSign(value as ZodiacSignName);
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
          <Clover className="w-8 h-8 text-primary" /> Lucky Charms
        </CardTitle>
        <CardDescription className="font-body">
          Find out your lucky numbers, color, and gemstone.
        </CardDescription>
        <div className="mt-4 max-w-xs mx-auto">
          <Select value={selectedSign} onValueChange={handleSignChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Sign" />
            </SelectTrigger>
            <SelectContent>
              {ZODIAC_SIGNS.map((sign) => (
                <SelectItem key={sign.name} value={sign.name}>
                  <div className="flex items-center">
                    <ZodiacSignIcon signName={sign.name} className="w-5 h-5 mr-2" />
                    {sign.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="text-center">
        {isLoading ? (
          <div className="p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 font-body text-muted-foreground">Unveiling your fortunes...</p>
          </div>
        ) : luckyInfo ? (
          <div className="space-y-4 p-4 bg-secondary/30 rounded-md shadow">
            <div className="flex items-center justify-center mb-2">
              <ZodiacSignIcon signName={luckyInfo.sign} className="w-10 h-10 text-primary mr-2" />
              <h3 className="text-2xl font-headline font-semibold text-primary">{luckyInfo.sign}</h3>
            </div>
            <div>
              <h4 className="text-lg font-headline font-medium text-accent-foreground">Lucky Numbers:</h4>
              <p className="text-3xl font-bold text-primary font-body my-2">
                {luckyInfo.numbers.join(' - ')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-card rounded-md shadow-sm">
                <h4 className="text-lg font-headline font-medium text-accent-foreground flex items-center justify-center gap-1"><Palette size={20}/>Lucky Color:</h4>
                <p className="text-xl font-semibold font-body" style={{ color: luckyInfo.luckyColor.toLowerCase() === 'yellow' ? '#EAB308' : luckyInfo.luckyColor }}>{luckyInfo.luckyColor}</p>
              </div>
              <div className="p-3 bg-card rounded-md shadow-sm">
                <h4 className="text-lg font-headline font-medium text-accent-foreground flex items-center justify-center gap-1"><Gem size={20}/>Lucky Gemstone:</h4>
                <p className="text-xl font-semibold font-body text-primary">{luckyInfo.luckyGemstone}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="font-body text-destructive">Could not load lucky information.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default LuckyNumbersSection;
