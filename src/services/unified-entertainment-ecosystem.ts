/**
 * UNIFIED ENTERTAINMENT ECOSYSTEM
 * =================================
 * Consolidates ALL entertainment-related services into a single coherent system.
 * Replaces: spotifyService.ts, spotify-service.ts, youtubeService.ts, youtube-service.ts,
 *           soundcloudService.ts, soundcloud-service.ts, music-manager.ts,
 *           entertainmentLibraryService.ts, hulu-streaming-service.ts
 *
 * Features:
 * - Unified music player (Spotify, YouTube, SoundCloud)
 * - Video streaming (Hulu, YouTube, etc.)
 * - Podcast management
 * - Gaming library & tracking
 * - Board game collection
 * - Watch history & recommendations
 * - Playlists across platforms
 * - Mood-based entertainment suggestions
 * - Cross-system connections (mood, health, spoons)
 */

import { unifiedDataHub, eventBus } from './unified-data-hub';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type MediaType = 'music' | 'video' | 'podcast' | 'game' | 'audiobook';
export type Platform = 'spotify' | 'youtube' | 'soundcloud' | 'hulu' | 'netflix' | 'steam' | 'local' | 'other';

export interface MediaItem {
  id: string;
  type: MediaType;
  platform: Platform;
  title: string;
  artist?: string;
  album?: string;
  genre?: string[];
  duration?: number; // minutes
  releaseYear?: number;
  imageUrl?: string;
  externalId?: string;
  rating?: number;
  playCount?: number;
  lastPlayed?: Date;
  favorite?: boolean;
  tags?: string[];
  notes?: string;
  addedAt: Date;
}

export interface WatchHistoryEntry {
  id: string;
  mediaId: string;
  title: string;
  type: 'movie' | 'tv_show' | 'video' | 'stream' | 'documentary';
  platform: Platform;
  watchedAt: Date;
  duration: number;
  progress?: number; // percentage for partial watches
  completed: boolean;
  season?: number;
  episode?: number;
  rating?: number;
  review?: string;
  mood?: string;
  withWho?: string[];
}

export interface ListenHistoryEntry {
  id: string;
  mediaId: string;
  title: string;
  artist: string;
  type: 'song' | 'album' | 'podcast' | 'audiobook';
  platform: Platform;
  listenedAt: Date;
  duration: number;
  completed: boolean;
  skipped?: boolean;
  mood?: string;
}

export interface GameHistoryEntry {
  id: string;
  gameId: string;
  title: string;
  platform: 'steam' | 'epic' | 'gog' | 'console' | 'mobile' | 'tabletop' | 'other';
  playedAt: Date;
  duration: number;
  activity?: string;
  achievement?: string;
  withWho?: string[];
  funRating?: number;
  notes?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  type: MediaType;
  platform: Platform | 'cross-platform';
  items: string[]; // media IDs
  coverImage?: string;
  isPublic: boolean;
  mood?: string;
  activity?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PodcastSubscription {
  id: string;
  title: string;
  host?: string;
  platform: Platform;
  externalId?: string;
  imageUrl?: string;
  genre?: string;
  subscribed: boolean;
  lastEpisode?: Date;
  unplayedCount?: number;
  rating?: number;
  notes?: string;
}

export interface Game {
  id: string;
  title: string;
  platform: 'steam' | 'epic' | 'gog' | 'console' | 'mobile' | 'tabletop' | 'other';
  genre?: string[];
  hoursPlayed: number;
  lastPlayed?: Date;
  status: 'playing' | 'completed' | 'abandoned' | 'backlog' | 'wishlist';
  rating?: number;
  achievement?: number; // percentage
  imageUrl?: string;
  purchasePrice?: number;
  purchaseDate?: Date;
  notes?: string;
}

export interface BoardGame {
  id: string;
  title: string;
  players: { min: number; max: number };
  playTime: { min: number; max: number }; // minutes
  complexity?: number; // 1-5
  genre?: string[];
  owned: boolean;
  rating?: number;
  playCount?: number;
  lastPlayed?: Date;
  imageUrl?: string;
  notes?: string;
}

export interface EntertainmentRecommendation {
  id: string;
  type: MediaType;
  title: string;
  reason: string;
  basedOn: string;
  confidence: number;
  platform?: Platform;
  externalId?: string;
  imageUrl?: string;
  createdAt: Date;
}

// ============================================================================
// PLATFORM CONNECTORS
// ============================================================================

interface PlatformCredentials {
  platform: Platform;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  userId?: string;
  connected: boolean;
  lastSync?: Date;
}

class PlatformConnector {
  private credentials: Map<Platform, PlatformCredentials> = new Map();

