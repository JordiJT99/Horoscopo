'use client';

import { useState } from 'react';
import { verifyAppCheck } from '@/lib/firebase';

export default function AppCheckTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAppCheck = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const checkResult = await verifyAppCheck();
      setResult(checkResult);
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-4">🛡️ Prueba de App Check</h2>
      
      <button
        onClick={testAppCheck}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded font-medium"
      >
        {loading ? 'Verificando...' : 'Verificar App Check'}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded ${result.success ? 'bg-green-800' : 'bg-red-800'}`}>
          <h3 className="font-bold">
            {result.success ? '✅ Éxito' : '❌ Error'}
          </h3>
          
          {result.success && result.token && (
            <div className="mt-2">
              <p className="text-sm">Token obtenido (primeros 50 caracteres):</p>
              <code className="text-xs bg-black p-2 rounded block mt-1">
                {result.token.substring(0, 50)}...
              </code>
            </div>
          )}
          
          {result.error && (
            <p className="mt-2 text-sm">Error: {result.error}</p>
          )}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-400">
        <p>Esta herramienta verifica si App Check está funcionando correctamente.</p>
        <p>En producción, esto debe mostrar éxito para que Firestore funcione.</p>
      </div>
    </div>
  );
}
