/**
 * STEAM API INTEGRATION
 * Game library, achievements, playtime, and player stats tracking
 *
 * API Documentation: https://partner.steamgames.com/doc/webapi_overview
 *
 * Features:
 * - Game library tracking
 * - Achievement progress
 * - Playtime statistics
 * - Friend list
 * - Recently played games
 * - Wishlist tracking
 */

import { CircuitBreakerRegistry } from '../core/CircuitBreaker';
import { MetricsCollector } from '../core/MetricsCollector';

// ============================================================================
// INTERFACES
// ============================================================================

export interface SteamConfig {
  apiKey: string;
  steamId: string;
}

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number; // minutes
  playtime_2weeks?: number; // minutes
  img_icon_url: string;
  img_logo_url: string;
  has_community_visible_stats?: boolean;
}

export interface SteamAchievement {
  apiname: string;
  achieved: number; // 0 or 1
  unlocktime: number; // Unix timestamp
  name: string;
  description: string;
}

export interface GameAchievements {
  gameName: string;
  achievements: SteamAchievement[];
  totalAchievements: number;
  completedAchievements: number;
  completionPercentage: number;
}

export interface SteamFriend {
  steamid: string;
  relationship: string;
  friend_since: number;
  personaname?: string;
  avatar?: string;
  gameextrainfo?: string; // Currently playing game
}

export interface RecentlyPlayedGame {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
  img_logo_url: string;
}

export interface PlayerSummary {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number; // 0=Offline, 1=Online, etc.
  communityvisibilitystate: number;
  lastlogoff?: number;
  timecreated?: number;
  gameid?: string;
  gameextrainfo?: string;
}

export interface SteamStats {
  totalGames: number;
  totalPlaytime: number; // hours
  recentPlaytime: number; // hours (last 2 weeks)
  completionRate: number; // percentage
  favoriteGames: SteamGame[];
  achievementProgress: GameAchievements[];
}

// ============================================================================
// STEAM INTEGRATION SERVICE
// ============================================================================

class SteamIntegrationService {
  private apiKey: string | null = null;
  private steamId: string | null = null;
  private baseUrl = 'https://api.steampowered.com';

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  initialize(config: SteamConfig) {
    this.apiKey = config.apiKey;
    this.steamId = config.steamId;
    localStorage.setItem('steam_api_key', config.apiKey);
    localStorage.setItem('steam_id', config.steamId);
    console.log('✅ Steam Integration initialized');
  }

  isConfigured(): boolean {
    if (!this.apiKey) {
      this.apiKey = localStorage.getItem('steam_api_key');
      this.steamId = localStorage.getItem('steam_id');
    }
    return !!(this.apiKey && this.steamId);
  }

  // ============================================================================
  // PLAYER PROFILE
  // ============================================================================

