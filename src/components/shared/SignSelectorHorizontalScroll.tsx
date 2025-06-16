
"use client";

import type { ZodiacSign, ZodiacSignName, AuthUser } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignSelectorHorizontalScrollProps {
  dictionary: Dictionary;
  locale: Locale;
  signs: ZodiacSign[];
  selectedSignName: ZodiacSignName;
  onSignSelect: (sign: ZodiacSign) => void;
  user: AuthUser | null; // To potentially alter "Add a friend"
}

export default function SignSelectorHorizontalScroll({
  dictionary,
  locale,
  signs,
  selectedSignName,
  onSignSelect,
  user,
}: SignSelectorHorizontalScrollProps) {
  return (
    <div className="flex items-center space-x-3 overflow-x-auto py-2 no-scrollbar">
      {/* Add Friend Button */}
      <Button
        variant="ghost"
        className="flex flex-col items-center justify-center h-auto p-1.5 min-w-[64px] sm:min-w-[72px] text-center"
        onClick={() => { /* TODO: Implement add friend functionality or link to profile */ }}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center bg-card hover:border-primary transition-colors">
          <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground group-hover:text-primary" />
        </div>
        <span className="text-xs text-muted-foreground mt-1 whitespace-nowrap truncate">
          {dictionary['SignSelector.addFriend'] || "Añadir"}
        </span>
      </Button>

      {/* Zodiac Sign Buttons */}
      {signs.map((sign) => {
        const isActive = sign.name === selectedSignName;
        return (
          <Button
            key={sign.name}
            variant="ghost"
            onClick={() => onSignSelect(sign)}
            className={cn(
              "flex flex-col items-center justify-center h-auto p-1.5 min-w-[64px] sm:min-w-[72px] text-center transition-all duration-200 ease-in-out",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Avatar
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 mb-1 border-2 bg-card transition-all duration-200 ease-in-out",
                isActive ? "border-sign-selector-active-border shadow-lg scale-105" : "border-transparent group-hover:border-muted"
              )}
            >
              {/* Placeholder for actual sign image - using ZodiacSignIcon for now */}
              <AvatarFallback className={cn("bg-transparent", isActive && "bg-primary/10")}>
                <ZodiacSignIcon signName={sign.name} className={cn("w-7 h-7 sm:w-8 sm:h-8", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              </AvatarFallback>
            </Avatar>
            <span className={cn("text-xs mt-0.5 whitespace-nowrap truncate transition-colors", isActive && "font-semibold text-primary")}>
              {dictionary[sign.name] || sign.name}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
