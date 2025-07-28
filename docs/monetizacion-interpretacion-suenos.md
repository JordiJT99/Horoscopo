# Monetización y Estrategia de Anuncios para Interpretación de Sueños

## 1. ¿Qué hace el flujo de interpretación de sueños?

El archivo `src/ai/flows/dream-interpretation-flow.ts` define el proceso para que el usuario describa su sueño y reciba una interpretación detallada usando Gemini 1.5 Flash. El sistema extrae elementos clave del sueño y genera una interpretación personalizada.

---

## 2. Costos de Gemini 1.5 Flash

- **Entrada (input):** $0.075 por 1 millón de tokens
- **Salida (output):** $0.30 por 1 millón de tokens
- **Almacenamiento por hora:** $1.00 por hora (solo si usas contexto persistente)

**Ejemplo típico de consulta:**
- Input + Output ≈ 4,000 tokens por interpretación
- **Costo por consulta:** ~$0.00075

---

## 3. Ingresos y Costos por 1,000 usuarios/mes

- **Banner:** CPM $0.10 - $0.50
- **Interstitial:** CPM $1.00 - $3.00
- **Rewarded:** CPM $2.00 - $5.00

**Ejemplo de ingresos:**
- 1,000 usuarios/mes, cada uno ve:
  - 30 banners
  - 10 interstitials
  - 5 rewarded
- **Ingresos estimados:** $23 - $70 mensual

**Ejemplo de costos Gemini:**
- Supongamos que cada usuario hace 10 consultas a Gemini al mes:
  - 1,000 usuarios × 10 consultas = 10,000 consultas
  - 10,000 × $0.00075 = **$7.50** de costo mensual por Gemini

---

## 4. Estrategia para ser rentable

### Banner Ads
- **Dónde:** Pantalla principal y página de interpretación
- **Por qué:** Generan ingresos pasivos, pero bajos. Úsalos siempre.

### Interstitial Ads
- **Dónde:** Antes de mostrar la interpretación del sueño (tras enviar el sueño).
- **Por qué:** Generan más ingresos por impresión. Úsalos en cada consulta adicional.

### Rewarded Ads
- **Dónde:** Para funciones premium (ver abajo).
- **Por qué:** El usuario ve el anuncio voluntariamente para desbloquear funciones avanzadas.

---

## 5. Funciones Premium recomendadas

- Interpretaciones extra (más de 1 por día)
- Interpretación avanzada (más detalles, análisis profundo)
- Guardar sueños en su perfil
- Dream Map interactivo (visualización avanzada de elementos)
- Comparar sueños (ver patrones entre sueños guardados)
- Exportar interpretación (PDF, compartir, etc.)

**Para desbloquear estas funciones, muestra un anuncio rewarded o pide una suscripción.**

---

## 6. Ejemplo de flujo rentable

1. Primer interpretación diaria: Gratis, solo banner.
2. Interpretaciones adicionales: Mostrar interstitial antes de la respuesta.
3. Funciones premium: Mostrar rewarded ad para desbloquear cada función.

---

## 7. Ejemplo de implementación (pseudocódigo)

```typescript
// Al enviar un sueño:
if (usuario.tieneInterpretacionGratis) {
  mostrarBanner();
  mostrarInterpretacion();
} else {
  mostrarInterstitial(() => {
    mostrarInterpretacion();
  });
}

// Para funciones premium:
mostrarRewarded(() => {
  desbloquearFuncionPremium();
});
```

---

## 8. Estudio de Monetización por Sección en AstroMística (Actualizado)

## 1. Secciones principales de la app

- Interpretación de sueños (Gemini)
- Tiradas de tarot (Gemini)
- Carta del tarot diaria (Gemini)
- Compatibilidad de signos (sin IA)
- Signos del zodiaco (sin IA)
- Carta natal (sin IA)
- Consejo del día (sin IA)
- Funciones premium (guardar sueños, análisis avanzado, exportar, etc.)

---

## 2. Costos de API Gemini por sección (ajustado)

- **Interpretación de sueños:**
  - Cada consulta ≈ 4,000 tokens → $0.00075
- **Tirada de tarot:**
  - Cada tirada ≈ 4,000 tokens → $0.00075
- **Carta diaria:**
  - Cada carta ≈ 2,000 tokens → $0.000375
- **Compatibilidad, signos del zodiaco:**
  - Sin IA → **$0**
- **Carta natal:**
  - Solo la primera vez por usuario (≈ 6,000 tokens) → $0.00112 por usuario
- **Consejo del día:**
  - Solo una frase generada por IA al día (≈ 500 tokens) → $0.0000375 por día
