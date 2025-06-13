
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
  markOnboardingAsComplete: () => void; // No UID needed, will use current user
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getOnboardingStatusKey = (uid: string) => `onboardingComplete_${uid}`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    if (!appInitializedSuccessfully || !auth) {
      console.warn("AuthContext: Firebase not properly initialized. Auth features will be disabled.");
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
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        setUser(authUser);
        // Redirection logic after auth state is confirmed will be handled in login/signup
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [hasMounted, pathname, toast]);

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
      const firebaseUser = userCredential.user;
      const dictionary = await getDictionary(locale);
      toast({
        title: dictionary['Auth.loginSuccessTitle'] || "Login Successful",
        description: (dictionary['Auth.welcomeBack'] || "Welcome back!").replace('{email}', firebaseUser.email || 'user'),
      });

      const onboardingComplete = localStorage.getItem(getOnboardingStatusKey(firebaseUser.uid)) === 'true';
      if (onboardingComplete) {
        router.push(`/${locale}/profile`);
      } else {
        router.push(`/${locale}/onboarding`);
      }
    } catch (error: any) {
      await handleAuthError(error, locale, 'login');
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

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
        // Explicitly set user here to ensure context is updated before potential redirect checks
        const authUser: AuthUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: username,
        };
        setUser(authUser);
        
        localStorage.removeItem(getOnboardingStatusKey(userCredential.user.uid)); // Ensure onboarding is fresh

        const dictionary = await getDictionary(locale);
        toast({
            title: dictionary['Auth.signupSuccessTitle'] || "Signup Successful",
            description: (dictionary['Auth.welcomeNewUser'] || "Welcome, {username}! Your account has been created.").replace('{username}', username),
        });
        router.push(`/${locale}/onboarding`);
      }
    } catch (error: any) {
      await handleAuthError(error, locale, 'signup');
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  const logout = useCallback(async (locale: Locale) => {
    if (!appInitializedSuccessfully || !auth) {
      setUser(null);
      setIsLoading(false);
      router.push(`/${locale}/login`);
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
      // User will be set to null by onAuthStateChanged
      // Redirect to home or login after logout
      const loginPath = `/${locale}/login`;
      router.push(loginPath);
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
  }, [router, toast]);


  const markOnboardingAsComplete = useCallback(() => {
    if (user?.uid) {
      localStorage.setItem(getOnboardingStatusKey(user.uid), 'true');
      // Optionally, trigger a re-check or state update if needed elsewhere,
      // but for now, layout effect will handle future navigations.
    } else {
      console.warn("markOnboardingAsComplete called without a user.");
    }
  }, [user]);


  // This effect is primarily for handling the initial load and already logged-in users
  // Redirection after login/signup actions is handled within those functions.
  useEffect(() => {
    if (!hasMounted || isLoading || !user || !appInitializedSuccessfully) {
      return;
    }

    const onboardingComplete = localStorage.getItem(getOnboardingStatusKey(user.uid)) === 'true';
    const currentPath = pathname.split('/').slice(2).join('/'); // Get path without locale
    const localeFromPath = pathname.split('/')[1] as Locale || 'es';

    if (!onboardingComplete && currentPath !== 'onboarding' && currentPath !== 'login') {
      router.push(`/${localeFromPath}/onboarding`);
    }
  }, [user, isLoading, pathname, router, hasMounted, appInitializedSuccessfully]);


  if (!hasMounted) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, markOnboardingAsComplete }}>
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
