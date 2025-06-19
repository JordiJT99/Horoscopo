
"use client";

import { useState, useEffect, use, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import SectionTitle from '@/components/shared/SectionTitle';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  params: { locale: Locale };
}

function LoginContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // For signup
  const { login, signup, user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);

  useEffect(() => {
    if (!authIsLoading && user) {
      // User is logged in, redirect to profile or home
      // AuthContext usually handles redirection to onboarding if needed.
      // If onboarding is complete, go to profile.
      const onboardingComplete = localStorage.getItem(`onboardingComplete_${user.uid}`) === 'true';
      if (onboardingComplete) {
        router.push(`/${locale}/profile`);
      } else {
        router.push(`/${locale}/onboarding`);
      }
    }
  }, [user, authIsLoading, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isSignupMode) {
      if (username.trim() && email.trim() && password) {
        try {
          await signup(email.trim(), password, username.trim(), locale);
          // Redirection is handled by AuthContext or useEffect
        } catch (e) {
          // Error is handled by AuthContext's toast
        }
      } else {
        toast({ title: dictionary['Error.genericTitle'] || "Error", description: dictionary['Auth.errorAllFieldsRequired'] || "All fields are required for signup.", variant: "destructive" });
      }
    } else {
      if (email.trim() && password) {
        try {
          await login(email.trim(), password, locale);
          // Redirection is handled by AuthContext or useEffect
        } catch (e) {
          // Error is handled by AuthContext's toast
        }
      } else {
         toast({ title: dictionary['Error.genericTitle'] || "Error", description: dictionary['Auth.errorEmailPasswordRequired'] || "Email and password are required.", variant: "destructive" });
      }
    }
    setIsSubmitting(false);
  };

  // Show loading spinner if auth is loading OR if user is already logged in (and about to be redirected)
  if (authIsLoading || (!authIsLoading && user)) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={isSignupMode ? (dictionary['Auth.signupTitle'] || "Sign Up") : (dictionary['Auth.loginTitle'] || "Login")}
        subtitle={isSignupMode ? (dictionary['Auth.signupSubtitle'] || "Create your AstroVibes account.") : (dictionary['Auth.loginSubtitle'] || "Access your AstroVibes account.")}
        icon={isSignupMode ? UserPlus : LogIn}
        className="mb-12"
      />
      <Card className="w-full max-w-md mx-auto shadow-xl bg-card/70 backdrop-blur-sm border border-white/10">
        <CardHeader className="px-4 py-4 md:px-6 md:py-5">
          <CardTitle className="font-headline text-xl md:text-2xl text-primary text-center">
            {isSignupMode ? (dictionary['Auth.signupFormTitle'] || "Create Your Account") : (dictionary['Auth.loginFormTitleNow'] || "Enter Your Credentials")}
          </CardTitle>
           <CardDescription className="text-center font-body text-sm md:text-base text-card-foreground/80">
            {isSignupMode ? (dictionary['Auth.signupFormDescription'] || "Fill in the details to join AstroVibes.") : (dictionary['Auth.loginFormDescriptionFirebase'] || "Login with your email and password.")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 md:space-y-5 px-4 pb-4 md:px-6 md:pb-6">
            {isSignupMode && (
              <div className="space-y-1.5">
                <Label htmlFor="username-signup" className="font-body text-sm md:text-base">
                  {dictionary['Auth.usernameLabel'] || "Username"}
                </Label>
                <Input
                  id="username-signup"
                  type="text"
                  placeholder={dictionary['Auth.usernamePlaceholder'] || "Enter your username"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isSignupMode}
                  className="font-body text-base py-2.5"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email-auth" className="font-body text-sm md:text-base">
                {dictionary['Auth.emailLabel'] || "Email"}
              </Label>
              <Input
                id="email-auth"
                type="email"
                placeholder={dictionary['Auth.emailPlaceholder'] || "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-body text-base py-2.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password-auth" className="font-body text-sm md:text-base">
                {dictionary['Auth.passwordLabel'] || "Password"}
              </Label>
              <Input
                id="password-auth"
                type="password"
                placeholder={dictionary['Auth.passwordPlaceholder'] || "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isSignupMode ? 6 : undefined}
                className="font-body text-base py-2.5"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 md:gap-4 pt-2 pb-4 px-4 md:pt-3 md:pb-6 md:px-6">
            <Button type="submit" className="w-full font-body py-3 text-base" disabled={isSubmitting || authIsLoading}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : isSignupMode ? (
                <UserPlus className="mr-2 h-5 w-5" />
              ) : (
                <LogIn className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? (dictionary['Auth.submitting'] || "Submitting...") : (isSignupMode ? (dictionary['Auth.signupButton'] || "Sign Up") : (dictionary['Auth.loginButton'] || "Login"))}
            </Button>
            <Button variant="link" type="button" onClick={() => setIsSignupMode(!isSignupMode)} className="font-body text-sm text-primary hover:text-primary/80">
              {isSignupMode ? (dictionary['Auth.switchToLogin'] || "Already have an account? Login") : (dictionary['Auth.switchToSignup'] || "Don't have an account? Sign Up")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

export default function LoginPage({ params: paramsPromise }: { params: Promise<LoginPageProps["params"]> }) {
  // It's generally safe to `use` paramsPromise directly, Next.js handles this.
  const params = use(paramsPromise);
  // The dictionaryPromise should also be resolved here.
  const dictionaryPromise = useMemo(() => getDictionary(params.locale), [params.locale]);
  const dictionary = use(dictionaryPromise);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || Object.keys(dictionary).length === 0) {
    // This loading state is good for when the dictionary is still being fetched.
    return (
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12 text-center min-h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  return <LoginContent dictionary={dictionary} locale={params.locale} />;
}

