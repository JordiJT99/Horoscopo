# 📱 Dónde, Cómo y Cuándo se Muestran los Anuncios en AstroMística

## 🎯 **Resumen Ejecutivo**
Tu app **AstroMística** tiene anuncios AdMob integrados en **3 páginas principales** con una estrategia específica de monetización que balancea ingresos con experiencia de usuario.

---

## 📍 **UBICACIONES EXACTAS DE LOS ANUNCIOS**

### 🏠 **1. PÁGINA PRINCIPAL** (`/[locale]/page.tsx`)
**Archivo**: `src/app/[locale]/page.tsx`

```tsx
// Banner en la parte SUPERIOR
<AdMobBanner position={BannerAdPosition.TOP_CENTER} />

// Tu contenido del horóscopo aquí...

// Banner en la parte INFERIOR  
<AdMobBanner position={BannerAdPosition.BOTTOM_CENTER} />
```

**¿Cuándo aparecen?**
- ✅ **Inmediatamente** al abrir la app
- ✅ **Automáticamente** sin interacción del usuario
- ✅ **Permanecen visibles** mientras el usuario lee el horóscopo

**¿Cómo se ven?**
- 📱 **Banner superior**: En la parte de arriba de la pantalla
- 📱 **Banner inferior**: En la parte de abajo de la pantalla
- 🎨 **Diseño adaptativo** que se ajusta al ancho de la pantalla

---

### 🔮 **2. LECTURA DE TAROT** (`/[locale]/tarot-reading/page.tsx`)
**Archivo**: `src/app/[locale]/tarot-reading/page.tsx`

```tsx
// Banner SUPERIOR automático
<AdMobBanner position={BannerAdPosition.TOP_CENTER} />

// Componente de lectura de tarot
<TarotReadingClient />

// Banner INFERIOR automático
<AdMobBanner position={BannerAdPosition.BOTTOM_CENTER} />
```

**Archivo del componente**: `src/components/tarot-reading/TarotReadingClient.tsx`

```tsx
// ANUNCIO INTERSTICIAL antes de hacer la lectura
const { showInterstitial } = useAdMob();

const handleGetReading = async () => {
  // Solo muestra anuncio en usos POSTERIORES (no en el primero)
  if (userProfile?.cosmic_energy?.draw_tarot_card_count > 0) {
    try {
      await showInterstitial(); // 🚀 ANUNCIO PANTALLA COMPLETA
    } catch (error) {
      console.error('Failed to show ad:', error);
    }
  }
  // Continúa con la lectura...
};
```

**¿Cuándo aparecen?**
- 🎪 **Banners**: Al entrar a la página (automático)
- 📺 **Intersticial**: Antes de hacer la lectura (solo después del primer uso)

**¿Cómo funciona?**
1. Usuario entra → **Banners aparecen** arriba y abajo
2. Usuario hace clic en "Get Reading"
3. Si es su **primera vez** → NO hay anuncio intersticial
4. Si **ya usó antes** → Aparece anuncio de **pantalla completa**
5. Usuario cierra el anuncio → Ve su lectura de tarot

---

### 🃏 **3. TAROT SPREAD** (`/[locale]/tarot-spread/page.tsx`)
**Archivo**: `src/app/[locale]/tarot-spread/page.tsx`

```tsx
// Banner SUPERIOR automático
<AdMobBanner position={BannerAdPosition.TOP_CENTER} />

// Componente de spread de tarot
<TarotSpreadClient />

// Banner INFERIOR automático
<AdMobBanner position={BannerAdPosition.BOTTOM_CENTER} />
```

**Archivo del componente**: `src/components/tarot-spread/TarotSpreadClient.tsx`

```tsx
// ANUNCIO RECOMPENSADO para energía extra
const { showRewardedAd, showInterstitial } = useAdMob();

const handleWatchAdForEnergy = async () => {
  try {
    const reward = await showRewardedAd(); // 🎁 ANUNCIO CON RECOMPENSA
    if (reward) {
      // Usuario obtiene +10 energía cósmica
      addCosmicEnergy(10);
    }
  } catch (error) {
    console.error('Rewarded ad failed:', error);
  }
};
```

**¿Cuándo aparecen?**
- 🎪 **Banners**: Al entrar a la página (automático)
- 🎁 **Anuncio Recompensado**: Cuando el usuario elige ver un anuncio para obtener energía extra

**¿Cómo funciona?**
1. Usuario entra → **Banners aparecen** arriba y abajo
2. Usuario hace el spread de tarot
3. Si necesita más energía → Ve botón **"Watch Ad for +10 Energy"**
4. Usuario hace clic → Aparece **video con recompensa**
5. Usuario completa el video → Recibe **+10 energía cósmica**

---

### 💕 **4. COMPATIBILIDAD** (`/compatibility`)
**Archivo**: `src/components/compatibility/CompatibilityClientContent.tsx`

```tsx
// ANUNCIO INTERSTICIAL antes del resultado
const { showInterstitial } = useAdMob();

const calculateCompatibility = async () => {
  try {
    await showInterstitial(); // 🚀 ANUNCIO ANTES DEL RESULTADO
  } catch (error) {
    console.error('Failed to show ad:', error);
  }
  // Continúa con el cálculo...
};
```

**¿Cuándo aparece?**
- 📺 **Intersticial**: Justo antes de mostrar el resultado de compatibilidad

**¿Cómo funciona?**
1. Usuario ingresa los datos de compatibilidad
2. Usuario hace clic en "Calculate"
3. Aparece **anuncio de pantalla completa**
4. Usuario cierra el anuncio → Ve el resultado de compatibilidad

---

