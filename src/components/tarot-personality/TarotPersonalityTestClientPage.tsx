
"use client";

import { useState, useEffect, useMemo } from 'react'; 
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HelpCircle, Sparkles, User, Brain } from 'lucide-react';
import { tarotPersonalityFlow, type TarotPersonalityInputType, type TarotPersonalityOutputType } from '@/ai/flows/tarot-personality-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const initialQuestions = (dict: Dictionary) => [
  { id: 'q1', text: dict['TarotPersonalityPage.question1'] || "Describe how you generally approach new challenges or opportunities.", answer: '' },
  { id: 'q2', text: dict['TarotPersonalityPage.question2'] || "What is a quality you value most in yourself?", answer: '' },
  { id: 'q3', text: dict['TarotPersonalityPage.question3'] || "What kind of energy or guidance are you seeking in your life right now?", answer: '' },
];

interface TarotPersonalityTestClientPageProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function TarotPersonalityTestClientPage({ dictionary, locale }: TarotPersonalityTestClientPageProps) {
  const [questions, setQuestions] = useState(() => initialQuestions(dictionary));
  const [result, setResult] = useState<TarotPersonalityOutputType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setQuestions(initialQuestions(dictionary));
  }, [dictionary]);

  const handleAnswerChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };

  const handleSubmitTest = async () => {
    const allAnswered = questions.every(q => q.answer.trim().length >= 10); 
    if (!allAnswered) {
      setError(dictionary['TarotPersonalityPage.errorAllAnswers'] || "Please provide a thoughtful answer (at least 10 characters) for all questions.");
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['TarotPersonalityPage.errorAllAnswers'] || "Please provide a thoughtful answer (at least 10 characters) for all questions.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const input: TarotPersonalityInputType = {
        answers: questions.map(q => ({ question: q.text, answer: q.answer })),
        locale,
      };
      const flowResult: TarotPersonalityOutputType = await tarotPersonalityFlow(input);
      setResult(flowResult);
    } catch (err) {
      console.error("Error getting tarot personality:", err);
      setError(dictionary['TarotPersonalityPage.errorFetching'] || "The spirits are pondering... Could not determine your card. Please try again.");
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['TarotPersonalityPage.errorFetching'] || "The spirits are pondering... Could not determine your card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setQuestions(initialQuestions(dictionary)); 
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
          {result ? (dictionary['TarotPersonalityPage.resultTitle'] || "Your Tarot Card") : (dictionary['TarotPersonalityPage.quizTitle'] || "Discover Your Card")}
        </CardTitle>
        {!result && (
          <CardDescription className="text-center font-body text-sm md:text-base">
            {dictionary['TarotPersonalityPage.quizDescription'] || "Reflect on the questions below. Your answers will help reveal the tarot card that resonates with you."}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 px-4 pb-4 md:px-6 md:pb-6">
        {!result ? (
          <>
            {questions.map((q, index) => (
              <div key={q.id} className="space-y-1">
                <Label htmlFor={q.id} className="font-body font-semibold text-sm md:text-base">{index + 1}. {q.text}</Label>
                <Textarea
                  id={q.id}
                  value={q.answer}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={dictionary['TarotPersonalityPage.answerPlaceholder'] || "Your thoughts here..."}
                  className="min-h-[100px] font-body"
                  aria-label={q.text}
                />
              </div>
            ))}
            <Button onClick={handleSubmitTest} disabled={isLoading} className="w-full font-body text-sm md:text-base">
              {isLoading ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-pulse" />
                  {dictionary['TarotPersonalityPage.determiningButton'] || "Determining Your Card..."}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {dictionary['TarotPersonalityPage.submitButton'] || "Reveal My Card"}
                </>
              )}
            </Button>
            {error && <p className="text-destructive text-center font-body text-sm md:text-base">{error}</p>}
          </>
        ) : (
          <Card className="mt-6 bg-secondary/30 p-4 md:p-6 rounded-lg shadow">
            <CardHeader className="p-0 pb-3 md:pb-4 text-center">
               <CardTitle className="font-headline text-lg md:text-xl text-accent-foreground">
                 {dictionary['TarotPersonalityPage.yourCardIs'] || "You are:"} {result.cardName}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3 md:space-y-4">
              <div className="flex justify-center mb-3 md:mb-4">
                <Image
                  src={result.cardImagePlaceholderUrl} // This will now be the actual image path
                  alt={result.cardName}
                  width={134} 
                  height={235} // Adjusted to maintain aspect ratio of 267x470 used in placeholder
                  className="rounded-md shadow-lg border-2 border-primary/50"
                  data-ai-hint={`${result.cardName.toLowerCase().replace(/\s+/g, '_')} tarot`}
                  unoptimized={result.cardImagePlaceholderUrl.startsWith("https://placehold.co")} // only unoptimize placeholders
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; 
                    target.src = "https://placehold.co/134x235.png?text=Error";
                    target.setAttribute("data-ai-hint", "tarot placeholder error");
                  }}
                />
              </div>
              <div>
                <h4 className="font-headline text-md md:text-lg font-semibold text-primary mb-1">{dictionary['TarotPersonalityPage.cardDescriptionTitle'] || "What this means for you:"}</h4>
                 <div className="font-body text-card-foreground leading-relaxed space-y-2 md:space-y-3 text-xs sm:text-sm">
                  {result.cardDescription.split('\\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <Button onClick={handleTryAgain} variant="outline" className="w-full font-body text-xs md:text-sm">
                {dictionary['TarotPersonalityPage.tryAgainButton'] || "Try Again"}
              </Button>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
