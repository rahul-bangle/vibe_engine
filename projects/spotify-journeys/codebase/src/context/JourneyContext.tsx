import React, { createContext, useContext, useState, useEffect } from 'react';

export type JourneyPath = 'English Vocabulary Builder' | 'Communication Skills' | 'Productivity Habits';

interface JourneyState {
    currentPath: JourneyPath | null;
    step: number;
    isCompleted: boolean;
    streak: number;
    lastCompletedAt: string | null;
    completionHistory: Record<string, boolean>; // ISO date string -> boolean
    recentlyPlayed: string[]; // Track IDs
    activeFilter: string;
    globalTrack: any | null;
    isGlobalPlaying: boolean;
}

interface JourneyContextType {
    state: JourneyState;
    selectCategory: (path: JourneyPath) => void;
    startJourney: () => void;
    resetJourney: () => void;
    nextStep: () => void;
    completeDay: () => void;
    nudgeMessage: string | null;
    triggerNudge: (message: string) => void;
    clearNudge: () => void;
    setActiveFilter: (filter: string) => void;
    goBack: () => void;
    addToRecentlyPlayed: (trackId: string) => void;
    playTrack: (track: any) => void;
    setGlobalPlaying: (playing: boolean) => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<JourneyState>(() => {
        const saved = localStorage.getItem('spotify-journey-state');
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                ...parsed,
                recentlyPlayed: parsed.recentlyPlayed || [],
                activeFilter: parsed.activeFilter || 'All',
                completionHistory: parsed.completionHistory || {}
            };
        }
        return {
            currentPath: null,
            step: 0,
            isCompleted: false,
            streak: 0,
            lastCompletedAt: null,
            completionHistory: {},
            recentlyPlayed: [],
            activeFilter: 'All',
            globalTrack: null,
            isGlobalPlaying: false
        };
    });

    const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);

    useEffect(() => {
        localStorage.setItem('spotify-journey-state', JSON.stringify(state));
    }, [state]);

    const selectCategory = (path: JourneyPath) => {
        setState(prev => ({ ...prev, currentPath: path, step: 1, isCompleted: false }));
    };

    const startJourney = () => {
        setState(prev => ({ ...prev, step: 2 }));
    };

    const resetJourney = () => {
        setState(prev => ({ ...prev, currentPath: null, step: 0, isCompleted: false, activeFilter: 'All' }));
    };

    const addToRecentlyPlayed = (trackId: string) => {
        setState(prev => {
            const list = prev.recentlyPlayed || [];
            const filtered = list.filter(id => id !== trackId);
            return {
                ...prev,
                recentlyPlayed: [trackId, ...filtered].slice(0, 10)
            };
        });
    };

    const setActiveFilter = (filter: string) => {
        setState(prev => ({ ...prev, activeFilter: filter }));
    };

    const goBack = () => {
        setState(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
    };

    const nextStep = () => {
        setState(prev => ({ ...prev, step: prev.step + 1 }));
    };

    const completeDay = () => {
        const today = new Date().toISOString().split('T')[0];
        const lastCompleted = state.lastCompletedAt ? new Date(state.lastCompletedAt).toISOString().split('T')[0] : null;

        let newStreak = state.streak;
        if (lastCompleted) {
            const lastDate = new Date(lastCompleted);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

            if (diffDays === 1) {
                newStreak += 1;
            } else if (diffDays > 1) {
                newStreak = 1;
            } else if (diffDays === 0) {
                // Already completed today, don't increment streak but keep it
            }
        } else {
            newStreak = 1;
        }

        setState(prev => ({
            ...prev,
            isCompleted: true,
            streak: newStreak,
            lastCompletedAt: new Date().toISOString(),
            completionHistory: { ...prev.completionHistory, [today]: true }
        }));
    };

    const triggerNudge = (message: string) => {
        setNudgeMessage(message);
    };

    const clearNudge = () => {
        setNudgeMessage(null);
    };

    const playTrack = (track: any) => {
        setState(prev => ({
            ...prev,
            globalTrack: track,
            isGlobalPlaying: true,
            // If we play a single track, we should likely exit the journey if we are in one
            // but for now let's just allow both and let the UI handle the priority
        }));
    };

    const setGlobalPlaying = (playing: boolean) => {
        setState(prev => ({ ...prev, isGlobalPlaying: playing }));
    };

    return (
        <JourneyContext.Provider value={{
            state,
            selectCategory,
            startJourney,
            resetJourney,
            nextStep,
            completeDay,
            nudgeMessage,
            triggerNudge,
            clearNudge,
            setActiveFilter,
            goBack,
            addToRecentlyPlayed,
            playTrack,
            setGlobalPlaying
        }}>
            {children}
        </JourneyContext.Provider>
    );
};

export const useJourney = () => {
    const context = useContext(JourneyContext);
    if (!context) throw new Error('useJourney must be used within JourneyProvider');
    return context;
};
