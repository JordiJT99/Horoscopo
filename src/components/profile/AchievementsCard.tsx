"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Zap, Crown, Calendar, MapPin, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserProgressService, type UserProgressData } from '@/lib/user-progress-service';
import { ACHIEVEMENTS, AchievementChecker } from '@/lib/achievements';
import type { AchievementData } from '@/types';
import { cn } from '@/lib/utils';

interface AchievementWithProgress extends AchievementData {
  isUnlocked: boolean;
  progress: number;
  progressDetails?: {
    current: number;
    required: number;
    percentage: number;
  } | null;
}

export default function AchievementsCard() {
  const { user } = useAuth();
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
      case 'progress': return 'text-purple-500';
      case 'milestone': return 'text-yellow-500';
      case 'special': return 'text-blue-500';
      default: return 'text-gray-500';
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
            Logros
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
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>

              {/* Información del logro */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={cn(
                    "font-medium text-sm",
                    achievement.isUnlocked ? "text-gray-900" : "text-gray-500"
                  )}>
                    {achievement.nameKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || achievement.id}
                  </h4>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", getTypeColor(achievement.type))}
                  >
                    {achievement.type}
                  </Badge>
                </div>
                
                <p className={cn(
                  "text-xs mb-2",
                  achievement.isUnlocked ? "text-gray-600" : "text-gray-400"
                )}>
                  {achievement.descriptionKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim() || "Descripción del logro"}
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

        {/* Estadísticas adicionales */}
        {userProgress && (
          <div className="mt-6 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
