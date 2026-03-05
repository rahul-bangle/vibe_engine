import { useState, useEffect } from 'react';
import { spotifyService } from '../services/spotifyService';
import type { Playlist, Category } from '../services/spotifyService';

export const useSpotify = () => {
    const [featuredPlaykits, setFeaturedPlaykits] = useState<Playlist[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [playlists, cats] = await Promise.all([
                    spotifyService.getFeaturedPlaylists(),
                    spotifyService.getCategories()
                ]);
                setFeaturedPlaykits(playlists);
                setCategories(cats);
            } catch (error) {
                console.error('Error fetching Spotify data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { featuredPlaykits, categories, loading };
};
