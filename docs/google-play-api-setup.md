# Configuración de Google Play Developer API

## 🔧 Pasos para Configurar la API

### 1. **Crear Service Account en Google Cloud Console**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto (o crea uno nuevo)
3. Ve a "IAM & Admin" → "Service Accounts"
4. Clic en "Create Service Account"
5. Nombre: `astromistica-play-api`
6. Descripción: `Service account for Google Play Developer API`
7. Clic en "Create and Continue"

### 2. **Asignar Permisos**

1. En el paso de roles, asigna:
   - `Service Account User`
   - `Google Play Developer Reporting API`
2. Clic en "Continue" y luego "Done"

### 3. **Generar Clave JSON**

1. En la lista de service accounts, clic en el email del account creado
2. Ve a la pestaña "Keys"
3. Clic en "Add Key" → "Create new key"
4. Selecciona "JSON" y clic en "Create"
5. Descarga el archivo JSON

### 4. **Configurar en Google Play Console**

1. Ve a [Google Play Console](https://play.google.com/console/)
2. Selecciona tu aplicación
3. Ve a "Setup" → "API access"
4. Clic en "Link a project"
5. Selecciona tu proyecto de Google Cloud
6. En "Service accounts", encuentra tu service account
7. Clic en "Grant access"
8. Asigna permisos:
   - **Financials data**: View only
   - **Play Console Reports**: View only
   - **Store presence**: View and edit
   - **Order management**: View only

### 5. **Configurar Variables de Entorno**

```bash
# .env.local
GOOGLE_APPLICATION_CREDENTIALS="/path/to/your/service-account-key.json"
GOOGLE_PLAY_PACKAGE_NAME="com.astromistica.horoscopo"
```

### 6. **Estructura del Service Account JSON**

El archivo JSON debe tener esta estructura:
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "astromistica-play-api@your-project.iam.gserviceaccount.com",
  "client_id": "client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

## 🔐 Seguridad

### Variables de Entorno para Producción

```bash
# Para Vercel/Netlify
GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account",...}'

# Para otros servicios
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL="astromistica-play-api@your-project.iam.gserviceaccount.com"
GOOGLE_PROJECT_ID="your-project-id"
```

### Alternativa para Deployment (sin archivo)

```typescript
// src/lib/google-play-api.ts
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  },
  scopes: ['https://www.googleapis.com/auth/androidpublisher'],
});
```

## 🧪 Testing

### Test de Conexión

```typescript
// Test básico para verificar configuración
const testConnection = async () => {
  try {
    const result = await googlePlayAPI.verifySubscription(
      'test_subscription_id',
      'test_token'
    );
    console.log('API Connection:', result);
  } catch (error) {
    console.error('API Error:', error);
  }
};
```

### Productos de Test

Configura productos de test en Google Play Console:
- `astromistica_premium_monthly_test`
- `astromistica_premium_yearly_test`
- `remove_ads_forever_test`

## 📊 Monitoreo

### Logs Importantes

1. **Verificaciones exitosas**
2. **Errores de API**
3. **Suscripciones expiradas**
4. **Acknowledgments fallidos**

### Métricas

- Tiempo de respuesta de API
- Tasa de errores
- Verificaciones por hora
- Estado de suscripciones

---

**⚠️ Importante**: Nunca commitees el archivo JSON de service account al repositorio. Usa variables de entorno siempre.
