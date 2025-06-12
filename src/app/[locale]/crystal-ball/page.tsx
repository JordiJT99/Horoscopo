
"use client";

import { useState, use, useMemo } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Eye, Sparkles, Share2 } from 'lucide-react';
import { crystalBallFlow, type CrystalBallInput, type CrystalBallOutput } from '@/ai/flows/crystal-ball-flow';
import { useToast } from "@/hooks/use-toast";

interface CrystalBallPageProps {
  params: { locale: Locale };
}

function CrystalBallContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConsultCrystalBall = async () => {
    if (!question.trim()) {
      setError(dictionary['CrystalBallPage.enterQuestionPrompt'] || "Please enter a question for the crystal ball.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const input: CrystalBallInput = { question, locale };
      const result: CrystalBallOutput = await crystalBallFlow(input);
      setAnswer(result.answer);
    } catch (err) {
      console.error("Error consulting crystal ball:", err);
      setError(dictionary['CrystalBallPage.errorFetching'] || "The mists are unclear... Could not get an answer. Please try again.");
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['CrystalBallPage.errorFetching'] || "The mists are unclear... Could not get an answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!answer) return;

    const shareTitle = dictionary['Share.crystalBallTitle'] || "A Crystal Ball Revelation from AstroVibes";
    const predictionText = answer;
    const pageUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: predictionText,
          url: pageUrl,
        });
        toast({
          title: dictionary['Share.successTitle'] || "Success!",
          description: dictionary['Share.successMessage'] || "Content shared successfully.",
        });
      } catch (err) {
        console.error('Error sharing:', err);
        // Don't show error toast if user cancelled share dialog
        if ((err as Error).name !== 'AbortError') {
          toast({
            title: dictionary['Share.errorTitle'] || "Sharing Error",
            description: dictionary['Share.errorMessage'] || "Could not share the content. Please try again.",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback: copy to clipboard with URL
      const textToCopy = `${predictionText}\n\n${dictionary['Share.sharedFromAstroVibes'] || 'Shared from AstroVibes:'} ${pageUrl}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: dictionary['Share.copiedTitle'] || "Copied!",
          description: dictionary['Share.copiedMessageContentAndLink'] || "The revelation and a link to the page have been copied to your clipboard.",
        });
      } catch (copyError) {
        console.error('Error copying to clipboard:', copyError);
        toast({
          title: dictionary['Share.errorTitle'] || "Sharing Error",
          description: dictionary['Share.errorMessageClipboard'] || "Could not copy. Please try sharing manually.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['CrystalBallPage.title'] || "Crystal Ball"}
        subtitle={dictionary['CrystalBallPage.subtitle'] || "Peer into the mists and ask your question to the Crystal Ball."}
        icon={Eye}
        className="mb-12"
      />
      <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary text-center">{dictionary['CrystalBallPage.askTitle'] || "Ask the Crystal Ball"}</CardTitle>
          <CardDescription className="text-center font-body">
            {dictionary['CrystalBallPage.askDescription'] || "Focus your mind, type your question below, and unveil the ball's cryptic wisdom."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Textarea
              id="crystal-ball-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={dictionary['CrystalBallPage.questionPlaceholder'] || "Type your question here..."}
              className="min-h-[100px] font-body"
              aria-label={dictionary['CrystalBallPage.questionLabel'] || "Your question for the crystal ball"}
            />
          </div>
          <Button onClick={handleConsultCrystalBall} disabled={isLoading} className="w-full font-body">
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                {dictionary['CrystalBallPage.consultingButton'] || "Consulting the Mists..."}
              </>
            ) : (
              dictionary['CrystalBallPage.consultButton'] || "Consult the Crystal Ball"
            )}
          </Button>

          {error && <p className="text-destructive text-center font-body">{error}</p>}

          {answer && !isLoading && (
            <Card className="mt-6 bg-secondary/30 p-6 rounded-lg shadow">
              <CardHeader className="p-0 pb-2 text-center">
                <CardTitle className="font-headline text-xl text-accent-foreground">{dictionary['CrystalBallPage.answerTitle'] || "The Crystal Ball Reveals..."}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="font-body text-center italic leading-relaxed text-card-foreground">{answer}</p>
                <Button onClick={handleShare} variant="outline" size="sm" className="mt-4 w-full font-body">
                  <Share2 className="mr-2 h-4 w-4" />
                  {dictionary['Share.buttonLabelRevelation'] || "Share Revelation"}
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function CrystalBallPage({ params: paramsPromise }: CrystalBallPageProps) {
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

  return <CrystalBallContent dictionary={dictionary} locale={params.locale} />;
}
