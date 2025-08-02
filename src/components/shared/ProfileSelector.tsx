
"use client";

import type { AuthUser, OnboardingFormData, SelectedProfileType } from '@/types';
import type { Dictionary, Locale } from '@/types';
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
    <div className="flex justify-around items-center py-3 sm:py-4">
      <Button
        variant="ghost"
        onClick={() => setSelectedProfile('generic')}
        className={cn(
          "flex flex-col items-center h-auto p-1.5 sm:p-2", // Adjusted padding
          selectedProfile === 'generic' ? "text-primary" : "text-foreground" // Ensure active one uses primary color
        )}
      >
        <Avatar className={cn("w-16 h-16 sm:w-20 sm:h-20 mb-1 border-2", selectedProfile === 'generic' ? "border-primary shadow-lg shadow-primary/30" : "border-border")}> {/* Increased size */}
          <AvatarImage src="https://placehold.co/80x80.png" alt={dictionary['HomePage.genericProfile'] || "Horoscopes"} data-ai-hint="abstract cosmic sphere vibrant colors" />
          <AvatarFallback><Sparkles className="w-8 h-8 sm:w-10 sm:h-10" /></AvatarFallback>
        </Avatar>
        <span className="text-xs sm:text-sm font-medium">{dictionary['HomePage.genericProfile'] || "Horoscopes"}</span>
      </Button>

      {user && (
        <Button
          variant="ghost"
          onClick={() => setSelectedProfile('user')}
          className={cn(
            "flex flex-col items-center h-auto p-1.5 sm:p-2",
             selectedProfile === 'user' ? "text-primary" : "text-foreground"
          )}
        >
          <Avatar className={cn("w-16 h-16 sm:w-20 sm:h-20 mb-1 border-2", selectedProfile === 'user' ? "border-primary shadow-lg shadow-primary/30" : "border-border")}>
            <AvatarImage src={user.photoURL || `https://placehold.co/80x80.png`} alt={onboardingData?.name || user.displayName || "User"} data-ai-hint="user modern avatar digital art" />
            <AvatarFallback className="text-lg sm:text-xl">
              {(onboardingData?.name?.charAt(0) || user.displayName?.charAt(0) || <UserCircle />).toString().toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs sm:text-sm font-medium truncate max-w-[70px] sm:max-w-[90px]">
            {onboardingData?.name || user.displayName || (dictionary['Auth.userLabel'] || "User")}
          </span>
        </Button>
      )}

      <Button
        variant="ghost"
        asChild
        className="flex flex-col items-center h-auto p-1.5 sm:p-2 text-foreground hover:text-primary"
      >
        <Link href={user ? `/${locale}/profile` : `/${locale}/onboarding`}> {/* Redirect to onboarding if not logged in to "add profile" */}
          <div className={cn("w-16 h-16 sm:w-20 sm:h-20 mb-1 border-2 border-dashed border-border rounded-full flex items-center justify-center bg-card/50 hover:border-primary")}>
            <UserRoundPlus className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <span className="text-xs sm:text-sm font-medium">
            {dictionary['HomePage.addProfileButton'] || "Add"}
          </span>
        </Link>
      </Button>
    </div>
  );
}
