/**
 * Hook para manejo de Capacitor y funcionalidades nativas
 */

import { useState, useEffect } from 'react';
import { getCapacitorInfo, capacitorFetch } from '@/lib/capacitor-utils';

interface CapacitorState {
  isCapacitor: boolean;
  platform: 'ios' | 'android' | 'web';
  isReady: boolean;
  userAgent: string;
  hasWritePermissions: boolean;
}

export const useCapacitor = () => {
  const [state, setState] = useState<CapacitorState>({
    isCapacitor: false,
    platform: 'web',
    isReady: false,
    userAgent: '',
    hasWritePermissions: false
  });

  useEffect(() => {
    const initializeCapacitor = async () => {
      try {
        const info = getCapacitorInfo();
        
        // Test write permissions
        let hasWritePermissions = true;
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('capacitor_test', 'test');
            localStorage.removeItem('capacitor_test');
          }
        } catch (error) {
          console.warn('🚫 No write permissions in Capacitor WebView');
          hasWritePermissions = false;
        }

        setState({
          isCapacitor: info.isCapacitor,
          platform: info.platform,
          isReady: true,
          userAgent: info.userAgent,
          hasWritePermissions
        });

        if (info.isCapacitor) {
          console.log('📱 Capacitor initialized:', {
            platform: info.platform,
            hasWritePermissions
          });
        }
      } catch (error) {
        console.error('❌ Error initializing Capacitor:', error);
        setState(prev => ({ ...prev, isReady: true }));
      }
    };

    initializeCapacitor();
  }, []);

  const makeApiRequest = async (url: string, options: RequestInit = {}) => {
    if (state.isCapacitor) {
      return capacitorFetch(url, options);
    } else {
      return fetch(url, options);
    }
  };

  const showToast = async (message: string) => {
    if (state.isCapacitor && window.Capacitor) {
      try {
        // Intentar usar Toast plugin si está disponible
        if ((window as any).CapacitorToast) {
          await (window as any).CapacitorToast.show({
            text: message,
            duration: 'short',
            position: 'bottom'
          });
        } else {
          console.log(`📱 Capacitor Toast: ${message}`);
        }
      } catch (error) {
        console.log('📄 Toast plugin not available, using fallback');
        console.log(`📱 Toast: ${message}`);
      }
    } else {
      // Fallback para web
      console.log(`💬 Toast: ${message}`);
    }
  };

  const openUrl = async (url: string) => {
    if (state.isCapacitor && window.Capacitor) {
      try {
        // Intentar usar Browser plugin si está disponible
        if ((window as any).CapacitorBrowser) {
          await (window as any).CapacitorBrowser.open({ url });
        } else {
          window.open(url, '_system');
        }
      } catch (error) {
        console.error('❌ Error opening URL in Capacitor:', error);
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  };

  return {
    ...state,
    makeApiRequest,
    showToast,
    openUrl
  };
};
