# 🛡️ CONFIGURACIÓN DE SEGURIDAD PARA GOOGLE AI API
# 
# Para restringir el uso de modelos específicos a nivel de red:
#
# 1. CONFIGURACIÓN EN GOOGLE CLOUD CONSOLE:
#    - Ve a: https://console.cloud.google.com/apis/library
#    - Busca: "Generative Language API"
#    - Configura restricciones por modelo
#
# 2. RESTRICCIONES DE API KEY:
#    - En Google AI Studio: https://makersuite.google.com/app/apikey
#    - Crear nueva key con restricciones:
#      ✅ PERMITIR: Gemini 2.0 Flash
#      ❌ DENEGAR: Gemini 2.5 Flash Lite
#      ❌ DENEGAR: Gemini 2.5 Pro
#      ❌ DENEGAR: Todos los demás modelos
#
# 3. CUOTAS Y LÍMITES:
#    - Configurar cuota 0 para modelos no deseados
#    - Configurar cuota adecuada solo para Gemini 2.0 Flash
#
# 4. MONITOREO:
#    - Activar alertas en Google Cloud Monitoring
#    - Configurar notificaciones por uso de modelos no autorizados

# Variables de entorno para control adicional
GOOGLE_AI_ALLOWED_MODELS=googleai/gemini-2.0-flash
GOOGLE_AI_BLOCKED_MODELS=googleai/gemini-2.5-flash-lite,googleai/gemini-2.5-pro,googleai/gemini-2.5-pro-exp
