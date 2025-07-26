// Configuración de Google AdSense
export const ADSENSE_CONFIG = {
  // Reemplaza con tu ID de editor de AdSense
  publisherId: process.env.NODE_ENV === 'development' 
    ? 'test' // Para desarrollo
    : 'ca-pub-XXXXXXXXXXXXXXXX', // Tu ID real de AdSense
  
  // IDs de anuncios (reemplaza con los reales)
  adSlots: {
    banner: process.env.NODE_ENV === 'development'
      ? 'test'
      : '1234567890', // Tu slot de banner
    rectangle: process.env.NODE_ENV === 'development'
      ? 'test'
      : '1234567891', // Tu slot de rectángulo
    mobile: process.env.NODE_ENV === 'development'
      ? 'test'
      : '1234567892', // Tu slot mobile
  }
};

// Cargar el script de AdSense
export const loadAdSenseScript = () => {
  if (typeof window === 'undefined') return;
  
  const existingScript = document.getElementById('adsense-script');
  if (existingScript) return;

  const script = document.createElement('script');
  script.id = 'adsense-script';
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CONFIG.publisherId}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

// Función para inicializar anuncios
export const initializeAd = (adSlot: string) => {
  try {
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }
  } catch (error) {
    console.error('Error initializing ad:', error);
  }
};
