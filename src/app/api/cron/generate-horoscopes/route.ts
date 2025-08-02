import { NextResponse } from 'next/server';
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';

// Esta ruta está diseñada para ser llamada por Vercel Cron o cron jobs externos
export async function GET() {
  try {
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
