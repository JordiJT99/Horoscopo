import { NextResponse } from 'next/server';
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';
import { validateModel, getAllowedModel } from '@/ai/model-config';
import { initializeCronEnvironment } from '@/ai/cron-config';

// Esta ruta está diseñada para ser llamada por Vercel Cron o cron jobs externos
export async function GET() {
  try {
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
    
  } catch (error) {
    console.error('❌ Error en cron job:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate horoscopes',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}

// También permitir POST para testing manual
export async function POST() {
  return GET();
}
