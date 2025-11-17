// 🎧 SOUNDCLOUD SERVICE - Complete Integration with Offline Support
// Gothic Futurist Audio Sanctuary

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SoundCloudDB extends DBSchema {
  tracks: {
    key: number;
    value: SoundCloudTrack;
    indexes: { 'by-user': number; 'by-playlist': number };
  };
  playlists: {
    key: number;
    value: SoundCloudPlaylist;
  };
  users: {
    key: number;
    value: SoundCloudUser;
  };
}

export interface SoundCloudTrack {
  id: number;
  title: string;
  description: string;
  user: {
    id: number;
    username: string;
    avatarUrl: string;
  };
  artworkUrl: string;
  waveformUrl: string;
  streamUrl: string;
  duration: number;
  genre: string;
  tags: string;
  playbackCount: number;
  likesCount: number;
  commentCount: number;
  createdAt: string;
  playlistId?: number;
}

export interface SoundCloudPlaylist {
  id: number;
  title: string;
  description: string;
  user: {
    id: number;
    username: string;
    avatarUrl: string;
  };
  artworkUrl: string;
  trackCount: number;
  tracks?: SoundCloudTrack[];
  createdAt: string;
  duration: number;
}

export interface SoundCloudUser {
  id: number;
  username: string;
  fullName: string;
  avatarUrl: string;
  city: string;
  country: string;
  description: string;
  followersCount: number;
  followingsCount: number;
  trackCount: number;
  playlistCount: number;
}

class SoundCloudService {
  private db: IDBPDatabase<SoundCloudDB> | null = null;
  private clientId: string = '';

  async initialize() {
    this.db = await openDB<SoundCloudDB>('kol-soundcloud-db', 1, {
      upgrade(db) {
        // Tracks store
        const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
        trackStore.createIndex('by-user', 'user.id');
        trackStore.createIndex('by-playlist', 'playlistId');

        // Playlists store
        db.createObjectStore('playlists', { keyPath: 'id' });

        // Users store
        db.createObjectStore('users', { keyPath: 'id' });
      },
    });

    // Load client ID from localStorage
    this.clientId = localStorage.getItem('soundcloud_client_id') || '';
  }

  // 🔐 CONFIGURATION
  setClientId(clientId: string) {
    this.clientId = clientId;
    localStorage.setItem('soundcloud_client_id', clientId);
  }

  hasClientId(): boolean {
    return !!this.clientId;
  }

  // 🎵 API CALLS
  private async soundcloudRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    if (!this.clientId) {
      throw new Error('SoundCloud client ID not set');
    }

    const queryParams = new URLSearchParams({
      client_id: this.clientId,
      ...params
    });

