/**
 * YouTube Data API v3 Service
 *
 * Comprehensive YouTube integration for KOL Hub:
 * - Video search and discovery
 * - Playlist management
 * - Channel analytics
 * - OAuth authentication
 * - Music video streaming
 * - Live performance access
 *
 * Part of the unified music experience with Spotify and SoundCloud
 */

// YouTube Data API v3 Interfaces
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  channelId: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  categoryId: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  itemCount: number;
  channelTitle: string;
  publishedAt: string;
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export interface YouTubeSearchOptions {
  query: string;
  maxResults?: number;
  type?: 'video' | 'playlist' | 'channel';
  order?: 'relevance' | 'date' | 'viewCount' | 'rating';
  videoCategoryId?: string;
  videoDuration?: 'short' | 'medium' | 'long';
}

export class YouTubeService {
  private apiKey: string;
  private clientId: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor() {
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
    this.clientId = import.meta.env.VITE_YOUTUBE_OAUTH_CLIENT_ID || '';

    // Dynamically set redirect URI based on environment
    this.redirectUri = this.getRedirectUri();

    this.accessToken = localStorage.getItem('youtube_access_token');
  }

  /**
   * Dynamically determine the correct redirect URI based on environment
   */
  private getRedirectUri(): string {
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;

      // Android/iOS app with custom scheme
      if (protocol === 'kolhub:' || protocol === 'com.kolhub.app:') {
        return import.meta.env.VITE_YOUTUBE_REDIRECT_URI_ANDROID || 'kolhub://youtube/callback';
      }

      // Production web (Netlify)
      if (import.meta.env.PROD || window.location.hostname.includes('netlify.app')) {
        return import.meta.env.VITE_YOUTUBE_REDIRECT_URI_PROD || 'https://kolhub.netlify.app/youtube/callback';
      }
    }

