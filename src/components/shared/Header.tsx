import Link from 'next/link';
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { AstroAppLogo } from '@/lib/constants';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  dictionary: Dictionary;
  currentLocale: Locale;
}

const locales = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
];

const Header = ({ dictionary, currentLocale }: HeaderProps) => {
  return (
    <header className="py-4 bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href={`/${currentLocale}/`} className="flex items-center gap-3 text-primary-foreground hover:opacity-90 transition-opacity">
          <AstroAppLogo className="h-10 w-10" />
          <h1 className="text-3xl md:text-4xl font-headline font-bold">
            {dictionary['Header.title']}
          </h1>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
              <Globe className="h-6 w-6" />
              <span className="sr-only">Change language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {locales.map((locale) => (
              <DropdownMenuItem key={locale.code} asChild>
                <Link href={`/${locale.code}`} locale={locale.code} className={currentLocale === locale.code ? 'font-bold' : ''}>
                  {locale.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
