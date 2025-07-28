# Instrucciones para Implementar Monetización y Optimización en AstroMística

## 1. Estructura de monetización por sección

### Secciones con IA (Gemini)
- Interpretación de sueños
- Tiradas de tarot
- Carta del tarot diaria
- Carta natal (solo la primera vez por usuario)
- Horóscopo personalizado (una vez al día por usuario, cacheado)
- Consejo del día (una vez al día, cacheado)

### Secciones sin IA
- Compatibilidad de signos
- Signos del zodiaco
- Horóscopos generales (una vez al día por signo, cacheado)

---

## 2. Implementación de anuncios

### Banner Ads
- Mostrar banner al inicio y final de cada página.
- Mostrar banner entre cards en listados largos.

### Interstitial Ads
- Mostrar interstitial en cada consulta de compatibilidad, signos, carta natal, consejo del día.
- Mostrar interstitial adicional cada vez que el usuario consulta 5 páginas (de cualquier sección).
- Mostrar interstitial al clicar en "Consejo del día".

### Rewarded Ads
- Mostrar rewarded ad en cada consulta/tirada/carta en secciones con IA (incluida la primera diaria).
- Mostrar rewarded ad para desbloquear funciones premium.

---

## 3. Optimización de costes Gemini

- Cachear el horóscopo personalizado generado para cada usuario y mostrar el mismo durante todo el día.
- Cachear el consejo del día y los horóscopos generales (por signo) para todos los usuarios.
- Generar la carta natal solo la primera vez por usuario y guardar el resultado.
- Optimizar los prompts para reducir la cantidad de tokens generados por Gemini.
- Agrupar usuarios por perfil astrológico si es posible para compartir horóscopos personalizados.

---

## 4. Flujo de implementación recomendado

1. **Al cargar cada página:**
   - Mostrar banner al inicio y final.
   - Si es listado largo, mostrar banner entre cards.

2. **Al realizar una consulta/tirada/carta en secciones con IA:**
   - Si es la primera consulta diaria, mostrar rewarded ad y cachear el resultado.
   - Si es consulta extra, mostrar rewarded ad y cachear el resultado.
   - Mostrar el resultado cacheado si ya existe para ese usuario y día.

3. **Al consultar compatibilidad, signos, carta natal, consejo del día:**
   - Mostrar interstitial ad.
   - Mostrar banners según corresponda.
   - Cachear resultados si aplica.

4. **Cada vez que el usuario consulta 5 páginas:**
   - Mostrar interstitial ad.

5. **Al desbloquear función premium:**
   - Mostrar rewarded ad.

---

## 5. Ejemplo de pseudocódigo global

```typescript
// Banner en cada página
mostrarBanner('inicio');
mostrarBanner('final');
if (cards.length > LIMITE) {
  mostrarBannerEntreCards();
}

// Rewarded en secciones con IA
if (esSeccionIA && !resultadoCacheado) {
  mostrarRewarded(() => {
    resultado = generarConGemini();
    cachearResultado(usuario, resultado, fecha);
    mostrarResultado(resultado);
  });
} else {
  mostrarResultado(resultadoCacheado);
}

// Interstitial en secciones sin IA
if (esSeccionSinIA) {
  mostrarInterstitial();
}

// Interstitial cada 5 páginas
if (usuario.paginasConsultadas % 5 === 0) {
  mostrarInterstitial();
}

// Rewarded para funciones premium
mostrarRewarded(() => {
  desbloquearFuncionPremium();
});
```

---

## 6. Notas importantes

- Cachear todos los resultados generados por IA para evitar llamadas innecesarias y reducir costes.
- Optimizar los prompts para que Gemini devuelva respuestas útiles pero concisas.
- Monitorizar el CPM real de banners, interstitials y rewarded para ajustar la frecuencia si es necesario.
- Revisar periódicamente los costes y beneficios para ajustar la estrategia.

---

**Sigue estas instrucciones para implementar una monetización eficiente y sostenible en AstroMística, maximizando ingresos y minimizando costes de IA.**
