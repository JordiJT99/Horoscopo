
"use client"; // Directive at the top of the client module

import type { Locale, Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, Mail, CalendarDays, Edit3, Gem, Star, LogOut, LogIn, Settings, Award, ShieldQuestion } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import SectionTitle from '@/components/shared/SectionTitle'; // SectionTitle can be used in client too

export default function ProfileClientContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const { user, isLoading, logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component has mounted on the client
  }, []);

  const handleLogout = async () => {
    await logout(locale);
  };

  const placeholderJoinDate = new Date(2023, 0, 15).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const cardClasses = "bg-card/70 backdrop-blur-sm border border-white/10 shadow-xl";

  if (!isClient || isLoading) { // Show loader until client has mounted and auth state is determined
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <SectionTitle
          title={dictionary['ProfilePage.title'] || "User Profile"}
          subtitle={dictionary['ProfilePage.subtitle'] || "Manage your celestial identity."}
          icon={UserCircle}
          className="mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className={cardClasses}>
              <CardHeader className="items-center text-center">
                <Skeleton className="w-32 h-32 rounded-full mb-4 bg-muted/50" />
                <Skeleton className="h-8 w-3/4 mb-2 bg-muted/50" />
                <Skeleton className="h-6 w-1/2 bg-muted/50" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full bg-muted/50" />
                <Skeleton className="h-10 w-full bg-muted/50" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card className={cardClasses}><CardContent className="p-6"><Skeleton className="h-24 w-full bg-muted/50" /></CardContent></Card>
            <Card className={cardClasses}><CardContent className="p-6"><Skeleton className="h-32 w-full bg-muted/50" /></CardContent></Card>
            <Card className={cardClasses}><CardContent className="p-6"><Skeleton className="h-32 w-full bg-muted/50" /></CardContent></Card>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <SectionTitle
          title={dictionary['Auth.notLoggedInTitle'] || "Not Logged In"}
          subtitle={dictionary['Auth.notLoggedInSubtitle'] || "Please log in to view your profile."}
          icon={UserCircle}
          className="mb-12"
        />
        <Card className={`${cardClasses} w-full max-w-md mx-auto p-8`}>
          <p className="font-body text-lg mb-6">{dictionary['Auth.pleaseLoginToProfile'] || "You need to be logged in to access your profile and settings."}</p>
          <Button asChild className="w-full font-body">
            <Link href={`/${locale}/login`}>
              <LogIn className="mr-2 h-5 w-5" />
              {dictionary['Auth.goToLoginButton'] || "Go to Login Page"}
            </Link>
          </Button>
        </Card>
      </main>
    );
  }

  const displayName = user.displayName || (dictionary['ProfilePage.defaultUsername'] || "Astro User");
  const displayEmail = user.email || (dictionary['ProfilePage.defaultEmail'] || "No email provided");
  const userInitial = displayName.substring(0, 1).toUpperCase();
  const userSecondInitial = displayName.split(' ')[1] ? displayName.split(' ')[1].substring(0,1).toUpperCase() : (displayName.length > 1 ? displayName.substring(1,2) : '');


  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['ProfilePage.title']}
        subtitle={(dictionary['ProfilePage.welcomeUserSubtitle'] || "Welcome back, {username}!").replace('{username}', displayName)}
        icon={UserCircle}
        className="mb-12"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        <div className="md:col-span-1 space-y-6 md:space-y-8">
          <Card className={cardClasses}>
            <CardHeader className="items-center text-center p-4 md:p-6">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 mb-4 border-4 border-primary shadow-md">
                <AvatarImage src={user.photoURL || undefined} alt={displayName} />
                <AvatarFallback className="text-3xl md:text-4xl bg-muted/50">
                  {userInitial}{userSecondInitial}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl md:text-2xl font-headline">{displayName}</CardTitle>
              <CardDescription className="font-body text-muted-foreground text-xs md:text-sm">{displayEmail}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 text-center space-y-3">
              <Button variant="outline" className="w-full font-body text-xs md:text-sm" asChild>
                <Link href={`/${locale}/onboarding`}>
                  <Edit3 className="mr-2 h-4 w-4" /> {dictionary['ProfilePage.editProfileButton'] || "Edit Profile"}
                </Link>
              </Button>
               <Button onClick={handleLogout} variant="destructive" className="w-full font-body text-xs md:text-sm">
                <LogOut className="mr-2 h-4 w-4" />
                {dictionary['Auth.logoutButton'] || "Logout"}
              </Button>
              <p className="text-xs text-muted-foreground pt-2 font-body">
                <CalendarDays className="inline h-3 w-3 mr-1" />
                {(dictionary['ProfilePage.memberSince'] || "Member since: {date}").replace('{date}', placeholderJoinDate)}
              </p>
            </CardContent>
          </Card>

          <Card className={cardClasses}>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="font-headline text-lg md:text-xl flex items-center gap-2">
                <ShieldQuestion className="h-5 w-5 text-primary" />
                {dictionary['ProfilePage.preferencesTitle'] || "Astrological Preferences"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3 font-body text-sm md:text-base">
                <div className="flex justify-between">
                  <span>{dictionary['ProfilePage.favoriteSignLabel'] || "Favorite Sign:"}</span>
                  <span className="font-semibold text-accent-foreground">{dictionary['Leo'] || "Leo"}</span>
                </div>
                <Separator className="bg-white/10" />
                <div className="flex justify-between">
                  <span>{dictionary['ProfilePage.communicationPrefsLabel'] || "Communication Preferences:"}</span>
                  <span className="font-semibold text-accent-foreground">{dictionary['ProfilePage.communicationEmailWeekly'] || "Email (Weekly Digest)"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6 md:space-y-8">
          <Card className={cardClasses}>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="font-headline text-lg md:text-xl">{dictionary['ProfilePage.aboutMeTitle'] || "About Me"}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="font-body text-card-foreground leading-relaxed text-sm md:text-base">{dictionary['ProfilePage.placeholderBio']}</p>
            </CardContent>
          </Card>

          <Card className={cardClasses}>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="font-headline text-lg md:text-xl flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary"/>
                {dictionary['ProfilePage.accountSettingsTitle'] || "Account Settings"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 md:p-6 pt-0">
               <div className="space-y-1">
                <Label htmlFor="username-profile" className="block text-xs md:text-sm font-medium text-muted-foreground">{dictionary['ProfilePage.usernameLabel'] || "Username"}</Label>
                <Input type="text" id="username-profile" value={displayName} className="font-body text-sm md:text-base bg-input/50 border-white/10" readOnly />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email-profile" className="block text-xs md:text-sm font-medium text-muted-foreground">{dictionary['ProfilePage.emailLabel'] || "Email Address"}</Label>
                <Input type="email" id="email-profile" value={displayEmail} className="font-body text-sm md:text-base bg-input/50 border-white/10" readOnly />
              </div>
              <Button className="font-body text-xs md:text-sm" disabled>{dictionary['ProfilePage.updateSettingsButton'] || "Update Settings"}</Button>
            </CardContent>
          </Card>

          <Card className={`${cardClasses} border-primary/50`}>
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="font-headline text-lg md:text-xl text-primary flex items-center gap-2">
                <Award className="h-5 w-5" />
                {dictionary['ProfilePage.premiumTitle'] || "Unlock Premium Features"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <p className="font-body text-muted-foreground mb-4 text-sm md:text-base">
                {dictionary['ProfilePage.premiumDescription'] || "Elevate your cosmic journey with our exclusive premium benefits."}
              </p>
              <ul className="list-disc list-inside space-y-1.5 font-body text-card-foreground mb-6 text-xs md:text-sm">
                <li>{dictionary['ProfilePage.premiumBenefitAdFree'] || "Ad-free experience"}</li>
                <li>{dictionary['ProfilePage.premiumBenefitExclusive'] || "Exclusive astrological content & readings"}</li>
                <li>{dictionary['ProfilePage.premiumBenefitEarlyAccess'] || "Early access to new features"}</li>
                <li>{dictionary['ProfilePage.premiumBenefitSupport'] || "Priority customer support"}</li>
              </ul>
              <Button className="w-full font-body text-xs md:text-sm bg-primary hover:bg-primary/90 text-primary-foreground" disabled>
                <Star className="mr-2 h-4 w-4" />
                {dictionary['ProfilePage.premiumButton'] || "Go Premium"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
