/**
 * UNTAPPD API INTEGRATION
 * Beer check-ins, ratings, collection, and brewery tracking
 *
 * API Documentation: https://untappd.com/api/docs
 *
 * Features:
 * - Beer check-ins
 * - Personal ratings and reviews
 * - Beer collection
 * - Brewery information
 * - Friend activity
 * - Venue check-ins
 * - Badge tracking
 * - Wishlist management
 */

import { CircuitBreakerRegistry } from '../core/CircuitBreaker';
import { MetricsCollector } from '../core/MetricsCollector';

// ============================================================================
// INTERFACES
// ============================================================================

export interface UntappdConfig {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
}

export interface Beer {
  bid: number;
  beer_name: string;
  beer_label: string;
  beer_style: string;
  beer_abv: number;
  beer_ibu: number;
  beer_description: string;
  brewery: Brewery;
  rating_score: number;
  rating_count: number;
  wish_list: boolean;
}

export interface Brewery {
  brewery_id: number;
  brewery_name: string;
  brewery_label: string;
  brewery_type: string;
  brewery_location: {
    brewery_city: string;
    brewery_state: string;
    brewery_country: string;
  };
}

export interface Checkin {
  checkin_id: number;
  created_at: string;
  rating_score: number;
  checkin_comment: string;
  beer: Beer;
  brewery: Brewery;
  venue?: Venue;
  badges?: Badge[];
  media?: {
    items: Array<{
      photo_id: number;
      photo_url: string;
    }>;
  };
}

export interface Venue {
  venue_id: number;
  venue_name: string;
  venue_location: {
    venue_address: string;
    venue_city: string;
    venue_state: string;
    venue_country: string;
    lat: number;
    lng: number;
  };
}

export interface Badge {
  badge_id: number;
  badge_name: string;
  badge_description: string;
  badge_image: {
    sm: string;
    md: string;
    lg: string;
  };
  created_at: string;
}

export interface UserInfo {
  uid: number;
  user_name: string;
  first_name: string;
  last_name: string;
  user_avatar: string;
  location: string;
  bio: string;
  stats: {
    total_beers: number;
    total_badges: number;
    total_friends: number;
    total_checkins: number;
  };
}

export interface UntappdStats {
  totalCheckins: number;
  uniqueBeers: number;
  totalBadges: number;
  averageRating: number;
  favoriteStyle: string;
  topRatedBeers: Beer[];
  recentCheckins: Checkin[];
}

// ============================================================================
// UNTAPPD INTEGRATION SERVICE
// ============================================================================

