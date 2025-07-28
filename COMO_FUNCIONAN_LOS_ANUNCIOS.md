# 📱 Cómo Funcionan los Anuncios AdMob en AstroMística

## 🎯 Visión General

Tu app **AstroMística** utiliza Google AdMob para monetización a través de tres tipos principales de anuncios que se muestran estratégicamente durante la experiencia del usuario.

## 🔧 Configuración Técnica

### IDs de AdMob Configurados
```
Application ID: ca-app-pub-1601092077557933~3273742971
Banner ID: ca-app-pub-1601092077557933/1500472200
Interstitial ID: ca-app-pub-1601092077557933/7954199917
Rewarded ID: ca-app-pub-1601092077557933/9187390537
```

### Archivos Principales
- **`src/lib/admob.ts`** - Servicio principal de AdMob
- **`src/hooks/use-admob-ads.ts`** - Hook de React para manejo de anuncios
- **`android/app/src/main/AndroidManifest.xml`** - Configuración Android

## 📊 Tipos de Anuncios

### 1. 🎪 **Anuncios Banner**
**¿Qué son?**
- Anuncios rectangulares pequeños que aparecen en la parte superior o inferior de la pantalla
- Permanecen visibles mientras el usuario navega

**¿Cuándo se muestran?**
```typescript
// Se cargan automáticamente en componentes específicos
await AdMob.showBanner({
  adId: 'ca-app-pub-1601092077557933/1500472200',
  position: BannerAdPosition.BOTTOM_CENTER,
  size: BannerAdSize.ADAPTIVE_BANNER
});
```

**Ubicaciones estratégicas:**
- ✅ Página principal del horóscopo
- ✅ Resultados de lecturas de tarot
- ✅ Páginas de compatibilidad
- ✅ Chat psíquico

### 2. 🚀 **Anuncios Intersticiales**
**¿Qué son?**
- Anuncios de pantalla completa que cubren toda la interfaz
- El usuario debe cerrarlos para continuar

**¿Cuándo se muestran?**
```typescript
// Se muestran en transiciones naturales
await AdMob.showInterstitial();
```

**Momentos estratégicos:**
- ⏰ **Después de completar una lectura de tarot**
- ⏰ **Al cambiar entre secciones principales**
- ⏰ **Después de generar un horóscopo**
- ⏰ **Al abrir funciones premium (con límite)**

### 3. 🎁 **Anuncios Recompensados**
**¿Qué son?**
- Anuncios de video que el usuario ve voluntariamente
- A cambio, recibe recompensas en la app

**¿Cuándo se muestran?**
```typescript
// El usuario elige verlos para obtener beneficios
await AdMob.showRewardVideoAd();
```

**Recompensas ofrecidas:**
- 💫 **Stardust extra** para desbloquear funciones
- 🔮 **Lecturas adicionales** sin esperar
- ⭐ **Acceso temporal a funciones premium**
- 🎯 **Compatibilidad extendida**

## 🔄 Flujo de Experiencia del Usuario

### Ejemplo: Lectura de Tarot
```
1. Usuario abre "Tarot Reading"
   ↓
2. [BANNER] aparece en la parte inferior
   ↓
3. Usuario hace la lectura
   ↓
4. [INTERSTICIAL] se muestra al finalizar
   ↓
5. Usuario ve resultados con [BANNER] activo
   ↓
6. Opción de [RECOMPENSADO] para lectura adicional
```

### Ejemplo: Horóscopo Diario
```
1. Usuario selecciona su signo
   ↓
2. [BANNER] aparece mientras carga
   ↓
3. Usuario lee su horóscopo
   ↓
4. [INTERSTICIAL] al cambiar a otra sección
   ↓
5. [RECOMPENSADO] para horóscopo de mañana
```

## ⚙️ Lógica de Implementación

