import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, CheckCircle2, Loader2 } from 'lucide-react';
import { useJourney } from '../context/JourneyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { spotifyService } from '../services/spotifyService';
import type { Track } from '../services/spotifyService';

export const JourneyPlayer: React.FC = () => {
    const { state, resetJourney } = useJourney();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [segmentIndex, setSegmentIndex] = useState(0);
    const [segments, setSegments] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Fetch real tracks related to the journey path
    useEffect(() => {
        const fetchSegments = async () => {
            setIsLoading(true);
            const query = state.currentPath || 'Focus';
            const tracks = await spotifyService.searchTracks(query);
            setSegments(tracks.slice(0, 3)); // Take top 3 for the journey
            setIsLoading(false);
        };
        fetchSegments();
    }, [state.currentPath]);

    const currentSegment = segments[segmentIndex];

    // Audio Sync Logic
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Playback failed", e));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, segmentIndex]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const handleEnd = () => handleNext();

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('ended', handleEnd);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('ended', handleEnd);
        };
    }, [segments, segmentIndex]);

    const handleNext = () => {
        if (segmentIndex < segments.length - 1) {
            setSegmentIndex((prev) => prev + 1);
            setCurrentTime(0);
        } else {
            setIsPlaying(false);
            if (audioRef.current) audioRef.current.currentTime = 0;
        }
    };

    const handlePrev = () => {
        if (currentTime > 3) {
            if (audioRef.current) audioRef.current.currentTime = 0;
        } else if (segmentIndex > 0) {
            setSegmentIndex((prev) => prev - 1);
            setCurrentTime(0);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-text-subdued font-bold animate-pulse">Curating your {state.currentPath} journey...</p>
            </div>
        );
    }

    if (!currentSegment) return null;

    const progress = (currentTime / (currentSegment.duration || 30)) * 100;
    const overallProgress = ((segmentIndex + (currentTime / (currentSegment.duration || 30))) / segments.length) * 100;

    return (
        <div className="flex flex-col gap-8 w-full max-w-4xl animate-in fade-in zoom-in duration-700 mx-auto">
            {/* Real Audio Element */}
            <audio ref={audioRef} src={currentSegment.previewUrl} />

            {/* Overall Progress Tracker */}
            <div className="bg-background-elevated p-6 rounded-xl border border-zinc-800 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="font-black text-xl flex items-center gap-3">
                        <CheckCircle2 className="text-primary w-6 h-6" />
                        JOURNEY PROGRESS
                    </h3>
                    <span className="text-primary font-black text-2xl tabular-nums">{Math.round(overallProgress)}%</span>
                </div>
                <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden relative z-10">
                    <motion.div
                        className="h-full bg-primary shadow-[0_0_15px_rgba(29,185,84,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${overallProgress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Main Player Visual */}
            <div className="relative group">
                <div className="aspect-video bg-background-elevated rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center border border-white/5 relative">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={`bg-${currentSegment.id}`}
                            src={currentSegment.albumArt}
                            alt={currentSegment.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 w-full h-full object-cover blur-3xl scale-110"
                        />
                    </AnimatePresence>

                    <motion.div
                        key={currentSegment.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex flex-col items-center gap-8 relative z-10"
                    >
                        <div className="w-64 h-64 bg-zinc-800 rounded-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden border border-white/10 group-hover:scale-105 transition-transform duration-500">
                            <img src={currentSegment.albumArt} alt={currentSegment.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-center px-4">
                            <h2 className="text-4xl font-black mb-2 tracking-tight line-clamp-1">{currentSegment.name}</h2>
                            <p className="font-bold text-xl text-primary/90">{currentSegment.artist}</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-background-elevated p-10 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-md">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-text-subdued font-mono w-12 tabular-nums">
                            {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
                        </span>
                        <div className="flex-1 h-2 bg-zinc-800 rounded-full group cursor-pointer relative overflow-hidden">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-white group-hover:bg-primary transition-colors"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-sm text-text-subdued font-mono w-12 tabular-nums">
                            {Math.floor((currentSegment.duration || 30) / 60)}:{(Math.floor((currentSegment.duration || 30) % 60)).toString().padStart(2, '0')}
                        </span>
                    </div>

                    <div className="flex items-center justify-center gap-12">
                        <button
                            onClick={handlePrev}
                            className="text-text-subdued hover:text-white transition-all transform hover:scale-110 active:scale-95"
                        >
                            <SkipBack className="w-10 h-10 fill-current" />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-[0_10px_25px_rgba(255,255,255,0.2)]"
                        >
                            {isPlaying ? <Pause className="text-black w-10 h-10 fill-current" /> : <Play className="text-black w-10 h-10 fill-current translate-x-1" />}
                        </button>
                        <button
                            onClick={handleNext}
                            className="text-text-subdued hover:text-white transition-all transform hover:scale-110 active:scale-95"
                        >
                            <SkipForward className="w-10 h-10 fill-current" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4 mt-4">
                <button
                    onClick={resetJourney}
                    className="text-text-subdued hover:text-white transition-all text-xs font-black uppercase tracking-widest border-b border-white/0 hover:border-white/20 pb-1"
                >
                    Abandon Journey
                </button>
            </div>
        </div>
    );
};
