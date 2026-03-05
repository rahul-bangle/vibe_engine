import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, X, Maximize2 } from 'lucide-react';
import { useJourney } from '../context/JourneyContext';
import { motion } from 'framer-motion';
import { spotifyService } from '../services/spotifyService';
import type { Track } from '../services/spotifyService';

export const JourneyPlayer: React.FC = () => {
    const { state, resetJourney, completeDay, addToRecentlyPlayed, setGlobalPlaying } = useJourney();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [segmentIndex, setSegmentIndex] = useState(0);
    const [segments, setSegments] = useState<Track[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showControls, setShowControls] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const controlsTimeoutRef = useRef<any>(null);

    // Pause global playback when journey starts
    useEffect(() => {
        if (state.isGlobalPlaying) {
            setGlobalPlaying(false);
        }
    }, [state.isGlobalPlaying, setGlobalPlaying]);

    // Fetch segments based on path
    useEffect(() => {
        const fetchSegments = async () => {
            setIsLoading(true);
            const query = state.currentPath || 'Focus';
            const tracks = await spotifyService.searchTracks(query);

            const sequence: Track[] = [
                { ...tracks[0], name: `Welcome to ${state.currentPath}`, artist: "Journey Intro" },
                { ...tracks[1] },
                { ...tracks[2] || tracks[0], name: "Deep Dive", artist: "Educational Content" },
                { ...tracks[3] || tracks[1], name: "Completion", artist: "Day Wrap-up" }
            ];

            setSegments(sequence);
            setIsLoading(false);
        };
        fetchSegments();
    }, [state.currentPath]);

    const currentSegment = segments[segmentIndex];

    // Audio handlers
    useEffect(() => {
        if (currentSegment && currentSegment.id) {
            addToRecentlyPlayed(currentSegment.id);
        }
    }, [segmentIndex, currentSegment?.id]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch(e => console.error("Playback failed", e));
        } else {
            audio.pause();
        }
    }, [isPlaying, segmentIndex]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleEnded = () => {
        if (segmentIndex < segments.length - 1) {
            setSegmentIndex(prev => prev + 1);
        } else {
            setIsPlaying(false);
            completeDay();
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    };

    const handleNext = () => {
        if (segmentIndex < segments.length - 1) {
            setSegmentIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (segmentIndex > 0) {
            setSegmentIndex(prev => prev - 1);
        }
    };

    // Auto-hide controls
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    if (isLoading || !currentSegment) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const progress = (currentTime / (duration || 1)) * 100;
    const overallProgress = ((segmentIndex + (currentTime / (duration || 1))) / segments.length) * 100;

    return (
        <div
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden cursor-none"
            onMouseMove={handleMouseMove}
            style={{ cursor: showControls ? 'default' : 'none' }}
        >
            {/* Ambient Canvas (Background Video) */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none grayscale contrast-125"
                src="https://player.vimeo.com/external/494252666.sd.mp4?s=bc46313832c39d8999818817711b7dfb6a5a3a0c&profile_id=164"
            />

            {/* Gradient Flow Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 animate-gradient-flow pointer-events-none" />

            <audio
                ref={audioRef}
                src={currentSegment.previewUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onError={() => handleNext()} // Skip if error
            />

            {/* Top HUD: Segment Indicator */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: showControls ? 0 : -50, opacity: showControls ? 1 : 0 }}
                className="absolute top-10 left-0 right-0 flex justify-center gap-4 z-20"
            >
                {segments.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-500 ${i === segmentIndex ? 'w-12 bg-primary mastery-glow' :
                            i < segmentIndex ? 'w-6 bg-primary/40' : 'w-6 bg-white/10'
                            }`}
                    />
                ))}
            </motion.div>

            {/* Exit Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: showControls ? 1 : 0 }}
                onClick={resetJourney}
                className="absolute top-10 right-10 p-3 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors z-20"
            >
                <X className="w-6 h-6" />
            </motion.button>

            {/* Main Center Stage */}
            <div className="relative flex flex-col items-center gap-12 z-10 scale-90 md:scale-100">
                {/* Rotating Media Center */}
                <div className="relative group p-4">
                    {/* SVG Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                            cx="50%" cy="50%" r="48%"
                            fill="none"
                            stroke="rgba(255,255,255,0.05)"
                            strokeWidth="2"
                        />
                        <motion.circle
                            cx="50%" cy="50%" r="48%"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            style={{
                                strokeDasharray: "100",
                                strokeDashoffset: 100 - progress
                            }}
                            className="mastery-glow"
                        />
                    </svg>

                    {/* Circular Album Art */}
                    <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-white/5 shadow-2xl animate-spin-slow">
                        <img
                            src={currentSegment.albumArt}
                            alt={currentSegment.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Track Info */}
                <div className="text-center space-y-4">
                    <motion.h1
                        key={currentSegment.name}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter text-glow"
                    >
                        {currentSegment.name}
                    </motion.h1>
                    <motion.p
                        key={currentSegment.artist}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl font-bold text-primary/80 uppercase tracking-widest"
                    >
                        {currentSegment.artist}
                    </motion.p>
                </div>
            </div>

            {/* Floating Controls Bar */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: showControls ? 0 : 100, opacity: showControls ? 1 : 0 }}
                className="absolute bottom-12 glass-card p-6 md:p-8 rounded-[40px] w-[90%] max-w-2xl flex flex-col gap-6 z-20"
            >
                {/* Scrubber */}
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-white/40 w-10 tabular-nums">
                        {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
                    </span>
                    <div
                        onClick={handleSeek}
                        className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative group overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-primary group-hover:bg-primary-hover transition-colors"
                            initial={false}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono text-white/40 w-10 tabular-nums">
                        {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                    </span>
                </div>

                {/* Integration: Controls + Volume */}
                <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-4 w-48 invisible md:visible">
                        <Volume2 className="w-5 h-5 text-white/60" />
                        <input
                            type="range"
                            min="0" max="1" step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full accent-primary bg-white/10 rounded-lg appearance-none h-1"
                        />
                    </div>

                    <div className="flex items-center gap-8">
                        <button onClick={handlePrev} className="text-white/40 hover:text-white transition-colors">
                            <SkipBack className="w-7 h-7 fill-current" />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30_rgba(255,255,255,0.2)]"
                        >
                            {isPlaying ? <Pause className="text-black w-7 h-7 fill-current" /> : <Play className="text-black w-7 h-7 fill-current translate-x-0.5" />}
                        </button>
                        <button onClick={handleNext} className="text-white/40 hover:text-white transition-colors">
                            <SkipForward className="w-7 h-7 fill-current" />
                        </button>
                    </div>

                    <div className="w-48 flex justify-end">
                        <button className="text-white/40 hover:text-white transition-colors">
                            <Maximize2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Overall Progress Hint */}
            <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-white/5">
                <motion.div
                    className="h-full bg-primary/20"
                    animate={{ width: `${overallProgress}%` }}
                />
            </div>
        </div>
    );
};
