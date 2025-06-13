
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
import { LogIn } from 'lucide-react';

interface LoginPageProps {
  params: { locale: Locale };
}

function LoginContent({ dictionary, locale }: { dictionary: Dictionary, locale: Locale }) {
  const [username, setUsername] = useState('');
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(`/${locale}/profile`); // Redirect if already logged in
    }
  }, [user, isLoading, router, locale]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim(), locale);
    }
  };

  if (isLoading || (!isLoading && user)) {
    return (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
      <SectionTitle
        title={dictionary['Auth.loginTitle'] || "Login"}
        subtitle={dictionary['Auth.loginSubtitle'] || "Access your AstroVibes account."}
        icon={LogIn}
        className="mb-12"
      />
      <Card className="w-full max-w-md mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary text-center">
            {dictionary['Auth.loginFormTitle'] || "Enter Your Username"}
          </CardTitle>
          <CardDescription className="text-center font-body">
            {dictionary['Auth.loginFormDescription'] || "This is a simulated login for demo purposes."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-body">
                {dictionary['Auth.usernameLabel'] || "Username"}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={dictionary['Auth.usernamePlaceholder'] || "Enter your username"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="font-body"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full font-body">
              <LogIn className="mr-2 h-4 w-4" />
              {dictionary['Auth.loginButton'] || "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

export default function LoginPage({ params: paramsPromise }: LoginPageProps) {
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
  
  return <LoginContent dictionary={dictionary} locale={params.locale} />;
}
