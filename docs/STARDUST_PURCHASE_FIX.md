# Fix: Compra de Polvo Estelar No Funciona

## Problema Identificado

Las compras de paquetes de polvo estelar no funcionaban porque:

1. **El flujo de compra es asíncrono**: Cuando se llama a `purchaseProduct()`, Google Play inicia el flujo de compra pero retorna **inmediatamente** con `{success: true, hasPurchase: false, message: 'Purchase flow started'}`
2. **Faltaba detección de compra completada**: El código original esperaba que la compra viniera en la respuesta inmediata, pero Google Play requiere que consultes las compras después de que el usuario complete el proceso
3. **No había mecanismo de espera**: Sin esperar y recargar las compras, la aplicación no detectaba que la compra se había completado

## Error Original en Consola

```javascript
[BILLING] purchaseProduct called with productId: stardust_pack_small
[BILLING] Calling GooglePlayBilling.purchaseProduct...
[BILLING] purchaseProduct result: {success: true, hasPurchase: false, message: 'Purchase flow started'}
[BILLING] Purchase flow did not succeed or no purchase returned
```

## Solución Implementada

### 1. **`src/hooks/use-billing.ts`** - Flujo Mejorado con Polling

Modificado `purchaseProduct()` para manejar ambos casos:

#### **Caso 1: Respuesta Inmediata** (algunos dispositivos/versiones)
```typescript
if (result.success && result.purchase) {
  // Verificar y procesar inmediatamente
  const verified = await verifyPurchase({...});
  // ...
}
```

#### **Caso 2: Flujo Asíncrono** (mayoría de casos) ✅ **NUEVO**
```typescript
if (result.success && !result.purchase) {
  console.log('[BILLING] Purchase flow started, waiting for completion...');
  
  // Esperar 2 segundos para que el usuario complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Consultar todas las compras
  const purchasesResult = await GooglePlayBilling.getPurchases();
  
  // Buscar la compra del producto específico
  const newPurchase = purchasesResult.purchases.find(p => p.productId === productId);
  
  if (newPurchase) {
    // Verificar y procesar la compra
    const verified = await verifyPurchase({...});
    // ...
  }
}
```

### 2. **Logging Detallado** - Ya implementado anteriormente

- ✅ Logs en cada paso del flujo de compra
- ✅ Logs del resultado de verificación del servidor
- ✅ Logs de actualización de stardust en Firestore

## Cómo Funciona Ahora

### Flujo Completo:

1. **Usuario hace clic en "Comprar"** → `purchaseProduct('stardust_pack_small')`
2. **Se inicia el flujo de Google Play** → Muestra UI de compra nativa
3. **Plugin retorna inmediatamente** → `{success: true, hasPurchase: false}`
4. **App espera 2 segundos** → Usuario completa/cancela compra
5. **App consulta compras** → `getPurchases()`
6. **App busca la nueva compra** → Filtra por `productId`
7. **Si encuentra compra** → Verifica con servidor
8. **Servidor procesa** → Agrega stardust (100/250/500)
9. **Usuario ve toast** → "Compra Exitosa"

## Cómo Probar

### En la Aplicación Móvil:

1. **Abrir la sección de "Polvo Estelar"** o "Perfil"
2. **Ver los paquetes de polvo estelar disponibles**
3. **Hacer clic en comprar un paquete** (ej: 100, 250, o 500 polvo estelar)
4. **Completar la compra** a través de Google Play
5. **Esperar 2-3 segundos** después de confirmar la compra
6. **Ver el toast de éxito** y verificar que el stardust se actualizó

### Logs Esperados (Ahora):

```
[BILLING] purchaseProduct called with productId: stardust_pack_small
[BILLING] Calling GooglePlayBilling.purchaseProduct...
[BILLING] purchaseProduct result: {success: true, hasPurchase: false, message: 'Purchase flow started'}
[BILLING] Purchase flow started, waiting for completion...
[BILLING] Checking for new purchases...
[BILLING] Found purchases: 1
[BILLING] New purchase found: {purchaseToken: "ABC...", productId: "stardust_pack_small", purchaseTime: "2025-10-21..."}
[BILLING] Verifying purchase with server...
[verify-purchase] Processing product benefits for: stardust_pack_small
[verify-purchase] Current stardust: 0
[verify-purchase] Adding 100 stardust, new total: 100
[BILLING] Verification result: true
[BILLING] Purchase verified successfully, reloading purchases...
```

