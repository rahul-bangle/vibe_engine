import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Play, Loader2 } from 'lucide-react';
import { useSpotify } from '../hooks/useSpotify';

export const MarketingDashboard: React.FC = () => {
    const { login } = useAuth();
    const { featuredPlaykits, loading } = useSpotify();

    return (
        <div className="flex-1 bg-gradient-to-b from-banner-purple/20 to-black overflow-y-auto p-8 animate-in fade-in duration-1000">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black tracking-tight">Focus on your flow.</h1>
                <button
                    onClick={login}
                    className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                    Sign in to Spotify
                </button>
            </header>

            <section className="mb-16 relative overflow-hidden rounded-2xl bg-gradient-to-r from-banner-purple to-indigo-900 p-12 shadow-2xl group">
                <div className="max-w-2xl relative z-10">
                    <h2 className="text-6xl font-black mb-6 leading-tight">Introducing <br /><span className="text-primary">Spotify Journeys</span></h2>
                    <p className="text-xl text-white/80 mb-8 leading-relaxed">
                        The music you love, interleaved with the focus you need. Professional goals met with personalized soundscapes.
                    </p>
                    <button
                        onClick={login}
                        className="bg-primary text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-primary-hover hover:scale-105 transition-all"
                    >
                        Explore Journeys
                    </button>
                </div>
                <div className="absolute right-[-10%] top-[-20%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] group-hover:bg-primary/30 transition-all duration-1000" />
            </section>

            <section>
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold">Trending Content</h3>
                    {loading && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {featuredPlaykits.map((item) => (
                        <div
                            key={item.id}
                            className="bg-background-elevated p-4 rounded-lg hover:bg-background-highlight transition-all cursor-pointer group shadow-lg border border-white/5"
                            onClick={login}
                        >
                            <div className="aspect-square rounded-md mb-4 shadow-xl relative overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-2xl">
                                        <Play className="w-6 h-6 text-black fill-current translate-x-0.5" />
                                    </div>
                                </div>
                            </div>
                            <div className="font-bold text-sm mb-1 truncate">{item.name}</div>
                            <div className="text-text-subdued text-xs truncate">{item.description}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
