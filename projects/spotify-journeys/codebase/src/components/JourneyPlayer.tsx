import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, X, ChevronDown, Shuffle, Repeat, Star } from 'lucide-react';
import { useJourney } from '../hooks/useJourney';
import { motion, AnimatePresence } from 'framer-motion';
import { spotifyService } from '../services/spotifyService';
import type { Track } from '../services/spotifyService';
import { useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

export const JourneyPlayer: React.FC = () => {
    const PLAY_LIMIT = 8;
    const { id } = useParams<{ id: string }>();
    const { state, resetJourney, completeDay, addToRecentlyPlayed, setGlobalPlaying, updateOnboardingStep, continueLearning } = useJourney();
    const journeyTitle = id ? decodeURIComponent(id) : state.currentPath || 'Focus';

    const [isPlaying, setIsPlaying] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [segmentIndex, setSegmentIndex] = useState(0);
    const [segments, setSegments] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    const [dominantColor, setDominantColor] = useState('#1a1a2e');

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Stop global playback
    useEffect(() => {
        if (state.isGlobalPlaying) setGlobalPlaying(false);
    }, []);

    // Fetch segments
    useEffect(() => {
        const fetchSegments = async () => {
            setIsLoading(true);
            const queryMap: Record<string, string> = {
                'English Vocabulary Builder': 'English Vocabulary Lesson',
                'Communication Skills': 'Communication Skills Tutorial',
                'Language Mastery': 'English Learning Lesson',
                'Productivity Habits': 'Productivity Skills Podcast',
                'Morning Motivation': 'Daily Motivation Podcast',
                'Public Speaking': 'Public Speaking Tutorial'
            };
            const query = queryMap[journeyTitle] || `${journeyTitle} lesson`;
            const educationalTracks = await spotifyService.searchTracks(query);

            if (educationalTracks.length === 0) {
                setSegments([{
                    id: 'fallback',
                    name: `Welcome to ${journeyTitle}`,
                    artist: 'Discovery Academy',
                    albumArt: '/language_mastery_hero.png',
                    previewUrl: '',
                    duration: 30
                }]);
            } else {
                const sequence = educationalTracks.slice(0, 4).map((t, i) => ({
                    ...t,
                    name: `Module ${i + 1}: ${t.name}`,
                    artist: i === 0 ? 'Introduction' : t.artist
                }));
                setSegments(sequence);
            }
            setIsLoading(false);
        };
        fetchSegments();
    }, [journeyTitle]);

    const currentSegment = segments[segmentIndex];

    useEffect(() => {
        if (currentSegment?.id) addToRecentlyPlayed(currentSegment.id);
    }, [segmentIndex, currentSegment?.id]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    }, [isPlaying, segmentIndex]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Shift background color per segment
    useEffect(() => {
        const colors = ['#0d1b2a', '#1a0a2e', '#0a2a1a', '#2a1a0a'];
        setDominantColor(colors[segmentIndex % colors.length]);
    }, [segmentIndex]);

    // Sync global completion state to local and advance if continuing
    useEffect(() => {
        if (isCompleted && !state.isCompleted) {
            // User clicked "Continue Learning"
            setIsCompleted(false);
            if (segmentIndex < segments.length - 1) {
                setSegmentIndex(prev => prev + 1);
                setIsPlaying(true);
                setCurrentTime(0);
                if (audioRef.current) audioRef.current.currentTime = 0;
            } else {
                // If at end of sequence, just reset to first but keep playing
                setSegmentIndex(0);
                setIsPlaying(true);
                setCurrentTime(0);
                if (audioRef.current) audioRef.current.currentTime = 0;
            }
        }
    }, [state.isCompleted, isCompleted, segmentIndex, segments.length]);

    // Auto-dismiss onboarding HUD

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            setCurrentTime(current);
            if (current >= PLAY_LIMIT) {
                audioRef.current.currentTime = 0;
                handleEnded();
            }
        }
    };

    const triggerCompletion = () => {
        setIsPlaying(false);
        completeDay();
        setIsCompleted(true);
        if (state.onboardingStep !== 'completed' && state.onboardingStep !== null) {
            updateOnboardingStep('completed');
        }
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 9999 });
    };

    const handleEnded = () => {
        // Streamlined: Complete after the first segment is done
        if (segmentIndex === 0) {
            triggerCompletion();
        } else if (segmentIndex < segments.length - 1) {
            setSegmentIndex(prev => prev + 1);
        } else {
            triggerCompletion();
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * PLAY_LIMIT;
    };

    const handleNext = () => {
        if (segmentIndex === 0) {
            triggerCompletion();
        } else if (segmentIndex < segments.length - 1) {
            setSegmentIndex(p => p + 1);
        }
    };

    const handlePrev = () => { if (segmentIndex > 0) setSegmentIndex(p => p - 1); };

    const progress = (currentTime / PLAY_LIMIT) * 100;

    // ── Loading ──────────────────────────────────────────────
    if (isLoading || !currentSegment) {
        return (
            <div className="fixed inset-0 bg-[#121212] flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-10 h-10 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
                    <p className="text-white/40 text-sm font-medium tracking-widest uppercase">Loading journey</p>
                </div>
            </div>
        );
    }

    // ── Completion ───────────────────────────────────────────
    if (isCompleted) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[300] bg-[#121212] flex flex-col items-center justify-center p-6 text-center"
            >
                {/* Subtle green glow bg */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(29,185,84,0.15)_0%,_transparent_70%)]" />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full"
                >
                    {/* Big green checkmark circle */}
                    <div className="w-24 h-24 rounded-full bg-[#1db954] flex items-center justify-center shadow-[0_0_60px_rgba(29,185,84,0.4)]">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                            <motion.path
                                d="M5 13l4 4L19 7"
                                stroke="black"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            />
                        </svg>
                    </div>

                    <div>
                        <p className="text-[#1db954] text-xs font-bold tracking-[0.3em] uppercase mb-3 text-center w-full">Learning Milestone</p>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                            YOU ARE NOW READY.
                        </h1>
                        <p className="text-white/50 text-base leading-relaxed">
                            Session 1 completed.<br />
                            Streak updated to <span className="text-[#1db954] font-bold">{(state.streak || 0) + 1} days</span>.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <button
                            onClick={continueLearning}
                            className="bg-[#1db954] hover:bg-[#1ed760] text-black font-black text-xs py-4 px-10 rounded-full hover:scale-105 active:scale-95 transition-all tracking-widest uppercase"
                        >
                            Continue Learning
                        </button>
                        <button
                            onClick={resetJourney}
                            className="bg-white/10 hover:bg-white/20 text-white font-black text-xs py-4 px-10 rounded-full hover:scale-105 active:scale-95 transition-all tracking-widest uppercase border border-white/10"
                        >
                            Back to Home
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    // ── Main Player ──────────────────────────────────────────
    return (
        <div
            className="fixed inset-0 z-50 flex flex-col h-screen overflow-hidden"
            style={{
                background: `linear-gradient(180deg, ${dominantColor} 0%, #121212 50%, #121212 100%)`
            }}
        >
            {/* Subtle noise texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
                }}
            />

            <audio
                ref={audioRef}
                src={currentSegment.previewUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onError={handleNext}
            />

            {/* ── Top Bar ── */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-2">
                <button
                    onClick={resetJourney}
                    className="p-2 text-white/50 hover:text-white transition-colors"
                >
                    <ChevronDown className="w-6 h-6" />
                </button>

                <div className="text-center">
                    <p className="text-white/40 text-[10px] font-bold tracking-[0.25em] uppercase">Playing Journey</p>
                    <p className="text-white text-sm font-bold mt-0.5 tracking-tight">{journeyTitle}</p>
                </div>

                <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full border border-white/10">
                    <span className="text-[#1db954] text-xs">🔥</span>
                    <span className="text-white/70 text-[10px] font-bold ml-1">{state.streak || 0}</span>
                </div>
            </div>

            {/* ── Main View ── */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 px-8 py-4">
                <motion.div
                    key={segmentIndex}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full max-w-[min(calc(100vh-400px),calc(100vw-64px))] aspect-square rounded-2xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8)] border border-white/10"
                >
                    <img
                        src={currentSegment.albumArt}
                        alt={currentSegment.name}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <div className="w-full max-w-xl text-center mt-8">
                     <motion.h2
                        key={currentSegment.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-2xl md:text-3xl font-black tracking-tight"
                    >
                        {currentSegment.name}
                    </motion.h2>
                    <motion.p
                        key={currentSegment.artist}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        className="text-white/50 text-base font-medium mt-2"
                    >
                        {currentSegment.artist} • Module {segmentIndex + 1}/4
                    </motion.p>
                </div>
            </div>

            {/* ── REDESIGNED COMPACT PLAYER BAR ── */}
            <div className="relative z-20 bg-black/40 backdrop-blur-md border-t border-white/5 px-6 py-4 md:py-6 flex flex-col items-center gap-4">
                
                {/* Center: Progress & Main Controls */}
                <div className="w-full max-w-2xl flex flex-col items-center gap-2">
                    
                    {/* Controls Row */}
                    <div className="flex items-center gap-8">
                        <button className="text-white/30 hover:text-white transition-colors">
                            <Shuffle className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handlePrev}
                            className="text-white/70 hover:text-white transition-colors disabled:opacity-20 translate-y-0.5"
                            disabled={segmentIndex === 0}
                        >
                            <SkipBack className="w-6 h-6 fill-current" />
                        </button>

                        <button
                            onClick={() => {
                                if (!hasStarted) setHasStarted(true);
                                setIsPlaying(!isPlaying);
                            }}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
                        >
                            {isPlaying
                                ? <Pause className="text-black w-5 h-5 fill-current" />
                                : <Play className="text-black w-5 h-5 fill-current translate-x-0.5" />
                            }
                        </button>

                        <button
                            onClick={handleNext}
                            className="text-white/70 hover:text-white transition-colors disabled:opacity-20 translate-y-0.5"
                        >
                            <SkipForward className="w-6 h-6 fill-current" />
                        </button>

                        <button className="text-white/30 hover:text-white transition-colors">
                            <Repeat className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Scrubber Row */}
                    <div className="w-full flex items-center gap-3 group">
                        <span className="text-[10px] text-white/30 font-mono w-10 text-right tabular-nums">
                            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
                        </span>
                        
                        <div
                            onClick={handleSeek}
                            className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer relative"
                        >
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-white group-hover:bg-[#1db954] rounded-full transition-colors"
                                style={{ width: `${progress}%` }}
                            />
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                style={{ left: `calc(${progress}% - 6px)` }}
                            />
                        </div>

                        <span className="text-[10px] text-white/30 font-mono w-10 tabular-nums">
                            -{Math.floor((PLAY_LIMIT - currentTime) / 60)}:{Math.floor((PLAY_LIMIT - currentTime) % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* Volume & Extras (Desktop only or floating) */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-4 w-32">
                     <button onClick={() => setIsMuted(!isMuted)} className="text-white/40 hover:text-white transition-colors">
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setVolume((e.clientX - rect.left) / rect.width);
                            setIsMuted(false);
                        }}
                    >
                        <div
                            className="absolute inset-y-0 left-0 bg-white/40 group-hover:bg-[#1db954] rounded-full transition-colors"
                            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                        />
                    </div>
                </div>
            </div>


            {/* ── Guidance HUD (Onboarding) ── */}
            <AnimatePresence>
                {state.onboardingStep === 'playing' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[200] max-w-xs w-full px-4"
                    >
                        <div className="bg-primary/95 backdrop-blur-2xl p-6 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/20 text-black text-center relative">
                            <button 
                                onClick={() => updateOnboardingStep(null)}
                                className="absolute top-4 right-4 p-1 hover:bg-black/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                             <Star className="w-8 h-8 mx-auto mb-3 fill-black" />
                            <h3 className="font-black text-lg leading-tight mb-2 uppercase tracking-tighter">Spotify Learning Active</h3>
                            <p className="text-sm font-bold opacity-80 leading-snug">
                                Every track builds your skills. Complete this 8s session to finish your first day!
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};