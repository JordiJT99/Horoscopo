
"use client";

import { useState, use, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Wand, Sparkles, Loader2, Share2, RotateCcw } from 'lucide-react';
import { tarotReadingFlow, type TarotReadingInput, type TarotReadingOutput } from '@/ai/flows/tarot-reading-flow';
import { useToast } from "@/hooks/use-toast";
import Image from 'next/image';

interface TarotReadingPageProps {
  params: { locale: Locale };
}

function TarotReadingContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<TarotReadingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isShowingSharedContent, setIsShowingSharedContent] = useState(false);
  // State for shared content, to preserve it if user navigates away and back via history
  const [sharedCardName, setSharedCardName] = useState<string | null>(null);
  const [sharedCardMeaning, setSharedCardMeaning] = useState<string | null>(null);
  const [sharedAdvice, setSharedAdvice] = useState<string | null>(null);
  const [sharedImagePlaceholderUrl, setSharedImagePlaceholderUrl] = useState<string | null>(null);


  useEffect(() => {
    const cardNameParam = searchParams.get('cardName');
    const cardMeaningParam = searchParams.get('cardMeaning');
    const adviceParam = searchParams.get('advice');
    const imageParam = searchParams.get('image');

    if (cardNameParam && cardMeaningParam && adviceParam && imageParam) {
      try {
        const decodedName = decodeURIComponent(cardNameParam);
        const decodedMeaning = decodeURIComponent(cardMeaningParam);
        const decodedAdvice = decodeURIComponent(adviceParam);
        const decodedImage = decodeURIComponent(imageParam);

        setSharedCardName(decodedName);
        setSharedCardMeaning(decodedMeaning);
        setSharedAdvice(decodedAdvice);
        setSharedImagePlaceholderUrl(decodedImage);
        
        // Display this shared content as the current reading
        setReading({
            cardName: decodedName,
            cardMeaning: decodedMeaning,
            advice: decodedAdvice,
            imagePlaceholderUrl: decodedImage
        });
        setIsShowingSharedContent(true);
        setQuestion(''); // Clear question field when showing shared content
      } catch (e) {
        console.error("Error decoding shared tarot reading:", e);
        setError(dictionary['TarotReadingPage.errorDecoding'] || "Could not display the shared reading. It might be corrupted.");
      }
    }
  }, [searchParams, dictionary]);

  const handleDrawCard = async () => {
    if (!question.trim()) {
      setError(dictionary['TarotReadingPage.enterQuestionPrompt'] || "Please enter a question for your reading.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setReading(null);
    setIsShowingSharedContent(false); // Reset shared content flag
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

  const handleShare = async () => {
    if (!reading) return;

    const shareTitle = dictionary['Share.tarotReadingTitle'] || "A Tarot Reading from AstroVibes";
    const inviteMessage = dictionary['Share.tarotReadingInviteTextLink'] || "I received a Tarot reading on AstroVibes! See it here:";
    
    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.set('cardName', encodeURIComponent(reading.cardName));
    pageUrl.searchParams.set('cardMeaning', encodeURIComponent(reading.cardMeaning));
    pageUrl.searchParams.set('advice', encodeURIComponent(reading.advice));
    pageUrl.searchParams.set('image', encodeURIComponent(reading.imagePlaceholderUrl));
    const shareableUrl = pageUrl.toString();
    
    const fullShareText = `${shareTitle}\n\nCard: ${reading.cardName}\nMeaning: ${reading.cardMeaning}\nAdvice: ${reading.advice}`;

    if (shareableUrl.length > 2000) {
        toast({
            title: dictionary['Share.errorTitle'] || "Sharing Error",
            description: dictionary['Share.urlTooLongContent'] || "The reading is too long to be shared as a link with all content. Try sharing the text directly.",
            variant: "destructive",
        });
        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: `${inviteMessage}\n\n${fullShareText}`, url: window.location.pathname.split('?')[0] });
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
          description: dictionary['Share.successLinkMessage'] || "Link to the reading shared successfully.",
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
          description: dictionary['Share.copiedLinkMessage'] || "A link to the reading has been copied to your clipboard.",
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

  const handleNewReading = () => {
    const newPath = `/${locale}/tarot-reading`;
    if (typeof router.push === 'function') {
       router.push(newPath); 
    } else {
       window.location.href = newPath;
    }
    setReading(null);
    setQuestion('');
    setError(null);
    setIsShowingSharedContent(false);
    setSharedCardName(null);
    setSharedCardMeaning(null);
    setSharedAdvice(null);
    setSharedImagePlaceholderUrl(null);
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
            {isShowingSharedContent
              ? (dictionary['TarotReadingPage.sharedReadingTitle'] || "A Shared Tarot Reading")
              : (dictionary['TarotReadingPage.askTitle'] || "Ask Your Question")}
          </CardTitle>
          {!isShowingSharedContent && (
            <CardDescription className="text-center font-body">
              {dictionary['TarotReadingPage.askDescription'] || "Focus on your question and let the cards guide you. Draw one card for insight."}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {!isShowingSharedContent && (
            <>
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
            </>
          )}

          {error && <p className="text-destructive text-center font-body">{error}</p>}

          {reading && !isLoading && (
            <Card className="mt-6 bg-secondary/30 p-6 rounded-lg shadow">
              <CardHeader className="p-0 pb-4 text-center">
                 <CardTitle className="font-headline text-xl text-accent-foreground">
                    {isShowingSharedContent 
                        ? (dictionary['TarotReadingPage.sharedCardTitle']?.replace('{cardName}', reading.cardName) || reading.cardName)
                        : reading.cardName
                    }
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="flex justify-center mb-4">
                  <Image 
                    src={reading.imagePlaceholderUrl} 
                    alt={reading.cardName} 
                    width={134} 
                    height={235} 
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
                <Button onClick={handleShare} variant="outline" size="sm" className="mt-4 w-full font-body">
                  <Share2 className="mr-2 h-4 w-4" />
                  {dictionary['Share.buttonLabelTarotReadingLinkContent'] || "Share This Reading"}
                </Button>
              </CardContent>
            </Card>
          )}
          {isShowingSharedContent && (
            <Button onClick={handleNewReading} variant="ghost" className="w-full font-body mt-4">
              <RotateCcw className="mr-2 h-4 w-4" />
              {dictionary['TarotReadingPage.newReadingButton'] || "Get a New Reading"}
            </Button>
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


    