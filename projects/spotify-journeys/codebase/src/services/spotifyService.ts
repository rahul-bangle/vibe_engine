export interface Track {
    id: string;
    name: string;
    artist: string;
    albumArt: string;
    duration: number;
    previewUrl?: string; // Real audio preview URL
    image?: string; // For compatibility with layout components
    description?: string; // For compatibility with layout components
    credits?: { name: string; role: string }[]; // For compatibility
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

interface JioSaavnImage {
    quality: string;
    url: string;
}

interface JioSaavnDownloadUrl {
    quality: string;
    url: string;
}

interface JioSaavnArtist {
    id: string;
    name: string;
    role: string;
    type: string;
    image: JioSaavnImage[];
    url: string;
}

interface JioSaavnArtists {
    primary: JioSaavnArtist[];
    featured: JioSaavnArtist[];
    all: JioSaavnArtist[];
}

interface JioSaavnTrack {
    id: string;
    name: string;
    type: string;
    album: { id: string; name: string; url: string };
    year: string;
    releaseDate: string;
    duration: number;
    label: string;
    primaryArtists: string;
    primaryArtistsId: string;
    featuredArtists: string;
    featuredArtistsId: string;
    explicitContent: boolean;
    playCount: number;
    language: string;
    url: string;
    artists: JioSaavnArtists;
    image: JioSaavnImage[];
    downloadUrl: JioSaavnDownloadUrl[];
}

interface JioSaavnArtistSearchResult {
    id: string;
    name: string;
    role: string;
    type: string;
    image: JioSaavnImage[];
    url: string;
}

interface JioSaavnPlaylistSearchResult {
    id: string;
    name: string;
    firstname?: string;
    followerCount?: string;
    songCount?: string;
    image: JioSaavnImage[];
    url: string;
}

interface JioSaavnResponse<T> {
    success: boolean;
    data: T;
}

interface JioSaavnSearchResults<T> {
    results: T[];
    total: number;
    start: number;
}

class SpotifyService {
    private JIOSAAVN_BASE_URL = 'https://saavn.sumit.co/api';

    private mapTrack(item: JioSaavnTrack): Track {
        const image = item.image?.find(img => img.quality === '500x500')?.url || item.image?.[item.image.length - 1]?.url || '';
        const download = item.downloadUrl?.find(d => d.quality === '320kbps')?.url || item.downloadUrl?.[item.downloadUrl.length - 1]?.url || '';

        return {
            id: item.id,
            name: item.name,
            artist: item.artists?.primary?.[0]?.name || 'Unknown Artist',
            albumArt: image,
            duration: item.duration || 0,
            previewUrl: download
        };
    }

    private filterItems<T extends { name: string }>(items: T[]): T[] {
        const blacklist = ['body builder', 'bodybuilder', 'gym workout', 'fitness motivation', 'workout mix'];
        return items.filter(item => {
            const name = item.name.toLowerCase();
            return !blacklist.some(word => name.includes(word));
        });
    }

    async searchTracks(term: string): Promise<Track[]> {
        try {
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/search/songs?query=${encodeURIComponent(term)}&limit=10`);
            const data: JioSaavnResponse<JioSaavnSearchResults<JioSaavnTrack>> = await response.json();

            if (!data.success || !data.data?.results) return [];

            return this.filterItems(data.data.results.map(item => this.mapTrack(item)));
        } catch (error) {
            console.error('Error searching tracks:', error);
            return [];
        }
    }

    async searchArtists(term: string): Promise<Playlist[]> {
        try {
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/search/artists?query=${encodeURIComponent(term)}&limit=10`);
            const data: JioSaavnResponse<JioSaavnSearchResults<JioSaavnArtistSearchResult>> = await response.json();

            if (!data.success || !data.data?.results) return [];

            return data.data.results.map(item => ({
                id: item.id,
                name: item.name,
                description: 'Artist',
                image: item.image?.find(img => img.quality === '500x500')?.url || item.image?.[item.image.length - 1]?.url || '',
                type: 'artist'
            }));
        } catch (error) {
            console.error('Error searching artists:', error);
            return [];
        }
    }

    async getFeaturedPlaylists(): Promise<Playlist[]> {
        try {
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/search/playlists?query=Educational%20Podcasts&limit=15`);
            const data: JioSaavnResponse<JioSaavnSearchResults<JioSaavnPlaylistSearchResult>> = await response.json();

            if (!data.success || !data.data?.results) {
                const tracks = await this.searchTracks('Learning English');
                return tracks.map(t => ({ id: t.id, name: t.name, description: `By ${t.artist}`, image: t.albumArt }));
            }

            const mapped = data.data.results.map(item => ({
                id: item.id,
                name: item.name,
                description: `By ${item.firstname || 'Education Hub'}`,
                image: item.image?.find(img => img.quality === '500x500')?.url || item.image?.[item.image.length - 1]?.url || ''
            }));

            return this.filterItems(mapped);
        } catch (error) {
            console.error('Error getting featured playlists:', error);
            return [];
        }
    }

    async getCategories(): Promise<Category[]> {
        const categories = [
            { 
                id: 'vocab', 
                name: 'English Vocabulary Builder', 
                query: 'English Vocabulary Lesson',
                image: '/vocab_builder.png'
            },
            { 
                id: 'comm', 
                name: 'Communication Skills', 
                query: 'Communication Skills Podcast',
                image: '/comm_pro.png'
            },
            { 
                id: 'prod', 
                name: 'Productivity Habits', 
                query: 'Time Management Podcast',
                image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=600&fit=crop'
            }
        ];

        try {
            const enrichedCategories = await Promise.all(
                categories.map(async (cat) => {
                    return {
                        id: cat.id,
                        name: cat.name,
                        icons: [{ url: cat.image }]
                    };
                })
            );
            return enrichedCategories;
        } catch (error) {
            console.error('Error fetching enriched categories:', error);
            return categories.map(c => ({ id: c.id, name: c.name, icons: [{ url: c.image }] }));
        }
    }

    async getPodcasts(query: string): Promise<Playlist[]> {
        try {
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/search/playlists?query=${encodeURIComponent(query + ' podcast')}&limit=10`);
            const data: JioSaavnResponse<JioSaavnSearchResults<JioSaavnPlaylistSearchResult>> = await response.json();

            if (!data.success || !data.data?.results || data.data.results.length === 0) {
                const songs = await this.searchTracks(query);
                return songs.map(s => ({ id: s.id, name: s.name, description: s.artist, image: s.albumArt }));
            }

            return data.data.results.map(item => ({
                id: item.id,
                name: item.name,
                description: 'Podcast',
                image: item.image?.find(img => img.quality === '500x500')?.url || item.image?.[item.image.length - 1]?.url || ''
            }));
        } catch (error) {
            console.error('Error searching podcasts:', error);
            return [];
        }
    }

    async getTrack(id: string): Promise<Track | undefined> {
        try {
            const response = await fetch(`${this.JIOSAAVN_BASE_URL}/songs?ids=${id}`);
            const data: JioSaavnResponse<JioSaavnTrack[]> = await response.json();
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
            const data: JioSaavnResponse<JioSaavnTrack[]> = await response.json();
            if (data.success && data.data) {
                return data.data.map(item => this.mapTrack(item));
            }
        } catch (error) {
            console.error('Error getting tracks by ids:', error);
        }
        return [];
    }
}

export const spotifyService = new SpotifyService();
