/**
 * SoundCloud API Integration
 * Complete integration for KOL Hub music features
 * Complements Spotify with independent artist content
 */

export interface SoundCloudTrack {
  id: number;
  title: string;
  description: string;
  duration: number;
  genre: string;
  tagList: string;
  uri: string;
  streamUrl: string;
  downloadUrl?: string;
  artworkUrl: string;
  waveformUrl: string;
  playbackCount: number;
  downloadCount: number;
  favoritingsCount: number;
  commentCount: number;
  createdAt: string;
  user: {
    id: number;
    username: string;
    avatarUrl: string;
    permalinkUrl: string;
  };
  isStreamable: boolean;
  isDownloadable: boolean;
  permalink: string;
}

export interface SoundCloudUser {
  id: number;
  username: string;
  fullName: string;
  description: string;
  avatarUrl: string;
  city: string;
  country: string;
  followersCount: number;
  followingsCount: number;
  trackCount: number;
  playlistCount: number;
  permalinkUrl: string;
}

export interface SoundCloudPlaylist {
  id: number;
  title: string;
  description: string;
  duration: number;
  artworkUrl: string;
  trackCount: number;
  permalink: string;
  uri: string;
  user: {
    id: number;
    username: string;
    avatarUrl: string;
  };
  tracks: SoundCloudTrack[];
}

