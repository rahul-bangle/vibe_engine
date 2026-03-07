import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquarePlus, ArrowRight } from 'lucide-react';

interface FeedbackCardProps {
    onClick: () => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="group relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] border border-white/5 rounded-3xl p-6 cursor-pointer"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <MessageSquarePlus className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                        <MessageSquarePlus className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Refine the Experience</h3>
                    <p className="text-white/40 text-sm mb-6 leading-relaxed">
                        Your testing helps us build a better experience. Tell us what's working and what's not.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    Give Feedback
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>

            {/* Premium Glow effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-primary/20 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
        </motion.div>
    );
};
