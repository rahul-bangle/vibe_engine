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
}

export interface Category {
    id: string;
    name: string;
    icons: { url: string }[];
}

class SpotifyService {
    // We use iTunes Search API as a high-fidelity proxy since Spotify is blocked
    private ITUNES_BASE_URL = 'https://itunes.apple.com/search';

    async searchTracks(term: string): Promise<Track[]> {
        try {
            const response = await fetch(`${this.ITUNES_BASE_URL}?term=${encodeURIComponent(term)}&entity=song&limit=10`);
            const data = await response.json();

            return data.results.map((item: any) => ({
                id: item.trackId.toString(),
                name: item.trackName,
                artist: item.artistName,
                albumArt: item.artworkUrl100.replace('100x100', '600x600'), // Get high-res version
                duration: Math.floor(item.trackTimeMillis / 1000),
                previewUrl: item.previewUrl
            }));
        } catch (error) {
            console.error('Error searching tracks:', error);
            return [];
        }
    }

    async getFeaturedPlaylists(): Promise<Playlist[]> {
        // Fetching real trending songs to simulate playlists
        const tracks = await this.searchTracks('2025 hits');
        return tracks.slice(0, 6).map((t) => ({
            id: t.id,
            name: t.name,
            description: `By ${t.artist}`,
            image: t.albumArt
        }));
    }

    async getCategories(): Promise<Category[]> {
        const categories = [
            { id: 'focus', name: 'Deep Focus', query: 'Focus' },
            { id: 'chill', name: 'Chill Vibes', query: 'Chill' },
            { id: 'energy', name: 'High Energy', query: 'Upbeat' },
            { id: 'pop', name: 'Pop Hits', query: 'Top Pop' },
            { id: 'jazz', name: 'Coffee Jazz', query: 'Jazz' }
        ];

        try {
            const enrichedCategories = await Promise.all(
                categories.map(async (cat) => {
                    const results = await this.searchTracks(cat.query);
                    const imageUrl = results[0]?.albumArt || 'https://via.placeholder.com/600x600?text=Spotify';
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
            return categories.map(c => ({ id: c.id, name: c.name, icons: [{ url: 'https://via.placeholder.com/600x600?text=Spotify' }] }));
        }
    }

    async getTrack(id: string): Promise<Track | undefined> {
        try {
            const response = await fetch(`${this.ITUNES_BASE_URL}?id=${id}&entity=song`);
            const data = await response.json();
            if (data.results.length > 0) {
                const item = data.results[0];
                return {
                    id: item.trackId.toString(),
                    name: item.trackName,
                    artist: item.artistName,
                    albumArt: item.artworkUrl100.replace('100x100', '600x600'),
                    duration: Math.floor(item.trackTimeMillis / 1000),
                    previewUrl: item.previewUrl
                };
            }
        } catch (error) {
            console.error('Error getting track:', error);
        }
        return undefined;
    }
}

export const spotifyService = new SpotifyService();
