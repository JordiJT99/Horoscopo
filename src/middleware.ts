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
  
  const isCapacitor = /capacitor/i.test(userAgent);

  const response = NextResponse.next();

  // Si la petición viene de Capacitor, añadir cabeceras CORS
  if (isCapacitor) {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Platform, X-Is-Capacitor');
      response.headers.set('X-Frame-Options', 'ALLOWALL');
  }

  // Excluir rutas de API, archivos estáticos y otros recursos de la lógica de localización
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
    return response;
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    
    const newUrl = new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value);
    });
    const redirectResponse = NextResponse.redirect(newUrl);

    // Copiar las cabeceras CORS a la respuesta de redirección si es de Capacitor
    if (isCapacitor) {
      redirectResponse.headers.set('Access-Control-Allow-Origin', '*');
      redirectResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      redirectResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Platform, X-Is-Capacitor');
    }
    
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * And other static assets
     */
    '/((?!_next/static|_next/image|custom_assets|images|favicon.ico|firebase-messaging-sw.js|sw.js|manifest.json).*)',
  ],
};
