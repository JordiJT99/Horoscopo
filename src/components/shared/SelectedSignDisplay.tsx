
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

  return (
    <div className="flex flex-col items-center text-center py-4">
      <h2 className="text-3xl font-bold font-headline text-foreground">
        {dictionary[selectedSign.name] || selectedSign.name}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {selectedSign.dateRange}
      </p>
      {/* Container mimicking the image style: Outer vibrant ring, inner dark bg for image */}
      <div className={cn(
        "relative w-32 h-32 sm:w-36 sm:h-36 mb-4 rounded-full shadow-lg",
        "p-1 bg-primary" // This creates the outer vibrant ring
      )}>
        <div className="w-full h-full bg-card rounded-full overflow-hidden"> {/* Inner container for the image with dark bg */}
          <Image
              src={imagePath}
              alt={dictionary[selectedSign.name] || selectedSign.name}
              layout="fill" 
              objectFit="cover" // Changed to cover to better fill the circle
              priority={true}
              key={imagePath} 
              className="rounded-full" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = `https://placehold.co/144x144/2A0A2A/FFFFFF.png?text=${selectedSign.name.substring(0,1).toUpperCase()}&font=lora`; // Darker placeholder BG
                target.setAttribute("data-ai-hint", "letter placeholder");
              }}
              data-ai-hint={aiHint}
          />
        </div>
      </div>
      <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-md"> {/* Ensure button uses primary and has rounded corners */}
        {dictionary['SelectedSign.moreDetails'] || "Más detalles"}
      </Button>
    </div>
  );
}
