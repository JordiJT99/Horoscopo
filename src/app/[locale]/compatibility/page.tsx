
"use client"; 

import { useState, useEffect, use, useMemo } from 'react';
import type { ZodiacSignName, CompatibilityData } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries'; 
import { ZODIAC_SIGNS, getCompatibility } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Users, Heart as HeartLucide, Loader2 } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';

interface CompatibilityPageProps {
  params: { 
    locale: Locale;
  };
}

// SVG Heart component for animation
const AnimatedHeart = ({ filled, className }: { filled: boolean, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-6 h-6 sm:w-7 sm:h-7 transition-all duration-300 ${className} ${
      filled ? 'fill-primary text-primary animate-pulseHeart' : 'fill-muted-foreground/20 text-muted-foreground/40'
    }`}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);


function CompatibilityContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const [sign1, setSign1] = useState<ZodiacSignName>(ZODIAC_SIGNS[0].name);
  const [sign2, setSign2] = useState<ZodiacSignName>(ZODIAC_SIGNS[1].name);
  const [compatibility, setCompatibility] = useState<CompatibilityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); 

  const handleFetchCompatibility = () => { 
    if (!sign1 || !sign2) return;
    setIsLoading(true);
    setCompatibility(null); 

    setTimeout(() => {
      try {
        const result = getCompatibility(sign1, sign2, locale); 
        setCompatibility(result);
      } catch (error) {
        console.error("Error fetching compatibility (mock data):", error);
        toast({
          title: dictionary['Error.genericTitle'] || "Error",
          description: dictionary['HoroscopeSection.error'] || "Could not load compatibility data.",
          variant: "destructive",
        });
        setCompatibility({ 
          sign1,
          sign2,
          report: dictionary['HoroscopeSection.error'] || "Could not load compatibility data. Please try again.",
          score: 0,
        });
      } finally {
        setIsLoading(false);
      }
    }, 300); 
  };
  
  useEffect(() => {
    handleFetchCompatibility();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sign1, sign2, locale]);


  const renderStars = (score: number) => {
    return Array(5).fill(null).map((_, i) => (
      <AnimatedHeart key={i} filled={i < score} />
    ));
  };

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12 bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-950 min-h-screen">
      <SectionTitle 
        title={dictionary['CompatibilityPage.title'] || "Zodiac Compatibility"}
        subtitle={dictionary['CompatibilityPage.subtitle'] || "Discover how well different zodiac signs match."}
        icon={HeartLucide} 
        className="mb-10 sm:mb-12 font-headline text-foreground"
      />
      <Card className="w-full shadow-2xl max-w-2xl mx-auto rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20">
        <CardHeader className="text-center p-6 sm:p-8">
          <CardTitle className="font-headline text-3xl sm:text-4xl flex items-center justify-center gap-2 sm:gap-3 text-primary">
            <Users className="w-8 h-8 sm:w-10 sm:h-10" /> {dictionary['CompatibilitySection.title'] || "Compatibility Check"}
          </CardTitle>
          <CardDescription className="font-body text-foreground/80 mt-2 text-sm sm:text-base">
            {dictionary['CompatibilitySection.description'] || "Select two signs to see their compatibility report."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <label htmlFor="sign1-select" className="block text-sm font-medium text-foreground/70 mb-1.5 font-body">{dictionary['CompatibilitySection.selectFirstSign'] || "Select First Sign"}</label>
              <Select value={sign1} onValueChange={(val) => setSign1(val as ZodiacSignName)}>
                <SelectTrigger id="sign1-select" className="font-body rounded-xl bg-white/5 border-white/10 hover:border-white/30 focus:ring-primary focus:ring-2 text-foreground h-12 text-base">
                  <SelectValue placeholder={dictionary['CompatibilitySection.selectSignPlaceholder'] || "Select Sign"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-purple-800/90 backdrop-blur-md border-white/20 text-foreground font-body">
                  {ZODIAC_SIGNS.map((sign) => (
                    <SelectItem key={sign.name} value={sign.name} className="hover:bg-primary/20 focus:bg-primary/30 py-2.5 text-base">
                      <div className="flex items-center">
                        <ZodiacSignIcon signName={sign.name} className="w-5 h-5 mr-2.5" />
                        {dictionary[sign.name] || sign.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="sign2-select" className="block text-sm font-medium text-foreground/70 mb-1.5 font-body">{dictionary['CompatibilitySection.selectSecondSign'] || "Select Second Sign"}</label>
              <Select value={sign2} onValueChange={(val) => setSign2(val as ZodiacSignName)}>
                <SelectTrigger id="sign2-select" className="font-body rounded-xl bg-white/5 border-white/10 hover:border-white/30 focus:ring-primary focus:ring-2 text-foreground h-12 text-base">
                  <SelectValue placeholder={dictionary['CompatibilitySection.selectSignPlaceholder'] || "Select Sign"} />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-purple-800/90 backdrop-blur-md border-white/20 text-foreground font-body">
                  {ZODIAC_SIGNS.map((sign) => (
                    <SelectItem key={sign.name} value={sign.name} disabled={sign.name === sign1} className="hover:bg-primary/20 focus:bg-primary/30 py-2.5 text-base">
                       <div className="flex items-center">
                        <ZodiacSignIcon signName={sign.name} className="w-5 h-5 mr-2.5" />
                        {dictionary[sign.name] || sign.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading && (
              <div className="text-center p-8 min-h-[200px] flex flex-col justify-center items-center">
                  <Loader2 className="h-12 w-12 sm:h-14 sm:h-14 text-primary animate-spin" />
                  <p className="mt-4 font-body text-foreground/70 text-sm sm:text-base">{dictionary['CompatibilitySection.checkingCosmicConnection'] || "Checking cosmic connection..."}</p>
              </div>
          )}

          {!isLoading && compatibility && (
            <div className="mt-6 p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg text-center border border-white/10 min-h-[200px]">
              <div className="flex justify-center items-center gap-4 mb-4">
                <ZodiacSignIcon signName={compatibility.sign1} className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                <HeartLucide className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <ZodiacSignIcon signName={compatibility.sign2} className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-headline font-semibold text-primary">
                {(dictionary['CompatibilitySection.reportTitle'] || "{sign1} & {sign2}")
                  .replace('{sign1}', dictionary[compatibility.sign1] || compatibility.sign1)
                  .replace('{sign2}', dictionary[compatibility.sign2] || compatibility.sign2)}
              </h3>
              {compatibility.score > 0 && (
                <div className="flex justify-center my-3 sm:my-4">
                    {renderStars(compatibility.score)}
                </div>
              )}
              <p className="font-body text-foreground/90 leading-relaxed whitespace-pre-line text-sm sm:text-base">{compatibility.report}</p>
            </div>
          )}
          {!isLoading && !compatibility && sign1 && sign2 && (
            <p className="text-center font-body text-foreground/70 mt-6 min-h-[200px] flex items-center justify-center">{dictionary['CompatibilitySection.selectSignsPrompt'] || "Select two signs to view their compatibility report."}</p>
          )}
          <Button 
            onClick={handleFetchCompatibility} 
            className="w-full mt-8 font-body bg-primary hover:bg-primary/80 text-primary-foreground rounded-xl py-3 text-base sm:text-lg shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (dictionary['CompatibilitySection.loading'] || "Loading...") : (dictionary['CompatibilitySection.refreshReportButton'] || "Refresh Report")}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}


export default function CompatibilityPage({ params: paramsPromise }: CompatibilityPageProps) {
  const params = use(paramsPromise);
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center bg-gradient-to-br from-purple-700 via-purple-900 to-indigo-950 min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        <p className="mt-4 font-body text-foreground/80">Loading dictionary...</p>
      </div>
    );
  }

  return <CompatibilityContent dictionary={dictionary} locale={params.locale} />;
}

