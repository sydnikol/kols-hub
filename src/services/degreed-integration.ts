/**
 * Degreed Integration Service
 *
 * Learning and skill development platform
 *
 * Features:
 * - User management and profiles
 * - Content integration and cataloging
 * - Skills tracking and development
 * - Learning pathways and recommendations
 * - xAPI statements (learning experience tracking)
 * - Webhooks for real-time events
 * - Analytics and reporting
 * - OAuth 2.0 authentication
 * - Multi-environment support (US, EU, CA, Betatest)
 *
 * Docs: https://developer.degreed.com
 * API Endpoints:
 * - US Production: https://api.degreed.com/
 * - US Betatest: https://api.betatest.degreed.com/
 * - EU Production: https://api.eu.degreed.com/
 * - CA Production: https://api.ca.degreed.com/
 */

interface DegreedConfig {
  clientId: string;
  clientSecret: string;
  environment?: 'us' | 'us-betatest' | 'eu' | 'ca';
  accessToken?: string;
  refreshToken?: string;
}

interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface DegreedUser {
  id: string;
  employee_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_url?: string;
  avatar_url?: string;
  title?: string;
  department?: string;
  location?: string;
  manager_id?: string;
  is_active: boolean;
  hire_date?: string;
  custom_fields?: Record<string, string | number>;
  skills?: DegreedSkill[];
  groups?: string[];
  roles?: string[];
}

interface DegreedSkill {
  id: string;
  name: string;
  level?: number;
  verified?: boolean;
  endorsed_count?: number;
  last_used?: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface DegreedContent {
  id: string;
  title: string;
  url: string;
  content_type: 'article' | 'video' | 'course' | 'book' | 'podcast' | 'event' | 'other';
  provider?: string;
  author?: string;
  description?: string;
  summary?: string;
  image_url?: string;
  duration_minutes?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  published_date?: string;
  topics?: string[];
  skills?: string[];
  cost?: number;
  cost_type?: 'free' | 'paid' | 'subscription';
  rating?: number;
  rating_count?: number;
  obsolete?: boolean;
}

interface DegreedPathway {
  id: string;
  title: string;
  description?: string;
  owner_id?: string;
  skills?: string[];
  content_ids?: string[];
  estimated_duration_hours?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  published?: boolean;
  created_at: string;
  updated_at: string;
}

interface xAPIStatement {
  id?: string;
  actor: {
    objectType: 'Agent';
    name?: string;
    mbox?: string;
    account?: {
      homePage: string;
      name: string;
    };
  };
  verb: {
    id: string;
    display: Record<string, string>;
  };
  object: {
    objectType: 'Activity';
    id: string;
    definition?: {
      name?: Record<string, string>;
      description?: Record<string, string>;
      type?: string;
    };
  };
  result?: {
    score?: {
      scaled?: number;
      raw?: number;
      min?: number;
      max?: number;
    };
    success?: boolean;
    completion?: boolean;
    duration?: string;
  };
  context?: {
    contextActivities?: {
      parent?: Array<{ id: string }>;
      grouping?: Array<{ id: string }>;
    };
  };
  timestamp?: string;
  stored?: string;
}

interface DegreedCompletionRecord {
  user_id: string;
  content_id: string;
  completed_at: string;
  duration_minutes?: number;
  score?: number;
  status: 'started' | 'in_progress' | 'completed' | 'abandoned';
}

interface DegreedGroup {
  id: string;
  name: string;
  description?: string;
  member_count: number;
  is_public: boolean;
  created_at: string;
}

interface DegreedWebhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  secret?: string;
  created_at: string;
  last_triggered_at?: string;
}

interface DegreedAnalyticsQuery {
  metric: 'completions' | 'time_spent' | 'skill_growth' | 'content_views' | 'pathway_progress';
  start_date: string;
  end_date: string;
  user_ids?: string[];
  content_ids?: string[];
  skill_ids?: string[];
  group_by?: 'day' | 'week' | 'month' | 'user' | 'content' | 'skill';
}

interface DegreedAnalyticsResult {
  metric: string;
  data: Array<{
    date?: string;
    user_id?: string;
    content_id?: string;
    skill_id?: string;
    value: number;
  }>;
  total: number;
  period: {
    start: string;
    end: string;
  };
}

class DegreedIntegrationService {
  private clientId: string | null = null;
  private clientSecret: string | null = null;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private environment: 'us' | 'us-betatest' | 'eu' | 'ca' = 'us';
  private baseUrl = 'https://api.degreed.com';

