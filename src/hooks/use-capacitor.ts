/**
 * Hook para manejo de Capacitor y funcionalidades nativas
 */

import { useState, useEffect } from 'react';
import { getCapacitorInfo, capacitorFetch } from '@/lib/capacitor-utils';
import type { EmailComposerPlugin, SendOptions } from '@capacitor-community/email-composer';

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
    if (state.isCapacitor && (window as any).Capacitor?.Plugins?.Toast) {
      try {
        await (window as any).Capacitor.Plugins.Toast.show({
          text: message,
          duration: 'short',
          position: 'bottom'
        });
      } catch (error) {
        console.warn('Toast plugin not available, using console log fallback.');
        console.log(`📱 Toast: ${message}`);
      }
    } else {
      console.log(`💬 Toast: ${message}`);
    }
  };

  const openUrl = async (url: string) => {
    if (state.isCapacitor && url.startsWith('mailto:')) {
      const emailComposer = (window as any).Capacitor?.Plugins?.EmailComposer as EmailComposerPlugin | undefined;
      if (emailComposer) {
        try {
          const params = new URLSearchParams(url.split('?')[1]);
          const options: SendOptions = {
            to: [url.substring(7).split('?')[0]],
            subject: params.get('subject') || '',
            body: params.get('body') || '',
            isHtml: false
          };
          await emailComposer.open(options);
        } catch (error) {
           console.error('❌ Error opening email client via Capacitor:', error);
           window.open(url, '_system'); // Fallback to system open
        }
      } else {
         console.warn('EmailComposer plugin not found, trying system open.');
         window.open(url, '_system');
      }
    } else if (state.isCapacitor && (window as any).Capacitor?.Plugins?.Browser) {
      try {
        await (window as any).Capacitor.Plugins.Browser.open({ url });
      } catch (error) {
        console.error('❌ Error opening URL in Capacitor Browser:', error);
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
