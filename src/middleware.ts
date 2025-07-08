import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

let locales = ['es', 'en', 'de', 'fr'];
const defaultLocale = 'es';

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  let languages: string[] | undefined;
  try {
    languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  } catch (e) {
    // Handle cases where Negotiator might fail (e.g. invalid headers)
    languages = [defaultLocale];
  }
  
  try {
    return match(languages, locales, defaultLocale);
  } catch (e) {
    // Fallback if match fails
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    // Preserve search parameters if any
    const newUrl = new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/` and static assets in /public
  matcher: [
    '/((?!api|_next/static|_next/image|custom_assets|images|favicon.ico|firebase-messaging-sw.js).*)',
  ],
};
