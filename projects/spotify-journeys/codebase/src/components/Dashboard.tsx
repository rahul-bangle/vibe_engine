import React, { useState } from 'react';
import { Search, Bell, Users, User, Play, Info, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { useSpotify } from '../hooks/useSpotify';
import { useJourney } from '../context/JourneyContext';
import type { JourneyPath } from '../context/JourneyContext';

export const Dashboard: React.FC = () => {
    const { featuredPlaykits, categories } = useSpotify();
    const { startJourney } = useJourney();
    const [activeFilter, setActiveFilter] = useState('All');

    const filters = ['All', 'Music', 'Podcasts'];

    // Placeholder hero data inspired by the Stitch design
    const heroContent = {
        name: "Balam Pichkari",
        artist: "Vishal Dadlani, Shalmali Kholgade",
        image: "/hero-image.png", // High-res artwork generated locally
        description: "Unleash your creativity with hits that keep you moving."
    };

    return (
        <main className="flex-1 bg-background-base rounded-lg mt-2 mr-2 mb-2 overflow-y-auto shadow-inner relative custom-scrollbar">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            {/* High-Fidelity Header */}
            <div className="sticky top-0 z-50 bg-background-base/80 backdrop-blur-md p-4 flex items-center justify-between gap-4 border-b border-white/5">
                <div className="flex-1 max-w-md relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-subdued group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="What do you want to play?"
                        className="w-full bg-background-elevated border-none rounded-full py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-white/20 transition-all placeholder:text-text-subdued"
                    />
                </div>

                <div className="flex items-center gap-4 text-text-subdued font-bold text-sm">
                    <button className="hover:text-white hover:scale-105 transition-all hidden lg:block">Explore Premium</button>
                    <button className="hover:text-white hover:scale-105 transition-all hidden lg:block">Install App</button>
                    <div className="flex items-center gap-2 ml-2">
                        <button className="p-2 hover:bg-background-highlight rounded-full transition-colors"><Bell className="w-5 h-5" /></button>
                        <button className="p-2 hover:bg-background-highlight rounded-full transition-colors"><Users className="w-5 h-5" /></button>
                        <button className="w-8 h-8 bg-background-elevated rounded-full flex items-center justify-center hover:scale-105 transition-all border border-white/5">
                            <User className="w-5 h-5 text-text-base" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8">
                {/* Filters */}
                <div className="flex gap-2 mb-8">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeFilter === filter
                                ? "bg-white text-black"
                                : "bg-background-elevated text-text-base hover:bg-background-highlight"
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Hero / Immersive Section */}
                <section className="mb-12 relative h-[420px] rounded-3xl overflow-hidden group shadow-2xl">
                    <img
                        src={heroContent.image}
                        alt={heroContent.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-12 w-full flex items-end justify-between">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-primary/20 text-primary p-1 rounded-md"><CheckCircle2 className="w-5 h-5" /></span>
                                <span className="font-black text-xs uppercase tracking-[0.2em] text-primary">Featured Journey</span>
                            </div>
                            <h2 className="text-6xl font-black mb-4 tracking-tighter leading-none">{heroContent.name}</h2>
                            <p className="text-xl text-white/90 font-medium mb-8 leading-relaxed line-clamp-2">
                                {heroContent.description}
                            </p>
                            <div className="flex items-center gap-4">
                                <button className="bg-primary text-black px-10 py-4 rounded-full font-black text-lg hover:bg-primary-hover hover:scale-105 transition-all shadow-xl flex items-center gap-2">
                                    <Play className="fill-current w-6 h-6" /> Play Now
                                </button>
                                <button className="p-4 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all">
                                    <Info className="w-6 h-6" />
                                </button>
                                <button className="p-4 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all">
                                    <MoreHorizontal className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid Sections */}
                <div className="space-y-16">
                    {/* Trending Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black tracking-tight">Trending Now</h3>
                            <button className="text-text-subdued hover:text-white font-bold text-sm tracking-wider uppercase">Show all</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {featuredPlaykits.slice(0, 5).map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-colors duration-300 cursor-pointer group flex flex-col items-start gap-4"
                                >
                                    <div className="w-full aspect-square relative shadow-[0_8px_24px_rgba(0,0,0,0.5)] rounded-md">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-md" />

                                        {/* Classic Spotify Play Button */}
                                        <div className="absolute bottom-2 right-2 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out z-10">
                                            <button className="w-12 h-12 bg-[#1ed760] rounded-full flex items-center justify-center shadow-xl hover:scale-105 hover:bg-[#3be477] transition-all">
                                                <Play className="w-6 h-6 text-black fill-current translate-x-0.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="font-bold text-base text-white truncate">{item.name}</div>
                                        <div className="text-[#b3b3b3] text-sm font-medium line-clamp-2 leading-snug">{item.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Browse Categories */}
                    <section className="pb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-black tracking-tight">Browse All</h3>
                            <button className="text-text-subdued hover:text-white font-bold text-sm tracking-wider uppercase">Show all</button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="bg-[#181818] rounded-[16px] hover:bg-[#282828] transition-colors duration-300 cursor-pointer group h-[320px] relative overflow-hidden"
                                    onClick={() => startJourney(cat.name as JourneyPath)}
                                >
                                    {/* Text at top left, constrained width to force wrap */}
                                    <h3
                                        className="absolute top-5 left-5 text-[28px] font-bold tracking-tighter text-white leading-[1] max-w-[65%] break-words"
                                    >
                                        {cat.name}
                                    </h3>

                                    {/* Image centered at bottom */}
                                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[75%] aspect-square">
                                        <img
                                            src={cat.icons[0].url}
                                            alt={cat.name}
                                            className="w-full h-full object-cover rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};
