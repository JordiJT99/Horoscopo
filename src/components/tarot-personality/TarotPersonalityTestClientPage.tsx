
"use client";

import { useState, useEffect } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, RotateCcw } from 'lucide-react';
import { tarotPersonalityFlow, type TarotPersonalityInput, type TarotPersonalityOutput } from '@/ai/flows/tarot-personality-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/context/AuthContext';
import type { OnboardingFormData } from '@/types';

interface TarotPersonalityTestClientPageProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function TarotPersonalityTestClientPage({ dictionary, locale }: TarotPersonalityTestClientPageProps) {
  const [result, setResult] = useState<TarotPersonalityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);

  useEffect(() => {
    if (user?.uid) {
      const storedData = localStorage.getItem(`onboardingData_${user.uid}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData) as OnboardingFormData;
          setOnboardingData(parsedData);
        } catch (e) {
          console.error("Failed to parse onboarding data:", e);
          setOnboardingData(null);
        }
      }
    } else {
        setOnboardingData(null);
    }
  }, [user]);

  const handleGetDailyCard = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const input: TarotPersonalityInput = {
        locale,
        userName: onboardingData?.name || user?.displayName || undefined,
      };
      const flowResult: TarotPersonalityOutput = await tarotPersonalityFlow(input);
      setResult(flowResult);
    } catch (err) {
      console.error("Error getting daily tarot card:", err);
      setError(dictionary['TarotDailyReading.errorFetching'] || "The spirits are pondering... Could not determine your card. Please try again.");
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['TarotDailyReading.errorFetching'] || "The spirits are pondering... Could not determine your card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setError(null);
  };

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="text-center py-10">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="mt-4 font-body">Loading Tarot Personality Test...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
      <CardHeader className="px-4 py-4 md:px-6 md:py-5">
        <CardTitle className="font-headline text-xl md:text-2xl text-primary text-center">
          {result ? (dictionary['TarotDailyReading.resultTitle'] || "Your Card for Today") : (dictionary['TarotDailyReading.revealTitle'] || "Reveal Your Daily Card")}
        </CardTitle>
        {!result && (
          <CardDescription className="text-center font-body text-sm md:text-base">
            {dictionary['TarotDailyReading.revealDescription'] || "Focus on the day ahead and let the cards reveal the energy that guides you today."}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 px-4 pb-4 md:px-6 md:pb-6 min-h-[300px] flex flex-col justify-center items-center">
        {!result ? (
          <>
            <Button onClick={handleGetDailyCard} disabled={isLoading} className="w-full max-w-xs font-body text-base" size="lg">
              {isLoading ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-pulse" />
                  {dictionary['TarotDailyReading.revealingButton'] || "Revealing Card..."}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {dictionary['TarotDailyReading.revealButton'] || "Reveal My Daily Card"}
                </>
              )}
            </Button>
            {error && <p className="text-destructive text-center font-body text-sm md:text-base mt-4">{error}</p>}
          </>
        ) : (
          <Card className="w-full bg-secondary/30 p-4 md:p-6 rounded-lg shadow">
            <CardHeader className="p-0 pb-3 md:pb-4 text-center">
               <CardTitle className="font-headline text-lg md:text-xl text-accent-foreground">
                 {result.cardName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 md:space-y-4">
              <div className="flex justify-center mb-3 md:mb-4">
                <Image
                  src={result.cardImagePlaceholderUrl}
                  alt={result.cardName}
                  width={150}
                  height={262}
                  className="rounded-md shadow-lg border-2 border-primary/50"
                  data-ai-hint={`${result.cardName.toLowerCase().replace(/\s+/g, '_')} tarot`}
                  unoptimized={result.cardImagePlaceholderUrl.startsWith("https://placehold.co")}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://placehold.co/150x262.png?text=Error";
                    target.setAttribute("data-ai-hint", "tarot placeholder error");
                  }}
                />
              </div>
              <div>
                <h4 className="font-headline text-md md:text-lg font-semibold text-primary mb-1">{dictionary['TarotDailyReading.readingTitle'] || "Today's Message:"}</h4>
                 <div className="font-body text-card-foreground leading-relaxed space-y-2 md:space-y-3 text-xs sm:text-sm whitespace-pre-line">
                  {result.reading}
                </div>
              </div>
              <Button onClick={handleTryAgain} variant="outline" className="w-full font-body text-xs md:text-sm mt-4">
                <RotateCcw className="mr-2 h-4 w-4" />
                {dictionary['TarotDailyReading.drawAgainButton'] || "Draw Another Card"}
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
