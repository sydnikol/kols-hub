import { MusicTrack } from '../types';

export class MusicStreamingService {
  private playlists: Map<string, MusicTrack[]>;
  private userPreferences: Map<string, { mood: string[]; genre: string[] }>;

  constructor() {
    this.playlists = new Map();
    this.userPreferences = new Map();
    this.initializeDefaultTracks();
  }

  private initializeDefaultTracks(): void {
    // Initialize with some default wellness-focused music
    const defaultTracks: MusicTrack[] = [
      {
        id: 'track-1',
        title: 'Peaceful Morning',
        artist: 'Wellness Sounds',
        duration: 300,
        streamUrl: '/audio/peaceful-morning.mp3',
        mood: ['calm', 'energizing'],
        genre: ['ambient', 'nature'],
      },
      {
        id: 'track-2',
        title: 'Deep Focus',
        artist: 'Concentration Music',
        duration: 420,
        streamUrl: '/audio/deep-focus.mp3',
        mood: ['focused', 'calm'],
        genre: ['ambient', 'instrumental'],
      },
      {
        id: 'track-3',
        title: 'Evening Wind Down',
        artist: 'Relaxation Therapy',
        duration: 360,
        streamUrl: '/audio/evening-winddown.mp3',
        mood: ['relaxed', 'sleepy'],
        genre: ['ambient', 'meditation'],
      },
    ];

    this.playlists.set('default', defaultTracks);
  }

  async getRecommendations(
    userId: string,
    mood?: string,
    activityType?: string
  ): Promise<MusicTrack[]> {
    const preferences = this.userPreferences.get(userId);
    const allTracks = this.playlists.get('default') || [];

    // Filter based on mood and preferences
    let recommendations = allTracks;

    if (mood) {
      recommendations = recommendations.filter((track) =>
        track.mood?.includes(mood.toLowerCase())
      );
    }

    if (preferences) {
      // Prioritize user's preferred genres
      recommendations.sort((a, b) => {
        const aScore = a.genre?.filter((g) => preferences.genre.includes(g)).length || 0;
        const bScore = b.genre?.filter((g) => preferences.genre.includes(g)).length || 0;
        return bScore - aScore;
      });
    }

    return recommendations;
  }

  async createPersonalizedPlaylist(
    userId: string,
    name: string,
    criteria: {
      mood?: string[];
      genre?: string[];
      duration?: number;
    }
  ): Promise<MusicTrack[]> {
    const allTracks = this.playlists.get('default') || [];

    let filteredTracks = allTracks;

    if (criteria.mood) {
      filteredTracks = filteredTracks.filter((track) =>
        track.mood?.some((m) => criteria.mood?.includes(m))
      );
    }

    if (criteria.genre) {
      filteredTracks = filteredTracks.filter((track) =>
        track.genre?.some((g) => criteria.genre?.includes(g))
      );
    }

    // Create playlist
    const playlistId = `${userId}-${name}`;
    this.playlists.set(playlistId, filteredTracks);

    return filteredTracks;
  }

  async updateUserPreferences(
    userId: string,
    preferences: { mood: string[]; genre: string[] }
  ): Promise<void> {
    this.userPreferences.set(userId, preferences);
  }

  async getStreamUrl(trackId: string): Promise<string> {
    const allTracks = Array.from(this.playlists.values()).flat();
    const track = allTracks.find((t) => t.id === trackId);

    if (!track) {
      throw new Error('Track not found');
    }

    return track.streamUrl;
  }

  async searchTracks(query: string): Promise<MusicTrack[]> {
    const allTracks = Array.from(this.playlists.values()).flat();
    const lowerQuery = query.toLowerCase();

    return allTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(lowerQuery) ||
        track.artist.toLowerCase().includes(lowerQuery) ||
        track.genre?.some((g) => g.toLowerCase().includes(lowerQuery)) ||
        track.mood?.some((m) => m.toLowerCase().includes(lowerQuery))
    );
  }

  getUserPlaylists(userId: string): Map<string, MusicTrack[]> {
    const userPlaylists = new Map<string, MusicTrack[]>();

    for (const [key, value] of this.playlists.entries()) {
      if (key.startsWith(userId)) {
        userPlaylists.set(key, value);
      }
    }

    return userPlaylists;
  }
}
