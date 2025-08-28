# AdMob Implementation - TEST MODE

## 🚀 Configuración Actual

### Estado: MODO DE PRUEBA ✅
- **Application ID**: `ca-app-pub-3940256099942544~3347511713` (Google Test ID)
- **Banner ID**: `ca-app-pub-3940256099942544/6300978111` (Google Test ID) 
- **Interstitial ID**: `ca-app-pub-3940256099942544/1033173712` (Google Test ID)
- **Rewarded ID**: `ca-app-pub-3940256099942544/5224354917` (Google Test ID)

## 📱 Cómo Testear

### 1. Construir y Sincronizar
```bash
npm run admob:build
```

### 2. Instalar en Dispositivo
```bash
npm run admob:install
```

### 3. O ambos pasos juntos
```bash
npm run admob:test
```

### 4. Navegar a la página de prueba
En tu app, ve a `/admob-test` para acceder al centro de pruebas de AdMob.

## 🔧 Archivos Principales

- **`src/lib/admob.ts`** - Configuración y servicio principal
- **`src/hooks/use-admob-ads.ts`** - Hook React para usar AdMob
- **`src/components/shared/AdMobTestComponent.tsx`** - Componente de prueba
- **`src/components/shared/AdMobBanner.tsx`** - Banner automático
- **`android/app/src/main/AndroidManifest.xml`** - Configuración Android

## 🎯 Uso en Componentes

### Hook básico
```tsx
import { useAdMob } from '@/hooks/use-admob-ads';

function MyComponent() {
  const { showBanner, showInterstitial, showRewardedAd } = useAdMob();
  
  return (
    <button onClick={() => showBanner()}>
      Mostrar Banner
    </button>
  );
}
```

### Banner automático
```tsx
import AdMobBanner from '@/components/shared/AdMobBanner';

function MyPage() {
  return (
    <div>
      <AdMobBanner position={BannerAdPosition.BOTTOM_CENTER} />
    </div>
  );
}
```

## ⚠️ Importante

1. **Los anuncios SOLO funcionan en dispositivos físicos** (no en emulador)
2. **En modo TEST** verás anuncios con "Test Ad" - esto es normal
3. **Los banners** pueden tardar unos segundos en aparecer
4. **Los intersticiales** son pantalla completa y se pueden cerrar
5. **Los rewarded** dan recompensas al completarse

## 🔄 Cambiar a Producción

Cuando confirmes que todo funciona, edita `src/lib/admob.ts`:

```typescript
// Reemplaza estas líneas en AD_CONFIG:
APPLICATION_ID: {
  android: 'ca-app-pub-1601092077557933~3273742971',
  ios: 'ca-app-pub-1601092077557933~3273742971'
},
AD_UNITS: {
  banner: {
    android: 'ca-app-pub-1601092077557933/1500472200',
    ios: 'ca-app-pub-1601092077557933/1500472200'
  },
  interstitial: {
    android: 'ca-app-pub-1601092077557933/7954199917', 
    ios: 'ca-app-pub-1601092077557933/7954199917'
  },
  rewarded: {
    android: 'ca-app-pub-1601092077557933/9187390537',
    ios: 'ca-app-pub-1601092077557933/9187390537'
  }
}
```

Y cambia en initialize():
```typescript
initializeForTesting: false
```

Y en los métodos:
```typescript
isTesting: false
```

También actualiza AndroidManifest.xml con tu Application ID real.

## 🐛 Troubleshooting

- **No aparecen anuncios**: Verifica que estés en dispositivo físico
- **Error de inicialización**: Revisa los logs en `adb logcat`
- **IDs incorrectos**: Confirma que estás usando los test IDs correctos
- **Permisos**: Asegúrate de tener conexión a internet
