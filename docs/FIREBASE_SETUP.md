# Configuración de Firebase Admin SDK

## Archivo de Credenciales

Para que las APIs del servidor funcionen correctamente, necesitas crear un archivo `firebase-service-account.json` en la raíz del proyecto.

### Pasos para obtener las credenciales:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto (`astrovibes-xv2f4`)
3. Ve a **Configuración del proyecto** (ícono de engranaje)
4. Ve a la pestaña **Cuentas de servicio**
5. Haz clic en **Generar nueva clave privada**
6. Descarga el archivo JSON
7. Renómbralo a `firebase-service-account.json`
8. Colócalo en la raíz del proyecto

### Estructura del archivo:

Usa `firebase-service-account.example.json` como referencia para la estructura correcta.

### Variables de entorno:

En tu archivo `.env`, asegúrate de tener:
```
FIREBASE_SERVICE_ACCOUNT_KEY=./firebase-service-account.json
```

### Seguridad:

- ❌ **NUNCA** subas el archivo real `firebase-service-account.json` al repositorio
- ✅ El archivo está incluido en `.gitignore`
- ✅ Solo comparte las credenciales de forma segura con el equipo

### Verificación:

Puedes verificar que todo funciona visitando: `http://localhost:9002/api/admin-status`
