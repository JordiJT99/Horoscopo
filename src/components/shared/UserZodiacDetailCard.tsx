
"use client";

import type { AuthUser, OnboardingFormData, SelectedProfileType, ZodiacSign, AstrologicalElement, AstrologicalModality, AstrologicalPolarity } from '@/types';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles, Edit3, UserCircle,
  Flame, Mountain, Wind, Droplets, Layers, Anchor, RefreshCw, Sun, Moon, Orbit, Shield
} from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { cn } from '@/lib/utils';

const getElementIcon = (element: AstrologicalElement, className?: string) => {
  const props = { className: cn("w-3.5 h-3.5 sm:w-4 sm:h-4", className) };
  if (element === "Fire") return <Flame {...props} />;
  if (element === "Earth") return <Mountain {...props} />;
  if (element === "Air") return <Wind {...props} />;
  if (element === "Water") return <Droplets {...props} />;
  return <Sparkles {...props} />; // Fallback
};

const getModalityIcon = (modality: AstrologicalModality, className?: string) => {
  const props = { className: cn("w-3.5 h-3.5 sm:w-4 sm:h-4", className) };
  if (modality === "Cardinal") return <Layers {...props} />;
  if (modality === "Fixed") return <Anchor {...props} />;
  if (modality === "Mutable") return <RefreshCw {...props} />;
  return <Sparkles {...props} />; // Fallback
};

const getPolarityIcon = (polarity: AstrologicalPolarity, className?: string) => {
  const props = { className: cn("w-3.5 h-3.5 sm:w-4 sm:h-4", className) };
  if (polarity === "Masculine") return <Sun {...props} />; // Masculine often associated with Sun/Day
  if (polarity === "Feminine") return <Shield {...props} />; // Feminine often associated with Moon/Night/Receptivity - Shield implies protection/receptivity
  return <Sparkles {...props} />; // Fallback
};


interface UserZodiacDetailCardProps {
  dictionary: Dictionary;
  locale: Locale;
  selectedProfile: SelectedProfileType;
  userSunSign: ZodiacSign | null;
  onboardingData: OnboardingFormData | null;
  user: AuthUser | null;
  authLoading: boolean;
}

