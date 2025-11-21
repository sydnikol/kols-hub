/**
 * 🎵 MUSIC MANAGER
 * Unified music service manager for all platforms with offline support
 * Supports: Spotify, YouTube Music, SoundCloud
 * Works on: Web, Desktop, Android, iOS (online and offline)
 */

import { platformService } from './platform-service';
import { spotifyService } from './spotify-service';
import { youtubeService } from './youtube-service';
import { soundcloudService } from './soundcloud-service';
import { db } from '../utils/database';

export type MusicPlatform = 'spotify' | 'youtube' | 'soundcloud';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  thumbnail: string;
  duration: number;
  platform: MusicPlatform;
  url?: string;
  streamUrl?: string;
  isOfflineAvailable?: boolean;
  localPath?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  tracks: Track[];
  platform: MusicPlatform;
  isOffline?: boolean;
}

class MusicManager {
  private currentTrack: Track | null = null;
  private currentPlatform: MusicPlatform = 'spotify';
  private isInitialized: boolean = false;

  /**
   * Initialize all music services
   */
  async initialize() {
    if (this.isInitialized) return;

    console.log('🎵 Initializing Music Manager...');

    try {
      // Initialize all services
      await Promise.all([
        spotifyService.initialize(),
        youtubeService.initialize(),
        soundcloudService.initialize(),
      ]);

      // Load saved preferences
      const savedPlatform = localStorage.getItem('music_platform') as MusicPlatform;
      if (savedPlatform) {
        this.currentPlatform = savedPlatform;
      }

      this.isInitialized = true;
      console.log('✅ Music Manager initialized');
    } catch (error) {
      console.error('❌ Music Manager initialization error:', error);
    }
  }

  /**
   * Get current platform
   */
  getCurrentPlatform(): MusicPlatform {
    return this.currentPlatform;
  }

  /**
   * Set active music platform
   */
  setCurrentPlatform(platform: MusicPlatform) {
    this.currentPlatform = platform;
    localStorage.setItem('music_platform', platform);
  }

  /**
   * Check if a platform is authenticated
   */
  isPlatformAuthenticated(platform: MusicPlatform): boolean {
    switch (platform) {
      case 'spotify':
        return spotifyService.isAuthenticated();
      case 'youtube':
        return youtubeService.hasApiKey();
      case 'soundcloud':
        return soundcloudService.hasClientId();
      default:
        return false;
    }
  }

  /**
   * Search for tracks across platforms
   */
  async search(query: string, platform?: MusicPlatform, limit: number = 20): Promise<Track[]> {
    const searchPlatform = platform || this.currentPlatform;

    // Check if online
    if (!platformService.isOnline()) {
      console.log('📴 Offline mode: Searching cached tracks...');
      return this.searchOffline(query);
    }

    try {
      let results: Track[] = [];

      switch (searchPlatform) {
        case 'spotify':
          if (this.isPlatformAuthenticated('spotify')) {
            const tracks = await spotifyService.search(query, 'track', limit);
            results = tracks.map(track => ({
              id: track.id,
              title: track.name,
              artist: track.artists.join(', '),
              album: track.albumName,
              thumbnail: track.albumArt,
              duration: track.duration,
              platform: 'spotify' as MusicPlatform,
              url: track.uri,
            }));
          }
          break;

        case 'youtube':
          if (this.isPlatformAuthenticated('youtube')) {
            const videos = await youtubeService.search(query, limit);
            results = videos.map(video => ({
              id: video.id,
              title: video.title,
              artist: video.channelTitle,
              thumbnail: video.thumbnail,
              duration: youtubeService.parseDuration(video.duration),
              platform: 'youtube' as MusicPlatform,
              url: `https://www.youtube.com/watch?v=${video.id}`,
            }));
          }
          break;

        case 'soundcloud':
          if (this.isPlatformAuthenticated('soundcloud')) {
            const tracks = await soundcloudService.search(query, limit);
            results = tracks.map(track => ({
              id: track.id.toString(),
              title: track.title,
              artist: track.user.username,
              thumbnail: track.artworkUrl || track.user.avatarUrl,
              duration: track.duration / 1000, // SoundCloud returns milliseconds, convert to seconds
              platform: 'soundcloud' as MusicPlatform,
              url: `https://soundcloud.com/${track.user.username}/${track.title.replace(/\s+/g, '-').toLowerCase()}`,
              streamUrl: track.streamUrl,
            }));
          }
          break;
      }

      // Cache results for offline access
      await this.cacheSearchResults(query, results);

      return results;
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to offline cache
      return this.searchOffline(query);
    }
  }

