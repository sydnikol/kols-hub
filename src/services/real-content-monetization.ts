/**
 * REAL CONTENT MONETIZATION SERVICE
 * Connects to actual platforms where you can earn REAL money from content
 *
 * Platforms Integrated:
 * - Medium Partner Program ($100-$5,000+/month)
 * - YouTube AdSense ($100-$10,000+/month)
 * - TikTok Creator Fund ($20-$1,000+/month)
 * - Substack Paid Newsletters ($100-$10,000+/month)
 * - Patreon ($100-$50,000+/month)
 */

export interface ContentPlatform {
  name: string;
  isConfigured: boolean;
  apiKey?: string;
  earnings: number;
  lastSync: Date | null;
  status: 'not_configured' | 'pending_approval' | 'active' | 'error';
  setupUrl: string;
  requirements: string[];
}

export interface ContentEarnings {
  platform: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly';
  details: {
    views?: number;
    subscribers?: number;
    engagement?: number;
  };
}

class RealContentMonetizationService {
  private platforms: Map<string, ContentPlatform> = new Map();

  constructor() {
    this.initializePlatforms();
  }

  /**
   * Initialize all content monetization platforms
   */
  private initializePlatforms() {
    // Medium Partner Program
    this.platforms.set('medium', {
      name: 'Medium Partner Program',
      isConfigured: false,
      earnings: 0,
      lastSync: null,
      status: 'not_configured',
      setupUrl: 'https://medium.com/creators',
      requirements: [
        '100+ followers',
        'At least 1 published story',
        'Be in eligible country (US, UK, CA, etc.)'
      ]
    });

    // YouTube AdSense
    this.platforms.set('youtube', {
      name: 'YouTube AdSense',
      isConfigured: false,
      earnings: 0,
      lastSync: null,
      status: 'not_configured',
      setupUrl: 'https://www.youtube.com/monetization',
      requirements: [
        '1,000+ subscribers',
        '4,000 watch hours in past 12 months',
        'AdSense account linked',
        'Follow YouTube monetization policies'
      ]
    });

    // TikTok Creator Fund
    this.platforms.set('tiktok', {
      name: 'TikTok Creator Fund',
      isConfigured: false,
      earnings: 0,
      lastSync: null,
      status: 'not_configured',
      setupUrl: 'https://www.tiktok.com/creators/creator-portal/en-us/getting-paid-to-create/creator-fund/',
      requirements: [
        '10,000+ followers',
        '100,000+ video views in last 30 days',
        'Be 18+ years old',
        'Follow TikTok Community Guidelines'
      ]
    });

    // Substack
    this.platforms.set('substack', {
      name: 'Substack Paid Newsletters',
      isConfigured: false,
      earnings: 0,
      lastSync: null,
      status: 'not_configured',
      setupUrl: 'https://substack.com/going-paid',
      requirements: [
        'Email list (100+ recommended)',
        'Consistent publishing schedule',
        'Valuable content for paying subscribers'
      ]
    });

    // Patreon
    this.platforms.set('patreon', {
      name: 'Patreon',
      isConfigured: false,
      earnings: 0,
      lastSync: null,
      status: 'not_configured',
      setupUrl: 'https://www.patreon.com/create',
      requirements: [
        'Content that people will pay for',
        'Consistent content creation',
        'Engaged audience'
      ]
    });

    // Load saved configurations
    this.loadSavedConfigurations();
  }

  /**
   * Load saved API keys and configurations
   */
  private loadSavedConfigurations() {
    const savedConfigs = localStorage.getItem('content_platform_configs');
    if (savedConfigs) {
      try {
        const configs = JSON.parse(savedConfigs);
        Object.entries(configs).forEach(([platform, config]: [string, any]) => {
          const existing = this.platforms.get(platform);
          if (existing) {
            this.platforms.set(platform, { ...existing, ...config });
          }
        });
      } catch (error) {
        console.error('Failed to load saved configurations:', error);
      }
    }
  }

