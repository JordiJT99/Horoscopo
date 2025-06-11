
"use client";

import { useState } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CHINESE_ZODIAC_SIGNS, getChineseZodiacSignAndElement, getChineseCompatibility, CompatibilityIcon } from '@/lib/constants';
import type { ChineseAnimalSignName, ChineseZodiacResult, ChineseCompatibilityData } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import SectionTitle from '@/components/shared/SectionTitle'; // Import if needed for sub-sections

interface ChineseHoroscopeInteractiveProps {
  dictionary: Dictionary;
}

// Helper StarIcon if not globally available or to ensure styling
const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default function ChineseHoroscopeInteractive({ dictionary }: ChineseHoroscopeInteractiveProps) {
  const [birthYear, setBirthYear] = useState<string>('');
  const [calculatedSign, setCalculatedSign] = useState<ChineseZodiacResult | null>(null);
  const [yearError, setYearError] = useState<string | null>(null);

  const [animal1, setAnimal1] = useState<ChineseAnimalSignName | undefined>(undefined);
  const [animal2, setAnimal2] = useState<ChineseAnimalSignName | undefined>(undefined);
  const [compatibilityResult, setCompatibilityResult] = useState<ChineseCompatibilityData | null>(null);
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);

  const handleCalculateSign = () => {
    const year = parseInt(birthYear);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 10) { // Basic validation
      setYearError(dictionary['ChineseHoroscopePage.invalidYear'] || "Please enter a valid year (e.g., 1990).");
      setCalculatedSign(null);
      return;
    }
    setYearError(null);
    const result = getChineseZodiacSignAndElement(year);
    setCalculatedSign(result);
  };

  const handleCheckCompatibility = () => {
    if (!animal1 || !animal2) return;
    setIsCheckingCompatibility(true);
    // Simulate API call
    setTimeout(() => {
      const result = getChineseCompatibility(animal1, animal2);
      setCompatibilityResult(result);
      setIsCheckingCompatibility(false);
    }, 500);
  };
  
  const renderStars = (score: number) => {
    return Array(5).fill(null).map((_, i) => (
      <StarIcon key={i} className={`w-5 h-5 ${i < score ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
    ));
  };

  if (Object.keys(dictionary).length === 0) {
    // This initial loading state might not be hit as dictionary is passed as prop
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return (
    <>
      {/* Find Your Sign Section */}
      <Card className="mb-12 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">{dictionary['ChineseHoroscopePage.findYourSignTitle']}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <Input
              type="number"
              placeholder={dictionary['ChineseHoroscopePage.enterBirthYear'] || "Enter your birth year"}
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleCalculateSign}>{dictionary['ChineseHoroscopePage.calculateButton']}</Button>
          </div>
          {yearError && <p className="text-destructive text-sm mb-4">{yearError}</p>}
          {calculatedSign && (
            <div className="p-4 bg-secondary/30 rounded-md">
              <div className="flex items-center gap-3 mb-2">
                <calculatedSign.icon className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-lg font-semibold">
                    {dictionary['ChineseHoroscopePage.yourSignIs']}{' '}
                    <span className="text-primary">{dictionary[calculatedSign.animal] || calculatedSign.animal}</span>
                  </p>
                  <p className="text-md">
                    {dictionary['ChineseHoroscopePage.yourElementIs']}{' '}
                    <span className="text-primary">{dictionary[calculatedSign.element] || calculatedSign.element}</span>
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{dictionary['ChineseHoroscopePage.yearInfo']?.replace('{year}', calculatedSign.year.toString())}</p>
              <p className="mt-2 text-xs text-muted-foreground italic">{dictionary['ChineseHoroscopePage.calculationNote']}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator className="my-12" />

      {/* Chinese Zodiac Compatibility Section */}
      <Card className="mb-12 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <CompatibilityIcon className="w-7 h-7" />
            {dictionary['ChineseHoroscopePage.compatibilityTitle']}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Select onValueChange={(val) => setAnimal1(val as ChineseAnimalSignName)} value={animal1}>
              <SelectTrigger><SelectValue placeholder={dictionary['ChineseHoroscopePage.selectFirstAnimal']} /></SelectTrigger>
              <SelectContent>
                {CHINESE_ZODIAC_SIGNS.map(sign => (
                  <SelectItem key={sign.name} value={sign.name}>
                    <div className="flex items-center gap-2">
                      <sign.icon className="w-5 h-5" /> {dictionary[sign.name] || sign.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(val) => setAnimal2(val as ChineseAnimalSignName)} value={animal2} disabled={!animal1}>
              <SelectTrigger><SelectValue placeholder={dictionary['ChineseHoroscopePage.selectSecondAnimal']} /></SelectTrigger>
              <SelectContent>
                {CHINESE_ZODIAC_SIGNS.filter(sign => sign.name !== animal1).map(sign => (
                  <SelectItem key={sign.name} value={sign.name}>
                    <div className="flex items-center gap-2">
                      <sign.icon className="w-5 h-5" /> {dictionary[sign.name] || sign.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleCheckCompatibility} disabled={!animal1 || !animal2 || isCheckingCompatibility} className="w-full md:w-auto">
            {isCheckingCompatibility ? (dictionary['ChineseHoroscopePage.checkingCompatibility'] || 'Checking...') : (dictionary['ChineseHoroscopePage.checkCompatibilityButton'])}
          </Button>

          {isCheckingCompatibility && (
            <div className="text-center p-6">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            </div>
          )}

          {compatibilityResult && !isCheckingCompatibility && (
            <div className="mt-6 p-4 bg-secondary/30 rounded-md shadow text-center">
              <h3 className="text-xl font-headline font-semibold text-primary mb-2">
                {(dictionary['ChineseHoroscopePage.compatibilityReportTitle'] || "{animal1} & {animal2} Compatibility")
                  .replace('{animal1}', dictionary[compatibilityResult.animal1] || compatibilityResult.animal1)
                  .replace('{animal2}', dictionary[compatibilityResult.animal2] || compatibilityResult.animal2)}
              </h3>
              <div className="flex justify-center my-2">
                {renderStars(compatibilityResult.score)}
              </div>
              <p className="font-body text-card-foreground leading-relaxed">{compatibilityResult.report}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Separator className="my-12" />

      {/* Sign Information Section (Existing Cards) */}
       <SectionTitle
        title={dictionary['ChineseHoroscopePage.signInfoTitle'] || "Sign Information"}
        icon={ChineseAstrologyIcon}
        className="mb-8"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {CHINESE_ZODIAC_SIGNS.map((sign) => {
          const SignIcon = sign.icon;
          const translatedSignName = dictionary[sign.name] || sign.name;
          const translatedElement = dictionary[sign.element] || sign.element;
          return (
            <Card key={sign.name} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <CardHeader className="items-center text-center">
                <SignIcon className="w-16 h-16 text-primary mb-3" />
                <CardTitle className="font-headline text-2xl text-primary">{translatedSignName}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">{dictionary['ChineseHoroscopePage.years']}</p>
                    <p className="text-sm font-body">{sign.years.join(', ')}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground">{dictionary['ChineseHoroscopePage.element']}</p>
                    <Badge variant="secondary">{translatedElement}</Badge>
                  </div>
                  {sign.description && (
                    <div>
                      <p className="font-semibold text-sm text-muted-foreground">{dictionary['ChineseHoroscopePage.description']}</p>
                      <p className="text-sm font-body text-card-foreground/90">{sign.description}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12 p-6 bg-secondary/30 rounded-lg shadow">
        <p className="text-lg text-muted-foreground font-body">
          {dictionary['ChineseHoroscopePage.comingSoon']}
        </p>
      </div>
    </>
  );
}
