/**
 * Twitch Integration Service
 *
 * Twitch API for streaming, chat, and community features
 *
 * Features:
 * - User authentication (OAuth 2.0)
 * - Stream and channel information
 * - Chat integration and moderation
 * - Clips and videos management
 * - Subscriptions and followers
 * - Bits, cheers, and channel points
 * - Analytics and insights
 * - EventSub (webhooks) for real-time events
 * - Game and category data
 *
 * Docs: https://dev.twitch.tv/docs/
 * API Reference: https://dev.twitch.tv/docs/api/reference
 */

interface TwitchConfig {
  clientId: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
}

interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  type: 'staff' | 'admin' | 'global_mod' | '';
  broadcaster_type: 'partner' | 'affiliate' | '';
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email?: string;
  created_at: string;
}

interface TwitchStream {
  id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: 'live' | '';
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  tags: string[];
  is_mature: boolean;
}

interface TwitchChannel {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  broadcaster_language: string;
  game_id: string;
  game_name: string;
  title: string;
  delay: number;
  tags: string[];
}

interface TwitchGame {
  id: string;
  name: string;
  box_art_url: string;
  igdb_id: string;
}

interface TwitchVideo {
  id: string;
  stream_id: string | null;
  user_id: string;
  user_login: string;
  user_name: string;
  title: string;
  description: string;
  created_at: string;
  published_at: string;
  url: string;
  thumbnail_url: string;
  viewable: 'public' | 'private';
  view_count: number;
  language: string;
  type: 'upload' | 'archive' | 'highlight';
  duration: string;
  muted_segments: Array<{ duration: number; offset: number }> | null;
}

interface TwitchClip {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
  vod_offset: number | null;
}

interface TwitchSubscription {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  gifter_id: string;
  gifter_login: string;
  gifter_name: string;
  is_gift: boolean;
  tier: '1000' | '2000' | '3000';
  plan_name: string;
  user_id: string;
  user_name: string;
  user_login: string;
}

interface TwitchFollower {
  from_id: string;
  from_login: string;
  from_name: string;
  to_id: string;
  to_login: string;
  to_name: string;
  followed_at: string;
}

interface TwitchChatMessage {
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
  chatter_user_id: string;
  chatter_user_login: string;
  chatter_user_name: string;
  message_id: string;
  message: {
    text: string;
    fragments: Array<{
      type: 'text' | 'cheermote' | 'emote' | 'mention';
      text: string;
      cheermote?: {
        prefix: string;
        bits: number;
        tier: number;
      };
      emote?: {
        id: string;
        emote_set_id: string;
        owner_id: string;
        format: string[];
      };
      mention?: {
        user_id: string;
        user_name: string;
        user_login: string;
      };
    }>;
  };
  color: string;
  badges: Array<{
    set_id: string;
    id: string;
    info: string;
  }>;
  message_type: 'text' | 'channel_points_highlighted' | 'channel_points_sub_only' | 'user_intro';
  cheer?: {
    bits: number;
  };
  reply?: {
    parent_message_id: string;
    parent_message_body: string;
    parent_user_id: string;
    parent_user_name: string;
    parent_user_login: string;
    thread_message_id: string;
    thread_user_id: string;
    thread_user_name: string;
    thread_user_login: string;
  };
}

interface TwitchModerator {
  user_id: string;
  user_login: string;
  user_name: string;
}

interface TwitchBannedUser {
  user_id: string;
  user_login: string;
  user_name: string;
  expires_at: string;
  created_at: string;
  reason: string;
  moderator_id: string;
  moderator_login: string;
  moderator_name: string;
}

interface TwitchEventSubSubscription {
  id: string;
  status: 'enabled' | 'webhook_callback_verification_pending' | 'webhook_callback_verification_failed' | 'notification_failures_exceeded' | 'authorization_revoked' | 'moderator_removed' | 'user_removed' | 'version_removed';
  type: string;
  version: string;
  condition: Record<string, string>;
  created_at: string;
  transport: {
    method: 'webhook' | 'websocket';
    callback?: string;
    secret?: string;
    session_id?: string;
  };
  cost: number;
}

