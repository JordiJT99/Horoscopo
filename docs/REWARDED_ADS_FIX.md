# Fix: Rewarded Ads Not Giving Stardust Correctly

## Problema Identificado

En la página Astrologist (PsychicChat), cuando los usuarios ven anuncios de recompensa para obtener "SignName" (polvo estelar), el anuncio se completa pero el usuario no recibe el polvo estelar correctamente.

## Causa Raíz

1. **Falta de logging detallado**: El código no registraba adecuadamente si el anuncio devolvía una recompensa válida
2. **Manejo inadecuado de recompensas vacías**: Si `AdMob.showRewardVideoAd()` retorna `null` o un objeto sin los campos esperados, el usuario no recibía nada
3. **Problemas de sincronización**: El tiempo de chat (`chatTimeRemaining`) podría no actualizarse correctamente después de recibir la recompensa

## Solución Implementada

### 1. Mejoras en `src/lib/admob.ts`

**Antes:**
```typescript
const result = await AdMob.showRewardVideoAd();
console.log('Rewarded ad completed (PRODUCTION mode):', result);
return result;
```

**Después:**
```typescript
console.log('[AdMob] Showing rewarded ad...');
const result = await AdMob.showRewardVideoAd();

console.log('[AdMob] Rewarded ad completed (PRODUCTION mode):', JSON.stringify(result));
console.log('[AdMob] Reward details - type:', result?.type, 'amount:', result?.amount);

// Verify that we actually got a reward
if (!result || !result.type || result.amount === undefined) {
  console.warn('[AdMob] Rewarded ad completed but reward data is missing:', result);
  // Return a default reward to ensure the user gets credited
  return { type: 'stardust', amount: 1 };
}

return result;
```

**Cambios clave:**
- ✅ Logging detallado de la recompensa recibida
- ✅ Validación de que la recompensa incluye `type` y `amount`
- ✅ Recompensa por defecto (1 stardust) si los datos están incompletos
- ✅ Garantiza que el usuario siempre reciba la recompensa después de ver el anuncio

### 2. Mejoras en `src/components/psychic-chat/PsychicChatUI.tsx`

**Antes:**
```typescript
const reward = await showRewardedAd();
if (reward) {
  const adRewardStardust = 1;
  const adRewardMinutes = Math.floor(adRewardStardust / MINUTE_COST);
  await addStardust(adRewardStardust); 
  setChatTimeRemaining(prev => prev + (adRewardMinutes * 60));
  toast({
    title: "¡Recompensa Obtenida!",
    description: `Has ganado ${adRewardStardust} de Polvo Estelar...`,
  });
}
```

**Después:**
```typescript
const reward = await showRewardedAd();
if (reward) {
  const adRewardStardust = 1;
  const adRewardSeconds = Math.floor((adRewardStardust / MINUTE_COST) * 60);
  
  console.log('[PsychicChat] Ad reward received:', { 
    adRewardStardust, 
    adRewardSeconds,
    currentChatTime: chatTimeRemaining 
  });
  
  await addStardust(adRewardStardust); 
  setChatTimeRemaining(prev => {
    const newTime = prev + adRewardSeconds;
    console.log('[PsychicChat] Updating chat time:', { prev, adRewardSeconds, newTime });
    return newTime;
  });
  
  const adRewardMinutes = Math.floor(adRewardSeconds / 60);
  toast({
    title: dictionary['Toast.rewardObtainedTitle'] || "¡Recompensa Obtenida!",
    description: dictionary['Toast.rewardObtainedDescription']...
  });
} else {
  // Nuevo: manejar caso donde no se recibe recompensa
  console.warn('[PsychicChat] Ad completed but no reward received');
  toast({
    title: dictionary['Toast.errorTitle'] || "Error",
    description: dictionary['Toast.adNoRewardDescription'] || "No se recibió recompensa del anuncio.",
    variant: "destructive"
  });
}
```

**Cambios clave:**
- ✅ Logging detallado del flujo de recompensas
- ✅ Cálculo en segundos (más preciso que minutos)
- ✅ Logging del estado antes/después de actualizar tiempo de chat
- ✅ Manejo del caso donde el anuncio se completa pero no hay recompensa
- ✅ Uso de diccionario para internacionalización
- ✅ Mensajes de error apropiados

## Cómo Probar

1. **Abrir la página de Astrologist** (chat con psíquicos)
2. **Seleccionar un tema** para iniciar el chat
3. **Esperar hasta que el tiempo de chat esté bajo** o se agote
4. **Hacer clic en "Ver anuncio" para obtener más tiempo**
5. **Ver el anuncio completo**
6. **Verificar en los logs del navegador/consola:**
   ```
   [AdMob] Showing rewarded ad...
   [AdMob] Rewarded ad completed...
   [AdMob] Reward details - type: ... amount: ...
   [PsychicChat] Ad reward received: {...}
   [PsychicChat] Updating chat time: {...}
   ```
7. **Confirmar que aparece el toast** de "¡Recompensa Obtenida!"
8. **Verificar que el polvo estelar aumentó** (revisar el contador en la UI)
9. **Verificar que el tiempo de chat aumentó** (debe mostrar tiempo adicional)

## Debugging Adicional

Si el problema persiste, revisar:

1. **Logs de AdMob**: Buscar mensajes con prefijo `[AdMob]`
2. **Logs de PsychicChat**: Buscar mensajes con prefijo `[PsychicChat]`
3. **Estado de cosmic-energy**: Verificar que `addStardust()` se ejecuta correctamente
4. **Configuración de AdMob**: Asegurar que las IDs de anuncios de recompensa están correctas en `AD_CONFIG`

## Archivos Modificados

- `src/lib/admob.ts` - Mejoras en `showRewardedAd()`
- `src/components/psychic-chat/PsychicChatUI.tsx` - Mejoras en `handleWatchAd()`

## Notas Importantes

- La recompensa por defecto es **1 polvo estelar** por anuncio
- El tiempo de chat se calcula como: `(stardust / 0.5) * 60` segundos
- 1 polvo estelar = 2 minutos de chat (120 segundos)
- Si el anuncio falla, se muestra un mensaje de error apropiado