  async getPlayerSummary(steamId?: string): Promise<PlayerSummary | null> {
    if (!this.isConfigured()) {
      console.error('Steam not configured');
      return null;
    }

    const id = steamId || this.steamId;
    const breaker = CircuitBreakerRegistry.get('steam-api');

    try {
      const startTime = Date.now();

      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/ISteamUser/GetPlayerSummaries/v2/?key=${this.apiKey}&steamids=${id}`
        );
      });

      if (!response.ok) {
        throw new Error('Steam API error');
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('steam-api', true, duration);

      if (data.response.players.length === 0) {
        return null;
      }

      return data.response.players[0];

    } catch (error) {
      console.error('Get player summary error:', error);
      MetricsCollector.recordAPICall('steam-api', false, 0);
      return null;
    }
  }

  // ============================================================================
  // GAME LIBRARY
  // ============================================================================

  async getOwnedGames(includeAppInfo: boolean = true): Promise<SteamGame[] | null> {
    if (!this.isConfigured()) {
      console.error('Steam not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('steam-api');

    try {
      const startTime = Date.now();

      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/IPlayerService/GetOwnedGames/v1/?key=${this.apiKey}&steamid=${this.steamId}&include_appinfo=${includeAppInfo ? 1 : 0}&include_played_free_games=1`
        );
      });

      if (!response.ok) {
        throw new Error('Steam API error');
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('steam-api', true, duration);

      return data.response.games || [];

    } catch (error) {
      console.error('Get owned games error:', error);
      MetricsCollector.recordAPICall('steam-api', false, 0);
      return null;
    }
  }

  /**
   * Get recently played games (last 2 weeks)
   */
  async getRecentlyPlayedGames(): Promise<RecentlyPlayedGame[] | null> {
    if (!this.isConfigured()) {
      console.error('Steam not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('steam-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/IPlayerService/GetRecentlyPlayedGames/v1/?key=${this.apiKey}&steamid=${this.steamId}&count=10`
        );
      });

      if (!response.ok) {
        throw new Error('Steam API error');
      }

      const data = await response.json();
      return data.response.games || [];

    } catch (error) {
      console.error('Get recently played games error:', error);
      return null;
    }
  }

  // ============================================================================
  // ACHIEVEMENTS
  // ============================================================================

  async getPlayerAchievements(appId: number): Promise<GameAchievements | null> {
    if (!this.isConfigured()) {
      console.error('Steam not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('steam-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/ISteamUserStats/GetPlayerAchievements/v1/?key=${this.apiKey}&steamid=${this.steamId}&appid=${appId}`
        );
      });

      if (!response.ok) {
        throw new Error('Steam API error');
      }

      const data = await response.json();

      if (!data.playerstats || !data.playerstats.achievements) {
        return null;
      }

      const achievements = data.playerstats.achievements;
      const completed = achievements.filter((a: SteamAchievement) => a.achieved === 1).length;

      return {
        gameName: data.playerstats.gameName,
        achievements: achievements,
        totalAchievements: achievements.length,
        completedAchievements: completed,
        completionPercentage: (completed / achievements.length) * 100
      };

    } catch (error) {
      console.error('Get player achievements error:', error);
      return null;
    }
  }

  /**
   * Get achievement progress for all games
   */
  async getAllAchievementProgress(): Promise<GameAchievements[]> {
    const games = await this.getOwnedGames();
    if (!games) return [];

    const progressList: GameAchievements[] = [];

    // Get achievement progress for games that have achievements
    for (const game of games.filter(g => g.has_community_visible_stats)) {
      const progress = await this.getPlayerAchievements(game.appid);
      if (progress) {
        progressList.push(progress);
      }
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    return progressList.sort((a, b) => b.completionPercentage - a.completionPercentage);
  }

  // ============================================================================
  // FRIENDS
  // ============================================================================

  async getFriendList(): Promise<SteamFriend[] | null> {
    if (!this.isConfigured()) {
      console.error('Steam not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('steam-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/ISteamUser/GetFriendList/v1/?key=${this.apiKey}&steamid=${this.steamId}&relationship=friend`
        );
      });

      if (!response.ok) {
        throw new Error('Steam API error');
      }

      const data = await response.json();

      if (!data.friendslist || !data.friendslist.friends) {
        return [];
      }

      // Get summaries for friends
      const friendIds = data.friendslist.friends.map((f: any) => f.steamid).join(',');
      const summaries = await this.getMultiplePlayerSummaries(friendIds);

      // Merge friend data with summaries
      return data.friendslist.friends.map((friend: any) => {
        const summary = summaries?.find(s => s.steamid === friend.steamid);
        return {
          ...friend,
          personaname: summary?.personaname,
          avatar: summary?.avatar,
          gameextrainfo: summary?.gameextrainfo
        };
      });

    } catch (error) {
      console.error('Get friend list error:', error);
      return null;
    }
  }

  private async getMultiplePlayerSummaries(steamIds: string): Promise<PlayerSummary[] | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/ISteamUser/GetPlayerSummaries/v2/?key=${this.apiKey}&steamids=${steamIds}`
      );

      if (!response.ok) {
        throw new Error('Steam API error');
      }

      const data = await response.json();
      return data.response.players || [];

    } catch (error) {
      console.error('Get multiple player summaries error:', error);
      return null;
    }
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  async getPlayerStats(): Promise<SteamStats | null> {
    const games = await this.getOwnedGames();
    if (!games) return null;

    const totalGames = games.length;
    const totalPlaytime = games.reduce((sum, g) => sum + g.playtime_forever, 0) / 60; // Convert to hours
    const recentPlaytime = games.reduce((sum, g) => sum + (g.playtime_2weeks || 0), 0) / 60;

    // Get favorite games (most played)
    const favoriteGames = [...games]
      .sort((a, b) => b.playtime_forever - a.playtime_forever)
      .slice(0, 10);

    // Calculate completion rate (games with achievements)
    const achievementProgress = await this.getAllAchievementProgress();
    const avgCompletion = achievementProgress.length > 0
      ? achievementProgress.reduce((sum, g) => sum + g.completionPercentage, 0) / achievementProgress.length
      : 0;

    return {
      totalGames,
      totalPlaytime,
      recentPlaytime,
      completionRate: avgCompletion,
      favoriteGames,
      achievementProgress: achievementProgress.slice(0, 5)
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get Steam image URL
   */
  getImageUrl(appId: number, hash: string, type: 'icon' | 'logo' = 'icon'): string {
    return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${hash}.jpg`;
  }

  /**
   * Format playtime
   */
  formatPlaytime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
      return `${hours}h ${remainingMinutes}m`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;

    return `${days}d ${remainingHours}h`;
  }

  /**
   * Get Steam profile URL
   */
  getProfileUrl(steamId?: string): string {
    const id = steamId || this.steamId;
    return `https://steamcommunity.com/profiles/${id}`;
  }

  /**
   * Get game store URL
   */
  getGameStoreUrl(appId: number): string {
    return `https://store.steampowered.com/app/${appId}`;
  }

  // ============================================================================
  // STATISTICS TRACKING
  // ============================================================================

  getStats(): {
    totalCalls: number;
    successRate: number;
    lastSync?: string;
  } {
    const stats = JSON.parse(localStorage.getItem('steam_stats') || '{}');

    return {
      totalCalls: stats.totalCalls || 0,
      successRate: stats.successRate || 100,
      lastSync: stats.lastSync
    };
  }

  /**
   * Save sync timestamp
   */
  async syncLibrary(): Promise<boolean> {
    const games = await this.getOwnedGames();
    if (!games) return false;

    const stats = {
      totalCalls: (this.getStats().totalCalls || 0) + 1,
      successRate: 100,
      lastSync: new Date().toISOString()
    };

    localStorage.setItem('steam_stats', JSON.stringify(stats));
    localStorage.setItem('steam_library', JSON.stringify(games));

    console.log(`✅ Synced ${games.length} games from Steam`);
    return true;
  }

  /**
   * Get cached library
   */
  getCachedLibrary(): SteamGame[] {
    const cached = localStorage.getItem('steam_library');
    return cached ? JSON.parse(cached) : [];
  }
}

export const steamIntegration = new SteamIntegrationService();
