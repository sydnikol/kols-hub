/**
 * Spotify Web API & Playback SDK Integration
 * Complete integration for KOL Hub music features
 * APIs: Web API, Web Playback SDK, Android SDK
 */

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  album: string;
  albumArt: string;
  duration: number;
  previewUrl?: string;
  uri: string;
  popularity: number;
  explicit: boolean;
  releaseDate: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  owner: string;
  trackCount: number;
  public: boolean;
  collaborative: boolean;
  uri: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: string[];
  imageUrl: string;
  releaseDate: string;
  totalTracks: number;
  uri: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  imageUrl: string;
  genres: string[];
  followers: number;
  popularity: number;
  uri: string;
}

export interface SpotifyUserProfile {
  id: string;
  displayName: string;
  email: string;
  imageUrl: string;
  followers: number;
  country: string;
  product: string; // premium, free
}

export interface SpotifyPlaybackState {
  isPlaying: boolean;
  track: SpotifyTrack | null;
  position: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'track' | 'context';
  device: {
    id: string;
    name: string;
    type: string;
    volume: number;
  } | null;
}

export class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private baseUrl = 'https://api.spotify.com/v1';
  private player: any = null; // Spotify Web Playback SDK player

  constructor() {
    this.clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || '';

    // Dynamically set redirect URI based on environment
    this.redirectUri = this.getRedirectUri();

    // Load tokens from localStorage
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
  }

  /**
   * Get appropriate redirect URI based on environment
   */
  private getRedirectUri(): string {
    // Check if running in Capacitor (Android/iOS app)
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;

      // Android/iOS app with custom scheme
      if (protocol === 'kolhub:' || protocol === 'com.kolhub.app:') {
        return import.meta.env.VITE_SPOTIFY_REDIRECT_URI_ANDROID || 'kolhub://spotify/callback';
      }

      // Production web (Netlify)
      if (import.meta.env.PROD || window.location.hostname.includes('netlify.app')) {
        return import.meta.env.VITE_SPOTIFY_REDIRECT_URI_PROD || 'https://kolhub.netlify.app/spotify/callback';
      }
    }

    // Development (local)
    return import.meta.env.VITE_SPOTIFY_REDIRECT_URI_DEV || 'http://localhost:5173/spotify/callback';
  }

  /**
   * AUTHENTICATION
   */

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthorizationUrl(): string {
    const scopes = [
      'user-read-email',
      'user-read-private',
      'user-library-read',
      'user-library-modify',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'user-read-recently-played',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private',
      'streaming',
      'user-top-read',
      'user-read-playback-position'
    ];

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: scopes.join(' '),
      show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async authenticateWithCode(code: string): Promise<void> {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.redirectUri
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Spotify authentication failed: ${data.error_description}`);
    }

    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;

    localStorage.setItem('spotify_access_token', this.accessToken);
    localStorage.setItem('spotify_refresh_token', this.refreshToken);
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) throw new Error('No refresh token available');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      })
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    localStorage.setItem('spotify_access_token', this.accessToken);
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  /**
   * Logout
   */
  logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    if (this.player) {
      this.player.disconnect();
      this.player = null;
    }
  }

  /**
   * SEARCH
   */

  /**
   * Search for tracks, albums, artists, or playlists
   */
  async search(
    query: string,
    type: 'track' | 'album' | 'artist' | 'playlist' = 'track',
    limit: number = 20
  ): Promise<any> {
    const params = new URLSearchParams({
      q: query,
      type,
      limit: limit.toString(),
      market: 'US'
    });

    const response = await this.makeRequest(`/search?${params}`);
    return response[`${type}s`].items;
  }

  /**
   * Search tracks
   */
  async searchTracks(query: string, limit: number = 20): Promise<SpotifyTrack[]> {
    const results = await this.search(query, 'track', limit);
    return results.map((track: any) => this.formatTrack(track));
  }

  /**
   * Search albums
   */
  async searchAlbums(query: string, limit: number = 20): Promise<SpotifyAlbum[]> {
    const results = await this.search(query, 'album', limit);
    return results.map((album: any) => this.formatAlbum(album));
  }

  /**
   * Search artists
   */
  async searchArtists(query: string, limit: number = 20): Promise<SpotifyArtist[]> {
    const results = await this.search(query, 'artist', limit);
    return results.map((artist: any) => this.formatArtist(artist));
  }

  /**
   * USER PROFILE & LIBRARY
   */

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<SpotifyUserProfile> {
    const user = await this.makeRequest('/me');
    return {
      id: user.id,
      displayName: user.display_name,
      email: user.email,
      imageUrl: user.images?.[0]?.url || '',
      followers: user.followers.total,
      country: user.country,
      product: user.product
    };
  }

  /**
   * Get user's saved tracks
   */
  async getSavedTracks(limit: number = 50, offset: number = 0): Promise<SpotifyTrack[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });

    const response = await this.makeRequest(`/me/tracks?${params}`);
    return response.items.map((item: any) => this.formatTrack(item.track));
  }

  /**
   * Save tracks to library
   */
  async saveTracks(trackIds: string[]): Promise<void> {
    await this.makeRequest('/me/tracks', {
      method: 'PUT',
      body: JSON.stringify({ ids: trackIds })
    });
  }

  /**
   * Remove tracks from library
   */
  async removeTracks(trackIds: string[]): Promise<void> {
    await this.makeRequest('/me/tracks', {
      method: 'DELETE',
      body: JSON.stringify({ ids: trackIds })
    });
  }

  /**
   * Check if tracks are saved
   */
  async checkSavedTracks(trackIds: string[]): Promise<boolean[]> {
    const params = new URLSearchParams({
      ids: trackIds.join(',')
    });

    return await this.makeRequest(`/me/tracks/contains?${params}`);
  }

  /**
   * PLAYLISTS
   */

  /**
   * Get user's playlists
   */
  async getUserPlaylists(limit: number = 50): Promise<SpotifyPlaylist[]> {
    const params = new URLSearchParams({
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/me/playlists?${params}`);
    return response.items.map((playlist: any) => this.formatPlaylist(playlist));
  }

  /**
   * Get playlist details
   */
  async getPlaylist(playlistId: string): Promise<SpotifyPlaylist & { tracks: SpotifyTrack[] }> {
    const playlist = await this.makeRequest(`/playlists/${playlistId}`);

    return {
      ...this.formatPlaylist(playlist),
      tracks: playlist.tracks.items.map((item: any) => this.formatTrack(item.track))
    };
  }

  /**
   * Create new playlist
   */
  async createPlaylist(
    name: string,
    description: string = '',
    isPublic: boolean = false
  ): Promise<SpotifyPlaylist> {
    const user = await this.getCurrentUser();

    const playlist = await this.makeRequest(`/users/${user.id}/playlists`, {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        public: isPublic
      })
    });

    return this.formatPlaylist(playlist);
  }

  /**
   * Add tracks to playlist
   */
  async addTracksToPlaylist(playlistId: string, trackUris: string[]): Promise<void> {
    await this.makeRequest(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({ uris: trackUris })
    });
  }

  /**
   * Remove tracks from playlist
   */
  async removeTracksFromPlaylist(playlistId: string, trackUris: string[]): Promise<void> {
    await this.makeRequest(`/playlists/${playlistId}/tracks`, {
      method: 'DELETE',
      body: JSON.stringify({
        tracks: trackUris.map(uri => ({ uri }))
      })
    });
  }

  /**
   * PLAYBACK CONTROL
   */

  /**
   * Initialize Spotify Web Playback SDK
   */
  async initializePlayer(): Promise<void> {
    if (this.player) return;

    return new Promise((resolve, reject) => {
      if (!(window as any).Spotify) {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      }

      (window as any).onSpotifyWebPlaybackSDKReady = () => {
        this.player = new (window as any).Spotify.Player({
          name: 'KOL Hub Web Player',
          getOAuthToken: (cb: any) => {
            cb(this.accessToken);
          },
          volume: 0.5
        });

        // Error handling
        this.player.addListener('initialization_error', ({ message }: any) => {
          console.error('Initialization error:', message);
          reject(message);
        });

        this.player.addListener('authentication_error', ({ message }: any) => {
          console.error('Authentication error:', message);
          this.refreshAccessToken();
        });

        this.player.addListener('account_error', ({ message }: any) => {
          console.error('Account error:', message);
          reject(message);
        });

        // Ready
        this.player.addListener('ready', ({ device_id }: any) => {
          console.log('Spotify player ready with device ID:', device_id);
          resolve();
        });

        // Connect
        this.player.connect();
      };
    });
  }

  /**
   * Get current playback state
   */
  async getPlaybackState(): Promise<SpotifyPlaybackState | null> {
    try {
      const state = await this.makeRequest('/me/player');

      if (!state) return null;

      return {
        isPlaying: state.is_playing,
        track: state.item ? this.formatTrack(state.item) : null,
        position: state.progress_ms,
        duration: state.item?.duration_ms || 0,
        volume: state.device.volume_percent,
        shuffle: state.shuffle_state,
        repeat: state.repeat_state,
        device: {
          id: state.device.id,
          name: state.device.name,
          type: state.device.type,
          volume: state.device.volume_percent
        }
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Play track or context (album, playlist)
   */
  async play(uri?: string, uris?: string[]): Promise<void> {
    const body: any = {};

    if (uri) {
      // Play album or playlist
      body.context_uri = uri;
    } else if (uris) {
      // Play specific tracks
      body.uris = uris;
    }

    await this.makeRequest('/me/player/play', {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  /**
   * Pause playback
   */
  async pause(): Promise<void> {
    await this.makeRequest('/me/player/pause', { method: 'PUT' });
  }

  /**
   * Skip to next track
   */
  async next(): Promise<void> {
    await this.makeRequest('/me/player/next', { method: 'POST' });
  }

  /**
   * Skip to previous track
   */
  async previous(): Promise<void> {
    await this.makeRequest('/me/player/previous', { method: 'POST' });
  }

  /**
   * Seek to position (ms)
   */
  async seek(positionMs: number): Promise<void> {
    const params = new URLSearchParams({
      position_ms: positionMs.toString()
    });

    await this.makeRequest(`/me/player/seek?${params}`, { method: 'PUT' });
  }

  /**
   * Set volume (0-100)
   */
  async setVolume(volume: number): Promise<void> {
    const params = new URLSearchParams({
      volume_percent: Math.max(0, Math.min(100, volume)).toString()
    });

    await this.makeRequest(`/me/player/volume?${params}`, { method: 'PUT' });
  }

  /**
   * Toggle shuffle
   */
  async setShuffle(state: boolean): Promise<void> {
    const params = new URLSearchParams({
      state: state.toString()
    });

    await this.makeRequest(`/me/player/shuffle?${params}`, { method: 'PUT' });
  }

  /**
   * Set repeat mode
   */
  async setRepeat(mode: 'off' | 'track' | 'context'): Promise<void> {
    const params = new URLSearchParams({
      state: mode
    });

    await this.makeRequest(`/me/player/repeat?${params}`, { method: 'PUT' });
  }

  /**
   * RECOMMENDATIONS & DISCOVERY
   */

  /**
   * Get user's top tracks
   */
  async getTopTracks(
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20
  ): Promise<SpotifyTrack[]> {
    const params = new URLSearchParams({
      time_range: timeRange,
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/me/top/tracks?${params}`);
    return response.items.map((track: any) => this.formatTrack(track));
  }

  /**
   * Get user's top artists
   */
  async getTopArtists(
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
    limit: number = 20
  ): Promise<SpotifyArtist[]> {
    const params = new URLSearchParams({
      time_range: timeRange,
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/me/top/artists?${params}`);
    return response.items.map((artist: any) => this.formatArtist(artist));
  }

  /**
   * Get recently played tracks
   */
  async getRecentlyPlayed(limit: number = 20): Promise<SpotifyTrack[]> {
    const params = new URLSearchParams({
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/me/player/recently-played?${params}`);
    return response.items.map((item: any) => this.formatTrack(item.track));
  }

  /**
   * Get recommendations based on seed tracks, artists, or genres
   */
  async getRecommendations(params: {
    seedTracks?: string[];
    seedArtists?: string[];
    seedGenres?: string[];
    limit?: number;
  }): Promise<SpotifyTrack[]> {
    const queryParams = new URLSearchParams({
      limit: (params.limit || 20).toString()
    });

    if (params.seedTracks?.length) {
      queryParams.set('seed_tracks', params.seedTracks.join(','));
    }
    if (params.seedArtists?.length) {
      queryParams.set('seed_artists', params.seedArtists.join(','));
    }
    if (params.seedGenres?.length) {
      queryParams.set('seed_genres', params.seedGenres.join(','));
    }

    const response = await this.makeRequest(`/recommendations?${queryParams}`);
    return response.tracks.map((track: any) => this.formatTrack(track));
  }

  /**
   * HELPER METHODS
   */

  /**
   * Make authenticated request to Spotify API
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Spotify');
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      await this.refreshAccessToken();
      return this.makeRequest(endpoint, options);
    }

    if (response.status === 204) {
      // No content response (success)
      return null;
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Spotify API error: ${data.error.message}`);
    }

    return data;
  }

  /**
   * Format track data
   */
  private formatTrack(track: any): SpotifyTrack {
    return {
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => a.name),
      album: track.album.name,
      albumArt: track.album.images[0]?.url || '',
      duration: track.duration_ms,
      previewUrl: track.preview_url,
      uri: track.uri,
      popularity: track.popularity,
      explicit: track.explicit,
      releaseDate: track.album.release_date
    };
  }

  /**
   * Format album data
   */
  private formatAlbum(album: any): SpotifyAlbum {
    return {
      id: album.id,
      name: album.name,
      artists: album.artists.map((a: any) => a.name),
      imageUrl: album.images[0]?.url || '',
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
      uri: album.uri
    };
  }

  /**
   * Format artist data
   */
  private formatArtist(artist: any): SpotifyArtist {
    return {
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url || '',
      genres: artist.genres || [],
      followers: artist.followers?.total || 0,
      popularity: artist.popularity || 0,
      uri: artist.uri
    };
  }

  /**
   * Format playlist data
   */
  private formatPlaylist(playlist: any): SpotifyPlaylist {
    return {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      imageUrl: playlist.images[0]?.url || '',
      owner: playlist.owner.display_name,
      trackCount: playlist.tracks.total,
      public: playlist.public,
      collaborative: playlist.collaborative,
      uri: playlist.uri
    };
  }

  /**
   * Convert milliseconds to MM:SS format
   */
  formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Singleton instance
export const spotifyService = new SpotifyService();
export default spotifyService;
