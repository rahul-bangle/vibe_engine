import React from 'react';
import { motion } from 'framer-motion';
import { Home, Search, Library, Compass as JourneyIcon, X } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { useJourney } from '../hooks/useJourney';
import { useTracking } from '../hooks/useTracking';
import { SpotifyIcon } from './icons/SpotifyIcon';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
    const { state, resetJourney, setActiveFilter, updateOnboardingStep } = useJourney();
    const { trackEvent } = useTracking();

    const showInactivityReminder = React.useMemo(() => {
        if (!state.lastCompletedAt) return false;
        const lastDate = new Date(state.lastCompletedAt);
        const now = new Date();
        const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 3600);
        return diffHours >= 24;
    }, [state.lastCompletedAt]);

    const handleHomeClick = () => {
        resetJourney();
        setActiveFilter('All');
        trackEvent('NAV_HOME', 'sidebar');
    };

    const handleJourneysNavClick = () => {
        resetJourney();
        setActiveFilter('Journeys');
        trackEvent('NAV_JOURNEYS', 'sidebar');
        if (state.onboardingStep === 'pointing_sidebar') {
            updateOnboardingStep('pointing_start');
        }
    };

    return (
        <aside className={`w-[240px] fixed md:relative z-40 h-full transition-transform duration-300 bg-black flex flex-col p-2 gap-2 font-sans ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="bg-[#121212] rounded-lg p-6 flex flex-col gap-8 relative">
                {/* Close Button on Mobile */}
                <button 
                  className="md:hidden absolute top-4 right-4 p-1 text-text-subdued hover:text-white transition-colors"
                  onClick={onClose}
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3 text-white px-2">
                    <SpotifyIcon size={32} />
                    <div className="flex flex-col -space-y-1">
                        <span className="font-black text-xl tracking-tighter">Spotify</span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Beta</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-6">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-text-subdued uppercase tracking-[0.2em] px-2">Browse</p>
                        <SidebarItem
                            icon={Home}
                            label="Home"
                            isActive={state.activeFilter === 'All' && !state.currentPath}
                            onClick={handleHomeClick}
                        />
                        <SidebarItem
                            icon={Search}
                            label="Search"
                            onClick={() => {
                                setActiveFilter('All');
                                trackEvent('NAV_SEARCH', 'sidebar');
                            }}
                        />
                    </div>
                </nav>
            </div>

            <div className="bg-[#121212] rounded-lg flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
                <div className="flex items-center justify-between text-text-subdued px-2">
                    <div className="flex items-center gap-3">
                        <Library className="w-6 h-6" />
                        <span className="font-black text-[10px] uppercase tracking-[0.2em]">Your Library</span>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    <div className="relative group">
                        <div className={`rounded-xl transition-all duration-500 ${state.onboardingStep === 'pointing_sidebar' ? 'ring-4 ring-primary animate-pulse shadow-[0_0_20px_rgba(29,185,84,0.4)] z-50 relative bg-primary/10' : ''}`}>
                            <SidebarItem
                                icon={JourneyIcon}
                                label="Journeys"
                                isFeature
                                isActive={state.activeFilter === 'Journeys'}
                                onClick={handleJourneysNavClick}
                            />
                        </div>
                        {state.onboardingStep === 'pointing_sidebar' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="fixed left-[220px] top-[340px] z-[9999] bg-primary text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-[0_0_50px_rgba(29,185,84,0.5)] flex items-center gap-2"
                            >
                                <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-primary absolute -left-2 top-1/2 -translate-y-1/2" />
                                👈 Click Journeys to Start
                            </motion.div>
                        )}
                        {showInactivityReminder && (
                            <div className="absolute left-[110%] top-1/2 -translate-y-1/2 bg-primary text-black px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-xl animate-bounce z-50">
                                Ready for Day {Object.keys(state.completionHistory).length + 1}?
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-primary" />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 px-2 space-y-3">
                        {["Your Top Tracks 2024", "Deep Focus Deep Work", "Late Night Beats", "Educational Podcasts"].map((pl, i) => (
                            <p key={i} className="text-sm font-medium text-text-subdued hover:text-white cursor-pointer truncate transition-colors">
                                {pl}
                            </p>
                        ))}
                    </div>
                </nav>
            </div>
        </aside>
    );
};
