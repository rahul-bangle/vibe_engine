import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useSpotify } from '../hooks/useSpotify';
import { useJourney } from '../hooks/useJourney';
import { spotifyService } from '../services/spotifyService';
import { useTracking } from '../hooks/useTracking';
import { FeedbackCard } from './FeedbackCard';
import { ReviewModal } from './ReviewModal';
import { SkeletonLoader } from './SkeletonLoader';
import { NowPlayingSidebar } from './NowPlayingSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotifyIcon } from './icons/SpotifyIcon';
import { OnboardingPopUp } from './OnboardingPopUp';

export const Dashboard: React.FC = () => {
    const { featuredPlaykits, categories } = useSpotify();
    const { state, selectCategory, setActiveFilter, playTrack, updateOnboardingStep } = useJourney();
    const { trackEvent } = useTracking();
    const [podcastSections, setPodcastSections] = useState<{ title: string; items: any[] }[]>([]);
    const [musicSections, setMusicSections] = useState<{ title: string; items: any[] }[]>([]);
    const [allSections, setAllSections] = useState<{ title: string; items: any[] }[]>([]);
    const [audiobookSections, setAudiobookSections] = useState<{ title: string; items: any[] }[]>([]);
    const [artistsList, setArtistsList] = useState<{ title: string; items: any[] }[]>([]);
    const [recentTracks, setRecentTracks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    const scrollRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});
    const activeFilter = state.activeFilter;

    useEffect(() => {
        const fetchSections = async () => {
            setIsLoading(true);
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
                    } else {
                        // Guaranteed diverse fallback for Desktop as well
                        const queries = ['Blinding Lights', 'Lofi Girl', 'Arijit Singh Hits', 'Die For You', 'Global Top 50', 'Phonk Remix'];
                        const multiResults = await Promise.all(queries.map(q => spotifyService.searchTracks(q)));
                        
                        const combined = multiResults
                            .map(results => results[0])
                            .filter(Boolean)
                            .map(t => ({ id: t.id, name: t.name, image: t.albumArt, previewUrl: t.previewUrl, artist: t.artist }));
                            
                        setRecentTracks(combined.slice(0, 6));
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
                            className="bg-[#181818] p-4 rounded-xl hover:bg-[#282828] transition-all duration-300 cursor-pointer group flex flex-col items-start gap-3 min-w-[160px] max-w-[160px] sm:min-w-[200px] sm:max-w-[200px] border border-transparent hover:border-white/5 snap-start"
                        >
                            <div className="w-full aspect-square relative shadow-lg rounded-lg overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                                    <button
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            playTrack(item); 
                                            trackEvent('PLAY_CONTENT', item.id);
                                        }}
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
        <div className="flex flex-col h-full w-full overflow-hidden flex-1 bg-black rounded-lg mt-2 mr-2 mb-2 relative">
            <AnimatePresence>
                {state.onboardingStep === 'dashboard' && (
                    <OnboardingPopUp onClose={() => updateOnboardingStep('pointing_sidebar')} />
                )}
            </AnimatePresence>

            {state.onboardingStep === 'pointing_start' && (
                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`fixed z-[999] flex items-center gap-3 pointer-events-none text-white ${activeFilter === 'Journeys' ? 'bottom-[120px] left-1/2 -translate-x-1/2 flex-col' : 'left-[260px] top-[400px]'}`}
                >
                    {activeFilter !== 'Journeys' ? (
                        <>
                            <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-primary" />
                            <div className="bg-primary text-black text-[10px] font-black px-4 py-2 rounded-full shadow-[0_0_30px_rgba(29,185,84,0.6)] whitespace-nowrap uppercase tracking-widest">
                                👈 Open Journeys to start
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-primary text-black text-[10px] font-black px-6 py-3 rounded-full shadow-[0_0_50px_rgba(29,185,84,0.6)] whitespace-nowrap uppercase tracking-widest flex items-center gap-2">
                                🚀 Click Voyager or any path to begin!
                            </div>
                            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary" />
                        </>
                    )}
                </motion.div>
            )}
            <header className="flex-shrink-0 z-10 sticky top-0 bg-[#1a1a1a] px-6 py-4 flex items-center justify-between border-b border-white/5 rounded-t-lg overflow-hidden">
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-2">
                        <button className="bg-black/40 p-1.5 rounded-full"><ChevronLeft className="w-5 h-5" /></button>
                        <button className="bg-black/40 p-1.5 rounded-full opacity-50"><ChevronRight className="w-5 h-5" /></button>
                    </div>

                </div>

                <div className="flex items-center gap-6 overflow-hidden ml-4">
                    <nav className="flex gap-6 text-xs font-bold text-text-subdued overflow-x-auto no-scrollbar whitespace-nowrap">
                        {['All', 'Music', 'Podcasts', 'Audiobooks', 'Artists', 'Journeys'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => {
                                    setActiveFilter(filter);
                                    trackEvent('NAV_FILTER', filter);
                                }}
                                className={`hover:text-white transition-colors pb-1 border-b-2 ${activeFilter === filter ? 'text-white border-primary' : 'border-transparent'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <div className="flex flex-row flex-1 overflow-hidden pt-2">
                <main className="flex-1 min-w-0 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#1a1a1a] to-black rounded-lg relative">
                    <div className="p-6 space-y-10">
                        {isLoading ? (
                            <SkeletonLoader type="hero" />
                        ) : (
                            <>
                                {Object.keys(state.completionHistory).length === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-8 p-6 rounded-[2rem] bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(29,185,84,0.3)]">
                                                <SpotifyIcon color="black" size={32} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Evolution Complete!</h3>
                                                <p className="text-primary font-bold text-sm">Congratulations! You've finished your first learning journey.</p>
                                            </div>
                                        </div>
                                        <p className="text-text-subdued text-sm font-medium max-w-sm text-center md:text-right">
                                            Keep leading and listening with Spotify. Your next session is ready whenever you are.
                                        </p>
                                    </motion.div>
                                )}
                                <section className="relative w-full h-[200px] md:h-[260px] rounded-3xl overflow-hidden group shadow-2xl transition-all duration-700 hover:shadow-primary/10">
                                {activeFilter === 'Journeys' ? (
                                    <div className="relative h-full flex flex-col md:flex-row items-center p-5 md:p-10 lg:p-14 gap-8">
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c] via-[#1a1a1a] to-[#2d1e4e]" />
                                        <div className="relative h-full flex flex-col md:flex-row items-center gap-8 z-10">
                                            <div className="flex-1 space-y-6">
                                                <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                                                    LANGUAGE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">SPOTIFY BETA.</span>
                                                </h1>
                                                <p className="text-sm text-white/60 max-w-md font-medium">
                                                    Master 500+ high-frequency English words and improve your professional communication skills.
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        if (state.onboardingStep === 'pointing_start') {
                                                            updateOnboardingStep('playing');
                                                        }
                                                        selectCategory("English Vocabulary Builder");
                                                    }}
                                                    className={`bg-primary text-black px-8 py-3 rounded-full font-black text-xs md:text-sm flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl ${state.onboardingStep === 'pointing_start' ? 'ring-4 ring-primary animate-pulse shadow-[0_0_20px_rgba(29,185,84,0.6)]' : ''}`}
                                                >
                                                    <Play size={20} fill="black" />
                                                    <span>{state.onboardingStep === 'pointing_start' ? 'START FIRST JOURNEY' : 'RESUME LEARNING'}</span>
                                                </button>
                                            </div>
                                            <div className="hidden xl:block">
                                                <img
                                                    src="/language_mastery_hero.png"
                                                    alt="hero"
                                                    className="w-56 h-56 lg:w-64 lg:h-64 object-cover rounded-3xl shadow-2xl border border-white/10"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className={`absolute inset-0 bg-gradient-to-br ${hero.color}`} />
                                        <div className="relative h-full flex items-center p-5 md:p-10 lg:p-14">
                                            <div className="flex-1 space-y-4 md:space-y-6">
                                                <span className="text-[8px] md:text-[10px] font-black tracking-[0.3em] uppercase text-white/40">{hero.subtitle}</span>
                                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">{hero.title}</h1>
                                                <p className="text-[10px] md:text-xs lg:text-sm text-white/80 max-w-sm font-medium leading-relaxed">{hero.description}</p>
                                                <button
                                                    onClick={() => {
                                                        if (state.onboardingStep === 'pointing_start') {
                                                            updateOnboardingStep('playing');
                                                        }
                                                        selectCategory("English Vocabulary Builder");
                                                        trackEvent('HERO_START_JOURNEY', 'dashboard');
                                                        if (state.onboardingStep === 'dashboard') updateOnboardingStep('pointing_sidebar');
                                                    }}
                                                    className={`bg-white text-black px-6 py-2 rounded-full font-black text-xs md:text-sm flex items-center gap-2 hover:scale-105 transition-all ${state.onboardingStep === 'dashboard' || state.onboardingStep === 'pointing_start' ? 'ring-4 ring-primary animate-pulse shadow-[0_0_20px_rgba(29,185,84,0.6)]' : ''}`}
                                                >
                                                    <Play size={18} fill="black" />
                                                    <span>{state.onboardingStep === 'dashboard' ? 'GO TO JOURNEYS' : state.onboardingStep === 'pointing_start' ? '🚀 START YOUR FIRST JOURNEY' : 'Start Your Journey'}</span>
                                                </button>
                                            </div>
                                            <div className="hidden lg:block">
                                                <img src="/language_mastery_hero.png" alt="hero" className="w-56 h-56 lg:w-64 lg:h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/10 rotate-6 group-hover:rotate-0 transition-all duration-700" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </section>
                        </>
                        )}

                        <section className="space-y-6">
                            <h2 className="text-2xl font-black tracking-tight">Good morning, {state.userName?.split(' ')[0] || 'Member'}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                <div className="md:col-span-2 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {recentTracks.map((item, i) => (
                                            <div key={i} className="flex items-center bg-white/5 hover:bg-white/10 transition-all rounded-xl overflow-hidden group cursor-pointer border border-white/5 h-20">
                                                <div className="w-20 h-20 relative flex-shrink-0">
                                                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <button onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            playTrack(item); 
                                                            trackEvent('PLAY_RECENT', item.id);
                                                        }} className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-black shadow-lg">
                                                            <Play className="w-5 h-5 fill-current" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex-1 p-4 min-w-0">
                                                    <div className="font-bold text-base text-white truncate">{item.name}</div>
                                                    <div className="text-sm text-text-subdued truncate">{item.artist}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {activeFilter === 'All' && (
                                    <div className="md:col-span-2 xl:col-span-1">
                                        <FeedbackCard onClick={() => setIsReviewOpen(true)} />
                                    </div>
                                )}
                            </div>
                        </section>

                        <div className="space-y-8">
                            {activeFilter === 'Music' && musicSections.map(s => renderCardRow(s.title, s.items))}
                            {activeFilter === 'Podcasts' && podcastSections.map(s => renderCardRow(s.title, s.items))}
                            {activeFilter === 'All' && allSections.map(s => renderCardRow(s.title, s.items))}
                            {activeFilter === 'Audiobooks' && audiobookSections.map(s => renderCardRow(s.title, s.items))}
                            {activeFilter === 'Artists' && artistsList.map(s => renderCardRow(s.title, s.items))}

                            {activeFilter === 'Journeys' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div 
                                        onClick={() => selectCategory("English Vocabulary Builder")}
                                        className="bg-[#1c1c1c] p-6 rounded-3xl hover:bg-[#252525] transition-all cursor-pointer border border-white/5 flex gap-6"
                                    >
                                        <img src="/vocab_builder.png" alt="English" className="w-32 h-32 rounded-xl object-cover" />
                                        <div className="flex flex-col justify-center">
                                            <span className="text-primary text-[10px] font-black tracking-widest uppercase mb-1">LEARNING ACTIVE</span>
                                            <h3 className="text-2xl font-black text-white">Vocabulary Builder</h3>
                                            <p className="text-sm text-text-subdued mt-1">Language fundamentals</p>
                                        </div>
                                    </div>
                                    <div 
                                        onClick={() => selectCategory("Communication Skills")}
                                        className="bg-[#1c1c1c] p-6 rounded-3xl hover:bg-[#252525] transition-all cursor-pointer border border-white/5 flex gap-6"
                                    >
                                        <img src="/comm_pro.png" alt="Comm" className="w-32 h-32 rounded-xl object-cover" />
                                        <div className="flex flex-col justify-center">
                                            <span className="text-orange-500 text-[10px] font-black tracking-widest uppercase mb-1">SOFT SKILLS</span>
                                            <h3 className="text-2xl font-black text-white">Communication Pro</h3>
                                            <p className="text-sm text-text-subdued mt-1">Suggested for you</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {activeFilter !== 'Journeys' && (
                    <div className="flex-shrink-0 w-[300px] h-full ml-2 hidden xl:flex">
                        <NowPlayingSidebar />
                    </div>
                )}
            </div>
            <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
        </div>
    );
};
