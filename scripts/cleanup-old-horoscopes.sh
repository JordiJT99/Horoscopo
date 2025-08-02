#!/bin/bash

# Script para limpiar horóscopos antiguos
# Se puede ejecutar como cron job o manualmente

# Configuración
CLEANUP_URL="http://localhost:9002/api/admin/cleanup-horoscopes?key=cleanup-old-horoscopes-2025&action=execute"
LOG_FILE="./logs/horoscope-cleanup.log"

# Crear directorio de logs si no existe
mkdir -p ./logs

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "🧹 Iniciando limpieza automática de horóscopos antiguos..."

# Hacer la petición GET al endpoint de limpieza
response=$(curl -s -X GET "$CLEANUP_URL" \
    -w "HTTP_STATUS:%{http_code}")

# Extraer código de estado HTTP
http_status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
response_body=$(echo "$response" | sed 's/HTTP_STATUS:[0-9]*$//')

log "📡 Respuesta HTTP: $http_status"

if [ "$http_status" = "200" ]; then
    log "✅ Limpieza completada exitosamente"
    log "📊 Resultado: $response_body"
else
    log "❌ Error en limpieza (HTTP $http_status)"
    log "📄 Respuesta: $response_body"
fi

log "🏁 Finalizando script de limpieza"
echo ""
