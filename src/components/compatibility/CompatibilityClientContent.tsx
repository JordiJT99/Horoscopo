
"use client";

import { useState, useEffect, Suspense } from 'react';
import type { ZodiacSignName, CompatibilityData } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { ZODIAC_SIGNS, getCompatibility } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
// SectionTitle es ahora manejado por la página servidora
import { Users, Heart as HeartLucide, Loader2, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
// RadioGroup y Label para seleccionar tipo ya no son necesarios aquí
import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from 'next/navigation'; // Para leer type de searchParams si es necesario

const AnimatedHeart = ({ filled, animated }: { filled: boolean, animated?: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={cn(
      "w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300",
      filled ? "text-destructive" : "text-muted-foreground",
      filled && animated && "animate-pulseHeart"
    )}
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export type CompatibilityType = 'love' | 'friendship' | 'work';

interface CompatibilityClientContentProps {
  dictionary: Dictionary;
  locale: Locale;
  compatibilityTypeFromPage: CompatibilityType; // Tipo de compatibilidad recibido de la página
}

function CompatibilityClientContentInternal({ dictionary, locale, compatibilityTypeFromPage }: CompatibilityClientContentProps) {
  const [sign1, setSign1] = useState<ZodiacSignName>(ZODIAC_SIGNS[0].name);
  const [sign2, setSign2] = useState<ZodiacSignName>(ZODIAC_SIGNS[1].name);
  const [compatibility, setCompatibility] = useState<CompatibilityData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchCompatibility = () => {
    if (!sign1 || !sign2) {
      toast({
        title: dictionary['Error.genericTitle'] || "Error",
        description: dictionary['CompatibilitySection.selectBothSignsError'] || "Please select both signs to check compatibility.",
        variant: "destructive",
      });
      return;
    }
    // El tipo de compatibilidad ya está fijado por compatibilityTypeFromPage

    setIsLoading(true);
    setCompatibility(null);

    setTimeout(() => {
      try {
        const result = getCompatibility(sign1, sign2, compatibilityTypeFromPage, locale);
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

  const renderStars = (score: number) => {
    return Array(5).fill(null).map((_, i) => (
      <AnimatedHeart key={i} filled={i < score} animated={i < score} />
    ));
  };

  if (Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }
  
  const typeSpecificTitleKey = `CompatibilitySection.reportTitle.${compatibilityTypeFromPage}`;
  const typeSpecificTitleDefault = `Compatibility Report: ${compatibilityTypeFromPage.charAt(0).toUpperCase() + compatibilityTypeFromPage.slice(1)}`;

  return (
    // El SectionTitle general ahora se maneja en la página servidora (calculator/page.tsx)
    <Card className="w-full shadow-xl max-w-2xl mx-auto rounded-lg">
      <CardHeader className="text-center p-6 sm:p-8">
        <CardTitle className="text-3xl sm:text-4xl font-headline flex items-center justify-center gap-2 sm:gap-3 text-primary">
          <Users className="w-8 h-8 sm:w-10 sm:h-10" /> {dictionary['CompatibilitySection.title'] || "Compatibility Check"}
        </CardTitle>
        <CardDescription className="mt-2 text-sm sm:text-base font-body text-muted-foreground">
          {dictionary['CompatibilitySection.descriptionSignSelection'] || "Select two signs to see their compatibility report for the chosen relationship type."}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div>
            <label htmlFor="sign1-select" className="block text-sm font-medium text-muted-foreground mb-1.5">{dictionary['CompatibilitySection.selectFirstSign'] || "Select First Sign"}</label>
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
        </div>

        {/* RadioGroup para seleccionar tipo de compatibilidad ELIMINADO */}

        <Button
          onClick={handleFetchCompatibility}
          disabled={isLoading || !sign1 || !sign2} // Ya no depende de selectedCompatibilityType
          className="w-full font-body text-base py-3 mb-6"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Search className="mr-2 h-5 w-5" />
          )}
          {isLoading ? (dictionary['CompatibilitySection.checkingButton'] || "Checking...") : (dictionary['CompatibilitySection.viewCompatibilityButton'] || "View Compatibility")}
        </Button>

        {isLoading && (
            <div className="text-center p-8 min-h-[200px] flex flex-col justify-center items-center">
                <Loader2 className="h-12 w-12 sm:h-14 sm:h-14 text-primary animate-spin" />
                <p className="mt-4 text-muted-foreground text-sm sm:text-base">{dictionary['CompatibilitySection.checkingCosmicConnection'] || "Checking cosmic connection..."}</p>
            </div>
        )}

        {!isLoading && compatibility && (
          <div className="mt-0 p-4 sm:p-6 bg-secondary/30 rounded-lg shadow-md text-center min-h-[200px]">
            <div className="flex justify-center items-center gap-4 mb-4">
              <ZodiacSignIcon signName={compatibility.sign1} className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
              <HeartLucide className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              <ZodiacSignIcon signName={compatibility.sign2} className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold font-headline text-primary">
              {(dictionary[typeSpecificTitleKey] || typeSpecificTitleDefault)
                .replace('{sign1}', dictionary[compatibility.sign1] || compatibility.sign1)
                .replace('{sign2}', dictionary[compatibility.sign2] || compatibility.sign2)}
            </h3>
             {/* Mostrar el tipo de compatibilidad actual */}
            <p className="text-sm text-muted-foreground mb-2">
              ({dictionary[`CompatibilitySection.type.${compatibilityTypeFromPage}`] || compatibilityTypeFromPage})
            </p>
            {compatibility.score > 0 && (
              <div className="flex justify-center my-3 sm:my-4">
                  {renderStars(compatibility.score)}
              </div>
            )}
            <p className="leading-relaxed whitespace-pre-line text-sm sm:text-base text-card-foreground">{compatibility.report}</p>
          </div>
        )}
        {!isLoading && !compatibility && sign1 && sign2 && (
           <p className="text-center text-muted-foreground mt-6 min-h-[200px] flex items-center justify-center">{dictionary['CompatibilitySection.clickPromptAfterSelection'] || "Click 'View Compatibility' to see their report."}</p>
        )}
        {!isLoading && !compatibility && (!sign1 || !sign2) && (
          <p className="text-center text-muted-foreground mt-6 min-h-[200px] flex items-center justify-center">{dictionary['CompatibilitySection.selectSignsOnlyPrompt'] || "Select two signs, then click 'View Compatibility'."}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Wrapper para Suspense si es necesario por useSearchParams
export default function CompatibilityClientContentWrapper(props: CompatibilityClientContentProps) {
  return (
    <Suspense fallback={
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-screen">
        <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
        <p className="mt-4">Loading compatibility calculator...</p>
      </div>
    }>
      <CompatibilityClientContentInternal {...props} />
    </Suspense>
  );
}