- **Horóscopo personalizado:**
  - Se genera con IA una vez al día por usuario (≈ 3,000 tokens × 1,000 usuarios = 3,000,000 tokens/día)
  - 3,000,000 tokens/día × $0.0003 por 1,000 tokens = $0.90 por día
  - 30 días → $27 mensual
- **Horóscopos generales (todos los signos):**
  - Se generan con IA una vez al día por signo (12 signos × 3,000 tokens = 36,000 tokens/día)
  - 36,000 tokens/día × $0.000375 por 2,000 tokens = $0.00675 por día
  - 30 días → $0.2025 mensual

**Ejemplo de uso mensual (1,000 usuarios):**
- Interpretación de sueños: 10,000 consultas → $7.50
- Tiradas de tarot: 5,000 tiradas → $3.75
- Carta diaria: 20,000 cartas → $7.50
- Carta natal: 200 usuarios nuevos → $0.22
- Consejo del día: 30 días → $0.0011
- Horóscopo personalizado: 30 días × 1,000 usuarios → $27
- Horóscopos generales: 30 días → $0.2025
- Compatibilidad, signos del zodiaco: solo gasto de infraestructura (no IA)
- **Total gasto Gemini:** ~$46 mensual (ajustado)

---

## 3. Ingresos por anuncios AdMob por sección

- **Banner:** CPM $0.10 - $0.50
- **Interstitial:** CPM $1.00 - $3.00
- **Rewarded:** CPM $2.00 - $5.00

**Distribución de anuncios:**
- Interpretación de sueños, tiradas de tarot, carta diaria: **Rewarded ad** en cada consulta/tirada/carta (incluida la primera diaria)
- Compatibilidad, signos, carta natal, consejo del día: **Interstitial** en cada consulta, banners al principio y final de la página y entre cards
- Cada vez que el usuario consulta 5 páginas (de cualquier sección): **Interstitial** adicional

**Ejemplo de ingresos (1,000 usuarios/mes):**
- Banners: 60,000 impresiones → $6 - $30
- Interstitials: 25,000 impresiones → $25 - $75
- Rewarded: 30,000 impresiones (ahora la primera consulta diaria también) → $60 - $150
- **Total ingresos:** $91 - $255 mensual

---

## 4. Estrategia de monetización por sección (actualizada)

### Interpretación de sueños, tiradas de tarot, carta diaria
- Banner en la pantalla principal y de resultado
- Rewarded ad en cada consulta/tirada/carta extra

### Compatibilidad, signos del zodiaco, carta natal, consejo del día
- Banner al principio y final de la página y entre cards
- Interstitial en cada consulta
- Interstitial adicional cada 5 páginas consultadas
- Interstitial al clicar en "Consejo del día"

### Funciones premium
- Rewarded ad para desbloquear cada función premium

---

## 5. Ejemplo de flujo rentable global (actualizado)

- Primer consulta diaria en cada sección: Rewarded y  banner al cargar la pagina
- Consultas/tiradas/carta extra: Mostrar rewarded ad antes de la respuesta
- Compatibilidad, signos, carta natal, consejo del día: Mostrar interstitial y banners
- Cada 5 páginas consultadas: Mostrar interstitial
- Funciones premium: Mostrar rewarded ad para desbloquear

---

## 6. Ejemplo de implementación (pseudocódigo global actualizado)

```typescript
// En secciones con IA (sueños, tarot, carta diaria):
if (usuario.tieneConsultaGratis) {
  mostrarBanner();
  mostrarResultado();
} else {
  mostrarRewarded(() => {
    mostrarResultado();
  });
}

// En secciones sin IA (compatibilidad, signos, carta natal, consejo):
mostrarBanner('inicio');
mostrarBanner('final');
mostrarBannerEntreCards();
mostrarInterstitial();

// Cada 5 páginas consultadas:
if (usuario.paginasConsultadas % 5 === 0) {
  mostrarInterstitial();
}

// Para funciones premium:
mostrarRewarded(() => {
  desbloquearFuncionPremium();
});
```

---

## 7. Nuevos cálculos de rentabilidad global

- **Gasto API Gemini mensual (1,000 usuarios):** ~$46
- **Ingresos por anuncios mensual (1,000 usuarios):** $91 - $255
- **Rentabilidad:**
  - El gasto de Gemini queda cubierto incluso en el escenario más bajo
  - Las secciones sin IA son beneficio limpio
  - Si el CPM sube o el uso premium aumenta, la rentabilidad mejora
  - Monetiza cada acción premium y consulta extra con rewarded/interstitial

---

**Esta estrategia permite monetizar toda la app de forma eficiente y sostenible, cubriendo los costes de la API y generando ingresos con anuncios en todas las secciones clave.**
