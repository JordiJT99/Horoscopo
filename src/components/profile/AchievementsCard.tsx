"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Target, Zap, Crown, Calendar, MapPin, Lock, CheckCircle, MessageCircle, Sparkles, Palette } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserProgressService, type UserProgressData } from '@/lib/user-progress-service';
import { ACHIEVEMENTS, AchievementChecker } from '@/lib/achievements';
import { useCosmicEnergy } from '@/hooks/use-cosmic-energy';
import type { AchievementData } from '@/types';
import { cn } from '@/lib/utils';
import { StardustIcon } from '@/components/shared/StardustIcon';

interface AchievementWithProgress extends AchievementData {
  isUnlocked: boolean;
  progress: number;
  progressDetails?: {
    current: number;
    required: number;
    percentage: number;
  } | null;
}

// Recompensas por niveles consolidadas
const levelRewards = [
  { level: 1, key: 'baseAccess', name: 'Acceso Base', description: 'Acceso completo a la app', icon: Sparkles, stardust: 5, type: 'level' },
  { level: 2, key: 'cometFrame', name: 'Marco Cometa', description: 'Desbloquea marco visual especial', icon: Palette, stardust: 0, type: 'level' },
  { level: 3, key: 'recurringStardust1', name: 'Polvo Estelar Recurrente', description: 'Recibe polvo estelar cada 3 niveles', icon: StardustIcon, stardust: 3, type: 'level' },
  { level: 4, key: 'gaiaNebulaBackground', name: 'Fondo Nebulosa Gaia', description: 'Nuevo fondo cósmico desbloqueado', icon: Palette, stardust: 0, type: 'level' },
  { level: 5, key: 'freePsychicChat', name: 'Chat Psíquico Gratis', description: 'Acceso gratuito a chat psíquico', icon: MessageCircle, stardust: 0, type: 'level' },
  { level: 6, key: 'recurringStardust2', name: 'Polvo Estelar Recurrente', description: 'Más polvo estelar por nivel', icon: StardustIcon, stardust: 3, type: 'level' },
  { level: 7, key: 'stardustBonus', name: 'Bonus de Polvo Estelar', description: 'Bonus adicional de polvo estelar', icon: StardustIcon, stardust: 5, type: 'level' },
  { level: 8, key: 'ringOfLightFrame', name: 'Marco Anillo de Luz', description: 'Marco premium desbloqueado', icon: Palette, stardust: 0, type: 'level' },
  { level: 9, key: 'recurringStardust3', name: 'Polvo Estelar Recurrente', description: 'Polvo estelar de alto nivel', icon: StardustIcon, stardust: 3, type: 'level' },
  { level: 10, key: 'enlightenedTitle', name: 'Título Iluminado', description: 'Título especial de maestro', icon: Crown, stardust: 0, type: 'level' },
];

