import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJourney } from '../context/JourneyContext';
import type { JourneyPath } from '../context/JourneyContext';
import { cn } from '../utils/cn';

const PATHS: { id: JourneyPath; title: string; description: string; color: string }[] = [
    {
        id: 'Deep Focus',
        title: 'Deep Focus',
        description: 'Ambient textures and lo-fi beats mixed with productivity podcasts.',
        color: 'bg-blue-500'
    },
    {
        id: 'Mindful Morning',
        title: 'Mindful Morning',
        description: 'Acoustic tracks paired with 5-minute guided meditation snippets.',
        color: 'bg-orange-500'
    },
    {
        id: 'Hype & Energy',
        title: 'Hype & Energy',
        description: 'High-BPM electronic music and motivational athlete stories.',
        color: 'bg-primary'
    }
];

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
    const { selectCategory } = useJourney();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-background-elevated w-full max-w-4xl rounded-[24px] shadow-modal overflow-hidden border border-white/5"
                    >
                        <div className="relative p-12">
                            <button
                                onClick={onClose}
                                className="absolute top-8 right-8 p-3 text-text-subdued hover:text-text-base transition-colors hover:bg-white/5 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="text-center mb-12">
                                <span className="text-primary font-black uppercase tracking-[0.4em] text-xs mb-4 block">Personal Growth</span>
                                <h2 className="text-5xl font-black mb-4 tracking-tighter">Choose Your Path</h2>
                                <p className="text-text-subdued text-lg max-w-md mx-auto font-medium">
                                    Select a goal-oriented journey. We'll interleave music and logic to keep you on track.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {PATHS.map((path) => (
                                    <button
                                        key={path.id}
                                        onClick={() => {
                                            selectCategory(path.id);
                                            onClose();
                                        }}
                                        className="group relative bg-[#181818] p-8 rounded-[20px] border border-transparent hover:border-white/10 hover:bg-[#282828] transition-all duration-500 text-left hover:scale-[1.02] shadow-xl"
                                    >
                                        <div className={cn("w-16 h-16 rounded-xl shadow-lg flex-shrink-0 flex items-center justify-center mb-6 transition-transform group-hover:scale-110", path.color)}>
                                            <Check className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black mb-2 tracking-tight group-hover:text-primary transition-colors">{path.title}</h3>
                                            <p className="text-text-subdued text-sm font-medium leading-relaxed">{path.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-12 text-center text-[10px] text-text-subdued uppercase tracking-[0.3em] font-black opacity-50">
                                Powered by Spotify Journeys Algorithm
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
