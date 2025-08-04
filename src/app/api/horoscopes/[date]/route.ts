import { NextRequest, NextResponse } from 'next/server';
import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';
import { HoroscopeBatchGenerator } from '@/lib/horoscope-batch-generator';
import type { Locale } from '@/types';

// Función para crear horóscopos mock para desarrollo
function createMockHoroscope(sign: string, date: string, locale: Locale) {
  const signNames = {
    en: {
      Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer',
      Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio',
      Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces'
    },
    es: {
      Aries: 'Aries', Taurus: 'Tauro', Gemini: 'Géminis', Cancer: 'Cáncer',
      Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Escorpio',
      Sagittarius: 'Sagitario', Capricorn: 'Capricornio', Aquarius: 'Acuario', Pisces: 'Piscis'
    }
  };

  const mockMessages = {
    en: {
      general: `Today brings positive energy for ${signNames[locale][sign as keyof typeof signNames[locale]]}. Trust your instincts and embrace new opportunities.`,
      love: "Love is in the air. Open your heart to new connections and strengthen existing bonds.",
      work: "Professional success awaits. Focus on your goals and collaboration with colleagues.",
      health: "Take care of your well-being. A balanced lifestyle will bring you vitality.",
      money: "Financial stability is within reach. Make thoughtful decisions about investments."
    },
    es: {
      general: `Hoy trae energía positiva para ${signNames[locale][sign as keyof typeof signNames[locale]]}. Confía en tus instintos y abraza nuevas oportunidades.`,
      love: "El amor está en el aire. Abre tu corazón a nuevas conexiones y fortalece los lazos existentes.",
      work: "El éxito profesional te espera. Enfócate en tus objetivos y la colaboración con colegas.",
      health: "Cuida tu bienestar. Un estilo de vida equilibrado te traerá vitalidad.",
      money: "La estabilidad financiera está a tu alcance. Toma decisiones reflexivas sobre inversiones."
    }
  };

  const messages = mockMessages[locale] || mockMessages.es;

  return {
    main: messages.general,
    love: messages.love,
    money: messages.money,
    health: messages.health
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get('locale') || 'es') as Locale;
    const sign = searchParams.get('sign');
    const resolvedParams = await params;
    const { date } = resolvedParams;

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
        console.log(`🔄 Usando horóscopo mock para desarrollo - ${sign} (${date})`);
        horoscope = createMockHoroscope(sign as any, date, locale);
      }

      if (!horoscope) {
        // Como último recurso, crear un horóscopo mock
        console.log('🔄 Creando horóscopo mock como fallback');
        horoscope = createMockHoroscope(sign as any, date, locale);
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
