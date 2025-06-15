
"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { AstroAppLogo } from '@/lib/constants';
import { Globe, UserCircle, LogIn } from 'lucide-react'; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from '@/components/ui/sidebar'; 
import { useAuth } from '@/context/AuthContext'; 
import { Skeleton } from '@/components/ui/skeleton'; 

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
  const { user, isLoading } = useAuth(); 

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
    <header className="py-3 md:py-4 bg-sidebar shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          {/* SidebarTrigger is now always visible and on the far left */}
          <SidebarTrigger className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" />
          <Link href={`/${currentLocale}/`} className="flex items-center gap-2 md:gap-3 text-sidebar-foreground hover:opacity-90 transition-opacity">
            <AstroAppLogo className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-headline font-bold">
              {dictionary['Header.title']}
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {isLoading ? (
            <Skeleton className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full" />
          ) : user ? (
            <Button variant="ghost" size="icon" asChild className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
              <Link href={`/${currentLocale}/profile`} title={dictionary['Sidebar.profileTooltip'] || "View Your Profile"}>
                <UserCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                <span className="sr-only">{dictionary['Sidebar.profile'] || "User Profile"}</span>
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" asChild className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground px-2 sm:px-3 py-1 sm:py-2 h-8 sm:h-9 md:h-10 text-xs sm:text-sm">
              <Link href={`/${currentLocale}/login`}>
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">{dictionary['Auth.loginRegisterButton'] || "Login / Register"}</span>
                <span className="sm:hidden">{dictionary['Auth.loginButtonShort'] || "Login"}</span>
              </Link>
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
                <Globe className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
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
