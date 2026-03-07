import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, User, ArrowRight } from 'lucide-react';
import { useJourney } from '../hooks/useJourney';
import { SpotifyIcon } from './icons/SpotifyIcon';

export const WelcomeBanner: React.FC = () => {
    const { state, setUserName, updateOnboardingStep } = useJourney();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Show congratulatory screen if onboarding is completed
    if (state.onboardingStep === 'completed') {
        return (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-[#0a0a0a]/95 backdrop-blur-3xl overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 40 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="relative z-10 w-full max-w-4xl bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-20 text-center shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-md"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-24 h-24 bg-primary rounded-3xl rotate-12 flex items-center justify-center shadow-[0_10px_40px_rgba(29,185,84,0.5)]">
                            <SpotifyIcon color="black" size={48} className="-rotate-12" />
                        </div>
                    </div>

                    <h2 className="text-sm font-black text-primary uppercase tracking-[0.5em] mb-10">Learning Milestone Reached</h2>

                    <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
                        YOU ARE NOW <br /> <span className="text-primary italic">READY.</span>
                    </h1>

                    <p className="text-text-subdued text-xl md:text-2xl font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
                        Congratulations, <span className="text-white font-bold">{state.userName}</span>! You've just completed your first session in Spotify Beta.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-16 max-w-2xl mx-auto">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                            <p className="text-text-subdued text-[10px] font-black uppercase tracking-widest mb-1">Session</p>
                            <p className="text-2xl font-black text-white">#1 DONE</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                            <p className="text-text-subdued text-[10px] font-black uppercase tracking-widest mb-1">XP Gained</p>
                            <p className="text-2xl font-black text-primary">+500 XP</p>
                        </div>
                        <div className="bg-primary/20 p-6 rounded-3xl border border-primary/20 col-span-2 md:col-span-1">
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-primary">Status</p>
                            <p className="text-2xl font-black text-white">ASCENDING</p>
                        </div>
                    </div>

                    <button
                        onClick={() => updateOnboardingStep(null)}
                        className="group relative inline-flex items-center gap-4 bg-primary text-black px-12 py-6 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(29,185,84,0.3)]"
                    >
                        CONTINUE YOUR JOURNEY
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        );
    }

    // Only show if userName is not set
    if (state.userName) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length < 2) return;

        setIsLoading(true);
        await setUserName(name.trim());
        setIsLoading(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl px-4"
            >
                <motion.div
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-xl text-center"
                >
                    <div className="mb-10 inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/20 relative">
                        <SpotifyIcon size={48} />
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-black" />
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tighter text-white leading-[0.9]">
                        Spotify <span className="text-primary italic">Journeys</span>
                    </h1>
                    <p className="text-text-subdued text-lg sm:text-xl mb-12 font-medium max-w-sm mx-auto leading-relaxed">
                        Master your professional skills while you listen. An autonomous evolution by <span className="text-white">Spotify Beta.</span>
                    </p>

                    <form onSubmit={handleSubmit} className="relative group max-w-sm mx-auto">
                        <div className="relative">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-subdued transition-colors group-focus-within:text-primary">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="What's your name?"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-xl font-bold text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all outline-none"
                            />
                        </div>

                        <button
                            disabled={name.trim().length < 2 || isLoading}
                            className="w-full mt-6 bg-primary text-black py-5 rounded-2xl font-black text-xl transition-all duration-300 flex items-center justify-center gap-2 group active:scale-95 shadow-xl shadow-primary/10"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    START JOURNEY
                                    <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-16 flex items-center justify-center gap-8 opacity-30">
                        <div className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">Neural Extraction</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <div className="text-[10px] uppercase tracking-[0.4em] font-black text-white">Vibe Engine v1.2</div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
