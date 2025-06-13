
"use client";

import type { AuthUser } from '@/types';
import type { Locale } from '@/lib/dictionaries';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, appInitializedSuccessfully } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { getDictionary } from '@/lib/dictionaries';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, locale: Locale) => Promise<void>;
  signup: (email: string, password: string, username: string, locale: Locale) => Promise<void>;
  logout: (locale: Locale) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false); // New state for client-side mount
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    setHasMounted(true); // Signal that the component has mounted on the client
  }, []);

  useEffect(() => {
    if (!hasMounted) return; // Don't run Firebase logic until mounted

    if (!appInitializedSuccessfully || !auth) {
      console.warn("AuthContext: Firebase not properly initialized or auth instance is null. Auth features will be disabled.");
      setIsLoading(false);
      setUser(null);
      (async () => {
        try {
          const locale = pathname.split('/')[1] as Locale || 'es';
          const dictionary = await getDictionary(locale);
          toast({
            title: dictionary['Error.genericTitle'] || "Error",
            description: dictionary['Auth.errorFirebaseNotConfigured'] || "Firebase not configured. Authentication features are disabled.",
            variant: "destructive",
          });
        } catch (e) {
          toast({
            title: "Error",
            description: "Firebase not configured. Authentication features are disabled. Dictionary load failed.",
            variant: "destructive",
          });
        }
      })();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [hasMounted, pathname, toast, appInitializedSuccessfully]); // Ensure auth is not in deps if it causes re-runs before init

  const handleAuthError = async (error: any, locale: Locale, actionType: 'login' | 'signup') => {
    const dictionary = await getDictionary(locale);
    let errorMessage = dictionary['Auth.errorDefault'] || "An unexpected error occurred.";
    let isCommonUserError = false;

    if (error.code) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = dictionary['Auth.errorInvalidCredentials'] || "Invalid email or password.";
          isCommonUserError = true;
          break;
        case 'auth/email-already-in-use':
          errorMessage = dictionary['Auth.errorEmailInUse'] || "This email is already in use.";
          isCommonUserError = true;
          break;
        case 'auth/weak-password':
          errorMessage = dictionary['Auth.errorWeakPassword'] || "Password is too weak. It should be at least 6 characters.";
          isCommonUserError = true;
          break;
        case 'auth/invalid-email':
           errorMessage = dictionary['Auth.errorInvalidEmail'] || "The email address is not valid.";
           isCommonUserError = true;
           break;
        default:
          errorMessage = dictionary[`Auth.errorFire.${error.code}`] || error.message || errorMessage;
      }
    }
    toast({
      title: (actionType === 'login' ? dictionary['Auth.loginErrorTitle'] : dictionary['Auth.signupErrorTitle']) || "Authentication Error",
      description: errorMessage,
      variant: "destructive",
    });

    if (isCommonUserError) {
      console.warn(`${actionType} user error (code: ${error.code}): ${error.message}`);
    } else {
      console.error(`${actionType} error (code: ${error.code}):`, error.message);
    }
  };

  const login = useCallback(async (email: string, password: string, locale: Locale) => {
    if (!appInitializedSuccessfully || !auth) {
      const dictionary = await getDictionary(locale);
      toast({ title: dictionary['Error.genericTitle'] || "Error", description: dictionary['Auth.errorFirebaseNotConfigured'] || "Firebase not configured. Cannot log in.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const dictionary = await getDictionary(locale);
      toast({
        title: dictionary['Auth.loginSuccessTitle'] || "Login Successful",
        description: (dictionary['Auth.welcomeBack'] || "Welcome back!").replace('{email}', userCredential.user.email || 'user'),
      });
       // router.push(`/${locale}/profile`); // Let useEffect handle redirect
    } catch (error: any) {
      await handleAuthError(error, locale, 'login');
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // Removed router dependency as redirect is handled by useEffect

  const signup = useCallback(async (email: string, password: string, username: string, locale: Locale) => {
    if (!appInitializedSuccessfully || !auth) {
      const dictionary = await getDictionary(locale);
      toast({ title: dictionary['Error.genericTitle'] || "Error", description: dictionary['Auth.errorFirebaseNotConfigured'] || "Firebase not configured. Cannot sign up.", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: username });
         setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: username,
        });
        const dictionary = await getDictionary(locale);
        toast({
            title: dictionary['Auth.signupSuccessTitle'] || "Signup Successful",
            description: (dictionary['Auth.welcomeNewUser'] || "Welcome, {username}! Your account has been created.").replace('{username}', username),
        });
        // router.push(`/${locale}/profile`); // Let useEffect handle redirect
      }
    } catch (error: any) {
      await handleAuthError(error, locale, 'signup');
    } finally {
      setIsLoading(false);
    }
  }, [toast]); // Removed router dependency

  const logout = useCallback(async (locale: Locale) => {
    if (!appInitializedSuccessfully || !auth) {
      setUser(null);
      setIsLoading(false);
      router.push(`/${locale}/login`); // Redirect to login if Firebase isn't even usable
      return;
    }
    setIsLoading(true);
    try {
      await signOut(auth);
      const dictionary = await getDictionary(locale);
      toast({
        title: dictionary['Auth.logoutSuccessTitle'] || "Logged Out",
        description: dictionary['Auth.logoutSuccessMessage'] || "You have been successfully logged out.",
      });
      const loginPath = `/${locale}/login`;
      const homePath = `/${locale}/`;
      if (pathname.startsWith(`/${locale}/profile`)) {
        router.push(loginPath);
      } else {
         router.push(homePath);
      }
    } catch (error: any) {
      const dictionary = await getDictionary(locale);
      toast({
        title: dictionary['Auth.logoutErrorTitle'] || "Logout Error",
        description: error.message || (dictionary['Auth.errorDefault'] || "An unexpected error occurred."),
        variant: "destructive",
      });
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router, pathname, toast]);

  useEffect(() => {
    // Effect to handle redirection after login/signup if user state changes
    // and current page is login, but user is now authenticated.
    if (hasMounted && !isLoading && user && pathname.includes('/login')) {
      const localeFromPath = pathname.split('/')[1] as Locale || 'es';
      router.push(`/${localeFromPath}/profile`);
    }
  }, [user, isLoading, pathname, router, hasMounted]);

  if (!hasMounted) {
    return null; // Don't render children until provider has mounted on client
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

