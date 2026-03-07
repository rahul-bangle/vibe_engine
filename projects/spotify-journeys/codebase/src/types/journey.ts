import type { Track } from '../services/spotifyService';

export type JourneyPath = 
    | 'English Vocabulary Builder' 
    | 'Communication Skills' 
    | 'Language Mastery' 
    | 'Productivity Habits' 
    | 'Morning Motivation' 
    | 'Public Speaking';

export interface JourneyState {
    profileId: string | null;
    userName: string | null;
    currentPath: JourneyPath | null;
    step: number;
    isCompleted: boolean;
    streak: number;
    lastCompletedAt: string | null;
    completionHistory: Record<string, boolean>; // ISO date string -> boolean
    recentlyPlayed: string[]; // Track IDs
    activeFilter: string;
    globalTrack: Track | null;
    isGlobalPlaying: boolean;
    onboardingStep: 'naming' | 'dashboard' | 'pointing_sidebar' | 'pointing_start' | 'playing' | 'completed' | 'finished' | null;
}

export interface JourneyContextType {
    state: JourneyState;
    interactionCount: number;
    selectCategory: (path: JourneyPath) => void;
    startJourney: () => void;
    resetJourney: () => void;
    nextStep: () => void;
    completeDay: () => void;
    trackEvent: (eventType: string, elementId: string, metadata?: any) => Promise<void>;
    nudgeMessage: string | null;
    triggerNudge: (message: string) => void;
    clearNudge: () => void;
    setActiveFilter: (filter: string) => void;
    goBack: () => void;
    continueLearning: () => void;
    addToRecentlyPlayed: (trackId: string) => void;
    playTrack: (track: Track) => void;
    setGlobalPlaying: (playing: boolean) => void;
    setUserName: (name: string) => Promise<void>;
    updateOnboardingStep: (step: JourneyState['onboardingStep']) => void;
    resetState: () => void;
}
