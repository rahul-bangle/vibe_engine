import React from 'react';
import { Home, Search, Library, Compass as JourneyIcon } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { useJourney } from '../context/JourneyContext';

interface SidebarProps {
}

export const Sidebar: React.FC<SidebarProps> = () => {
    const { state, resetJourney, setActiveFilter } = useJourney();

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
    };

    const handleJourneysNavClick = () => {
        resetJourney();
        setActiveFilter('Journeys');
    };

    return (
        <aside className="w-[240px] bg-black h-screen flex flex-col p-2 gap-2 font-sans transition-all duration-300">
            <div className="bg-[#121212] rounded-lg p-6 flex flex-col gap-8">
                <div className="flex items-center gap-3 text-white px-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                    </div>
                    <span className="font-black text-xl tracking-tighter">Spotify</span>
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
                        <SidebarItem
                            icon={JourneyIcon}
                            label="Journeys"
                            isFeature
                            isActive={state.activeFilter === 'Journeys'}
                            onClick={handleJourneysNavClick}
                        />
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