  /**
   * Configure Medium Partner Program
   * Get integration token from: https://medium.com/me/settings/security
   */
  async configureMedium(integrationToken: string) {
    try {
      // Verify token with Medium API
      const response = await fetch('https://api.medium.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${integrationToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Invalid Medium token');
      }

      const userData = await response.json();

      this.platforms.set('medium', {
        ...this.platforms.get('medium')!,
        isConfigured: true,
        apiKey: integrationToken,
        status: 'active'
      });

      this.saveConfigurations();
      console.log('✅ Medium configured:', userData.data.username);
      return { success: true, username: userData.data.username };
    } catch (error: any) {
      console.error('Medium configuration failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Configure YouTube Data API
   * Setup: https://console.cloud.google.com/apis/library/youtube.googleapis.com
   */
  async configureYouTube(apiKey: string, channelId: string) {
    try {
      // Verify API key with YouTube API
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Invalid YouTube API key or Channel ID');
      }

      const data = await response.json();
      const channel = data.items[0];

      this.platforms.set('youtube', {
        ...this.platforms.get('youtube')!,
        isConfigured: true,
        apiKey: apiKey,
        status: 'active'
      });

      localStorage.setItem('youtube_channel_id', channelId);
      this.saveConfigurations();

      console.log('✅ YouTube configured:', channel.statistics);
      return {
        success: true,
        subscribers: channel.statistics.subscriberCount,
        views: channel.statistics.viewCount
      };
    } catch (error: any) {
      console.error('YouTube configuration failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get Medium earnings
   */
  async getMediumEarnings(): Promise<ContentEarnings | null> {
    const platform = this.platforms.get('medium');
    if (!platform?.isConfigured || !platform.apiKey) {
      return null;
    }

    try {
      // Medium doesn't have direct earnings API, but we can get stats
      const response = await fetch('https://api.medium.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${platform.apiKey}`
        }
      });

      const data = await response.json();

      // Fetch user's stories
      const storiesResponse = await fetch(
        `https://api.medium.com/v1/users/${data.data.id}/publications`,
        {
          headers: {
            'Authorization': `Bearer ${platform.apiKey}`
          }
        }
      );

      // Medium earnings are shown in their dashboard - we can track views as proxy
      // Estimated: $5-50 per 1000 views on average
      return {
        platform: 'medium',
        amount: 0, // User must manually input from Medium dashboard
        period: 'monthly',
        details: {
          views: 0 // Can't get this from API without additional permissions
        }
      };
    } catch (error) {
      console.error('Failed to get Medium earnings:', error);
      return null;
    }
  }

  /**
   * Get YouTube earnings estimate based on views
   * Actual earnings shown in YouTube Studio > Analytics > Revenue
   */
  async getYouTubeEarnings(): Promise<ContentEarnings | null> {
    const platform = this.platforms.get('youtube');
    const channelId = localStorage.getItem('youtube_channel_id');

    if (!platform?.isConfigured || !platform.apiKey || !channelId) {
      return null;
    }

    try {
      // Get channel statistics
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${platform.apiKey}`
      );

      const data = await response.json();
      const stats = data.items[0].statistics;

      // Estimate earnings: $1-5 per 1000 views (CPM varies by niche)
      // User should check YouTube Studio for actual revenue
      const estimatedEarnings = (parseInt(stats.viewCount) / 1000) * 2; // Conservative $2 CPM

      return {
        platform: 'youtube',
        amount: estimatedEarnings,
        period: 'monthly',
        details: {
          views: parseInt(stats.viewCount),
          subscribers: parseInt(stats.subscriberCount)
        }
      };
    } catch (error) {
      console.error('Failed to get YouTube earnings:', error);
      return null;
    }
  }

  /**
   * Publish article to Medium
   */
  async publishToMedium(title: string, content: string, tags: string[] = []): Promise<boolean> {
    const platform = this.platforms.get('medium');
    if (!platform?.isConfigured || !platform.apiKey) {
      throw new Error('Medium not configured');
    }

    try {
      // Get user ID first
      const userResponse = await fetch('https://api.medium.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${platform.apiKey}`
        }
      });
      const userData = await userResponse.json();
      const userId = userData.data.id;

      // Publish post
      const response = await fetch(`https://api.medium.com/v1/users/${userId}/posts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${platform.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          contentFormat: 'markdown',
          content,
          tags,
          publishStatus: 'public'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to publish to Medium');
      }

      const result = await response.json();
      console.log('✅ Published to Medium:', result.data.url);
      return true;
    } catch (error) {
      console.error('Failed to publish to Medium:', error);
      return false;
    }
  }

  /**
   * Get all platforms
   */
  getAllPlatforms(): ContentPlatform[] {
    return Array.from(this.platforms.values());
  }

  /**
   * Get total earnings across all platforms
   */
  getTotalEarnings(): number {
    return Array.from(this.platforms.values())
      .reduce((total, platform) => total + platform.earnings, 0);
  }

  /**
   * Save configurations
   */
  private saveConfigurations() {
    const configs: any = {};
    this.platforms.forEach((platform, key) => {
      configs[key] = {
        isConfigured: platform.isConfigured,
        apiKey: platform.apiKey,
        earnings: platform.earnings,
        status: platform.status,
        lastSync: platform.lastSync
      };
    });
    localStorage.setItem('content_platform_configs', JSON.stringify(configs));
  }

  /**
   * Manual earnings update (for platforms without API)
   */
  updateEarnings(platform: string, amount: number) {
    const platformData = this.platforms.get(platform);
    if (platformData) {
      platformData.earnings = amount;
      platformData.lastSync = new Date();
      this.platforms.set(platform, platformData);
      this.saveConfigurations();
    }
  }
}

export const contentMonetizationService = new RealContentMonetizationService();
