import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { useJourney } from '../hooks/useJourney';
import { useTracking } from '../hooks/useTracking';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose }) => {
    const { state } = useJourney();
    const { trackEvent } = useTracking();
    const [step, setStep] = useState(1);
    const [rating, setRating] = useState(0);
    const [contentMatch, setContentMatch] = useState<boolean | null>(null);
    const [techIssues, setTechIssues] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Track open
    useEffect(() => {
        if (isOpen) {
            trackEvent('REVIEW_MODAL_OPEN', 'modal');
        }
    }, [isOpen]);

    const handleClose = () => {
        if (!submitted) {
            // Track abandonment with progress metadata
            let progress = 'none';
            if (step === 2) progress = 'step1_complete';
            else if (rating > 0) progress = 'rating_only';

            trackEvent('REVIEW_ABANDONED', 'modal', { 
                last_step: step, 
                progress,
                filled_rating: rating > 0,
                filled_feedback: techIssues.length > 0 || suggestion.length > 0
            });
        }
        
        // Reset state for potential next manual open
        setTimeout(() => {
            setStep(1);
            setRating(0);
            setContentMatch(null);
            setTechIssues('');
            setSuggestion('');
            setSubmitted(false);
        }, 300);
        
        onClose();
    };

    const handleNextStep = () => {
        trackEvent('REVIEW_STEP_COMPLETE', 'step1', { rating });
        setStep(2);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        trackEvent('REVIEW_SUBMIT_START', 'modal');
        try {
            await supabase.from('user_reviews').insert({
                profile_id: state.profileId,
                rating,
                content_match: contentMatch,
                tech_issues: techIssues,
                suggestion
            });
            
            trackEvent('REVIEW_SUCCESSFULLY_SUBMITTED', 'modal', {
                full_completion: true,
                rating
            });

            setSubmitted(true);
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error submitting review:', error);
            trackEvent('REVIEW_SUBMIT_ERROR', 'modal');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-[#121212] border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {!submitted ? (
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-2xl font-black text-white">Review Your Experience</h2>
                                    <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <X className="w-5 h-5 text-white/60" />
                                    </button>
                                </div>

                                {step === 1 && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                        <p className="text-white/60 mb-8">How was your journey so far, {state.userName?.split(' ')[0] || 'friend'}?</p>
                                        <div className="flex justify-between mb-8">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className="p-2 transition-transform active:scale-90"
                                                >
                                                    <Star
                                                        className={`w-10 h-10 ${
                                                            star <= rating ? 'text-primary fill-primary' : 'text-white/20'
                                                        } transition-colors`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            disabled={rating === 0}
                                            onClick={handleNextStep}
                                            className="w-full py-4 bg-white text-black font-bold rounded-full disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                                        >
                                            Next
                                        </button>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                                        <p className="text-white/60 mb-6">Did the music matches your goal?</p>
                                        <div className="flex gap-4 mb-8">
                                            <button
                                                onClick={() => setContentMatch(true)}
                                                className={`flex-1 py-3 rounded-2xl border ${
                                                    contentMatch === true ? 'bg-primary/10 border-primary text-primary' : 'border-white/10 text-white'
                                                } transition-all`}
                                            >
                                                Yes, Perfect
                                            </button>
                                            <button
                                                onClick={() => setContentMatch(false)}
                                                className={`flex-1 py-3 rounded-2xl border ${
                                                    contentMatch === false ? 'bg-primary/10 border-primary text-primary' : 'border-white/10 text-white'
                                                } transition-all`}
                                            >
                                                Not quite
                                            </button>
                                        </div>
                                        <textarea
                                            placeholder="Any tech issues or glitches?"
                                            value={techIssues}
                                            onChange={(e) => setTechIssues(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 mb-6 focus:outline-none focus:border-primary/50"
                                            rows={2}
                                        />
                                        <textarea
                                            placeholder="What feature should we add next?"
                                            value={suggestion}
                                            onChange={(e) => setSuggestion(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 mb-8 focus:outline-none focus:border-primary/50"
                                            rows={3}
                                        />
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="flex-1 py-4 border border-white/10 text-white font-bold rounded-full"
                                            >
                                                Back
                                            </button>
                                            <button
                                                disabled={isSubmitting}
                                                onClick={handleSubmit}
                                                className="flex-[2] py-4 bg-primary text-black font-bold rounded-full flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Complete Review'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle2 className="w-10 h-10 text-primary" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">Thank you, {state.userName?.split(' ')[0]}!</h3>
                                <p className="text-white/60">Your feedback helps us build the perfect Spotify Beta experience.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
