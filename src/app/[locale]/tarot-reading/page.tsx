
"use client";

import { useState, use, useMemo, useEffect } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand, Sparkles, Loader2 } from 'lucide-react';
import { tarotReadingFlow, type TarotReadingInput, type TarotReadingOutput } from '@/ai/flows/tarot-reading-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

interface TarotReadingPageProps {
  params: { locale: Locale };
}

function TarotReadingContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<TarotReadingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDrawCard = async () => {
    if (!question.trim()) {
      setError(dictionary['TarotReadingPage.enterQuestionPrompt'] || "Please enter a question for your reading.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setReading(null);
    try {
      const input: TarotReadingInput = { question, locale };
      const result: TarotReadingOutput = await tarotReadingFlow(input);
      setReading(result);
    } catch (err) {
      console.error("Error getting tarot reading:", err);
      setError(dictionary['TarotReadingPage.errorFetching'] || "The spirits are clouded... Could not get a reading. Please try again.");
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['TarotReadingPage.errorFetching'] || "The spirits are clouded... Could not get a reading. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['TarotReadingPage.title'] || "Tarot Reading"}
        subtitle={dictionary['TarotReadingPage.subtitle'] || "Ask a question and draw a card for guidance."}
        icon={Wand}
        className="mb-12"
      />
      <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary text-center">
            {dictionary['TarotReadingPage.askTitle'] || "Ask Your Question"}
          </CardTitle>
          <CardDescription className="text-center font-body">
            {dictionary['TarotReadingPage.askDescription'] || "Focus on your question and let the cards guide you. Draw one card for insight."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Textarea
              id="tarot-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={dictionary['TarotReadingPage.questionPlaceholder'] || "Type your question here..."}
              className="min-h-[100px] font-body"
              aria-label={dictionary['TarotReadingPage.questionLabel'] || "Your question for the tarot reading"}
            />
          </div>

          <Button onClick={handleDrawCard} disabled={isLoading} className="w-full font-body">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {dictionary['TarotReadingPage.drawingCardButton'] || "Drawing Card..."}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {dictionary['TarotReadingPage.drawCardButton'] || "Draw a Card"}
              </>
            )}
          </Button>

          {error && <p className="text-destructive text-center font-body">{error}</p>}

          {reading && !isLoading && (
            <Card className="mt-6 bg-secondary/30 p-6 rounded-lg shadow">
              <CardHeader className="p-0 pb-4 text-center">
                <CardTitle className="font-headline text-xl text-accent-foreground">
                  {reading.cardName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="flex justify-center mb-4">
                  <Image 
                    src={reading.imagePlaceholderUrl} 
                    alt={reading.cardName} 
                    width={150} // Adjust as needed
                    height={250} // Adjust based on placeholder aspect ratio
                    className="rounded-md shadow-lg border-2 border-primary/50"
                    data-ai-hint="tarot card"
                  />
                </div>
                <div>
                  <h4 className="font-headline text-lg font-semibold text-primary mb-1">{dictionary['TarotReadingPage.meaningTitle'] || "Meaning:"}</h4>
                  <p className="font-body text-card-foreground leading-relaxed">{reading.cardMeaning}</p>
                </div>
                <div>
                  <h4 className="font-headline text-lg font-semibold text-primary mb-1">{dictionary['TarotReadingPage.adviceTitle'] || "Advice for Your Question:"}</h4>
                  <p className="font-body text-card-foreground leading-relaxed">{reading.advice}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function TarotReadingPage({ params: paramsPromise }: TarotReadingPageProps) {
  const params = use(paramsPromise);
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return <TarotReadingContent dictionary={dictionary} locale={params.locale} />;
}