## Debugging

### Si la compra falla, revisar:

1. **Logs del cliente** (`[BILLING]` prefix):
   - ¿Se inició el flujo de compra? → `purchaseProduct result: {success: true}`
   - ¿Se esperó correctamente? → `Purchase flow started, waiting for completion...`
   - ¿Se encontró la compra después de esperar? → `New purchase found: {...}`
   - ¿La verificación con el servidor fue exitosa? → `Verification result: true`

2. **Logs del servidor** (`[verify-purchase]` prefix):
   - ¿Llegó la solicitud de verificación?
   - ¿Se procesó el productId correctamente?
   - ¿Se actualizó el stardust?

3. **Errores comunes**:
   - **"No new purchase found"**: El usuario canceló la compra o el tiempo de espera fue insuficiente
   - **"Purchase verification failed"**: El servidor no pudo verificar la compra con Google Play API (problema de permisos)
   - **500 Internal Server Error**: Error en el servidor al procesar la compra (revisar logs del servidor)

### Verificar en Google Play Console:

1. **Productos configurados**:
   - `stardust_pack_small` (100 polvo estelar)
   - `stardust_pack_medium` (250 polvo estelar)
   - `stardust_pack_large` (500 polvo estelar)

2. **Estado de productos**: Deben estar "Activos"

3. **Permisos de API**: La cuenta de servicio debe tener permisos para verificar compras

## Posibles Causas del Problema (Antes del Fix)

La causa principal era que el flujo de compra en Google Play es **asíncrono**:

1. ❌ **Antes**: El código esperaba que `purchaseProduct()` retornara la compra inmediatamente
2. ✅ **Ahora**: El código espera 2 segundos y luego consulta las compras para encontrar la nueva compra

**Otros problemas que pueden persistir:**

1. **Google Play API Permissions**: La cuenta de servicio no tiene permisos suficientes (esto puede causar error 500 al verificar)
2. **Productos no configurados**: Los IDs de productos en Google Play Console no coinciden
3. **Firestore**: Error al actualizar el documento del usuario

## Tiempo de Espera

El código actual espera **2 segundos** después de iniciar la compra. Si los usuarios son muy lentos para confirmar, podrías necesitar:

- Aumentar el tiempo de espera (ej: 3-5 segundos)
- O implementar un polling continuo (consultar cada segundo durante 10-15 segundos)

## Mejoras Futuras Posibles

Si el tiempo fijo de espera no es suficiente, se puede implementar:

```typescript
// Polling con reintentos cada segundo durante 15 segundos
for (let attempt = 0; attempt < 15; attempt++) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const purchases = await GooglePlayBilling.getPurchases();
  const newPurchase = purchases.find(p => p.productId === productId);
  if (newPurchase) {
    // Procesar compra
    break;
  }
}
```

## Siguientes Pasos

1. ✅ **Rebuild de la app** con el nuevo código
2. 🧪 **Probar compra en la app** móvil
3. 📊 **Revisar logs completos** del cliente y servidor
4. ✔️ **Verificar que el polvo estelar se actualiza** en la UI después de la compra
5. 💾 **Confirmar que el polvo estelar persiste** después de reiniciar la app

## Archivos Modificados

- `src/hooks/use-billing.ts` - Función `purchaseProduct()` con detección asíncrona de compras completadas
- `src/app/api/billing/verify-purchase/route.ts` - Logging en procesamiento de beneficios (modificado anteriormente)
- `docs/STARDUST_PURCHASE_FIX.md` - Este documento

---

**Fecha de actualización**: 21 de octubre de 2025  
**Estado**: ✅ Fix implementado - Pendiente de testing
