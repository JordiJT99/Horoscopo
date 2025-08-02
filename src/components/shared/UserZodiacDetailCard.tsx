
"use client";

import type { AuthUser, OnboardingFormData, SelectedProfileType, ZodiacSign, AstrologicalElement, AstrologicalModality, AstrologicalPolarity } from '@/types';
import type { Dictionary, Locale } from '@/types';
import { ZODIAC_SIGNS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles, Edit3, UserCircle,
  Flame, Mountain, Wind, Droplets, Layers, Anchor, RefreshCw, Sun, Moon, Orbit, Shield, CalendarDays
} from 'lucide-react';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import { cn } from '@/lib/utils';

const getElementIcon = (element: AstrologicalElement, className?: string) => {
  const props = { className: cn("w-3.5 h-3.5", className) };
  if (element === "Fire") return <Flame {...props} />;
  if (element === "Earth") return <Mountain {...props} />;
  if (element === "Air") return <Wind {...props} />;
  if (element === "Water") return <Droplets {...props} />;
  return <Sparkles {...props} />; 
};

const getModalityIcon = (modality: AstrologicalModality, className?: string) => {
  const props = { className: cn("w-3.5 h-3.5", className) };
  if (modality === "Cardinal") return <Layers {...props} />;
  if (modality === "Fixed") return <Anchor {...props} />;
  if (modality === "Mutable") return <RefreshCw {...props} />;
  return <Sparkles {...props} />; 
};

const getPolarityIcon = (polarity: AstrologicalPolarity, className?: string) => {
  const props = { className: cn("w-3.5 h-3.5", className) };
  if (polarity === "Masculine") return <Sun {...props} />; 
  if (polarity === "Feminine") return <Shield {...props} />; 
  return <Sparkles {...props} />;
};


interface UserZodiacDetailCardProps {
  dictionary: Dictionary;
  locale: Locale;
  selectedProfile: SelectedProfileType;
  userSunSign: ZodiacSign | null;
  onboardingData: OnboardingFormData | null;
  user: AuthUser | null;
  authLoading: boolean;
  activeHoroscopePeriod: 'daily' | 'weekly' | 'monthly'; // To potentially display date/period
}