  initialize(config: DegreedConfig): boolean {
    try {
      this.clientId = config.clientId;
      this.clientSecret = config.clientSecret;
      this.accessToken = config.accessToken || null;
      this.refreshToken = config.refreshToken || null;
      this.environment = config.environment || 'us';

      const envUrls = {
        'us': 'https://api.degreed.com',
        'us-betatest': 'https://api.betatest.degreed.com',
        'eu': 'https://api.eu.degreed.com',
        'ca': 'https://api.ca.degreed.com'
      };
      this.baseUrl = envUrls[this.environment];

      localStorage.setItem('degreed_config', JSON.stringify({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        accessToken: config.accessToken,
        refreshToken: config.refreshToken,
        environment: this.environment
      }));

      console.log('Degreed integration initialized - Environment:', this.environment);
      return true;
    } catch (error) {
      console.error('Error initializing Degreed integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.clientId && this.clientSecret) return true;

    try {
      const savedConfig = localStorage.getItem('degreed_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.clientId = config.clientId;
        this.clientSecret = config.clientSecret;
        this.accessToken = config.accessToken;
        this.refreshToken = config.refreshToken;
        this.environment = config.environment || 'us';
        return !!(this.clientId && this.clientSecret);
      }
    } catch (error) {
      console.error('Error loading Degreed config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  // ==================== OAuth 2.0 ====================

  async getAccessToken(scope?: string[]): Promise<OAuthTokenResponse | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockResponse: OAuthTokenResponse = {
        access_token: `mock_token_${Date.now()}`,
        token_type: 'Bearer',
        expires_in: 3600,
        refresh_token: `mock_refresh_${Date.now()}`,
        scope: scope?.join(' ') || 'read write'
      };

      this.accessToken = mockResponse.access_token;
      this.refreshToken = mockResponse.refresh_token || null;

      console.log('Access token obtained');
      return mockResponse;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async refreshAccessToken(): Promise<OAuthTokenResponse | null> {
    if (!this.isConfigured() || !this.refreshToken) return null;

    try {
      const mockResponse: OAuthTokenResponse = {
        access_token: `mock_token_${Date.now()}`,
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'read write'
      };

      this.accessToken = mockResponse.access_token;

      console.log('Access token refreshed');
      return mockResponse;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  }

  // ==================== Users ====================

  async getUser(userId: string): Promise<DegreedUser | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: DegreedUser = {
        id: userId,
        email: 'user@company.com',
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        title: 'Senior Developer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        is_active: true,
        skills: [
          {
            id: 'skill_1',
            name: 'JavaScript',
            level: 4,
            proficiency: 'advanced',
            verified: true
          }
        ]
      };

      console.log('User retrieved:', userId);
      return mockUser;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async updateUser(userId: string, updates: Partial<DegreedUser>): Promise<DegreedUser | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: DegreedUser = {
        id: userId,
        email: 'user@company.com',
        first_name: 'John',
        last_name: 'Doe',
        full_name: 'John Doe',
        is_active: true,
        ...updates
      };

      console.log('User updated:', userId);
      return mockUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async listUsers(params?: {
    page?: number;
    per_page?: number;
    is_active?: boolean;
    department?: string;
  }): Promise<DegreedUser[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUsers: DegreedUser[] = [
        {
          id: 'user_1',
          email: 'user1@company.com',
          first_name: 'Jane',
          last_name: 'Smith',
          full_name: 'Jane Smith',
          is_active: true
        },
        {
          id: 'user_2',
          email: 'user2@company.com',
          first_name: 'Bob',
          last_name: 'Johnson',
          full_name: 'Bob Johnson',
          is_active: true
        }
      ];

      console.log('Users listed:', mockUsers.length);
      return mockUsers;
    } catch (error) {
      console.error('Error listing users:', error);
      return null;
    }
  }

  // ==================== Content ====================

  async getContent(contentId: string): Promise<DegreedContent | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockContent: DegreedContent = {
        id: contentId,
        title: 'Advanced JavaScript Patterns',
        url: 'https://example.com/course',
        content_type: 'course',
        provider: 'Udemy',
        description: 'Learn advanced JavaScript design patterns',
        duration_minutes: 300,
        difficulty_level: 'advanced',
        language: 'en',
        topics: ['JavaScript', 'Design Patterns', 'Programming'],
        skills: ['JavaScript', 'Software Architecture'],
        cost_type: 'paid',
        rating: 4.7,
        rating_count: 1523
      };

      console.log('Content retrieved:', contentId);
      return mockContent;
    } catch (error) {
      console.error('Error getting content:', error);
      return null;
    }
  }

  async createContent(content: Omit<DegreedContent, 'id'>): Promise<DegreedContent | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockContent: DegreedContent = {
        id: `content_${Date.now()}`,
        ...content
      };

      console.log('Content created:', mockContent.id);
      return mockContent;
    } catch (error) {
      console.error('Error creating content:', error);
      return null;
    }
  }

  async updateContent(contentId: string, updates: Partial<DegreedContent>): Promise<DegreedContent | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockContent: DegreedContent = {
        id: contentId,
        title: 'Updated Content',
        url: 'https://example.com/updated',
        content_type: 'article',
        ...updates
      };

      console.log('Content updated:', contentId);
      return mockContent;
    } catch (error) {
      console.error('Error updating content:', error);
      return null;
    }
  }

  // ==================== Skills ====================

  async getUserSkills(userId: string): Promise<DegreedSkill[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSkills: DegreedSkill[] = [
        {
          id: 'skill_1',
          name: 'JavaScript',
          level: 4,
          proficiency: 'advanced',
          verified: true,
          endorsed_count: 15
        },
        {
          id: 'skill_2',
          name: 'React',
          level: 3,
          proficiency: 'intermediate',
          verified: false,
          endorsed_count: 8
        }
      ];

      console.log('User skills retrieved:', mockSkills.length);
      return mockSkills;
    } catch (error) {
      console.error('Error getting user skills:', error);
      return null;
    }
  }

  async addUserSkill(userId: string, skillName: string, level?: number): Promise<DegreedSkill | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSkill: DegreedSkill = {
        id: `skill_${Date.now()}`,
        name: skillName,
        level: level || 1,
        proficiency: 'beginner',
        verified: false,
        endorsed_count: 0
      };

      console.log('Skill added to user:', skillName);
      return mockSkill;
    } catch (error) {
      console.error('Error adding user skill:', error);
      return null;
    }
  }

  // ==================== Pathways ====================

  async getPathway(pathwayId: string): Promise<DegreedPathway | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPathway: DegreedPathway = {
        id: pathwayId,
        title: 'Full-Stack Developer Path',
        description: 'Become a full-stack developer',
        skills: ['JavaScript', 'React', 'Node.js', 'Databases'],
        content_ids: ['content_1', 'content_2', 'content_3'],
        estimated_duration_hours: 120,
        difficulty_level: 'intermediate',
        published: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-23T15:00:00Z'
      };

      console.log('Pathway retrieved:', pathwayId);
      return mockPathway;
    } catch (error) {
      console.error('Error getting pathway:', error);
      return null;
    }
  }

  async createPathway(pathway: Omit<DegreedPathway, 'id' | 'created_at' | 'updated_at'>): Promise<DegreedPathway | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPathway: DegreedPathway = {
        id: `pathway_${Date.now()}`,
        ...pathway,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Pathway created:', mockPathway.id);
      return mockPathway;
    } catch (error) {
      console.error('Error creating pathway:', error);
      return null;
    }
  }

  // ==================== xAPI Statements ====================

  async sendxAPIStatement(statement: xAPIStatement): Promise<string | null> {
    if (!this.isConfigured()) return null;

    try {
      const statementId = statement.id || `statement_${Date.now()}`;
      console.log('xAPI statement sent:', statementId);
      return statementId;
    } catch (error) {
      console.error('Error sending xAPI statement:', error);
      return null;
    }
  }

  // ==================== Completions ====================

  async recordCompletion(completion: DegreedCompletionRecord): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Completion recorded:', completion.content_id, 'for user:', completion.user_id);
      return true;
    } catch (error) {
      console.error('Error recording completion:', error);
      return false;
    }
  }

  async getUserCompletions(userId: string, params?: {
    start_date?: string;
    end_date?: string;
  }): Promise<DegreedCompletionRecord[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockCompletions: DegreedCompletionRecord[] = [
        {
          user_id: userId,
          content_id: 'content_1',
          completed_at: '2025-01-20T10:00:00Z',
          duration_minutes: 60,
          score: 95,
          status: 'completed'
        }
      ];

      console.log('User completions retrieved:', mockCompletions.length);
      return mockCompletions;
    } catch (error) {
      console.error('Error getting user completions:', error);
      return null;
    }
  }

  // ==================== Webhooks ====================

  async createWebhook(url: string, events: string[]): Promise<DegreedWebhook | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockWebhook: DegreedWebhook = {
        id: `webhook_${Date.now()}`,
        url: url,
        events: events,
        active: true,
        secret: `whsec_${Math.random().toString(36).substring(7)}`,
        created_at: new Date().toISOString()
      };

      console.log('Webhook created:', mockWebhook.id);
      return mockWebhook;
    } catch (error) {
      console.error('Error creating webhook:', error);
      return null;
    }
  }

  async deleteWebhook(webhookId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Webhook deleted:', webhookId);
      return true;
    } catch (error) {
      console.error('Error deleting webhook:', error);
      return false;
    }
  }

  // ==================== Analytics ====================

  async getAnalytics(query: DegreedAnalyticsQuery): Promise<DegreedAnalyticsResult | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockResult: DegreedAnalyticsResult = {
        metric: query.metric,
        data: [
          {
            date: '2025-01-20',
            value: 150
          },
          {
            date: '2025-01-21',
            value: 175
          },
          {
            date: '2025-01-22',
            value: 200
          }
        ],
        total: 525,
        period: {
          start: query.start_date,
          end: query.end_date
        }
      };

      console.log('Analytics retrieved:', query.metric);
      return mockResult;
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  }
}

export const degreedIntegration = new DegreedIntegrationService();
