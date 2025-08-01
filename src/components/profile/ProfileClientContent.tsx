

"use client";

import type { Locale, Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle, Mail, Edit3, Save, LogOut, Settings, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import type { OnboardingFormData, ZodiacSign } from '@/types';
import { getSunSignFromDate } from '@/lib/constants';
import ZodiacSignIcon from '@/components/shared/ZodiacSignIcon';
import CosmicEnergyBar from './CosmicEnergyBar';
import MySignsCard from './MySignsCard';
import NotificationSettingsCard from './NotificationSettingsCard';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import { cn } from '@/lib/utils';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


export default function ProfileClientContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const { user, isLoading, logout, updateUsername } = useAuth();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const { level: userLevel, bio: bioFromHook, setBio: setBioInStore } = useCosmicEnergy() as any;

  const [isEditingAbout, setIsEditingAbout] = useState(false);
  
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [onboardingData, setOnboardingData] = useState<OnboardingFormData | null>(null);

  useEffect(() => {
    setIsClient(true);
    const fetchUserData = async () => {
      if (user) {
        setUsername(user.displayName || '');
        // Fetch extended profile data from Firestore
        const profileRef = doc(db, 'userProfiles', user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setBio(data.bio || (dictionary['ProfilePage.placeholderBio'] || "Lover of stars, seeker of cosmic wisdom."));
        } else {
            // If no profile, use placeholder and maybe save it later
            setBio(dictionary['ProfilePage.placeholderBio'] || "Lover of stars, seeker of cosmic wisdom.");
        }

        // Onboarding data is still in localStorage for now
        const storedOnboardingData = localStorage.getItem(`onboardingData_${user.uid}`);
        if (storedOnboardingData) {
          setOnboardingData(JSON.parse(storedOnboardingData));
        }
      }
    };
    fetchUserData();
  }, [user, dictionary]);

  const userSunSign: ZodiacSign | null = useMemo(() => {
    if (onboardingData?.dateOfBirth) {
      return getSunSignFromDate(new Date(onboardingData.dateOfBirth));
    }
    return null;
  }, [onboardingData]);

  const displayName = user?.displayName || (dictionary['ProfilePage.defaultUsername'] || "Astro User");
  const displayEmail = user?.email || (dictionary['ProfilePage.defaultEmail'] || "No email provided");
  const userInitial = displayName.substring(0, 1).toUpperCase();

  const handleAboutEdit = async () => {
    if (isEditingAbout) {
      if(user) {
        const profileRef = doc(db, 'userProfiles', user.uid);
        try {
          await setDoc(profileRef, { bio }, { merge: true });
          toast({ title: dictionary['ProfilePage.aboutUpdateSuccessTitle'] || "About Me Updated", description: dictionary['ProfilePage.aboutUpdateSuccessMessage'] || "Your bio has been saved." });
        } catch (error) {
          toast({ title: "Error", description: "Could not save bio.", variant: "destructive" });
        }
      }
    }
    setIsEditingAbout(!isEditingAbout);
  };
  
  const handleAccountUpdate = async () => {
    if (!username.trim()) {
        toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorNameRequired'], variant: 'destructive'});
        return;
    }
    await updateUsername(username, locale);
  };

  const handleLogout = async () => {
    await logout(locale);
  };
  
  const profileBackgroundClass = useMemo(() => {
    if (userLevel >= 9) return 'profile-bg-rosette'; 
    if (userLevel >= 4) return 'profile-bg-gaia-nebula'; 
    return '';
  }, [userLevel]);

  const avatarFrameClass = useMemo(() => {
    if (userLevel >= 8) return 'avatar-frame-ring-of-light';
    if (userLevel >= 2) return 'avatar-frame-comet';
    return '';
  }, [userLevel]);


  if (!isClient || isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="md:col-span-1 space-y-8">
          <Skeleton className="h-[320px] w-full rounded-lg bg-card/50" />
        </div>
        <div className="md:col-span-2 space-y-8">
          <Skeleton className="h-[150px] w-full rounded-lg bg-card/50" />
          <Skeleton className="h-[400px] w-full rounded-lg bg-card/50" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
        <div className="text-center max-w-md mx-auto">
            <Card className="w-full p-8 bg-card/70 backdrop-blur-sm">
                <p className="font-body text-base mb-6">{dictionary['Auth.pleaseLoginToProfile'] || "You need to be logged in to access your profile and settings."}</p>
                <Button asChild className="w-full font-body">
                    <Link href={`/${locale}/login`}>
                        <UserCircle className="mr-2 h-5 w-5" />
                        {dictionary['Auth.goToLoginButton'] || "Go to Login Page"}
                    </Link>
                </Button>
            </Card>
        </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto p-4 rounded-lg transition-all duration-500", profileBackgroundClass)}>
      
      <div className="md:col-span-1 space-y-8">
        <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
          <CardHeader className="items-center text-center p-6">
            <Avatar className={cn("w-24 h-24 mb-4 border-4 border-primary shadow-lg", avatarFrameClass)}>
              <AvatarImage src={user.photoURL || undefined} alt={displayName} />
              <AvatarFallback className="text-3xl bg-muted/50">{userInitial}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              {displayName}
            </CardTitle>
            {userSunSign && (
              <div className="flex items-center gap-1.5 text-sm text-primary font-semibold">
                <ZodiacSignIcon signName={userSunSign.name} className="w-4 h-4" />
                <span>{dictionary[userSunSign.name] || userSunSign.name}</span>
              </div>
            )}
            <CardDescription className="font-body text-sm text-muted-foreground">{displayEmail}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 text-center space-y-3">
             <Button onClick={handleLogout} variant="destructive" className="w-full font-body">
              <LogOut className="mr-2 h-4 w-4" /> {dictionary['Auth.logoutButton'] || "Logout"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 space-y-8">
        <MySignsCard dictionary={dictionary} locale={locale} onboardingData={onboardingData} />
        <CosmicEnergyBar dictionary={dictionary} />
        <NotificationSettingsCard dictionary={dictionary} />

        <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <CardTitle className="text-lg">{dictionary['ProfilePage.aboutMeTitle'] || "About Me"}</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleAboutEdit}
              aria-label={isEditingAbout ? (dictionary['ProfilePage.saveAboutAriaLabel'] || 'Save changes to about me') : (dictionary['ProfilePage.editAboutAriaLabel'] || 'Edit about me section')}
            >
              {isEditingAbout ? <Save className="h-5 w-5 text-primary" /> : <Edit3 className="h-5 w-5" />}
            </Button>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {isEditingAbout ? (
              <Textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={dictionary['ProfilePage.bioPlaceholder'] || 'Tell us about your cosmic journey...'}
                className="min-h-[100px] bg-input/50 text-sm"
                maxLength={300}
              />
            ) : (
              <p className="font-body text-base text-card-foreground leading-relaxed min-h-[100px] whitespace-pre-wrap">{bio}</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5 text-primary"/>{dictionary['ProfilePage.accountSettingsTitle'] || "Account Settings"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            <div className="space-y-2">
              <Label htmlFor="username-profile">{dictionary['ProfilePage.usernameLabel'] || "Username"}</Label>
              <Input type="text" id="username-profile" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-input/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-profile">{dictionary['ProfilePage.emailLabel'] || "Email Address"}</Label>
              <Input type="email" id="email-profile" value={displayEmail} className="bg-input/50" disabled />
              <p className="text-xs text-muted-foreground">{dictionary['ProfilePage.emailCannotBeChanged'] || 'Email address cannot be changed.'}</p>
            </div>
            <Button onClick={handleAccountUpdate} disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" /> {dictionary['ProfilePage.saveAccountChangesButton'] || "Save Account Changes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
