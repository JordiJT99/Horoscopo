# PowerShell script para limpiar horoscopos antiguos
# Se puede ejecutar como tarea programada o manualmente

# Configuracion
$CleanupUrl = "http://localhost:9002/api/admin/cleanup-horoscopes?key=cleanup-old-horoscopes-2025&action=execute"
$LogDir = "./logs"
$LogFile = "$LogDir/horoscope-cleanup.log"

# Crear directorio de logs si no existe
if (!(Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

# Funcion para logging
function Write-Log {
    param([string]$Message)
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] $Message"
    Write-Host $LogEntry
    Add-Content -Path $LogFile -Value $LogEntry
}

Write-Log "Iniciando limpieza automatica de horoscopos antiguos..."

try {
    # Hacer la peticion GET al endpoint de limpieza
    $response = Invoke-RestMethod -Uri $CleanupUrl -Method GET
    
    Write-Log "Limpieza completada exitosamente"
    Write-Log "Horoscopos eliminados: $($response.cleaned)"
    Write-Log "Errores encontrados: $($response.errors.Count)"
    
    if ($response.errors.Count -gt 0) {
        Write-Log "Detalles de errores:"
        foreach ($error in $response.errors) {
            Write-Log "   - $error"
        }
    }
    
} catch {
    Write-Log "Error en limpieza: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Log "Codigo HTTP: $statusCode"
    }
}

Write-Log "Finalizando script de limpieza"
Write-Host ""
