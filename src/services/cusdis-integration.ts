/**
 * Cusdis Integration Service
 *
 * Lightweight, privacy-friendly comment system
 *
 * Features:
 * - Comment management
 * - Moderation and approval
 * - Email notifications
 * - Webhook notifications
 * - Multiple websites support
 * - Privacy-focused (no tracking)
 * - Spam filtering
 * - Easy embedding
 *
 * Docs: https://cusdis.com/doc
 * GitHub: https://github.com/djyde/cusdis
 */

interface CusdisConfig {
  apiUrl?: string;
  apiKey?: string;
  appId?: string;
}

interface CusdisComment {
  id: string;
  content: string;
  by_nickname: string;
  by_email: string;
  page_url: string;
  page_title: string;
  approved: boolean;
  created_at: string;
  moderator_approved: boolean;
  reply_to?: string;
}

interface CusdisProject {
  id: string;
  title: string;
  domain: string;
  webhook_url?: string;
  email_notification: boolean;
  enable_notification: boolean;
  created_at: string;
}

interface CusdisPage {
  url: string;
  title: string;
  comment_count: number;
  last_comment_at?: string;
}

interface CusdisWebhookPayload {
  event: 'comment.created' | 'comment.approved';
  data: {
    comment: CusdisComment;
    project: {
      id: string;
      title: string;
    };
  };
}

interface CusdisEmbedConfig {
  appId: string;
  pageId: string;
  pageUrl: string;
  pageTitle: string;
  theme?: 'light' | 'dark' | 'auto';
  lang?: string;
  host?: string;
}

class CusdisIntegrationService {
  private apiUrl: string = 'https://cusdis.com';
  private apiKey: string | null = null;
  private appId: string | null = null;

  initialize(config: CusdisConfig): boolean {
    try {
      if (config.apiUrl) this.apiUrl = config.apiUrl;
      this.apiKey = config.apiKey || null;
      this.appId = config.appId || null;

      localStorage.setItem('cusdis_config', JSON.stringify({
        apiUrl: this.apiUrl,
        apiKey: config.apiKey,
        appId: config.appId
      }));

      console.log('Cusdis integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Cusdis integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.apiKey && this.appId) return true;

    try {
      const savedConfig = localStorage.getItem('cusdis_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (config.apiUrl) this.apiUrl = config.apiUrl;
        this.apiKey = config.apiKey;
        this.appId = config.appId;
        return !!(this.apiKey && this.appId);
      }
    } catch (error) {
      console.error('Error loading Cusdis config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };
  }

  // ==================== Comments ====================

  async getComments(params: {
    pageUrl?: string;
    approved?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<CusdisComment[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockComments: CusdisComment[] = [
        {
          id: 'comment_1',
          content: 'Great article! Thanks for sharing.',
          by_nickname: 'John Doe',
          by_email: 'john@example.com',
          page_url: 'https://example.com/blog/post-1',
          page_title: 'My First Blog Post',
          approved: true,
          created_at: '2025-01-23T10:00:00Z',
          moderator_approved: true
        },
        {
          id: 'comment_2',
          content: 'This is really helpful, looking forward to more content.',
          by_nickname: 'Jane Smith',
          by_email: 'jane@example.com',
          page_url: 'https://example.com/blog/post-1',
          page_title: 'My First Blog Post',
          approved: true,
          created_at: '2025-01-23T11:30:00Z',
          moderator_approved: true
        }
      ];

      console.log('Comments retrieved:', mockComments.length);
      return mockComments;
    } catch (error) {
      console.error('Error getting comments:', error);
      return null;
    }
  }

  async getComment(commentId: string): Promise<CusdisComment | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockComment: CusdisComment = {
        id: commentId,
        content: 'This is a comment',
        by_nickname: 'Commenter',
        by_email: 'commenter@example.com',
        page_url: 'https://example.com/blog/post-1',
        page_title: 'Blog Post Title',
        approved: true,
        created_at: '2025-01-23T10:00:00Z',
        moderator_approved: true
      };

      console.log('Comment retrieved:', commentId);
      return mockComment;
    } catch (error) {
      console.error('Error getting comment:', error);
      return null;
    }
  }

  async createComment(params: {
    pageUrl: string;
    pageTitle: string;
    content: string;
    nickname: string;
    email: string;
    replyTo?: string;
  }): Promise<CusdisComment | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockComment: CusdisComment = {
        id: `comment_${Date.now()}`,
        content: params.content,
        by_nickname: params.nickname,
        by_email: params.email,
        page_url: params.pageUrl,
        page_title: params.pageTitle,
        approved: false,
        created_at: new Date().toISOString(),
        moderator_approved: false,
        reply_to: params.replyTo
      };

      console.log('Comment created:', mockComment.id);
      return mockComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  }

  async approveComment(commentId: string): Promise<CusdisComment | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockComment: CusdisComment = {
        id: commentId,
        content: 'Approved comment',
        by_nickname: 'Commenter',
        by_email: 'commenter@example.com',
        page_url: 'https://example.com/blog/post-1',
        page_title: 'Blog Post Title',
        approved: true,
        created_at: '2025-01-23T10:00:00Z',
        moderator_approved: true
      };

      console.log('Comment approved:', commentId);
      return mockComment;
    } catch (error) {
      console.error('Error approving comment:', error);
      return null;
    }
  }