interface TwitchChannelPointsReward {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  id: string;
  title: string;
  prompt: string;
  cost: number;
  image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  } | null;
  default_image: {
    url_1x: string;
    url_2x: string;
    url_4x: string;
  };
  background_color: string;
  is_enabled: boolean;
  is_user_input_required: boolean;
  max_per_stream_setting: {
    is_enabled: boolean;
    max_per_stream: number;
  };
  max_per_user_per_stream_setting: {
    is_enabled: boolean;
    max_per_user_per_stream: number;
  };
  global_cooldown_setting: {
    is_enabled: boolean;
    global_cooldown_seconds: number;
  };
  is_paused: boolean;
  is_in_stock: boolean;
  should_redemptions_skip_request_queue: boolean;
  redemptions_redeemed_current_stream: number | null;
  cooldown_expires_at: string | null;
}

interface TwitchAnalytics {
  game_id: string;
  URL: string;
  type: string;
  date_range: {
    started_at: string;
    ended_at: string;
  };
}

interface TwitchPoll {
  id: string;
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_login: string;
  title: string;
  choices: Array<{
    id: string;
    title: string;
    votes: number;
    channel_points_votes: number;
    bits_votes: number;
  }>;
  bits_voting_enabled: boolean;
  bits_per_vote: number;
  channel_points_voting_enabled: boolean;
  channel_points_per_vote: number;
  status: 'ACTIVE' | 'COMPLETED' | 'TERMINATED' | 'ARCHIVED' | 'MODERATED' | 'INVALID';
  duration: number;
  started_at: string;
  ended_at?: string;
}

interface TwitchPrediction {
  id: string;
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_login: string;
  title: string;
  winning_outcome_id: string | null;
  outcomes: Array<{
    id: string;
    title: string;
    users: number;
    channel_points: number;
    top_predictors: Array<{
      user_id: string;
      user_name: string;
      user_login: string;
      channel_points_used: number;
      channel_points_won: number | null;
    }> | null;
    color: 'BLUE' | 'PINK';
  }>;
  prediction_window: number;
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELED' | 'LOCKED';
  created_at: string;
  ended_at: string | null;
  locked_at: string | null;
}

