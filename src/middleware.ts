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
  const userAgent = request.headers.get('user-agent') || '';
  
  // Detectar Capacitor/WebView
  const isCapacitor = userAgent.includes('capacitor') || userAgent.includes('ionic');
  const isWebView = /webview|wv\)|capacitor|ionic/i.test(userAgent);
  const platform = request.headers.get('x-platform') || 'unknown';

  // Excluir rutas de API, archivos estáticos y otros recursos
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/custom_assets/') ||
    pathname.startsWith('/images/') ||
    pathname === '/favicon.ico' ||
    pathname === '/firebase-messaging-sw.js' ||
    pathname === '/sw.js' ||
    pathname === '/manifest.json'
  ) {
    const response = NextResponse.next();
    
    // Añadir headers específicos para Capacitor en rutas API
    if (pathname.startsWith('/api/') && (isCapacitor || isWebView)) {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Platform, X-Is-Capacitor');
      response.headers.set('Access-Control-Allow-Credentials', 'false');
      response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      response.headers.set('X-Frame-Options', 'ALLOWALL');
      
      console.log(`🔧 Capacitor headers added for API: ${pathname}, Platform: ${platform}`);
    }
    
    return response;
  }

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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * And other static assets
     */
    '/((?!api/|_next/static|_next/image|custom_assets|images|favicon.ico|firebase-messaging-sw.js|sw.js|manifest.json).*)',
  ],
};