### Inicialización Automática
```typescript
// src/hooks/use-admob-ads.ts
export const useAdMobAds = () => {
  useEffect(() => {
    initializeAdMob();
  }, []);
  
  const initializeAdMob = async () => {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['your-test-device-id'],
    });
  };
};
```

### Detección de Plataforma
```typescript
// Solo se ejecuta en dispositivos móviles
const isMobile = Capacitor.getPlatform() !== 'web';
if (isMobile) {
  // Mostrar anuncios
}
```

### Manejo de Errores
```typescript
try {
  await AdMob.showBanner(options);
} catch (error) {
  console.log('Ad failed to load:', error);
  // La app continúa normalmente sin anuncios
}
```

## 📈 Estrategia de Monetización

### Frecuencia de Anuncios
- **Banners**: Permanentes en páginas clave
- **Intersticiales**: Máximo 1 cada 3 minutos
- **Recompensados**: Disponibles bajo demanda

### Balance Usuario/Ingresos
```
🎯 Objetivo: Maximizar ingresos sin afectar experiencia

✅ Anuncios en momentos naturales de pausa
✅ Recompensas valiosas por ver anuncios
✅ Opción de premium para quitar anuncios
❌ No interrumpir lecturas activas
❌ No saturar con demasiados intersticiales
```

## 🛠️ Estados de los Anuncios

### Carga de Anuncios
```typescript
// Los anuncios se precargan para mostrar instantáneamente
await AdMob.prepareInterstitial({
  adId: 'ca-app-pub-1601092077557933/7954199917'
});
```

### Verificación de Disponibilidad
```typescript
// Solo mostrar si el anuncio está listo
const isReady = await AdMob.isInterstitialReady();
if (isReady) {
  await AdMob.showInterstitial();
}
```

## 📱 Experiencia en Diferentes Pantallas

### Pantalla Principal
- Banner inferior permanente
- Intersticial al acceder a funciones principales

### Lecturas/Consultas
- Banner superior discreto
- Intersticial al finalizar
- Recompensado para funciones extra

### Configuración/Perfil
- Solo banners para no interrumpir configuración
- Opción de premium destacada

## 💡 Optimizaciones Implementadas

### Rendimiento
- ✅ Carga asíncrona de anuncios
- ✅ Precarga en background
- ✅ Manejo de errores sin crashes
- ✅ Detección automática de plataforma

### Experiencia Usuario
- ✅ Anuncios solo en transiciones naturales
- ✅ Recompensas valiosas y claras
- ✅ Opción de saltar cuando posible
- ✅ No bloquear funcionalidad core

## 🎯 Métricas Esperadas

### KPIs de Anuncios
- **eCPM**: Ingresos por 1000 impresiones
- **Fill Rate**: % de requests que reciben anuncios
- **CTR**: % de clicks sobre impresiones
- **Retention**: Usuarios que siguen usando la app

### Métricas de Usuario
- **Session Length**: Duración promedio de uso
- **DAU/MAU**: Usuarios activos diarios/mensuales
- **Premium Conversion**: % que compra para quitar ads

## 🚀 Próximos Pasos

### Optimizaciones Futuras
1. **A/B Testing** de posiciones de anuncios
2. **Segmentación** por tipo de usuario
3. **Anuncios nativos** integrados en contenido
4. **Frequency capping** inteligente

### Análisis de Datos
1. **Firebase Analytics** para tracking detallado
2. **AdMob Reports** para optimización de ingresos
3. **User Feedback** sobre experiencia publicitaria

---

## 📞 Configuración de Pruebas

Para probar los anuncios:

1. **Generar APK**: `cd android && ./gradlew assembleRelease`
2. **Instalar en dispositivo**: Transferir APK y instalar
3. **Verificar anuncios**: Navegar por la app y observar aparición
4. **Revisar logs**: Comprobar errores en Android Studio

> **Nota**: Los anuncios reales solo aparecen en la versión de producción instalada desde Google Play Store o APK firmado. En desarrollo se muestran anuncios de prueba.
