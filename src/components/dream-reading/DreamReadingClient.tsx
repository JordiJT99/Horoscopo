
"use client"; // This component is definitely client-side

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Share2, RotateCcw, Sparkles, Smile, User, MapPin, Hash, PackageSearch } from 'lucide-react';
import { dreamInterpretationFlow, type DreamInterpretationInput, type DreamInterpretationOutput } from '@/ai/flows/dream-interpretation-flow';
import { useToast } from "@/hooks/use-toast";
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface DreamElements {
  symbols: string[];
  emotions: string[];
  characters: string[];
  locations: string[];
  themes: string[];
}

interface DreamReadingClientProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function DreamReadingClient({ dictionary, locale }: DreamReadingClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [dreamDescription, setDreamDescription] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [dreamElements, setDreamElements] = useState<DreamElements | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isShowingSharedContent, setIsShowingSharedContent] = useState(false);
  const { toast } = useToast();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; // Only run on client after mount

    const sharedInterpretation = searchParams.get('interpretation');
    if (sharedInterpretation) {
      try {
        const decodedInterpretation = decodeURIComponent(sharedInterpretation);
        setInterpretation(decodedInterpretation);
        setDreamElements(null); // Shared links currently don't carry dream elements
        setIsShowingSharedContent(true);
        setDreamDescription('');
      } catch (e) {
        console.error("Error decoding shared interpretation:", e);
        setError(dictionary['DreamReadingPage.errorDecoding'] || "Could not display the shared interpretation. It might be corrupted.");
      }
    }
  }, [searchParams, dictionary, isClient]); // Added isClient dependency

  const handleInterpretDream = async () => {
    if (!dreamDescription.trim()) {
      setError(dictionary['DreamReadingPage.enterDreamPrompt'] || "Please describe your dream for interpretation.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setInterpretation(null);
    setDreamElements(null);
    setIsShowingSharedContent(false);
    try {
      const input: DreamInterpretationInput = { dreamDescription, locale };
      const result: DreamInterpretationOutput = await dreamInterpretationFlow(input);
      setInterpretation(result.interpretation);
      setDreamElements(result.dreamElements);
    } catch (err) {
      console.error("Error interpreting dream:", err);
      setError(dictionary['DreamReadingPage.errorFetching'] || "The dreamscape is hazy... Could not get an interpretation. Please try again.");
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['DreamReadingPage.errorFetching'] || "The dreamscape is hazy... Could not get an interpretation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!interpretation) return;

    const shareTitle = dictionary['Share.dreamInterpretationTitle'] || "A Dream Interpretation from AstroVibes";
    const inviteMessage = dictionary['Share.dreamInterpretationInviteTextLink'] || "I had my dream interpreted on AstroVibes! See the interpretation here:";

    const pageUrl = new URL(window.location.href);
    pageUrl.searchParams.delete('dreamElements');
    pageUrl.searchParams.set('interpretation', encodeURIComponent(interpretation));
    const shareableUrl = pageUrl.toString();

    if (shareableUrl.length > 2000) {
        toast({
            title: dictionary['Share.errorTitle'] || "Sharing Error",
            description: dictionary['Share.urlTooLong'] || "The interpretation is too long to be shared as a link. Try sharing the text directly.",
            variant: "destructive",
        });
        if (navigator.share) {
            try {
                await navigator.share({ title: shareTitle, text: `${inviteMessage}\\n\\n"${interpretation}"`, url: window.location.pathname.split('?')[0] });
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
          description: dictionary['Share.successLinkMessage'] || "Link to the interpretation shared successfully.",
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
      const textToCopy = `${inviteMessage}\\n${shareableUrl}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: dictionary['Share.copiedTitle'] || "Copied!",
          description: dictionary['Share.copiedLinkMessage'] || "A link to the interpretation has been copied to your clipboard.",
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

  const handleNewInterpretation = () => {
    const newPath = `/${locale}/dream-reading`;
     if (typeof router.push === 'function') {
       router.push(newPath);
    } else {
       window.location.href = newPath;
    }
    setInterpretation(null);
    setDreamElements(null);
    setDreamDescription('');
    setError(null);
    setIsShowingSharedContent(false);
  };

  const renderDreamElements = (elements: DreamElements) => {
    const elementCategories = [
      { titleKey: 'DreamReadingPage.mapSymbols', items: elements.symbols, icon: Sparkles },
      { titleKey: 'DreamReadingPage.mapEmotions', items: elements.emotions, icon: Smile },
      { titleKey: 'DreamReadingPage.mapCharacters', items: elements.characters, icon: User },
      { titleKey: 'DreamReadingPage.mapLocations', items: elements.locations, icon: MapPin },
      { titleKey: 'DreamReadingPage.mapThemes', items: elements.themes, icon: Hash },
    ];

    const hasAnyElements = elementCategories.some(cat => cat.items && cat.items.length > 0);
    if (!hasAnyElements) return null;

    return (
      <Card className="mt-6 bg-secondary/20 p-4 sm:p-6 rounded-lg shadow">
        <CardHeader className="p-0 pb-4 text-center">
          <CardTitle className="font-headline text-lg md:text-xl text-primary flex items-center justify-center gap-2">
            <PackageSearch className="w-5 h-5 md:w-6 md:h-6" /> {dictionary['DreamReadingPage.dreamMapTitle'] || "Dream Map"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3 md:space-y-4">
          {elementCategories.map((category, index) => (
            category.items && category.items.length > 0 && (
              <div key={index}>
                <h4 className="font-headline text-sm md:text-md font-semibold text-accent-foreground mb-2 flex items-center gap-2">
                  <category.icon className="w-4 h-4 md:w-5 md:h-5" /> {dictionary[category.titleKey] || category.titleKey.split('.').pop()}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, itemIndex) => (
                    <Badge key={itemIndex} variant="secondary" className="text-xs md:text-sm font-body">{item}</Badge>
                  ))}
                </div>
              </div>
            )
          ))}
        </CardContent>
      </Card>
    );
  };

  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="text-center">
        <LoadingSpinner className="h-12 w-12 text-primary" />
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto shadow-xl">
      <CardHeader className="px-4 py-4 md:px-6 md:py-5">
        <CardTitle className="font-headline text-xl md:text-2xl text-primary text-center">
          {isShowingSharedContent
            ? (dictionary['DreamReadingPage.sharedInterpretationTitle'] || "A Shared Dream Interpretation")
            : (dictionary['DreamReadingPage.describeTitle'] || "Describe Your Dream")}
        </CardTitle>
        {!isShowingSharedContent && (
          <CardDescription className="text-center font-body text-sm md:text-base">
            {dictionary['DreamReadingPage.describeDescription'] || "Detail the key events, emotions, and symbols you remember. The more detail, the richer the insight."}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6 px-4 pb-4 md:px-6 md:pb-6">
        {!isShowingSharedContent && (
          <>
            <div>
              <Textarea
                id="dream-description"
                value={dreamDescription}
                onChange={(e) => setDreamDescription(e.target.value)}
                placeholder={dictionary['DreamReadingPage.dreamPlaceholder'] || "Describe your dream here..."}
                className="min-h-[150px] font-body"
                aria-label={dictionary['DreamReadingPage.dreamLabel'] || "Your dream description"}
              />
            </div>
            <Button onClick={handleInterpretDream} disabled={isLoading} className="w-full font-body text-sm md:text-base">
              {isLoading ? (
                <>
                  <Brain className="mr-2 h-4 w-4 animate-pulse" />
                  {dictionary['DreamReadingPage.interpretingButton'] || "Interpreting Dreamscape..."}
                </>
              ) : (
                dictionary['DreamReadingPage.interpretButton'] || "Interpret Dream"
              )}
            </Button>
          </>
        )}

        {error && <p className="text-destructive text-center font-body text-sm md:text-base">{error}</p>}

        {interpretation && !isLoading && (
          <Card className="mt-6 bg-secondary/30 p-4 md:p-6 rounded-lg shadow">
            <CardHeader className="p-0 pb-2 md:pb-3 text-center">
              <CardTitle className="font-headline text-lg md:text-xl text-primary">
              {isShowingSharedContent
                ? (dictionary['DreamReadingPage.sharedInterpretationTitle'] || "A Shared Dream Interpretation")
                : (dictionary['DreamReadingPage.interpretationTitle'] || "Dream Interpretation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="font-body text-card-foreground leading-relaxed space-y-2 md:space-y-3 text-sm md:text-base">
                {interpretation.split('\\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
              <Button onClick={handleShare} variant="outline" size="sm" className="mt-4 w-full font-body text-xs md:text-sm">
                <Share2 className="mr-2 h-4 w-4" />
                {dictionary['Share.buttonLabelInterpretationLinkContent'] || "Share This Interpretation"}
              </Button>
            </CardContent>
          </Card>
        )}
        {dreamElements && !isLoading && !isShowingSharedContent && renderDreamElements(dreamElements)}

          {isShowingSharedContent && (
          <Button onClick={handleNewInterpretation} variant="ghost" className="w-full font-body mt-4 text-xs md:text-sm">
            <RotateCcw className="mr-2 h-4 w-4" />
            {dictionary['DreamReadingPage.newInterpretationButton'] || "Get a New Interpretation"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
