
"use client";

import { useSyncExternalStore, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { CosmicEnergyState, GameActionId } from '@/types';

// --- Configuration ---
const BASE_XP_PER_LEVEL = 100;
const LEVEL_MULTIPLIER = 1.5;

// Reward structure: key is the level reached, value is the reward
const LEVEL_REWARDS: Record<number, { freeChats?: number; title?: string }> = {
    5: { freeChats: 1 },
    10: { freeChats: 1 },
    15: { title: 'Supernova' },
};


const calculateLevel = (points: number): number => {
    if (points < BASE_XP_PER_LEVEL) return 1;
    return Math.floor(1 + Math.log(points / BASE_XP_PER_LEVEL + 1) / Math.log(LEVEL_MULTIPLIER));
};

const getPointsForNextLevel = (level: number): number => {
    if (level <= 0) return BASE_XP_PER_LEVEL;
    return Math.ceil(Math.pow(LEVEL_MULTIPLIER, level - 1) * BASE_XP_PER_LEVEL);
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
    lastGained: {},
});

const createStore = (userId: string) => {
    const listeners = new Set<() => void>();
    
    const localStorageKey = `cosmicEnergy_${userId}`;
    let currentState: CosmicEnergyState = getInitialState();

    try {
        const storedState = localStorage.getItem(localStorageKey);
        if (storedState) {
            const parsedState = JSON.parse(storedState);
            // Ensure freeChats exists to avoid issues with older state formats
            if (typeof parsedState.freeChats !== 'number') {
                parsedState.freeChats = 0;
            }
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
    rewards: { freeChats: number };
}

// Custom hook to interact with the store
export const useCosmicEnergy = () => {
    const { user } = useAuth();
    
    if (user?.uid && (!store || !localStorage.getItem(`cosmicEnergy_${user.uid}`))) {
        store = createStore(user.uid);
    } else if (!user?.uid && store) {
        store = null;
    }
    
    const state = useSyncExternalStore(
        store?.subscribe ?? (() => () => {}),
        store?.getState ?? getInitialState
    );

    const addEnergyPoints = useCallback((actionId: GameActionId, pointsToAdd: number): AddEnergyPointsResult => {
        const result: AddEnergyPointsResult = { pointsAdded: 0, leveledUp: false, newLevel: state.level, rewards: { freeChats: 0 } };
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
        
        const newPoints = currentState.points + pointsToAdd;
        const newLevel = calculateLevel(newPoints);
        const newLastGained = { ...currentState.lastGained, [actionId]: today };

        const leveledUp = newLevel > currentState.level;
        let newFreeChats = currentState.freeChats || 0;

        if (leveledUp) {
            for (let level = currentState.level + 1; level <= newLevel; level++) {
                if (LEVEL_REWARDS[level]) {
                    newFreeChats += LEVEL_REWARDS[level].freeChats || 0;
                    result.rewards.freeChats += LEVEL_REWARDS[level].freeChats || 0;
                }
            }
        }

        store.setState({
            points: newPoints,
            level: newLevel,
            freeChats: newFreeChats,
            lastGained: newLastGained,
        });

        result.pointsAdded = pointsToAdd;
        result.leveledUp = leveledUp;
        result.newLevel = newLevel;
        return result;

    }, [user, state.level]);

    const addDebugPoints = useCallback((pointsToAdd: number): AddEnergyPointsResult => {
        const result: AddEnergyPointsResult = { pointsAdded: 0, leveledUp: false, newLevel: state.level, rewards: { freeChats: 0 } };
        if (!user?.uid || !store) return result;
        
        const currentState = store.getState();
        
        const newPoints = currentState.points + pointsToAdd;
        const newLevel = calculateLevel(newPoints);
        
        const leveledUp = newLevel > currentState.level;
        let newFreeChats = currentState.freeChats || 0;

        if (leveledUp) {
            for (let level = currentState.level + 1; level <= newLevel; level++) {
                if (LEVEL_REWARDS[level]) {
                    newFreeChats += LEVEL_REWARDS[level].freeChats || 0;
                    result.rewards.freeChats += LEVEL_REWARDS[level].freeChats || 0;
                }
            }
        }

        store.setState({
            points: newPoints,
            level: newLevel,
            freeChats: newFreeChats,
        });

        result.pointsAdded = pointsToAdd;
        result.leveledUp = leveledUp;
        result.newLevel = newLevel;
        return result;
    }, [user, state.level]);

    const useFreeChat = useCallback(() => {
        if (!user?.uid || !store) return;
        const currentState = store.getState();
        if (currentState.freeChats > 0) {
            store.setState({ freeChats: currentState.freeChats - 1 });
        }
    }, [user]);
    
    const pointsForNextLevel = getPointsForNextLevel(state.level + 1);
    const pointsForCurrentLevel = getPointsForNextLevel(state.level);
    const progress = state.level === 1 && state.points < BASE_XP_PER_LEVEL
        ? (state.points / BASE_XP_PER_LEVEL) * 100
        : Math.max(0, Math.min(100, ((state.points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100));


    return {
        ...state,
        pointsForNextLevel,
        progress,
        addEnergyPoints,
        useFreeChat,
        addDebugPoints,
    };
};
