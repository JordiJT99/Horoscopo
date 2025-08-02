import { NextRequest, NextResponse } from 'next/server';
import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';
import type { Locale } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get('locale') || 'es') as Locale;
    const sign = searchParams.get('sign');
    const { date } = await params;

    console.log(`🔍 API: Cargando horóscopos para ${date} (${locale})`);

    if (sign) {
      // Cargar horóscopo para un signo específico
      let horoscope = await HoroscopeFirestoreService.loadHoroscopeForSign(
        sign as any,
        date,
        locale
      );

      // Si no existe, generamos automáticamente
      if (!horoscope) {
        console.log(`🔄 Generando horóscopo automáticamente para ${sign} - ${date} (${locale})`);
        try {
          await HoroscopeBatchGenerator.generateDailyHoroscopes(date, [locale]);
          
          // Intentar cargar de nuevo después de generar
          horoscope = await HoroscopeFirestoreService.loadHoroscopeForSign(
            sign as any,
            date,
            locale
          );
        } catch (generateError) {
          console.error('❌ Error generando horóscopo automáticamente:', generateError);
          return NextResponse.json(
            { error: 'Error generando horóscopo automáticamente' },
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
      // Cargar horóscopos para todos los signos
      let horoscopes = await HoroscopeFirestoreService.loadDailyHoroscopes(
        date,
        locale
      );

      // Si no existen, generamos automáticamente
      if (!horoscopes) {
        console.log(`🔄 Generando todos los horóscopos automáticamente para ${date} (${locale})`);
        try {
          await HoroscopeBatchGenerator.generateDailyHoroscopes(date, [locale]);
          
          // Intentar cargar de nuevo después de generar
          horoscopes = await HoroscopeFirestoreService.loadDailyHoroscopes(
            date,
            locale
          );
        } catch (generateError) {
          console.error('❌ Error generando horóscopos automáticamente:', generateError);
          return NextResponse.json(
            { error: 'Error generando horóscopos automáticamente' },
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
        error: 'Error cargando horóscopos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
