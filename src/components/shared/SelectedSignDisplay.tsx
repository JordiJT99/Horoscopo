
"use client";

import type { ZodiacSign, UserAstrologyProfile } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Sun, Moon, ArrowUpRight } from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import Link from 'next/link';


interface SelectedSignDisplayProps {
  dictionary: Dictionary;
  locale: Locale;
  selectedSign: ZodiacSign;
  isPersonalized: boolean;
  userProfile: UserAstrologyProfile;
}

const SignDisplayRow = ({ icon: Icon, label, sign, dictionary }: { icon: React.ElementType; label: string; sign: ZodiacSign | null; dictionary: Dictionary }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-border/30 last:border-b-0">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="font-semibold text-sm text-foreground/90">{label}</span>
    </div>
    {sign ? (
      <div className="flex items-center gap-1.5 font-semibold text-sm text-primary">
        <ZodiacSignIcon signName={sign.name} className="w-4 h-4" />
        <span>{dictionary[sign.name] || sign.name}</span>
      </div>
    ) : (
      <span className="text-xs text-muted-foreground">{dictionary['Data.notAvailable'] || "N/A"}</span>
    )}
  </div>
);


export default function SelectedSignDisplay({
  dictionary,
  locale,
  selectedSign,
  isPersonalized,
  userProfile,
}: SelectedSignDisplayProps) {

  let imagePath = `https://placehold.co/144x144/7c3aed/ffffff.png?text=${selectedSign.name.substring(0, 2).toUpperCase()}`;
  let aiHint = "zodiac placeholder";

  if (selectedSign.customIconPath) {
    imagePath = selectedSign.customIconPath;
    aiHint = `${selectedSign.name.toLowerCase()} zodiac symbol illustration`;
  }

  const translatedSignName = dictionary[selectedSign.name] || selectedSign.name;
  const moreDetailsAriaLabel = (dictionary['SelectedSign.moreDetailsAria'] || "More details for {signName}").replace('{signName}', translatedSignName);
  const detailPagePath = `/${locale}/zodiac/${selectedSign.name.toLowerCase()}`;


  return (
    <div className="flex flex-col items-center text-center py-4">
      <h2 className="text-3xl font-bold font-headline text-foreground">
        {translatedSignName}
      </h2>
      <p className="text-sm text-muted-foreground mb-4 font-body">
        {selectedSign.dateRange}
      </p>
      <Link href={detailPagePath} className="block" aria-label={moreDetailsAriaLabel}>
        <div
          className={cn(
            "relative w-32 h-32 sm:w-36 sm:h-36 mb-2 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300"
          )}
          role="button"
          tabIndex={-1} // The link handles focus
        >
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary">
            <Image
                src={imagePath}
                alt={translatedSignName}
                layout="fill"
                objectFit="cover"
                priority={true}
                key={imagePath}
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
      </Link>

       {isPersonalized && (userProfile.sun || userProfile.moon || userProfile.ascendant) && (
        <div className="mt-4 w-full max-w-xs p-3 bg-card/50 rounded-lg border border-primary/20 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-primary mb-2 font-headline">{dictionary['HomePage.astrologicalTrinity'] || 'Your Astrological Trinity'}</h3>
          <div className="space-y-1 text-left">
            <SignDisplayRow icon={Sun} label={dictionary['ProfilePage.sunSignLabel'] || "Sun"} sign={userProfile.sun} dictionary={dictionary} />
            <SignDisplayRow icon={Moon} label={dictionary['ProfilePage.moonSignLabel'] || "Moon"} sign={userProfile.moon} dictionary={dictionary} />
            <SignDisplayRow icon={ArrowUpRight} label={dictionary['ProfilePage.ascendantSignLabel'] || "Ascendant"} sign={userProfile.ascendant} dictionary={dictionary} />
          </div>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-xs mt-4 px-6 rounded-md font-body"
        aria-label={moreDetailsAriaLabel}
        asChild
      >
        <Link href={detailPagePath}>
          {dictionary['SelectedSign.moreDetails'] || "Más detalles"}
        </Link>
      </Button>
    </div>
  );
}