    const response = await fetch(
      `https://api.soundcloud.com${endpoint}?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`SoundCloud API error: ${response.statusText}`);
    }

    return await response.json();
  }

  // SEARCH
  async searchTracks(query: string, limit: number = 50): Promise<SoundCloudTrack[]> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.soundcloudRequest('/tracks', {
        q: query,
        limit: limit.toString()
      });

      const tracks: SoundCloudTrack[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        user: {
          id: item.user.id,
          username: item.user.username,
          avatarUrl: item.user.avatar_url
        },
        artworkUrl: item.artwork_url || item.user.avatar_url,
        waveformUrl: item.waveform_url,
        streamUrl: item.stream_url,
        duration: item.duration,
        genre: item.genre || 'Unknown',
        tags: item.tag_list || '',
        playbackCount: item.playback_count || 0,
        likesCount: item.likes_count || 0,
        commentCount: item.comment_count || 0,
        createdAt: item.created_at
      }));

      // Cache tracks
      for (const track of tracks) {
        await this.db!.put('tracks', track);
      }

      return tracks;
    } catch (error) {
      console.error('SoundCloud search error:', error);
      // Return cached tracks
      const cached = await this.db!.getAll('tracks');
      return cached.filter(t => 
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    }
  }

  // TRACK DETAILS
  async getTrack(trackId: number): Promise<SoundCloudTrack | null> {
    if (!this.db) await this.initialize();

    try {
      const item = await this.soundcloudRequest(`/tracks/${trackId}`);

      const track: SoundCloudTrack = {
        id: item.id,
        title: item.title,
        description: item.description || '',
        user: {
          id: item.user.id,
          username: item.user.username,
          avatarUrl: item.user.avatar_url
        },
        artworkUrl: item.artwork_url || item.user.avatar_url,
        waveformUrl: item.waveform_url,
        streamUrl: item.stream_url,
        duration: item.duration,
        genre: item.genre || 'Unknown',
        tags: item.tag_list || '',
        playbackCount: item.playback_count || 0,
        likesCount: item.likes_count || 0,
        commentCount: item.comment_count || 0,
        createdAt: item.created_at
      };

      await this.db!.put('tracks', track);
      return track;
    } catch (error) {
      const cached = await this.db!.get('tracks', trackId);
      return cached || null;
    }
  }

  // PLAYLIST
  async getPlaylist(playlistId: number): Promise<SoundCloudPlaylist | null> {
    if (!this.db) await this.initialize();

    try {
      const item = await this.soundcloudRequest(`/playlists/${playlistId}`);

      const playlist: SoundCloudPlaylist = {
        id: item.id,
        title: item.title,
        description: item.description || '',
        user: {
          id: item.user.id,
          username: item.user.username,
          avatarUrl: item.user.avatar_url
        },
        artworkUrl: item.artwork_url || item.user.avatar_url,
        trackCount: item.track_count || 0,
        tracks: item.tracks?.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          user: {
            id: t.user.id,
            username: t.user.username,
            avatarUrl: t.user.avatar_url
          },
          artworkUrl: t.artwork_url || t.user.avatar_url,
          waveformUrl: t.waveform_url,
          streamUrl: t.stream_url,
          duration: t.duration,
          genre: t.genre || 'Unknown',
          tags: t.tag_list || '',
          playbackCount: t.playback_count || 0,
          likesCount: t.likes_count || 0,
          commentCount: t.comment_count || 0,
          createdAt: t.created_at,
          playlistId: playlistId
        })),
        createdAt: item.created_at,
        duration: item.duration || 0
      };

      await this.db!.put('playlists', playlist);

      // Cache tracks
      if (playlist.tracks) {
        for (const track of playlist.tracks) {
          await this.db!.put('tracks', track);
        }
      }

      return playlist;
    } catch (error) {
      const cached = await this.db!.get('playlists', playlistId);
      return cached || null;
    }
  }

  // USER
  async getUser(userId: number): Promise<SoundCloudUser | null> {
    if (!this.db) await this.initialize();

    try {
      const item = await this.soundcloudRequest(`/users/${userId}`);

      const user: SoundCloudUser = {
        id: item.id,
        username: item.username,
        fullName: item.full_name || item.username,
        avatarUrl: item.avatar_url,
        city: item.city || '',
        country: item.country || '',
        description: item.description || '',
        followersCount: item.followers_count || 0,
        followingsCount: item.followings_count || 0,
        trackCount: item.track_count || 0,
        playlistCount: item.playlist_count || 0
      };

      await this.db!.put('users', user);
      return user;
    } catch (error) {
      const cached = await this.db!.get('users', userId);
      return cached || null;
    }
  }

  async getUserTracks(userId: number, limit: number = 50): Promise<SoundCloudTrack[]> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.soundcloudRequest(`/users/${userId}/tracks`, {
        limit: limit.toString()
      });

      const tracks: SoundCloudTrack[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        user: {
          id: item.user.id,
          username: item.user.username,
          avatarUrl: item.user.avatar_url
        },
        artworkUrl: item.artwork_url || item.user.avatar_url,
        waveformUrl: item.waveform_url,
        streamUrl: item.stream_url,
        duration: item.duration,
        genre: item.genre || 'Unknown',
        tags: item.tag_list || '',
        playbackCount: item.playback_count || 0,
        likesCount: item.likes_count || 0,
        commentCount: item.comment_count || 0,
        createdAt: item.created_at
      }));

      for (const track of tracks) {
        await this.db!.put('tracks', track);
      }

      return tracks;
    } catch (error) {
      const cached = await this.db!.getAllFromIndex('tracks', 'by-user', userId);
      return cached;
    }
  }

  // GENRE CHARTS
  async getGenreChart(genre: string, limit: number = 50): Promise<SoundCloudTrack[]> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.soundcloudRequest('/tracks', {
        genres: genre,
        limit: limit.toString(),
        order: 'hotness'
      });

      const tracks: SoundCloudTrack[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        user: {
          id: item.user.id,
          username: item.user.username,
          avatarUrl: item.user.avatar_url
        },
        artworkUrl: item.artwork_url || item.user.avatar_url,
        waveformUrl: item.waveform_url,
        streamUrl: item.stream_url,
        duration: item.duration,
        genre: item.genre || 'Unknown',
        tags: item.tag_list || '',
        playbackCount: item.playback_count || 0,
        likesCount: item.likes_count || 0,
        commentCount: item.comment_count || 0,
        createdAt: item.created_at
      }));

      return tracks;
    } catch (error) {
      console.error('SoundCloud genre chart error:', error);
      return [];
    }
  }

  // UTILITY
  formatDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  getStreamUrl(track: SoundCloudTrack): string {
    return `${track.streamUrl}?client_id=${this.clientId}`;
  }
}

export const soundcloudService = new SoundCloudService();
