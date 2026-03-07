import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SpotifyIcon } from './icons/SpotifyIcon';

interface OnboardingPopUpProps {
    onClose: () => void;
}

export const OnboardingPopUp: React.FC<OnboardingPopUpProps> = ({ onClose }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="absolute top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg p-[2px] rounded-[2.5rem] bg-gradient-to-br from-primary via-white/20 to-primary/40 shadow-[0_0_100px_rgba(29,185,84,0.3)]"
    >
        <div className="bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[2.4rem] p-10 overflow-hidden relative">
            {/* Animated background pulse */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] -mr-32 -mt-32 rounded-full animate-pulse" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] -ml-32 -mb-32 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div 
                    initial={{ rotate: -10, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="w-24 h-24 bg-gradient-to-tr from-primary to-green-400 rounded-3xl flex items-center justify-center mb-8 shadow-[0_15px_40px_rgba(29,185,84,0.4)] relative"
                >
                    <SpotifyIcon color="black" size={40} className="translate-x-0" />
                    <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full animate-ping opacity-50" />
                </motion.div>

                <h3 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter leading-none">
                    Spotify <br/><span className="text-primary italic">Learning</span>
                </h3>
                
                <p className="text-text-subdued text-lg font-medium mb-10 leading-relaxed max-w-sm">
                    Hey, we've added a new feature that helps you <span className="text-white font-bold">listen and learn</span> at the same time! Master vocabulary while vibing to your favorite tracks.
                </p>

                <button 
                    onClick={onClose}
                    className="group relative w-full mb-4"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-green-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-primary text-black py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-tighter">
                        Start Today's Session
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>

                <button 
                    onClick={onClose}
                    className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] hover:text-white/60 transition-colors"
                >
                    Maybe Later
                </button>

                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-8">Phase 1: Deep Integration Active</p>
            </div>
        </div>
    </motion.div>
);
