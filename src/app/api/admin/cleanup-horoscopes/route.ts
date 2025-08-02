import { NextRequest, NextResponse } from 'next/server';
import { HoroscopeFirestoreService } from '@/lib/horoscope-firestore-service';

export async function POST(request: NextRequest) {
  try {
    // Verificar que sea una solicitud autorizada (opcional: añadir autenticación admin)
    const { searchParams } = new URL(request.url);
    const authKey = searchParams.get('key');
    
    // Clave simple para evitar ejecución accidental (puedes cambiarla)
    if (authKey !== 'cleanup-old-horoscopes-2025') {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid auth key' },
        { status: 401 }
      );
    }

    console.log('🧹 Iniciando limpieza manual de horóscopos antiguos...');
    
    const result = await HoroscopeFirestoreService.cleanOldDailyHoroscopes();
    
    const response = {
      success: true,
      message: 'Limpieza completada exitosamente',
      cleaned: result.cleaned,
      errors: result.errors,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Resultado de limpieza:', response);
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('❌ Error en endpoint de limpieza:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authKey = searchParams.get('key');
    const action = searchParams.get('action');
    
    // Si no hay clave o acción, mostrar información
    if (!authKey || !action) {
      return NextResponse.json({
        message: 'Endpoint de limpieza de horóscopos',
        usage: {
          info: 'GET /api/admin/cleanup-horoscopes',
          execute: 'GET /api/admin/cleanup-horoscopes?key=cleanup-old-horoscopes-2025&action=execute',
          post: 'POST /api/admin/cleanup-horoscopes?key=cleanup-old-horoscopes-2025'
        },
        description: 'Elimina horóscopos diarios con más de 1 semana de antigüedad'
      });
    }
    
    // Verificar clave de autorización
    if (authKey !== 'cleanup-old-horoscopes-2025') {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid auth key' },
        { status: 401 }
      );
    }
    
    // Si action=execute, ejecutar la limpieza
    if (action === 'execute') {
      console.log('🧹 Iniciando limpieza via GET con action=execute...');
      
      const result = await HoroscopeFirestoreService.cleanOldDailyHoroscopes();
      
      const response = {
        success: true,
        message: 'Limpieza completada exitosamente via GET',
        cleaned: result.cleaned,
        errors: result.errors,
        timestamp: new Date().toISOString(),
        method: 'GET'
      };
      
      console.log('✅ Resultado de limpieza via GET:', response);
      
      return NextResponse.json(response, { status: 200 });
    }
    
    return NextResponse.json({
      message: 'Parámetro action requerido',
      validActions: ['execute'],
      example: '/api/admin/cleanup-horoscopes?key=cleanup-old-horoscopes-2025&action=execute'
    });
    
  } catch (error) {
    console.error('❌ Error en endpoint de limpieza via GET:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
        method: 'GET'
      },
      { status: 500 }
    );
  }
}
