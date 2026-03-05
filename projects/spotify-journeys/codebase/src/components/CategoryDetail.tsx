import React from 'react';
import { motion } from 'framer-motion';
import { Play, Star, ArrowLeft, Share2, CheckCircle2 } from 'lucide-react';
import { useJourney } from '../context/JourneyContext';
import { useSpotify } from '../hooks/useSpotify';

export const CategoryDetail: React.FC = () => {
    const { state, startJourney, resetJourney } = useJourney();
    const { categories } = useSpotify();

    const category = categories.find(c => c.name === state.currentPath);

    if (!category) return null;

    const benefits = state.currentPath === 'English Vocabulary Builder'
        ? [
            "Learn 20+ new corporate words daily",
            "Perfect pronunciation with audio guides",
            "Contextual usage in professional emails",
            "Interactive daily recall quizzes"
        ]
        : state.currentPath === 'Communication Skills'
            ? [
                "Master active listening techniques",
                "Learn to lead meetings in English",
                "Body language and vocal tonality",
                "Conflict resolution frameworks"
            ]
            : [
                "Time-blocking and deep work habits",
                "Email management strategies",
                "Building a second brain (PKM)",
                "Ending procrastination loops"
            ];

    const sequence = state.currentPath === 'English Vocabulary Builder'
        ? [
            { label: "Word of the Day", desc: "Setting the focus for today's vocab", dur: "2m" },
            { label: "Pronunciation Drill", desc: "Listen and repeat with the guide", dur: "10m" },
            { label: "Contextual Story", desc: "Vocab used in a real-world story", dur: "15m" },
            { label: "Quick Review", desc: "Consolidate today's learning", dur: "3m" },
        ]
        : [
            { label: "Mindset Intro", desc: "Preparing your mind for growth", dur: "2m" },
            { label: "Skill Deep Dive", desc: "Expert walkthrough of the concept", dur: "15m" },
            { label: "Practice Session", desc: "Guided exercises and drills", dur: "10m" },
            { label: "Daily Reflection", desc: "Tracking your personal progress", dur: "3m" },
        ];

    return (
        <main className="flex-1 bg-background-base rounded-lg mt-2 mr-2 mb-2 overflow-y-auto shadow-inner relative custom-scrollbar">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />

            <div className="p-8">
                <button
                    onClick={resetJourney}
                    className="flex items-center gap-2 text-text-subdued hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-xs">Back to Dashboard</span>
                </button>

                <div className="flex flex-col md:flex-row gap-12 items-end mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-64 h-64 shrink-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10"
                    >
                        <img src={category.icons?.[0]?.url} alt={category.name} className="w-full h-full object-cover" />
                    </motion.div>

                    <div className="flex-1">
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-2 block">Learning Journey</span>
                        <h1 className="text-6xl font-black tracking-tighter mb-6 leading-none">{category.name}</h1>
                        <p className="text-text-subdued text-xl max-w-2xl mb-8 font-medium leading-relaxed">
                            {state.currentPath === 'English Vocabulary Builder'
                                ? "Accelerate your professional growth with a structured path to mastering high-impact English vocabulary used in Indian corporate environments."
                                : state.currentPath === 'Communication Skills'
                                    ? "Become a more confident and effective communicator. Master the art of public speaking, active listening, and persuasive storytelling."
                                    : "Supercharge your productivity with scientifically-backed habits used by the world's most effective learners and professionals."}
                        </p>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={startJourney}
                                className="bg-primary hover:bg-primary-hover text-black px-10 py-4 rounded-full font-black text-lg hover:scale-105 transition-all shadow-[0_10px_30px_rgba(29,185,84,0.3)] flex items-center gap-3"
                            >
                                <Play className="fill-current w-6 h-6" />
                                START TODAY'S SESSION
                            </button>
                            <button className="p-4 rounded-full border border-white/10 hover:bg-white/5 hover:scale-105 transition-all">
                                <Share2 className="w-6 h-6 text-text-subdued" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-background-elevated p-8 rounded-3xl border border-white/5 shadow-xl">
                            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                <CheckCircle2 className="text-primary w-6 h-6" />
                                Learning Outcomes
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {benefits.map((benefit, i) => (
                                    <div key={i} className="flex gap-4 items-start p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                            <div className="w-2 h-2 rounded-full bg-primary" />
                                        </div>
                                        <span className="font-bold text-sm text-text-base">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-background-elevated p-8 rounded-3xl border border-white/5 shadow-xl">
                            <h2 className="text-2xl font-black mb-6">Course Material</h2>
                            <div className="space-y-4">
                                {sequence.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-xl transition-colors group border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <span className="text-text-subdued font-bold w-4 text-sm">{i + 1}</span>
                                            <div>
                                                <p className="font-bold group-hover:text-primary transition-colors">{item.label}</p>
                                                <p className="text-xs text-text-subdued">{item.desc}</p>
                                            </div>
                                        </div>
                                        <span className="text-sm text-text-subdued font-medium">{item.dur}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-primary/10 border border-primary/20 p-8 rounded-3xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                            <div className="relative z-10">
                                <h3 className="text-primary font-black uppercase tracking-widest text-[10px] mb-4">Journey Stats</h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-text-subdued text-[10px] font-black uppercase">Success Rate</span>
                                            <span className="text-primary text-xs font-black">85%</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full w-[85%] transition-all duration-1000" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-4xl font-black block">4.9</span>
                                            <span className="text-text-subdued text-[10px] font-black uppercase">Student Rating</span>
                                        </div>
                                        <div className="flex text-primary gap-0.5">
                                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background-elevated p-8 rounded-3xl border border-white/5 shadow-xl">
                            <h3 className="font-black uppercase tracking-widest text-[10px] mb-4 text-text-subdued">Recommended Tools</h3>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-lg">🎧</div>
                                <div>
                                    <p className="font-bold text-xs">Noise Cancelling</p>
                                    <p className="text-[10px] text-text-subdued">Focus on every syllable</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};
