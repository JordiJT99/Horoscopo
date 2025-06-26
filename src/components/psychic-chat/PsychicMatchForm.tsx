'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { findMyPsychic } from '@/ai/flows/psychic-match-flow';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface PsychicMatchFormProps {
  dictionary: Dictionary;
  locale: Locale;
}

const questions = [
  {
    id: 'q1',
    questionKey: 'PsychicMatch.q1',
    options: [
      { key: 'love', labelKey: 'PsychicMatch.q1.opt1' },
      { key: 'career', labelKey: 'PsychicMatch.q1.opt2' },
      { key: 'personal_growth', labelKey: 'PsychicMatch.q1.opt3' },
      { key: 'general', labelKey: 'PsychicMatch.q1.opt4' },
    ],
  },
  {
    id: 'q2',
    questionKey: 'PsychicMatch.q2',
    options: [
      { key: 'direct', labelKey: 'PsychicMatch.q2.opt1' },
      { key: 'gentle', labelKey: 'PsychicMatch.q2.opt2' },
      { key: 'spiritual', labelKey: 'PsychicMatch.q2.opt3' },
      { key: 'practical', labelKey: 'PsychicMatch.q2.opt4' },
    ],
  },
  {
    id: 'q3',
    questionKey: 'PsychicMatch.q3',
    options: [
      { key: 'feeling_stuck', labelKey: 'PsychicMatch.q3.opt1' },
      { key: 'making_decision', labelKey: 'PsychicMatch.q3.opt2' },
      { key: 'seeking_closure', labelKey: 'PsychicMatch.q3.opt3' },
      { key: 'curious', labelKey: 'PsychicMatch.q3.opt4' },
    ],
  },
];

const TOTAL_STEPS = questions.length;

export default function PsychicMatchForm({ dictionary, locale }: PsychicMatchFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentStep].id]: value,
    }));
  };

  const handleNext = () => {
    if (!answers[questions[currentStep].id]) {
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['PsychicMatch.errorSelectOption'] || "Please select an option to continue.",
        variant: "destructive",
      });
      return;
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
     if (!answers[questions[currentStep].id]) {
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['PsychicMatch.errorSelectOption'] || "Please select an option to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    
    const formattedAnswers = questions.map(q => ({
        question: dictionary[q.questionKey] || q.questionKey,
        answer: dictionary[q.options.find(opt => opt.key === answers[q.id])?.labelKey || ''] || answers[q.id]
    }));

    try {
        const result = await findMyPsychic(formattedAnswers, locale, dictionary);
        toast({
            title: dictionary['PsychicMatch.successTitle'] || "We found a match!",
            description: dictionary['PsychicMatch.successDescription'] || "Redirecting you to your psychic...",
        });
        const topic = answers['q1'];
        router.push(`/${locale}/psychic-chat/${result.psychicId}?topic=${topic}`);
    } catch(err) {
        console.error("Error finding psychic:", err);
        toast({
            title: dictionary['Error.genericTitle'] || "Error",
            description: dictionary['PsychicMatch.errorFindingPsychic'] || "We couldn't find a psychic for you at this time. Please try again later.",
            variant: "destructive"
        });
        setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentStep];

  if (isSubmitting) {
    return (
      <Card className="w-full max-w-lg mx-auto shadow-xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <Sparkles className="h-16 w-16 text-primary animate-pulse mb-4" />
        <h2 className="text-xl font-headline font-semibold text-primary">{dictionary['PsychicMatch.submittingTitle'] || "Consulting the Cosmos..."}</h2>
        <p className="text-muted-foreground mt-2">{dictionary['PsychicMatch.submittingDescription'] || "We are finding the perfect guide for your spiritual journey."}</p>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-xl">
      <CardHeader>
        <Progress value={((currentStep + 1) / TOTAL_STEPS) * 100} className="mb-4" />
        <CardTitle className="font-headline text-xl text-primary">{dictionary[currentQuestion.questionKey]}</CardTitle>
        <CardDescription>{dictionary['PsychicMatch.stepIndicator']?.replace('{current}', (currentStep + 1).toString()).replace('{total}', TOTAL_STEPS.toString())}</CardDescription>
      </CardHeader>
      <CardContent className="min-h-[200px]">
        <RadioGroup
          value={answers[currentQuestion.id] || ''}
          onValueChange={handleAnswerChange}
          className="space-y-2"
        >
          {currentQuestion.options.map(opt => (
            <div key={opt.key} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.key} id={`${currentQuestion.id}-${opt.key}`} />
              <Label htmlFor={`${currentQuestion.id}-${opt.key}`} className="font-normal">{dictionary[opt.labelKey]}</Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          {dictionary['OnboardingPage.previousButton'] || "Previous"}
        </Button>
        {currentStep === TOTAL_STEPS - 1 ? (
          <Button onClick={handleSubmit}>
            {dictionary['PsychicMatch.submitButton'] || "Find My Psychic"}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {dictionary['OnboardingPage.nextButton'] || "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