  /**
   * Search cached tracks (offline mode)
   */
  private async searchOffline(query: string): Promise<Track[]> {
    try {
      // Search in IndexedDB
      const cachedTracks = await db.cachedTracks
        .filter(track =>
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase())
        )
        .limit(20)
        .toArray();

      return cachedTracks as Track[];
    } catch (error) {
      console.error('Offline search error:', error);
      return [];
    }
  }

  /**
   * Cache search results for offline access
   */
  private async cacheSearchResults(query: string, tracks: Track[]) {
    try {
      // Save to IndexedDB for offline access
      for (const track of tracks) {
        await db.cachedTracks.put({
          ...track,
          cachedAt: new Date(),
          searchQuery: query,
        });
      }
    } catch (error) {
      console.error('Cache error:', error);
    }
  }

  /**
   * Get user playlists
   */
  async getPlaylists(platform?: MusicPlatform): Promise<Playlist[]> {
    const targetPlatform = platform || this.currentPlatform;

    if (!platformService.isOnline()) {
      return this.getOfflinePlaylists();
    }

    try {
      let playlists: Playlist[] = [];

      switch (targetPlatform) {
        case 'spotify':
          if (this.isPlatformAuthenticated('spotify')) {
            const spotifyPlaylists = await spotifyService.getUserPlaylists();
            playlists = spotifyPlaylists.map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              thumbnail: p.images[0] || '',
              tracks: [],
              platform: 'spotify' as MusicPlatform,
            }));
          }
          break;

        case 'youtube':
          if (this.isPlatformAuthenticated('youtube')) {
            const youtubePlaylists = await youtubeService.getUserPlaylists();
            playlists = youtubePlaylists.map(p => ({
              id: p.id,
              name: p.title,
              description: p.description,
              thumbnail: p.thumbnails.high,
              tracks: [],
              platform: 'youtube' as MusicPlatform,
            }));
          }
          break;

        case 'soundcloud':
          if (this.isPlatformAuthenticated('soundcloud')) {
            const soundcloudPlaylists = await soundcloudService.getUserPlaylists();
            playlists = soundcloudPlaylists.map(p => ({
              id: p.id.toString(),
              name: p.title,
              description: p.description,
              thumbnail: p.artworkUrl,
              tracks: [],
              platform: 'soundcloud' as MusicPlatform,
            }));
          }
          break;
      }

      // Cache playlists
      await this.cachePlaylists(playlists);

      return playlists;
    } catch (error) {
      console.error('Get playlists error:', error);
      return this.getOfflinePlaylists();
    }
  }

  /**
   * Get offline playlists
   */
  private async getOfflinePlaylists(): Promise<Playlist[]> {
    try {
      const cachedPlaylists = await db.cachedPlaylists.toArray();
      return cachedPlaylists as Playlist[];
    } catch (error) {
      console.error('Offline playlists error:', error);
      return [];
    }
  }

  /**
   * Cache playlists for offline access
   */
  private async cachePlaylists(playlists: Playlist[]) {
    try {
      for (const playlist of playlists) {
        await db.cachedPlaylists.put({
          ...playlist,
          cachedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Cache playlists error:', error);
    }
  }

  /**
   * Play a track
   */
  async playTrack(track: Track) {
    this.currentTrack = track;

    // Platform-specific haptic feedback
    await platformService.hapticFeedback('light');

    // Emit play event
    window.dispatchEvent(new CustomEvent('kolMusicPlay', {
      detail: { track }
    }));

    console.log('🎵 Now playing:', track.title, 'by', track.artist);
  }

  /**
   * Get current track
   */
  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  /**
   * Download track for offline playback (mobile only)
   */
  async downloadForOffline(track: Track): Promise<boolean> {
    if (!platformService.isMobile()) {
      console.warn('Offline download is only available on mobile');
      return false;
    }

    try {
      // TODO: Implement actual download logic using Capacitor Filesystem
      // For now, just cache metadata
      await db.cachedTracks.put({
        ...track,
        isOfflineAvailable: true,
        cachedAt: new Date(),
      });

      console.log('✅ Track cached for offline:', track.title);
      return true;
    } catch (error) {
      console.error('Download error:', error);
      return false;
    }
  }

  /**
   * Check if track is available offline
   */
  async isTrackOffline(trackId: string): Promise<boolean> {
    try {
      const track = await db.cachedTracks.get(trackId);
      return !!track?.isOfflineAvailable;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get offline tracks
   */
  async getOfflineTracks(): Promise<Track[]> {
    try {
      const tracks = await db.cachedTracks
        .filter(track => track.isOfflineAvailable === true)
        .toArray();
      return tracks as Track[];
    } catch (error) {
      console.error('Get offline tracks error:', error);
      return [];
    }
  }

  /**
   * Clear music cache
   */
  async clearCache() {
    try {
      await db.cachedTracks.clear();
      await db.cachedPlaylists.clear();
      console.log('✅ Music cache cleared');
    } catch (error) {
      console.error('Clear cache error:', error);
    }
  }
}

// Export singleton instance
export const musicManager = new MusicManager();
