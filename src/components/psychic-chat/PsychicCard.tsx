
"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Psychic } from "@/lib/psychics";
import type { Dictionary, Locale } from "@/lib/dictionaries";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PsychicCardProps {
  psychic: Psychic;
  dictionary: Record<string, string>;
  locale: Locale;
}

const PsychicCard: React.FC<PsychicCardProps> = ({ psychic, dictionary, locale }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/${locale}/psychic-chat/${psychic.id}`);
  };
  
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
        ))}
        {halfStar && <Star key="half" className="w-3 h-3 text-yellow-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)' }} fill="currentColor" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-3 h-3 text-gray-400" />
        ))}
      </div>
    );
  };

  return (
    <div 
      onClick={handleCardClick} 
      className="bg-card rounded-lg shadow-md overflow-hidden flex flex-col h-full cursor-pointer group"
    >
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={psychic.image}
          alt={psychic.name}
          layout="fill"
          objectFit="cover"
          className="group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={psychic.aiHint}
        />
        <div 
          className={cn(
            "absolute top-2 left-2 h-3 w-3 rounded-full border-2 border-background",
            psychic.status === "Available" ? "bg-green-500" :
            psychic.status === "Busy" ? "bg-yellow-500" : "bg-blue-500"
          )}
          title={dictionary[psychic.status] || psychic.status} 
        />
      </div>
      <div className="p-3 flex-grow flex flex-col">
        <h3 className="font-bold font-headline text-md truncate">{psychic.name}</h3>
        <p className="text-xs text-muted-foreground mb-2">
            {(dictionary['PsychicCard.experience'] || '{experience} years exp.').replace('{experience}', psychic.experience.toString())}
        </p>
        <div className="flex items-center gap-1 text-xs mb-3">
          {renderStars(psychic.rating)}
          <span className="text-muted-foreground">({psychic.reviews})</span>
        </div>
        <div className="mt-auto">
          {psychic.isFree ? (
            <Button size="sm" className="w-full text-xs">
              {dictionary['PsychicCard.chatFree'] || 'CHAT | FREE'}
            </Button>
          ) : (
            <Button size="sm" variant="secondary" className="w-full text-xs">
              {(dictionary['PsychicCard.chatPerMinute'] || 'CHAT | ${price}/MIN').replace('{price}', psychic.price?.toFixed(2) || '0.00')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PsychicCard;
