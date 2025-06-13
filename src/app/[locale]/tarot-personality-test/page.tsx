
"use client";

import { useState, use, useMemo, useEffect } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HelpCircle, Sparkles, Loader2, User, Brain } from 'lucide-react';
import { tarotPersonalityFlow, type TarotPersonalityInputType, type TarotPersonalityOutputType } from '@/ai/flows/tarot-personality-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

interface TarotPersonalityTestPageProps {
  params: { locale: Locale };
}

const initialQuestions = (dict: Dictionary) => [
  { id: 'q1', text: dict['TarotPersonalityPage.question1'] || "Describe how you generally approach new challenges or opportunities.", answer: '' },
  { id: 'q2', text: dict['TarotPersonalityPage.question2'] || "What is a quality you value most in yourself?", answer: '' },
  { id: 'q3', text: dict['TarotPersonalityPage.question3'] || "What kind of energy or guidance are you seeking in your life right now?", answer: '' },
];

interface TarotPersonalityTestContentProps {
  dictionary: Dictionary;
  locale: Locale;
}

function TarotPersonalityTestContent({ dictionary, locale }: TarotPersonalityTestContentProps) {
  const [questions, setQuestions] = useState(() => initialQuestions(dictionary));
  const [result, setResult] = useState<TarotPersonalityOutputType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnswerChange = (index: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index].answer = value;
    setQuestions(newQuestions);
  };

  const handleSubmitTest = async () => {
    const allAnswered = questions.every(q => q.answer.trim().length >= 10); // Basic validation
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
    setQuestions(initialQuestions(dictionary)); // Reset answers
    setError(null);
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['TarotPersonalityPage.title'] || "What Tarot Card Are You?"}
        subtitle={dictionary['TarotPersonalityPage.subtitle'] || "Answer a few questions to discover your tarot card."}
        icon={User}
        className="mb-12"
      />
      <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary text-center">
            {result ? (dictionary['TarotPersonalityPage.resultTitle'] || "Your Tarot Card") : (dictionary['TarotPersonalityPage.quizTitle'] || "Discover Your Card")}
          </CardTitle>
          {!result && (
            <CardDescription className="text-center font-body">
              {dictionary['TarotPersonalityPage.quizDescription'] || "Reflect on the questions below. Your answers will help reveal the tarot card that resonates with you."}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {!result ? (
            <>
              {questions.map((q, index) => (
                <div key={q.id} className="space-y-1">
                  <Label htmlFor={q.id} className="font-body font-semibold">{index + 1}. {q.text}</Label>
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
              <Button onClick={handleSubmitTest} disabled={isLoading} className="w-full font-body">
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
              {error && <p className="text-destructive text-center font-body">{error}</p>}
            </>
          ) : (
            <Card className="mt-6 bg-secondary/30 p-6 rounded-lg shadow">
              <CardHeader className="p-0 pb-4 text-center">
                 <CardTitle className="font-headline text-xl text-accent-foreground">
                   {dictionary['TarotPersonalityPage.yourCardIs'] || "You are:"} {result.cardName}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="flex justify-center mb-4">
                  <Image
                    src={result.cardImagePlaceholderUrl}
                    alt={result.cardName}
                    width={134} 
                    height={235}
                    className="rounded-md shadow-lg border-2 border-primary/50"
                    data-ai-hint="tarot card"
                  />
                </div>
                <div>
                  <h4 className="font-headline text-lg font-semibold text-primary mb-1">{dictionary['TarotPersonalityPage.cardDescriptionTitle'] || "What this means for you:"}</h4>
                   <div className="font-body text-card-foreground leading-relaxed space-y-3">
                    {result.cardDescription.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                <Button onClick={handleTryAgain} variant="outline" className="w-full font-body">
                  {dictionary['TarotPersonalityPage.tryAgainButton'] || "Try Again"}
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function TarotPersonalityTestPage({ params: paramsPromise }: TarotPersonalityTestPageProps) {
  // It's usually safe to `use` paramsPromise directly, Next.js handles this.
  const params = use(paramsPromise);
  // The dictionaryPromise should also be resolved here.
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || Object.keys(dictionary).length === 0) {
    // This loading state is good for when the dictionary is still being fetched.
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  // Pass the resolved dictionary and locale to the content component.
  return <TarotPersonalityTestContent dictionary={dictionary} locale={params.locale} />;
}

