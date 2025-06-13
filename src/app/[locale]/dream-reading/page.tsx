
// REMOVED "use client"; from the top of the file to make DreamReadingPage a Server Component

import { useState, useEffect, useMemo } from 'react'; // Keep for DreamReadingContent
// `use` hook from react is not needed here if we await promises
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BedDouble, Brain, Share2, RotateCcw, Sparkles, Smile, User, MapPin, Hash, PackageSearch } from 'lucide-react';
import { dreamInterpretationFlow, type DreamInterpretationInput, type DreamInterpretationOutput } from '@/ai/flows/dream-interpretation-flow';
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from 'next/navigation'; // These are client hooks, will be used in DreamReadingContent

interface DreamReadingPageProps {
  params: Promise<{ // Assuming params is a promise passed to the page
    locale: Locale;
  }>;
}

interface DreamElements {
  symbols: string[];
  emotions: string[];
  characters: string[];
  locations: string[];
  themes: string[];
}

function DreamReadingContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  "use client"; // This component is definitely client-side

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
                await navigator.share({ title: shareTitle, text: `${inviteMessage}\n\n"${interpretation}"`, url: window.location.pathname.split('?')[0] });
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
      const textToCopy = `${inviteMessage}\n${shareableUrl}`;
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
          <CardTitle className="font-headline text-xl text-primary flex items-center justify-center gap-2">
            <PackageSearch className="w-6 h-6" /> {dictionary['DreamReadingPage.dreamMapTitle'] || "Dream Map"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          {elementCategories.map((category, index) => (
            category.items && category.items.length > 0 && (
              <div key={index}>
                <h4 className="font-headline text-md font-semibold text-accent-foreground mb-2 flex items-center gap-2">
                  <category.icon className="w-5 h-5" /> {dictionary[category.titleKey] || category.titleKey.split('.').pop()}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, itemIndex) => (
                    <Badge key={itemIndex} variant="secondary" className="text-sm font-body">{item}</Badge>
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
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['DreamReadingPage.title'] || "Dream Reading"}
        subtitle={dictionary['DreamReadingPage.subtitle'] || "Uncover the hidden meanings and symbols within your dreams."}
        icon={BedDouble}
        className="mb-12"
      />
      <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary text-center">
            {isShowingSharedContent
              ? (dictionary['DreamReadingPage.sharedInterpretationTitle'] || "A Shared Dream Interpretation")
              : (dictionary['DreamReadingPage.describeTitle'] || "Describe Your Dream")}
          </CardTitle>
          {!isShowingSharedContent && (
            <CardDescription className="text-center font-body">
              {dictionary['DreamReadingPage.describeDescription'] || "Detail the key events, emotions, and symbols you remember. The more detail, the richer the insight."}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
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
              <Button onClick={handleInterpretDream} disabled={isLoading} className="w-full font-body">
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

          {error && <p className="text-destructive text-center font-body">{error}</p>}

          {interpretation && !isLoading && (
            <Card className="mt-6 bg-secondary/30 p-6 rounded-lg shadow">
              <CardHeader className="p-0 pb-2 text-center">
                <CardTitle className="font-headline text-xl text-primary">
                {isShowingSharedContent
                  ? (dictionary['DreamReadingPage.sharedInterpretationTitle'] || "A Shared Dream Interpretation")
                  : (dictionary['DreamReadingPage.interpretationTitle'] || "Dream Interpretation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="font-body text-card-foreground leading-relaxed space-y-3">
                  {interpretation.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <Button onClick={handleShare} variant="outline" size="sm" className="mt-4 w-full font-body">
                  <Share2 className="mr-2 h-4 w-4" />
                  {dictionary['Share.buttonLabelInterpretationLinkContent'] || "Share This Interpretation"}
                </Button>
              </CardContent>
            </Card>
          )}
          {dreamElements && !isLoading && !isShowingSharedContent && renderDreamElements(dreamElements)}

           {isShowingSharedContent && (
            <Button onClick={handleNewInterpretation} variant="ghost" className="w-full font-body mt-4">
              <RotateCcw className="mr-2 h-4 w-4" />
              {dictionary['DreamReadingPage.newInterpretationButton'] || "Get a New Interpretation"}
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

// Page component (default export) - now an async Server Component
export default async function DreamReadingPage({ params: paramsPromise }: DreamReadingPageProps) {
  const params = await paramsPromise; // Resolve the params promise
  const dictionary = await getDictionary(params.locale); // Resolve the dictionary promise

  // Pass resolved data to the client component
  return <DreamReadingContent dictionary={dictionary} locale={params.locale} />;
}
