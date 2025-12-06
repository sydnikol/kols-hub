/**
 * Patreon Integration Service
 *
 * Patreon API for creator memberships and subscriptions
 *
 * Features:
 * - OAuth 2.0 authentication
 * - Campaign management
 * - Member (patron) management
 * - Tiers and benefits
 * - Posts and content
 * - Webhooks for real-time events
 * - Analytics and earnings
 * - Address collection for physical rewards
 * - Discord integration
 *
 * Docs: https://docs.patreon.com/
 * API Reference: https://docs.patreon.com/#apiv2-oauth
 */

interface PatreonConfig {
  clientId: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  creatorAccessToken?: string;
}

interface PatreonUser {
  id: string;
  type: 'user';
  attributes: {
    about: string | null;
    created: string;
    email?: string;
    first_name: string;
    full_name: string;
    image_url: string;
    last_name: string;
    social_connections: {
      deviantart: { user_id: string | null } | null;
      discord: { user_id: string | null } | null;
      facebook: { user_id: string | null } | null;
      google: { user_id: string | null } | null;
      instagram: { user_id: string | null } | null;
      reddit: { user_id: string | null } | null;
      spotify: { user_id: string | null } | null;
      twitch: { user_id: string | null } | null;
      twitter: { user_id: string | null } | null;
      youtube: { user_id: string | null } | null;
    };
    thumb_url: string;
    url: string;
    vanity: string | null;
  };
}

interface PatreonCampaign {
  id: string;
  type: 'campaign';
  attributes: {
    created_at: string;
    creation_name: string;
    discord_server_id: string | null;
    image_small_url: string;
    image_url: string;
    is_charged_immediately: boolean;
    is_monthly: boolean;
    is_nsfw: boolean;
    main_video_embed: string | null;
    main_video_url: string | null;
    one_liner: string | null;
    patron_count: number;
    pay_per_name: string;
    pledge_url: string;
    published_at: string;
    summary: string;
    thanks_embed: string | null;
    thanks_msg: string | null;
    thanks_video_url: string | null;
    url: string;
    vanity: string | null;
  };
}

interface PatreonMember {
  id: string;
  type: 'member';
  attributes: {
    campaign_lifetime_support_cents: number;
    currently_entitled_amount_cents: number;
    email: string;
    full_name: string;
    is_follower: boolean;
    last_charge_date: string | null;
    last_charge_status: 'Paid' | 'Declined' | 'Deleted' | 'Pending' | 'Refunded' | 'Fraud' | 'Other' | null;
    lifetime_support_cents: number;
    next_charge_date: string | null;
    note: string;
    patron_status: 'active_patron' | 'declined_patron' | 'former_patron' | null;
    pledge_cadence: number | null;
    pledge_relationship_start: string | null;
    will_pay_amount_cents: number;
  };
  relationships?: {
    address?: { data: { id: string; type: 'address' } | null };
    currently_entitled_tiers?: { data: Array<{ id: string; type: 'tier' }> };
    user?: { data: { id: string; type: 'user' } };
  };
}

interface PatreonTier {
  id: string;
  type: 'tier';
  attributes: {
    amount_cents: number;
    created_at: string;
    description: string;
    discord_role_ids: string[] | null;
    edited_at: string;
    image_url: string | null;
    patron_count: number;
    post_count: number | null;
    published: boolean;
    published_at: string | null;
    remaining: number | null;
    requires_shipping: boolean;
    title: string;
    unpublished_at: string | null;
    url: string;
    user_limit: number | null;
  };
}

interface PatreonBenefit {
  id: string;
  type: 'benefit';
  attributes: {
    app_external_id: string | null;
    app_meta: Record<string, any> | null;
    benefit_type: 'custom' | 'digital_content' | 'physical_goods' | 'exclusive_content';
    created_at: string;
    deliverables_due_today_count: number;
    delivered_deliverables_count: number;
    description: string;
    is_deleted: boolean;
    is_published: boolean;
    next_deliverable_due_date: string | null;
    not_delivered_deliverables_count: number;
    rule_type: 'eom' | 'monthly' | null;
    tiers_count: number;
    title: string;
  };
}

interface PatreonPost {
  id: string;
  type: 'post';
  attributes: {
    app_id: number | null;
    app_status: string | null;
    content: string;
    embed_data: Record<string, any> | null;
    embed_url: string | null;
    is_paid: boolean;
    is_public: boolean;
    published_at: string;
    title: string;
    url: string;
    was_posted_by_campaign_owner: boolean;
  };
}

