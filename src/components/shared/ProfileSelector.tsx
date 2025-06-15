
"use client";

import type { AuthUser, OnboardingFormData, SelectedProfileType } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sparkles, UserCircle, UserRoundPlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ProfileSelectorProps {
  dictionary: Dictionary;
  locale: Locale;
  selectedProfile: SelectedProfileType;
  setSelectedProfile: (profile: SelectedProfileType) => void;
  user: AuthUser | null;
  onboardingData: OnboardingFormData | null;
}

export default function ProfileSelector({
  dictionary,
  locale,
  selectedProfile,
  setSelectedProfile,
  user,
  onboardingData,
}: ProfileSelectorProps) {
  return (
    <div className="flex justify-around items-center py-1 sm:py-2">
      <Button
        variant="ghost"
        onClick={() => setSelectedProfile('generic')}
        className={cn(
          "flex flex-col items-center h-auto p-1 sm:p-1.5",
          selectedProfile === 'generic' && "text-primary"
        )}
      >
        <Avatar className={cn("w-10 h-10 sm:w-12 sm:h-12 mb-0.5 border-2", selectedProfile === 'generic' ? "border-primary" : "border-border")}>
          <AvatarImage src="https://placehold.co/64x64.png" alt={dictionary['HomePage.genericProfile'] || "Horoscopes"} data-ai-hint="galaxy stars icon" />
          <AvatarFallback><Sparkles className="w-5 h-5 sm:w-6 sm:w-6" /></AvatarFallback>
        </Avatar>
        <span className="text-[0.6rem] sm:text-xs font-medium">{dictionary['HomePage.genericProfile'] || "Horoscopes"}</span>
      </Button>

      {user && (
        <Button
          variant="ghost"
          onClick={() => setSelectedProfile('user')}
          className={cn(
            "flex flex-col items-center h-auto p-1 sm:p-1.5",
            selectedProfile === 'user' && "text-primary"
          )}
        >
          <Avatar className={cn("w-10 h-10 sm:w-12 sm:h-12 mb-0.5 border-2", selectedProfile === 'user' ? "border-primary" : "border-border")}>
            <AvatarImage src={user.photoURL || `https://placehold.co/64x64.png`} alt={onboardingData?.name || user.displayName || "User"} data-ai-hint="abstract user avatar gradient" />
            <AvatarFallback className="text-sm sm:text-base">
              {(onboardingData?.name?.charAt(0) || user.displayName?.charAt(0) || <UserCircle />).toString().toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-[0.6rem] sm:text-xs font-medium truncate max-w-[60px] sm:max-w-[80px]">
            {onboardingData?.name || user.displayName || (dictionary['Auth.userLabel'] || "User")}
          </span>
        </Button>
      )}

      <Button
        variant="ghost"
        asChild
        className="flex flex-col items-center h-auto p-1 sm:p-1.5 text-muted-foreground hover:text-primary"
      >
        <Link href={user ? `/${locale}/profile` : `/${locale}/onboarding`}>
          <div className={cn("w-10 h-10 sm:w-12 sm:h-12 mb-0.5 border-2 border-dashed border-border rounded-full flex items-center justify-center bg-card/50 hover:border-primary")}>
            <UserRoundPlus className="w-5 h-5 sm:w-6 sm:w-6" />
          </div>
          <span className="text-[0.6rem] sm:text-xs font-medium">
            {user ? (dictionary['Header.profile'] || "Profile") : (dictionary['HomePage.addProfileButton'] || "Add")}
          </span>
        </Link>
      </Button>
    </div>
  );
}
