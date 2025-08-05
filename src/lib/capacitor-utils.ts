/**
 * Utilidades específicas para Capacitor WebView
 */

import { Capacitor } from '@capacitor/core';
import { CapacitorHttp, type HttpOptions, type HttpResponse } from '@capacitor/core';


export const isCapacitor = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  if (typeof window === 'undefined') return 'web';
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

export const getCapacitorInfo = () => {
  if (typeof window === 'undefined') {
    return {
      isCapacitor: false,
      platform: 'web' as const,
      userAgent: 'server-side',
    };
  }

  return {
    isCapacitor: Capacitor.isNativePlatform(),
    platform: getPlatform(),
    userAgent: window.navigator.userAgent,
    hasCapacitorObject: !!window.Capacitor
  };
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  // Fallback for server-side execution - usar dominio de Firebase Hosting
  return 'https://astromistica-org.web.app'; 
};

// Función para hacer requests compatibles con Capacitor
export const capacitorFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  // Construir la URL completa usando el servidor correcto
  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : url;

  if (Capacitor.isNativePlatform()) {
    console.log(`🚀 Using CapacitorHttp for: ${fullUrl}`);
    const httpOptions: HttpOptions = {
      url: fullUrl,
      method: options.method || 'GET',
      headers: { ...options.headers } as { [key: string]: string },
      connectTimeout: 15000,
      readTimeout: 15000,
    };

    if (options.body) {
        try {
            // Check if body is already a string, otherwise stringify it.
            httpOptions.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        } catch(e) {
            // If parsing fails, it might be a simple string body.
            console.warn("Could not parse options.body as JSON for CapacitorHttp, sending as is.");
            httpOptions.data = options.body;
        }
    }
    
    try {
      const response: HttpResponse = await CapacitorHttp.request(httpOptions);
      
      // Construir una respuesta compatible con la API Fetch
      const responseBody = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);

      return new Response(responseBody, {
        status: response.status,
        headers: response.headers,
      });

    } catch (error) {
       console.error('❌ CapacitorHttp Request Exception:', error);
       // Lanzar un error que pueda ser capturado por los bloques try/catch existentes
       throw new Error(`CapacitorHttp failed: ${(error as Error).message}`);
    }

  } else {
    // Fallback para web
    console.log(`🌐 Using standard fetch for: ${url}`);
    const enhancedOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    try {
      const response = await fetch(url, enhancedOptions);
      
      if (!response.ok) {
        console.error('❌ Standard Fetch Error:', {
          status: response.status,
          statusText: response.statusText,
          url: fullUrl,
        });
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      return response;
    } catch (error) {
      console.error('❌ Standard Fetch Exception:', error);
      throw error;
    }
  }
};

// Declaraciones globales para TypeScript
declare global {
  interface Window {
    Capacitor?: any;
    CapacitorHttp?: any;
    CapacitorCookies?: any;
    CapacitorToast?: any;
    CapacitorBrowser?: any;
  }
}
