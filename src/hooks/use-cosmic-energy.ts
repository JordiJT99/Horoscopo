
"use client";

import { useSyncExternalStore, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { CosmicEnergyState, GameActionId } from '@/types';

// --- Configuration ---
const BASE_XP_PER_LEVEL = 100;
const LEVEL_MULTIPLIER = 1.5;

const calculateLevel = (points: number): number => {
    if (points < BASE_XP_PER_LEVEL) return 1;
    return Math.floor(1 + Math.log(points / BASE_XP_PER_LEVEL + 1) / Math.log(LEVEL_MULTIPLIER));
};

const getPointsForNextLevel = (level: number): number => {
    if (level <= 0) return BASE_XP_PER_LEVEL;
    return Math.ceil((Math.pow(LEVEL_MULTIPLIER, level) - 1) * BASE_XP_PER_LEVEL);
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
    lastGained: {},
});

const createStore = (userId: string) => {
    const listeners = new Set<() => void>();
    
    const localStorageKey = `cosmicEnergy_${userId}`;
    let currentState: CosmicEnergyState = getInitialState();

    try {
        const storedState = localStorage.getItem(localStorageKey);
        if (storedState) {
            currentState = { ...getInitialState(), ...JSON.parse(storedState) };
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
}

// Custom hook to interact with the store
export const useCosmicEnergy = () => {
    const { user } = useAuth();
    
    if (user?.uid && !store) {
        store = createStore(user.uid);
    } else if (!user?.uid && store) {
        store = null;
    }
    
    const state = useSyncExternalStore(
        store?.subscribe ?? (() => () => {}),
        store?.getState ?? getInitialState
    );

    const addEnergyPoints = useCallback((actionId: GameActionId, pointsToAdd: number): AddEnergyPointsResult => {
        const result: AddEnergyPointsResult = { pointsAdded: 0, leveledUp: false, newLevel: state.level };
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

        store.setState({
            points: newPoints,
            level: newLevel,
            lastGained: newLastGained,
        });

        const leveledUp = newLevel > currentState.level;

        return {
            pointsAdded: pointsToAdd,
            leveledUp,
            newLevel
        };
    }, [user, state.level]);
    
    const pointsForNextLevel = getPointsForNextLevel(state.level);
    const pointsForCurrentLevel = getPointsForNextLevel(state.level - 1);
    const progress = Math.max(0, Math.min(100, ((state.points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100));

    return {
        ...state,
        pointsForNextLevel,
        progress,
        addEnergyPoints,
    };
};
