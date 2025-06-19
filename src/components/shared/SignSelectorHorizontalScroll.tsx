
"use client";

import type { ZodiacSign, ZodiacSignName, AuthUser, OnboardingFormData } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { UserPlus, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface SignSelectorHorizontalScrollProps {
  dictionary: Dictionary;
  locale: Locale;
  signs: ZodiacSign[];
  selectedSignName: ZodiacSignName;
  onSignSelect: (sign: ZodiacSign) => void;
  user: AuthUser | null;
  onboardingData: OnboardingFormData | null;
  userSunSign: ZodiacSign | null;
}

export default function SignSelectorHorizontalScroll({
  dictionary,
  locale,
  signs,
  selectedSignName,
  onSignSelect,
  user,
  onboardingData,
  userSunSign,
}: SignSelectorHorizontalScrollProps) {

  const userProfileName = onboardingData?.name || user?.displayName || (dictionary['Auth.userLabel'] || "User");
  const userInitial = userProfileName?.charAt(0).toUpperCase();
  
  // Determine if the user's own profile should be treated as "active"
  const isUserSignSelected = userSunSign ? selectedSignName === userSunSign.name : false;

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto py-2 px-1 no-scrollbar">
      {user && userSunSign && onboardingData ? (
        // User is logged in and has completed onboarding
        <Button
          variant="ghost"
          onClick={() => onSignSelect(userSunSign)}
          aria-label={userProfileName}
          className={cn(
            "flex flex-col items-center justify-center h-auto p-1.5 min-w-[60px] sm:min-w-[68px] text-center transition-all duration-200 ease-in-out group",
            isUserSignSelected ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Avatar
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 mb-1 border-2 transition-all duration-200 ease-in-out overflow-hidden",
              isUserSignSelected
                ? "bg-primary border-primary shadow-lg shadow-primary/70"
                : "bg-card/60 border-border group-hover:border-muted/50"
            )}
          >
            <AvatarImage src={user.photoURL || `https://placehold.co/80x80.png`} alt={userProfileName} data-ai-hint="user modern avatar digital art" />
            <AvatarFallback className={cn("text-lg", isUserSignSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              {userInitial || <UserCircle />}
            </AvatarFallback>
          </Avatar>
          <span className={cn("text-[0.65rem] sm:text-xs mt-0.5 whitespace-nowrap truncate max-w-[50px] sm:max-w-[60px]", isUserSignSelected ? "font-semibold text-primary-foreground" : "group-hover:text-foreground")}>
            {userProfileName}
          </span>
        </Button>
      ) : (
        // User not logged in or onboarding incomplete - Show "Add" button
        <Button
          variant="ghost"
          asChild
          className="flex flex-col items-center justify-center h-auto p-1.5 min-w-[60px] sm:min-w-[68px] text-center group"
          aria-label={dictionary['SignSelector.addFriend'] || "Add Profile"}
        >
          <Link href={user ? `/${locale}/onboarding?step=1` : `/${locale}/login`}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-muted/40 flex items-center justify-center bg-transparent group-hover:border-primary/70 transition-colors">
              <UserPlus className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground group-hover:text-primary/90" />
            </div>
            <span className="text-[0.65rem] sm:text-xs text-muted-foreground mt-1 whitespace-nowrap truncate group-hover:text-foreground">
              {dictionary['SignSelector.addFriend'] || "Añadir"}
            </span>
          </Link>
        </Button>
      )}

      {signs.map((sign) => {
        // Do not render the user's sun sign again if it's already shown as the personalized profile button
        if (userSunSign && sign.name === userSunSign.name && user && onboardingData) {
          return null;
        }

        const isActive = sign.name === selectedSignName;
        let imagePath = sign.customIconPath || `https://placehold.co/80x80.png`;
        let aiHint = sign.customIconPath ? `${sign.name.toLowerCase()} zodiac symbol illustration` : "zodiac placeholder";
        
        const inactiveIconColorClass = "text-teal-400/70 group-hover:text-teal-300/90";

        return (
          <Button
            key={sign.name}
            variant="ghost"
            onClick={() => onSignSelect(sign)}
            aria-label={dictionary[sign.name] || sign.name}
            className={cn(
              "flex flex-col items-center justify-center h-auto p-1.5 min-w-[60px] sm:min-w-[68px] text-center transition-all duration-200 ease-in-out group",
              isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Avatar
              className={cn(
                "w-12 h-12 sm:w-14 sm:h-14 mb-1 border-2 transition-all duration-200 ease-in-out overflow-hidden",
                isActive 
                  ? "bg-primary border-primary shadow-lg shadow-primary/70" 
                  : "bg-transparent border-transparent group-hover:border-muted/50"
              )}
            >
              {isActive && sign.customIconPath ? (
                <Image src={imagePath} alt={dictionary[sign.name] || sign.name} layout="fill" objectFit="cover" data-ai-hint={aiHint} className="rounded-full" />
              ) : (
                 <AvatarFallback className={cn("bg-transparent flex items-center justify-center", isActive && "bg-primary")}>
                  <ZodiacSignIcon signName={sign.name} className={cn("w-7 h-7 sm:w-8 sm:h-8", isActive ? "text-primary-foreground" : inactiveIconColorClass)} />
                </AvatarFallback>
              )}
            </Avatar>
            <span className={cn("text-[0.65rem] sm:text-xs mt-0.5 whitespace-nowrap truncate transition-colors", isActive ? "font-semibold text-primary-foreground" : "group-hover:text-foreground")}>
              {dictionary[sign.name] || sign.name}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
