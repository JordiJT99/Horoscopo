
"use client";

import type { Locale } from '@/lib/dictionaries';
import { getDictionary, type Dictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar'; // AvatarImage removed as we don't have custom avatars yet
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Added Input import
import { Label } from '@/components/ui/label'; // Added Label import
import { UserCircle, Mail, CalendarDays, Edit3, Gem, Star, LogOut, LogIn } from 'lucide-react';
// import Image from 'next/image'; // Not used as Firebase user.photoURL might not be set
import { useAuth } from '@/context/AuthContext';
import { useEffect, use, useMemo, useState } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface ProfilePageProps {
  params: { locale: Locale };
}

function ProfileContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const { user, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    await logout(locale);
  };

  // Placeholder data for join date, as Firebase Auth doesn't directly provide it without Firestore
  const placeholderJoinDate = new Date(2023, 0, 15).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (isLoading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <SectionTitle
          title={dictionary['ProfilePage.title']}
          subtitle={dictionary['ProfilePage.subtitle']}
          icon={UserCircle}
          className="mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card className="shadow-xl">
              <CardHeader className="items-center text-center">
                <Skeleton className="w-32 h-32 rounded-full mb-4" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-8">
            <Card className="shadow-xl"><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
            <Card className="shadow-xl"><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
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
        <Card className="w-full max-w-md mx-auto shadow-xl p-8">
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

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['ProfilePage.title']}
        subtitle={(dictionary['ProfilePage.welcomeUserSubtitle'] || "Welcome back, {username}!").replace('{username}', displayName)}
        icon={UserCircle}
        className="mb-12"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="shadow-xl">
            <CardHeader className="items-center text-center">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-md">
                {/* Firebase user.photoURL could be used here if available with Image component */}
                <AvatarFallback className="text-4xl">
                  {displayName.substring(0, 1).toUpperCase()}
                  {displayName.split(' ')[1] ? displayName.split(' ')[1].substring(0,1).toUpperCase() : (displayName.length > 1 ? displayName.substring(1,2) : '')}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-headline">{displayName}</CardTitle>
              <CardDescription className="font-body text-muted-foreground">{displayEmail}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <Button variant="outline" className="w-full font-body" disabled> {/* Edit profile not implemented yet */}
                <Edit3 className="mr-2 h-4 w-4" /> {dictionary['ProfilePage.editProfileButton'] || "Edit Profile"}
              </Button>
               <Button onClick={handleLogout} variant="destructive" className="w-full font-body">
                <LogOut className="mr-2 h-4 w-4" />
                {dictionary['Auth.logoutButton'] || "Logout"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 font-body">
                <CalendarDays className="inline h-3 w-3 mr-1" />
                {(dictionary['ProfilePage.memberSince'] || "Member since: {date}").replace('{date}', placeholderJoinDate)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-xl">{dictionary['ProfilePage.aboutMeTitle'] || "About Me"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-card-foreground leading-relaxed mb-6">{dictionary['ProfilePage.placeholderBio']}</p>
              
              <h3 className="font-headline text-lg text-primary mb-3">{dictionary['ProfilePage.preferencesTitle'] || "Astrological Preferences"}</h3>
              <div className="space-y-2 font-body text-sm">
                <p>{dictionary['ProfilePage.favoriteSignLabel'] || "Favorite Sign:"} <span className="font-semibold text-accent-foreground">{dictionary['Leo'] || "Leo"}</span></p>
                <p>{dictionary['ProfilePage.communicationPrefsLabel'] || "Communication Preferences:"} <span className="font-semibold text-accent-foreground">{dictionary['ProfilePage.communicationEmailWeekly'] || "Email (Weekly Digest)"}</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl mt-8">
            <CardHeader>
              <CardTitle className="font-headline text-xl">{dictionary['ProfilePage.accountSettingsTitle'] || "Account Settings"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label htmlFor="username-profile" className="block text-sm font-medium text-muted-foreground">{dictionary['ProfilePage.usernameLabel'] || "Username"}</Label>
                <Input type="text" id="username-profile" value={displayName} className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm bg-background font-body" readOnly />
              </div>
              <div>
                <Label htmlFor="email-profile" className="block text-sm font-medium text-muted-foreground">{dictionary['ProfilePage.emailLabel'] || "Email Address"}</Label>
                <Input type="email" id="email-profile" value={displayEmail} className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm bg-background font-body" readOnly />
              </div>
              <Button className="font-body" disabled>{dictionary['ProfilePage.updateSettingsButton'] || "Update Settings"}</Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl mt-8 bg-gradient-to-br from-primary/20 to-accent/20 border-primary">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">
                <Gem className="h-5 w-5" />
                {dictionary['ProfilePage.premiumTitle'] || "Unlock Premium Features"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-muted-foreground mb-4">
                {dictionary['ProfilePage.premiumDescription'] || "Elevate your cosmic journey with our exclusive premium benefits."}
              </p>
              <ul className="list-disc list-inside space-y-2 font-body text-card-foreground mb-6">
                <li>{dictionary['ProfilePage.premiumBenefitAdFree'] || "Ad-free experience"}</li>
                <li>{dictionary['ProfilePage.premiumBenefitExclusive'] || "Exclusive astrological content & readings"}</li>
                <li>{dictionary['ProfilePage.premiumBenefitEarlyAccess'] || "Early access to new features"}</li>
                <li>{dictionary['ProfilePage.premiumBenefitSupport'] || "Priority customer support"}</li>
              </ul>
              <Button className="w-full font-body bg-primary hover:bg-primary/90 text-primary-foreground" disabled>
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


export default function ProfilePage({ params: paramsPromise }: ProfilePageProps) {
  const params = use(paramsPromise);
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4">Loading dictionary...</p>
      </div>
    );
  }

  return <ProfileContent dictionary={dictionary} locale={params.locale} />;
}

