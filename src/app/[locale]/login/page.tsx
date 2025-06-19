// NO "use client" directive at the top. This is a Server Component.

// Imports used by LoginPage (Server Component part)
import type { Dictionary, Locale } from '@/lib/dictionaries';
import { getDictionary, getSupportedLocales } from '@/lib/dictionaries';
import LoginClientContent from '@/components/login/LoginClientContent'; // Import the new client component

// Required for static export with dynamic routes
export async function generateStaticParams() {
  const locales = getSupportedLocales();
  return locales.map((locale) => ({
    locale: locale,
  }));
}

// Interface for Page props (Server Component)
interface LoginPageParams {
  params: { locale: Locale };
}

// LoginPage is the default export and an async Server Component.
export default async function LoginPage({ params }: LoginPageParams) {
  const dictionary = await getDictionary(params.locale);

  // It fetches server-side data (dictionary) and passes it to LoginClientContent.
  return <LoginClientContent dictionary={dictionary} locale={params.locale} />;
}
