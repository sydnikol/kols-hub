// 🎵 SPOTIFY SERVICE - Complete Integration with Offline Support
// Gothic Futurist Music Sanctuary

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SpotifyDB extends DBSchema {
  tracks: {
    key: string;
    value: SpotifyTrack;
    indexes: { 'by-playlist': string };
  };
  playlists: {
    key: string;
    value: SpotifyPlaylist;
  };
  albums: {
    key: string;
    value: SpotifyAlbum;
  };
  userProfile: {
    key: string;
    value: SpotifyProfile;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  albumArt: string;
  duration: number;
  uri: string;
  previewUrl?: string;
  popularity: number;
  addedAt?: string;
  playlistId?: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  owner: string;
  images: string[];
  trackCount: number;
  tracks?: SpotifyTrack[];
  public: boolean;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: string[];
  releaseDate: string;
  images: string[];
  trackCount: number;
  genres: string[];
}

export interface SpotifyProfile {
  id: string;
  displayName: string;
  email: string;
  images: string[];
  followers: number;
  country: string;
  product: string; // 'premium' | 'free'
}

class SpotifyService {
  private db: IDBPDatabase<SpotifyDB> | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private clientId: string = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
  private clientSecret: string = '';
  
  // Auto-detect redirect URI based on environment
  private get redirectUri(): string {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDev) {
      return import.meta.env.VITE_SPOTIFY_REDIRECT_URI_DEV || 'http://localhost:5173/callback/spotify';
    }
    // Production - use Netlify URL or current origin
    return import.meta.env.VITE_SPOTIFY_REDIRECT_URI || `${window.location.origin}/callback/spotify`;
  }

  async initialize() {
    this.db = await openDB<SpotifyDB>('kol-spotify-db', 1, {
      upgrade(db) {
        // Tracks store
        const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
        trackStore.createIndex('by-playlist', 'playlistId');

        // Playlists store
        db.createObjectStore('playlists', { keyPath: 'id' });

        // Albums store
        db.createObjectStore('albums', { keyPath: 'id' });

        // User profile store
        db.createObjectStore('userProfile', { keyPath: 'id' });
      },
    });

    // Load tokens from localStorage
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    this.tokenExpiry = expiry ? parseInt(expiry) : null;

    // Load credentials - prefer environment variables, fallback to localStorage
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || localStorage.getItem('spotify_client_id') || '';
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || localStorage.getItem('spotify_client_secret') || '';
    
    console.log('🎵 Spotify Service initialized');
    console.log('   Client ID:', this.clientId ? '✅ Set' : '❌ Missing');
    console.log('   Redirect URI:', this.redirectUri);
  }

  // 🔐 AUTHENTICATION
  setCredentials(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    localStorage.setItem('spotify_client_id', clientId);
    localStorage.setItem('spotify_client_secret', clientSecret);
  }

  getAuthUrl(): string {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-library-read',
      'user-top-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'user-read-recently-played',
      'streaming'
    ].join(' ');

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: scopes,
      show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async handleCallback(code: string): Promise<boolean> {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.redirectUri
        })
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000);

        localStorage.setItem('spotify_access_token', this.accessToken);
        localStorage.setItem('spotify_refresh_token', this.refreshToken);
        localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString());

        return true;
      }
      return false;
    } catch (error) {
      console.error('Spotify auth error:', error);
      return false;
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`)
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken
        })
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.tokenExpiry = Date.now() + (data.expires_in * 1000);

        localStorage.setItem('spotify_access_token', this.accessToken);
        localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString());

        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  private async ensureValidToken(): Promise<boolean> {
    if (!this.accessToken) return false;
    
    if (this.tokenExpiry && Date.now() >= this.tokenExpiry - 60000) {
      return await this.refreshAccessToken();
    }
    
    return true;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken && !!this.tokenExpiry && Date.now() < this.tokenExpiry;
  }

  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
  }

  // 🎵 API CALLS
  private async spotifyRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    await this.ensureValidToken();

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    return await response.json();
  }

  // USER PROFILE
  async getUserProfile(): Promise<SpotifyProfile> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.spotifyRequest('/me');
      
      const profile: SpotifyProfile = {
        id: data.id,
        displayName: data.display_name,
        email: data.email,
        images: data.images?.map((img: any) => img.url) || [],
        followers: data.followers?.total || 0,
        country: data.country,
        product: data.product
      };

      await this.db!.put('userProfile', profile);
      return profile;
    } catch (error) {
      // Return cached profile
      const cached = await this.db!.get('userProfile', this.accessToken!);
      if (cached) return cached;
      throw error;
    }
  }

  // PLAYLISTS
  async getUserPlaylists(): Promise<SpotifyPlaylist[]> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.spotifyRequest('/me/playlists?limit=50');
      
      const playlists: SpotifyPlaylist[] = data.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        owner: item.owner.display_name,
        images: item.images?.map((img: any) => img.url) || [],
        trackCount: item.tracks.total,
        public: item.public
      }));

      // Cache playlists
      for (const playlist of playlists) {
        await this.db!.put('playlists', playlist);
      }

      return playlists;
    } catch (error) {
      // Return cached playlists
      const cached = await this.db!.getAll('playlists');
      if (cached.length > 0) return cached;
      throw error;
    }
  }

  async getPlaylistTracks(playlistId: string): Promise<SpotifyTrack[]> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.spotifyRequest(`/playlists/${playlistId}/tracks?limit=100`);
      
      const tracks: SpotifyTrack[] = data.items.map((item: any) => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map((a: any) => a.name),
        album: item.track.album.name,
        albumArt: item.track.album.images[0]?.url || '',
        duration: item.track.duration_ms,
        uri: item.track.uri,
        previewUrl: item.track.preview_url,
        popularity: item.track.popularity,
        addedAt: item.added_at,
        playlistId: playlistId
      }));

      // Cache tracks
      for (const track of tracks) {
        await this.db!.put('tracks', track);
      }

      return tracks;
    } catch (error) {
      // Return cached tracks
      const cached = await this.db!.getAllFromIndex('tracks', 'by-playlist', playlistId);
      if (cached.length > 0) return cached;
      throw error;
    }
  }

  // SEARCH
  async search(query: string, type: 'track' | 'album' | 'playlist' = 'track', limit: number = 20): Promise<any> {
    const data = await this.spotifyRequest(
      `/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`
    );

    if (type === 'track') {
      return data.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map((a: any) => a.name),
        album: track.album.name,
        albumArt: track.album.images[0]?.url || '',
        duration: track.duration_ms,
        uri: track.uri,
        previewUrl: track.preview_url,
        popularity: track.popularity
      }));
    }

    return data[type + 's'].items;
  }

  // RECENTLY PLAYED
  async getRecentlyPlayed(): Promise<SpotifyTrack[]> {
    const data = await this.spotifyRequest('/me/player/recently-played?limit=50');
    
    return data.items.map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((a: any) => a.name),
      album: item.track.album.name,
      albumArt: item.track.album.images[0]?.url || '',
      duration: item.track.duration_ms,
      uri: item.track.uri,
      previewUrl: item.track.preview_url,
      popularity: item.track.popularity,
      addedAt: item.played_at
    }));
  }

  // TOP TRACKS
  async getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term'): Promise<SpotifyTrack[]> {
    const data = await this.spotifyRequest(`/me/top/tracks?time_range=${timeRange}&limit=50`);
    
    return data.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => a.name),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || '',
      duration: track.duration_ms,
      uri: track.uri,
      previewUrl: track.preview_url,
      popularity: track.popularity
    }));
  }

  // RECOMMENDATIONS
  async getRecommendations(seedTracks: string[], limit: number = 20): Promise<SpotifyTrack[]> {
    const seeds = seedTracks.slice(0, 5).join(',');
    const data = await this.spotifyRequest(`/recommendations?seed_tracks=${seeds}&limit=${limit}`);
    
    return data.tracks.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => a.name),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || '',
      duration: track.duration_ms,
      uri: track.uri,
      previewUrl: track.preview_url,
      popularity: track.popularity
    }));
  }
}

export const spotifyService = new SpotifyService();