    // Development (local)
    return import.meta.env.VITE_YOUTUBE_REDIRECT_URI_DEV || 'http://localhost:5173/youtube/callback';
  }

  /**
   * OAuth Authentication
   */
  getAuthorizationUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube',
      'https://www.googleapis.com/auth/youtube.force-ssl'
    ];

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async authenticateWithCode(code: string): Promise<void> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!response.ok) {
      throw new Error('YouTube authentication failed');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    localStorage.setItem('youtube_access_token', data.access_token);

    if (data.refresh_token) {
      localStorage.setItem('youtube_refresh_token', data.refresh_token);
    }
  }

  /**
   * Video Search & Discovery
   */
  async searchVideos(
    query: string,
    maxResults: number = 25,
    options: Partial<YouTubeSearchOptions> = {}
  ): Promise<YouTubeVideo[]> {
    const params = new URLSearchParams({
      part: 'snippet',
      q: query,
      maxResults: maxResults.toString(),
      type: options.type || 'video',
      order: options.order || 'relevance',
      key: this.apiKey
    });

    if (options.videoCategoryId) {
      params.append('videoCategoryId', options.videoCategoryId);
    }

    if (options.videoDuration) {
      params.append('videoDuration', options.videoDuration);
    }

    const response = await fetch(`${this.baseUrl}/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error('YouTube video search failed');
    }

    const data = await response.json();
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');

    // Get video details including statistics
    return this.getVideoDetails(videoIds);
  }

  async getVideoDetails(videoIds: string): Promise<YouTubeVideo[]> {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      id: videoIds,
      key: this.apiKey
    });

    const response = await fetch(`${this.baseUrl}/videos?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      viewCount: parseInt(item.statistics.viewCount) || 0,
      likeCount: parseInt(item.statistics.likeCount) || 0,
      commentCount: parseInt(item.statistics.commentCount) || 0,
      tags: item.snippet.tags || [],
      categoryId: item.snippet.categoryId
    }));
  }

  async getTrendingVideos(
    regionCode: string = 'US',
    categoryId?: string,
    maxResults: number = 25
  ): Promise<YouTubeVideo[]> {
    const params = new URLSearchParams({
      part: 'snippet,contentDetails,statistics',
      chart: 'mostPopular',
      regionCode,
      maxResults: maxResults.toString(),
      key: this.apiKey
    });

    if (categoryId) {
      params.append('videoCategoryId', categoryId);
    }

    const response = await fetch(`${this.baseUrl}/videos?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch trending videos');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId,
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
      viewCount: parseInt(item.statistics.viewCount) || 0,
      likeCount: parseInt(item.statistics.likeCount) || 0,
      commentCount: parseInt(item.statistics.commentCount) || 0,
      tags: item.snippet.tags || [],
      categoryId: item.snippet.categoryId
    }));
  }

  /**
   * Music-Specific Features
   */
  async searchMusicVideos(query: string, maxResults: number = 25): Promise<YouTubeVideo[]> {
    return this.searchVideos(query, maxResults, {
      type: 'video',
      order: 'relevance',
      videoCategoryId: '10' // Music category
    });
  }

  async searchLivePerformances(artist: string, maxResults: number = 25): Promise<YouTubeVideo[]> {
    return this.searchVideos(`${artist} live performance`, maxResults, {
      type: 'video',
      order: 'relevance',
      videoCategoryId: '10',
      videoDuration: 'long'
    });
  }

  async searchCoverSongs(songTitle: string, maxResults: number = 25): Promise<YouTubeVideo[]> {
    return this.searchVideos(`${songTitle} cover`, maxResults, {
      type: 'video',
      order: 'relevance',
      videoCategoryId: '10'
    });
  }

  /**
   * Playlist Management (requires OAuth)
   */
  async getUserPlaylists(maxResults: number = 50): Promise<YouTubePlaylist[]> {
    if (!this.accessToken) {
      throw new Error('YouTube authentication required');
    }

    const params = new URLSearchParams({
      part: 'snippet,contentDetails',
      mine: 'true',
      maxResults: maxResults.toString()
    });

    const response = await fetch(`${this.baseUrl}/playlists?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user playlists');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      itemCount: item.contentDetails.itemCount,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
  }

  async getPlaylistVideos(playlistId: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    const params = new URLSearchParams({
      part: 'snippet',
      playlistId,
      maxResults: maxResults.toString(),
      key: this.apiKey
    });

    const response = await fetch(`${this.baseUrl}/playlistItems?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch playlist videos');
    }

    const data = await response.json();
    const videoIds = data.items.map((item: any) => item.snippet.resourceId.videoId).join(',');

    return this.getVideoDetails(videoIds);
  }

  async createPlaylist(
    title: string,
    description: string = '',
    privacyStatus: 'public' | 'private' | 'unlisted' = 'private'
  ): Promise<YouTubePlaylist> {
    if (!this.accessToken) {
      throw new Error('YouTube authentication required');
    }

    const response = await fetch(`${this.baseUrl}/playlists?part=snippet,status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        snippet: {
          title,
          description
        },
        status: {
          privacyStatus
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create playlist');
    }

    const data = await response.json();

    return {
      id: data.id,
      title: data.snippet.title,
      description: data.snippet.description,
      thumbnail: data.snippet.thumbnails?.default?.url || '',
      itemCount: 0,
      channelTitle: data.snippet.channelTitle,
      publishedAt: data.snippet.publishedAt
    };
  }

  async addVideoToPlaylist(playlistId: string, videoId: string): Promise<void> {
    if (!this.accessToken) {
      throw new Error('YouTube authentication required');
    }

    const response = await fetch(`${this.baseUrl}/playlistItems?part=snippet`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        snippet: {
          playlistId,
          resourceId: {
            kind: 'youtube#video',
            videoId
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to add video to playlist');
    }
  }

  /**
   * Channel Management (requires OAuth)
   */
  async getMyChannel(): Promise<YouTubeChannel> {
    if (!this.accessToken) {
      throw new Error('YouTube authentication required');
    }

    const params = new URLSearchParams({
      part: 'snippet,statistics',
      mine: 'true'
    });

    const response = await fetch(`${this.baseUrl}/channels?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch channel information');
    }

    const data = await response.json();
    const channel = data.items[0];

    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default.url,
      subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
      videoCount: parseInt(channel.statistics.videoCount) || 0,
      viewCount: parseInt(channel.statistics.viewCount) || 0
    };
  }

  async getChannelVideos(channelId: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    const params = new URLSearchParams({
      part: 'snippet',
      channelId,
      maxResults: maxResults.toString(),
      order: 'date',
      type: 'video',
      key: this.apiKey
    });

    const response = await fetch(`${this.baseUrl}/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch channel videos');
    }

    const data = await response.json();
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',');

    return this.getVideoDetails(videoIds);
  }

  /**
   * Liked Videos (requires OAuth)
   */
  async getLikedVideos(maxResults: number = 50): Promise<YouTubeVideo[]> {
    if (!this.accessToken) {
      throw new Error('YouTube authentication required');
    }

    const params = new URLSearchParams({
      part: 'snippet',
      myRating: 'like',
      maxResults: maxResults.toString(),
      type: 'video'
    });

    const response = await fetch(`${this.baseUrl}/videos?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch liked videos');
    }

    const data = await response.json();
    const videoIds = data.items.map((item: any) => item.id).join(',');

    return this.getVideoDetails(videoIds);
  }

  async rateVideo(videoId: string, rating: 'like' | 'dislike' | 'none'): Promise<void> {
    if (!this.accessToken) {
      throw new Error('YouTube authentication required');
    }

    const params = new URLSearchParams({
      id: videoId,
      rating
    });

    const response = await fetch(`${this.baseUrl}/videos/rate?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to rate video');
    }
  }

  /**
   * Category & Discovery
   */
  async getVideoCategories(regionCode: string = 'US'): Promise<Array<{id: string, title: string}>> {
    const params = new URLSearchParams({
      part: 'snippet',
      regionCode,
      key: this.apiKey
    });

    const response = await fetch(`${this.baseUrl}/videoCategories?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Failed to fetch video categories');
    }

    const data = await response.json();

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title
    }));
  }

  /**
   * Utility Functions
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  logout(): void {
    this.accessToken = null;
    localStorage.removeItem('youtube_access_token');
    localStorage.removeItem('youtube_refresh_token');
  }

  /**
   * Format duration from ISO 8601 to human-readable
   */
  formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    if (!match) return '0:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }

    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  }

  /**
   * Get embed URL for video player
   */
  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  /**
   * Get watch URL
   */
  getWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}

// Export singleton instance
export const youtubeService = new YouTubeService();
