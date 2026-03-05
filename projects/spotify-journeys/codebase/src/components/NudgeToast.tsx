import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

interface NudgeToastProps {
    show: boolean;
    message: string;
    onClose: () => void;
}

export const NudgeToast: React.FC<NudgeToastProps> = ({ show, message, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-8 right-8 z-[200]"
                >
                    <div className="bg-white text-black p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 min-w-[300px] border border-white/20">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-black text-sm uppercase tracking-wider">Keep it up!</p>
                            <p className="text-zinc-600 text-sm font-bold">{message}</p>
                        </div>
                        <button onClick={onClose} className="text-zinc-400 hover:text-black transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