class UntappdIntegrationService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private accessToken: string | null = null;
  private baseUrl = 'https://api.untappd.com/v4';

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  initialize(config: UntappdConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.accessToken = config.accessToken || null;

    localStorage.setItem('untappd_client_id', config.clientId);
    localStorage.setItem('untappd_client_secret', config.clientSecret);
    if (config.accessToken) {
      localStorage.setItem('untappd_access_token', config.accessToken);
    }

    console.log('✅ Untappd Integration initialized');
  }

  isConfigured(): boolean {
    if (!this.clientId) {
      this.clientId = localStorage.getItem('untappd_client_id');
      this.clientSecret = localStorage.getItem('untappd_client_secret');
      this.accessToken = localStorage.getItem('untappd_access_token');
    }
    return !!(this.clientId && this.clientSecret);
  }

  private getAuthParams(): string {
    if (this.accessToken) {
      return `access_token=${this.accessToken}`;
    }
    return `client_id=${this.clientId}&client_secret=${this.clientSecret}`;
  }

  // ============================================================================
  // USER PROFILE
  // ============================================================================

  async getUserInfo(username?: string): Promise<UserInfo | null> {
    if (!this.isConfigured()) {
      console.error('Untappd not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('untappd-api');

    try {
      const startTime = Date.now();

      const endpoint = username ? `user/info/${username}` : 'user/info';

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/${endpoint}?${this.getAuthParams()}`);
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      const duration = Date.now() - startTime;
      MetricsCollector.recordAPICall('untappd-api', true, duration);

      return data.response.user;

    } catch (error) {
      console.error('Get user info error:', error);
      MetricsCollector.recordAPICall('untappd-api', false, 0);
      return null;
    }
  }

  // ============================================================================
  // BEER SEARCH & INFO
  // ============================================================================

  async searchBeer(query: string, limit: number = 25): Promise<Beer[] | null> {
    if (!this.isConfigured()) {
      console.error('Untappd not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('untappd-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/search/beer?${this.getAuthParams()}&q=${encodeURIComponent(query)}&limit=${limit}`
        );
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      return data.response.beers.items.map((item: any) => item.beer);

    } catch (error) {
      console.error('Search beer error:', error);
      return null;
    }
  }

  async getBeerInfo(beerId: number): Promise<Beer | null> {
    if (!this.isConfigured()) {
      console.error('Untappd not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('untappd-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/beer/info/${beerId}?${this.getAuthParams()}`);
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      return data.response.beer;

    } catch (error) {
      console.error('Get beer info error:', error);
      return null;
    }
  }

  // ============================================================================
  // CHECK-INS
  // ============================================================================

  async getUserCheckins(username?: string, limit: number = 25): Promise<Checkin[] | null> {
    if (!this.isConfigured()) {
      console.error('Untappd not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('untappd-api');

    try {
      const endpoint = username ? `user/beers/${username}` : 'user/checkins';

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/${endpoint}?${this.getAuthParams()}&limit=${limit}`);
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      return data.response.checkins.items;

    } catch (error) {
      console.error('Get user checkins error:', error);
      return null;
    }
  }

  /**
   * Create a new check-in (requires access token with proper permissions)
   */
  async createCheckin(params: {
    beerId: number;
    rating?: number; // 0-5, 0.25 increments
    comment?: string;
    venueId?: number;
    timezone?: string;
  }): Promise<Checkin | null> {
    if (!this.accessToken) {
      console.error('Access token required for check-ins');
      return null;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('bid', params.beerId.toString());
      if (params.rating) formData.append('rating', params.rating.toString());
      if (params.comment) formData.append('shout', params.comment);
      if (params.venueId) formData.append('foursquare_id', params.venueId.toString());
      if (params.timezone) formData.append('timezone', params.timezone);

      const response = await fetch(`${this.baseUrl}/checkin/add?access_token=${this.accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      return data.response.checkin;

    } catch (error) {
      console.error('Create checkin error:', error);
      return null;
    }
  }

  // ============================================================================
  // BADGES
  // ============================================================================

  async getUserBadges(username?: string): Promise<Badge[] | null> {
    if (!this.isConfigured()) {
      console.error('Untappd not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('untappd-api');

    try {
      const endpoint = username ? `user/badges/${username}` : 'user/badges';

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/${endpoint}?${this.getAuthParams()}`);
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      return data.response.badges.items;

    } catch (error) {
      console.error('Get user badges error:', error);
      return null;
    }
  }

  // ============================================================================
  // WISHLIST
  // ============================================================================

  async getWishlist(username?: string): Promise<Beer[] | null> {
    if (!this.isConfigured()) {
      console.error('Untappd not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('untappd-api');

    try {
      const endpoint = username ? `user/wishlist/${username}` : 'user/wishlist';

      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/${endpoint}?${this.getAuthParams()}`);
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      return data.response.beers.items.map((item: any) => item.beer);

    } catch (error) {
      console.error('Get wishlist error:', error);
      return null;
    }
  }

  async addToWishlist(beerId: number): Promise<boolean> {
    if (!this.accessToken) {
      console.error('Access token required for wishlist');
      return false;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/user/wishlist/add?access_token=${this.accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `bid=${beerId}`
        }
      );

      return response.ok;

    } catch (error) {
      console.error('Add to wishlist error:', error);
      return false;
    }
  }

  async removeFromWishlist(beerId: number): Promise<boolean> {
    if (!this.accessToken) {
      console.error('Access token required for wishlist');
      return false;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/user/wishlist/delete?access_token=${this.accessToken}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `bid=${beerId}`
        }
      );

      return response.ok;

    } catch (error) {
      console.error('Remove from wishlist error:', error);
      return false;
    }
  }

  // ============================================================================
  // BREWERY SEARCH
  // ============================================================================

  async searchBrewery(query: string): Promise<Brewery[] | null> {
    if (!this.isConfigured()) {
      console.error('Untappd not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('untappd-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/search/brewery?${this.getAuthParams()}&q=${encodeURIComponent(query)}`
        );
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      return data.response.brewery.items.map((item: any) => item.brewery);

    } catch (error) {
      console.error('Search brewery error:', error);
      return null;
    }
  }

  async getBreweryInfo(breweryId: number): Promise<Brewery | null> {
    if (!this.isConfigured()) {
      console.error('Untappd not configured');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('untappd-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(`${this.baseUrl}/brewery/info/${breweryId}?${this.getAuthParams()}`);
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      return data.response.brewery;

    } catch (error) {
      console.error('Get brewery info error:', error);
      return null;
    }
  }

  // ============================================================================
  // FRIENDS ACTIVITY
  // ============================================================================

  async getFriendsFeed(limit: number = 25): Promise<Checkin[] | null> {
    if (!this.accessToken) {
      console.error('Access token required for friends feed');
      return null;
    }

    const breaker = CircuitBreakerRegistry.get('untappd-api');

    try {
      const response = await breaker.execute(async () => {
        return await fetch(
          `${this.baseUrl}/checkin/recent?access_token=${this.accessToken}&limit=${limit}`
        );
      });

      if (!response.ok) {
        throw new Error('Untappd API error');
      }

      const data = await response.json();
      return data.response.checkins.items;

    } catch (error) {
      console.error('Get friends feed error:', error);
      return null;
    }
  }

  // ============================================================================
  // STATISTICS
  // ============================================================================

  async getUserStats(): Promise<UntappdStats | null> {
    const userInfo = await this.getUserInfo();
    if (!userInfo) return null;

    const checkins = await this.getUserCheckins();
    if (!checkins) return null;

    // Calculate statistics
    const totalCheckins = userInfo.stats.total_checkins;
    const uniqueBeers = userInfo.stats.total_beers;
    const totalBadges = userInfo.stats.total_badges;

    // Calculate average rating
    const ratingsWithScore = checkins.filter(c => c.rating_score > 0);
    const averageRating = ratingsWithScore.length > 0
      ? ratingsWithScore.reduce((sum, c) => sum + c.rating_score, 0) / ratingsWithScore.length
      : 0;

    // Find favorite style (most common in recent checkins)
    const styleCounts = checkins.reduce((acc: Record<string, number>, c) => {
      const style = c.beer.beer_style;
      acc[style] = (acc[style] || 0) + 1;
      return acc;
    }, {});

    const favoriteStyle = Object.entries(styleCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unknown';

    // Get top rated beers
    const topRatedBeers = [...checkins]
      .filter(c => c.rating_score > 0)
      .sort((a, b) => b.rating_score - a.rating_score)
      .slice(0, 10)
      .map(c => c.beer);

    return {
      totalCheckins,
      uniqueBeers,
      totalBadges,
      averageRating,
      favoriteStyle,
      topRatedBeers,
      recentCheckins: checkins.slice(0, 10)
    };
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get Untappd profile URL
   */
  getProfileUrl(username: string): string {
    return `https://untappd.com/user/${username}`;
  }

  /**
   * Get beer page URL
   */
  getBeerUrl(beerId: number): string {
    return `https://untappd.com/beer/${beerId}`;
  }

  /**
   * Get brewery page URL
   */
  getBreweryUrl(breweryId: number): string {
    return `https://untappd.com/brewery/${breweryId}`;
  }

  /**
   * Format rating display
   */
  formatRating(rating: number): string {
    return `${rating.toFixed(2)} / 5.00`;
  }

  // ============================================================================
  // STATISTICS TRACKING
  // ============================================================================

  getStats(): {
    totalCalls: number;
    successRate: number;
    lastSync?: string;
  } {
    const stats = JSON.parse(localStorage.getItem('untappd_stats') || '{}');

    return {
      totalCalls: stats.totalCalls || 0,
      successRate: stats.successRate || 100,
      lastSync: stats.lastSync
    };
  }

  /**
   * Sync user data
   */
  async syncUserData(): Promise<boolean> {
    const userInfo = await this.getUserInfo();
    if (!userInfo) return false;

    const stats = {
      totalCalls: (this.getStats().totalCalls || 0) + 1,
      successRate: 100,
      lastSync: new Date().toISOString()
    };

    localStorage.setItem('untappd_stats', JSON.stringify(stats));
    localStorage.setItem('untappd_user', JSON.stringify(userInfo));

    console.log(`✅ Synced Untappd data for ${userInfo.user_name}`);
    return true;
  }

  /**
   * Get cached user data
   */
  getCachedUser(): UserInfo | null {
    const cached = localStorage.getItem('untappd_user');
    return cached ? JSON.parse(cached) : null;
  }
}

export const untappdIntegration = new UntappdIntegrationService();
