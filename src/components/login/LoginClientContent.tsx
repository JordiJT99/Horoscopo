
"use client"; // This is a Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, UserPlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Dictionary, Locale } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

// Interface for LoginClientContent props
interface LoginClientContentProps {
  dictionary: Dictionary;
  locale: Locale;
}

export default function LoginClientContent({ dictionary, locale }: LoginClientContentProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // For signup
  const { login, signup, user, isLoading: authIsLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignupMode, setIsSignupMode] = useState(false);

  // The main redirection logic is now centralized in AuthContext to avoid race conditions.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isSignupMode) {
      if (username.trim() && email.trim() && password) {
        try {
          await signup(email.trim(), password, username.trim(), locale);
          // Redirection is handled by AuthContext
        } catch (e) {
          // Error is handled by AuthContext's toast
        }
      } else {
        toast({ title: dictionary['Auth.errorAllFieldsRequired'] || "All fields are required for signup.", variant: "destructive" });
      }
    } else {
      if (email.trim() && password) {
        try {
          await login(email.trim(), password, locale);
          // Redirection is handled by AuthContext
        } catch (e) {
          // Error is handled by AuthContext's toast
        }
      } else {
         toast({ title: dictionary['Auth.errorEmailPasswordRequired'] || "Email and password are required.", variant: "destructive" });
      }
    }
    setIsSubmitting(false);
  };

  // Show a loading spinner if auth is checking, or if a user is found (and will be redirected).
  if (authIsLoading || user) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-[calc(100vh-100px)]">
        <LoadingSpinner className="h-12 w-12 text-primary" />
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
                <LoadingSpinner className="mr-2 h-5 w-5" />
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
