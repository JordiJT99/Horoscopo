
import type { Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCircle, Mail, CalendarDays, Edit3, Gem, Star } from 'lucide-react';
import Image from 'next/image';

interface ProfilePageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default async function ProfilePage({ params: paramsPromise }: ProfilePageProps) {
  const params = await paramsPromise;
  const dictionary = await getDictionary(params.locale);

  // Placeholder user data
  const userData = {
    username: "AstroFan123",
    email: "user@example.com",
    joinDate: new Date(2023, 0, 15).toLocaleDateString(params.locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    avatarUrl: "https://placehold.co/128x128.png",
    bio: dictionary['ProfilePage.placeholderBio'] || "Lover of stars, seeker of cosmic wisdom. Exploring the universe one horoscope at a time.",
  };

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
              <Avatar className="w-32 h-32 mb-4 border-4 border-primary shadow-md">
                <Image 
                  src={userData.avatarUrl} 
                  alt={dictionary['ProfilePage.avatarAlt'] || 'User Avatar'} 
                  width={128} 
                  height={128} 
                  className="rounded-full"
                  data-ai-hint="avatar person" 
                />
                <AvatarFallback>{userData.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-headline">{userData.username}</CardTitle>
              <CardDescription className="font-body text-muted-foreground">{userData.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" className="w-full font-body">
                <Edit3 className="mr-2 h-4 w-4" /> {dictionary['ProfilePage.editProfileButton'] || "Edit Profile"}
              </Button>
              <p className="text-xs text-muted-foreground mt-4 font-body">
                {(dictionary['ProfilePage.memberSince'] || "Member since: {date}").replace('{date}', userData.joinDate)}
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
              <p className="font-body text-card-foreground leading-relaxed mb-6">{userData.bio}</p>
              
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
                <label htmlFor="username-profile" className="block text-sm font-medium text-muted-foreground">{dictionary['ProfilePage.usernameLabel'] || "Username"}</label>
                <input type="text" id="username-profile" defaultValue={userData.username} className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm bg-background font-body" readOnly />
              </div>
              <div>
                <label htmlFor="email-profile" className="block text-sm font-medium text-muted-foreground">{dictionary['ProfilePage.emailLabel'] || "Email Address"}</label>
                <input type="email" id="email-profile" defaultValue={userData.email} className="mt-1 block w-full p-2 border border-input rounded-md shadow-sm bg-background font-body" readOnly />
              </div>
              <Button className="font-body">{dictionary['ProfilePage.updateSettingsButton'] || "Update Settings"}</Button>
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
              <Button className="w-full font-body bg-primary hover:bg-primary/90 text-primary-foreground">
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
