import { NextRequest, NextResponse } from 'next/server';
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';

export async function POST(request: NextRequest) {
  try {
    const { date, days, locales, type = 'daily' } = await request.json();
    
    console.log('🔧 API: Solicitud de generación recibida', { date, days, locales, type });
    
    if (date) {
      // Generar para una fecha específica
      const targetDate = new Date(date);
      const targetLocales = locales || ['es', 'en', 'de', 'fr'];
      
      if (type === 'complete') {
        await HoroscopeBatchGenerator.generateCompleteHoroscopesForDate(targetDate, targetLocales);
      } else {
        await HoroscopeBatchGenerator.generateDailyHoroscopesForDate(targetDate, targetLocales);
      }
      
    } else if (days) {
      // Generar para los próximos N días
      await HoroscopeBatchGenerator.generateHoroscopesForNextDays(
        days,
        locales || ['es', 'en', 'de', 'fr']
      );
    } else {
      // Generar para mañana por defecto
      await HoroscopeBatchGenerator.generateTomorrowHoroscopes();
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Horóscopos generados exitosamente',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error en API de generación:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error generando horóscopos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Método GET para verificar el estado del servicio
export async function GET() {
  return NextResponse.json({
    service: 'Horoscope Generation API',
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      POST: 'Generar horóscopos',
      parameters: {
        date: 'YYYY-MM-DD (opcional)',
        days: 'número de días a generar (opcional)',
        locales: 'array de idiomas (opcional)',
        type: 'daily | complete (opcional)'
      }
    }
  });
}
