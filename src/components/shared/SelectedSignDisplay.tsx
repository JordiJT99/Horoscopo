
"use client";

import type { ZodiacSign } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { cn } from '@/lib/utils';
import Image from 'next/image'; 

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
  // Construct the path to your custom image/GIF
  // Assumes images are named like 'aries_display.gif', 'taurus_display.gif', etc.
  // and placed in 'public/custom_assets/'
  const customImagePath = selectedSign 
    ? `/custom_assets/${selectedSign.name.toLowerCase()}_display.gif` 
    : "/custom_assets/default_display.gif"; // Fallback if no sign selected

  return (
    <div className="flex flex-col items-center text-center py-4">
      <h2 className="text-3xl font-bold font-headline text-foreground">
        {dictionary[selectedSign.name] || selectedSign.name}
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        {selectedSign.dateRange} 
      </p>
      <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-4">
        <Image 
            src={customImagePath}
            alt={dictionary[selectedSign.name] || selectedSign.name} 
            width={144} // Provide the actual width of your image/GIF
            height={144} // Provide the actual height of your image/GIF
            className="rounded-full object-cover border-4 border-primary shadow-lg"
            // Add a hint for AI image generation if this were a placeholder we intended to replace
            // For your custom images, this hint is less critical unless you plan for AI to alter/replace them later.
            // For now, it describes the intent if the image were missing and a placeholder was shown.
            data-ai-hint={`${selectedSign.name.toLowerCase()} zodiac symbol animation`}
            // If your custom image fails to load, Next.js will show the alt text.
            // You can also add an onError handler if you want to display a fallback placeholder image.
            // onError={(e) => { e.currentTarget.src = `https://placehold.co/144x144/7c3aed/ffffff.png?text=${selectedSign.name.substring(0,1)}` }}
        />
      </div>
      <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6">
        {dictionary['SelectedSign.moreDetails'] || "Más detalles"}
      </Button>
    </div>
  );
}