export default function UserZodiacDetailCard({
  dictionary,
  locale,
  selectedProfile,
  userSunSign,
  onboardingData,
  user,
  authLoading,
  activeHoroscopePeriod
}: UserZodiacDetailCardProps) {
  const displaySign = selectedProfile === 'user' && userSunSign ? userSunSign : ZODIAC_SIGNS.find(s => s.name === "Aries")!;
  
  if (authLoading && selectedProfile === 'user') {
    return <Skeleton className="h-[420px] sm:h-[450px] w-full rounded-lg max-w-md mx-auto my-4 bg-card/50" />;
  }

  const cardTitle = selectedProfile === 'user' 
      ? (onboardingData?.name ? onboardingData.name : (user?.displayName || (dictionary['Auth.userLabel'] || "User")))
      : (dictionary['HomePage.genericProfile'] || "Horoscopes"); // For generic, use generic title

  const showPersonalInfoPrompt = selectedProfile === 'user' && user && !userSunSign && !onboardingData?.dateOfBirth;

  const getDateForHoroscopePeriodButton = () => {
    const now = new Date();
    if (activeHoroscopePeriod === 'monthly') {
        return now.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
    }
    // Add weekly logic if needed, for now, daily/tomorrow/yesterday use current month/year
    return now.toLocaleDateString(locale, { month: '2-digit', year: 'numeric' });
  };
  
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-primary/30 text-center p-4 sm:p-5 max-w-md mx-auto my-4 overflow-hidden rounded-xl shadow-xl">
      <CardHeader className="p-0 mb-3 space-y-1">
        <CardTitle className="text-2xl sm:text-3xl font-bold font-headline text-foreground">
          {cardTitle}
        </CardTitle>
        {showPersonalInfoPrompt ? (
          <p className="text-xs text-muted-foreground">{dictionary['HomePage.promptPersonalInfo'] || "Please enter your personal information"}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{dictionary[displaySign.name] || displaySign.name}</p>
        )}
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        <div className="grid grid-cols-3 items-center gap-2">
          {/* Left Column: Solar, Lunar, Ascendant */}
          <div className="text-left space-y-2 text-xs sm:text-sm">
            <div>
              <p className="font-semibold text-muted-foreground uppercase">{dictionary['UserZodiacCard.solarSign'] || "SIGNO SOLAR"}</p>
              <p className="flex items-center text-foreground">
                <ZodiacSignIcon signName={displaySign.name} className="w-4 h-4 mr-1 text-primary"/>
                {dictionary[displaySign.name] || displaySign.name}
              </p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground uppercase">{dictionary['UserZodiacCard.lunarSign'] || "SIGNO LUNAR"}</p>
              <p className="text-muted-foreground">{dictionary['UserZodiacCard.completeProfile'] || "Completa tu perfil"}</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground uppercase">{dictionary['UserZodiacCard.ascendantSign'] || "SIGNO ASCENDENTE"}</p>
              <Button variant="link" size="sm" className="text-xs p-0 h-auto text-primary hover:text-primary/80 -ml-1" asChild>
                <Link href={`/${locale}/lunar-ascendant`}>{dictionary['UserZodiacCard.discoverButton'] || "Descubrir"}</Link>
              </Button>
            </div>
          </div>

          {/* Center Column: Avatar */}
          <div className="flex justify-center items-center">
            <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-2 border-primary shadow-lg">
              <AvatarImage 
                src={`https://placehold.co/150x150.png`} 
                alt={displaySign.name} 
                data-ai-hint={`${displaySign.name} zodiac sign symbol illustration vibrant cosmic glow`} 
              />
              <AvatarFallback><ZodiacSignIcon signName={displaySign.name} className="w-16 h-16 sm:w-20 sm:h-20" /></AvatarFallback>
            </Avatar>
          </div>

          {/* Right Column: Element, Polarity, Modality */}
          <div className="text-right space-y-2 text-xs sm:text-sm">
            <div>
              <p className="font-semibold text-muted-foreground uppercase">{dictionary['UserZodiacCard.element'] || "ELEMENTO"}</p>
              <p className="flex items-center justify-end text-foreground">
                {dictionary[displaySign.element] || displaySign.element}
                {getElementIcon(displaySign.element, "ml-1 text-primary")}
              </p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground uppercase">{dictionary['UserZodiacCard.polarity'] || "POLARIDAD"}</p>
              <p className="flex items-center justify-end text-foreground">
                {dictionary[displaySign.polarity] || displaySign.polarity}
                {getPolarityIcon(displaySign.polarity, "ml-1 text-primary")}
              </p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground uppercase">{dictionary['UserZodiacCard.modality'] || "MODALIDAD"}</p>
              <p className="flex items-center justify-end text-foreground">
                 {dictionary[displaySign.modality] || displaySign.modality}
                {getModalityIcon(displaySign.modality, "ml-1 text-primary")}
              </p>
            </div>
          </div>
        </div>
        
        {/* Button-like date display or Edit Profile */}
        <div className="mt-3">
          {selectedProfile === 'user' && user ? (
            <Button variant="outline" size="sm" className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 hover:text-primary text-xs" asChild>
                <Link href={`/${locale}/profile`}><Edit3 className="mr-1.5 h-3.5 w-3.5"/>{dictionary['HomePage.editProfileButton'] || "Edit Profile"}</Link>
            </Button>
           ) : (
             <Button variant="default" size="sm" className="w-full sm:w-auto text-xs pointer-events-none">
                <CalendarDays className="mr-1.5 h-3.5 w-3.5"/> {getDateForHoroscopePeriodButton()}
             </Button>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
