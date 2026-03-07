import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Track } from '../services/spotifyService';
import type { JourneyPath, JourneyState, JourneyContextType } from '../types/journey';
import { supabase } from '../services/supabaseClient';

export const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState<Omit<JourneyState, 'currentPath' | 'step'>>(() => {
        const saved = localStorage.getItem('spotify-journey-state');
        if (saved) {
            const parsed = JSON.parse(saved);
            return {
                profileId: parsed.profileId || null,
                userName: parsed.userName || null,
                isCompleted: parsed.isCompleted || false,
                streak: parsed.streak || 0,
                lastCompletedAt: parsed.lastCompletedAt || null,
                completionHistory: parsed.completionHistory || {},
                recentlyPlayed: parsed.recentlyPlayed || [],
                activeFilter: parsed.activeFilter || 'All',
                globalTrack: parsed.globalTrack || null,
                isGlobalPlaying: parsed.isGlobalPlaying || false,
                onboardingStep: parsed.onboardingStep || (parsed.userName ? null : 'naming')
            };
        }
        return {
            profileId: null,
            userName: null,
            isCompleted: false,
            streak: 0,
            lastCompletedAt: null,
            completionHistory: {},
            recentlyPlayed: [],
            activeFilter: 'All',
            globalTrack: null,
            isGlobalPlaying: false,
            onboardingStep: 'naming'
        };
    });

    // Derive currentPath and step from URL
    const { currentPath, step } = useMemo(() => {
        const path = location.pathname;
        if (path === '/') {
            return { currentPath: null, step: 0 };
        } else if (path.startsWith('/category/')) {
            const categoryName = decodeURIComponent(path.replace('/category/', '')) as JourneyPath;
            return { currentPath: categoryName, step: 1 };
        } else if (path.startsWith('/player/')) {
            const categoryName = decodeURIComponent(path.replace('/player/', '')) as JourneyPath;
            return { currentPath: categoryName, step: 2 };
        }
        return { currentPath: null, step: 0 };
    }, [location.pathname]);

    const fullState = useMemo<JourneyState>(() => ({
        ...state,
        currentPath,
        step
    }), [state, currentPath, step]);

    const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);

    // Sync state with Supabase when important fields change
    useEffect(() => {
        const syncProfile = async () => {
            if (state.profileId && state.userName) {
                await supabase
                    .from('profiles')
                    .update({
                        streak: state.streak,
                        last_completed_at: state.lastCompletedAt
                    })
                    .eq('id', state.profileId);
            }
        };
        syncProfile();
        localStorage.setItem('spotify-journey-state', JSON.stringify(state));
    }, [state]);

    const setUserName = async (name: string) => {
        // First check if a profile with this name exists
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('name', name)
            .single();

        if (existingProfile) {
            setState(prev => ({
                ...prev,
                profileId: existingProfile.id,
                userName: existingProfile.name,
                streak: existingProfile.streak || prev.streak,
                lastCompletedAt: existingProfile.last_completed_at || prev.lastCompletedAt,
                onboardingStep: 'dashboard'
            }));
        } else {
            // Create new profile
            const { data: newProfile, error } = await supabase
                .from('profiles')
                .insert([{ name, streak: 0 }])
                .select()
                .single();

            if (newProfile) {
                setState(prev => ({
                    ...prev,
                    profileId: newProfile.id,
                    userName: newProfile.name,
                    onboardingStep: 'dashboard'
                }));
            } else if (error) {
                // Fallback for offline/no supabase setup
                setState(prev => ({ ...prev, userName: name, onboardingStep: 'dashboard' }));
            }
        }
    };

    const updateOnboardingStep = (step: JourneyState['onboardingStep']) => {
        setState(prev => ({ ...prev, onboardingStep: step }));
    };

    const selectCategory = (path: JourneyPath) => {
        setState(prev => ({ ...prev, isCompleted: false }));
        trackEvent('NAV_CATEGORY', path);
        navigate(`/category/${encodeURIComponent(path)}`);
    };

    const startJourney = () => {
        trackEvent('JOURNEY_START', currentPath || 'unknown');
        if (state.onboardingStep === 'pointing_start') {
            updateOnboardingStep('playing');
        }
        if (currentPath) {
            navigate(`/player/${encodeURIComponent(currentPath)}`);
        } else {
            navigate('/player/Focus');
        }
    };

    const resetJourney = () => {
        trackEvent('NAV_RESET', 'home');
        setState(prev => ({ ...prev, isCompleted: false, activeFilter: 'All', onboardingStep: 'finished' }));
        navigate('/');
    };

    const continueLearning = () => {
        trackEvent('NAV_CONTINUE', 'journeys');
        setState(prev => ({ ...prev, isCompleted: false, onboardingStep: 'finished' }));
        // No navigation here - we want to stay in the player and continue
    };

    const resetState = () => {
        localStorage.removeItem('spotify-journey-state');
        window.location.reload();
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
        trackEvent('NAV_FILTER', filter);
        setState(prev => ({ ...prev, activeFilter: filter }));
    };

    const goBack = () => {
        trackEvent('NAV_BACK', 'browser');
        navigate(-1);
    };

    const nextStep = () => {
        if (step === 1) navigate('/player');
    };

    const completeDay = async () => {
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
            }
        } else {
            newStreak = 1;
        }

        const now = new Date().toISOString();
        
        // Optimistic update
        setState(prev => ({
            ...prev,
            isCompleted: true,
            streak: newStreak,
            lastCompletedAt: now,
            completionHistory: { ...prev.completionHistory, [today]: true }
        }));

        // Log progress to Supabase
        if (state.profileId) {
            await supabase.from('journey_progress').insert([{
                profile_id: state.profileId,
                path_name: currentPath || 'Unknown'
            }]);
        }
    };

    const triggerNudge = (message: string) => {
        setNudgeMessage(message);
    };

    const clearNudge = () => {
        setNudgeMessage(null);
    };

    const playTrack = (track: Track) => {
        setState(prev => ({
            ...prev,
            globalTrack: track,
            isGlobalPlaying: true,
        }));
    };

    const setGlobalPlaying = (playing: boolean) => {
        setState(prev => ({ ...prev, isGlobalPlaying: playing }));
    };

    const [interactionCount, setInteractionCount] = useState<number>(() => {
        const saved = sessionStorage.getItem('spotify-interaction-count');
        return saved ? parseInt(saved, 10) : 0;
    });

    useEffect(() => {
        sessionStorage.setItem('spotify-interaction-count', interactionCount.toString());
    }, [interactionCount]);

    const trackEvent = async (eventType: string, elementId: string, metadata: any = {}) => {
        setInteractionCount(prev => prev + 1);
        if (state.profileId) {
            try {
                // Include user name in metadata for easier debugging/visibility in logs
                const richMetadata = { 
                    ...metadata, 
                    user_name: state.userName || 'Unknown' 
                };

                await supabase.from('activity_logs').insert({
                    profile_id: state.profileId,
                    event_type: eventType,
                    element_id: elementId,
                    page_path: window.location.pathname,
                    metadata: richMetadata
                });
            } catch (err) {
                console.warn('Tracking failed:', err);
            }
        }
    };

    return (
        <JourneyContext.Provider value={{
            state: fullState,
            interactionCount,
            selectCategory,
            startJourney,
            resetJourney,
            nextStep,
            completeDay,
            trackEvent,
            nudgeMessage,
            triggerNudge,
            clearNudge,
            setActiveFilter,
            goBack,
            continueLearning,
            addToRecentlyPlayed,
            playTrack,
            setGlobalPlaying,
            setUserName,
            updateOnboardingStep,
            resetState
        } as JourneyContextType}>
            {children}
        </JourneyContext.Provider>
    );
};
