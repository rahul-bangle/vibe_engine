import React from 'react';
import { Share2, CheckCircle2, MoreHorizontal, Mic2, ListMusic, MonitorSpeaker, Volume2, Maximize2 } from 'lucide-react';
import { useJourney } from '../hooks/useJourney';
import { motion } from 'framer-motion';

export const NowPlayingSidebar: React.FC = () => {
    const { state } = useJourney();

    // Use the playing track, or fallback to a default premium-looking placeholder
    const track = state.globalTrack || {
        name: "Welcome to Spotify Learning",
        artist: "Language Mastery Journey",
        description: "Start your journey",
        image: "/language_mastery_hero.png", 
        credits: [
            { name: "Global Academy", role: "Learning Content Creator" }
        ]
    } as any;

    return (
        <aside className="w-full h-full bg-[#121212] flex flex-col overflow-y-auto no-scrollbar font-sans rounded-xl border border-white/5">
            <div className="p-4 space-y-6 flex-1">
                {/* Visual Section */}
                <div className="relative group">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-[3/4] rounded-xl overflow-hidden shadow-2xl relative"
                    >
                        <img
                            src={track.image || track.albumArt}
                            alt={track.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        <div className="absolute bottom-6 left-6 right-6 space-y-2">
                            <h2 className="text-2xl font-black text-white tracking-tighter drop-shadow-lg leading-tight">{track.name}</h2>
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-white/90 drop-shadow-md">{track.artist || track.description}</p>
                                <div className="flex items-center gap-3">
                                    <Share2 size={18} className="text-white/80 hover:text-white cursor-pointer" />
                                    <CheckCircle2 size={18} className="text-[#1ed760] fill-current drop-shadow-md" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Credits Section */}
                <div className="bg-[#181818] rounded-xl p-5 space-y-5 border border-white/10 hover:bg-[#282828] transition-colors">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-black uppercase tracking-widest text-white">Credits</span>
                        <button className="text-[10px] font-black uppercase text-text-subdued hover:text-white transition-colors">Show all</button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between group/credit">
                            <div>
                                <p className="text-sm font-bold text-white group-hover/credit:underline cursor-pointer">{track.artist?.split(',')[0] || "Main Artist"}</p>
                                <p className="text-[10px] text-text-subdued font-medium tracking-wide">Main Artist • Composer</p>
                            </div>
                            <button className="px-4 py-1.5 rounded-full border border-white/20 text-[10px] text-white font-black hover:scale-105 hover:border-white active:scale-95 transition-all uppercase tracking-wider">Follow</button>
                        </div>
                        {track.artist?.includes(',') && (
                            <div className="flex items-center justify-between group/credit">
                                <div>
                                    <p className="text-sm font-bold text-white group-hover/credit:underline cursor-pointer">{track.artist.split(',')[1].trim()}</p>
                                    <p className="text-[10px] text-text-subdued font-medium tracking-wide">Featured Artist</p>
                                </div>
                                <button className="px-4 py-1.5 rounded-full border border-white/20 text-[10px] text-white font-black hover:scale-105 hover:border-white active:scale-95 transition-all uppercase tracking-wider">Follow</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Next in Queue / Up Next */}
                <div className="bg-[#181818] rounded-xl p-5 border border-white/10 flex items-center justify-between hover:bg-[#282828] cursor-pointer transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center group-hover:bg-neutral-700 transition-colors">
                            <ListMusic size={20} className="text-text-subdued group-hover:text-white transition-colors" />
                        </div>
                        <div>
                            <p className="text-[10px] text-text-subdued font-black uppercase tracking-widest">Next in queue</p>
                            <p className="text-xs font-bold text-white">{state.recentlyPlayed?.length ? "View your history" : "View your playlist"}</p>
                        </div>
                    </div>
                    <MoreHorizontal size={18} className="text-text-subdued group-hover:text-white transition-colors" />
                </div>
            </div>

            {/* Bottom Utilities */}
            <div className="p-6 bg-[#181818] flex items-center justify-between text-text-subdued rounded-b-xl mt-auto border-t border-white/5">
                <div className="flex items-center gap-4">
                    <Mic2 size={18} className="hover:text-white cursor-pointer transition-colors" />
                    <ListMusic size={18} className="hover:text-white cursor-pointer transition-colors" />
                    <MonitorSpeaker size={18} className="hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="flex items-center gap-4 flex-1 justify-end ml-4">
                    <Volume2 size={18} className="hover:text-white cursor-pointer transition-colors shrink-0" />
                    <div className="w-20 h-1 bg-neutral-800 rounded-full relative overflow-hidden group/vol cursor-pointer">
                        <div className="absolute inset-y-0 left-0 bg-[#1ed760] w-2/3 opacity-80 group-hover/vol:opacity-100 transition-all" />
                    </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                    <Maximize2 size={18} className="hover:text-white cursor-pointer transition-colors" />
                </div>
            </div>
        </aside>
    );
};

