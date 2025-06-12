
"use client";

import { useState, use, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Eye, Sparkles, Share2, RotateCcw } from 'lucide-react';
import { crystalBallFlow, type CrystalBallInput, type CrystalBallOutput } from '@/ai/flows/crystal-ball-flow';
import { useToast } from "@/hooks/use-toast";

interface CrystalBallPageProps {
  params: { locale: Locale };
}

function CrystalBallContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShowingSharedContent, setIsShowingSharedContent] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const sharedAnswer = searchParams.get('answer');
    if (sharedAnswer) {
      try {
        const decodedAnswer = decodeURIComponent(sharedAnswer);
        setAnswer(decodedAnswer);
        setIsShowingSharedContent(true);
        setQuestion(''); // Clear question if showing shared content
      } catch (e) {
        console.error("Error decoding shared answer:", e);
        setError(dictionary['CrystalBallPage.errorDecoding'] || "Could not display the shared revelation. It might be corrupted.");
      }
    }
  }, [searchParams, dictionary]);

  const handleConsultCrystalBall = async () => {
    if (!question.trim()) {
      setError(dictionary['CrystalBallPage.enterQuestionPrompt'] || "Please enter a question for the crystal ball.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnswer(null);
    setIsShowingSharedContent(false);
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
    const inviteMessage = dictionary['Share.crystalBallInviteText'] || "I received a revelation from the Crystal Ball on AstroVibes! Check it out:";
    
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.set('answer', encodeURIComponent(answer));
    const shareableUrl = pageUrl.toString();

    if (shareableUrl.length > 2000) {
      toast({
        title: dictionary['Share.errorTitle'] || "Sharing Error",
        description: dictionary['Share.urlTooLong'] || "The revelation is too long to be shared as a link. Try sharing the text directly.",
        variant: "destructive",
      });
       // Fallback to sharing just the text if URL is too long
        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: `${inviteMessage}\n\n"${answer}"`, url: window.location.pathname });
            } catch (err) { /* handled below */ }
        }
        return;
    }


    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: inviteMessage,
          url: shareableUrl,
        });
        toast({
          title: dictionary['Share.successTitle'] || "Success!",
          description: dictionary['Share.successLinkMessage'] || "Link to the revelation shared successfully.",
        });
      } catch (err) {
        console.error('Error sharing:', err);
        if ((err as Error).name !== 'AbortError') {
          toast({
            title: dictionary['Share.errorTitle'] || "Sharing Error",
            description: dictionary['Share.errorMessage'] || "Could not share the content. Please try again.",
            variant: "destructive",
          });
        }
      }
    } else {
      const textToCopy = `${inviteMessage}\n${shareableUrl}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: dictionary['Share.copiedTitle'] || "Copied!",
          description: dictionary['Share.copiedLinkMessage'] || "A link to the revelation has been copied to your clipboard.",
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

  const handleNewQuery = () => {
    router.push(`/${locale}/crystal-ball`, { scroll: false }); // Navigates without search params
    setAnswer(null);
    setQuestion('');
    setError(null);
    setIsShowingSharedContent(false);
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
          <CardTitle className="font-headline text-2xl text-primary text-center">
            {isShowingSharedContent 
              ? (dictionary['CrystalBallPage.sharedRevelationTitle'] || "A Shared Revelation") 
              : (dictionary['CrystalBallPage.askTitle'] || "Ask the Crystal Ball")}
          </CardTitle>
          {!isShowingSharedContent && (
            <CardDescription className="text-center font-body">
              {dictionary['CrystalBallPage.askDescription'] || "Focus your mind, type your question below, and unveil the ball's cryptic wisdom."}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {!isShowingSharedContent && (
            <>
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
            </>
          )}

          {error && <p className="text-destructive text-center font-body">{error}</p>}

          {answer && !isLoading && (
            <Card className="mt-6 bg-secondary/30 p-6 rounded-lg shadow">
              <CardHeader className="p-0 pb-2 text-center">
                <CardTitle className="font-headline text-xl text-accent-foreground">
                  {isShowingSharedContent 
                    ? (dictionary['CrystalBallPage.sharedRevelationTitle'] || "A Shared Revelation")
                    : (dictionary['CrystalBallPage.answerTitle'] || "The Crystal Ball Reveals...")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="font-body text-center italic leading-relaxed text-card-foreground">{answer}</p>
                <Button onClick={handleShare} variant="outline" size="sm" className="mt-4 w-full font-body">
                  <Share2 className="mr-2 h-4 w-4" />
                  {dictionary['Share.buttonLabelRevelationLinkContent'] || "Share This Revelation"}
                </Button>
              </CardContent>
            </Card>
          )}
          {isShowingSharedContent && (
            <Button onClick={handleNewQuery} variant="ghost" className="w-full font-body mt-4">
              <RotateCcw className="mr-2 h-4 w-4" />
              {dictionary['CrystalBallPage.newQueryButton'] || "Ask a New Question"}
            </Button>
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

  // Ensure the component is client-side only for searchParams to be available
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

  return <CrystalBallContent dictionary={dictionary} locale={params.locale} />;
}


    