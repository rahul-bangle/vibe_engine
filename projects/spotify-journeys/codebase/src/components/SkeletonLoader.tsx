import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonLoader: React.FC<{ type: 'hero' | 'grid' | 'row' }> = ({ type }) => {
    const shimmer = {
        initial: { backgroundPosition: '-200% 0' },
        animate: {
            backgroundPosition: '200% 0',
            transition: {
                repeat: Infinity,
                duration: 1.5,
                ease: "linear" as const
            }
        }
    };

    const baseClass = "bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 bg-[length:200%_100%] rounded-xl shadow-inner";

    if (type === 'hero') {
        return (
            <motion.div
                {...shimmer}
                className={`w-full h-[320px] ${baseClass}`}
            />
        );
    }

    if (type === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <motion.div key={i} {...shimmer} className={`h-20 ${baseClass}`} />
                ))}
            </div>
        );
    }

    return (
        <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col gap-3 min-w-[200px]">
                    <motion.div {...shimmer} className={`aspect-square ${baseClass}`} />
                    <motion.div {...shimmer} className={`h-4 w-3/4 ${baseClass}`} />
                    <motion.div {...shimmer} className={`h-3 w-1/2 ${baseClass}`} />
                </div>
            ))}
        </div>
    );
};
