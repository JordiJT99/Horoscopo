
"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { AstroAppLogo } from '@/lib/constants';
import { Globe, UserCircle, LogIn } from 'lucide-react'; // Added LogIn
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from '@/components/ui/sidebar'; 
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface HeaderProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const availableLocales = [
  { code: 'es' as Locale, name: 'Español' },
  { code: 'en' as Locale, name: 'English' },
  { code: 'de' as Locale, name: 'Deutsch' },
  { code: 'fr' as Locale, name: 'Français' },
];

const Header = ({ dictionary, currentLocale }: HeaderProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth(); // Get user and isLoading from context

  const getLocalizedPath = (locale: Locale) => {
    if (!pathname) return `/${locale}`;
    const segments = pathname.split('/');
    segments[1] = locale; 
    let newPath = segments.join('/');
    const queryString = searchParams.toString();
    if (queryString) {
      newPath += `?${queryString}`;
    }
    return newPath;
  };

  return (
    <header className="py-4 bg-sidebar shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="md:hidden"> 
            <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          </div>
          <Link href={`/${currentLocale}/`} className="flex items-center gap-3 text-sidebar-foreground hover:opacity-90 transition-opacity">
            <AstroAppLogo className="h-10 w-10" />
            <h1 className="text-3xl md:text-4xl font-headline font-bold">
              {dictionary['Header.title']}
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <Button variant="ghost" size="icon" asChild className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Link href={`/${currentLocale}/profile`} title={dictionary['Sidebar.profileTooltip'] || "View Your Profile"}>
                <UserCircle className="h-7 w-7" />
                <span className="sr-only">{dictionary['Sidebar.profile'] || "User Profile"}</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="default" asChild className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-3">
              <Link href={`/${currentLocale}/login`}>
                <LogIn className="h-5 w-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{dictionary['Auth.loginRegisterButton'] || "Login / Register"}</span>
                <span className="sm:hidden">{dictionary['Auth.loginButtonShort'] || "Login"}</span>
              </Link>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <Globe className="h-7 w-7" />
                <span className="sr-only">{dictionary['Header.changeLanguage'] || "Change language"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {availableLocales.map((locale) => (
                <DropdownMenuItem key={locale.code} asChild>
                  <Link href={getLocalizedPath(locale.code)} locale={locale.code} className={currentLocale === locale.code ? 'font-bold' : ''}>
                    {locale.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
