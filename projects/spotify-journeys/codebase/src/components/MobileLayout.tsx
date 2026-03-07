import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Search, Library, Compass, X, Play, Pause, Heart,
  MoreHorizontal, ChevronLeft, SkipBack, SkipForward, Shuffle,
  Repeat, ChevronDown, MoreVertical, MonitorSpeaker, ListMusic,
  Bell, Clock, Settings
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useJourney } from '../hooks/useJourney';
import { useTracking } from '../hooks/useTracking';
import { spotifyService } from '../services/spotifyService';
import { motion, AnimatePresence } from 'framer-motion';
import { OnboardingPopUp } from './OnboardingPopUp';
import { SpotifyIcon } from './icons/SpotifyIcon';
import { WelcomeBanner } from './WelcomeBanner';
import type { Track, Playlist } from '../services/spotifyService';
import type { JourneyPath } from '../types/journey';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Tab = 'home' | 'search' | 'library' | 'journeys';
type MobileScreen = 'tabs' | 'journey-detail' | 'now-playing';

// ─────────────────────────────────────────────
// MOBILE HEADER + HAMBURGER DRAWER
// ─────────────────────────────────────────────


const MobileHeader: React.FC<{ onTabChange: (tab: Tab) => void }> = ({ onTabChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { state } = useJourney();

  const navItems = [
    { icon: Home, label: 'Home', tab: 'home' as Tab },
    { icon: Search, label: 'Search', tab: 'search' as Tab },
    { icon: Library, label: 'Your Library', tab: 'library' as Tab },
    { icon: Compass, label: 'Journeys', tab: 'journeys' as Tab },
  ];

  return (
    <>
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-black sticky top-0 z-[100]">
        <div className="flex items-center gap-2">
          <SpotifyIcon size={32} />
          <span className="font-black text-xl tracking-tight text-white">Spotify</span>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="p-1">
          <MoreHorizontal className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* ── Backdrop ── */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* ── Drawer ── */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-72 bg-[#121212] z-[300] flex flex-col shadow-2xl"
          >
            {/* Profile */}
            <div className="flex items-center justify-between px-6 pt-14 pb-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center text-white font-black text-sm uppercase">
                  {state.userName?.[0] || 'R'}
                </div>
                <div>
                  <p className="font-black text-white text-sm">{state.userName || 'Rahul'}</p>
                  <p className="text-[10px] text-[#b3b3b3] uppercase tracking-widest">Free Plan</p>
                </div>
              </div>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="w-5 h-5 text-[#b3b3b3]" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 px-2 py-4 overflow-y-auto">
              {navItems.map(({ icon: Icon, label, tab }) => (
                <button
                  key={tab}
                  onClick={() => { onTabChange(tab); setDrawerOpen(false); }}
                  className="flex items-center gap-4 w-full px-4 py-3.5 rounded-lg active:bg-white/10 transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#b3b3b3]" />
                  <span className="font-bold text-sm text-white">{label}</span>
                </button>
              ))}

              <div className="my-3 border-t border-white/10" />

              {[
                { icon: Heart, label: 'Liked Songs' },
                { icon: Bell, label: 'Notifications' },
                { icon: Settings, label: 'Settings' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center gap-4 w-full px-4 py-3.5 rounded-lg active:bg-white/10 transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#b3b3b3]" />
                  <span className="font-bold text-sm text-white">{label}</span>
                </button>
              ))}
            </div>

            {/* Premium Banner */}
            <div className="mx-4 mb-8 p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
              <p className="font-black text-white text-sm mb-1">Go Premium</p>
              <p className="text-[11px] text-[#b3b3b3] mb-3">No ads. Offline listening.</p>
              <button className="bg-primary text-black font-black text-xs px-4 py-2 rounded-full active:scale-95 transition-transform">
                UPGRADE
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─────────────────────────────────────────────
// MINI PLAYER
// ─────────────────────────────────────────────
const MiniPlayer: React.FC<{
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  onPlayPause: () => void;
  onOpen: () => void;
}> = ({ track, isPlaying, currentTime, onPlayPause, onOpen }) => {
  if (!track) return null;

  const progress = Math.min((currentTime / 30) * 100, 100);

  return (
    <div
      onClick={onOpen}
      className="mx-2 mb-2 bg-[#282828] rounded-xl h-16 flex items-center px-3 gap-3 cursor-pointer select-none relative z-40 border border-white/5 shadow-2xl"
    >
      {/* Album Art */}
      <div className="relative flex-shrink-0">
        <img
          src={track.albumArt || (track as any).image}
          alt=""
          className="w-11 h-11 rounded-lg shadow-lg object-cover"
        />
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-black text-white truncate leading-tight mb-0.5">{track.name}</p>
        <p className="text-[11px] font-medium text-[#b3b3b3] truncate flex items-center gap-1.5">
          <MonitorSpeaker className="w-3 h-3 text-primary fill-current" />
          {track.artist || (track as any).description}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
          className="w-10 h-10 flex items-center justify-center active:scale-90 transition-transform"
        >
          {isPlaying
            ? <Pause className="w-6 h-6 text-white fill-current" />
            : <Play className="w-6 h-6 text-white fill-current" />}
        </button>
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 flex items-center justify-center"
        >
          <SkipForward className="w-5 h-5 text-white fill-current" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// NOW PLAYING SCREEN (full screen)
// ─────────────────────────────────────────────
const NowPlayingScreen: React.FC<{
  track: Track;
  isPlaying: boolean;
  miniCurrentTime: number;
  onPlayPause: () => void;
  onClose: () => void;
}> = ({ track, isPlaying, miniCurrentTime, onPlayPause, onClose }) => {
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: '#121212' }}
    >
      {/* Blurred Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={track.albumArt || (track as any).image}
          alt=""
          className="w-full h-full object-cover blur-3xl scale-110 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
      </div>

      <div className="relative flex flex-col h-full px-6 pt-12 pb-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={onClose} className="p-2">
            <ChevronDown className="w-7 h-7 text-white" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Now Playing</p>
            <p className="text-sm font-bold text-white truncate max-w-[200px]">{track.name}</p>
          </div>
          <button className="p-2">
            <MoreHorizontal className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Album Art */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <motion.div
            animate={{ scale: isPlaying ? 1 : 0.92 }}
            transition={{ duration: 0.3 }}
            className="w-full aspect-square max-w-[320px] rounded-xl overflow-hidden shadow-2xl"
          >
            <img
              src={track.albumArt || (track as any).image}
              alt={track.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Track Info + Like */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-white truncate">{track.name}</h2>
            <p className="text-[#b3b3b3] text-base font-medium">{track.artist || (track as any).description}</p>
          </div>
          <button onClick={() => setLiked(!liked)} className="p-2 ml-4">
            <Heart className={`w-7 h-7 transition-colors ${liked ? 'fill-primary text-primary' : 'text-white'}`} />
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="h-1 bg-white/20 rounded-full mb-2">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${(miniCurrentTime / 30) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-[#b3b3b3] uppercase tracking-widest">
            <span>0:{Math.floor(miniCurrentTime).toString().padStart(2, '0')}</span><span>0:30</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-8">
          <button><Shuffle className="w-6 h-6 text-[#b3b3b3]" /></button>
          <button><SkipBack className="w-9 h-9 text-white fill-current" /></button>
          <button
            onClick={onPlayPause}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform"
          >
            {isPlaying
              ? <Pause className="w-9 h-9 text-black fill-current" />
              : <Play className="w-9 h-9 text-black fill-current ml-1" />}
          </button>
          <button><SkipForward className="w-9 h-9 text-white fill-current" /></button>
          <button><Repeat className="w-6 h-6 text-[#b3b3b3]" /></button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-2">
          <MonitorSpeaker className="w-5 h-5 text-primary" />
          <ListMusic className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// HOME TAB
// ─────────────────────────────────────────────
const HomeTab: React.FC<{ onPlayTrack: (track: Track | Playlist) => void }> = ({ onPlayTrack }) => {
  const { state, updateOnboardingStep } = useJourney();
  const [recentTracks, setRecentTracks] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [madeForYou, setMadeForYou] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (state.userName && !state.onboardingStep && !localStorage.getItem('mobile-onboarding-done')) {
      updateOnboardingStep('dashboard');
    }
  }, [state.userName, state.onboardingStep, updateOnboardingStep]);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        if (state.recentlyPlayed?.length > 0) {
          const t = await spotifyService.getTracksByIds(state.recentlyPlayed.slice(0, 6));
          setRecentTracks(t.length > 0 ? t : (await spotifyService.searchTracks('Top Learning')).slice(0, 6));
        } else {
          setRecentTracks((await spotifyService.searchTracks('Deep Focus')).slice(0, 6));
        }
        setTrending((await spotifyService.searchTracks('Daily Highlights')).slice(0, 10));
        setPodcasts((await spotifyService.getPodcasts('Educational Knowledge')).slice(0, 10));
        setMadeForYou((await spotifyService.searchTracks('Learning Path')).slice(0, 10));
      } catch (e) { console.warn(e); }
      finally { setIsLoading(false); }
    };
    fetch();
  }, [state.recentlyPlayed]);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const Section = ({ title, items }: { title: string; items: any[] }) => (
    <div className="mb-8">
      <h2 className="text-xl font-black text-white mb-4 px-4">{title}</h2>
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-36">
              <div className="w-36 h-36 rounded-lg bg-white/5 animate-pulse mb-2" />
              <div className="h-4 bg-white/5 rounded w-24 animate-pulse mb-1" />
              <div className="h-3 bg-white/5 rounded w-16 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-2">
          {items.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-36 active:opacity-70 transition-opacity" onClick={() => onPlayTrack(item)}>
              <div className="w-36 h-36 rounded-lg overflow-hidden mb-2 shadow-lg">
                <img src={item.albumArt || item.image} alt="" className="w-full h-full object-cover" />
              </div>
              <p className="font-bold text-[13px] text-white truncate">{item.name}</p>
              <p className="text-[11px] text-[#b3b3b3] truncate mt-0.5">{item.artist || item.publisher || item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-36">
      {/* Greeting Row */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">{getGreeting()}</h1>
        <div className="flex gap-4">
          <button><Bell className="w-6 h-6 text-white" /></button>
          <button><Clock className="w-6 h-6 text-white" /></button>
        </div>
      </div>

      {/* Jump Back In Grid */}
      <div className="px-4 mb-8">
        <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-3">Jump back in</h2>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-md animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {recentTracks.map((item, i) => (
              <div
                key={i}
                onClick={() => onPlayTrack(item)}
                className="flex items-center bg-[#282828]/60 rounded-md overflow-hidden h-14 active:bg-[#3e3e3e] transition-all border border-white/5"
              >
                <img src={item.albumArt || item.image} alt="" className="w-14 h-14 object-cover flex-shrink-0" />
                <span className="font-bold text-[11px] text-white px-3 line-clamp-2 leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <Section title="Your top mixes" items={trending} />
      <Section title="Suggested for you" items={podcasts} />
      <Section title="Based on your recent listening" items={madeForYou} />
      <div className="h-4" />
    </div>
  );
};

// ─────────────────────────────────────────────
// SEARCH TAB
// ─────────────────────────────────────────────
const SearchTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try { setResults(await spotifyService.searchTracks(query)); }
      finally { setSearching(false); }
    }, 400);
  }, [query]);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-36 px-4">
      <div className="pt-6 mb-6">
        <h1 className="text-2xl font-black text-white mb-4">Search</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-white text-black font-bold py-3 pl-10 pr-10 rounded-md focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-5 h-5 text-black" />
            </button>
          )}
        </div>
      </div>

      {query ? (
        <div className="space-y-4">
          {searching
            ? <div className="flex justify-center p-8"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
            : results.map((track, i) => (
              <div key={i} className="flex items-center gap-3 active:opacity-70">
                <img src={track.albumArt} alt="" className="w-12 h-12 rounded" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white truncate">{track.name}</p>
                  <p className="text-xs text-[#b3b3b3] truncate">{track.artist}</p>
                </div>
                <MoreVertical className="w-5 h-5 text-[#b3b3b3]" />
              </div>
            ))
          }
        </div>
      ) : (
        <div>
          <h2 className="text-base font-black text-white mb-4">Browse all</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Podcasts', color: 'bg-[#af2896]' },
              { name: 'New Releases', color: 'bg-[#1e3264]' },
              { name: 'Charts', color: 'bg-[#8d67ab]' },
              { name: 'Bollywood', color: 'bg-[#e5435d]' },
              { name: 'Pop', color: 'bg-[#148a08]' },
              { name: 'Indie', color: 'bg-[#e91429]' },
            ].map((cat, i) => (
              <div key={i} className={`${cat.color} rounded-lg aspect-[16/9] p-3 relative overflow-hidden active:scale-95 transition-transform`}>
                <span className="font-black text-white text-lg">{cat.name}</span>
                <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/20 rotate-12" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// LIBRARY TAB
// ─────────────────────────────────────────────
const LibraryTab: React.FC = () => {
  const playlists = [
    { name: 'Liked Songs', sub: 'Playlist • 28 songs', image: '💜', color: 'bg-gradient-to-br from-indigo-800 to-purple-900' },
    { name: 'Your Top Tracks 2024', sub: 'Playlist • Spotify', image: null, color: 'bg-[#282828]' },
    { name: 'Deep Focus', sub: 'Playlist • Spotify', image: null, color: 'bg-[#282828]' },
  ];
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      <div className="flex items-center justify-between px-4 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-white font-bold text-xs">R</div>
          <h1 className="text-2xl font-black text-white">Your Library</h1>
        </div>
        <div className="flex gap-4">
          <Search className="w-6 h-6 text-white" />
          <span className="text-2xl text-white font-light">+</span>
        </div>
      </div>
      <div className="px-4 space-y-1">
        {playlists.map((item, i) => (
          <div key={i} className="flex items-center gap-4 py-2 active:opacity-70">
            <div className={`w-16 h-16 rounded flex-shrink-0 flex items-center justify-center text-2xl ${item.color}`}>
              {item.image || <Library className="w-7 h-7 text-[#b3b3b3]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white truncate">{item.name}</p>
              <p className="text-xs text-[#b3b3b3]">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// JOURNEY DETAIL SCREEN
// ─────────────────────────────────────────────
const JourneyDetailScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { state, startJourney } = useJourney();
  const { trackEvent } = useTracking();
  const path = state.currentPath || 'English Vocabulary Builder';
  const benefits: Record<string, string[]> = {
    'English Vocabulary Builder': ['Learn 20+ corporate words daily', 'Perfect pronunciation with audio', 'Contextual usage in emails', 'Daily recall practice'],
    'Communication Skills': ['Master active listening', 'Lead meetings confidently', 'Body language & vocal tone', 'Conflict resolution frameworks'],
    'Productivity Habits': ['Time-blocking & deep work', 'Email management strategies', 'Building a second brain', 'Ending procrastination'],
  };
  const bens = benefits[path] || benefits['English Vocabulary Builder'];
  return (
    <div className="fixed inset-0 z-[150] bg-black overflow-y-auto no-scrollbar">
      <div className="relative h-72 bg-gradient-to-b from-primary/40 to-black">
        <button onClick={onBack} className="absolute top-12 left-4 p-2 z-10">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <span className="text-xs font-black uppercase tracking-widest text-primary mb-1 block">Learning Journey</span>
          <h1 className="text-3xl font-black text-white leading-tight mb-2">{path}</h1>
        </div>
      </div>
      <div className="px-4 py-6">
        <button
          onClick={() => { startJourney(); trackEvent('JOURNEY_START', path); }}
          className="w-full bg-primary text-black font-black text-lg py-4 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <Play className="w-6 h-6 fill-current" /> START SESSION
        </button>
      </div>
      <div className="px-4 pb-12">
        <h2 className="text-xl font-black text-white mb-4">Curriculum</h2>
        <div className="space-y-3">
          {bens.map((b, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#181818] rounded-xl p-4 border border-white/5">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="font-bold text-sm text-white">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// JOURNEYS TAB
// ─────────────────────────────────────────────
const JourneysTab: React.FC<{ onSelectJourney: (path: JourneyPath) => void }> = ({ onSelectJourney }) => {
  const { state, updateOnboardingStep } = useJourney();
  useEffect(() => {
    if (state.onboardingStep === 'pointing_sidebar') updateOnboardingStep('pointing_start');
  }, [state.onboardingStep, updateOnboardingStep]);

  const journeys = [
    { id: 'English Vocabulary Builder' as JourneyPath, title: 'Vocabulary Builder', subtitle: 'Language Mastery', color: 'from-blue-600 to-indigo-900', emoji: '📚' },
    { id: 'Communication Skills' as JourneyPath, title: 'Communication Pro', subtitle: 'Soft Skills', color: 'from-orange-500 to-red-900', emoji: '🎤' },
    { id: 'Productivity Habits' as JourneyPath, title: 'Peak Productivity', subtitle: 'Habit Formation', color: 'from-green-600 to-teal-900', emoji: '⚡' },
  ];

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
      <div className="px-4 pt-6 mb-6">
        <h1 className="text-2xl font-black text-white mb-1">Growth Journeys</h1>
        <p className="text-sm text-[#b3b3b3]">Listen. Learn. Evolve.</p>
      </div>
      <div className="px-4 space-y-4 relative">
        {state.onboardingStep === 'pointing_start' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none"
          >
            <div className="bg-primary text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 mb-2">
              👉 Click to start path!
            </div>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[12px] border-transparent border-t-primary"
            />
          </motion.div>
        )}
        {journeys.map((j) => (
          <div
            key={j.id} onClick={() => onSelectJourney(j.id)}
            className={`bg-gradient-to-br ${j.color} rounded-2xl p-5 cursor-pointer active:scale-[0.98] transition-all relative overflow-hidden h-40 flex flex-col justify-end`}
          >
            <div className="absolute top-4 right-4 text-5xl opacity-20">{j.emoji}</div>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1 block">{j.subtitle}</span>
              <h3 className="text-2xl font-black text-white leading-none">{j.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MOBILE JOURNEY PLAYER
// ─────────────────────────────────────────────
export const MobileJourneyPlayer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, completeDay, setGlobalPlaying, updateOnboardingStep } = useJourney();
  const [segments, setSegments] = useState<Track[]>([]);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const PLAY_LIMIT = 8;

  useEffect(() => {
    spotifyService.searchTracks(state.currentPath || 'English Vocabulary Builder')
      .then(res => setSegments(res.slice(0, 1)));
    setGlobalPlaying(false);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(e => console.warn(e));
    else audio.pause();
  }, [isPlaying, segmentIndex, segments]);

  const track = segments[segmentIndex];

  const handleNext = () => {
    if (isCompleted) return;
    if (segmentIndex < segments.length - 1) {
      setSegmentIndex(v => v + 1);
      setCurrentTime(0);
    }
    else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    completeDay();
    updateOnboardingStep('completed');
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#1DB954', '#ffffff', '#191414'] });
  };

  if (isCompleted) return (
    <div className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 bg-primary rounded-3xl mb-8 flex items-center justify-center shadow-2xl">
        <SpotifyIcon size={48} color="black" />
      </div>
      <h1 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase">CONGRATULATIONS!</h1>
      <p className="text-[#b3b3b3] text-lg mb-10 leading-relaxed font-medium">
        You've completed your evolution session, {state.userName}!
      </p>
      <div className="bg-primary/20 p-8 rounded-[2rem] border border-primary/30 w-full mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Knowledge Gained</p>
        <p className="text-4xl font-black text-white tracking-widest">+500 XP</p>
      </div>
      <div className="flex flex-col w-full gap-4">
        <button
          onClick={async () => {
            const res = await spotifyService.searchTracks(state.currentPath || 'English Vocabulary Builder');
            setSegments([...res].sort(() => Math.random() - 0.5).slice(0, 4));
            setIsCompleted(false); setSegmentIndex(0); setIsPlaying(true); setCurrentTime(0);
          }}
          className="w-full bg-primary text-black py-4 rounded-full font-black text-lg active:scale-95 transition-all shadow-xl"
        >
          CONTINUE LEARNING
        </button>
        <button onClick={() => { setIsCompleted(false); onClose(); }}
          className="w-full bg-white/10 text-white py-4 rounded-full font-black text-lg"
        >
          BACK TO DASHBOARD
        </button>
      </div>
    </div>
  );

  if (!track) return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[300] bg-[#121212] flex flex-col">
      <audio
        ref={audioRef} key={track.id} src={track.previewUrl} preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current && !isCompleted) {
            const time = audioRef.current.currentTime;
            setCurrentTime(time);
            if (time >= PLAY_LIMIT) {
              audioRef.current.pause();
              handleNext();
            }
          }
        }}
        onEnded={handleNext}
      />
      <div className="flex items-center justify-between p-6">
        <button onClick={onClose}><X className="w-6 h-6 text-white" /></button>
        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Journey Level 1</p>
          <p className="text-sm font-bold text-white uppercase">{state.currentPath}</p>
        </div>
        <button className="opacity-0"><X className="w-6 h-6" /></button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-10">
        <motion.div key={segmentIndex} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full aspect-square max-w-[300px] mb-12 shadow-2xl rounded-2xl overflow-hidden ring-1 ring-white/10"
        >
          <img src={track.albumArt || (track as any).image} alt="" className="w-full h-full object-cover" />
        </motion.div>
        <div className="w-full mb-10 text-center">
          <h2 className="text-2xl font-black text-white mb-2">{track.name}</h2>
          <p className="text-lg text-[#b3b3b3] font-medium">{track.artist}</p>
        </div>
        <div className="w-full mb-12">
          <div className="h-1 bg-white/20 rounded-full mb-4">
            <div className="h-full bg-primary rounded-full transition-all duration-100" style={{ width: `${(currentTime / PLAY_LIMIT) * 100}%` }} />
          </div>
          <div className="flex justify-between text-[10px] font-bold text-[#b3b3b3] uppercase tracking-widest">
            <span>0:0{Math.floor(currentTime)}</span><span>0:0{PLAY_LIMIT}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-12">
          <button onClick={() => { setSegmentIndex(Math.max(0, segmentIndex - 1)); setCurrentTime(0); }}>
            <SkipBack className="w-10 h-10 text-white fill-current" />
          </button>
          <button onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 bg-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause className="w-10 h-10 text-black fill-current" /> : <Play className="w-10 h-10 text-black fill-current ml-1" />}
          </button>
          <button onClick={handleNext}><SkipForward className="w-10 h-10 text-white fill-current" /></button>
        </div>
      </div>
      <div className="p-8 text-center">
        <div className="inline-flex items-center bg-white/5 px-4 py-2 rounded-full border border-white/5">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">
            Segment {segmentIndex + 1} of {segments.length}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN MOBILE LAYOUT
// ─────────────────────────────────────────────
export const MobileLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [screen, setScreen] = useState<MobileScreen>('tabs');
  const [miniTrack, setMiniTrack] = useState<Track | null>(null);
  const [miniPlaying, setMiniPlaying] = useState(false);
  const [miniCurrentTime, setMiniCurrentTime] = useState(0);
  const miniAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = miniAudioRef.current;
    if (!audio) return;
    if (miniPlaying) {
      audio.play().catch(e => console.warn('Playback failed:', e));
    } else {
      audio.pause();
    }
  }, [miniPlaying, miniTrack]);

  const { state, updateOnboardingStep, selectCategory } = useJourney();
  const { trackEvent } = useTracking();

  const handlePlayTrack = (track: Track | Playlist) => {
    setMiniTrack(track as Track);
    setMiniPlaying(true);
    trackEvent('PLAY_TRACK_MOBILE', 'name' in track ? track.name : 'playlist');
  };

  const tabs = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'search' as Tab, label: 'Search', icon: Search },
    { id: 'library' as Tab, label: 'Your Library', icon: Library },
    { id: 'journeys' as Tab, label: 'Journeys', icon: Compass },
  ];

  return (
    <div className="flex flex-col h-[100dvh] bg-black text-white font-sans overflow-hidden">
      <AnimatePresence>
        {state.onboardingStep === 'dashboard' && (
          <OnboardingPopUp onClose={() => updateOnboardingStep('pointing_sidebar')} />
        )}
      </AnimatePresence>

      {/* Header passes tab-change down so drawer links work */}
      <MobileHeader onTabChange={(tab) => { setActiveTab(tab); setScreen('tabs'); }} />

      {import.meta.env.DEV && (
        <button
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.reload();
          }}
          className="fixed bottom-32 right-4 z-[999] bg-red-500 text-white text-[10px] font-black px-3 py-2 rounded-full shadow-xl uppercase tracking-widest"
        >
          🔄 Reset
        </button>
      )}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {!state.userName && screen === 'tabs' && (
          <div className="absolute inset-0 z-[110] bg-black p-6 flex items-center justify-center">
            <WelcomeBanner />
          </div>
        )}

        {activeTab === 'home' && state.userName && <HomeTab onPlayTrack={handlePlayTrack} />}
        {activeTab === 'search' && <SearchTab />}
        {activeTab === 'library' && <LibraryTab />}
        {activeTab === 'journeys' && (
          <JourneysTab onSelectJourney={(id) => { selectCategory(id); setScreen('journey-detail'); }} />
        )}

        <AnimatePresence>
          {screen === 'journey-detail' && <JourneyDetailScreen onBack={() => setScreen('tabs')} />}
        </AnimatePresence>

        <AnimatePresence>
          {screen === 'now-playing' && miniTrack && (
            <NowPlayingScreen
              track={miniTrack}
              isPlaying={miniPlaying}
              miniCurrentTime={miniCurrentTime}
              onPlayPause={() => setMiniPlaying(p => !p)}
              onClose={() => setScreen('tabs')}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md pt-2">
        <audio
          ref={miniAudioRef}
          key={miniTrack?.id}
          src={miniTrack?.previewUrl}
          onTimeUpdate={() => {
            if (miniAudioRef.current) setMiniCurrentTime(miniAudioRef.current.currentTime);
          }}
          onEnded={() => setMiniPlaying(false)}
        />
        <MiniPlayer
          track={miniTrack}
          isPlaying={miniPlaying}
          currentTime={miniCurrentTime}
          onPlayPause={() => setMiniPlaying(p => !p)}
          onOpen={() => setScreen('now-playing')}
        />

        <nav className="flex items-center justify-around bg-black/95 backdrop-blur-xl border-t border-white/5 h-[72px] pb-[env(safe-area-inset-bottom,12px)]">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            const isPointing = state.onboardingStep === 'pointing_sidebar' && id === 'journeys';
            return (
              <button
                key={id}
                onClick={() => { setActiveTab(id); setScreen('tabs'); trackEvent('MOBILE_TAB_SWITCH', id); }}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full active:opacity-70 transition-all relative ${isPointing ? 'scale-110' : ''}`}
              >
                {isPointing && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                  >
                    <div className="bg-primary text-black px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter shadow-2xl whitespace-nowrap">
                      Start Journey! 👈
                    </div>
                  </motion.div>
                )}
                <Icon
                  className={`w-[24px] h-[24px] transition-colors ${active ? 'text-white' : 'text-[#b3b3b3]'} ${isPointing ? 'text-primary animate-pulse' : ''}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`text-[10px] font-bold tracking-tight transition-colors ${active ? 'text-white' : 'text-[#b3b3b3]'} ${isPointing ? 'text-primary' : ''}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};