export default function AchievementsCard() {
  const { user } = useAuth();
  const { level: currentLevel } = useCosmicEnergy();
  const [userProgress, setUserProgress] = useState<UserProgressData | null>(null);
  const [achievementsWithProgress, setAchievementsWithProgress] = useState<AchievementWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const progress = await UserProgressService.getUserProgress(user.uid);
        setUserProgress(progress);

        if (!progress) {
          setLoading(false);
          return;
        }

        // Convertir logros a formato con progreso
        const achievementsArray = Object.entries(ACHIEVEMENTS).map(([id, achievement]) => {
          const isUnlocked = progress.achievements?.includes(id) || false;
          const progressDetails = AchievementChecker.getAchievementProgress(id, progress);
          
          return {
            ...achievement,
            isUnlocked,
            progress: progressDetails?.percentage || 0,
            progressDetails
          };
        });

        // Ordenar: desbloqueados primero, luego por progreso
        achievementsArray.sort((a, b) => {
          if (a.isUnlocked && !b.isUnlocked) return -1;
          if (!a.isUnlocked && b.isUnlocked) return 1;
          if (!a.isUnlocked && !b.isUnlocked) {
            // Si ninguno está desbloqueado, ordenar por progreso (mayor progreso primero)
            return b.progress - a.progress;
          }
          // Si ambos están desbloqueados, mantener orden por ID
          return a.id.localeCompare(b.id);
        });

        setAchievementsWithProgress(achievementsArray);
      } catch (error) {
        console.error('Error loading achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [user?.uid]);

  const getDisplayName = (achievement: AchievementData) => {
    const nameMap: Record<string, string> = {
      'first_steps': 'Primeros Pasos',
      'cosmic_traveler': 'Viajero Cósmico',
      'stellar_navigator': 'Navegante Estelar',
      'novice_mystic': 'Místico Novato',
      'seasoned_oracle': 'Oráculo Experimentado',
      'master_astrologer': 'Astrólogo Maestro',
      'daily_devotee': 'Devoto Diario',
      'cosmic_consistency': 'Constancia Cósmica',
      'horoscope_enthusiast': 'Entusiasta de Horóscopos',
      'tarot_seeker': 'Buscador del Tarot',
      'crystal_gazer': 'Vidente del Cristal',
      'dream_interpreter': 'Intérprete de Sueños',
      'lucky_number_finder': 'Buscador de Números de la Suerte',
      'compatibility_expert': 'Experto en Compatibilidad',
      'mayan_explorer': 'Explorador Maya'
    };
    return nameMap[achievement.id] || achievement.nameKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || achievement.id;
  };

  const getDisplayDescription = (achievement: AchievementData) => {
    const descriptionMap: Record<string, string> = {
      'first_steps': 'Alcanza 50 puntos de energía cósmica',
      'cosmic_traveler': 'Alcanza 500 puntos de energía cósmica',
      'stellar_navigator': 'Alcanza 1500 puntos de energía cósmica',
      'novice_mystic': 'Llega al nivel 3',
      'seasoned_oracle': 'Llega al nivel 5',
      'master_astrologer': 'Llega al nivel 10',
      'daily_devotee': 'Mantén una racha de 7 días',
      'cosmic_consistency': 'Mantén una racha de 30 días',
      'horoscope_enthusiast': 'Lee 30 horóscopos',
      'tarot_seeker': 'Haz 10 lecturas de tarot',
      'crystal_gazer': 'Usa la bola de cristal 5 veces',
      'dream_interpreter': 'Interpreta 5 sueños',
      'lucky_number_finder': 'Genera números de la suerte 10 veces',
      'compatibility_expert': 'Haz 15 consultas de compatibilidad',
      'mayan_explorer': 'Explora el horóscopo maya 5 veces'
    };
    return descriptionMap[achievement.id] || achievement.descriptionKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || "Descripción del logro";
  };

  const getTypeDisplayName = (type: string) => {
    const typeMap: Record<string, string> = {
      'progress': 'Progreso',
      'milestone': 'Hito',
      'special': 'Especial'
    };
    return typeMap[type] || type;
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'progress': return <Zap className="w-5 h-5" />;
      case 'milestone': return <Star className="w-5 h-5" />;
      case 'special': return <Crown className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'progress': return 'text-purple-500 bg-purple-100 border-purple-300';
      case 'milestone': return 'text-yellow-500 bg-yellow-100 border-yellow-300';
      case 'special': return 'text-blue-500 bg-blue-100 border-blue-300';
      default: return 'text-gray-500 bg-gray-100 border-gray-300';
    }
  };

  const unlockedCount = achievementsWithProgress.filter(a => a.isUnlocked).length;
  const totalCount = achievementsWithProgress.length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Logros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Logros y Recompensas
          </div>
          <Badge variant="outline" className="text-sm">
            {unlockedCount}/{totalCount}
          </Badge>
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progreso general</span>
            <span>{Math.round((unlockedCount / totalCount) * 100)}%</span>
          </div>
          <Progress value={(unlockedCount / totalCount) * 100} className="h-2" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Logros
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Recompensas por Nivel
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="achievements" className="mt-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {achievementsWithProgress.map((achievement) => (
                <div
                  key={achievement.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    achievement.isUnlocked 
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" 
                      : "bg-gray-50 border-gray-200"
                  )}
                >
                  {/* Icono del logro */}
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center text-2xl",
                    achievement.isUnlocked 
                      ? "bg-green-100" 
                      : "bg-gray-100"
                  )}>
                    {achievement.isUnlocked ? (
                      <span>{achievement.icon}</span>
                    ) : (
                      <div className="relative">
                        <span className="opacity-30">{achievement.icon}</span>
                        <Lock className="w-4 h-4 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    )}
                  </div>

                  {/* Información del logro */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn(
                        "font-medium text-sm",
                        achievement.isUnlocked ? "text-gray-900" : "text-gray-500"
                      )}>
                        {getDisplayName(achievement)}
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn("text-xs", getTypeColor(achievement.type))}
                      >
                        {getTypeDisplayName(achievement.type)}
                      </Badge>
                    </div>
                    
                    <p className={cn(
                      "text-xs mb-2",
                      achievement.isUnlocked ? "text-gray-600" : "text-gray-400"
                    )}>
                      {getDisplayDescription(achievement)}
                    </p>

                    {/* Progreso hacia el logro */}
                    {!achievement.isUnlocked && achievement.progressDetails && achievement.progress < 100 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Progreso: {achievement.progressDetails.current}/{achievement.progressDetails.required}</span>
                          <span>{Math.round(achievement.progress)}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-1.5" />
                      </div>
                    )}

                    {/* Estado desbloqueado */}
                    {achievement.isUnlocked && (
                      <div className="text-xs text-green-600 font-medium">
                        ✓ Logro desbloqueado
                      </div>
                    )}

                    {/* Recompensas */}
                    {achievement.rewards && (
                      <div className="flex gap-2 mt-2">
                        {achievement.rewards.points && (
                          <Badge variant="secondary" className="text-xs">
                            +{achievement.rewards.points} ⚡
                          </Badge>
                        )}
                        {achievement.rewards.stardust && (
                          <Badge variant="secondary" className="text-xs">
                            +{achievement.rewards.stardust} ✨
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rewards" className="mt-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {levelRewards.map((reward) => {
                const isUnlocked = currentLevel >= reward.level;
                const IconComponent = reward.icon;
                
                return (
                  <div
                    key={`${reward.level}-${reward.key}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-all",
                      isUnlocked 
                        ? "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200" 
                        : "bg-gray-50 border-gray-200"
                    )}
                  >
                    {/* Icono de la recompensa */}
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      isUnlocked 
                        ? "bg-blue-100 text-blue-600" 
                        : "bg-gray-100 text-gray-400"
                    )}>
                      {isUnlocked ? (
                        <IconComponent className="w-6 h-6" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </div>

                    {/* Información de la recompensa */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={cn(
                          "font-medium text-sm",
                          isUnlocked ? "text-gray-900" : "text-gray-500"
                        )}>
                          {reward.name}
                        </h4>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", isUnlocked ? "bg-blue-100 text-blue-600 border-blue-300" : "bg-gray-100 text-gray-500 border-gray-300")}
                        >
                          Nivel {reward.level}
                        </Badge>
                      </div>
                      
                      <p className={cn(
                        "text-xs mb-2",
                        isUnlocked ? "text-gray-600" : "text-gray-400"
                      )}>
                        {reward.description}
                      </p>

                      {/* Estado */}
                      {isUnlocked ? (
                        <div className="text-xs text-blue-600 font-medium">
                          ✓ Recompensa desbloqueada
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">
                          🔒 Requiere nivel {reward.level} (actual: {currentLevel})
                        </div>
                      )}

                      {/* Recompensa de polvo estelar */}
                      {reward.stardust > 0 && (
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            +{reward.stardust} ✨
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Estadísticas adicionales */}
        {userProgress && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {userProgress.points || 0}
                </div>
                <div className="text-xs text-gray-500">Energía Cósmica</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {userProgress.stardust || 0}
                </div>
                <div className="text-xs text-gray-500">Polvo Estelar</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {currentLevel}
                </div>
                <div className="text-xs text-gray-500">Nivel Actual</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
