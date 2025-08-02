#!/bin/bash

# Script para generar horóscopos diarios via cron
# Ejecutar diariamente a las 00:00 UTC

echo "🕐 $(date): Iniciando generación diaria de horóscopos"

# URL de tu aplicación (cambiar por tu dominio real)
API_URL="${HOROSCOPE_API_URL:-http://localhost:3000}/api/cron/generate-horoscopes"

# Realizar la petición
response=$(curl -s -w "%{http_code}" -X GET "$API_URL")
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" -eq 200 ]; then
    echo "✅ $(date): Horóscopos generados exitosamente"
    echo "📊 Respuesta: $body"
else
    echo "❌ $(date): Error generando horóscopos (HTTP $http_code)"
    echo "📊 Respuesta: $body"
    
    # Opcional: enviar notificación de error (configurar según tus necesidades)
    # echo "Error generando horóscopos: $body" | mail -s "Error Horoscope Generation" admin@tudominio.com
fi

echo "🏁 $(date): Script completado"
