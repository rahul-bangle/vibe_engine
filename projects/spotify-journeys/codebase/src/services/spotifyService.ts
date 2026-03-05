export interface Track {
    id: string;
    name: string;
    artist: string;
    albumArt: string;
    duration: number;
    previewUrl?: string; // Real audio preview URL
}

export interface Playlist {
    id: string;
    name: string;
    description: string;
    image: string;
    type?: 'playlist' | 'artist' | 'song';
}

export interface Category {
    id: string;
    name: string;
    icons: { url: string }[];
}

class SpotifyService {
    private JIOSAAVN_BASE_URL = 'https://saavn.sumit.co/api';

    private mapTrack(item: any): Track {
        const image = item.image?.find((img: any) => img.quality === '500x500')?.url || item.image?.[item.image.length - 1]?.url || '';
        const download = item.downloadUrl?.find((d: any) => d.quality === '320kbps')?.url || item.downloadUrl?.[item.downloadUrl.length - 1]?.url || '';

        return {
            id: item.id,
            name: item.name,
            artist: item.artists?.primary?.[0]?.name || 'Unknown Artist',
            albumArt: image,
            duration: item.duration || 0,
            previewUrl: download
        };
    }

    async searchTracks(term: string): Promise<Track[]> {
        try {
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/search/songs?query=${encodeURIComponent(term)}&limit=10`);
            const data = await response.json();

            if (!data.success || !data.data?.results) return [];

            return data.data.results.map((item: any) => this.mapTrack(item));
        } catch (error) {
            console.error('Error searching tracks:', error);
            return [];
        }
    }

    async searchArtists(term: string): Promise<Playlist[]> {
        try {
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/search/artists?query=${encodeURIComponent(term)}&limit=10`);
            const data = await response.json();

            if (!data.success || !data.data?.results) return [];

            return data.data.results.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: 'Artist',
                image: item.image?.find((img: any) => img.quality === '500x500')?.url || item.image?.[item.image.length - 1]?.url || '',
                type: 'artist'
            }));
        } catch (error) {
            console.error('Error searching artists:', error);
            return [];
        }
    }

    async getFeaturedPlaylists(): Promise<Playlist[]> {
        try {
            // Using search/playlists for "trending" or similar
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/search/playlists?query=Trending&limit=10`);
            const data = await response.json();

            if (!data.success || !data.data?.results) {
                // Fallback to searching songs
                const tracks = await this.searchTracks('Latest Hits');
                return tracks.map(t => ({ id: t.id, name: t.name, description: `By ${t.artist}`, image: t.albumArt }));
            }

            return data.data.results.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: `By ${item.firstname || 'JioSaavn'}`,
                image: item.image?.find((img: any) => img.quality === '500x500')?.url || item.image?.[item.image.length - 1]?.url || ''
            }));
        } catch (error) {
            console.error('Error getting featured playlists:', error);
            return [];
        }
    }

    async getCategories(): Promise<Category[]> {
        const categories = [
            { id: 'vocab', name: 'English Vocabulary Builder', query: 'English learning' },
            { id: 'comm', name: 'Communication Skills', query: 'Storytelling' },
            { id: 'prod', name: 'Productivity Habits', query: 'Motivational' }
        ];

        try {
            const enrichedCategories = await Promise.all(
                categories.map(async (cat) => {
                    const results = await this.searchTracks(cat.query);
                    const imageUrl = results[0]?.albumArt || 'https://via.placeholder.com/600x600?text=Vibe';
                    return {
                        id: cat.id,
                        name: cat.name,
                        icons: [{ url: imageUrl }]
                    };
                })
            );
            return enrichedCategories;
        } catch (error) {
            console.error('Error fetching enriched categories:', error);
            return categories.map(c => ({ id: c.id, name: c.name, icons: [{ url: 'https://via.placeholder.com/600x600?text=Vibe' }] }));
        }
    }

    async getPodcasts(query: string): Promise<Playlist[]> {
        try {
            // JioSaavn doesn't have a specific podcast endpoint in this unofficial API
            // We search for playlists using the query and "podcast"
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/search/playlists?query=${encodeURIComponent(query + ' podcast')}&limit=10`);
            const data = await response.json();

            if (!data.success || !data.data?.results || data.data.results.length === 0) {
                // Try searching songs if no playlists found
                const songs = await this.searchTracks(query);
                return songs.map(s => ({ id: s.id, name: s.name, description: s.artist, image: s.albumArt }));
            }

            return data.data.results.map((item: any) => ({
                id: item.id,
                name: item.name,
                description: item.artist || 'Podcast',
                image: item.image?.find((img: any) => img.quality === '500x500')?.url || item.image?.[item.image.length - 1]?.url || ''
            }));
        } catch (error) {
            console.error('Error searching podcasts:', error);
            return [];
        }
    }

    async getTrack(id: string): Promise<Track | undefined> {
        try {
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/songs?ids=${id}`);
            const data = await response.json();
            if (data.success && data.data?.[0]) {
                return this.mapTrack(data.data[0]);
            }
        } catch (error) {
            console.error('Error getting track:', error);
        }
        return undefined;
    }

    async getTracksByIds(ids: string[]): Promise<Track[]> {
        if (ids.length === 0) return [];
        try {
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/songs?ids=${ids.join(',')}`);
            const data = await response.json();
            if (data.success && data.data) {
                return data.data.map((item: any) => this.mapTrack(item));
            }
        } catch (error) {
            console.error('Error getting tracks by ids:', error);
        }
        return [];
    }
}

export const spotifyService = new SpotifyService();
