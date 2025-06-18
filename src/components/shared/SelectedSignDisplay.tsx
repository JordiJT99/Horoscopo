
"use client";

import type { ZodiacSign } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SelectedSignDisplayProps {
  dictionary: Dictionary;
  locale: Locale;
  selectedSign: ZodiacSign;
}

export default function SelectedSignDisplay({
  dictionary,
  locale,
  selectedSign,
}: SelectedSignDisplayProps) {

  let imagePath = `https://placehold.co/144x144/7c3aed/ffffff.png?text=${selectedSign.name.substring(0, 2).toUpperCase()}`;
  let aiHint = "zodiac placeholder";

  if (selectedSign.customIconPath) {
    imagePath = selectedSign.customIconPath;
    aiHint = `${selectedSign.name.toLowerCase()} zodiac symbol illustration`;
  }

  const handleBannerClick = () => {
    const detailsSection = document.getElementById('horoscope-details-section');
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const translatedSignName = dictionary[selectedSign.name] || selectedSign.name;
  const scrollToDetailsAriaLabel = (dictionary['SelectedSign.scrollToDetails'] || "Scroll to {signName} details").replace('{signName}', translatedSignName);
  const moreDetailsAriaLabel = (dictionary['SelectedSign.moreDetailsAria'] || "More details for {signName}").replace('{signName}', translatedSignName);


  return (
    <div className="flex flex-col items-center text-center py-4">
      <h2 className="text-3xl font-bold font-headline text-foreground">
        {translatedSignName}
      </h2>
      <p className="text-sm text-muted-foreground mb-4 font-body">
        {selectedSign.dateRange}
      </p>
      <div
        className={cn(
          "relative w-32 h-32 sm:w-36 sm:h-36 mb-2 rounded-full shadow-lg cursor-pointer",
          "p-1 bg-primary" 
        )}
        onClick={handleBannerClick}
        role="button"
        tabIndex={0}
        aria-label={scrollToDetailsAriaLabel}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBannerClick(); }}
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          <Image
              src={imagePath}
              alt={translatedSignName}
              layout="fill"
              objectFit="cover"
              priority={true}
              key={imagePath}
              className="rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = `https://placehold.co/144x144/2A0A2A/FFFFFF.png?text=${selectedSign.name.substring(0,1).toUpperCase()}&font=lora`;
                target.setAttribute("data-ai-hint", "letter placeholder");
              }}
              data-ai-hint={aiHint}
          />
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-xs mt-1 px-6 rounded-md font-body"
        onClick={handleBannerClick}
        aria-label={moreDetailsAriaLabel}
      >
        {dictionary['SelectedSign.moreDetails'] || "Más detalles"}
      </Button>
    </div>
  );
}