  async connect(platform: Platform, credentials: Partial<PlatformCredentials>): Promise<boolean> {
    this.credentials.set(platform, {
      platform,
      connected: true,
      ...credentials
    } as PlatformCredentials);

    await unifiedDataHub.setIntegration(platform, {
      type: 'entertainment',
      credentials: this.credentials.get(platform),
      status: 'connected'
    });

    return true;
  }

  async disconnect(platform: Platform): Promise<void> {
    const creds = this.credentials.get(platform);
    if (creds) {
      creds.connected = false;
      await unifiedDataHub.setIntegration(platform, {
        type: 'entertainment',
        status: 'disconnected'
      });
    }
  }

  async isConnected(platform: Platform): Promise<boolean> {
    const creds = this.credentials.get(platform);
    return creds?.connected || false;
  }

  async getConnectedPlatforms(): Promise<Platform[]> {
    const connected: Platform[] = [];
    for (const [platform, creds] of this.credentials) {
      if (creds.connected) {
        connected.push(platform);
      }
    }
    return connected;
  }

  // Spotify-specific methods
  async spotifySearch(query: string, type: 'track' | 'album' | 'artist' | 'playlist' = 'track'): Promise<any[]> {
    // Would implement Spotify API search
    return [];
  }

  async spotifyGetPlayback(): Promise<any> {
    // Would get current Spotify playback state
    return null;
  }

  async spotifyPlay(uri?: string): Promise<void> {
    // Would control Spotify playback
  }

  async spotifyPause(): Promise<void> {
    // Would pause Spotify
  }

  // YouTube-specific methods
  async youtubeSearch(query: string): Promise<any[]> {
    // Would implement YouTube API search
    return [];
  }

  async youtubeGetVideo(videoId: string): Promise<any> {
    // Would get YouTube video details
    return null;
  }

  // SoundCloud-specific methods
  async soundcloudSearch(query: string): Promise<any[]> {
    // Would implement SoundCloud API search
    return [];
  }

  // Hulu-specific methods
  async huluGetLibrary(): Promise<any[]> {
    // Would get Hulu library
    return [];
  }
}

// ============================================================================
// UNIFIED ENTERTAINMENT ECOSYSTEM SERVICE
// ============================================================================

class UnifiedEntertainmentEcosystem {
  private initialized = false;
  private platformConnector = new PlatformConnector();
  private currentlyPlaying: MediaItem | null = null;

  // -------------------------------------------------------------------------
  // INITIALIZATION
  // -------------------------------------------------------------------------

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.setupEventListeners();
    await this.loadSavedConnections();

    this.initialized = true;
    console.log('Entertainment Ecosystem initialized');
  }

  private setupEventListeners(): void {
    // Connect entertainment to mood
    eventBus.on('health:update', async (data) => {
      if (data.type === 'mood') {
        await this.generateMoodBasedRecommendations(data.value);
      }
    });

    // Track spoon cost for gaming
    eventBus.on('entertainment:played', async (data) => {
      if (data.duration > 60) {
        // Long gaming sessions cost spoons
        const spoonCost = Math.floor(data.duration / 60);
        await unifiedDataHub.updateSpoons(-spoonCost, `Gaming: ${data.title}`);
      }
    });
  }

  private async loadSavedConnections(): Promise<void> {
    const platforms: Platform[] = ['spotify', 'youtube', 'soundcloud', 'hulu'];
    for (const platform of platforms) {
      const integration = await unifiedDataHub.getIntegration(platform);
      if (integration?.status === 'connected') {
        await this.platformConnector.connect(platform, integration.credentials);
      }
    }
  }

  // -------------------------------------------------------------------------
  // PLATFORM CONNECTIONS
  // -------------------------------------------------------------------------

  async connectPlatform(platform: Platform, credentials: any): Promise<boolean> {
    return this.platformConnector.connect(platform, credentials);
  }

  async disconnectPlatform(platform: Platform): Promise<void> {
    await this.platformConnector.disconnect(platform);
  }

  async getConnectedPlatforms(): Promise<Platform[]> {
    return this.platformConnector.getConnectedPlatforms();
  }

  // -------------------------------------------------------------------------
  // MEDIA LIBRARY
  // -------------------------------------------------------------------------

