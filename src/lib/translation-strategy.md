# Estrategia de Traducción Simplificada

## Opción 1: Solo idiomas principales (5-8 idiomas)
- Español (es) - Base
- Inglés (en) - Internacional
- Francés (fr) - Europa occidental
- Alemán (de) - Europa central
- Portugués (pt) - Brasil/Portugal
- Italiano (it) - Italia
- Ruso (ru) - Europa oriental
- Chino (zh) - Asia

## Opción 2: Traducción automática con Google Translate
- Mantener solo español e inglés como base
- Usar Google Translate API para el resto
- Cache las traducciones en localStorage

## Opción 3: Sistema de fallback inteligente
- Mantener 8 idiomas principales
- Para otros idiomas, usar el más cercano:
  - Catalán → Español
  - Portugués brasileño → Portugués
  - Inglés británico → Inglés
  - etc.

## Implementación recomendada:
```typescript
const MAIN_LOCALES = ['es', 'en', 'fr', 'de', 'pt', 'it', 'ru', 'zh'];
const LOCALE_FALLBACKS = {
  'ca': 'es', // Catalán → Español
  'pt-BR': 'pt', // Portugués brasileño → Portugués
  'en-GB': 'en', // Inglés británico → Inglés
  'zh-CN': 'zh', // Chino simplificado → Chino
  'zh-TW': 'zh', // Chino tradicional → Chino
};
```
