

"use client";

import { useSyncExternalStore, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { CosmicEnergyState, GameActionId, AwardStardustResult } from '@/types';

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
// New: 3 stardust every 3 levels.
const getLevelUpStardustReward = (newLevel: number): number => {
  if (newLevel > 1 && newLevel % 3 === 0) {
    return 3;
  }
  return 0;
};


// This store will hold the state and notify listeners of changes.
let store: {
    state: CosmicEnergyState;
    listeners: Set<() => void>;
    setState: (newState: Partial<CosmicEnergyState>) => void;
    getState: () => CosmicEnergyState;
    subscribe: (listener: () => void) => () => void;
} | null = null;


const initialState: CosmicEnergyState = {
    points: 0,
    level: 1,
    freeChats: 0,
    stardust: 0,
    lastGained: {} as Record<GameActionId, string>,
    hasRatedApp: false,
};

const getInitialState = (): CosmicEnergyState => initialState;

const createStore = (userId: string) => {
    const listeners = new Set<() => void>();
    
    const localStorageKey = `cosmicEnergy_v4_${userId}`;
    let currentState: CosmicEnergyState;

    try {
        const storedState = localStorage.getItem(localStorageKey);
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            // Ensure all fields exist to avoid issues with older state formats by merging with a fresh initial state
            currentState = { ...initialState, ...parsedState };
        } else {
            // If no stored state, create a fresh copy of the initial state
            currentState = { ...initialState };
        }
    } catch (error) {
        console.error("Failed to parse cosmic energy state from localStorage", error);
        // Fallback to a fresh copy on error
        currentState = { ...initialState };
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
    const { user, isLoading: authIsLoading } = useAuth();
    
    // This logic ensures the store is created or cleared based on user state.
    // The dependency on authIsloading prevents premature store creation/clearing.
    if (!authIsLoading && user?.uid && (!store || !localStorage.getItem(`cosmicEnergy_v4_${user.uid}`))) {
        store = createStore(user.uid);
    } else if (!authIsLoading && !user && store) {
        store = null;
    }
    
    const state = useSyncExternalStore(
        store?.subscribe ?? (() => () => {}),
        store?.getState ?? getInitialState,
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
        let newStardust = currentState.stardust || 0;
        let newFreeChats = currentState.freeChats || 0; // Keep free chats for future use maybe


        if (leveledUp) {
            for (let level = currentState.level + 1; level <= newLevel; level++) {
                const stardustReward = getLevelUpStardustReward(level);
                if (stardustReward > 0) {
                    newStardust += stardustReward;
                    result.rewards.stardust += stardustReward;
                }
            }
        }

        // Special one-time welcome stardust
        if (actionId === 'complete_profile' && !lastGainedDate) {
            newStardust += 5;
            result.rewards.stardust += 5;
        }
        
        const finalLevel = calculateLevel(newPoints);

        store.setState({
            points: newPoints,
            level: finalLevel,
            freeChats: newFreeChats,
            stardust: newStardust,
            lastGained: newLastGained,
        });

        result.pointsAdded = finalPointsToAdd;
        result.leveledUp = finalLevel > currentState.level;
        result.newLevel = finalLevel;
        return result;

    }, [user, state.level, state.freeChats, state.stardust, state.lastGained]);
    
    const awardStardustForAction = useCallback((actionId: GameActionId, amount: number): AwardStardustResult => {
        if (!user?.uid || !store) return { success: false, amount: 0 };
        
        const currentState = store.getState();
        const lastGainedDate = currentState.lastGained[actionId];
        const today = new Date().toISOString().split('T')[0];

        if (lastGainedDate === today) {
            return { success: false, amount: 0 }; // Already awarded today
        }
        
        const newStardust = currentState.stardust + amount;
        const newLastGained = { ...currentState.lastGained, [actionId]: today };

        store.setState({
            stardust: newStardust,
            lastGained: newLastGained,
        });

        return { success: true, amount };
    }, [user]);
    
    const addDebugPoints = useCallback((pointsToAdd: number): AddEnergyPointsResult => {
         const result: AddEnergyPointsResult = { pointsAdded: 0, leveledUp: false, newLevel: 1, rewards: { freeChats: 0, stardust: 0 } };
        if (!user?.uid || !store) return result;
        
        const currentState = store.getState();
        const newPoints = currentState.points + pointsToAdd;
        const newLevel = calculateLevel(newPoints);
        
        let newFreeChats = currentState.freeChats || 0;
        let newStardust = currentState.stardust || 0;
        if (newLevel > currentState.level) {
            for (let level = currentState.level + 1; level <= newLevel; level++) {
                const stardustReward = getLevelUpStardustReward(level);
                if (stardustReward > 0) {
                    newStardust += stardustReward;
                    result.rewards.stardust += stardustReward;
                }
            }
        }
        
        const finalLevel = calculateLevel(newPoints);

        store.setState({
            points: newPoints,
            level: finalLevel,
            freeChats: newFreeChats,
            stardust: newStardust,
        });

        result.pointsAdded = pointsToAdd;
        result.leveledUp = finalLevel > currentState.level;
        result.newLevel = finalLevel;
        return result;
    }, [user]);

    const subtractDebugPoints = useCallback((pointsToSubtract: number) => {
        if (!user?.uid || !store) return;
        
        const currentState = store.getState();
        const newPoints = Math.max(0, currentState.points - pointsToSubtract);
        const newLevel = calculateLevel(newPoints);
        
        let newStardust = currentState.stardust || 0;
        if (newLevel < currentState.level) {
            // This part is tricky. Reversing rewards isn't straightforward.
            // For a debug tool, simply reducing points and level is usually enough.
            // A full implementation would need to track which rewards were claimed at which level.
        }
        
        store.setState({
            points: newPoints,
            level: newLevel,
            stardust: newStardust,
        });

    }, [user]);

    const useFreeChat = useCallback(() => {
        if (!user?.uid || !store) return false;
        const currentState = store.getState();
        if (currentState.freeChats > 0) {
            store.setState({ freeChats: currentState.freeChats - 1 });
            return true;
        }
        return false;
    }, [user]);

    const spendStardust = useCallback((amount: number, actionId?: GameActionId): boolean => {
        if (!user?.uid || !store) return false;
        const currentState = store.getState();
        if (currentState.stardust >= amount) {
            const newState: Partial<CosmicEnergyState> = { stardust: currentState.stardust - amount };
            if (actionId) {
                const today = new Date().toISOString().split('T')[0];
                newState.lastGained = { ...currentState.lastGained, [actionId]: today };
            }
            store.setState(newState);
            return true;
        }
        return false;
    }, [user]);
    
    const addStardust = useCallback((amount: number) => {
        if (!user?.uid || !store) return;
        const currentState = store.getState();
        store.setState({ stardust: currentState.stardust + amount });
    }, [user]);

    const claimRateReward = useCallback(() => {
        if (!user?.uid || !store) return { success: false, amount: 0 };
        const currentState = store.getState();
        if (currentState.hasRatedApp) {
            return { success: false, amount: 0 };
        }
        const rewardAmount = 4;
        store.setState({ 
            stardust: currentState.stardust + rewardAmount,
            hasRatedApp: true 
        });
        return { success: true, amount: rewardAmount };
    }, [user]);

    const checkAndAwardDailyStardust = useCallback((): boolean => {
        if (!user?.uid || !store) return false;
        
        const currentState = store.getState();
        const lastDailyAward = currentState.lastGained['daily_stardust'] || '';
        const today = new Date().toISOString().split('T')[0];
        
        if (lastDailyAward === today) {
            return false; // Already awarded today
        }
        
        const dailyAmount = 1;
        const newStardust = currentState.stardust + dailyAmount;
        const newLastGained = { ...currentState.lastGained, 'daily_stardust': today };
        
        store.setState({
            stardust: newStardust,
            lastGained: newLastGained,
        });
        
        return true;
    }, [user]);

    const pointsForCurrentLevel = LEVEL_THRESHOLDS[state.level - 1] ?? 0;
    const pointsForNextLevel = LEVEL_THRESHOLDS[state.level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length-1];
    const progress = pointsForNextLevel === pointsForCurrentLevel ? 100 : Math.max(0, Math.min(100, ((state.points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100));


    return {
        ...state,
        pointsForNextLevel: pointsForNextLevel,
        progress,
        addEnergyPoints,
        awardStardustForAction,
        useFreeChat,
        addDebugPoints,
        subtractDebugPoints,
        spendStardust,
        addStardust,
        claimRateReward,
        checkAndAwardDailyStardust,
        isLoading: authIsLoading,
    };
};
