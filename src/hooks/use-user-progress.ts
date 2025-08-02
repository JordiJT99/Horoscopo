import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserProgressService, type UserProgressData } from '@/lib/user-progress-service';

interface UseUserProgressReturn {
  progressData: UserProgressData | null;
  loading: boolean;
  error: Error | null;
  
  // Métodos de actualización
  updateProgress: (updates: Partial<UserProgressData>) => Promise<void>;
  trackFeature: (featureName: string) => Promise<void>;
  updateLoginStreak: () => Promise<{ newStreak: number; isRecord: boolean }>;
  unlockAchievement: (achievementId: string) => Promise<boolean>;
  
  // Utilidades
  createBackup: () => Promise<void>;
  getStats: () => Promise<any>;
  refresh: () => Promise<void>;
}

export function useUserProgress(): UseUserProgressReturn {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<UserProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Cargar progreso inicial
  const loadProgress = useCallback(async () => {
    if (!user?.uid) {
      setProgressData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔄 Cargando progreso para usuario: ${user.uid}`);
      
      // Migrar datos si es necesario
      await UserProgressService.migrateUserData(user.uid);
      
      // Cargar progreso
      const data = await UserProgressService.getUserProgress(user.uid);
      setProgressData(data);
      
      // Actualizar racha de login automáticamente
      if (data) {
        try {
          await UserProgressService.updateLoginStreak(user.uid);
        } catch (streakError) {
          console.warn('No se pudo actualizar racha de login:', streakError);
        }
      }
      
    } catch (err) {
      console.error('Error cargando progreso del usuario:', err);
      setError(err instanceof Error ? err : new Error('Error desconocido'));
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Cargar al montar el componente o cambiar usuario
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Actualizar progreso
  const updateProgress = useCallback(async (updates: Partial<UserProgressData>) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');
    
    try {
      await UserProgressService.updateUserProgress(user.uid, updates);
      
      // Actualizar estado local
      setProgressData(prev => prev ? { ...prev, ...updates } : null);
      
      console.log('✅ Progreso actualizado localmente y en BD');
    } catch (err) {
      console.error('Error actualizando progreso:', err);
      throw err;
    }
  }, [user?.uid]);

  // Registrar uso de característica
  const trackFeature = useCallback(async (featureName: string) => {
    if (!user?.uid) return;
    
    try {
      await UserProgressService.trackFeatureUsage(user.uid, featureName);
      
      // Actualizar estado local
      setProgressData(prev => {
        if (!prev) return null;
        
        const currentUsage = prev.totalFeatureUsage || {};
        return {
          ...prev,
          totalFeatureUsage: {
            ...currentUsage,
            [featureName]: (currentUsage[featureName] || 0) + 1
          }
        };
      });
      
    } catch (err) {
      console.error('Error registrando uso de característica:', err);
    }
  }, [user?.uid]);

  // Actualizar racha de login
  const updateLoginStreak = useCallback(async () => {
    if (!user?.uid) throw new Error('Usuario no autenticado');
    
    try {
      const result = await UserProgressService.updateLoginStreak(user.uid);
      
      // Actualizar estado local
      setProgressData(prev => {
        if (!prev) return null;
        
        return {
          ...prev,
          streakData: {
            currentLoginStreak: result.newStreak,
            longestLoginStreak: prev.streakData?.longestLoginStreak || result.newStreak,
            lastLoginDate: new Date().toISOString().split('T')[0]
          }
        };
      });
      
      return result;
    } catch (err) {
      console.error('Error actualizando racha de login:', err);
      throw err;
    }
  }, [user?.uid]);

  // Desbloquear logro
  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');
    
    try {
      const unlocked = await UserProgressService.unlockAchievement(user.uid, achievementId);
      
      if (unlocked) {
        // Actualizar estado local
        setProgressData(prev => {
          if (!prev) return null;
          
          const currentAchievements = prev.achievements || [];
          return {
            ...prev,
            achievements: [...currentAchievements, achievementId]
          };
        });
      }
      
      return unlocked;
    } catch (err) {
      console.error('Error desbloqueando logro:', err);
      throw err;
    }
  }, [user?.uid]);

  // Crear backup
  const createBackup = useCallback(async () => {
    if (!user?.uid) throw new Error('Usuario no autenticado');
    
    try {
      await UserProgressService.createProgressBackup(user.uid);
      console.log('✅ Backup creado exitosamente');
    } catch (err) {
      console.error('Error creando backup:', err);
      throw err;
    }
  }, [user?.uid]);

  // Obtener estadísticas
  const getStats = useCallback(async () => {
    if (!user?.uid) throw new Error('Usuario no autenticado');
    
    try {
      return await UserProgressService.getUserStats(user.uid);
    } catch (err) {
      console.error('Error obteniendo estadísticas:', err);
      throw err;
    }
  }, [user?.uid]);

  // Refrescar datos
  const refresh = useCallback(async () => {
    await loadProgress();
  }, [loadProgress]);

  return {
    progressData,
    loading,
    error,
    updateProgress,
    trackFeature,
    updateLoginStreak,
    unlockAchievement,
    createBackup,
    getStats,
    refresh
  };
}
