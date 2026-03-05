import React from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { JourneyPath } from '../context/JourneyContext';
import { useJourney } from '../context/JourneyContext';
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
    const { startJourney } = useJourney();

    const handleSelect = (path: JourneyPath) => {
        startJourney(path);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-background-elevated w-full max-w-2xl rounded-xl shadow-modal overflow-hidden border border-zinc-800"
                    >
                        <div className="relative p-8">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-text-subdued hover:text-text-base transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="text-center mb-10">
                                <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Choose Your Path</h2>
                                <p className="text-text-subdued text-lg max-w-md mx-auto">
                                    Select a goal-oriented journey. We'll interleave music and logic to keep you on track.
                                </p>
                            </div>

                            <div className="grid gap-4">
                                {PATHS.map((path) => (
                                    <button
                                        key={path.id}
                                        onClick={() => handleSelect(path.id)}
                                        className="flex items-center gap-6 p-6 bg-zinc-900/50 hover:bg-zinc-800 transition-all rounded-lg border border-transparent hover:border-primary/50 group text-left"
                                    >
                                        <div className={cn("w-16 h-16 rounded-md shadow-lg flex-shrink-0 flex items-center justify-center", path.color)}>
                                            <Check className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-1">{path.title}</h3>
                                            <p className="text-text-subdued text-sm line-clamp-2">{path.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 text-center text-xs text-text-subdued uppercase tracking-widest font-bold">
                                Design Verified • Spotify Journeys v1.0
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
