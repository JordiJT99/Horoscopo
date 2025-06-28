
"use client";

import { useSyncExternalStore, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { CosmicEnergyState, GameActionId } from '@/types';

// --- Configuration ---
// XP needed to reach the start of each level. Index corresponds to level - 1.
export const LEVEL_THRESHOLDS = [
  0,     // Level 1: Asteroide
  250,   // Level 2: Cometa
  700,   // Level 3: Luna
  1400,  // Level 4: Planeta
  2300,  // Level 5: Estrella
  3500,  // Level 6: Constelación
  5000,  // Level 7: Galaxia
  7000,  // Level 8: Nebulosa
  10000, // Level 9: Supernova
  14000, // Level 10: Cuásar
  Infinity // Cap at level 10
];


const calculateLevel = (points: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 2; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Reward structure: key is the level reached, value is the reward
const LEVEL_REWARDS: Record<number, { freeChats?: number; stardust?: number }> = {
    4: { stardust: 100 },
    5: { freeChats: 1 },
    10: { stardust: 500 },
};

// This store will hold the state and notify listeners of changes.
let store: {
    state: CosmicEnergyState;
    listeners: Set<() => void>;
    setState: (newState: Partial<CosmicEnergyState>) => void;
    getState: () => CosmicEnergyState;
    subscribe: (listener: () => void) => () => void;
} | null = null;


const getInitialState = (): CosmicEnergyState => ({
    points: 0,
    level: 1,
    freeChats: 0,
    lastGained: {} as Record<GameActionId, string>,
});

const createStore = (userId: string) => {
    const listeners = new Set<() => void>();
    
    const localStorageKey = `cosmicEnergy_v2_${userId}`;
    let currentState: CosmicEnergyState = getInitialState();

    try {
        const storedState = localStorage.getItem(localStorageKey);
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            // Ensure all fields exist to avoid issues with older state formats
            currentState = { ...getInitialState(), ...parsedState };
        }
    } catch (error) {
        console.error("Failed to parse cosmic energy state from localStorage", error);
    }

    const getState = () => currentState;

    const setState = (newState: Partial<CosmicEnergyState>) => {
        currentState = { ...currentState, ...newState };
        try {
            localStorage.setItem(localStorageKey, JSON.stringify(currentState));
        } catch (error) {
            console.error("Failed to save cosmic energy state to localStorage", error);
        }
        listeners.forEach(listener => listener());
    };
    
    const subscribe = (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return { state: currentState, listeners, setState, getState, subscribe };
}

export interface AddEnergyPointsResult {
    pointsAdded: number;
    leveledUp: boolean;
    newLevel: number;
    rewards: { freeChats: number; stardust: number; };
}

// Custom hook to interact with the store
export const useCosmicEnergy = () => {
    const { user } = useAuth();
    
    if (user?.uid && (!store || !localStorage.getItem(`cosmicEnergy_v2_${user.uid}`))) {
        store = createStore(user.uid);
    } else if (!user?.uid && store) {
        store = null;
    }
    
    const state = useSyncExternalStore(
        store?.subscribe ?? (() => () => {}),
        store?.getState ?? getInitialState
    );

    const addEnergyPoints = useCallback((actionId: GameActionId, pointsToAdd: number): AddEnergyPointsResult => {
        const result: AddEnergyPointsResult = { pointsAdded: 0, leveledUp: false, newLevel: state.level, rewards: { freeChats: 0, stardust: 0 } };
        if (!user?.uid || !store) return result;
        
        const currentState = store.getState();
        const lastGainedDate = currentState.lastGained[actionId];
        
        if (actionId === 'complete_profile' && lastGainedDate) {
            return result; // Already awarded for completing profile once
        }
        
        const today = new Date().toISOString().split('T')[0];
        if (lastGainedDate === today && actionId !== 'complete_profile') {
            return result; // Daily action already performed today
        }
        
        const stardustMultiplier = currentState.level >= 7 ? 1.1 : 1.0;
        const finalPointsToAdd = actionId === 'complete_profile' ? pointsToAdd : Math.ceil(pointsToAdd * stardustMultiplier);

        const newPoints = currentState.points + finalPointsToAdd;
        const newLevel = calculateLevel(newPoints);
        const newLastGained = { ...currentState.lastGained, [actionId]: today };

        const leveledUp = newLevel > currentState.level;
        let newFreeChats = currentState.freeChats || 0;
        let newTotalPoints = newPoints;


        if (leveledUp) {
            for (let level = currentState.level + 1; level <= newLevel; level++) {
                if (LEVEL_REWARDS[level]) {
                    newFreeChats += LEVEL_REWARDS[level].freeChats || 0;
                    newTotalPoints += LEVEL_REWARDS[level].stardust || 0;
                    result.rewards.freeChats += LEVEL_REWARDS[level].freeChats || 0;
                    result.rewards.stardust += LEVEL_REWARDS[level].stardust || 0;
                }
            }
        }
        
        // Recalculate level in case stardust bonus caused another level up
        const finalLevel = calculateLevel(newTotalPoints);

        store.setState({
            points: newTotalPoints,
            level: finalLevel,
            freeChats: newFreeChats,
            lastGained: newLastGained,
        });

        result.pointsAdded = finalPointsToAdd;
        result.leveledUp = finalLevel > currentState.level;
        result.newLevel = finalLevel;
        return result;

    }, [user, state.level]); // Simplified dependencies

    const addDebugPoints = useCallback((pointsToAdd: number): AddEnergyPointsResult => {
        const result: AddEnergyPointsResult = { pointsAdded: 0, leveledUp: false, newLevel: 1, rewards: { freeChats: 0, stardust: 0 } };
        if (!user?.uid || !store) return result;
        
        const currentState = store.getState();
        const newPoints = currentState.points + pointsToAdd;
        const newLevel = calculateLevel(newPoints);
        
        const leveledUp = newLevel > currentState.level;
        let newFreeChats = currentState.freeChats || 0;
        let newTotalPoints = newPoints;

        if (leveledUp) {
            for (let level = currentState.level + 1; level <= newLevel; level++) {
                if (LEVEL_REWARDS[level]) {
                    newFreeChats += LEVEL_REWARDS[level].freeChats || 0;
                    newTotalPoints += LEVEL_REWARDS[level].stardust || 0;
                    result.rewards.freeChats += LEVEL_REWARDS[level].freeChats || 0;
                    result.rewards.stardust += LEVEL_REWARDS[level].stardust || 0;
                }
            }
        }
        
        const finalLevel = calculateLevel(newTotalPoints);

        store.setState({
            points: newTotalPoints,
            level: finalLevel,
            freeChats: newFreeChats,
        });

        result.pointsAdded = pointsToAdd;
        result.leveledUp = finalLevel > currentState.level;
        result.newLevel = finalLevel;
        return result;
    }, [user]); // Simplified dependencies
    
    const subtractDebugPoints = useCallback((pointsToSubtract: number) => {
        if (!user?.uid || !store) return;
        
        const currentState = store.getState();
        const newPoints = Math.max(0, currentState.points - pointsToSubtract);
        const newLevel = calculateLevel(newPoints);
        
        let newFreeChats = currentState.freeChats || 0;
        if (newLevel < currentState.level) {
            for (let level = currentState.level; level > newLevel; level--) {
                if (LEVEL_REWARDS[level]?.freeChats) {
                    newFreeChats = Math.max(0, newFreeChats - (LEVEL_REWARDS[level].freeChats || 0));
                }
            }
        }
        
        store.setState({
            points: newPoints,
            level: newLevel,
            freeChats: newFreeChats,
        });

    }, [user]); // Simplified dependencies

    const useFreeChat = useCallback(() => {
        if (!user?.uid || !store) return;
        const currentState = store.getState();
        if (currentState.freeChats > 0) {
            store.setState({ freeChats: currentState.freeChats - 1 });
        }
    }, [user]); // Simplified dependencies
    
    const pointsForCurrentLevel = LEVEL_THRESHOLDS[state.level - 1] ?? 0;
    const pointsForNextLevel = LEVEL_THRESHOLDS[state.level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length-1];
    const progress = pointsForNextLevel === pointsForCurrentLevel ? 100 : Math.max(0, Math.min(100, ((state.points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100));


    return {
        ...state,
        pointsForNextLevel: pointsForNextLevel,
        progress,
        addEnergyPoints,
        useFreeChat,
        addDebugPoints,
        subtractDebugPoints,
    };
};
