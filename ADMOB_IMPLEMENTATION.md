# 🚀 AdMob Integrado en AstroMística - TEST MODE

## ✅ Estado Actual: ANUNCIOS INTEGRADOS

Los anuncios de AdMob están completamente integrados en tu app usando **IDs de prueba oficiales de Google**. Los usuarios verán anuncios reales durante el uso normal de la aplicación.

## 📱 Dónde Aparecen Los Anuncios

### 🏠 **Página Principal (`/`)**
- **Banner Superior**: Se muestra automáticamente al cargar
- **Banner Inferior**: Para máxima monetización
- **Experiencia**: Los usuarios ven banners mientras navegan el horóscopo

### 🔮 **Tarot Reading (`/tarot-reading`)**
- **Banner Superior**: Al entrar a la página
- **Banner Inferior**: Al final del contenido
- **Intersticial**: Se muestra antes de hacer la lectura (solo en usos posteriores, no en el primero para no molestar)
- **Experiencia**: Anuncio antes de recibir la lectura del tarot

### 🃏 **Tarot Spread (`/tarot-spread`)**
- **Banner Superior**: Al entrar a la página
- **Banner Inferior**: Al final del contenido
- **Anuncio con Recompensa**: En usos posteriores, el usuario puede ver un anuncio para obtener +10 energía cósmica extra
- **Experiencia**: Recompensa por ver anuncios voluntarios

### 💕 **Compatibilidad (`/compatibility`)**
- **Intersticial**: Se muestra antes de calcular la compatibilidad
- **Experiencia**: Anuncio antes de ver el resultado de compatibilidad

## 🎯 Tipos de Anuncios Implementados

### 📱 **Banners**
- **Posición**: Superior y inferior
- **Comportamiento**: Se muestran automáticamente al cargar las páginas
- **IDs de prueba**: `ca-app-pub-3940256099942544/6300978111`

### 📺 **Intersticiales**
- **Cuándo**: Antes de acciones importantes (lectura tarot, compatibilidad)
- **Estrategia**: No molestan en el primer uso del día
- **IDs de prueba**: `ca-app-pub-3940256099942544/1033173712`

### 🎁 **Anuncios con Recompensa**
- **Cuándo**: Opcional en tarot spread para energía extra
- **Beneficio**: +10 energía cósmica por ver el anuncio
- **IDs de prueba**: `ca-app-pub-3940256099942544/5224354917`

## 🔧 Configuración Técnica

### Application ID (AndroidManifest.xml)
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-3940256099942544~3347511713"/>
```

### Archivos Principales
- `src/lib/admob.ts` - Configuración central con IDs de prueba
- `src/hooks/use-admob-ads.ts` - Hook React para usar en componentes
- `src/components/shared/AdMobBanner.tsx` - Banner automático
- `android/app/src/main/AndroidManifest.xml` - Configuración Android

## 📱 Cómo Testear

### 1. Build y Deploy
```bash
npm run admob:test
```

### 2. Qué Esperarás Ver
- **Banners**: Aparecen en top/bottom con "Test Ad"
- **Intersticiales**: Pantalla completa antes de acciones importantes
- **Rewarded**: Opcional para bonificaciones extra
- **Texto "Test Ad"**: Es normal en modo prueba

### 3. Flujo de Usuario Real
1. **Abrir app** → Banner automático en home
2. **Ir a Tarot Reading** → Banner + Intersticial antes de lectura
3. **Usar Tarot Spread** → Opción de ver anuncio para energía extra
4. **Calcular Compatibilidad** → Intersticial antes del resultado

## ⚠️ Importante

- ✅ **Solo funciona en dispositivos físicos** (no emulador)
- ✅ **Los anuncios de prueba muestran "Test Ad"** - esto es correcto
- ✅ **Los banners pueden tardar 2-3 segundos** en aparecer
- ✅ **Los intersticiales son saltables** después de 5 segundos
- ✅ **Los rewarded deben completarse** para obtener recompensa

## 🔄 Cambiar a Producción

Cuando confirmes que todo funciona, edita `src/lib/admob.ts`:

### Cambiar los IDs
```typescript
export const AD_CONFIG = {
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
};
```

### Cambiar el modo de testing
```typescript
// En initialize()
initializeForTesting: false

// En todos los métodos
isTesting: false
```

### Actualizar AndroidManifest.xml
```xml
android:value="ca-app-pub-1601092077557933~3273742971"
```

## 💰 Estrategia de Monetización

- **Banners**: Ingresos pasivos constantes
- **Intersticiales**: Altos ingresos en acciones claves
- **Rewarded**: Engagement + ingresos voluntarios
- **Frecuencia**: Balanceada para no molestar usuarios

¡Tu app está lista para generar ingresos con AdMob! 🎉