  async addToLibrary(item: Omit<MediaItem, 'id' | 'addedAt'>): Promise<MediaItem> {
    const record: MediaItem = {
      ...item,
      id: `media-${Date.now()}`,
      addedAt: new Date()
    };

    // Would save to unified data hub
    return record;
  }

  async getLibrary(options?: {
    type?: MediaType;
    platform?: Platform;
    genre?: string;
    favorite?: boolean;
    limit?: number;
  }): Promise<MediaItem[]> {
    // Would fetch from unified data hub with filters
    return [];
  }

  async updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<void> {
    // Would update in unified data hub
  }

  async removeFromLibrary(id: string): Promise<void> {
    // Would delete from unified data hub
  }

  async searchLibrary(query: string): Promise<MediaItem[]> {
    const library = await this.getLibrary();
    const lowerQuery = query.toLowerCase();

    return library.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.artist?.toLowerCase().includes(lowerQuery) ||
      item.album?.toLowerCase().includes(lowerQuery) ||
      item.genre?.some(g => g.toLowerCase().includes(lowerQuery))
    );
  }

  // -------------------------------------------------------------------------
  // UNIFIED SEARCH (Cross-Platform)
  // -------------------------------------------------------------------------

  async search(query: string, options?: {
    type?: MediaType;
    platforms?: Platform[];
    limit?: number;
  }): Promise<Array<{ item: any; platform: Platform; source: 'library' | 'external' }>> {
    const results: Array<{ item: any; platform: Platform; source: 'library' | 'external' }> = [];

    // Search local library first
    const libraryResults = await this.searchLibrary(query);
    for (const item of libraryResults) {
      results.push({ item, platform: item.platform, source: 'library' });
    }

    // Search connected platforms
    const connectedPlatforms = await this.getConnectedPlatforms();
    const platformsToSearch = options?.platforms || connectedPlatforms;

    for (const platform of platformsToSearch) {
      if (!connectedPlatforms.includes(platform)) continue;

      try {
        let platformResults: any[] = [];

        switch (platform) {
          case 'spotify':
            platformResults = await this.platformConnector.spotifySearch(query);
            break;
          case 'youtube':
            platformResults = await this.platformConnector.youtubeSearch(query);
            break;
          case 'soundcloud':
            platformResults = await this.platformConnector.soundcloudSearch(query);
            break;
        }

        for (const item of platformResults) {
          results.push({ item, platform, source: 'external' });
        }
      } catch (error) {
        console.error(`Error searching ${platform}:`, error);
      }
    }

    return options?.limit ? results.slice(0, options.limit) : results;
  }

  // -------------------------------------------------------------------------
  // PLAYBACK CONTROL
  // -------------------------------------------------------------------------

  async play(mediaId: string): Promise<void> {
    const item = (await this.getLibrary()).find(m => m.id === mediaId);
    if (!item) return;

    this.currentlyPlaying = item;

    // Delegate to platform
    switch (item.platform) {
      case 'spotify':
        await this.platformConnector.spotifyPlay(item.externalId);
        break;
      // Add other platforms
    }

    eventBus.emit('entertainment:listened', {
      mediaId,
      title: item.title,
      artist: item.artist,
      type: 'song',
      platform: item.platform
    });
  }

  async pause(): Promise<void> {
    if (!this.currentlyPlaying) return;

    switch (this.currentlyPlaying.platform) {
      case 'spotify':
        await this.platformConnector.spotifyPause();
        break;
    }
  }

  async getCurrentlyPlaying(): Promise<MediaItem | null> {
    return this.currentlyPlaying;
  }

  // -------------------------------------------------------------------------
  // WATCH HISTORY
  // -------------------------------------------------------------------------

  async logWatch(entry: Omit<WatchHistoryEntry, 'id' | 'watchedAt'>): Promise<WatchHistoryEntry> {
    const record: WatchHistoryEntry = {
      ...entry,
      id: `watch-${Date.now()}`,
      watchedAt: new Date()
    };

    await unifiedDataHub.logWatch(record);
    return record;
  }

  async getWatchHistory(options?: {
    type?: string;
    platform?: Platform;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<WatchHistoryEntry[]> {
    const history = await unifiedDataHub.getEntertainmentHistory('watch', options?.limit);

    let filtered = history;
    if (options?.type) filtered = filtered.filter(h => h.type === options.type);
    if (options?.platform) filtered = filtered.filter(h => h.platform === options.platform);
    if (options?.startDate) filtered = filtered.filter(h => new Date(h.watchedAt || h.date) >= options.startDate!);
    if (options?.endDate) filtered = filtered.filter(h => new Date(h.watchedAt || h.date) <= options.endDate!);

    return filtered;
  }

  async getWatchStats(days: number = 30): Promise<{
    totalHours: number;
    byType: Record<string, number>;
    byPlatform: Record<string, number>;
    mostWatched: Array<{ title: string; count: number }>;
    bingeSessions: number;
  }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const history = await this.getWatchHistory({ startDate });

    const totalMinutes = history.reduce((sum, h) => sum + (h.duration || 0), 0);

    const byType: Record<string, number> = {};
    const byPlatform: Record<string, number> = {};
    const titleCount: Record<string, number> = {};

    for (const entry of history) {
      byType[entry.type] = (byType[entry.type] || 0) + (entry.duration || 0);
      byPlatform[entry.platform] = (byPlatform[entry.platform] || 0) + (entry.duration || 0);
      titleCount[entry.title] = (titleCount[entry.title] || 0) + 1;
    }

    const mostWatched = Object.entries(titleCount)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Count binge sessions (3+ episodes in a row)
    const bingeSessions = this.countBingeSessions(history);

    return {
      totalHours: totalMinutes / 60,
      byType,
      byPlatform,
      mostWatched,
      bingeSessions
    };
  }

  private countBingeSessions(history: WatchHistoryEntry[]): number {
    // Group by date and show
    const shows = history.filter(h => h.type === 'tv_show' && h.episode);
    // Count when 3+ episodes of same show were watched in a day
    // Simplified implementation
    return Math.floor(shows.length / 3);
  }

  // -------------------------------------------------------------------------
  // LISTEN HISTORY
  // -------------------------------------------------------------------------

  async logListen(entry: Omit<ListenHistoryEntry, 'id' | 'listenedAt'>): Promise<ListenHistoryEntry> {
    const record: ListenHistoryEntry = {
      ...entry,
      id: `listen-${Date.now()}`,
      listenedAt: new Date()
    };

    await unifiedDataHub.logListen(record);
    return record;
  }

  async getListenHistory(options?: {
    type?: string;
    platform?: Platform;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<ListenHistoryEntry[]> {
    const history = await unifiedDataHub.getEntertainmentHistory('listen', options?.limit);

    let filtered = history;
    if (options?.type) filtered = filtered.filter(h => h.type === options.type);
    if (options?.platform) filtered = filtered.filter(h => h.platform === options.platform);

    return filtered;
  }

  async getListenStats(days: number = 30): Promise<{
    totalMinutes: number;
    uniqueArtists: number;
    uniqueTracks: number;
    topArtists: Array<{ artist: string; playCount: number }>;
    topTracks: Array<{ title: string; artist: string; playCount: number }>;
    genreBreakdown: Record<string, number>;
  }> {
    const history = await this.getListenHistory({ limit: 1000 });

    const artistCount: Record<string, number> = {};
    const trackCount: Record<string, { title: string; artist: string; count: number }> = {};

    for (const entry of history) {
      artistCount[entry.artist] = (artistCount[entry.artist] || 0) + 1;

      const trackKey = `${entry.title}-${entry.artist}`;
      if (!trackCount[trackKey]) {
        trackCount[trackKey] = { title: entry.title, artist: entry.artist, count: 0 };
      }
      trackCount[trackKey].count++;
    }

    return {
      totalMinutes: history.reduce((sum, h) => sum + (h.duration || 0), 0),
      uniqueArtists: Object.keys(artistCount).length,
      uniqueTracks: Object.keys(trackCount).length,
      topArtists: Object.entries(artistCount)
        .map(([artist, playCount]) => ({ artist, playCount }))
        .sort((a, b) => b.playCount - a.playCount)
        .slice(0, 10),
      topTracks: Object.values(trackCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(t => ({ title: t.title, artist: t.artist, playCount: t.count })),
      genreBreakdown: {}
    };
  }

  // -------------------------------------------------------------------------
  // GAMING
  // -------------------------------------------------------------------------

  async addGame(game: Omit<Game, 'id'>): Promise<Game> {
    const record: Game = {
      ...game,
      id: `game-${Date.now()}`
    };

    // Would save to unified data hub
    return record;
  }

  async getGames(options?: {
    platform?: string;
    status?: string;
    genre?: string;
  }): Promise<Game[]> {
    // Would fetch from unified data hub
    return [];
  }

  async logGameSession(entry: Omit<GameHistoryEntry, 'id' | 'playedAt'>): Promise<GameHistoryEntry> {
    const record: GameHistoryEntry = {
      ...entry,
      id: `game-session-${Date.now()}`,
      playedAt: new Date()
    };

    await unifiedDataHub.logGamePlay(record);

    // Update game hours
    const games = await this.getGames();
    const game = games.find(g => g.id === entry.gameId);
    if (game) {
      game.hoursPlayed += entry.duration / 60;
      game.lastPlayed = new Date();
    }

    return record;
  }

  async getGameStats(days: number = 30): Promise<{
    totalHours: number;
    gamesPlayed: number;
    mostPlayed: Array<{ title: string; hours: number }>;
    byPlatform: Record<string, number>;
    achievements: number;
  }> {
    const history = await unifiedDataHub.getEntertainmentHistory('game');

    const gameHours: Record<string, { title: string; hours: number }> = {};
    const byPlatform: Record<string, number> = {};

    for (const entry of history) {
      const hours = (entry.duration || 0) / 60;

      if (!gameHours[entry.gameId]) {
        gameHours[entry.gameId] = { title: entry.title, hours: 0 };
      }
      gameHours[entry.gameId].hours += hours;

      byPlatform[entry.platform] = (byPlatform[entry.platform] || 0) + hours;
    }

    return {
      totalHours: Object.values(gameHours).reduce((sum, g) => sum + g.hours, 0),
      gamesPlayed: Object.keys(gameHours).length,
      mostPlayed: Object.values(gameHours)
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 10),
      byPlatform,
      achievements: history.filter(h => h.achievement).length
    };
  }

  // -------------------------------------------------------------------------
  // BOARD GAMES
  // -------------------------------------------------------------------------

  async addBoardGame(game: Omit<BoardGame, 'id'>): Promise<BoardGame> {
    const record: BoardGame = {
      ...game,
      id: `boardgame-${Date.now()}`
    };

    // Would save to unified data hub
    return record;
  }

  async getBoardGames(options?: { owned?: boolean }): Promise<BoardGame[]> {
    // Would fetch from unified data hub
    return [];
  }

  async logBoardGamePlay(gameId: string, options?: {
    players?: string[];
    winner?: string;
    duration?: number;
    notes?: string;
  }): Promise<void> {
    const games = await this.getBoardGames();
    const game = games.find(g => g.id === gameId);

    if (game) {
      game.playCount = (game.playCount || 0) + 1;
      game.lastPlayed = new Date();

      await unifiedDataHub.logGamePlay({
        gameId,
        title: game.title,
        platform: 'tabletop',
        duration: options?.duration || 60,
        withWho: options?.players,
        notes: options?.notes
      });
    }
  }

  // -------------------------------------------------------------------------
  // PODCASTS
  // -------------------------------------------------------------------------

  async subscribeToPodcast(podcast: Omit<PodcastSubscription, 'id'>): Promise<PodcastSubscription> {
    const record: PodcastSubscription = {
      ...podcast,
      id: `podcast-${Date.now()}`,
      subscribed: true
    };

    // Would save to unified data hub
    return record;
  }

  async getPodcastSubscriptions(): Promise<PodcastSubscription[]> {
    // Would fetch from unified data hub
    return [];
  }

  async logPodcastListen(podcastId: string, episodeTitle: string, duration: number, completed: boolean): Promise<void> {
    await this.logListen({
      mediaId: podcastId,
      title: episodeTitle,
      artist: '', // Podcast name
      type: 'podcast',
      platform: 'other',
      duration,
      completed
    });
  }

  // -------------------------------------------------------------------------
  // PLAYLISTS
  // -------------------------------------------------------------------------

  async createPlaylist(playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>): Promise<Playlist> {
    const record: Playlist = {
      ...playlist,
      id: `playlist-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Would save to unified data hub
    return record;
  }

  async getPlaylists(options?: { type?: MediaType; mood?: string }): Promise<Playlist[]> {
    // Would fetch from unified data hub
    return [];
  }

  async addToPlaylist(playlistId: string, mediaId: string): Promise<void> {
    const playlists = await this.getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);

    if (playlist && !playlist.items.includes(mediaId)) {
      playlist.items.push(mediaId);
      playlist.updatedAt = new Date();
    }
  }

  async removeFromPlaylist(playlistId: string, mediaId: string): Promise<void> {
    const playlists = await this.getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);

    if (playlist) {
      playlist.items = playlist.items.filter(id => id !== mediaId);
      playlist.updatedAt = new Date();
    }
  }

  // -------------------------------------------------------------------------
  // RECOMMENDATIONS
  // -------------------------------------------------------------------------

  async getRecommendations(options?: {
    type?: MediaType;
    mood?: string;
    limit?: number;
  }): Promise<EntertainmentRecommendation[]> {
    const recommendations: EntertainmentRecommendation[] = [];

    // Get recent history to base recommendations on
    const [watchHistory, listenHistory] = await Promise.all([
      this.getWatchHistory({ limit: 50 }),
      this.getListenHistory({ limit: 100 })
    ]);

    // Generate recommendations based on patterns
    // This is a simplified version - would use ML in production

    // Find most watched genres
    const genreCounts: Record<string, number> = {};
    // Would analyze history for patterns

    // Create recommendations
    recommendations.push({
      id: `rec-${Date.now()}`,
      type: 'music',
      title: 'Discover Weekly',
      reason: 'Based on your listening history',
      basedOn: 'listening_patterns',
      confidence: 0.85,
      platform: 'spotify',
      createdAt: new Date()
    });

    return options?.limit ? recommendations.slice(0, options.limit) : recommendations;
  }

  private async generateMoodBasedRecommendations(mood: any): Promise<void> {
    const moodLevel = mood.mood || 5;
    const energyLevel = mood.energyLevel || 5;

    // Low mood/energy -> calming music, comfort shows
    if (moodLevel < 4 || energyLevel < 4) {
      await unifiedDataHub.addAIInsight({
        category: 'entertainment',
        type: 'recommendation',
        message: 'Based on your current mood, you might enjoy some calming music or a comfort show.',
        data: {
          suggestions: [
            { type: 'music', genre: 'ambient' },
            { type: 'music', genre: 'lo-fi' },
            { type: 'video', genre: 'comedy' }
          ]
        }
      });
    }

    // High energy -> upbeat music, action content
    if (energyLevel > 7) {
      await unifiedDataHub.addAIInsight({
        category: 'entertainment',
        type: 'recommendation',
        message: 'You seem energized! How about some upbeat music or an action movie?',
        data: {
          suggestions: [
            { type: 'music', genre: 'pop' },
            { type: 'music', genre: 'electronic' },
            { type: 'video', genre: 'action' }
          ]
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // ENTERTAINMENT DASHBOARD
  // -------------------------------------------------------------------------

  async getEntertainmentDashboard(): Promise<{
    date: Date;
    currentlyPlaying: MediaItem | null;
    recentlyPlayed: MediaItem[];
    watchStats: {
      hoursThisWeek: number;
      currentSeries: any[];
    };
    listenStats: {
      minutesToday: number;
      topArtistThisWeek: string;
    };
    gameStats: {
      hoursThisWeek: number;
      currentGame: string | null;
    };
    recommendations: EntertainmentRecommendation[];
    connectedPlatforms: Platform[];
    upcomingReleases: any[];
  }> {
    const [
      watchStats,
      listenStats,
      gameStats,
      recommendations,
      connectedPlatforms
    ] = await Promise.all([
      this.getWatchStats(7),
      this.getListenStats(7),
      this.getGameStats(7),
      this.getRecommendations({ limit: 5 }),
      this.getConnectedPlatforms()
    ]);

    return {
      date: new Date(),
      currentlyPlaying: this.currentlyPlaying,
      recentlyPlayed: (await this.getLibrary({ limit: 10 }))
        .filter(m => m.lastPlayed)
        .sort((a, b) => new Date(b.lastPlayed!).getTime() - new Date(a.lastPlayed!).getTime()),
      watchStats: {
        hoursThisWeek: watchStats.totalHours,
        currentSeries: watchStats.mostWatched.filter(m => m.count > 1)
      },
      listenStats: {
        minutesToday: listenStats.totalMinutes,
        topArtistThisWeek: listenStats.topArtists[0]?.artist || 'No data'
      },
      gameStats: {
        hoursThisWeek: gameStats.totalHours,
        currentGame: gameStats.mostPlayed[0]?.title || null
      },
      recommendations,
      connectedPlatforms,
      upcomingReleases: []
    };
  }
}

// Export singleton instance
export const unifiedEntertainmentEcosystem = new UnifiedEntertainmentEcosystem();

// Initialize on import
unifiedEntertainmentEcosystem.initialize().catch(console.error);

export default unifiedEntertainmentEcosystem;
