"use client";

import { useState, useMemo, useEffect } from 'react';
import type { ZodiacSignName, CompatibilityData } from '@/types';
import { ZODIAC_SIGNS, getCompatibility, ALL_SIGN_NAMES } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { Users, Heart } from 'lucide-react';

const CompatibilitySection = () => {
  const [sign1, setSign1] = useState<ZodiacSignName>(ZODIAC_SIGNS[0].name);
  const [sign2, setSign2] = useState<ZodiacSignName>(ZODIAC_SIGNS[1].name);
  const [compatibility, setCompatibility] = useState<CompatibilityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchCompatibility = () => {
    if (!sign1 || !sign2) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCompatibility(getCompatibility(sign1, sign2));
      setIsLoading(false);
    }, 500);
  };
  
  useEffect(() => {
    // Initial load
    handleFetchCompatibility();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sign1, sign2]);


  const renderStars = (score: number) => {
    return Array(5).fill(null).map((_, i) => (
      <Heart key={i} className={`w-6 h-6 ${i < score ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
    ));
  };

  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
          <Users className="w-8 h-8 text-primary" /> Compatibility Check
        </CardTitle>
        <CardDescription className="font-body">
          Discover how well different zodiac signs match.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="sign1-select" className="block text-sm font-medium text-muted-foreground mb-1 font-body">Select First Sign</label>
            <Select value={sign1} onValueChange={(val) => setSign1(val as ZodiacSignName)}>
              <SelectTrigger id="sign1-select">
                <SelectValue placeholder="Sign 1" />
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
          <div>
            <label htmlFor="sign2-select" className="block text-sm font-medium text-muted-foreground mb-1 font-body">Select Second Sign</label>
            <Select value={sign2} onValueChange={(val) => setSign2(val as ZodiacSignName)}>
              <SelectTrigger id="sign2-select">
                <SelectValue placeholder="Sign 2" />
              </SelectTrigger>
              <SelectContent>
                {ZODIAC_SIGNS.map((sign) => (
                  <SelectItem key={sign.name} value={sign.name} disabled={sign.name === sign1}>
                     <div className="flex items-center">
                      <ZodiacSignIcon signName={sign.name} className="w-5 h-5 mr-2" />
                      {sign.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading && (
            <div className="text-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 font-body text-muted-foreground">Checking cosmic connection...</p>
            </div>
        )}

        {!isLoading && compatibility && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-md shadow text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <ZodiacSignIcon signName={compatibility.sign1} className="w-10 h-10 text-primary" />
              <Heart className="w-8 h-8 text-destructive" />
              <ZodiacSignIcon signName={compatibility.sign2} className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-semibold text-primary">
              {compatibility.sign1} & {compatibility.sign2}
            </h3>
            <div className="flex justify-center my-3">
              {renderStars(compatibility.score)}
            </div>
            <p className="font-body text-card-foreground leading-relaxed">{compatibility.report}</p>
          </div>
        )}
        {!isLoading && !compatibility && sign1 && sign2 && (
          <p className="text-center font-body text-muted-foreground mt-6">Click "Check Compatibility" to see the report.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CompatibilitySection;
