import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, X, Maximize2 } from 'lucide-react';
import { useJourney } from '../context/JourneyContext';
import { motion, AnimatePresence } from 'framer-motion';

export const GlobalMiniPlayer: React.FC = () => {
    const { state, setGlobalPlaying, playTrack } = useJourney();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const track = state.globalTrack;
    const isPlaying = state.isGlobalPlaying;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !track) return;

        if (isPlaying) {
            audio.play().catch(e => console.error("MiniPlayer playback failed", e));
        } else {
            audio.pause();
        }
    }, [isPlaying, track?.id]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleEnded = () => {
        setGlobalPlaying(false);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        playTrack(null);
    };

    if (!track) return null;

    // Hide mini player when in JourneyPlayer (step 2)
    if (state.step === 2) return null;

    const progress = (currentTime / (duration || 1)) * 100;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] w-full max-w-md"
            >
                <div className="bg-[#0f0f0f] rounded-2xl p-4 border border-white/5 shadow-2xl relative overflow-hidden group">
                    <audio
                        ref={audioRef}
                        src={track.previewUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleEnded}
                    />

                    {/* Top Meta Info */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-[2px] h-3 items-center">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-[2px] bg-primary rounded-full animate-waveform-slow"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    ></div>
                                ))}
                            </div>
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Processing Audio</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Maximize2 size={12} className="text-neutral-600 hover:text-white cursor-pointer transition-colors" />
                            <button onClick={handleClose} className="p-1 text-neutral-600 hover:text-white transition-colors">
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Main Player Row */}
                    <div className="flex items-center space-x-4">
                        {/* Compact, Premium Waveform Visualizer */}
                        <div className="flex-1 h-8 flex items-center justify-center space-x-[3px]">
                            {[...Array(24)].map((_, i) => {
                                // Deterministic "random" height based on index for consistent look
                                const baseHeight = 30 + ((i * 7) % 50);
                                return (
                                    <div
                                        key={i}
                                        className="w-[2px] bg-gradient-to-t from-primary/20 via-primary-hover to-primary/20 rounded-full animate-waveform-pro"
                                        style={{
                                            height: isPlaying ? `${baseHeight * 0.8}%` : '20%',
                                            animationDelay: `${i * 0.04}s`,
                                            opacity: i < 16 ? 1 : 0.4,
                                            animationPlayState: isPlaying ? 'running' : 'paused'
                                        }}
                                    ></div>
                                );
                            })}
                        </div>

                        {/* Track Info & Controls */}
                        <div className="flex items-center space-x-3 min-w-fit">
                            <div className="text-right max-w-[120px]">
                                <h4 className="text-xs font-bold text-white truncate">{track.name}</h4>
                                <p className="text-[10px] text-neutral-500 font-medium truncate">{track.artist || track.description}</p>
                            </div>
                            <button
                                onClick={() => setGlobalPlaying(!isPlaying)}
                                className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-lg"
                            >
                                {isPlaying ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" className="ml-0.5" />}
                            </button>
                        </div>
                    </div>

                    {/* Subtle Bottom Progress */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
                        <motion.div
                            className="h-full bg-primary/50 shadow-[0_0_8px_rgba(29,185,84,0.4)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        ></motion.div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
