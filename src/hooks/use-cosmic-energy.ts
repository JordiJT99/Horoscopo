

"use client";

import { useSyncExternalStore, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { CosmicEnergyState, GameActionId, AwardStardustResult } from '@/types';
import { doc, getDoc, setDoc, updateDoc, writeBatch, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// --- Configuration ---
export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  250,   // Level 2
  700,   // Level 3
  1400,  // Level 4
  2300,  // Level 5
  3500,  // Level 6
  5000,  // Level 7
  7000,  // Level 8
  10000, // Level 9
  14000, // Level 10
  Infinity 
];

const calculateLevel = (points: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 2; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

const getLevelUpStardustReward = (newLevel: number): number => {
    if (newLevel === 1) return 5; 
    if (newLevel > 1 && (newLevel - 1) % 3 === 0) { // Levels 4, 7, 10...
      return 5;
    }
    if (newLevel > 1 && newLevel % 3 === 0) { // Levels 3, 6, 9...
      return 3;
    }
    return 0;
};

let store: {
    state: CosmicEnergyState;
    listeners: Set<() => void>;
    setState: (newState: Partial<CosmicEnergyState>) => Promise<void>;
    getState: () => CosmicEnergyState;
    subscribe: (listener: () => void) => () => void;
    loadInitialState: (userId: string) => Promise<void>;
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

const createStore = () => {
    const listeners = new Set<() => void>();
    
    let currentState: CosmicEnergyState = { ...initialState };
    let currentUserId: string | null = null;

    const getState = () => currentState;

    const setState = async (newState: Partial<CosmicEnergyState>) => {
        const oldState = { ...currentState };
        currentState = { ...currentState, ...newState };

        if (currentUserId) {
            const userProfileRef = doc(db, 'userProfiles', currentUserId);
            try {
                // Use updateDoc for partial updates to avoid overwriting fields
                await setDoc(userProfileRef, newState, { merge: true });
            } catch (error) {
                console.error("Failed to update user profile in Firestore:", error);
                // Revert state on error
                currentState = oldState;
            }
        }
        listeners.forEach(listener => listener());
    };

    const loadInitialState = async (userId: string) => {
      if (userId === currentUserId && currentState.points > 0) return; // Already loaded for this user

      currentUserId = userId;
      const userProfileRef = doc(db, 'userProfiles', userId);
      try {
        const docSnap = await getDoc(userProfileRef);
        if (docSnap.exists()) {
          const loadedData = docSnap.data() as Partial<CosmicEnergyState>;
          // Merge with initial state to ensure all fields are present
          currentState = { ...initialState, ...loadedData };
        } else {
          // If profile doesn't exist, create it with initial values
          currentState = { ...initialState };
          await setDoc(userProfileRef, currentState);
        }
      } catch (error) {
        console.error("Failed to load user profile from Firestore:", error);
        currentState = { ...initialState };
      }
      listeners.forEach(listener => listener());
    };
    
    const subscribe = (listener: () => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    };

    return { state: currentState, listeners, setState, getState, subscribe, loadInitialState };
};

// Initialize the store singleton
if (!store) {
  store = createStore();
}

export interface AddEnergyPointsResult {
    pointsAdded: number;
    leveledUp: boolean;
    newLevel: number;
    rewards: { freeChats: number; stardust: number; };
}

export const useCosmicEnergy = () => {
    const { user, isLoading: authIsLoading } = useAuth();
    
    useEffect(() => {
        if (user?.uid && store) {
            store.loadInitialState(user.uid);
        }
    }, [user, authIsLoading]);
    
    const state = useSyncExternalStore(
        store?.subscribe ?? (() => () => {}),
        store?.getState ?? getInitialState,
        store?.getState ?? getInitialState
    );
    
    const addEnergyPoints = useCallback(async (actionId: GameActionId, pointsToAdd: number): Promise<AddEnergyPointsResult> => {
        const result: AddEnergyPointsResult = { pointsAdded: 0, leveledUp: false, newLevel: state.level, rewards: { freeChats: 0, stardust: 0 } };
        if (!user?.uid || !store) return result;
        
        const currentState = store.getState();
        const lastGainedDate = currentState.lastGained[actionId];
        
        if (actionId === 'complete_profile' && lastGainedDate) {
            return result;
        }
        
        const today = new Date().toISOString().split('T')[0];
        if (lastGainedDate === today && actionId !== 'complete_profile') {
            return result;
        }
        
        const newPoints = currentState.points + pointsToAdd;
        const newLevel = calculateLevel(newPoints);
        const newLastGained = { ...currentState.lastGained, [actionId]: today };

        const leveledUp = newLevel > currentState.level;
        let newStardust = currentState.stardust || 0;
        let newFreeChats = currentState.freeChats || 0;

        if (leveledUp) {
            for (let level = currentState.level + 1; level <= newLevel; level++) {
                const stardustReward = getLevelUpStardustReward(level);
                if (stardustReward > 0) {
                    newStardust += stardustReward;
                    result.rewards.stardust += stardustReward;
                }
            }
        }
        
        if (actionId === 'complete_profile' && !lastGainedDate) {
            const welcomeStardust = 5;
            newStardust += welcomeStardust;
            result.rewards.stardust += welcomeStardust;
        }
        
        const finalLevel = calculateLevel(newPoints);

        await store.setState({
            points: newPoints,
            level: finalLevel,
            freeChats: newFreeChats,
            stardust: newStardust,
            lastGained: newLastGained,
        });

        result.pointsAdded = pointsToAdd;
        result.leveledUp = finalLevel > currentState.level;
        result.newLevel = finalLevel;
        return result;

    }, [user, state.level, state.freeChats, state.stardust, state.lastGained]);

    const spendStardust = useCallback(async (amount: number, actionId?: GameActionId): Promise<boolean> => {
        if (!user?.uid || !store) return false;
        const currentState = store.getState();
        if (currentState.stardust >= amount) {
            const newState: Partial<CosmicEnergyState> = { stardust: currentState.stardust - amount };
            if (actionId) {
                const today = new Date().toISOString().split('T')[0];
                newState.lastGained = { ...currentState.lastGained, [actionId]: today };
            }
            await store.setState(newState);
            return true;
        }
        return false;
    }, [user]);

    const addStardust = useCallback(async (amount: number) => {
        if (!user?.uid || !store) return;
        const currentState = store.getState();
        await store.setState({ stardust: currentState.stardust + amount });
    }, [user]);

    const awardStardustForAction = useCallback(async (actionId: GameActionId, amount: number): Promise<AwardStardustResult> => {
        const result: AwardStardustResult = { success: false, amount: 0 };
        if (!user?.uid || !store) return result;

        const currentState = store.getState();
        const lastGainedDate = currentState.lastGained[actionId];
        const today = new Date().toISOString().split('T')[0];

        if (lastGainedDate === today) {
            return result; // Already awarded today
        }

        const newStardust = (currentState.stardust || 0) + amount;
        const newLastGained = { ...currentState.lastGained, [actionId]: today };

        await store.setState({
            stardust: newStardust,
            lastGained: newLastGained,
        });

        result.success = true;
        result.amount = amount;
        return result;

    }, [user]);
    
    // Debug tools remain local and don't need async/await
    const addDebugPoints = useCallback((pointsToAdd: number): AddEnergyPointsResult => {
         const result: AddEnergyPointsResult = { pointsAdded: 0, leveledUp: false, newLevel: 1, rewards: { freeChats: 0, stardust: 0 } };
        if (!user?.uid || !store) return result;
        const currentState = store.getState();
        const newPoints = currentState.points + pointsToAdd;
        const newLevel = calculateLevel(newPoints);
        let newStardust = currentState.stardust;
         if (newLevel > currentState.level) {
            for (let level = currentState.level + 1; level <= newLevel; level++) {
                const stardustReward = getLevelUpStardustReward(level);
                if (stardustReward > 0) {
                    newStardust += stardustReward;
                    result.rewards.stardust += stardustReward;
                }
            }
        }
        store.setState({ points: newPoints, level: newLevel, stardust: newStardust });
        result.leveledUp = newLevel > currentState.level;
        result.newLevel = newLevel;
        result.pointsAdded = pointsToAdd;
        return result;
    }, [user]);

    const subtractDebugPoints = useCallback((pointsToSubtract: number) => {
        if (!user?.uid || !store) return;
        const currentState = store.getState();
        const newPoints = Math.max(0, currentState.points - pointsToSubtract);
        store.setState({ points: newPoints, level: calculateLevel(newPoints) });
    }, [user]);

    const subtractStardust = useCallback((amount: number) => {
        if (!user?.uid || !store) return;
        const currentState = store.getState();
        store.setState({ stardust: Math.max(0, currentState.stardust - amount) });
    }, [user]);


    const claimRateReward = useCallback(async () => {
        if (!user?.uid || !store) return { success: false, amount: 0 };
        const currentState = store.getState();
        if (currentState.hasRatedApp) {
            return { success: false, amount: 0 };
        }
        const rewardAmount = 4;
        await store.setState({ 
            stardust: currentState.stardust + rewardAmount,
            hasRatedApp: true 
        });
        return { success: true, amount: rewardAmount };
    }, [user]);

    const checkAndAwardDailyStardust = useCallback(async (): Promise<boolean> => {
        if (!user?.uid || !store) return false;
        
        const currentState = store.getState();
        const lastDailyAward = currentState.lastGained['daily_stardust'] || '';
        const today = new Date().toISOString().split('T')[0];
        
        if (lastDailyAward === today) {
            return false;
        }
        
        const dailyAmount = 1;
        
        await store.setState({
            stardust: currentState.stardust + dailyAmount,
            lastGained: { ...currentState.lastGained, 'daily_stardust': today },
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
        useFreeChat: () => {}, // Deprecated, can be removed
        addDebugPoints,
        subtractDebugPoints,
        spendStardust,
        addStardust,
        subtractStardust,
        claimRateReward,
        checkAndAwardDailyStardust,
        awardStardustForAction,
        isLoading: authIsLoading,
    };
};
