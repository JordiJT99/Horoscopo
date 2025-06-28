
"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { CosmicEnergyState } from '@/types';
import { useToast } from './use-toast';
import type { Dictionary } from '@/lib/dictionaries';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/types';

// --- Configuration ---
const BASE_XP_PER_LEVEL = 100;
const LEVEL_MULTIPLIER = 1.5;

const calculateLevel = (points: number): number => {
    if (points < BASE_XP_PER_LEVEL) return 1;
    // A simple logarithmic formula for smoother level progression
    return Math.floor(1 + Math.log(points / BASE_XP_PER_LEVEL + 1) / Math.log(LEVEL_MULTIPLIER));
};

const getPointsForNextLevel = (level: number): number => {
    if (level <= 0) return BASE_XP_PER_LEVEL;
    // Reverse the logarithmic formula to find points needed for the *start* of the next level
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

// Custom hook to interact with the store
export const useCosmicEnergy = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [dictionary, setDictionary] = useState<Dictionary | null>(null);
    const [locale, setLocale] = useState<Locale>('es');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const currentLocale = (window.location.pathname.split('/')[1] || 'es') as Locale;
            setLocale(currentLocale);
            getDictionary(currentLocale).then(setDictionary);
        }
    }, []);

    // Initialize or get the store for the current user
    if (user?.uid && !store) {
        store = createStore(user.uid);
    } else if (!user?.uid && store) {
        // Clear store on logout
        store = null;
    }
    
    const state = useSyncExternalStore(
        store?.subscribe ?? (() => () => {}),
        store?.getState ?? getInitialState
    );

    const addEnergyPoints = useCallback((actionId: string, pointsToAdd: number) => {
        if (!user?.uid || !store || !dictionary) return;

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const lastGainedDate = store.getState().lastGained[actionId];

        if (lastGainedDate === today && actionId !== 'complete_profile') {
            // Already gained points for this daily action today
            return;
        }

        const currentState = store.getState();
        const newPoints = currentState.points + pointsToAdd;
        const newLevel = calculateLevel(newPoints);
        const newLastGained = { ...currentState.lastGained, [actionId]: today };

        store.setState({
            points: newPoints,
            level: newLevel,
            lastGained: newLastGained,
        });

        toast({
            title: `✨ ${dictionary['CosmicEnergy.pointsEarnedTitle'] || 'Cosmic Energy Gained!'}`,
            description: `${dictionary['CosmicEnergy.pointsEarnedDescription'] || 'You earned'} +${pointsToAdd} EC!`,
        });

        if (newLevel > currentState.level) {
             setTimeout(() => {
                toast({
                    title: `🎉 ${dictionary['CosmicEnergy.levelUpTitle'] || 'Level Up!'}`,
                    description: `${(dictionary['CosmicEnergy.levelUpDescription'] || 'You have reached Level {level}!').replace('{level}', newLevel.toString())}`,
                });
            }, 500);
        }
    }, [user, dictionary, toast]);
    
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