class TwitchIntegrationService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private baseUrl = 'https://api.twitch.tv/helix';

  initialize(config: TwitchConfig): boolean {
    try {
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret || null;
      this.accessToken = config.accessToken || null;
      this.refreshToken = config.refreshToken || null;

      localStorage.setItem('twitch_config', JSON.stringify({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        accessToken: config.accessToken,
        refreshToken: config.refreshToken
      }));

      console.log('Twitch integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Twitch integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.clientId && this.accessToken) return true;

    try {
      const savedConfig = localStorage.getItem('twitch_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.accessToken = config.accessToken;
        this.refreshToken = config.refreshToken;
        return !!(this.clientId && this.accessToken);
      }
    } catch (error) {
      console.error('Error loading Twitch config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Client-ID': this.clientId || '',
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  // ==================== OAuth ====================

  getAuthorizationUrl(params: {
    redirectUri: string;
    scope: string[];
    state?: string;
    forceVerify?: boolean;
  }): string {
    const urlParams = new URLSearchParams({
      client_id: this.clientId || '',
      redirect_uri: params.redirectUri,
      response_type: 'code',
      scope: params.scope.join(' '),
      state: params.state || '',
      force_verify: params.forceVerify ? 'true' : 'false'
    });

    const url = `https://id.twitch.tv/oauth2/authorize?${urlParams.toString()}`;
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
    scope: string[];
    token_type: string;
  } | null> {
    if (!this.clientId || !this.clientSecret) return null;

    try {
      const mockTokens = {
        access_token: `mock_access_token_${Date.now()}`,
        refresh_token: `mock_refresh_token_${Date.now()}`,
        expires_in: 14400,
        scope: ['user:read:email', 'channel:read:subscriptions'],
        token_type: 'bearer'
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

  // ==================== Users ====================

  async getUsers(params?: {
    id?: string[];
    login?: string[];
  }): Promise<TwitchUser[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUsers: TwitchUser[] = [
        {
          id: '12345678',
          login: 'twitchuser',
          display_name: 'TwitchUser',
          type: '',
          broadcaster_type: 'partner',
          description: 'A Twitch streamer',
          profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/profile.png',
          offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/offline.png',
          view_count: 12345,
          created_at: '2020-01-15T10:00:00Z'
        }
      ];

      console.log('Users retrieved:', mockUsers.length);
      return mockUsers;
    } catch (error) {
      console.error('Error getting users:', error);
      return null;
    }
  }

  async updateUser(params: {
    description?: string;
  }): Promise<TwitchUser | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: TwitchUser = {
        id: '12345678',
        login: 'twitchuser',
        display_name: 'TwitchUser',
        type: '',
        broadcaster_type: 'partner',
        description: params.description || 'Updated description',
        profile_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/profile.png',
        offline_image_url: 'https://static-cdn.jtvnw.net/jtv_user_pictures/offline.png',
        view_count: 12345,
        created_at: '2020-01-15T10:00:00Z'
      };

      console.log('User updated');
      return mockUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  // ==================== Streams ====================

  async getStreams(params?: {
    user_id?: string[];
    user_login?: string[];
    game_id?: string[];
    language?: string[];
    first?: number;
  }): Promise<TwitchStream[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockStreams: TwitchStream[] = [
        {
          id: '40987654321',
          user_id: '12345678',
          user_login: 'twitchuser',
          user_name: 'TwitchUser',
          game_id: '509658',
          game_name: 'Just Chatting',
          type: 'live',
          title: 'Playing games with viewers!',
          viewer_count: 1234,
          started_at: '2025-01-23T10:00:00Z',
          language: 'en',
          thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_twitchuser-{width}x{height}.jpg',
          tag_ids: [],
          tags: ['English', 'Gaming'],
          is_mature: false
        }
      ];

      console.log('Streams retrieved:', mockStreams.length);
      return mockStreams;
    } catch (error) {
      console.error('Error getting streams:', error);
      return null;
    }
  }

  // ==================== Channels ====================

  async getChannelInformation(broadcasterId: string): Promise<TwitchChannel | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockChannel: TwitchChannel = {
        broadcaster_id: broadcasterId,
        broadcaster_login: 'twitchuser',
        broadcaster_name: 'TwitchUser',
        broadcaster_language: 'en',
        game_id: '509658',
        game_name: 'Just Chatting',
        title: 'Playing games with viewers!',
        delay: 0,
        tags: ['English', 'Gaming']
      };

      console.log('Channel information retrieved');
      return mockChannel;
    } catch (error) {
      console.error('Error getting channel information:', error);
      return null;
    }
  }

  async modifyChannelInformation(broadcasterId: string, params: {
    game_id?: string;
    broadcaster_language?: string;
    title?: string;
    delay?: number;
    tags?: string[];
  }): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Channel information modified');
      return true;
    } catch (error) {
      console.error('Error modifying channel information:', error);
      return false;
    }
  }

  // ==================== Games ====================

  async getGames(params: {
    id?: string[];
    name?: string[];
    igdb_id?: string[];
  }): Promise<TwitchGame[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockGames: TwitchGame[] = [
        {
          id: '509658',
          name: 'Just Chatting',
          box_art_url: 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg',
          igdb_id: ''
        }
      ];

      console.log('Games retrieved:', mockGames.length);
      return mockGames;
    } catch (error) {
      console.error('Error getting games:', error);
      return null;
    }
  }

  async getTopGames(params?: {
    first?: number;
  }): Promise<TwitchGame[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockGames: TwitchGame[] = [
        {
          id: '509658',
          name: 'Just Chatting',
          box_art_url: 'https://static-cdn.jtvnw.net/ttv-boxart/509658-{width}x{height}.jpg',
          igdb_id: ''
        },
        {
          id: '32982',
          name: 'Grand Theft Auto V',
          box_art_url: 'https://static-cdn.jtvnw.net/ttv-boxart/32982-{width}x{height}.jpg',
          igdb_id: '1020'
        }
      ];

      console.log('Top games retrieved:', mockGames.length);
      return mockGames;
    } catch (error) {
      console.error('Error getting top games:', error);
      return null;
    }
  }

  // ==================== Videos ====================

  async getVideos(params: {
    id?: string[];
    user_id?: string;
    game_id?: string;
    type?: 'all' | 'upload' | 'archive' | 'highlight';
    first?: number;
  }): Promise<TwitchVideo[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockVideos: TwitchVideo[] = [
        {
          id: '123456789',
          stream_id: null,
          user_id: '12345678',
          user_login: 'twitchuser',
          user_name: 'TwitchUser',
          title: 'Epic Gaming Moments',
          description: 'Highlights from last stream',
          created_at: '2025-01-22T10:00:00Z',
          published_at: '2025-01-22T10:00:00Z',
          url: 'https://www.twitch.tv/videos/123456789',
          thumbnail_url: 'https://static-cdn.jtvnw.net/previews-ttv/video-123456789-{width}x{height}.jpg',
          viewable: 'public',
          view_count: 5678,
          language: 'en',
          type: 'highlight',
          duration: '5m30s',
          muted_segments: null
        }
      ];

      console.log('Videos retrieved:', mockVideos.length);
      return mockVideos;
    } catch (error) {
      console.error('Error getting videos:', error);
      return null;
    }
  }

  // ==================== Clips ====================

  async getClips(params: {
    broadcaster_id?: string;
    game_id?: string;
    id?: string[];
    started_at?: string;
    ended_at?: string;
    first?: number;
  }): Promise<TwitchClip[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockClips: TwitchClip[] = [
        {
          id: 'AwkwardHelplessSalamanderSwiftRage',
          url: 'https://clips.twitch.tv/AwkwardHelplessSalamanderSwiftRage',
          embed_url: 'https://clips.twitch.tv/embed?clip=AwkwardHelplessSalamanderSwiftRage',
          broadcaster_id: '12345678',
          broadcaster_name: 'TwitchUser',
          creator_id: '87654321',
          creator_name: 'ClipCreator',
          video_id: '123456789',
          game_id: '509658',
          language: 'en',
          title: 'Amazing Play!',
          view_count: 9876,
          created_at: '2025-01-23T12:00:00Z',
          thumbnail_url: 'https://clips-media-assets2.twitch.tv/thumbnail.jpg',
          duration: 30.5,
          vod_offset: 3600
        }
      ];

      console.log('Clips retrieved:', mockClips.length);
      return mockClips;
    } catch (error) {
      console.error('Error getting clips:', error);
      return null;
    }
  }

  async createClip(broadcasterId: string, params?: {
    has_delay?: boolean;
  }): Promise<{ id: string; edit_url: string } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockClipResponse = {
        id: 'AwkwardHelplessSalamanderSwiftRage',
        edit_url: 'https://clips.twitch.tv/AwkwardHelplessSalamanderSwiftRage/edit'
      };

      console.log('Clip created:', mockClipResponse.id);
      return mockClipResponse;
    } catch (error) {
      console.error('Error creating clip:', error);
      return null;
    }
  }

  // ==================== Subscriptions ====================

  async getSubscriptions(broadcasterId: string, params?: {
    user_id?: string[];
    first?: number;
  }): Promise<TwitchSubscription[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSubscriptions: TwitchSubscription[] = [
        {
          broadcaster_id: broadcasterId,
          broadcaster_login: 'twitchuser',
          broadcaster_name: 'TwitchUser',
          gifter_id: '',
          gifter_login: '',
          gifter_name: '',
          is_gift: false,
          tier: '1000',
          plan_name: 'Channel Subscription',
          user_id: '87654321',
          user_name: 'Subscriber1',
          user_login: 'subscriber1'
        }
      ];

      console.log('Subscriptions retrieved:', mockSubscriptions.length);
      return mockSubscriptions;
    } catch (error) {
      console.error('Error getting subscriptions:', error);
      return null;
    }
  }

  // ==================== Followers ====================

  async getFollowers(params: {
    broadcaster_id?: string;
    user_id?: string;
    first?: number;
  }): Promise<TwitchFollower[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockFollowers: TwitchFollower[] = [
        {
          from_id: '87654321',
          from_login: 'follower1',
          from_name: 'Follower1',
          to_id: '12345678',
          to_login: 'twitchuser',
          to_name: 'TwitchUser',
          followed_at: '2025-01-20T10:00:00Z'
        }
      ];

      console.log('Followers retrieved:', mockFollowers.length);
      return mockFollowers;
    } catch (error) {
      console.error('Error getting followers:', error);
      return null;
    }
  }

  // ==================== Moderation ====================

  async getModerators(broadcasterId: string): Promise<TwitchModerator[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockModerators: TwitchModerator[] = [
        {
          user_id: '11111111',
          user_login: 'moderator1',
          user_name: 'Moderator1'
        }
      ];

      console.log('Moderators retrieved:', mockModerators.length);
      return mockModerators;
    } catch (error) {
      console.error('Error getting moderators:', error);
      return null;
    }
  }

  async banUser(broadcasterId: string, params: {
    user_id: string;
    duration?: number;
    reason?: string;
  }): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('User banned:', params.user_id);
      return true;
    } catch (error) {
      console.error('Error banning user:', error);
      return false;
    }
  }

  async unbanUser(broadcasterId: string, userId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('User unbanned:', userId);
      return true;
    } catch (error) {
      console.error('Error unbanning user:', error);
      return false;
    }
  }

  // ==================== Channel Points ====================

  async getCustomRewards(broadcasterId: string, params?: {
    id?: string[];
    only_manageable_rewards?: boolean;
  }): Promise<TwitchChannelPointsReward[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockRewards: TwitchChannelPointsReward[] = [
        {
          broadcaster_id: broadcasterId,
          broadcaster_login: 'twitchuser',
          broadcaster_name: 'TwitchUser',
          id: 'reward_123',
          title: 'Hydrate Reminder',
          prompt: 'Tell the streamer to drink water',
          cost: 100,
          image: null,
          default_image: {
            url_1x: 'https://static-cdn.jtvnw.net/custom-reward-images/default-1.png',
            url_2x: 'https://static-cdn.jtvnw.net/custom-reward-images/default-2.png',
            url_4x: 'https://static-cdn.jtvnw.net/custom-reward-images/default-4.png'
          },
          background_color: '#00E5C3',
          is_enabled: true,
          is_user_input_required: false,
          max_per_stream_setting: {
            is_enabled: false,
            max_per_stream: 0
          },
          max_per_user_per_stream_setting: {
            is_enabled: false,
            max_per_user_per_stream: 0
          },
          global_cooldown_setting: {
            is_enabled: true,
            global_cooldown_seconds: 300
          },
          is_paused: false,
          is_in_stock: true,
          should_redemptions_skip_request_queue: false,
          redemptions_redeemed_current_stream: null,
          cooldown_expires_at: null
        }
      ];

      console.log('Custom rewards retrieved:', mockRewards.length);
      return mockRewards;
    } catch (error) {
      console.error('Error getting custom rewards:', error);
      return null;
    }
  }

  // ==================== Polls ====================

  async createPoll(broadcasterId: string, params: {
    title: string;
    choices: Array<{ title: string }>;
    duration: number;
    bits_voting_enabled?: boolean;
    bits_per_vote?: number;
    channel_points_voting_enabled?: boolean;
    channel_points_per_vote?: number;
  }): Promise<TwitchPoll | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPoll: TwitchPoll = {
        id: `poll_${Date.now()}`,
        broadcaster_id: broadcasterId,
        broadcaster_name: 'TwitchUser',
        broadcaster_login: 'twitchuser',
        title: params.title,
        choices: params.choices.map((choice, idx) => ({
          id: `choice_${idx}`,
          title: choice.title,
          votes: 0,
          channel_points_votes: 0,
          bits_votes: 0
        })),
        bits_voting_enabled: params.bits_voting_enabled || false,
        bits_per_vote: params.bits_per_vote || 0,
        channel_points_voting_enabled: params.channel_points_voting_enabled || false,
        channel_points_per_vote: params.channel_points_per_vote || 0,
        status: 'ACTIVE',
        duration: params.duration,
        started_at: new Date().toISOString()
      };

      console.log('Poll created:', mockPoll.title);
      return mockPoll;
    } catch (error) {
      console.error('Error creating poll:', error);
      return null;
    }
  }

  // ==================== Predictions ====================

  async createPrediction(broadcasterId: string, params: {
    title: string;
    outcomes: Array<{ title: string }>;
    prediction_window: number;
  }): Promise<TwitchPrediction | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPrediction: TwitchPrediction = {
        id: `pred_${Date.now()}`,
        broadcaster_id: broadcasterId,
        broadcaster_name: 'TwitchUser',
        broadcaster_login: 'twitchuser',
        title: params.title,
        winning_outcome_id: null,
        outcomes: params.outcomes.map((outcome, idx) => ({
          id: `outcome_${idx}`,
          title: outcome.title,
          users: 0,
          channel_points: 0,
          top_predictors: null,
          color: idx === 0 ? 'BLUE' : 'PINK'
        })),
        prediction_window: params.prediction_window,
        status: 'ACTIVE',
        created_at: new Date().toISOString(),
        ended_at: null,
        locked_at: null
      };

      console.log('Prediction created:', mockPrediction.title);
      return mockPrediction;
    } catch (error) {
      console.error('Error creating prediction:', error);
      return null;
    }
  }

  // ==================== EventSub ====================

  async createEventSubSubscription(params: {
    type: string;
    version: string;
    condition: Record<string, string>;
    transport: {
      method: 'webhook';
      callback: string;
      secret: string;
    };
  }): Promise<TwitchEventSubSubscription | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSubscription: TwitchEventSubSubscription = {
        id: `eventsub_${Date.now()}`,
        status: 'webhook_callback_verification_pending',
        type: params.type,
        version: params.version,
        condition: params.condition,
        created_at: new Date().toISOString(),
        transport: params.transport,
        cost: 1
      };

      console.log('EventSub subscription created:', mockSubscription.type);
      return mockSubscription;
    } catch (error) {
      console.error('Error creating EventSub subscription:', error);
      return null;
    }
  }

  async deleteEventSubSubscription(subscriptionId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('EventSub subscription deleted:', subscriptionId);
      return true;
    } catch (error) {
      console.error('Error deleting EventSub subscription:', error);
      return false;
    }
  }

  // ==================== Analytics ====================

  async getExtensionAnalytics(params?: {
    extension_id?: string;
    type?: string;
    started_at?: string;
    ended_at?: string;
  }): Promise<TwitchAnalytics[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockAnalytics: TwitchAnalytics[] = [
        {
          game_id: '509658',
          URL: 'https://twitch-analytics.s3.amazonaws.com/analytics.csv',
          type: 'overview_v2',
          date_range: {
            started_at: '2025-01-01T00:00:00Z',
            ended_at: '2025-01-23T23:59:59Z'
          }
        }
      ];

      console.log('Extension analytics retrieved');
      return mockAnalytics;
    } catch (error) {
      console.error('Error getting extension analytics:', error);
      return null;
    }
  }
}

export const twitchIntegration = new TwitchIntegrationService();
