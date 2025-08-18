// src/app/api/premium/tomorrow-horoscope/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withFeatureAccess } from '@/lib/premium-middleware';
import { getHoroscopeFlow } from '@/ai/flows/horoscope-flow';

/**
 * API para obtener el horóscopo de mañana (solo para usuarios premium)
 */
async function handleTomorrowHoroscope(request: NextRequest, premiumInfo: any) {
  try {
    const { searchParams } = new URL(request.url);
    const sign = searchParams.get('sign');
    const locale = searchParams.get('locale') || 'es';

    if (!sign) {
      return NextResponse.json({
        success: false,
        error: 'Sign parameter is required',
      }, { status: 400 });
    }

    // Obtener la fecha de mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    // Generar horóscopo del futuro usando IA
    const horoscope = await getHoroscopeFlow({
      sign: sign as any,
      locale: locale,
      targetDate: tomorrowString,
      userId: premiumInfo.userId,
    });

    return NextResponse.json({
      success: true,
      horoscope,
      date: tomorrowString,
      sign,
      premiumFeature: 'tomorrow_horoscope',
    });

  } catch (error) {
    console.error('Error generating tomorrow horoscope:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate tomorrow horoscope',
    }, { status: 500 });
  }
}

// Exportar con middleware de premium
export const GET = withFeatureAccess('tomorrow_horoscope')(handleTomorrowHoroscope);
