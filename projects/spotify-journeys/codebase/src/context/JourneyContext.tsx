import React, { createContext, useContext, useState, useEffect } from 'react';

export type JourneyPath = 'Deep Focus' | 'Mindful Morning' | 'Hype & Energy';

interface JourneyState {
    currentPath: JourneyPath | null;
    step: number;
    isCompleted: boolean;
}

interface JourneyContextType {
    state: JourneyState;
    startJourney: (path: JourneyPath) => void;
    resetJourney: () => void;
    nextStep: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<JourneyState>(() => {
        const saved = localStorage.getItem('spotify-journey-state');
        return saved ? JSON.parse(saved) : { currentPath: null, step: 0, isCompleted: false };
    });

    useEffect(() => {
        localStorage.setItem('spotify-journey-state', JSON.stringify(state));
    }, [state]);

    const startJourney = (path: JourneyPath) => {
        setState({ currentPath: path, step: 1, isCompleted: false });
    };

    const resetJourney = () => {
        setState({ currentPath: null, step: 0, isCompleted: false });
    };

    const nextStep = () => {
        setState(prev => ({ ...prev, step: prev.step + 1 }));
    };

    return (
        <JourneyContext.Provider value={{ state, startJourney, resetJourney, nextStep }}>
            {children}
        </JourneyContext.Provider>
    );
};

export const useJourney = () => {
    const context = useContext(JourneyContext);
    if (!context) throw new Error('useJourney must be used within JourneyProvider');
    return context;
};
