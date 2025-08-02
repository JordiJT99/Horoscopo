"use client";

import { useState } from 'react';
import type { Dictionary, Locale } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CHINESE_ZODIAC_SIGNS, getChineseZodiacSignAndElement, getChineseCompatibility } from '@/lib/constants';
import type { ChineseAnimalSignName, ChineseZodiacResult, ChineseCompatibilityData, ChineseZodiacSign } from '@/types';
import Image from 'next/image';
import { Star, Calculator, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const AnimalIcon = ({ sign, size, dictionary }: { sign: ChineseZodiacSign, size: number, dictionary: Dictionary }) => {
  const iconProps = { className: "w-full h-full" };
  const IconComponent = sign.icon;
  if (IconComponent) {
    return <IconComponent {...iconProps} />;
  }
  return (
    <Image
      src={`https://placehold.co/${size}x${size}.png`}
      alt={dictionary[sign.name] || sign.name}
      width={size}
      height={size}
      className="rounded-sm"
      data-ai-hint={`${sign.name.toLowerCase()}`}
    />
  );
};

const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

interface InteractiveProps {
    dictionary: Dictionary;
    locale: Locale;
    mode: 'calculator' | 'compatibility';
}

export default function ChineseHoroscopeInteractive({ dictionary, locale, mode }: InteractiveProps) {
  // Calculator State
  const [birthYear, setBirthYear] = useState<string>('');
  const [calculatedSign, setCalculatedSign] = useState<ChineseZodiacResult | null>(null);
  const [yearError, setYearError] = useState<string | null>(null);

  // Compatibility State
  const [animal1, setAnimal1] = useState<ChineseAnimalSignName | undefined>(undefined);
  const [animal2, setAnimal2] = useState<ChineseAnimalSignName | undefined>(undefined);
  const [compatibilityResult, setCompatibilityResult] = useState<ChineseCompatibilityData | null>(null);
  const [isCheckingCompatibility, setIsCheckingCompatibility] = useState(false);

  const handleCalculateSign = () => {
    const year = parseInt(birthYear);
    if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 10) {
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
    setTimeout(() => {
      const result = getChineseCompatibility(animal1, animal2, locale);
      setCompatibilityResult(result);
      setIsCheckingCompatibility(false);
    }, 500);
  };
  
  const renderStars = (score: number) => {
    return Array(5).fill(null).map((_, i) => (
      <StarIcon key={i} className={`w-5 h-5 ${i < score ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
    ));
  };

  const calculatedSignObject = calculatedSign ? CHINESE_ZODIAC_SIGNS.find(s => s.name === calculatedSign.animal) : null;
  
  const renderCalculator = () => (
    <Card className="mb-12 shadow-lg max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
            <Calculator className="w-7 h-7" />
            {dictionary['ChineseHoroscopePage.findYourSignTitle']}
        </CardTitle>
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
        {calculatedSign && calculatedSignObject && (
          <div className="p-4 bg-secondary/30 rounded-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 text-primary">
                <AnimalIcon sign={calculatedSignObject} size={40} dictionary={dictionary} />
              </div>
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
  );

  const renderCompatibility = () => (
    <Card className="mb-12 shadow-lg max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
          <Users className="w-7 h-7" />
          {dictionary['ChineseHoroscopePage.compatibilityTitle']}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <Select onValueChange={(val) => setAnimal1(val as ChineseAnimalSignName)} value={animal1}>
            <SelectTrigger><SelectValue placeholder={dictionary['ChineseHoroscopePage.selectFirstAnimal']} /></SelectTrigger>
            <SelectContent>
              {CHINESE_ZODIAC_SIGNS.map(sign => (
                <SelectItem key={sign.name} value={sign.name}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5"><AnimalIcon sign={sign} size={20} dictionary={dictionary} /></div>
                    {dictionary[sign.name] || sign.name}
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
                     <div className="w-5 h-5"><AnimalIcon sign={sign} size={20} dictionary={dictionary} /></div>
                    {dictionary[sign.name] || sign.name}
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
          <div className="text-center p-6"><LoadingSpinner className="h-10 w-10 text-primary" /></div>
        )}

        {compatibilityResult && !isCheckingCompatibility && (
          <div className="mt-6 p-4 bg-secondary/30 rounded-md shadow text-center">
            <h3 className="text-xl font-headline font-semibold text-primary mb-2">
              {(dictionary['ChineseHoroscopePage.compatibilityReportTitle'] || "{animal1} & {animal2} Compatibility")
                .replace('{animal1}', dictionary[compatibilityResult.animal1] || compatibilityResult.animal1)
                .replace('{animal2}', dictionary[compatibilityResult.animal2] || compatibilityResult.animal2)}
            </h3>
            <div className="flex justify-center my-2">{renderStars(compatibilityResult.score)}</div>
            <p className="font-body text-card-foreground leading-relaxed">{compatibilityResult.report}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (mode === 'calculator') return renderCalculator();
  if (mode === 'compatibility') return renderCompatibility();

  return null;
}
