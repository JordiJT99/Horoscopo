# Sistema de Limpieza Automática de Horóscopos

## Descripción
Sistema para eliminar automáticamente horóscopos diarios que tengan más de 1 semana de antigüedad, manteniendo la base de datos optimizada.

## Componentes

### 1. Función de Limpieza
- **Archivo**: `src/lib/horoscope-firestore-service.ts`
- **Método**: `cleanOldDailyHoroscopes()`
- **Funcionalidad**: Elimina horóscopos anteriores a 7 días desde la fecha actual

### 2. Endpoint API
- **Ruta**: `/api/admin/cleanup-horoscopes`
- **Método**: POST
- **Autenticación**: Requiere clave `key=cleanup-old-horoscopes-2025`
- **Uso**: `POST /api/admin/cleanup-horoscopes?key=cleanup-old-horoscopes-2025`

### 3. Scripts de Automatización

#### PowerShell (Windows)
```bash
npm run cleanup:horoscopes
```
o directamente:
```powershell
./scripts/cleanup-old-horoscopes.ps1
```

#### Bash (Linux/Mac)
```bash
./scripts/cleanup-old-horoscopes.sh
```

## Funcionamiento

### Proceso de Limpieza
1. **Determina fecha de corte**: 7 días antes de la fecha actual
2. **Escanea colección**: Revisa todos los documentos en `/horoscopes/daily/`
3. **Filtra por fecha**: Identifica documentos anteriores al corte
4. **Eliminación en lotes**: Usa `writeBatch` para eliminar eficientemente
5. **Logs detallados**: Registra el proceso y resultados

### Estructura de Datos Afectada
```
/horoscopes/daily/
  ├── 2025-07-25/     ← Se eliminará (más de 1 semana)
  ├── 2025-07-26/     ← Se eliminará (más de 1 semana)
  ├── 2025-08-01/     ← Se mantiene (menos de 1 semana)
  └── 2025-08-02/     ← Se mantiene (fecha actual)
```

## Ejecución Manual

### Durante Desarrollo
```bash
# Asegúrate de que el servidor esté corriendo
npm run dev

# En otra terminal, ejecuta la limpieza
npm run cleanup:horoscopes
```

### Usando cURL
```bash
curl -X POST "http://localhost:9002/api/admin/cleanup-horoscopes?key=cleanup-old-horoscopes-2025"
```

## Programación Automática

### Windows (Programador de Tareas)
1. Abrir "Programador de tareas"
2. Crear tarea básica
3. Configurar para ejecutar diariamente
4. Acción: Iniciar programa
   - Programa: `powershell`
   - Argumentos: `-ExecutionPolicy Bypass -File "C:\ruta\al\proyecto\scripts\cleanup-old-horoscopes.ps1"`

### Linux/Mac (Cron)
```bash
# Editar crontab
crontab -e

# Añadir línea para ejecutar diariamente a las 3:00 AM
0 3 * * * /ruta/al/proyecto/scripts/cleanup-old-horoscopes.sh
```

## Respuesta del Endpoint

### Éxito (200)
```json
{
  "success": true,
  "message": "Limpieza completada exitosamente",
  "cleaned": 5,
  "errors": [],
  "timestamp": "2025-08-02T10:30:00.000Z"
}
```

### Error (500)
```json
{
  "error": "Error interno del servidor",
  "details": "Descripción del error",
  "timestamp": "2025-08-02T10:30:00.000Z"
}
```

## Logs
- **Ubicación**: `./logs/horoscope-cleanup.log`
- **Formato**: `[YYYY-MM-DD HH:mm:ss] Mensaje`
- **Rotación**: Manual (puedes implementar rotación automática si es necesario)

## Seguridad
- **Clave de autorización**: Evita ejecución accidental
- **Solo POST**: Previene ejecución por GET accidental
- **Logs detallados**: Rastreabilidad completa de operaciones

## Consideraciones
- **Impacto en rendimiento**: Usa batches para optimizar Firestore
- **Horarios recomendados**: Ejecutar durante horas de menor tráfico
- **Frecuencia**: Una vez por día es suficiente
- **Monitoreo**: Revisar logs regularmente para detectar errores

## Troubleshooting

### Error de autenticación
- Verificar que la clave en la URL sea correcta
- Cambiar la clave en el código si es necesario

### Error de Firestore
- Verificar configuración de Firebase
- Comprobar permisos de la base de datos
- Revisar reglas de Firestore

### Error en scripts
- Verificar que el servidor esté corriendo
- Comprobar la URL del endpoint
- Revisar permisos de ejecución de scripts
