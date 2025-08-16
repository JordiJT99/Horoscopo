import { NextResponse } from 'next/server';
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';
import { validateModel, getAllowedModel } from '@/ai/model-config';
import { initializeCronEnvironment } from '@/ai/cron-config';

// Esta ruta está diseñada para ser llamada por Vercel Cron o cron jobs externos
export async function GET() {
  try {
    // 🚫 CRON JOB TEMPORALMENTE DESHABILITADO PARA DEPURACIÓN
    console.log('🚫 CRON JOB DESHABILITADO: Evitando consumo automático de tokens');
    
    return NextResponse.json({ 
      success: false,
      message: 'Cron job temporalmente deshabilitado para depuración de consumo de tokens',
      timestamp: new Date().toISOString(),
      disabled: true
    });
    
    /* CÓDIGO ORIGINAL COMENTADO PARA DEPURACIÓN:
    
    // INICIALIZACIÓN COMPLETA DEL ENTORNO CRON
    initializeCronEnvironment();
    
    // VALIDACIÓN CRÍTICA: Verificar modelo autorizado antes de procesar
    const authorizedModel = getAllowedModel();
    validateModel(authorizedModel);
    console.log(`🔒 CRON JOB: Verificado modelo autorizado: ${authorizedModel}`);
    
    console.log('🕐 Cron job iniciado: Generando horóscopos para mañana');
    
    // Generar horóscopos para mañana
    await HoroscopeBatchGenerator.generateTomorrowHoroscopes();
    
    console.log('✅ Cron job completado exitosamente');
    
    return NextResponse.json({ 
      success: true,
      message: 'Horóscopos para mañana generados exitosamente',
      timestamp: new Date().toISOString()
    });
    
    */
    
  } catch (error) {
    console.error('❌ Error en verificación de cron job:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Cron job disabled for debugging',
        details: 'Temporarily disabled to investigate token consumption',
        timestamp: new Date().toISOString()
      }, 
      { status: 503 }
    );
  }
}

// También permitir POST para testing manual
export async function POST() {
  return GET();
}