## 🎮 **PÁGINA DE PRUEBAS** (`/[locale]/admob-test`)
**Archivo**: `src/app/[locale]/admob-test/page.tsx`

Esta página es solo para **testing** y permite:
- ✅ Probar banners superiores e inferiores
- ✅ Probar anuncios intersticiales
- ✅ Probar anuncios recompensados
- ✅ Ver el estado de AdMob

---

## ⚙️ **CONFIGURACIÓN TÉCNICA**

### 🔧 **Componente AdMobBanner**
**Archivo**: `src/components/shared/AdMobBanner.tsx`

```tsx
export default function AdMobBanner({ 
  position = BannerAdPosition.BOTTOM_CENTER, 
  autoShow = true,
  className = ""
}: AdMobBannerProps) {
  const { isInitialized, isSupported, showBanner, hideBanner } = useAdMob();

  useEffect(() => {
    if (autoShow && isInitialized && isSupported && !isShowing) {
      // Se muestra AUTOMÁTICAMENTE
      showBanner(position);
    }
  }, [isInitialized, isSupported, autoShow, position]);
}
```

### 🎯 **Hook useAdMob**
**Archivo**: `src/hooks/use-admob-ads.ts`

Funciones disponibles:
- `showBanner(position)` - Mostrar banner
- `hideBanner()` - Ocultar banner
- `showInterstitial()` - Mostrar anuncio pantalla completa
- `showRewardedAd()` - Mostrar anuncio con recompensa

---

## 🕐 **CRONOLOGÍA DE ANUNCIOS**

### **Sesión Típica del Usuario:**

```
📱 INICIO
├── Usuario abre app
├── 🎪 BANNERS aparecen en homepage (TOP + BOTTOM)
├── Usuario navega por horóscopo diario
├── 
├── 🔮 TAROT READING
├── Usuario va a /tarot-reading
├── 🎪 BANNERS aparecen (TOP + BOTTOM)
├── Usuario hace clic "Get Reading"
├── ❓ SI es primera vez → NO hay anuncio
├── ❓ SI ya usó antes → 📺 INTERSTICIAL (pantalla completa)
├── Usuario ve su lectura
├── 
├── 🃏 TAROT SPREAD  
├── Usuario va a /tarot-spread
├── 🎪 BANNERS aparecen (TOP + BOTTOM)
├── Usuario hace spread
├── ❓ SI necesita energía → 🎁 ANUNCIO RECOMPENSADO (+10 energía)
├── 
├── 💕 COMPATIBILIDAD
├── Usuario calcula compatibilidad
├── 📺 INTERSTICIAL antes del resultado
├── Usuario ve compatibilidad
└── FIN SESIÓN
```

---

## 📊 **TIPOS DE ANUNCIOS Y SU COMPORTAMIENTO**

### 🎪 **BANNERS** (Automáticos)
- **Ubicación**: TOP_CENTER y BOTTOM_CENTER
- **Comportamiento**: Aparecen automáticamente al cargar la página
- **Duración**: Permanecen visibles hasta que el usuario cambie de página
- **Páginas**: Homepage, Tarot Reading, Tarot Spread

### 📺 **INTERSTICIALES** (Estratégicos)
- **Ubicación**: Pantalla completa
- **Comportamiento**: Se muestran antes de acciones importantes
- **Duración**: 5 segundos mínimo, luego se pueden cerrar
- **Páginas**: Tarot Reading (usos posteriores), Compatibilidad

### 🎁 **RECOMPENSADOS** (Voluntarios)
- **Ubicación**: Video pantalla completa
- **Comportamiento**: El usuario elige verlos
- **Duración**: 15-30 segundos, deben completarse
- **Beneficio**: +10 energía cósmica
- **Páginas**: Tarot Spread

---

## 🛠️ **CONFIGURACIÓN ACTUAL**

### 🧪 **MODO PRUEBA** (Actual)
- **Application ID**: `ca-app-pub-3940256099942544~3347511713`
- **Banner ID**: `ca-app-pub-3940256099942544/6300978111`
- **Interstitial ID**: `ca-app-pub-3940256099942544/1033173712`
- **Rewarded ID**: `ca-app-pub-3940256099942544/5224354917`

### 🚀 **MODO PRODUCCIÓN** (Para activar)
- **Application ID**: `ca-app-pub-1601092077557933~3273742971`
- **Banner ID**: `ca-app-pub-1601092077557933/1500472200`
- **Interstitial ID**: `ca-app-pub-1601092077557933/7954199917`
- **Rewarded ID**: `ca-app-pub-1601092077557933/9187390537`

---

## ✅ **RESUMEN EJECUTIVO**

### **¿DÓNDE?**
- ✅ **Homepage**: Banners arriba y abajo
- ✅ **Tarot Reading**: Banners + Intersticial (usos posteriores)
- ✅ **Tarot Spread**: Banners + Anuncio Recompensado
- ✅ **Compatibilidad**: Intersticial antes del resultado

### **¿CUÁNDO?**
- 🎪 **Banners**: Inmediatamente al cargar página
- 📺 **Intersticiales**: Antes de acciones importantes
- 🎁 **Recompensados**: Cuando el usuario elige verlos

### **¿CÓMO?**
- 📱 **Solo en dispositivos móviles** (no en web)
- 🔄 **Automáticamente** para banners
- 👆 **Por clic del usuario** para intersticiales y recompensados
- ⏱️ **Sin saturar** - máximo 1 intersticial por sesión de función

### **💰 INGRESOS ESPERADOS**
- **Alto**: Intersticiales en momentos clave
- **Medio**: Banners permanentes en páginas principales  
- **Variable**: Recompensados según engagement del usuario

¡Tu app está completamente configurada para monetización con AdMob! 🎉
