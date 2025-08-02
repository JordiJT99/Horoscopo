"use client";

import type { AuthUser } from '@/types';
import type { Locale } from '@/lib/dictionaries';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
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
  markOnboardingAsComplete: () => void;
  updateUsername: (newName: string, locale: Locale) => Promise<void>;
  onboardingComplete: boolean | null;
  checkOnboardingStatus: () => boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getOnboardingStatusKey = (uid: string) => `onboardingComplete_${uid}`;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
          photoURL: firebaseUser.photoURL,
        };
        setUser(authUser);
        
        // Check onboarding status when user is set
        const onboardingStatus = localStorage.getItem(getOnboardingStatusKey(firebaseUser.uid)) === 'true';
        setOnboardingComplete(onboardingStatus);
      } else {
        setUser(null);
        setOnboardingComplete(null);
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
      setOnboardingComplete(onboardingComplete);
      
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
        const authUser: AuthUser = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: username,
          photoURL: null,
        };
        setUser(authUser);
        
        localStorage.removeItem(getOnboardingStatusKey(userCredential.user.uid));
        setOnboardingComplete(false);

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
  
  const updateUsername = useCallback(async (newName: string, locale: Locale) => {
    const dictionary = await getDictionary(locale);
    if (!auth?.currentUser) {
      toast({ title: dictionary['Error.genericTitle'] || "Error", description: "No user is currently signed in.", variant: "destructive" });
      return;
    }
    
    try {
      await updateProfile(auth.currentUser, { displayName: newName });
      setUser(prevUser => prevUser ? { ...prevUser, displayName: newName } : null);
      toast({ title: dictionary['ProfilePage.accountUpdateSuccessTitle'] || "Account Updated", description: dictionary['ProfilePage.accountUpdateSuccessMessage'] || "Your username has been successfully updated." });
    } catch (error: any) {
      console.error("Error updating username:", error);
      toast({ title: dictionary['ProfilePage.accountUpdateErrorTitle'] || "Update Error", description: error.message || "Could not update your username.", variant: "destructive" });
    }
  }, [toast]);

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
      const key = getOnboardingStatusKey(user.uid);
      localStorage.setItem(key, 'true');
      
      // Update state immediately to prevent race conditions
      setOnboardingComplete(true);
      
      // Small delay to ensure state has updated before redirect
      setTimeout(() => {
        const localeFromPath = pathname.split('/')[1] as Locale || 'es';
        router.push(`/${localeFromPath}/profile`);
      }, 100);
    } else {
      console.warn("markOnboardingAsComplete called without a user.");
    }
  }, [user, pathname, router]);

  const checkOnboardingStatus = useCallback(() => {
    if (user?.uid) {
      return localStorage.getItem(getOnboardingStatusKey(user.uid)) === 'true';
    }
    return null;
  }, [user]);

  // Centralized redirection logic
  useEffect(() => {
    if (!hasMounted || isLoading || !appInitializedSuccessfully) {
      return; // Wait for auth state to be confirmed
    }

    const localeFromPath = pathname.split('/')[1] as Locale || 'es';
    const loginPath = `/${localeFromPath}/login`;
    const onboardingPath = `/${localeFromPath}/onboarding`;
    const isLoginPage = pathname === loginPath;
    const isOnboardingPage = pathname === onboardingPath;
    const isEditingOnboarding = searchParams.get('mode') === 'edit';


    if (user) {
      const onboardingComplete = localStorage.getItem(getOnboardingStatusKey(user.uid)) === 'true';

      if (onboardingComplete) {
        // User is fully set up.
        // Redirect them from login.
        // Redirect them from onboarding ONLY IF they are not in edit mode.
        if (isLoginPage || (isOnboardingPage && !isEditingOnboarding)) {
          router.push(`/${localeFromPath}/profile`);
        }
        // Don't redirect from onboarding page when completing - let markOnboardingAsComplete handle it
      } else {

        // User is logged in but has NOT completed onboarding.
        // Force them to the onboarding page if they are anywhere else.
        if (!isOnboardingPage) {
          router.push(onboardingPath);
        }
      }
    } else {
      // No user is logged in. No redirection logic here, as some pages might be public.
    }
  }, [user, isLoading, pathname, router, hasMounted, appInitializedSuccessfully, searchParams]);


  if (!hasMounted) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      markOnboardingAsComplete, 
      updateUsername,
      onboardingComplete,
      checkOnboardingStatus 
    }}>
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
