
"use client";

import type { Locale, Dictionary } from '@/lib/dictionaries';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCircle, Mail, Edit3, Save, LogOut, Award, ShieldQuestion } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton';
import SectionTitle from '@/components/shared/SectionTitle';

export default function ProfileClientContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const { user, isLoading, logout, updateUsername } = useAuth();
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  // Editing states
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  
  // Form data states
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');

  // Derived display values
  const displayName = user?.displayName || (dictionary['ProfilePage.defaultUsername'] || "Astro User");
  const displayEmail = user?.email || (dictionary['ProfilePage.defaultEmail'] || "No email provided");
  const userInitial = displayName.substring(0, 1).toUpperCase();

  // Load data on mount and when user changes
  useEffect(() => {
    setIsClient(true);
    if (user) {
      const storedBio = localStorage.getItem(`userBio_${user.uid}`) || (dictionary['ProfilePage.placeholderBio'] || "Lover of stars, seeker of cosmic wisdom.");
      setBio(storedBio);
      setUsername(user.displayName || '');
    }
  }, [user, dictionary]);

  const handleAboutEdit = () => {
    if (isEditingAbout) { // Was editing, now wants to save
      localStorage.setItem(`userBio_${user?.uid}`, bio);
      toast({ title: dictionary['ProfilePage.aboutUpdateSuccessTitle'] || "About Me Updated", description: dictionary['ProfilePage.aboutUpdateSuccessMessage'] || "Your bio has been saved." });
    }
    setIsEditingAbout(!isEditingAbout);
  };
  
  const handleAccountUpdate = async () => {
    if (!username.trim()) {
        toast({ title: dictionary['Error.genericTitle'], description: dictionary['OnboardingPage.errorNameRequired'], variant: 'destructive'});
        return;
    }
    await updateUsername(username, locale);
    // Let the context handle success/error toasts
  };

  const handleLogout = async () => {
    await logout(locale);
  };

  // Skeleton UI for loading state
  if (!isClient || isLoading) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <SectionTitle
          title={dictionary['ProfilePage.title'] || "User Profile"}
          subtitle={dictionary['ProfilePage.subtitle'] || "Manage your celestial identity."}
          icon={UserCircle}
          className="mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            <Skeleton className="h-[300px] w-full rounded-lg bg-card/50" />
            <Skeleton className="h-[150px] w-full rounded-lg bg-card/50" />
          </div>
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-[200px] w-full rounded-lg bg-card/50" />
            <Skeleton className="h-[250px] w-full rounded-lg bg-card/50" />
          </div>
        </div>
      </main>
    );
  }

  // UI for non-authenticated user
  if (!user) {
    return (
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center">
            <SectionTitle
                title={dictionary['Auth.notLoggedInTitle'] || "Not Logged In"}
                subtitle={dictionary['Auth.notLoggedInSubtitle'] || "Please log in to view your profile."}
                icon={UserCircle}
                className="mb-12"
            />
            <Card className="w-full max-w-md mx-auto p-8 bg-card/70 backdrop-blur-sm">
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

  // Main UI for authenticated user
  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['ProfilePage.title']}
        subtitle={(dictionary['ProfilePage.welcomeUserSubtitle'] || "Welcome back, {username}!").replace('{username}', displayName)}
        icon={UserCircle}
        className="mb-12"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="md:col-span-1 space-y-8">
          <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
            <CardHeader className="items-center text-center p-6">
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-lg">
                <AvatarImage src={user.photoURL || undefined} alt={displayName} />
                <AvatarFallback className="text-4xl bg-muted/50">{userInitial}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-headline">{displayName}</CardTitle>
              <CardDescription className="font-body text-muted-foreground">{displayEmail}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-center space-y-3">
              <Button variant="outline" className="w-full font-body" asChild>
                <Link href={`/${locale}/onboarding`}>
                  <Edit3 className="mr-2 h-4 w-4" /> {dictionary['ProfilePage.editProfileButton'] || "Edit Onboarding Data"}
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="w-full font-body">
                <LogOut className="mr-2 h-4 w-4" /> {dictionary['Auth.logoutButton'] || "Logout"}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <ShieldQuestion className="h-5 w-5 text-primary" />
                {dictionary['ProfilePage.preferencesTitle'] || "Astrological Preferences"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 text-sm">
                <p className="text-muted-foreground">{dictionary['MorePage.comingSoon'] || 'Coming Soon'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-8">
          <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <CardTitle className="font-headline text-xl">{dictionary['ProfilePage.aboutMeTitle'] || "About Me"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={handleAboutEdit}>
                {isEditingAbout ? <Save className="h-5 w-5 text-primary" /> : <Edit3 className="h-5 w-5" />}
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {isEditingAbout ? (
                <Textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={dictionary['ProfilePage.bioPlaceholder'] || 'Tell us about your cosmic journey...'}
                  className="min-h-[100px] bg-input/50"
                  maxLength={300}
                />
              ) : (
                <p className="font-body text-card-foreground leading-relaxed min-h-[100px] whitespace-pre-wrap">{bio}</p>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-card/70 backdrop-blur-sm border-white/10 shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="font-headline text-xl">{dictionary['ProfilePage.accountSettingsTitle'] || "Account Settings"}</CardTitle>
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

          <Card className="bg-card/70 backdrop-blur-sm border-primary/30 shadow-xl">
             <CardHeader className="p-6">
              <CardTitle className="font-headline text-xl text-primary flex items-center gap-2">
                <Award className="h-5 w-5" />
                {dictionary['ProfilePage.premiumTitle'] || "Unlock Premium Features"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">{dictionary['MorePage.comingSoon'] || 'Coming Soon'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
