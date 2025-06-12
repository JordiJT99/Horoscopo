
"use client"; // This page uses client-side hooks

import { useState, useEffect, use, useMemo } from 'react';
import type { ZodiacSignName, LuckyNumbersData } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries'; // For client-side dictionary
import { ZODIAC_SIGNS, getLuckyNumbers } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Clover, Palette, Gem, MessageCircleHeart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LuckyNumbersPageProps {
  params: { // params is a promise in client components
    locale: Locale;
  };
}

function LuckyNumbersContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const [selectedSign, setSelectedSign] = useState<ZodiacSignName>(ZODIAC_SIGNS[0].name);
  const [luckyInfo, setLuckyInfo] = useState<LuckyNumbersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLuckyInfo = (sign: ZodiacSignName) => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setLuckyInfo(getLuckyNumbers(sign, locale));
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  };
  
  useEffect(() => {
    fetchLuckyInfo(selectedSign);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSign, locale]);

  const handleSignChange = (value: string) => {
    setSelectedSign(value as ZodiacSignName);
  };

  const handleGenerateNew = () => {
    fetchLuckyInfo(selectedSign);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['LuckyNumbersPage.title'] || "Lucky Charms"}
        subtitle={dictionary['LuckyNumbersPage.subtitle'] || "Find out your lucky numbers, color, and gemstone for your sign."}
        icon={Clover}
        className="mb-12"
      />
      <Card className="w-full shadow-xl max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
            <Clover className="w-8 h-8 text-primary" /> {dictionary['LuckyNumbersSection.title'] || "Lucky Charms"}
          </CardTitle>
          <CardDescription className="font-body">
            {dictionary['LuckyNumbersSection.description'] || "Select your sign to discover its lucky attributes."}
          </CardDescription>
          <div className="mt-4 max-w-xs mx-auto">
            <Select value={selectedSign} onValueChange={handleSignChange}>
              <SelectTrigger>
                <SelectValue placeholder={dictionary['HoroscopeSection.selectSignPlaceholder'] || "Select Sign"} />
              </SelectTrigger>
              <SelectContent>
                {ZODIAC_SIGNS.map((sign) => (
                  <SelectItem key={sign.name} value={sign.name}>
                    <div className="flex items-center">
                      <ZodiacSignIcon signName={sign.name} className="w-5 h-5 mr-2" />
                      {dictionary[sign.name] || sign.name}
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
              <p className="mt-4 font-body text-muted-foreground">{dictionary['LuckyNumbersSection.loading'] || "Unveiling your fortunes..."}</p>
            </div>
          ) : luckyInfo ? (
            <div className="space-y-6 p-4 bg-secondary/30 rounded-md shadow">
              <div className="flex items-center justify-center mb-2">
                <ZodiacSignIcon signName={luckyInfo.sign} className="w-10 h-10 text-primary mr-2" />
                <h3 className="text-2xl font-headline font-semibold text-primary">{dictionary[luckyInfo.sign] || luckyInfo.sign}</h3>
              </div>
              <div>
                <h4 className="text-lg font-headline font-medium text-accent-foreground">{dictionary['LuckyNumbersSection.luckyNumbersLabel'] || "Lucky Numbers:"}</h4>
                <p className="text-3xl font-bold text-primary font-body my-2">
                  {luckyInfo.numbers.join(' - ')}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-card rounded-md shadow-sm">
                  <h4 className="text-lg font-headline font-medium text-accent-foreground flex items-center justify-center gap-1"><Palette size={20}/>{dictionary['LuckyNumbersSection.luckyColorLabel'] || "Lucky Color:"}</h4>
                  <p className="text-xl font-semibold font-body" style={{ color: luckyInfo.luckyColor.toLowerCase() === 'yellow' ? '#EAB308' : luckyInfo.luckyColor }}>{luckyInfo.luckyColor}</p>
                </div>
                <div className="p-3 bg-card rounded-md shadow-sm">
                  <h4 className="text-lg font-headline font-medium text-accent-foreground flex items-center justify-center gap-1"><Gem size={20}/>{dictionary['LuckyNumbersSection.luckyGemstoneLabel'] || "Lucky Gemstone:"}</h4>
                  <p className="text-xl font-semibold font-body text-primary">{luckyInfo.luckyGemstone}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-card rounded-md shadow-sm">
                <h4 className="text-lg font-headline font-medium text-accent-foreground flex items-center justify-center gap-1">
                    <MessageCircleHeart size={20} />
                    {dictionary['LuckyNumbersSection.motivationalPhraseLabel'] || "Motivational Phrase:"}
                </h4>
                <p className="text-md font-body italic text-card-foreground/90 mt-1">{luckyInfo.motivationalPhrase}</p>
              </div>
              <Button onClick={handleGenerateNew} variant="outline" className="mt-4 w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                {dictionary['LuckyNumbersSection.generateNewButton'] || "Generate New Numbers"}
              </Button>
            </div>
          ) : (
            <p className="font-body text-destructive">{dictionary['LuckyNumbersSection.error'] || "Could not load lucky information."}</p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function LuckyNumbersPage({ params: paramsPromise }: LuckyNumbersPageProps) {
  const params = use(paramsPromise);
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return <LuckyNumbersContent dictionary={dictionary} locale={params.locale} />;
}
