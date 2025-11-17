// 📺 YOUTUBE SERVICE - Complete Integration with Offline Support
// Gothic Futurist Video Sanctuary

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface YouTubeDB extends DBSchema {
  videos: {
    key: string;
    value: YouTubeVideo;
    indexes: { 'by-playlist': string; 'by-channel': string };
  };
  playlists: {
    key: string;
    value: YouTubePlaylist;
  };
  channels: {
    key: string;
    value: YouTubeChannel;
  };
  subscriptions: {
    key: string;
    value: YouTubeSubscription;
  };
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  thumbnail: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    standard?: string;
    maxres?: string;
  };
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags?: string[];
  category: string;
  playlistId?: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  channelId: string;
  channelTitle: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  publishedAt: string;
  itemCount: number;
  videos?: YouTubeVideo[];
}

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
  publishedAt: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
}

export interface YouTubeSubscription {
  id: string;
  channelId: string;
  channelTitle: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

class YouTubeService {
  private db: IDBPDatabase<YouTubeDB> | null = null;
  private apiKey: string = '';

  async initialize() {
    this.db = await openDB<YouTubeDB>('kol-youtube-db', 1, {
      upgrade(db) {
        // Videos store
        const videoStore = db.createObjectStore('videos', { keyPath: 'id' });
        videoStore.createIndex('by-playlist', 'playlistId');
        videoStore.createIndex('by-channel', 'channelId');

        // Playlists store
        db.createObjectStore('playlists', { keyPath: 'id' });

        // Channels store
        db.createObjectStore('channels', { keyPath: 'id' });

        // Subscriptions store
        db.createObjectStore('subscriptions', { keyPath: 'id' });
      },
    });

    // Load API key from localStorage
    this.apiKey = localStorage.getItem('youtube_api_key') || '';
  }

  // 🔐 CONFIGURATION
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('youtube_api_key', apiKey);
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  // 🎥 API CALLS
  private async youtubeRequest(endpoint: string, params: Record<string, string> = {}): Promise<any> {
    if (!this.apiKey) {
      throw new Error('YouTube API key not set');
    }

    const queryParams = new URLSearchParams({
      key: this.apiKey,
      part: params.part || 'snippet',
      ...params
    });

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/${endpoint}?${queryParams.toString()}`
    );

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.statusText}`);
    }

