/**
 * @fileOverview Test de seguridad para verificar que las restricciones funcionan
 */

// Simulamos el interceptor de seguridad localmente
const PROHIBITED_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite', 
  'gemini-2.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-pro'
];

function installSecurityInterceptor() {
  const originalFetch = global.fetch;
  
  global.fetch = async function(url, options) {
    if (typeof url === 'string' && url.includes('generativelanguage.googleapis.com')) {
      for (const model of PROHIBITED_MODELS) {
        if (url.includes(model)) {
          console.log(`🚫 SECURITY BLOCK: Blocked call to prohibited model: ${model}`);
          throw new Error(`SECURITY BLOCK: ${model} is not authorized`);
        }
      }
      console.log(`🔒 SECURITY CHECK: Authorized model call detected`);
    }
    
    if (originalFetch) {
      return originalFetch(url, options);
    } else {
      throw new Error('Network simulation - no actual fetch');
    }
  };
  
  console.log('🛡️ Security Interceptor instalado - Bloqueando modelos no autorizados');
}

// Instalar interceptor
installSecurityInterceptor();

console.log('🧪 INICIANDO TESTS DE SEGURIDAD...');

// Test 1: Simular llamada a modelo prohibido
async function testProhibitedModel() {
  try {
    console.log('\n🧪 Test 1: Intentando llamada a gemini-2.5-flash-lite...');
    
    // Simular llamada HTTP que sería bloqueada
    await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gemini-2.5-flash-lite',
        prompt: 'test'
      })
    });
    
    console.log('❌ ERROR: Llamada no bloqueada - FALLO DE SEGURIDAD');
  } catch (error) {
    if (error.message.includes('SECURITY BLOCK')) {
      console.log('✅ ÉXITO: Llamada bloqueada correctamente');
    } else {
      console.log('⚠️ Bloqueada por otra razón:', error.message);
    }
  }
}

// Test 2: Verificar llamada autorizada
async function testAuthorizedModel() {
  try {
    console.log('\n🧪 Test 2: Intentando llamada a gemini-2.0-flash...');
    
    // Esta llamada debería pasar (aunque falle por API key)
    await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      body: JSON.stringify({
        model: 'gemini-2.0-flash',
        prompt: 'test'
      })
    });
    
    console.log('✅ ÉXITO: Llamada autorizada pasó el interceptor');
  } catch (error) {
    if (error.message.includes('SECURITY BLOCK')) {
      console.log('❌ ERROR: Llamada autorizada fue bloqueada');
    } else {
      console.log('✅ ÉXITO: Llamada pasó interceptor (falló por API key/red)');
    }
  }
}

// Ejecutar tests
async function runSecurityTests() {
  await testProhibitedModel();
  await testAuthorizedModel();
  console.log('\n🏁 TESTS DE SEGURIDAD COMPLETADOS');
}

runSecurityTests().catch(console.error);
