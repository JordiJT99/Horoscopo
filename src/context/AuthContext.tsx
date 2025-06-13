
"use client";

import type { AuthUser } from '@/types';
import type { Locale } from '@/lib/dictionaries';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, email: string, locale: Locale) => void;
  logout: (locale: Locale) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'astrovibes_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY); // Clear corrupted data
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((username: string, email: string, locale: Locale) => {
    const newUser: AuthUser = { username, email };
    setUser(newUser);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
    router.push(`/${locale}/profile`);
  }, [router]);

  const logout = useCallback((locale: Locale) => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    // If on profile page, redirect to login, otherwise stay or go home
    if (pathname.includes('/profile')) {
        router.push(`/${locale}/login`);
    } else {
        router.push(`/${locale}/`);
    }
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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

