import { NextRequest, NextResponse } from 'next/server';
import { UserProgressService } from '@/lib/user-progress-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Diferentes acciones disponibles
    switch (action) {
      case 'stats':
        const stats = await UserProgressService.getUserStats(userId);
        return NextResponse.json({ success: true, stats });
        
      case 'backup':
        await UserProgressService.createProgressBackup(userId);
        return NextResponse.json({ success: true, message: 'Backup created successfully' });
        
      case 'migrate':
        await UserProgressService.migrateUserData(userId);
        return NextResponse.json({ success: true, message: 'Migration completed' });
        
      default:
        // Obtener progreso completo del usuario
        const progress = await UserProgressService.getUserProgress(userId);
        return NextResponse.json({ 
          success: true, 
          progress: progress || {},
          timestamp: new Date().toISOString()
        });
    }
    
  } catch (error) {
    console.error('❌ Error en endpoint de progreso del usuario:', error);
    
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

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    switch (action) {
      case 'update':
        await UserProgressService.updateUserProgress(userId, body.updates);
        return NextResponse.json({ 
          success: true, 
          message: 'Progress updated successfully' 
        });
        
      case 'increment':
        await UserProgressService.incrementCounters(userId, body.increments);
        return NextResponse.json({ 
          success: true, 
          message: 'Counters incremented successfully' 
        });
        
      case 'track-feature':
        await UserProgressService.trackFeatureUsage(userId, body.featureName);
        return NextResponse.json({ 
          success: true, 
          message: 'Feature usage tracked' 
        });
        
      case 'unlock-achievement':
        const unlocked = await UserProgressService.unlockAchievement(userId, body.achievementId);
        return NextResponse.json({ 
          success: true, 
          unlocked,
          message: unlocked ? 'Achievement unlocked' : 'Achievement already unlocked'
        });
        
      case 'login-streak':
        const streakResult = await UserProgressService.updateLoginStreak(userId);
        return NextResponse.json({ 
          success: true, 
          streak: streakResult.newStreak,
          isRecord: streakResult.isRecord
        });
        
      default:
        // Guardar progreso completo
        await UserProgressService.saveUserProgress(userId, body);
        return NextResponse.json({ 
          success: true, 
          message: 'Progress saved successfully' 
        });
    }
    
  } catch (error) {
    console.error('❌ Error en endpoint POST de progreso del usuario:', error);
    
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

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Sincronización completa de datos
    await UserProgressService.saveUserProgress(userId, body);
    
    // Crear backup automático después de sincronización
    await UserProgressService.createProgressBackup(userId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Progress synchronized and backup created',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error en sincronización de progreso:', error);
    
    return NextResponse.json(
      { 
        error: 'Error en sincronización',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
