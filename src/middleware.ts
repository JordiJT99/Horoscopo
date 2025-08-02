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
    languages = [defaultLocale];
  }
  
  try {
    return match(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    // Client-side logic will now handle localStorage.
    // The middleware's primary job is to ensure a locale is always present in the URL.
    // It will redirect to the browser's preferred language on the very first visit
    // before any client-side logic can run. Subsequent visits will be handled
    // by the client checking localStorage.
    const locale = getLocale(request);
    
    const newUrl = new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|custom_assets|images|favicon.ico|firebase-messaging-sw.js).*)',
  ],
};
