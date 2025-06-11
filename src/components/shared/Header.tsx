import Link from 'next/link';
import { AstroAppLogo } from '@/lib/constants';

const Header = () => {
  return (
    <header className="py-6 bg-primary shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-3 text-primary-foreground hover:opacity-90 transition-opacity">
          <AstroAppLogo className="h-10 w-10" />
          <h1 className="text-4xl font-headline font-bold">
            AstroVibes
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
