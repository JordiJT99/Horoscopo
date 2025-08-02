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

    // Logging adicional para debugging
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const isWebView = userAgent.includes('wv') || userAgent.includes('WebView');
    
    console.log(`🔍 API: Cargando horóscopos para ${date} (${locale})`, {
      sign,
      userAgent: isWebView ? userAgent : 'browser',
      isWebView
    });

    // Validar parámetros
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Formato de fecha inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

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
            { error: 'Error generando horóscopo automáticamente', details: generateError instanceof Error ? generateError.message : 'Unknown error' },
            { 
              status: 500,
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              }
            }
          );
        }
      }

      if (!horoscope) {
        return NextResponse.json(
          { error: 'Horóscopo no encontrado y no se pudo generar' },
          { 
            status: 404,
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }

      return NextResponse.json({ 
        date,
        locale,
        sign,
        horoscope 
      }, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
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
            { error: 'Error generando horóscopos automáticamente', details: generateError instanceof Error ? generateError.message : 'Unknown error' },
            { 
              status: 500,
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
              }
            }
          );
        }
      }

      if (!horoscopes) {
        return NextResponse.json(
          { error: 'Horóscopos no encontrados y no se pudieron generar' },
          { 
            status: 404,
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Access-Control-Allow-Origin': '*'
            }
          }
        );
      }

      return NextResponse.json({ 
        date,
        locale,
        horoscopes 
      }, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
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
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
