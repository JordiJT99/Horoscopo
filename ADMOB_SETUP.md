# Configuración de AdMob para AstroMística

## IDs que necesitas obtener de AdMob Console:

1. **App ID** (ya lo tienes): `ca-app-pub-1601092077557933~3273742971`

2. **Banner Ad Unit ID**: `ca-app-pub-1601092077557933/XXXXXXXXXX`
   - Crear en AdMob Console: Ad units > Add ad unit > Banner

3. **Interstitial Ad Unit ID**: `ca-app-pub-1601092077557933/XXXXXXXXXX`
   - Crear en AdMob Console: Ad units > Add ad unit > Interstitial

4. **Rewarded Ad Unit ID**: `ca-app-pub-1601092077557933/XXXXXXXXXX`
   - Crear en AdMob Console: Ad units > Add ad unit > Rewarded

## Pasos para obtener los IDs:

1. Ve a https://apps.admob.com/
2. Selecciona tu app "AstroMística"
3. Ve a "Ad units" en el menú lateral
4. Crea cada tipo de unidad de anuncio
5. Copia los IDs generados
6. Reemplaza las X's en `src/lib/admob.ts`

## Tipos de anuncios implementados:

### 1. Banner Ads
- Se muestran en la parte inferior de la pantalla
- Están siempre visibles (excepto para usuarios premium)
- Se manejan nativamente por Capacitor

### 2. Interstitial Ads
- Anuncios de pantalla completa
- Se muestran ocasionalmente al cambiar de signo zodiacal
- Frecuencia: 30% de probabilidad

### 3. Rewarded Ads
- Anuncios que dan recompensas
- Los usuarios pueden ver para ganar Energía Cósmica
- Botón disponible en varias secciones

## Configuración de frecuencia:

- **Intersticiales**: Máximo 1 cada 30 segundos
- **Recompensados**: Máximo 1 cada 30 segundos
- **Banners**: Siempre visibles (usuarios no premium)

## Testing:

En modo desarrollo (`__DEV__ = true`), se usan IDs de prueba de Google.
En producción, se usan tus IDs reales.

## Próximos pasos:

1. Obtener los Ad Unit IDs de AdMob Console
2. Actualizar `src/lib/admob.ts` con los IDs reales
3. Compilar y probar la app
4. Subir a Google Play Console para revisión
