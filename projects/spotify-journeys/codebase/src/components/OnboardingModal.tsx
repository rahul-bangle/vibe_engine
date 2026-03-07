import React, { useState } from 'react';
import { X, Check, ArrowRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../hooks/useJourney';
import type { JourneyPath } from '../types/journey';
import { cn } from '../utils/cn';
import { useTracking } from '../hooks/useTracking';

const PATHS: { id: JourneyPath; title: string; description: string; color: string }[] = [
    {
        id: 'English Vocabulary Builder',
        title: 'Vocabulary Builder',
        description: 'Master 500+ high-frequency words for professional and social success.',
        color: 'bg-emerald-500'
    },
    {
        id: 'Communication Skills',
        title: 'Communication Pro',
        description: 'Enhance your storytelling, public speaking, and dialogue confidence.',
        color: 'bg-blue-500'
    },
    {
        id: 'Language Mastery',
        title: 'Language Mastery',
        description: 'Deep dive into language grammar and cultural nuances through audio.',
        color: 'bg-primary'
    }
];

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const { selectCategory, setUserName, state } = useJourney();
    const { trackEvent } = useTracking();
    const [step, setStep] = useState(state.userName ? 2 : 1);
    const [nameInput, setNameInput] = useState('');

    const handleNameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (nameInput.trim()) {
            await setUserName(nameInput.trim());
            trackEvent('ONBOARDING_NAME_SET', nameInput.trim());
            setStep(2);
        }
    };

    const handlePathSelect = (pathId: JourneyPath) => {
        selectCategory(pathId);
        trackEvent('ONBOARDING_PATH_SELECTED', pathId);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#121212] w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden border border-white/10"
                    >
                        <div className="relative p-6 sm:p-10 md:p-14">
                            {state.userName && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-8 right-8 p-3 text-text-subdued hover:text-white transition-colors hover:bg-white/5 rounded-full"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            )}

                            <div className="text-center mb-8 md:mb-12">
                                <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">SPOTIFY BETA ONBOARDING</span>
                                <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 tracking-tighter text-white">
                                    {step === 1 ? "Welcome to the Journey" : "Choose Your Path"}
                                </h2>
                                <p className="text-text-subdued text-base md:text-lg max-w-md mx-auto font-medium leading-relaxed">
                                    {step === 1 
                                        ? "Before we begin, tell us your name to personalize your experience."
                                        : "Select a goal-oriented journey. We'll interleave music and logic to keep you on track."}
                                </p>
                            </div>

                            {step === 1 ? (
                                <motion.form 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onSubmit={handleNameSubmit}
                                    className="max-w-md mx-auto space-y-6"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                            <User className="w-5 h-5 text-text-subdued" />
                                        </div>
                                        <input
                                            type="text"
                                            value={nameInput}
                                            onChange={(e) => setNameInput(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg font-bold focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
                                            autoFocus
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!nameInput.trim()}
                                        className="w-full bg-primary text-black py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                                    >
                                        <span>CONTINUE</span>
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-8"
                                >
                                    {PATHS.map((path) => (
                                        <button
                                            key={path.id}
                                            onClick={() => handlePathSelect(path.id)}
                                            className="group relative bg-white/5 p-6 md:p-8 rounded-[24px] border border-transparent hover:border-white/20 hover:bg-white/10 transition-all duration-500 text-left hover:scale-[1.02] shadow-xl overflow-hidden"
                                        >
                                            <div className={cn("w-14 h-14 rounded-2xl shadow-lg flex-shrink-0 flex items-center justify-center mb-6 transition-transform group-hover:scale-110", path.color)}>
                                                <Check className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <div className="relative z-10">
                                                <h3 className="text-xl md:text-2xl font-black mb-2 tracking-tight group-hover:text-primary transition-colors text-white">{path.title}</h3>
                                                <p className="text-text-subdued text-xs md:text-sm font-medium leading-relaxed">{path.description}</p>
                                            </div>
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                                        </button>
                                    ))}
                                </motion.div>
                            )}

                            <div className="mt-12 text-center">
                                <div className="inline-flex gap-2 items-center px-4 py-2 bg-white/5 rounded-full border border-white/5">
                                    <div className={cn("w-2 h-2 rounded-full transition-all duration-500", step === 1 ? "bg-primary w-6" : "bg-white/20")} />
                                    <div className={cn("w-2 h-2 rounded-full transition-all duration-500", step === 2 ? "bg-primary w-6" : "bg-white/20")} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
