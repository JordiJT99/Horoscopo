
"use client";

import type { AuthUser } from '@/types';
import type { Locale } from '@/lib/dictionaries';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth, appInitializedSuccessfully } from '@/lib/firebase'; // Import appInitializedSuccessfully
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
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (!appInitializedSuccessfully || !auth) {
      console.warn("AuthContext: Firebase not properly initialized or auth instance is null. Auth features will be disabled.");
      setIsLoading(false);
      setUser(null);
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
  }, []);

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
      // setUser will be updated by onAuthStateChanged
      // router.push(`/${locale}/profile`); // Let onAuthStateChanged handle redirect if profile is protected
      const dictionary = await getDictionary(locale);
      toast({
        title: dictionary['Auth.loginSuccessTitle'] || "Login Successful",
        description: (dictionary['Auth.welcomeBack'] || "Welcome back!").replace('{email}', userCredential.user.email || 'user'),
      });
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
        // setUser will be updated by onAuthStateChanged. We can also set it here for faster UI update.
         setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: username, // Use the username passed to signup
        });
        // router.push(`/${locale}/profile`); // Let onAuthStateChanged handle redirect
        const dictionary = await getDictionary(locale);
        toast({
            title: dictionary['Auth.signupSuccessTitle'] || "Signup Successful",
            description: (dictionary['Auth.welcomeNewUser'] || "Welcome, {username}! Your account has been created.").replace('{username}', username),
        });
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
      // setUser to null will be handled by onAuthStateChanged
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
    if (!isLoading && user && pathname.includes('/login')) {
      const localeFromPath = pathname.split('/')[1] as Locale || 'es';
      router.push(`/${localeFromPath}/profile`);
    }
  }, [user, isLoading, pathname, router]);


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

