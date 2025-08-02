import type { AchievementData } from '@/types';

export const ACHIEVEMENTS: Record<string, AchievementData> = {
  // Logros de Progreso
  first_steps: {
    id: 'first_steps',
    nameKey: 'Achievement.firstSteps.name',
    descriptionKey: 'Achievement.firstSteps.description',
    icon: '👶',
    type: 'progress',
    requirements: { points: 50 },
    rewards: { stardust: 2 }
  },
  
  cosmic_traveler: {
    id: 'cosmic_traveler',
    nameKey: 'Achievement.cosmicTraveler.name',
    descriptionKey: 'Achievement.cosmicTraveler.description',
    icon: '🌌',
    type: 'progress',
    requirements: { points: 500 },
    rewards: { stardust: 5 }
  },
  
  stellar_navigator: {
    id: 'stellar_navigator',
    nameKey: 'Achievement.stellarNavigator.name',
    descriptionKey: 'Achievement.stellarNavigator.description',
    icon: '⭐',
    type: 'progress',
    requirements: { points: 1500 },
    rewards: { stardust: 10 }
  },
  
  // Logros de Nivel
  novice_mystic: {
    id: 'novice_mystic',
    nameKey: 'Achievement.noviceMystic.name',
    descriptionKey: 'Achievement.noviceMystic.description',
    icon: '🔮',
    type: 'milestone',
    requirements: { level: 3 },
    rewards: { stardust: 3 }
  },
  
  seasoned_oracle: {
    id: 'seasoned_oracle',
    nameKey: 'Achievement.seasonedOracle.name',
    descriptionKey: 'Achievement.seasonedOracle.description',
    icon: '🧙‍♀️',
    type: 'milestone',
    requirements: { level: 5 },
    rewards: { stardust: 5 }
  },
  
  master_astrologer: {
    id: 'master_astrologer',
    nameKey: 'Achievement.masterAstrologer.name',
    descriptionKey: 'Achievement.masterAstrologer.description',
    icon: '🏆',
    type: 'milestone',
    requirements: { level: 10 },
    rewards: { stardust: 15 }
  },
  
  // Logros de Racha
  daily_devotee: {
    id: 'daily_devotee',
    nameKey: 'Achievement.dailyDevotee.name',
    descriptionKey: 'Achievement.dailyDevotee.description',
    icon: '📅',
    type: 'special',
    requirements: { streak: 7 },
    rewards: { stardust: 7 }
  },
  
  cosmic_consistency: {
    id: 'cosmic_consistency',
    nameKey: 'Achievement.cosmicConsistency.name',
    descriptionKey: 'Achievement.cosmicConsistency.description',
    icon: '🔥',
    type: 'special',
    requirements: { streak: 30 },
    rewards: { stardust: 20 }
  },
  
  // Logros de Características
  horoscope_enthusiast: {
    id: 'horoscope_enthusiast',
    nameKey: 'Achievement.horoscopeEnthusiast.name',
    descriptionKey: 'Achievement.horoscopeEnthusiast.description',
    icon: '♈',
    type: 'special',
    requirements: { feature: 'read_daily_horoscope', count: 30 },
    rewards: { stardust: 8 }
  },
  
  tarot_seeker: {
    id: 'tarot_seeker',
    nameKey: 'Achievement.tarotSeeker.name',
    descriptionKey: 'Achievement.tarotSeeker.description',
    icon: '🎴',
    type: 'special',
    requirements: { feature: 'draw_tarot_card', count: 20 },
    rewards: { stardust: 6 }
  },
  
  compatibility_explorer: {
    id: 'compatibility_explorer',
    nameKey: 'Achievement.compatibilityExplorer.name',
    descriptionKey: 'Achievement.compatibilityExplorer.description',
    icon: '💕',
    type: 'special',
    requirements: { feature: 'check_compatibility', count: 15 },
    rewards: { stardust: 5 }
  },
  
  // Logros de Polvo Estelar
  stardust_collector: {
    id: 'stardust_collector',
    nameKey: 'Achievement.stardustCollector.name',
    descriptionKey: 'Achievement.stardustCollector.description',
    icon: '✨',
    type: 'progress',
    requirements: { stardust: 50 },
    rewards: { points: 100 }
  },
  
  cosmic_hoarder: {
    id: 'cosmic_hoarder',
    nameKey: 'Achievement.cosmicHoarder.name',
    descriptionKey: 'Achievement.cosmicHoarder.description',
    icon: '💎',
    type: 'progress',
    requirements: { stardust: 200 },
    rewards: { points: 300 }
  }
};

