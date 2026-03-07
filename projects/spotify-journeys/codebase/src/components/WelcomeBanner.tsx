import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { useJourney } from '../hooks/useJourney';
import { SpotifyIcon } from './icons/SpotifyIcon';

export const WelcomeBanner: React.FC = () => {
    const { state, setUserName } = useJourney();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);


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
                    <p className="text-white/60 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                        Hey! We've added a new feature that helps you <span className="text-primary font-bold">listen and learn</span> at the same time. Experience music like never before.
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

                    <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
                        <div className="text-[9px] uppercase tracking-[0.4em] font-black text-primary">Neural Extraction</div>
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <div className="text-[9px] uppercase tracking-[0.4em] font-black text-white">Spotify Beta</div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
