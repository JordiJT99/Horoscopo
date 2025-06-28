// Note: Top-level "use client"; has been removed.
// This page is now primarily a Server Component.

import type { Locale, Dictionary } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import SectionTitle from '@/components/shared/SectionTitle';
import { UserCircle } from 'lucide-react'; // Server-side icon for SectionTitle
import ProfileClientContent from '@/components/profile/ProfileClientContent'; // Import the new client component
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

interface ProfilePageParams {
  locale: Locale;
}

// This is the Server Component wrapper
export default async function ProfilePage({ params }: { params: ProfilePageParams }) {
  const dictionary = await getDictionary(params.locale);

  const ProfilePageSkeleton = () => (
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <SectionTitle
          title={dictionary['ProfilePage.title'] || "User Profile"}
          subtitle={dictionary['ProfilePage.subtitle'] || "Manage your celestial identity."}
          icon={UserCircle}
          className="mb-12"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            <Skeleton className="h-[300px] w-full rounded-lg bg-card/50" />
            <Skeleton className="h-[150px] w-full rounded-lg bg-card/50" />
          </div>
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-[200px] w-full rounded-lg bg-card/50" />
            <Skeleton className="h-[250px] w-full rounded-lg bg-card/50" />
          </div>
        </div>
      </main>
  );

  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <ProfileClientContent dictionary={dictionary} locale={params.locale} />
    </Suspense>
  );
}
