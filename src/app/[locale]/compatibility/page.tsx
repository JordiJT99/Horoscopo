
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

// Removed AnimatedHeart SVG component

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
    // Reverted to HeartLucide
    return Array(5).fill(null).map((_, i) => (
      <HeartLucide key={i} className={`w-5 h-5 sm:w-6 sm:h-6 ${i < score ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
    ));
  };

  return (
    // Reverted main background to default (no gradient)
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle 
        title={dictionary['CompatibilityPage.title'] || "Zodiac Compatibility"}
        subtitle={dictionary['CompatibilityPage.subtitle'] || "Discover how well different zodiac signs match."}
        icon={HeartLucide} 
        className="mb-10 sm:mb-12" // Removed specific text/font classes
      />
      {/* Reverted Card styling */}
      <Card className="w-full shadow-xl max-w-2xl mx-auto rounded-lg"> {/* Reverted rounded-3xl */}
        <CardHeader className="text-center p-6 sm:p-8">
          <CardTitle className="text-3xl sm:text-4xl flex items-center justify-center gap-2 sm:gap-3"> {/* Removed text-primary, font-headline */}
            <Users className="w-8 h-8 sm:w-10 sm:h-10" /> {dictionary['CompatibilitySection.title'] || "Compatibility Check"}
          </CardTitle>
          <CardDescription className="mt-2 text-sm sm:text-base"> {/* Removed text-foreground/80, font-body */}
            {dictionary['CompatibilitySection.description'] || "Select two signs to see their compatibility report."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div>
              <label htmlFor="sign1-select" className="block text-sm font-medium text-muted-foreground mb-1.5">{dictionary['CompatibilitySection.selectFirstSign'] || "Select First Sign"}</label>
              {/* Reverted Select styling */}
              <Select value={sign1} onValueChange={(val) => setSign1(val as ZodiacSignName)}>
                <SelectTrigger id="sign1-select" className="h-12 text-base">
                  <SelectValue placeholder={dictionary['CompatibilitySection.selectSignPlaceholder'] || "Select Sign"} />
                </SelectTrigger>
                <SelectContent>
                  {ZODIAC_SIGNS.map((sign) => (
                    <SelectItem key={sign.name} value={sign.name} className="py-2.5 text-base">
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
              <label htmlFor="sign2-select" className="block text-sm font-medium text-muted-foreground mb-1.5">{dictionary['CompatibilitySection.selectSecondSign'] || "Select Second Sign"}</label>
              <Select value={sign2} onValueChange={(val) => setSign2(val as ZodiacSignName)}>
                <SelectTrigger id="sign2-select" className="h-12 text-base">
                  <SelectValue placeholder={dictionary['CompatibilitySection.selectSignPlaceholder'] || "Select Sign"} />
                </SelectTrigger>
                <SelectContent>
                  {ZODIAC_SIGNS.map((sign) => (
                    <SelectItem key={sign.name} value={sign.name} disabled={sign.name === sign1} className="py-2.5 text-base">
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
                  <p className="mt-4 text-muted-foreground text-sm sm:text-base">{dictionary['CompatibilitySection.checkingCosmicConnection'] || "Checking cosmic connection..."}</p>
              </div>
          )}

          {!isLoading && compatibility && (
            // Reverted result card styling
            <div className="mt-6 p-4 sm:p-6 bg-secondary/30 rounded-lg shadow-md text-center min-h-[200px]"> 
              <div className="flex justify-center items-center gap-4 mb-4">
                <ZodiacSignIcon signName={compatibility.sign1} className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
                <HeartLucide className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                <ZodiacSignIcon signName={compatibility.sign2} className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-primary"> {/* Removed font-headline */}
                {(dictionary['CompatibilitySection.reportTitle'] || "{sign1} & {sign2}")
                  .replace('{sign1}', dictionary[compatibility.sign1] || compatibility.sign1)
                  .replace('{sign2}', dictionary[compatibility.sign2] || compatibility.sign2)}
              </h3>
              {compatibility.score > 0 && (
                <div className="flex justify-center my-3 sm:my-4">
                    {renderStars(compatibility.score)}
                </div>
              )}
              <p className="leading-relaxed whitespace-pre-line text-sm sm:text-base">{compatibility.report}</p> {/* Removed font-body, text-foreground/90 */}
            </div>
          )}
          {!isLoading && !compatibility && sign1 && sign2 && (
            <p className="text-center text-muted-foreground mt-6 min-h-[200px] flex items-center justify-center">{dictionary['CompatibilitySection.selectSignsPrompt'] || "Select two signs to view their compatibility report."}</p>
          )}
          <Button 
            onClick={handleFetchCompatibility} 
            // Reverted button styling
            className="w-full mt-8 py-3 text-base sm:text-lg"
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
      // Reverted main background
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        <p className="mt-4">Loading dictionary...</p> {/* Removed font-body, text-foreground/80 */}
      </div>
    );
  }

  return <CompatibilityContent dictionary={dictionary} locale={params.locale} />;
}
