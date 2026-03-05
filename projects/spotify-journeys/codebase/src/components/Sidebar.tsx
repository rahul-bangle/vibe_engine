import React from 'react';
import { Home, Search, Library, Compass as JourneyIcon, LogIn } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { useAuth } from '../context/AuthContext';
import { useJourney } from '../context/JourneyContext';

interface SidebarProps {
    onJourneyClick: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onJourneyClick }) => {
    const { isAuthenticated, login } = useAuth();
    const { state, resetJourney } = useJourney();

    return (
        <aside className="w-[302px] bg-black h-screen flex flex-col gap-2 p-2">
            <div className="bg-background-elevated rounded-lg p-3 flex flex-col gap-2">
                <SidebarItem
                    icon={Home}
                    label="Home"
                    isActive={!state.currentPath}
                    onClick={resetJourney}
                />
                <SidebarItem icon={Search} label="Search" />
            </div>

            <div className="bg-background-elevated rounded-lg flex-1 overflow-y-auto p-3 flex flex-col justify-between">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between text-text-subdued px-2">
                        <div className="flex items-center gap-3">
                            <Library className="w-6 h-6" />
                            <span className="font-bold text-sm">Your Library</span>
                        </div>
                    </div>

                    <nav className="flex flex-col gap-2">
                        {isAuthenticated && (
                            <SidebarItem
                                icon={JourneyIcon}
                                label="Journeys"
                                isFeature
                                onClick={onJourneyClick}
                            />
                        )}
                    </nav>
                </div>

                {!isAuthenticated && (
                    <div className="p-4 bg-gradient-to-br from-banner-purple/40 to-indigo-900 rounded-lg shadow-2xl">
                        <h4 className="font-bold mb-1 text-sm text-white">Unlock Journeys</h4>
                        <p className="text-xs text-white/80 mb-4 leading-tight">Sign in to experience goal-oriented listening.</p>
                        <button
                            onClick={login}
                            className="w-full bg-white text-black py-2 rounded-full text-xs font-bold hover:scale-105 transition-all flex items-center justify-center gap-2"
                        >
                            <LogIn className="w-4 h-4" /> Sign In
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};
