import { NextRequest, NextResponse } from 'next/server';
import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';
import type { Locale } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get('locale') || 'es') as Locale;
    const sign = searchParams.get('sign');
    const { date } = params;

    const userAgent = request.headers.get('user-agent') || 'unknown';
    const platform = request.headers.get('x-platform') || 'unknown';
    const isCapacitor = request.headers.get('x-is-capacitor') === 'true' || /capacitor/i.test(userAgent);
    
    console.log(`🔍 API: Cargando horóscopos para ${date} (${locale})`, {
      sign,
      platform,
      isCapacitor,
    });

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (sign) {
      let horoscope = await HoroscopeFirestoreService.loadHoroscopeForSign(
        sign as any,
        date,
        locale
      );

      if (!horoscope) {
        console.log(`🔄 Generando horóscopo automáticamente para ${sign} - ${date} (${locale})`);
        try {
          await HoroscopeBatchGenerator.generateDailyHoroscopes(date, [locale]);
          horoscope = await HoroscopeFirestoreService.loadHoroscopeForSign(
            sign as any,
            date,
            locale
          );
        } catch (generateError) {
          console.error('❌ Error generando horóscopo automáticamente:', generateError);
          return NextResponse.json(
            { error: 'Error generando horóscopo automáticamente', details: generateError instanceof Error ? generateError.message : 'Unknown error' },
            { status: 500 }
          );
        }
      }

      if (!horoscope) {
        return NextResponse.json(
          { error: 'Horóscopo no encontrado y no se pudo generar' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        date,
        locale,
        sign,
        horoscope 
      });
    } else {
      let horoscopes = await HoroscopeFirestoreService.loadDailyHoroscopes(
        date,
        locale
      );

      if (!horoscopes) {
        console.log(`🔄 Generando todos los horóscopos automáticamente para ${date} (${locale})`);
        try {
          await HoroscopeBatchGenerator.generateDailyHoroscopes(date, [locale]);
          horoscopes = await HoroscopeFirestoreService.loadDailyHoroscopes(
            date,
            locale
          );
        } catch (generateError) {
          console.error('❌ Error generando horóscopos automáticamente:', generateError);
          return NextResponse.json(
            { error: 'Error generando horóscopos automáticamente', details: generateError instanceof Error ? generateError.message : 'Unknown error' },
            { status: 500 }
          );
        }
      }

      if (!horoscopes) {
        return NextResponse.json(
          { error: 'Horóscopos no encontrados y no se pudieron generar' },
          { status: 404 }
        );
      }

      return NextResponse.json({ 
        date,
        locale,
        horoscopes 
      });
    }
    
  } catch (error) {
    console.error('❌ Error cargando horóscopos:', error);
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