export class AchievementChecker {
  /**
   * Verifica si un usuario cumple los requisitos para un logro específico
   */
  static checkAchievement(
    achievementId: string, 
    userProgress: any, 
    currentAchievements: string[] = []
  ): boolean {
    // Si ya tiene el logro, no verificar
    if (currentAchievements.includes(achievementId)) {
      return false;
    }
    
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return false;
    
    const requirements = achievement.requirements;
    
    // Verificar requisitos de puntos
    if (requirements.points && (userProgress.points || 0) < requirements.points) {
      return false;
    }
    
    // Verificar requisitos de nivel
    if (requirements.level && (userProgress.level || 0) < requirements.level) {
      return false;
    }
    
    // Verificar requisitos de polvo estelar
    if (requirements.stardust && (userProgress.stardust || 0) < requirements.stardust) {
      return false;
    }
    
    // Verificar requisitos de racha
    if (requirements.streak && 
        (!userProgress.streakData || userProgress.streakData.currentLoginStreak < requirements.streak)) {
      return false;
    }
    
    // Verificar requisitos de uso de características
    if (requirements.feature && requirements.count) {
      const featureUsage = userProgress.totalFeatureUsage || {};
      const usageCount = featureUsage[requirements.feature] || 0;
      if (usageCount < requirements.count) {
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Verifica todos los logros para un usuario y devuelve los que puede desbloquear
   */
  static checkAllAchievements(
    userProgress: any, 
    currentAchievements: string[] = []
  ): string[] {
    const unlockedAchievements: string[] = [];
    
    Object.keys(ACHIEVEMENTS).forEach(achievementId => {
      if (this.checkAchievement(achievementId, userProgress, currentAchievements)) {
        unlockedAchievements.push(achievementId);
      }
    });
    
    return unlockedAchievements;
  }
  
  /**
   * Obtiene las recompensas por desbloquear un logro
   */
  static getAchievementRewards(achievementId: string): { stardust?: number; points?: number } {
    const achievement = ACHIEVEMENTS[achievementId];
    return achievement ? achievement.rewards : {};
  }
  
  /**
   * Obtiene información de progreso hacia un logro específico
   */
  static getAchievementProgress(
    achievementId: string, 
    userProgress: any
  ): { current: number; required: number; percentage: number } | null {
    const achievement = ACHIEVEMENTS[achievementId];
    if (!achievement) return null;
    
    const requirements = achievement.requirements;
    
    // Progreso de puntos
    if (requirements.points) {
      const current = userProgress.points || 0;
      return {
        current,
        required: requirements.points,
        percentage: Math.min(100, (current / requirements.points) * 100)
      };
    }
    
    // Progreso de nivel
    if (requirements.level) {
      const current = userProgress.level || 0;
      return {
        current,
        required: requirements.level,
        percentage: Math.min(100, (current / requirements.level) * 100)
      };
    }
    
    // Progreso de racha
    if (requirements.streak) {
      const current = userProgress.streakData?.currentLoginStreak || 0;
      return {
        current,
        required: requirements.streak,
        percentage: Math.min(100, (current / requirements.streak) * 100)
      };
    }
    
    // Progreso de uso de características
    if (requirements.feature && requirements.count) {
      const featureUsage = userProgress.totalFeatureUsage || {};
      const current = featureUsage[requirements.feature] || 0;
      return {
        current,
        required: requirements.count,
        percentage: Math.min(100, (current / requirements.count) * 100)
      };
    }
    
    return null;
  }
}
