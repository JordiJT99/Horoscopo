
"use client";

import { useState, use, useMemo } from 'react';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BedDouble, Brain, Share2 } from 'lucide-react';
import { dreamInterpretationFlow, type DreamInterpretationInput, type DreamInterpretationOutput } from '@/ai/flows/dream-interpretation-flow';
import { useToast } from "@/hooks/use-toast";

interface DreamReadingPageProps {
  params: { locale: Locale };
}

function DreamReadingContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const [dreamDescription, setDreamDescription] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleInterpretDream = async () => {
    if (!dreamDescription.trim()) {
      setError(dictionary['DreamReadingPage.enterDreamPrompt'] || "Please describe your dream for interpretation.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setInterpretation(null);
    try {
      const input: DreamInterpretationInput = { dreamDescription, locale };
      const result: DreamInterpretationOutput = await dreamInterpretationFlow(input);
      setInterpretation(result.interpretation);
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
    const inviteMessage = dictionary['Share.dreamInterpretationInviteText'] || "I had my dream interpreted on AstroVibes! See what it means:";
    const pageUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: inviteMessage, // Generic invite text
          url: pageUrl,
        });
        toast({
          title: dictionary['Share.successTitle'] || "Success!",
          description: dictionary['Share.successMessage'] || "Content shared successfully.",
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
      // Fallback: copy invite message and URL to clipboard
      const textToCopy = `${inviteMessage}\n${pageUrl}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: dictionary['Share.copiedTitle'] || "Copied!",
          description: dictionary['Share.copiedLinkMessage'] || "An invitation link has been copied to your clipboard.",
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
        title={dictionary['DreamReadingPage.title'] || "Dream Reading"}
        subtitle={dictionary['DreamReadingPage.subtitle'] || "Uncover the hidden meanings and symbols within your dreams."}
        icon={BedDouble}
        className="mb-12"
      />
      <Card className="w-full max-w-xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary text-center">{dictionary['DreamReadingPage.describeTitle'] || "Describe Your Dream"}</CardTitle>
          <CardDescription className="text-center font-body">
            {dictionary['DreamReadingPage.describeDescription'] || "Detail the key events, emotions, and symbols you remember. The more detail, the richer the insight."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          {error && <p className="text-destructive text-center font-body">{error}</p>}

          {interpretation && !isLoading && (
            <Card className="mt-6 bg-secondary/30 p-6 rounded-lg shadow">
              <CardHeader className="p-0 pb-2 text-center">
                <CardTitle className="font-headline text-xl text-accent-foreground">{dictionary['DreamReadingPage.interpretationTitle'] || "Dream Interpretation"}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="font-body text-card-foreground leading-relaxed space-y-3">
                  {interpretation.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <Button onClick={handleShare} variant="outline" size="sm" className="mt-4 w-full font-body">
                  <Share2 className="mr-2 h-4 w-4" />
                  {dictionary['Share.buttonLabelInterpretationLink'] || "Share Link to Interpretation"}
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

export default function DreamReadingPage({ params: paramsPromise }: DreamReadingPageProps) {
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

  return <DreamReadingContent dictionary={dictionary} locale={params.locale} />;
}
