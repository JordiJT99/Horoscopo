/**
 * Utilidades específicas para Capacitor WebView
 */

export const isCapacitor = (): boolean => {
  return !!(
    typeof window !== 'undefined' &&
    window.Capacitor &&
    window.Capacitor.isNativePlatform &&
    window.Capacitor.isNativePlatform()
  );
};

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  if (typeof window === 'undefined') return 'web';
  
  if (window.Capacitor?.getPlatform) {
    return window.Capacitor.getPlatform() as 'ios' | 'android' | 'web';
  }
  
  return 'web';
};

export const isCapacitorWebView = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  
  // Detectar indicadores específicos de Capacitor
  return !!(
    window.Capacitor ||
    userAgent.includes('capacitor') ||
    userAgent.includes('ionic') ||
    (userAgent.includes('wv') && (userAgent.includes('android') || userAgent.includes('iphone')))
  );
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

// Headers específicos para requests desde Capacitor
export const getCapacitorHeaders = (): Record<string, string> => {
  const info = getCapacitorInfo();
  
  return {
    'User-Agent': info.userAgent,
    'X-Platform': info.platform,
    'X-Is-Capacitor': info.isCapacitor.toString(),
    'X-Is-WebView': info.isWebView.toString(),
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
};

// Función para hacer requests compatibles con Capacitor
export const capacitorFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const capacitorHeaders = getCapacitorHeaders();
  
  const enhancedOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...capacitorHeaders,
      ...options.headers,
    },
    credentials: 'omit', // Capacitor no maneja bien las cookies
    mode: 'cors'
  };

  console.log('🔧 Capacitor Fetch:', {
    url,
    platform: getPlatform(),
    isCapacitor: isCapacitor(),
    headers: enhancedOptions.headers
  });

  try {
    const response = await fetch(url, enhancedOptions);
    
    if (!response.ok) {
      console.error('❌ Capacitor Fetch Error:', {
        status: response.status,
        statusText: response.statusText,
        url
      });
    }
    
    return response;
  } catch (error) {
    console.error('❌ Capacitor Fetch Exception:', error);
    throw error;
  }
};

// Declaraciones globales para TypeScript
declare global {
  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      getPlatform?: () => string;
      platform?: string;
    };
  }
}