    return await response.json();
  }

  // SEARCH
  async searchVideos(
    query: string,
    maxResults: number = 25,
    order: 'date' | 'rating' | 'relevance' | 'viewCount' = 'relevance'
  ): Promise<YouTubeVideo[]> {
    if (!this.db) await this.initialize();

    try {
      const searchData = await this.youtubeRequest('search', {
        q: query,
        type: 'video',
        maxResults: maxResults.toString(),
        order: order
      });

      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      
      const videosData = await this.youtubeRequest('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoIds
      });

      const videos: YouTubeVideo[] = videosData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        thumbnails: {
          default: item.snippet.thumbnails.default.url,
          medium: item.snippet.thumbnails.medium.url,
          high: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
          standard: item.snippet.thumbnails.standard?.url,
          maxres: item.snippet.thumbnails.maxres?.url
        },
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
        tags: item.snippet.tags,
        category: item.snippet.categoryId
      }));

      // Cache videos
      for (const video of videos) {
        await this.db!.put('videos', video);
      }

      return videos;
    } catch (error) {
      console.error('YouTube search error:', error);
      // Return cached videos matching query
      const cached = await this.db!.getAll('videos');
      return cached.filter(v => 
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, maxResults);
    }
  }

  // VIDEO DETAILS
  async getVideoDetails(videoId: string): Promise<YouTubeVideo | null> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.youtubeRequest('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoId
      });

      if (data.items.length === 0) return null;

      const item = data.items[0];
      const video: YouTubeVideo = {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        thumbnails: {
          default: item.snippet.thumbnails.default.url,
          medium: item.snippet.thumbnails.medium.url,
          high: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
          standard: item.snippet.thumbnails.standard?.url,
          maxres: item.snippet.thumbnails.maxres?.url
        },
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
        tags: item.snippet.tags,
        category: item.snippet.categoryId
      };

      await this.db!.put('videos', video);
      return video;
    } catch (error) {
      // Return cached video
      const cached = await this.db!.get('videos', videoId);
      return cached || null;
    }
  }

  // PLAYLISTS
  async getPlaylist(playlistId: string): Promise<YouTubePlaylist | null> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.youtubeRequest('playlists', {
        part: 'snippet,contentDetails',
        id: playlistId
      });

      if (data.items.length === 0) return null;

      const item = data.items[0];
      const playlist: YouTubePlaylist = {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        thumbnails: {
          default: item.snippet.thumbnails.default.url,
          medium: item.snippet.thumbnails.medium.url,
          high: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url
        },
        publishedAt: item.snippet.publishedAt,
        itemCount: item.contentDetails.itemCount
      };

      await this.db!.put('playlists', playlist);
      return playlist;
    } catch (error) {
      const cached = await this.db!.get('playlists', playlistId);
      return cached || null;
    }
  }

  async getPlaylistVideos(playlistId: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.youtubeRequest('playlistItems', {
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: maxResults.toString()
      });

      const videoIds = data.items.map((item: any) => item.contentDetails.videoId).join(',');
      
      const videosData = await this.youtubeRequest('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoIds
      });

      const videos: YouTubeVideo[] = videosData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        thumbnails: {
          default: item.snippet.thumbnails.default.url,
          medium: item.snippet.thumbnails.medium.url,
          high: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
          standard: item.snippet.thumbnails.standard?.url,
          maxres: item.snippet.thumbnails.maxres?.url
        },
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
        tags: item.snippet.tags,
        category: item.snippet.categoryId,
        playlistId: playlistId
      }));

      for (const video of videos) {
        await this.db!.put('videos', video);
      }

      return videos;
    } catch (error) {
      const cached = await this.db!.getAllFromIndex('videos', 'by-playlist', playlistId);
      return cached;
    }
  }

  // CHANNEL
  async getChannel(channelId: string): Promise<YouTubeChannel | null> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.youtubeRequest('channels', {
        part: 'snippet,statistics',
        id: channelId
      });

      if (data.items.length === 0) return null;

      const item = data.items[0];
      const channel: YouTubeChannel = {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        customUrl: item.snippet.customUrl || '',
        thumbnails: {
          default: item.snippet.thumbnails.default.url,
          medium: item.snippet.thumbnails.medium.url,
          high: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url
        },
        publishedAt: item.snippet.publishedAt,
        subscriberCount: parseInt(item.statistics.subscriberCount || '0'),
        videoCount: parseInt(item.statistics.videoCount || '0'),
        viewCount: parseInt(item.statistics.viewCount || '0')
      };

      await this.db!.put('channels', channel);
      return channel;
    } catch (error) {
      const cached = await this.db!.get('channels', channelId);
      return cached || null;
    }
  }

  async getChannelVideos(channelId: string, maxResults: number = 25): Promise<YouTubeVideo[]> {
    if (!this.db) await this.initialize();

    try {
      const searchData = await this.youtubeRequest('search', {
        channelId: channelId,
        type: 'video',
        order: 'date',
        maxResults: maxResults.toString()
      });

      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      
      const videosData = await this.youtubeRequest('videos', {
        part: 'snippet,contentDetails,statistics',
        id: videoIds
      });

      const videos: YouTubeVideo[] = videosData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        thumbnails: {
          default: item.snippet.thumbnails.default.url,
          medium: item.snippet.thumbnails.medium.url,
          high: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
          standard: item.snippet.thumbnails.standard?.url,
          maxres: item.snippet.thumbnails.maxres?.url
        },
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
        tags: item.snippet.tags,
        category: item.snippet.categoryId
      }));

      for (const video of videos) {
        await this.db!.put('videos', video);
      }

      return videos;
    } catch (error) {
      const cached = await this.db!.getAllFromIndex('videos', 'by-channel', channelId);
      return cached;
    }
  }

  // TRENDING
  async getTrending(regionCode: string = 'US', maxResults: number = 25): Promise<YouTubeVideo[]> {
    if (!this.db) await this.initialize();

    try {
      const data = await this.youtubeRequest('videos', {
        part: 'snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: regionCode,
        maxResults: maxResults.toString()
      });

      const videos: YouTubeVideo[] = data.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
        thumbnails: {
          default: item.snippet.thumbnails.default.url,
          medium: item.snippet.thumbnails.medium.url,
          high: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
          standard: item.snippet.thumbnails.standard?.url,
          maxres: item.snippet.thumbnails.maxres?.url
        },
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
        viewCount: parseInt(item.statistics.viewCount || '0'),
        likeCount: parseInt(item.statistics.likeCount || '0'),
        commentCount: parseInt(item.statistics.commentCount || '0'),
        tags: item.snippet.tags,
        category: item.snippet.categoryId
      }));

      return videos;
    } catch (error) {
      console.error('YouTube trending error:', error);
      return [];
    }
  }

  // UTILITY - Parse duration
  parseDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

export const youtubeService = new YouTubeService();
