import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  writeBatch,
  serverTimestamp,
  increment,
  arrayUnion
} from 'firebase/firestore';
import type { CosmicEnergyState, GameActionId } from '@/types';

export interface UserProgressData extends CosmicEnergyState {
  // Datos adicionales de progreso
  createdAt?: Date;
  lastUpdated?: Date;
  totalSessionTime?: number; // Tiempo total en la app (segundos)
  totalFeatureUsage?: Record<string, number>; // Conteo de uso de características
  achievements?: string[]; // Lista de logros desbloqueados
  streakData?: {
    currentLoginStreak: number;
    longestLoginStreak: number;
    lastLoginDate: string;
  };
  preferences?: {
    notifications: boolean;
    theme: string;
    language: string;
  };
}

export interface ProgressBackup {
  userId: string;
  backup: UserProgressData;
  timestamp: Date;
  version: string;
}

export class UserProgressService {
  
  /**
   * Verifica si Firestore está disponible
   */
  private static validateFirestore(): void {
    if (!db) {
      throw new Error('Firestore no está inicializado');
    }
  }

  /**
   * Obtiene el progreso completo del usuario
   */
  static async getUserProgress(userId: string): Promise<UserProgressData | null> {
    try {
      this.validateFirestore();
      
      console.log(`📊 Cargando progreso del usuario: ${userId}`);
      
      const userRef = doc(db!, 'userProfiles', userId);
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        console.log(`📅 No hay progreso guardado para el usuario: ${userId}`);
        return null;
      }
      
      const data = docSnap.data() as UserProgressData;
      console.log(`✅ Progreso cargado para el usuario: ${userId}`, {
        points: data.points,
        level: data.level,
        stardust: data.stardust
      });
      
      return data;
    } catch (error) {
      console.error('❌ Error cargando progreso del usuario:', error);
      throw error;
    }
  }

  /**
   * Guarda el progreso completo del usuario
   */
  static async saveUserProgress(userId: string, progressData: Partial<UserProgressData>): Promise<void> {
    try {
      this.validateFirestore();
      
      console.log(`💾 Guardando progreso del usuario: ${userId}`);
      
      const userRef = doc(db!, 'userProfiles', userId);
      
      // Agregar timestamps
      const dataWithTimestamp = {
        ...progressData,
        lastUpdated: new Date(),
        // Solo agregar createdAt si es un documento nuevo
        ...(!(await getDoc(userRef)).exists() && { createdAt: new Date() })
      };
      
      await setDoc(userRef, dataWithTimestamp, { merge: true });
      
      console.log(`✅ Progreso guardado para el usuario: ${userId}`);
    } catch (error) {
      console.error('❌ Error guardando progreso del usuario:', error);
      throw error;
    }
  }

  /**
   * Actualiza campos específicos del progreso del usuario
   */
  static async updateUserProgress(userId: string, updates: Partial<UserProgressData>): Promise<void> {
    try {
      this.validateFirestore();
      
      const userRef = doc(db!, 'userProfiles', userId);
      
      const updateData = {
        ...updates,
        lastUpdated: new Date()
      };
      
      await updateDoc(userRef, updateData);
      
      console.log(`🔄 Progreso actualizado para el usuario: ${userId}`, updates);
    } catch (error) {
      console.error('❌ Error actualizando progreso del usuario:', error);
      throw error;
    }
  }

  /**
   * Incrementa contadores específicos de forma atómica
   */
  static async incrementCounters(
    userId: string, 
    increments: Record<string, number>
  ): Promise<void> {
    try {
      this.validateFirestore();
      
      const userRef = doc(db!, 'userProfiles', userId);
      const updates: Record<string, any> = {
        lastUpdated: serverTimestamp()
      };
      
      // Convertir increments a operaciones de Firestore
      Object.entries(increments).forEach(([field, value]) => {
        updates[field] = increment(value);
      });
      
      await updateDoc(userRef, updates);
      
      console.log(`📈 Contadores incrementados para el usuario: ${userId}`, increments);
    } catch (error) {
      console.error('❌ Error incrementando contadores:', error);
      throw error;
    }
  }

  /**
   * Registra el uso de una característica
   */
  static async trackFeatureUsage(userId: string, featureName: string): Promise<void> {
    try {
      this.validateFirestore();
      
      const userRef = doc(db!, 'userProfiles', userId);
      
      await updateDoc(userRef, {
        [`totalFeatureUsage.${featureName}`]: increment(1),
        lastUpdated: serverTimestamp()
      });
      
      console.log(`🎯 Uso de característica registrado: ${featureName} para usuario ${userId}`);
    } catch (error) {
      console.error('❌ Error registrando uso de característica:', error);
      // No hacer throw para evitar interrumpir la funcionalidad principal
    }
  }

  /**
   * Actualiza la racha de inicio de sesión
   */
  static async updateLoginStreak(userId: string): Promise<{ newStreak: number; isRecord: boolean }> {
    try {
      this.validateFirestore();
      
      const userRef = doc(db!, 'userProfiles', userId);
      const userDoc = await getDoc(userRef);
      
      const today = new Date().toISOString().split('T')[0];
      let currentStreak = 1;
      let longestStreak = 1;
      let isRecord = false;
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProgressData;
        const streakData = data.streakData;
        
        if (streakData) {
          const lastLogin = streakData.lastLoginDate;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          if (lastLogin === yesterday.toString()) {
            // Continuó la racha
            currentStreak = streakData.currentLoginStreak + 1;
          } else if (lastLogin === today) {
            // Ya inició sesión hoy
            return {
              newStreak: streakData.currentLoginStreak,
              isRecord: false
            };
          }
          // Si no es consecutivo, se reinicia a 1
          
          longestStreak = Math.max(currentStreak, streakData.longestLoginStreak);
          isRecord = currentStreak > streakData.longestLoginStreak;
        }
      }
      
      await updateDoc(userRef, {
        'streakData.currentLoginStreak': currentStreak,
        'streakData.longestLoginStreak': longestStreak,
        'streakData.lastLoginDate': today,
        lastUpdated: serverTimestamp()
      });
      
      console.log(`🔥 Racha de login actualizada para ${userId}: ${currentStreak} días`);
      
      return { newStreak: currentStreak, isRecord };
    } catch (error) {
      console.error('❌ Error actualizando racha de login:', error);
      return { newStreak: 1, isRecord: false };
    }
  }

  /**
   * Añade un logro al usuario
   */
  static async unlockAchievement(userId: string, achievementId: string): Promise<boolean> {
    try {
      this.validateFirestore();
      
      const userRef = doc(db!, 'userProfiles', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProgressData;
        const achievements = data.achievements || [];
        
        if (achievements.includes(achievementId)) {
          return false; // Ya tiene el logro
        }
      }
      
      await updateDoc(userRef, {
        achievements: arrayUnion(achievementId),
        lastUpdated: serverTimestamp()
      });
      
      console.log(`🏆 Logro desbloqueado para ${userId}: ${achievementId}`);
      return true;
    } catch (error) {
      console.error('❌ Error desbloqueando logro:', error);
      return false;
    }
  }

  /**
   * Crea una copia de seguridad del progreso del usuario
   */
  static async createProgressBackup(userId: string): Promise<void> {
    try {
      this.validateFirestore();
      
      const progressData = await this.getUserProgress(userId);
      if (!progressData) return;
      
      const backup: ProgressBackup = {
        userId,
        backup: progressData,
        timestamp: new Date(),
        version: '1.0'
      };
      
      const backupRef = doc(db!, 'userProgressBackups', `${userId}_${Date.now()}`);
      await setDoc(backupRef, backup);
      
      console.log(`📦 Backup creado para el usuario: ${userId}`);
    } catch (error) {
      console.error('❌ Error creando backup:', error);
      // No hacer throw para evitar interrumpir la funcionalidad principal
    }
  }

  /**
   * Migra datos antiguos a la nueva estructura (si es necesario)
   */
  static async migrateUserData(userId: string): Promise<void> {
    try {
      this.validateFirestore();
      
      const userRef = doc(db!, 'userProfiles', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return;
      
      const data = userDoc.data() as any;
      
      // Migrar solo si no tiene la nueva estructura
      if (!data.totalFeatureUsage || !data.streakData) {
        const migrationUpdates: Partial<UserProgressData> = {};
        
        if (!data.totalFeatureUsage) {
          migrationUpdates.totalFeatureUsage = {};
        }
        
        if (!data.streakData) {
          migrationUpdates.streakData = {
            currentLoginStreak: 1,
            longestLoginStreak: 1,
            lastLoginDate: new Date().toISOString().split('T')[0]
          };
        }
        
        if (!data.achievements) {
          migrationUpdates.achievements = [];
        }
        
        if (Object.keys(migrationUpdates).length > 0) {
          await updateDoc(userRef, {
            ...migrationUpdates,
            lastUpdated: serverTimestamp()
          });
          
          console.log(`🔄 Datos migrados para el usuario: ${userId}`);
        }
      }
    } catch (error) {
      console.error('❌ Error en migración de datos:', error);
      // No hacer throw para evitar interrumpir la funcionalidad principal
    }
  }

  /**
   * Obtiene estadísticas agregadas del usuario
   */
  static async getUserStats(userId: string): Promise<{
    totalPoints: number;
    currentLevel: number;
    totalStardust: number;
    loginStreak: number;
    achievementsCount: number;
    featuresUsed: number;
  } | null> {
    try {
      const progressData = await this.getUserProgress(userId);
      if (!progressData) return null;
      
      return {
        totalPoints: progressData.points || 0,
        currentLevel: progressData.level || 1,
        totalStardust: progressData.stardust || 0,
        loginStreak: progressData.streakData?.currentLoginStreak || 0,
        achievementsCount: progressData.achievements?.length || 0,
        featuresUsed: Object.keys(progressData.totalFeatureUsage || {}).length
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return null;
    }
  }
}
