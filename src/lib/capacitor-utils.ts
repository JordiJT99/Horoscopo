/**
 * Utilidades específicas para Capacitor WebView
 */

import { Capacitor } from '@capacitor/core';
import { Http, type HttpOptions, type HttpResponse } from '@capacitor/core';


export const isCapacitor = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  if (typeof window === 'undefined') return 'web';
  return Capacitor.getPlatform() as 'ios' | 'android' | 'web';
};

export const isCapacitorWebView = (): boolean => {
  if (typeof window === 'undefined') return false;
  return Capacitor.isWebView();
};

export const getCapacitorInfo = () => {
  if (typeof window === 'undefined') {
    return {
      isCapacitor: false,
      platform: 'web' as const,
      userAgent: 'server-side',
      isWebView: false
    };
  }

  return {
    isCapacitor: isCapacitor(),
    platform: getPlatform(),
    userAgent: window.navigator.userAgent,
    isWebView: isCapacitorWebView(),
    hasCapacitorObject: !!window.Capacitor
  };
};

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://astromistica.org'; 
};

// Función para hacer requests compatibles con Capacitor
export const capacitorFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const fullUrl = url.startsWith('/') ? `https://astromistica.org${url}` : url;

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
      httpOptions.data = JSON.parse(options.body as string);
    }
    
    try {
      const response: HttpResponse = await Http.request(httpOptions);
      
      // Construir una respuesta compatible con la API Fetch
      return new Response(JSON.stringify(response.data), {
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
    console.log(`🌐 Using standard fetch for: ${fullUrl}`);
    const enhancedOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };
    try {
      const response = await fetch(fullUrl, enhancedOptions);
      
      if (!response.ok) {
        console.error('❌ Standard Fetch Error:', {
          status: response.status,
          statusText: response.statusText,
          url: fullUrl,
        });
        throw new Error(`HTTP error! status: ${response.status}`);
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
