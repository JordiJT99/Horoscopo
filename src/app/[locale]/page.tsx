
// AstroVibesHomePageWrapper is the async Server Component (default export)
import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import { Sparkles as GlobalSparklesIcon } from 'lucide-react';
import { useMemo } from 'react'; // useMemo can be used in Server Components for promises
import { use } from 'react'; // The `use` hook for resolving promises in Server Components

// Import the new client component
import AstroVibesHomePageContent from '@/components/home/AstroVibesHomePageContent';

interface AstroVibesHomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function AstroVibesHomePageWrapper({ params: paramsPromise }: AstroVibesHomePageProps) {
  const params = await paramsPromise;
  // Using useMemo and use here for dictionary loading is fine in Server Components if needed,
  // but direct await is often cleaner for initial data fetching.
  // For simplicity and directness in Server Component data fetching:
  const dictionary = await getDictionary(params.locale);

  if (!dictionary || Object.keys(dictionary).length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen bg-background text-foreground">
        <GlobalSparklesIcon className="h-12 w-12 animate-pulse text-primary mx-auto" />
        <p className="mt-4 font-body text-muted-foreground">Loading application data...</p>
      </div>
    );
  }
  
  return <AstroVibesHomePageContent dictionary={dictionary} locale={params.locale} />;
}

