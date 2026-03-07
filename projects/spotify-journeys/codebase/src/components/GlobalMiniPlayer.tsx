import React, { useRef, useEffect, useState } from 'react';
import { GripVertical, Play, Pause, X } from 'lucide-react';
import { useJourney } from '../hooks/useJourney';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

export const GlobalMiniPlayer: React.FC = () => {
    const { state, setGlobalPlaying, playTrack } = useJourney();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const dragControls = useDragControls();

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
        playTrack(null as any);
    };

    if (!track) return null;

    // Hide mini player when in JourneyPlayer (step 2)
    if (state.step === 2) return null;

    const progress = (currentTime / (duration || 1)) * 100;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, x: '-50%', opacity: 0 }}
                animate={{ y: 0, x: '-50%', opacity: 1 }}
                exit={{ y: 100, x: '-50%', opacity: 0 }}
                drag
                dragListener={false}
                dragControls={dragControls}
                dragMomentum={false}
                dragConstraints={{ 
                    left: -window.innerWidth / 2 + 20, 
                    right: window.innerWidth / 2 - 20, 
                    top: -window.innerHeight + 100, 
                    bottom: 20 
                }}
                className="fixed bottom-10 left-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm"
            >
                <div className="bg-[#0f0f0f]/95 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                    <audio
                        ref={audioRef}
                        src={track.previewUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleEnded}
                    />

                    {/* Drag Handle & Info Row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                             <div 
                                onPointerDown={(e) => dragControls.start(e)}
                                className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/10 rounded-md transition-colors"
                            >
                                <GripVertical size={16} className="text-primary/60" />
                            </div>
                            <div className="flex space-x-[2px] h-3 items-center">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-[2.5px] bg-primary rounded-full animate-waveform-pro"
                                        style={{ 
                                            animationDelay: `${i * 0.15}s`,
                                            height: isPlaying ? '100%' : '30%'
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <span className="text-[9px] font-black text-primary/80 uppercase tracking-[0.2em] animate-pulse">Processing Audio</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={handleClose} className="p-1.5 text-neutral-500 hover:text-white hover:bg-red-500/20 rounded-full transition-all">
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex items-center gap-4">
                        <div className="relative group/thumb shrink-0">
                            <img 
                                src={track.albumArt || track.image} 
                                alt={track.name} 
                                className="w-12 h-12 rounded-xl object-cover shadow-2xl border border-white/5" 
                            />
                            {isPlaying && (
                                <div className="absolute inset-0 bg-primary/20 rounded-xl mix-blend-overlay" />
                            )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-black text-white truncate leading-tight uppercase tracking-tight">{track.name}</h4>
                            <p className="text-[10px] text-primary font-bold truncate opacity-80 mt-0.5">{track.artist || track.description}</p>
                        </div>

                        <button
                            onClick={() => setGlobalPlaying(!isPlaying)}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 active:scale-95 transition-all shadow-xl shrink-0"
                        >
                            {isPlaying ? <Pause size={18} fill="black" /> : <Play size={18} fill="black" className="ml-0.5" />}
                        </button>
                    </div>

                    {/* Subtle Progress Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-white/5">
                        <motion.div
                            className="h-full bg-primary shadow-[0_0_12px_rgba(29,185,84,0.6)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