export default function UserZodiacDetailCard({
  dictionary,
  locale,
  selectedProfile,
  userSunSign,
  onboardingData,
  user,
  authLoading,
}: UserZodiacDetailCardProps) {
  const displaySign = selectedProfile === 'user' && userSunSign ? userSunSign : ZODIAC_SIGNS.find(s => s.name === "Aries")!;
  
  if (authLoading && selectedProfile === 'user') {
    return <Skeleton className="h-[380px] sm:h-[420px] w-full rounded-lg max-w-md mx-auto my-4 bg-card/50" />;
  }

  if (selectedProfile === 'user' && user && !userSunSign && !onboardingData?.dateOfBirth) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-primary/30 text-center p-4 sm:p-6 max-w-md mx-auto my-4 rounded-xl shadow-xl">
        <CardHeader className="p-2">
          <CardTitle className="font-headline text-lg md:text-xl text-primary">
            {onboardingData?.name || user?.displayName || (dictionary['HomePage.welcomeUser'] || "Welcome")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-2">
          <p className="font-body text-xs sm:text-sm">{dictionary['HomePage.completeProfilePrompt'] || "Please complete your profile to see your personalized zodiac details."}</p>
          <Button asChild className="w-full sm:w-auto text-xs sm:text-sm" size="sm">
            <Link href={`/${locale}/onboarding`}><Edit3 className="mr-2 h-4 w-4"/>{dictionary['ProfilePage.editProfileButton'] || "Complete Profile"}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const cardTitle = selectedProfile === 'user' 
      ? (onboardingData?.name ? onboardingData.name : (user?.displayName || (dictionary['Auth.userLabel'] || "User")))
      : (dictionary['HomePage.genericProfile'] || "Horoscopes");

  const cardSubtitle = selectedProfile === 'user' && user && !onboardingData?.dateOfBirth
      ? (dictionary['HomePage.promptPersonalInfo'] || "Please enter your personal information")
      : (dictionary[displaySign.name] || displaySign.name);


  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/30 text-center p-3 sm:p-4 max-w-md mx-auto my-4 overflow-hidden rounded-xl shadow-xl">
      <CardHeader className="p-2 space-y-1">
        <CardTitle className="text-xl sm:text-2xl font-bold font-headline text-foreground">
          {cardTitle}
        </CardTitle>
        { (selectedProfile === 'user' && user && !userSunSign && onboardingData?.dateOfBirth === undefined) ? (
           <p className="text-xs text-muted-foreground">{cardSubtitle}</p>
        ) : (
          <>
            <p className="text-2xl font-headline font-semibold text-primary">{dictionary[displaySign.name] || displaySign.name}</p>
            <div className="grid grid-cols-3 gap-1 text-xs sm:text-sm text-muted-foreground mt-1">
                <span className="flex flex-col items-center col-span-1">
                    {getElementIcon(displaySign.element, "text-primary mb-0.5")} {dictionary['Zodiac.elementShort'] || 'Elem'}: {dictionary[displaySign.element] || displaySign.element}
                </span>
                <span className="flex flex-col items-center col-span-1">
                    {getModalityIcon(displaySign.modality, "text-primary mb-0.5")} {dictionary['Zodiac.modalityShort'] || 'Mod'}: {dictionary[displaySign.modality] || displaySign.modality}
                </span>
                <span className="flex flex-col items-center col-span-1">
                    {getPolarityIcon(displaySign.polarity, "text-primary mb-0.5")} {dictionary['Zodiac.polarityShort'] || 'Pol'}: {dictionary[displaySign.polarity] || displaySign.polarity}
                </span>
            </div>
          </>
        )}
      </CardHeader>

      <CardContent className="p-2 space-y-2 sm:space-y-3">
        <div className="flex justify-center my-2 sm:my-3">
          <Avatar className="w-28 h-28 sm:w-36 sm:h-36 border-2 border-primary shadow-lg">
            <AvatarImage 
              src={`https://placehold.co/150x150.png`} // Placeholder for actual sign image
              alt={displaySign.name} 
              data-ai-hint={`${displaySign.name} zodiac sign symbol illustration vibrant cosmic glow`} 
            />
            <AvatarFallback><ZodiacSignIcon signName={displaySign.name} className="w-16 h-16 sm:w-20 sm:h-20" /></AvatarFallback>
          </Avatar>
        </div>
        
        <div className="space-y-1.5 text-sm sm:text-base">
          <p className="flex items-center justify-center gap-1.5"><Sun className="w-4 h-4 text-yellow-400"/> {dictionary['Zodiac.sunSign'] || "Sun Sign"}: <span className="font-semibold">{dictionary[displaySign.name] || displaySign.name}</span></p>
          <p className="flex items-center justify-center gap-1.5"><Moon className="w-4 h-4 text-slate-400"/> {dictionary['Zodiac.moonSign'] || "Moon Sign"}: <span className="text-muted-foreground">{dictionary['HomePage.comingSoon'] || "Coming Soon"}</span></p>
          <div className="flex items-center justify-center gap-1.5">
              <Orbit className="w-4 h-4 text-purple-400"/> {dictionary['Zodiac.risingSign'] || "Rising Sign"}:
              <Button variant="link" size="sm" className="text-xs sm:text-sm p-0 h-auto text-primary hover:text-primary/80 -ml-1" asChild>
                  <Link href={`/${locale}/lunar-ascendant`}>{dictionary['HomePage.discoverButton'] || "Discover"}</Link>
              </Button>
          </div>
        </div>
         {selectedProfile === 'user' && user && (
          <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-3 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-xs" asChild>
              <Link href={`/${locale}/profile`}><Edit3 className="mr-1.5 h-3.5 w-3.5"/>{dictionary['HomePage.editProfileButton'] || "Edit Profile"}</Link>
          </Button>
         )}
         {selectedProfile === 'generic' && (
           <Button variant="outline" size="sm" className="w-full sm:w-auto mt-2 sm:mt-3 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-xs" asChild>
              <Link href={`/${locale}/more`}><Sparkles className="mr-1.5 h-3.5 w-3.5"/>{dictionary['HomePage.moreDetailsButton'] || "More Details"}</Link>
          </Button>
         )}
      </CardContent>
    </Card>
  );
}

