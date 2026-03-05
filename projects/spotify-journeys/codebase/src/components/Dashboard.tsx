import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Clock, ListMusic, X, Play } from 'lucide-react';
import { useSpotify } from '../hooks/useSpotify';
import { useJourney } from '../context/JourneyContext';
import { spotifyService } from '../services/spotifyService';
import type { JourneyPath } from '../context/JourneyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonLoader } from './SkeletonLoader';
import { NowPlayingSidebar } from './NowPlayingSidebar';

export const Dashboard: React.FC = () => {
    const { featuredPlaykits, categories } = useSpotify();
    const { state, selectCategory, setActiveFilter, playTrack } = useJourney();
    const [podcastSections, setPodcastSections] = useState<{ title: string; items: any[] }[]>([]);
    const [musicSections, setMusicSections] = useState<{ title: string; items: any[] }[]>([]);
    const [allSections, setAllSections] = useState<{ title: string; items: any[] }[]>([]);
    const [audiobookSections, setAudiobookSections] = useState<{ title: string; items: any[] }[]>([]);
    const [artistsList, setArtistsList] = useState<{ title: string; items: any[] }[]>([]);
    const [recentTracks, setRecentTracks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const scrollRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
    const activeFilter = state.activeFilter;

    useEffect(() => {
        const fetchSections = async () => {
            setIsLoading(true);
            // Artificial delay for premium skeleton feel
            const delay = new Promise(resolve => setTimeout(resolve, 800));

            try {
                if (activeFilter === 'Podcasts') {
                    const sections = [
                        { title: "English Learning", query: "english learning" },
                        { title: "Self Improvement", query: "self improvement hindi" },
                        { title: "Productivity", query: "productivity" }
                    ];
                    const results = await Promise.all(sections.map(async s => ({
                        title: s.title,
                        items: await spotifyService.getPodcasts(s.query)
                    })));
                    setPodcastSections(results.map(r => ({
                        title: r.title,
                        items: r.items.map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            description: p.publisher,
                            image: p.image,
                            previewUrl: p.audioPreviewUrl
                        }))
                    })));
                } else if (activeFilter === 'Music') {
                    const music = [
                        { title: "Trending in India", query: "india trending" },
                        { title: "Focus Music", query: "focus" },
                        { title: "Bollywood Hits", query: "bollywood 2024" },
                        { title: "Workout Energy", query: "workout energy" }
                    ];
                    const results = await Promise.all(music.map(async m => ({
                        title: m.title,
                        items: await spotifyService.searchTracks(m.query)
                    })));
                    setMusicSections(results.map(r => ({
                        title: r.title,
                        items: r.items.map((track: any) => ({
                            id: track.id,
                            name: track.name,
                            description: track.artist,
                            image: track.albumArt,
                            previewUrl: track.previewUrl
                        }))
                    })));
                } else if (activeFilter === 'All') {
                    const favoritesResult = await spotifyService.searchTracks("india top hits");
                    setAllSections([
                        { title: "Trending Now", items: featuredPlaykits.map(p => ({ ...p, image: p.image || "/album-placeholder.png" })) },
                        { title: "Your Favorites", items: favoritesResult.map(t => ({ id: t.id, name: t.name, description: t.artist, image: t.albumArt, previewUrl: t.previewUrl })) }
                    ]);

                    if (state.recentlyPlayed && state.recentlyPlayed.length > 0) {
                        const recent = await spotifyService.getTracksByIds(state.recentlyPlayed.slice(0, 6));
                        setRecentTracks(recent.map(t => ({ id: t.id, name: t.name, image: t.albumArt, previewUrl: t.previewUrl, artist: t.artist })));
                    }
                } else if (activeFilter === 'Artists') {
                    const artists = await spotifyService.searchArtists("top artists 2024");
                    setArtistsList([{ title: "Recommended Artists", items: artists }]);
                } else if (activeFilter === 'Audiobooks') {
                    const result = await spotifyService.searchTracks("audiobook story");
                    setAudiobookSections([{ title: "Popular Audiobooks", items: result.map(t => ({ ...t, description: "Audiobook • Narrated" })) }]);
                }
                await delay;
            } finally {
                setIsLoading(false);
            }
        };
        fetchSections();
    }, [activeFilter, state.recentlyPlayed, featuredPlaykits]);

    const getHeroContent = () => {
        switch (activeFilter) {
            case 'Podcasts':
                return {
                    title: "The Ranveer Show",
                    subtitle: "New Episode Available",
                    description: "Deep dive into spirituality, health, and business with India's biggest podcast host.",
                    image: "https://i.scdn.co/image/ab6765630000ba8a75e0766324d5598ba9f67a21",
                    color: "from-blue-900 via-indigo-900 to-black"
                };
            case 'Audiobooks':
                return {
                    title: "Atomic Habits",
                    subtitle: "Trending in Productivity",
                    description: "Learn how tiny changes can lead to remarkable results with James Clear's masterpiece.",
                    image: "https://i.scdn.co/image/ab67616d0000b273760920a67111fc2971578332",
                    color: "from-orange-900 via-red-900 to-black"
                };
            case 'Artists':
                return {
                    title: "Arijit Singh",
                    subtitle: "Artist Spotlight",
                    description: "Explore the soul-stirring discography of India's most beloved playback singer.",
                    image: "https://i.scdn.co/image/ab6761610000e5eb12a45019a58957bfaf373305",
                    color: "from-neutral-800 via-stone-900 to-black"
                };
            default:
                return {
                    title: "English Builder",
                    subtitle: "New Journey Release",
                    description: "Master 500+ high-frequency English words used in professional and social settings in India.",
                    image: categories[0]?.icons?.[0]?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop",
                    color: "from-primary via-primary-hover to-green-900"
                };
        }
    };

    const hero = getHeroContent();

    const scroll = (title: string, direction: 'left' | 'right') => {
        const el = scrollRefs.current[title];
        if (el) {
            const scrollAmount = direction === 'left' ? -el.offsetWidth : el.offsetWidth;
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const renderCardRow = (title: string, items: any[]) => (
        <section key={title} className="mb-12 group/row relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold hover:underline cursor-pointer">{title}</h3>
                <div className="flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                    <button onClick={() => scroll(title, 'left')} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full border border-white/5"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={() => scroll(title, 'right')} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full border border-white/5"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>
            <div
                ref={el => { if (el) scrollRefs.current[title] = el; }}
                className="flex gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x"
            >
                {isLoading ? (
                    <SkeletonLoader type="row" />
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-all duration-300 cursor-pointer group flex flex-col items-start gap-3 min-w-[200px] max-w-[200px] border border-transparent hover:border-white/5 snap-start"
                        >
                            <div className="w-full aspect-square relative shadow-lg rounded-lg overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); playTrack(item); }}
                                        className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all text-black"
                                    >
                                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <div className="font-bold text-sm text-white truncate">{item.name}</div>
                                <div className="text-text-subdued text-xs line-clamp-2 mt-1">{item.description}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );

    return (
        <div className="flex flex-col h-full w-full overflow-hidden flex-1 bg-black rounded-lg mt-2 mr-2 mb-2">
            {/* Top Navbar = fixed height, flex-shrink-0, never compresses */}
            <header className="flex-shrink-0 z-10 sticky top-0 bg-[#1a1a1a] px-6 py-4 flex items-center justify-between border-b border-white/5 rounded-t-lg">
                <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                        <button className="bg-black/40 p-1.5 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                        <button className="bg-black/40 p-1.5 rounded-full opacity-50"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="What do you want to play?"
                            className="bg-[#242424] rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-white transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <nav className="flex gap-6 text-xs font-bold text-text-subdued">
                        {['All', 'Music', 'Podcasts', 'Audiobooks', 'Artists', 'Journeys'].map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`hover:text-white transition-colors pb-1 border-b-2 ${activeFilter === f ? 'text-white border-primary' : 'border-transparent'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Main content area below navbar = flex flex-row flex-1 overflow-hidden */}
            <div className="flex flex-row flex-1 overflow-hidden pt-2">
                {/* Center content column with min-w-0 */}
                <main className="flex-1 min-w-0 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#1a1a1a] to-black rounded-lg relative">
                    <div className="p-6 space-y-10">
                        {/* Hero Release Section */}
                        {activeFilter !== 'Journeys' && (
                            <>
                                {isLoading ? (
                                    <SkeletonLoader type="hero" />
                                ) : (
                                    <section className="relative w-full h-[320px] rounded-2xl overflow-hidden group shadow-2xl">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${hero.color}`} />
                                        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />

                                        <div className="relative h-full flex items-center p-10 md:p-14">
                                            <div className="flex-1 space-y-6">
                                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">{hero.subtitle}</span>
                                                <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">{hero.title}</h1>
                                                <p className="text-sm md:text-base text-white/80 max-w-md font-medium leading-relaxed">
                                                    {hero.description}
                                                </p>
                                                <div className="flex items-center gap-6">
                                                    <button
                                                        onClick={() => selectCategory("English Vocabulary Builder")}
                                                        className="bg-white text-black px-8 py-3 rounded-full font-black text-sm flex items-center gap-2 hover:scale-105 transition-all shadow-2xl"
                                                    >
                                                        <Play size={18} fill="black" />
                                                        <span>Start Now</span>
                                                    </button>
                                                    <div className="flex items-center gap-4 text-[10px] font-black text-white/60 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><ListMusic size={14} /> <span>Premium Content</span></span>
                                                        <span className="flex items-center gap-1.5"><Clock size={14} /> <span>12h Mastered</span></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative hidden lg:block">
                                                <img
                                                    src={hero.image}
                                                    alt="hero"
                                                    className="w-72 h-72 object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-6 group-hover:rotate-0 transition-transform duration-700 border-4 border-white/10"
                                                />
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </>
                        )}

                        {/* Good Morning / Recently Played Grid */}
                        {activeFilter === 'All' && (
                            <section className="space-y-6">
                                <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                    <span>☀️ Good morning, Marc</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {recentTracks.length > 0 ? (
                                        recentTracks.map((item, i) => (
                                            <div key={i} className="flex items-center bg-white/5 hover:bg-white/10 transition-all rounded-lg overflow-hidden group cursor-pointer border border-white/5">
                                                <div className="w-20 h-20 bg-neutral-800 flex-shrink-0 relative">
                                                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button onClick={(e) => { e.stopPropagation(); playTrack(item); }} className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black shadow-xl">
                                                            <Play className="w-5 h-5 fill-current" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="font-bold text-sm text-white truncate">{item.name}</span>
                                                        <span className="text-[8px] bg-primary text-black font-black px-1 py-0.5 rounded-sm shrink-0">MASTERED</span>
                                                    </div>
                                                    <span className="text-xs text-text-subdued truncate">{item.artist}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Fallback items from categories if no recent history
                                        categories.slice(0, 6).map((cat, i) => (
                                            <div key={i} className="flex items-center bg-white/5 hover:bg-white/10 transition-all rounded-lg overflow-hidden group cursor-pointer border border-white/5">
                                                <div className="w-16 h-16 bg-neutral-800 flex-shrink-0">
                                                    <img src={cat.icons?.[0]?.url} className="w-full h-full object-cover" alt={cat.name} />
                                                </div>
                                                <div className="flex-1 p-4">
                                                    <span className="font-bold text-sm text-white truncate block">{cat.name}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Vertical Rows Contextual Sections */}
                        <div className="space-y-4">
                            {activeFilter === 'Music' && musicSections.map(s => renderCardRow(s.title, s.items))}
                            {activeFilter === 'Podcasts' && podcastSections.map(s => renderCardRow(s.title, s.items))}
                            {activeFilter === 'All' && allSections.map(s => renderCardRow(s.title, s.items))}
                            {activeFilter === 'Audiobooks' && audiobookSections.map(s => renderCardRow(s.title, s.items))}
                            {activeFilter === 'Artists' && artistsList.map(s => renderCardRow(s.title, s.items))}

                            {/* Journeys Grid section */}
                            {activeFilter === 'Journeys' && (
                                <section className="space-y-6">
                                    <h2 className="text-xl font-bold">Recommended Journeys</h2>
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                        {categories.map((cat, i) => (
                                            <div
                                                key={cat.id}
                                                onClick={() => selectCategory(cat.name as JourneyPath)}
                                                className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-all group border border-transparent hover:border-white/5 cursor-pointer"
                                            >
                                                <div className={`aspect-square bg-gradient-to-br ${i % 2 === 0 ? 'from-blue-600 to-indigo-900' : 'from-orange-600 to-red-900'} rounded-lg mb-4 relative flex items-end p-4 shadow-lg overflow-hidden`}>
                                                    <img src={cat.icons?.[0]?.url} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt={cat.name} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                                    <span className="relative font-black text-xl drop-shadow-md text-white">{cat.name}</span>
                                                    <button className="absolute right-3 bottom-3 p-3 bg-primary rounded-full text-black shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                        <Play fill="black" size={20} />
                                                    </button>
                                                </div>
                                                <h3 className="font-bold text-sm mb-1 truncate">{cat.name}</h3>
                                                <p className="text-[10px] text-text-subdued uppercase tracking-widest font-bold">Active Path</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>
                </main>

                {/* Right panel inside that row = flex-shrink-0 with fixed width */}
                {activeFilter !== 'Journeys' && (
                    <div className="flex-shrink-0 w-[340px] h-full ml-2">
                        <NowPlayingSidebar />
                    </div>
                )}
            </div>
        </div>
    );
};
