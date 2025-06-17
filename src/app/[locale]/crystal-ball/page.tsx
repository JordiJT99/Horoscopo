
"use client"; 

import { useState, use, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Eye, Sparkles, Share2, RotateCcw } from 'lucide-react';
import { crystalBallFlow, type CrystalBallInput, type CrystalBallOutput } from '@/ai/flows/crystal-ball-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image'; 

type PrecisionLevel = 'basic' | 'deep' | 'mystic';

interface CrystalBallPageProps {
  params: { locale: Locale };
}

function CrystalBallContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [question, setQuestion] = useState('');
  const [precisionLevel, setPrecisionLevel] = useState<PrecisionLevel>('basic');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShowingSharedContent, setIsShowingSharedContent] = useState(false);
  const { toast } = useToast();

  const crystalBallGifPath = "/gifs/crystal-ball.gif"; 

  const [isClientForContent, setIsClientForContent] = useState(false);
  useEffect(() => {
    setIsClientForContent(true);
  }, []);

  useEffect(() => {
    if (!isClientForContent) return; 

    const sharedAnswer = searchParams.get('answer');
    if (sharedAnswer) {
      try {
        const decodedAnswer = decodeURIComponent(sharedAnswer);
        setAnswer(decodedAnswer);
        setIsShowingSharedContent(true);
        setQuestion(''); 
      } catch (e) {
        console.error("Error decoding shared answer:", e);
        setError(dictionary['CrystalBallPage.errorDecoding'] || "Could not display the shared revelation. It might be corrupted.");
      }
    }
  }, [searchParams, dictionary, isClientForContent]);

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
      const input: CrystalBallInput = { question, locale, precisionLevel };
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
    const inviteMessage = dictionary['Share.crystalBallInviteTextLink'] || "I received a revelation from the Crystal Ball on AstroVibes! See it here:";
    
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.set('answer', encodeURIComponent(answer));
    const shareableUrl = pageUrl.toString();

    if (shareableUrl.length > 2000) {
      toast({
        title: dictionary['Share.errorTitle'] || "Sharing Error",
        description: dictionary['Share.urlTooLong'] || "The revelation is too long to be shared as a link. Try sharing the text directly.",
        variant: "destructive",
      });
        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: `${inviteMessage}\n\n"${answer}"`, url: window.location.pathname.split('?')[0] });
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
    const newPath = `/${locale}/crystal-ball`;
    if (typeof router.push === 'function') {
       router.push(newPath);
    } else {
       window.location.href = newPath;
    }
    setAnswer(null);
    setQuestion('');
    setError(null);
    setIsShowingSharedContent(false);
    setPrecisionLevel('basic');
  };

  if (!isClientForContent) {
    return (
        <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading Crystal Ball...</p>
        </div>
      );
  }
  if (Object.keys(dictionary).length === 0) { 
     return (
        <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading dictionary for Crystal Ball...</p>
        </div>
      );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['CrystalBallPage.title'] || "Crystal Ball"}
        subtitle={dictionary['CrystalBallPage.subtitle'] || "Peer into the mists and ask your question to the Crystal Ball."}
        icon={Eye}
        className="mb-12"
      />
      <Card className="w-full max-w-xl mx-auto shadow-xl bg-card/70 backdrop-blur-sm border border-white/20 flex flex-col">
        <CardHeader className="px-4 py-4 md:px-6 md:py-5">
          <CardTitle className="font-headline text-xl md:text-2xl text-primary text-center">
            {isShowingSharedContent 
              ? (dictionary['CrystalBallPage.sharedRevelationTitle'] || "A Shared Revelation") 
              : (dictionary['CrystalBallPage.askTitle'] || "Ask the Crystal Ball")}
          </CardTitle>
          {!isShowingSharedContent && (
            <CardDescription className="text-center font-body text-sm md:text-base">
              {dictionary['CrystalBallPage.askDescription'] || "Focus your mind, type your question below, and unveil the ball's cryptic wisdom."}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6 px-4 pb-4 md:px-6 md:pb-6 flex-grow">
          
          <div className="flex justify-center my-6 md:my-8">
            <div className="dynamic-orb-halo w-36 h-36 sm:w-44 sm:h-44"> 
              <div className="w-full h-full rounded-full overflow-hidden shadow-inner bg-background"> 
                <Image
                  src={crystalBallGifPath}
                  alt={dictionary['CrystalBallPage.title'] || "Crystal Ball"}
                  width={180} 
                  height={180} 
                  className="object-cover w-full h-full"
                  unoptimized={true} 
                  data-ai-hint="crystal ball animation"
                />
              </div>
            </div>
          </div>

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

              <div className="space-y-2">
                <Label className="font-body text-sm md:text-base text-muted-foreground">{dictionary['CrystalBallPage.precisionLevelLabel'] || "Select Precision Level:"}</Label>
                <p id="levelHint" className="sr-only">{dictionary['CrystalBallPage.precisionLevelHint'] || "Choose how detailed you want the crystal ball's answer to be."}</p>
                <RadioGroup
                  value={precisionLevel}
                  onValueChange={(value) => setPrecisionLevel(value as PrecisionLevel)}
                  className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                  aria-describedby="levelHint"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="basic" 
                      id="rb-basic" 
                      aria-label={dictionary['CrystalBallPage.precisionBasic.ariaLabel'] || "Basic precision level"}
                    />
                    <Label 
                      htmlFor="rb-basic" 
                      className="font-body text-sm md:text-base cursor-pointer hover:bg-muted/50 rounded-md p-2 transition-colors"
                    >
                      {dictionary['CrystalBallPage.precisionBasic'] || "Basic"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="deep" 
                      id="rb-deep" 
                      aria-label={dictionary['CrystalBallPage.precisionDeep.ariaLabel'] || "Deep precision level"}
                    />
                    <Label 
                      htmlFor="rb-deep" 
                      className="font-body text-sm md:text-base cursor-pointer hover:bg-muted/50 rounded-md p-2 transition-colors"
                    >
                      {dictionary['CrystalBallPage.precisionDeep'] || "Deep"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value="mystic" 
                      id="rb-mystic" 
                      aria-label={dictionary['CrystalBallPage.precisionMystic.ariaLabel'] || "Mystic precision level"}
                    />
                    <Label 
                      htmlFor="rb-mystic" 
                      className="font-body text-sm md:text-base cursor-pointer hover:bg-muted/50 rounded-md p-2 transition-colors"
                    >
                      {dictionary['CrystalBallPage.precisionMystic'] || "Mystic"}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {error && <p className="text-destructive text-center font-body text-sm md:text-base">{error}</p>}

          {answer && !isLoading && (
            <Card className="mt-6 bg-secondary/30 p-4 md:p-6 rounded-lg shadow">
              <CardHeader className="p-0 pb-2 md:pb-3 text-center">
                <CardTitle className="font-headline text-lg md:text-xl text-primary"> 
                  {isShowingSharedContent 
                    ? (dictionary['CrystalBallPage.sharedRevelationTitle'] || "A Shared Revelation")
                    : (dictionary['CrystalBallPage.answerTitle'] || "The Crystal Ball Reveals...")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="font-body text-center italic leading-relaxed text-card-foreground text-sm md:text-base">{answer}</p>
                <Button onClick={handleShare} variant="outline" size="sm" className="mt-4 w-full font-body text-xs md:text-sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  {dictionary['Share.buttonLabelRevelationLinkContent'] || "Share This Revelation"}
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
        {!isShowingSharedContent && (
          <CardFooter className="border-t border-border/20 pt-4 px-4 pb-4 md:px-6 md:pb-6">
            <Button onClick={handleConsultCrystalBall} disabled={isLoading} className="w-full font-body text-sm md:text-base">
              {isLoading ? (
                <>
                  <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                  {dictionary['CrystalBallPage.consultingButton'] || "Consulting the Mists..."}
                </>
              ) : (
                dictionary['CrystalBallPage.consultButton'] || "Consult the Crystal Ball"
              )}
            </Button>
          </CardFooter>
        )}
        {isShowingSharedContent && (
           <CardFooter className="border-t border-border/20 pt-4 px-4 pb-4 md:px-6 md:pb-6">
            <Button onClick={handleNewQuery} variant="ghost" className="w-full font-body text-xs md:text-sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              {dictionary['CrystalBallPage.newQueryButton'] || "Ask a New Question"}
            </Button>
          </CardFooter>
        )}
      </Card>
    </main>
  );
}

export default function CrystalBallPage({ params: paramsPromise }: CrystalBallPageProps) {
  const params = use(paramsPromise); 
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

  return <CrystalBallContent dictionary={dictionary} locale={params.locale} />;
}