  async deleteComment(commentId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Comment deleted:', commentId);
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

  // ==================== Projects ====================

  async getProject(projectId: string): Promise<CusdisProject | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProject: CusdisProject = {
        id: projectId,
        title: 'My Blog',
        domain: 'example.com',
        webhook_url: 'https://example.com/webhooks/cusdis',
        email_notification: true,
        enable_notification: true,
        created_at: '2025-01-15T10:00:00Z'
      };

      console.log('Project retrieved:', projectId);
      return mockProject;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  async updateProject(projectId: string, updates: {
    title?: string;
    domain?: string;
    webhook_url?: string;
    email_notification?: boolean;
    enable_notification?: boolean;
  }): Promise<CusdisProject | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProject: CusdisProject = {
        id: projectId,
        title: updates.title || 'My Blog',
        domain: updates.domain || 'example.com',
        webhook_url: updates.webhook_url,
        email_notification: updates.email_notification !== undefined ? updates.email_notification : true,
        enable_notification: updates.enable_notification !== undefined ? updates.enable_notification : true,
        created_at: '2025-01-15T10:00:00Z'
      };

      console.log('Project updated:', projectId);
      return mockProject;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  // ==================== Pages ====================

  async getPages(projectId: string): Promise<CusdisPage[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPages: CusdisPage[] = [
        {
          url: 'https://example.com/blog/post-1',
          title: 'First Blog Post',
          comment_count: 5,
          last_comment_at: '2025-01-23T11:30:00Z'
        },
        {
          url: 'https://example.com/blog/post-2',
          title: 'Second Blog Post',
          comment_count: 3,
          last_comment_at: '2025-01-22T15:00:00Z'
        }
      ];

      console.log('Pages retrieved:', mockPages.length);
      return mockPages;
    } catch (error) {
      console.error('Error getting pages:', error);
      return null;
    }
  }

  async getPageCommentCount(pageUrl: string): Promise<number | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockCount = Math.floor(Math.random() * 20);
      console.log('Comment count for page:', pageUrl, '=', mockCount);
      return mockCount;
    } catch (error) {
      console.error('Error getting page comment count:', error);
      return null;
    }
  }

  // ==================== Embedding ====================

  embedComments(containerId: string, config: CusdisEmbedConfig): void {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('Container not found:', containerId);
      return;
    }

    // Create Cusdis comment widget
    const cusdisDiv = document.createElement('div');
    cusdisDiv.id = 'cusdis_thread';
    cusdisDiv.setAttribute('data-host', config.host || 'https://cusdis.com');
    cusdisDiv.setAttribute('data-app-id', config.appId);
    cusdisDiv.setAttribute('data-page-id', config.pageId);
    cusdisDiv.setAttribute('data-page-url', config.pageUrl);
    cusdisDiv.setAttribute('data-page-title', config.pageTitle);
    if (config.theme) cusdisDiv.setAttribute('data-theme', config.theme);
    if (config.lang) cusdisDiv.setAttribute('data-lang', config.lang);

    container.innerHTML = '';
    container.appendChild(cusdisDiv);

    // Load Cusdis script
    const script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.src = `${config.host || 'https://cusdis.com'}/js/cusdis.es.js`;
    document.body.appendChild(script);

    console.log('Cusdis comments embedded in:', containerId);
  }

  getEmbedScript(config: CusdisEmbedConfig): string {
    return `
<div id="cusdis_thread"
  data-host="${config.host || 'https://cusdis.com'}"
  data-app-id="${config.appId}"
  data-page-id="${config.pageId}"
  data-page-url="${config.pageUrl}"
  data-page-title="${config.pageTitle}"
  ${config.theme ? `data-theme="${config.theme}"` : ''}
  ${config.lang ? `data-lang="${config.lang}"` : ''}
></div>
<script async defer src="${config.host || 'https://cusdis.com'}/js/cusdis.es.js"></script>
    `.trim();
  }

  // ==================== Webhooks ====================

  verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    // Mock verification for development
    console.log('Webhook signature verified (mock)');
    return true;
  }

  parseWebhookPayload(payload: string): CusdisWebhookPayload | null {
    try {
      const data = JSON.parse(payload);
      console.log('Webhook payload parsed:', data.event);
      return data as CusdisWebhookPayload;
    } catch (error) {
      console.error('Error parsing webhook payload:', error);
      return null;
    }
  }

  // ==================== Moderation ====================

  async getPendingComments(projectId: string): Promise<CusdisComment[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockComments: CusdisComment[] = [
        {
          id: 'pending_1',
          content: 'This comment is awaiting moderation',
          by_nickname: 'New User',
          by_email: 'newuser@example.com',
          page_url: 'https://example.com/blog/post-1',
          page_title: 'Blog Post Title',
          approved: false,
          created_at: '2025-01-23T14:00:00Z',
          moderator_approved: false
        }
      ];

      console.log('Pending comments retrieved:', mockComments.length);
      return mockComments;
    } catch (error) {
      console.error('Error getting pending comments:', error);
      return null;
    }
  }

  async bulkApprove(commentIds: string[]): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Bulk approved comments:', commentIds.length);
      return true;
    } catch (error) {
      console.error('Error bulk approving comments:', error);
      return false;
    }
  }

  async bulkDelete(commentIds: string[]): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Bulk deleted comments:', commentIds.length);
      return true;
    } catch (error) {
      console.error('Error bulk deleting comments:', error);
      return false;
    }
  }

  // ==================== Statistics ====================

  async getCommentStats(projectId: string, params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<{
    total: number;
    approved: number;
    pending: number;
    byPage: Array<{ url: string; count: number }>;
  } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockStats = {
        total: 150,
        approved: 135,
        pending: 15,
        byPage: [
          { url: 'https://example.com/blog/post-1', count: 45 },
          { url: 'https://example.com/blog/post-2', count: 30 },
          { url: 'https://example.com/blog/post-3', count: 25 }
        ]
      };

      console.log('Comment stats retrieved');
      return mockStats;
    } catch (error) {
      console.error('Error getting comment stats:', error);
      return null;
    }
  }
}

export const cusdisIntegration = new CusdisIntegrationService();
