import { useState, useEffect, useCallback, useRef } from 'react';
import type { ZodiacSignName, Locale, HoroscopeDetail } from '@/types';

interface UseHoroscopeFromDBOptions {
  sign: ZodiacSignName;
  locale: Locale;
  date?: string; // YYYY-MM-DD
}

interface UseHoroscopeFromDBResult {
  horoscope: HoroscopeDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useHoroscopeFromDB({
  sign,
  locale,
  date
}: UseHoroscopeFromDBOptions): UseHoroscopeFromDBResult {
  const [horoscope, setHoroscope] = useState<HoroscopeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar ref para evitar múltiples requests simultáneos
  const isLoadingRef = useRef(false);
  const cacheKeyRef = useRef<string>('');

  const fetchHoroscope = useCallback(async () => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = `${sign}-${targetDate}-${locale}`;
    
    // Evitar requests duplicados
    if (isLoadingRef.current && cacheKeyRef.current === cacheKey) {
      console.log(`⏸️ Request ya en progreso para: ${cacheKey}`);
      return;
    }
    
    try {
      isLoadingRef.current = true;
      cacheKeyRef.current = cacheKey;
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Cargando horóscopo desde BD: ${sign} - ${targetDate} (${locale})`);
      
      // Detectar WebView para logging adicional
      const isWebView = typeof window !== 'undefined' && (
        window.navigator.userAgent.includes('wv') || 
        window.navigator.userAgent.includes('WebView') ||
        // @ts-ignore
        window.ReactNativeWebView !== undefined
      );
      
      if (isWebView) {
        console.log(`📱 WebView detectada. UserAgent: ${window.navigator.userAgent}`);
      }
      
      const apiUrl = `/api/horoscopes/${targetDate}?locale=${locale}&sign=${sign}`;
      console.log(`🌐 Fetching: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Agregar headers específicos para WebView
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache'
        },
        // Agregar cache para evitar requests duplicados
        cache: 'no-store'
      });
      
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Horóscopo no encontrado para esta fecha');
        }
        
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('❌ Error parsing response JSON:', parseError);
          throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Data received:`, { hasHoroscope: !!data.horoscope, keys: Object.keys(data) });
      
      setHoroscope(data.horoscope);
      
      console.log(`✅ Horóscopo cargado desde BD: ${sign}`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error cargando horóscopo:', {
        error: errorMessage,
        sign,
        locale,
        date: targetDate,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR'
      });
      setError(errorMessage);
      setHoroscope(null);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [sign, locale, date]);

  useEffect(() => {
    fetchHoroscope();
  }, [fetchHoroscope]);

  return { 
    horoscope, 
    loading, 
    error,
    refetch: fetchHoroscope
  };
}

// Hook para cargar todos los horóscopos de una fecha
export function useAllHoroscopesFromDB(locale: Locale, date?: string) {
  const [horoscopes, setHoroscopes] = useState<Record<ZodiacSignName, HoroscopeDetail> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar ref para evitar múltiples requests simultáneos
  const isLoadingRef = useRef(false);
  const cacheKeyRef = useRef<string>('');

  const fetchAllHoroscopes = useCallback(async () => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const cacheKey = `all-${targetDate}-${locale}`;
    
    // Evitar requests duplicados
    if (isLoadingRef.current && cacheKeyRef.current === cacheKey) {
      console.log(`⏸️ Request ya en progreso para: ${cacheKey}`);
      return;
    }
    
    try {
      isLoadingRef.current = true;
      cacheKeyRef.current = cacheKey;
      setLoading(true);
      setError(null);
      
      console.log(`🔍 Cargando todos los horóscopos desde BD: ${targetDate} (${locale})`);
      
      const response = await fetch(`/api/horoscopes/${targetDate}?locale=${locale}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Horóscopos no encontrados para esta fecha');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      setHoroscopes(data.horoscopes);
      
      console.log(`✅ Todos los horóscopos cargados desde BD`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ Error cargando horóscopos:', errorMessage);
      setError(errorMessage);
      setHoroscopes(null);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [locale, date]);

  useEffect(() => {
    fetchAllHoroscopes();
  }, [fetchAllHoroscopes]);

  return { 
    horoscopes, 
    loading, 
    error,
    refetch: fetchAllHoroscopes
  };
}

// Hook para verificar si existen horóscopos para una fecha
export function useHoroscopeAvailability(locale: Locale, date?: string) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const checkAvailability = async () => {
      if (isLoadingRef.current) return;
      
      try {
        isLoadingRef.current = true;
        setLoading(true);
        
        const targetDate = date || new Date().toISOString().split('T')[0];
        const response = await fetch(`/api/horoscopes/${targetDate}?locale=${locale}`, {
          method: 'HEAD', // Solo verificar existencia, no descargar datos
        });
        
        setAvailable(response.ok);
      } catch (error) {
        setAvailable(false);
      } finally {
        setLoading(false);
        isLoadingRef.current = false;
      }
    };

    checkAvailability();
  }, [locale, date]);

  return { available, loading };
}