export class SoundCloudService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private baseUrl = 'https://api.soundcloud.com';
  private v2BaseUrl = 'https://api-v2.soundcloud.com';

  constructor() {
    this.clientId = import.meta.env.VITE_SOUNDCLOUD_CLIENT_ID || '';
    this.clientSecret = import.meta.env.VITE_SOUNDCLOUD_CLIENT_SECRET || '';

    // Dynamically set redirect URI based on environment
    this.redirectUri = this.getRedirectUri();

    // Load token from localStorage
    this.accessToken = localStorage.getItem('soundcloud_access_token');
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
        return import.meta.env.VITE_SOUNDCLOUD_REDIRECT_URI_ANDROID || 'kolhub://soundcloud/callback';
      }

      // Production web (Netlify)
      if (import.meta.env.PROD || window.location.hostname.includes('netlify.app')) {
        return import.meta.env.VITE_SOUNDCLOUD_REDIRECT_URI_PROD || 'https://kolhub.netlify.app/soundcloud/callback';
      }
    }

    // Development (local)
    return import.meta.env.VITE_SOUNDCLOUD_REDIRECT_URI_DEV || 'http://localhost:5173/soundcloud/callback';
  }

  /**
   * AUTHENTICATION
   */

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: 'non-expiring'
    });

    return `https://soundcloud.com/connect?${params}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async authenticateWithCode(code: string): Promise<void> {
    const response = await fetch('https://api.soundcloud.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`SoundCloud authentication failed: ${data.error_description}`);
    }

    this.accessToken = data.access_token;
    localStorage.setItem('soundcloud_access_token', this.accessToken);
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
    localStorage.removeItem('soundcloud_access_token');
  }

  /**
   * SEARCH
   */

  /**
   * Search tracks
   */
  async searchTracks(query: string, limit: number = 20, offset: number = 0): Promise<SoundCloudTrack[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
      client_id: this.clientId
    });

    const response = await this.makeRequest(`/tracks?${params}`);
    return response.map((track: any) => this.formatTrack(track));
  }

  /**
   * Search users/artists
   */
  async searchUsers(query: string, limit: number = 20): Promise<SoundCloudUser[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      client_id: this.clientId
    });

    const response = await this.makeRequest(`/users?${params}`);
    return response.map((user: any) => this.formatUser(user));
  }

  /**
   * Search playlists
   */
  async searchPlaylists(query: string, limit: number = 20): Promise<SoundCloudPlaylist[]> {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      client_id: this.clientId
    });

    const response = await this.makeRequest(`/playlists?${params}`);
    return response.map((playlist: any) => this.formatPlaylist(playlist));
  }

  /**
   * TRACKS
   */

  /**
   * Get track by ID
   */
  async getTrack(trackId: number): Promise<SoundCloudTrack> {
    const params = new URLSearchParams({
      client_id: this.clientId
    });

    const track = await this.makeRequest(`/tracks/${trackId}?${params}`);
    return this.formatTrack(track);
  }

  /**
   * Get track stream URL
   */
  async getStreamUrl(trackId: number): Promise<string> {
    const params = new URLSearchParams({
      client_id: this.clientId
    });

    const response = await this.makeRequest(`/tracks/${trackId}/stream?${params}`);
    return response.location || response.url;
  }

  /**
   * Get related tracks
   */
  async getRelatedTracks(trackId: number, limit: number = 10): Promise<SoundCloudTrack[]> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/tracks/${trackId}/related?${params}`);
    return response.map((track: any) => this.formatTrack(track));
  }

  /**
   * USERS
   */

  /**
   * Get current user (requires authentication)
   */
  async getCurrentUser(): Promise<SoundCloudUser> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const params = new URLSearchParams({
      oauth_token: this.accessToken
    });

    const user = await this.makeRequest(`/me?${params}`);
    return this.formatUser(user);
  }

  /**
   * Get user by ID
   */
  async getUser(userId: number): Promise<SoundCloudUser> {
    const params = new URLSearchParams({
      client_id: this.clientId
    });

    const user = await this.makeRequest(`/users/${userId}?${params}`);
    return this.formatUser(user);
  }

  /**
   * Get user's tracks
   */
  async getUserTracks(userId: number, limit: number = 50): Promise<SoundCloudTrack[]> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/users/${userId}/tracks?${params}`);
    return response.map((track: any) => this.formatTrack(track));
  }

  /**
   * Get user's playlists
   */
  async getUserPlaylists(userId: number): Promise<SoundCloudPlaylist[]> {
    const params = new URLSearchParams({
      client_id: this.clientId
    });

    const response = await this.makeRequest(`/users/${userId}/playlists?${params}`);
    return response.map((playlist: any) => this.formatPlaylist(playlist));
  }

  /**
   * Get user's favorites
   */
  async getUserFavorites(userId: number, limit: number = 50): Promise<SoundCloudTrack[]> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/users/${userId}/favorites?${params}`);
    return response.map((track: any) => this.formatTrack(track));
  }

  /**
   * Get user's followers
   */
  async getUserFollowers(userId: number, limit: number = 50): Promise<SoundCloudUser[]> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/users/${userId}/followers?${params}`);
    return response.map((user: any) => this.formatUser(user));
  }

  /**
   * Get user's followings
   */
  async getUserFollowings(userId: number, limit: number = 50): Promise<SoundCloudUser[]> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/users/${userId}/followings?${params}`);
    return response.map((user: any) => this.formatUser(user));
  }

  /**
   * PLAYLISTS
   */

  /**
   * Get playlist by ID
   */
  async getPlaylist(playlistId: number): Promise<SoundCloudPlaylist> {
    const params = new URLSearchParams({
      client_id: this.clientId
    });

    const playlist = await this.makeRequest(`/playlists/${playlistId}?${params}`);
    return this.formatPlaylist(playlist);
  }

  /**
   * FAVORITES (requires authentication)
   */

  /**
   * Get my favorites
   */
  async getMyFavorites(limit: number = 50): Promise<SoundCloudTrack[]> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const params = new URLSearchParams({
      oauth_token: this.accessToken,
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/me/favorites?${params}`);
    return response.map((track: any) => this.formatTrack(track));
  }

  /**
   * Add track to favorites
   */
  async addFavorite(trackId: number): Promise<void> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const params = new URLSearchParams({
      oauth_token: this.accessToken
    });

    await this.makeRequest(`/me/favorites/${trackId}?${params}`, {
      method: 'PUT'
    });
  }

  /**
   * Remove track from favorites
   */
  async removeFavorite(trackId: number): Promise<void> {
    if (!this.accessToken) throw new Error('Not authenticated');

    const params = new URLSearchParams({
      oauth_token: this.accessToken
    });

    await this.makeRequest(`/me/favorites/${trackId}?${params}`, {
      method: 'DELETE'
    });
  }

  /**
   * DISCOVERY
   */

  /**
   * Get trending tracks
   */
  async getTrendingTracks(genre?: string, limit: number = 20): Promise<SoundCloudTrack[]> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      kind: 'trending',
      limit: limit.toString()
    });

    if (genre) {
      params.set('genre', genre);
    }

    const response = await this.makeRequest(`/tracks?${params}`);
    return response.map((track: any) => this.formatTrack(track));
  }

  /**
   * Get tracks by genre
   */
  async getTracksByGenre(genre: string, limit: number = 20): Promise<SoundCloudTrack[]> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      genres: genre,
      limit: limit.toString()
    });

    const response = await this.makeRequest(`/tracks?${params}`);
    return response.map((track: any) => this.formatTrack(track));
  }

  /**
   * Get chart tracks (popular)
   */
  async getChartTracks(genre?: string, limit: number = 50): Promise<SoundCloudTrack[]> {
    const params = new URLSearchParams({
      client_id: this.clientId,
      kind: 'top',
      limit: limit.toString()
    });

    if (genre) {
      params.set('genre', genre);
    }

    // Use v2 API for charts
    const response = await this.makeRequest(`/charts?${params}`, {}, this.v2BaseUrl);
    return response.collection?.map((track: any) => this.formatTrack(track.track)) || [];
  }

  /**
   * RESOLVE URL
   */

  /**
   * Resolve SoundCloud URL to get track/playlist/user data
   */
  async resolveUrl(url: string): Promise<any> {
    const params = new URLSearchParams({
      url,
      client_id: this.clientId
    });

    return await this.makeRequest(`/resolve?${params}`);
  }

  /**
   * HELPER METHODS
   */

  /**
   * Make request to SoundCloud API
   */
  private async makeRequest(
    endpoint: string,
    options: RequestInit = {},
    baseUrl: string = this.baseUrl
  ): Promise<any> {
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`SoundCloud API error: ${error.error || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Format track data
   */
  private formatTrack(track: any): SoundCloudTrack {
    return {
      id: track.id,
      title: track.title,
      description: track.description || '',
      duration: track.duration,
      genre: track.genre || '',
      tagList: track.tag_list || '',
      uri: track.uri,
      streamUrl: track.stream_url || '',
      downloadUrl: track.download_url,
      artworkUrl: track.artwork_url || track.user?.avatar_url || '',
      waveformUrl: track.waveform_url || '',
      playbackCount: track.playback_count || 0,
      downloadCount: track.download_count || 0,
      favoritingsCount: track.favoritings_count || 0,
      commentCount: track.comment_count || 0,
      createdAt: track.created_at,
      user: {
        id: track.user?.id,
        username: track.user?.username || '',
        avatarUrl: track.user?.avatar_url || '',
        permalinkUrl: track.user?.permalink_url || ''
      },
      isStreamable: track.streamable || false,
      isDownloadable: track.downloadable || false,
      permalink: track.permalink_url || ''
    };
  }

  /**
   * Format user data
   */
  private formatUser(user: any): SoundCloudUser {
    return {
      id: user.id,
      username: user.username,
      fullName: user.full_name || user.username,
      description: user.description || '',
      avatarUrl: user.avatar_url || '',
      city: user.city || '',
      country: user.country || '',
      followersCount: user.followers_count || 0,
      followingsCount: user.followings_count || 0,
      trackCount: user.track_count || 0,
      playlistCount: user.playlist_count || 0,
      permalinkUrl: user.permalink_url || ''
    };
  }

  /**
   * Format playlist data
   */
  private formatPlaylist(playlist: any): SoundCloudPlaylist {
    return {
      id: playlist.id,
      title: playlist.title,
      description: playlist.description || '',
      duration: playlist.duration,
      artworkUrl: playlist.artwork_url || '',
      trackCount: playlist.track_count,
      permalink: playlist.permalink_url,
      uri: playlist.uri,
      user: {
        id: playlist.user?.id,
        username: playlist.user?.username || '',
        avatarUrl: playlist.user?.avatar_url || ''
      },
      tracks: playlist.tracks?.map((track: any) => this.formatTrack(track)) || []
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

  /**
   * Get available genres
   */
  getAvailableGenres(): string[] {
    return [
      'All Music',
      'Alternative Rock',
      'Ambient',
      'Classical',
      'Country',
      'Dance & EDM',
      'Dancehall',
      'Deep House',
      'Disco',
      'Drum & Bass',
      'Dubstep',
      'Electronic',
      'Folk & Singer-Songwriter',
      'Hip-hop & Rap',
      'House',
      'Indie',
      'Jazz & Blues',
      'Latin',
      'Metal',
      'Piano',
      'Pop',
      'R&B & Soul',
      'Reggae',
      'Reggaeton',
      'Rock',
      'Soundtrack',
      'Techno',
      'Trance',
      'Trap',
      'Triphop',
      'World'
    ];
  }
}

// Singleton instance
export const soundCloudService = new SoundCloudService();
export default soundCloudService;