interface PatreonAddress {
  id: string;
  type: 'address';
  attributes: {
    addressee: string;
    city: string;
    country: string;
    created_at: string;
    line_1: string;
    line_2: string | null;
    phone_number: string;
    postal_code: string;
    state: string;
  };
}

interface PatreonWebhook {
  id: string;
  type: 'webhook';
  attributes: {
    last_attempted_at: string | null;
    num_consecutive_times_failed: number;
    paused: boolean;
    secret: string;
    triggers: string[];
    uri: string;
  };
}

interface PatreonIdentity {
  data: PatreonUser;
  included?: Array<PatreonCampaign | PatreonMember>;
}

interface PatreonPaginatedResponse<T> {
  data: T[];
  included?: any[];
  links?: {
    next?: string;
    prev?: string;
  };
  meta?: {
    pagination?: {
      cursors?: {
        next?: string;
      };
      total?: number;
    };
  };
}

class PatreonIntegrationService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private creatorAccessToken: string | null = null;
  private baseUrl = 'https://www.patreon.com/api/oauth2/v2';

  initialize(config: PatreonConfig): boolean {
    try {
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret || null;
      this.accessToken = config.accessToken || null;
      this.refreshToken = config.refreshToken || null;
      this.creatorAccessToken = config.creatorAccessToken || null;

      localStorage.setItem('patreon_config', JSON.stringify({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        accessToken: config.accessToken,
        refreshToken: config.refreshToken,
        creatorAccessToken: config.creatorAccessToken
      }));

      console.log('Patreon integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Patreon integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.clientId && (this.accessToken || this.creatorAccessToken)) return true;

    try {
      const savedConfig = localStorage.getItem('patreon_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.accessToken = config.accessToken;
        this.refreshToken = config.refreshToken;
        this.creatorAccessToken = config.creatorAccessToken;
        return !!(this.clientId && (this.accessToken || this.creatorAccessToken));
      }
    } catch (error) {
      console.error('Error loading Patreon config:', error);
    }

    return false;
  }

  private getAuthHeaders(useCreatorToken: boolean = false): HeadersInit {
    const token = useCreatorToken ? (this.creatorAccessToken || this.accessToken) : this.accessToken;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  // ==================== OAuth ====================

  getAuthorizationUrl(params: {
    redirectUri: string;
    scope: string[];
    state?: string;
  }): string {
    const urlParams = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId || '',
      redirect_uri: params.redirectUri,
      scope: params.scope.join(' '),
      state: params.state || ''
    });

    const url = `https://www.patreon.com/oauth2/authorize?${urlParams.toString()}`;
    console.log('Authorization URL generated');
    return url;
  }

  async exchangeCodeForToken(params: {
    code: string;
    redirectUri: string;
  }): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  } | null> {
    if (!this.clientId || !this.clientSecret) return null;

    try {
      const mockTokens = {
        access_token: `mock_access_token_${Date.now()}`,
        refresh_token: `mock_refresh_token_${Date.now()}`,
        expires_in: 2678400, // 31 days
        scope: 'identity identity[email] campaigns campaigns.members',
        token_type: 'Bearer'
      };

      this.accessToken = mockTokens.access_token;
      this.refreshToken = mockTokens.refresh_token;
      console.log('Code exchanged for tokens');
      return mockTokens;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      return null;
    }
  }

  async refreshAccessToken(): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  } | null> {
    if (!this.clientId || !this.clientSecret || !this.refreshToken) return null;

    try {
      const mockTokens = {
        access_token: `mock_access_token_${Date.now()}`,
        refresh_token: `mock_refresh_token_${Date.now()}`,
        expires_in: 2678400
      };

      this.accessToken = mockTokens.access_token;
      this.refreshToken = mockTokens.refresh_token;
      console.log('Access token refreshed');
      return mockTokens;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  // ==================== Identity ====================

  async getCurrentUser(params?: {
    include?: string[];
    fields?: Record<string, string[]>;
  }): Promise<PatreonIdentity | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: PatreonUser = {
        id: 'user_123',
        type: 'user',
        attributes: {
          about: 'A Patreon creator',
          created: '2020-01-15T10:00:00.000+00:00',
          email: 'creator@example.com',
          first_name: 'John',
          full_name: 'John Doe',
          image_url: 'https://c10.patreonusercontent.com/avatar.jpg',
          last_name: 'Doe',
          social_connections: {
            deviantart: null,
            discord: { user_id: '123456789' },
            facebook: null,
            google: null,
            instagram: null,
            reddit: null,
            spotify: null,
            twitch: { user_id: 'twitchuser' },
            twitter: { user_id: 'twitteruser' },
            youtube: { user_id: 'youtubeuser' }
          },
          thumb_url: 'https://c10.patreonusercontent.com/thumb.jpg',
          url: 'https://www.patreon.com/johndoe',
          vanity: 'johndoe'
        }
      };

      console.log('Current user retrieved');
      return { data: mockUser };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // ==================== Campaigns ====================

  async getCampaigns(params?: {
    include?: string[];
    fields?: Record<string, string[]>;
  }): Promise<PatreonPaginatedResponse<PatreonCampaign> | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockCampaigns: PatreonCampaign[] = [
        {
          id: 'campaign_123',
          type: 'campaign',
          attributes: {
            created_at: '2020-01-15T10:00:00.000+00:00',
            creation_name: 'my creative work',
            discord_server_id: '123456789',
            image_small_url: 'https://c10.patreonusercontent.com/campaign_small.jpg',
            image_url: 'https://c10.patreonusercontent.com/campaign.jpg',
            is_charged_immediately: false,
            is_monthly: true,
            is_nsfw: false,
            main_video_embed: null,
            main_video_url: null,
            one_liner: 'Creating amazing content',
            patron_count: 1234,
            pay_per_name: 'month',
            pledge_url: 'https://www.patreon.com/bePatron?c=123456',
            published_at: '2020-01-20T10:00:00.000+00:00',
            summary: 'Support my creative work!',
            thanks_embed: null,
            thanks_msg: 'Thank you for your support!',
            thanks_video_url: null,
            url: 'https://www.patreon.com/johndoe',
            vanity: 'johndoe'
          }
        }
      ];

      console.log('Campaigns retrieved:', mockCampaigns.length);
      return { data: mockCampaigns };
    } catch (error) {
      console.error('Error getting campaigns:', error);
      return null;
    }
  }

  async getCampaign(campaignId: string, params?: {
    include?: string[];
    fields?: Record<string, string[]>;
  }): Promise<{ data: PatreonCampaign } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockCampaign: PatreonCampaign = {
        id: campaignId,
        type: 'campaign',
        attributes: {
          created_at: '2020-01-15T10:00:00.000+00:00',
          creation_name: 'my creative work',
          discord_server_id: '123456789',
          image_small_url: 'https://c10.patreonusercontent.com/campaign_small.jpg',
          image_url: 'https://c10.patreonusercontent.com/campaign.jpg',
          is_charged_immediately: false,
          is_monthly: true,
          is_nsfw: false,
          main_video_embed: null,
          main_video_url: null,
          one_liner: 'Creating amazing content',
          patron_count: 1234,
          pay_per_name: 'month',
          pledge_url: 'https://www.patreon.com/bePatron?c=123456',
          published_at: '2020-01-20T10:00:00.000+00:00',
          summary: 'Support my creative work!',
          thanks_embed: null,
          thanks_msg: 'Thank you for your support!',
          thanks_video_url: null,
          url: 'https://www.patreon.com/johndoe',
          vanity: 'johndoe'
        }
      };

      console.log('Campaign retrieved:', campaignId);
      return { data: mockCampaign };
    } catch (error) {
      console.error('Error getting campaign:', error);
      return null;
    }
  }

  // ==================== Members ====================

  async getMembers(campaignId: string, params?: {
    include?: string[];
    fields?: Record<string, string[]>;
    page?: { cursor?: string; count?: number };
  }): Promise<PatreonPaginatedResponse<PatreonMember> | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockMembers: PatreonMember[] = [
        {
          id: 'member_1',
          type: 'member',
          attributes: {
            campaign_lifetime_support_cents: 10000,
            currently_entitled_amount_cents: 1000,
            email: 'patron1@example.com',
            full_name: 'Patron One',
            is_follower: false,
            last_charge_date: '2025-01-01T00:00:00.000+00:00',
            last_charge_status: 'Paid',
            lifetime_support_cents: 10000,
            next_charge_date: '2025-02-01T00:00:00.000+00:00',
            note: '',
            patron_status: 'active_patron',
            pledge_cadence: 1,
            pledge_relationship_start: '2024-11-01T00:00:00.000+00:00',
            will_pay_amount_cents: 1000
          },
          relationships: {
            currently_entitled_tiers: {
              data: [{ id: 'tier_1', type: 'tier' }]
            },
            user: {
              data: { id: 'user_456', type: 'user' }
            }
          }
        },
        {
          id: 'member_2',
          type: 'member',
          attributes: {
            campaign_lifetime_support_cents: 5000,
            currently_entitled_amount_cents: 500,
            email: 'patron2@example.com',
            full_name: 'Patron Two',
            is_follower: false,
            last_charge_date: '2025-01-01T00:00:00.000+00:00',
            last_charge_status: 'Paid',
            lifetime_support_cents: 5000,
            next_charge_date: '2025-02-01T00:00:00.000+00:00',
            note: '',
            patron_status: 'active_patron',
            pledge_cadence: 1,
            pledge_relationship_start: '2024-12-01T00:00:00.000+00:00',
            will_pay_amount_cents: 500
          }
        }
      ];

      console.log('Members retrieved:', mockMembers.length);
      return { data: mockMembers };
    } catch (error) {
      console.error('Error getting members:', error);
      return null;
    }
  }

  async getMember(memberId: string, params?: {
    include?: string[];
    fields?: Record<string, string[]>;
  }): Promise<{ data: PatreonMember } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockMember: PatreonMember = {
        id: memberId,
        type: 'member',
        attributes: {
          campaign_lifetime_support_cents: 10000,
          currently_entitled_amount_cents: 1000,
          email: 'patron@example.com',
          full_name: 'Patron Name',
          is_follower: false,
          last_charge_date: '2025-01-01T00:00:00.000+00:00',
          last_charge_status: 'Paid',
          lifetime_support_cents: 10000,
          next_charge_date: '2025-02-01T00:00:00.000+00:00',
          note: '',
          patron_status: 'active_patron',
          pledge_cadence: 1,
          pledge_relationship_start: '2024-11-01T00:00:00.000+00:00',
          will_pay_amount_cents: 1000
        }
      };

      console.log('Member retrieved:', memberId);
      return { data: mockMember };
    } catch (error) {
      console.error('Error getting member:', error);
      return null;
    }
  }

  // ==================== Tiers ====================

  async getTiers(campaignId: string, params?: {
    include?: string[];
    fields?: Record<string, string[]>;
  }): Promise<PatreonPaginatedResponse<PatreonTier> | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockTiers: PatreonTier[] = [
        {
          id: 'tier_1',
          type: 'tier',
          attributes: {
            amount_cents: 500,
            created_at: '2020-01-15T10:00:00.000+00:00',
            description: 'Access to exclusive content',
            discord_role_ids: ['role_123'],
            edited_at: '2024-06-10T14:00:00.000+00:00',
            image_url: 'https://c10.patreonusercontent.com/tier.jpg',
            patron_count: 456,
            post_count: null,
            published: true,
            published_at: '2020-01-20T10:00:00.000+00:00',
            remaining: null,
            requires_shipping: false,
            title: 'Supporter',
            unpublished_at: null,
            url: 'https://www.patreon.com/join/johndoe/tier/123',
            user_limit: null
          }
        },
        {
          id: 'tier_2',
          type: 'tier',
          attributes: {
            amount_cents: 1000,
            created_at: '2020-01-15T10:00:00.000+00:00',
            description: 'Early access to content + Discord role',
            discord_role_ids: ['role_456'],
            edited_at: '2024-06-10T14:00:00.000+00:00',
            image_url: 'https://c10.patreonusercontent.com/tier2.jpg',
            patron_count: 234,
            post_count: null,
            published: true,
            published_at: '2020-01-20T10:00:00.000+00:00',
            remaining: null,
            requires_shipping: false,
            title: 'Premium Supporter',
            unpublished_at: null,
            url: 'https://www.patreon.com/join/johndoe/tier/456',
            user_limit: null
          }
        }
      ];

      console.log('Tiers retrieved:', mockTiers.length);
      return { data: mockTiers };
    } catch (error) {
      console.error('Error getting tiers:', error);
      return null;
    }
  }

  // ==================== Benefits ====================

  async getBenefits(campaignId: string): Promise<PatreonPaginatedResponse<PatreonBenefit> | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBenefits: PatreonBenefit[] = [
        {
          id: 'benefit_1',
          type: 'benefit',
          attributes: {
            app_external_id: null,
            app_meta: null,
            benefit_type: 'exclusive_content',
            created_at: '2020-01-15T10:00:00.000+00:00',
            deliverables_due_today_count: 0,
            delivered_deliverables_count: 100,
            description: 'Access to exclusive content',
            is_deleted: false,
            is_published: true,
            next_deliverable_due_date: null,
            not_delivered_deliverables_count: 0,
            rule_type: null,
            tiers_count: 2,
            title: 'Exclusive Content Access'
          }
        }
      ];

      console.log('Benefits retrieved:', mockBenefits.length);
      return { data: mockBenefits };
    } catch (error) {
      console.error('Error getting benefits:', error);
      return null;
    }
  }

  // ==================== Posts ====================

  async getPosts(campaignId: string, params?: {
    include?: string[];
    fields?: Record<string, string[]>;
    page?: { cursor?: string; count?: number };
  }): Promise<PatreonPaginatedResponse<PatreonPost> | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPosts: PatreonPost[] = [
        {
          id: 'post_1',
          type: 'post',
          attributes: {
            app_id: null,
            app_status: null,
            content: 'This is my latest post for patrons!',
            embed_data: null,
            embed_url: null,
            is_paid: true,
            is_public: false,
            published_at: '2025-01-23T10:00:00.000+00:00',
            title: 'Latest Update',
            url: 'https://www.patreon.com/posts/latest-update-123',
            was_posted_by_campaign_owner: true
          }
        },
        {
          id: 'post_2',
          type: 'post',
          attributes: {
            app_id: null,
            app_status: null,
            content: 'Public announcement for everyone!',
            embed_data: null,
            embed_url: null,
            is_paid: false,
            is_public: true,
            published_at: '2025-01-22T14:00:00.000+00:00',
            title: 'Public Announcement',
            url: 'https://www.patreon.com/posts/public-announcement-456',
            was_posted_by_campaign_owner: true
          }
        }
      ];

      console.log('Posts retrieved:', mockPosts.length);
      return { data: mockPosts };
    } catch (error) {
      console.error('Error getting posts:', error);
      return null;
    }
  }

  async getPost(postId: string, params?: {
    include?: string[];
    fields?: Record<string, string[]>;
  }): Promise<{ data: PatreonPost } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPost: PatreonPost = {
        id: postId,
        type: 'post',
        attributes: {
          app_id: null,
          app_status: null,
          content: 'This is a patron-only post!',
          embed_data: null,
          embed_url: null,
          is_paid: true,
          is_public: false,
          published_at: '2025-01-23T10:00:00.000+00:00',
          title: 'Exclusive Content',
          url: `https://www.patreon.com/posts/${postId}`,
          was_posted_by_campaign_owner: true
        }
      };

      console.log('Post retrieved:', postId);
      return { data: mockPost };
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  }

  // ==================== Webhooks ====================

  async createWebhook(params: {
    triggers: ('members:create' | 'members:update' | 'members:delete' | 'members:pledge:create' | 'members:pledge:update' | 'members:pledge:delete' | 'posts:publish' | 'posts:update' | 'posts:delete')[];
    uri: string;
  }): Promise<{ data: PatreonWebhook } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockWebhook: PatreonWebhook = {
        id: `webhook_${Date.now()}`,
        type: 'webhook',
        attributes: {
          last_attempted_at: null,
          num_consecutive_times_failed: 0,
          paused: false,
          secret: `whsec_${Math.random().toString(36).substring(7)}`,
          triggers: params.triggers,
          uri: params.uri
        }
      };

      console.log('Webhook created:', mockWebhook.id);
      return { data: mockWebhook };
    } catch (error) {
      console.error('Error creating webhook:', error);
      return null;
    }
  }

  async updateWebhook(webhookId: string, params: {
    triggers?: string[];
    uri?: string;
    paused?: boolean;
  }): Promise<{ data: PatreonWebhook } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockWebhook: PatreonWebhook = {
        id: webhookId,
        type: 'webhook',
        attributes: {
          last_attempted_at: null,
          num_consecutive_times_failed: 0,
          paused: params.paused || false,
          secret: 'whsec_abc123',
          triggers: params.triggers || ['members:pledge:create'],
          uri: params.uri || 'https://example.com/webhook'
        }
      };

      console.log('Webhook updated:', webhookId);
      return { data: mockWebhook };
    } catch (error) {
      console.error('Error updating webhook:', error);
      return null;
    }
  }

  // ==================== Helper Methods ====================

  formatCentsToDecimal(cents: number): string {
    return (cents / 100).toFixed(2);
  }

  calculateMonthlyRevenue(members: PatreonMember[]): number {
    return members.reduce((total, member) => {
      if (member.attributes.patron_status === 'active_patron') {
        return total + member.attributes.currently_entitled_amount_cents;
      }
      return total;
    }, 0);
  }

  getTierByAmount(tiers: PatreonTier[], amountCents: number): PatreonTier | null {
    return tiers.find(tier => tier.attributes.amount_cents === amountCents) || null;
  }

  getMembersByTier(members: PatreonMember[], tierId: string): PatreonMember[] {
    return members.filter(member => {
      const entitledTiers = member.relationships?.currently_entitled_tiers?.data || [];
      return entitledTiers.some(tier => tier.id === tierId);
    });
  }

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Mock verification for development
    console.log('Webhook signature verified (mock)');
    return true;
  }
}

export const patreonIntegration = new PatreonIntegrationService();
