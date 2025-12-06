/**
 * ZAPIER POWERED BY INTEGRATION
 * Enterprise automation platform - Connect to 8,000+ apps
 *
 * Zapier Features:
 * - 8,000+ app integrations
 * - Workflow automation
 * - AI-powered Zap Guesser
 * - Quick Account Creation
 * - Action Runs API
 * - Managed Authentication
 *
 * Perfect For:
 * - Automating content distribution
 * - Monetization workflows
 * - Multi-platform publishing
 * - Data synchronization
 * - Revenue tracking
 * - Lead generation
 */

import { CircuitBreakerRegistry } from '../core/CircuitBreaker';
import { MetricsCollector } from '../core/MetricsCollector';

export interface ZapierConfig {
  clientId: string;
  clientSecret: string;
  apiKey?: string;
  sponsorMode?: boolean; // Cover costs for users
}

export interface ZapierApp {
  id: string;
  name: string;
  description: string;
  image_url: string;
  hex_color: string;
  category: string;
}

export interface ZapierAction {
  id: string;
  app_id: string;
  key: string;
  name: string;
  description: string;
  type: 'trigger' | 'action' | 'search';
}

export interface ZapTemplate {
  id: string;
  title: string;
  description: string;
  apps: string[];
  url: string;
  status: string;
}

export interface Zap {
  id: string;
  title: string;
  state: 'on' | 'off' | 'draft';
  steps: ZapStep[];
  created_at: string;
  modified_at: string;
}

export interface ZapStep {
  id: string;
  app: string;
  action: string;
  params: Record<string, any>;
}

export interface QuickAccountRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  timezone?: string;
  skip_intro_survey?: boolean;
}

export interface QuickAccountResponse {
  user_id: string;
  access_token: string;
  refresh_token: string;
  zapier_account_url: string;
}

export interface ActionRunRequest {
  action_id: string;
  auth_id: string;
  input_data: Record<string, any>;
  test_mode?: boolean;
}

export interface ActionRunResponse {
  id: string;
  status: 'success' | 'error' | 'halted';
  output_data: any;
  error?: string;
}

export interface ZapGuessRequest {
  description: string;
  context?: {
    user_apps?: string[];
    industry?: string;
    goal?: string;
  };
}

export interface ZapGuessResponse {
  zaps: Array<{
    title: string;
    description: string;
    apps: string[];
    steps: Array<{
      app: string;
      action: string;
      description: string;
    }>;
    confidence: number;
  }>;
}

class ZapierIntegration {
  private config: ZapierConfig | null = null;
  private baseUrl = 'https://api.zapier.com/v1';
  private embedUrl = 'https://cdn.zapier.com/embed';
  private userTokens: Map<string, { access: string; refresh: string }> = new Map();

  /**
   * Initialize Zapier integration
   */
  initialize(config: ZapierConfig): void {
    this.config = config;

    // Save to localStorage
    localStorage.setItem('zapier_client_id', config.clientId);
    localStorage.setItem('zapier_client_secret', config.clientSecret);
    if (config.apiKey) {
      localStorage.setItem('zapier_api_key', config.apiKey);
    }
    if (config.sponsorMode !== undefined) {
      localStorage.setItem('zapier_sponsor_mode', config.sponsorMode.toString());
    }

    console.log('✅ Zapier integration initialized');
    console.log('Sponsor Mode:', config.sponsorMode ? 'ENABLED' : 'DISABLED');
  }

  /**
   * Load from localStorage
   */
  loadFromStorage(): boolean {
    const clientId = localStorage.getItem('zapier_client_id');
    const clientSecret = localStorage.getItem('zapier_client_secret');
    const apiKey = localStorage.getItem('zapier_api_key') || undefined;
    const sponsorMode = localStorage.getItem('zapier_sponsor_mode') === 'true';

    if (clientId && clientSecret) {
      this.config = { clientId, clientSecret, apiKey, sponsorMode };
      return true;
    }

    return false;
  }

  /**
   * Check if initialized
   */
  isReady(): boolean {
    if (this.config) return true;
    return this.loadFromStorage();
  }

  /**
   * Get authorization header
   */
  private getAuthHeader(): string {
    if (!this.config) throw new Error('Zapier not initialized');
    if (this.config.apiKey) {
      return `Bearer ${this.config.apiKey}`;
    }
    const credentials = `${this.config.clientId}:${this.config.clientSecret}`;
    const base64 = btoa(credentials);
    return `Basic ${base64}`;
  }

  /**
   * Create Quick Account (Frictionless Onboarding)
   */
  async createQuickAccount(request: QuickAccountRequest): Promise<QuickAccountResponse> {
    if (!this.config) throw new Error('Zapier not initialized');

    const breaker = CircuitBreakerRegistry.get('zapier-api');

    return await breaker.execute(async () => {
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/quick-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify({
          ...request,
          skip_intro_survey: true // Skip onboarding for seamless UX
        })
      });

      if (!response.ok) {
        throw new Error(`Zapier Quick Account error: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      // Store user tokens
      this.userTokens.set(data.user_id, {
        access: data.access_token,
        refresh: data.refresh_token
      });

      MetricsCollector.recordAPICall('zapier', true, duration);
      MetricsCollector.incrementCounter('zapier.accounts.created', 1);

      console.log('✅ Zapier Quick Account created:', data.user_id);
      return data;
    });
  }

  /**
   * Guess a Zap using AI
   */
  async guessZap(request: ZapGuessRequest): Promise<ZapGuessResponse> {
    if (!this.config) throw new Error('Zapier not initialized');

    const breaker = CircuitBreakerRegistry.get('zapier-api');

    return await breaker.execute(async () => {
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/zaps/guess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Zapier Guess error: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      MetricsCollector.recordAPICall('zapier', true, duration);
      MetricsCollector.incrementCounter('zapier.zaps.guessed', 1);

      console.log(`🤖 AI suggested ${data.zaps.length} Zaps`);
      return data;
    });
  }

  /**
   * Run an Action
   */
  async runAction(request: ActionRunRequest): Promise<ActionRunResponse> {
    if (!this.config) throw new Error('Zapier not initialized');

    const breaker = CircuitBreakerRegistry.get('zapier-api');

    return await breaker.execute(async () => {
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/action-runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.getAuthHeader()
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`Zapier Action Run error: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      MetricsCollector.recordAPICall('zapier', true, duration);
      MetricsCollector.incrementCounter('zapier.actions.run', 1, {
        status: data.status
      });

      if (data.status === 'error') {
        console.error('❌ Zapier action failed:', data.error);
      }

      return data;
    });
  }

  /**
   * List available apps
   */
  async listApps(category?: string): Promise<ZapierApp[]> {
    if (!this.config) throw new Error('Zapier not initialized');

    const breaker = CircuitBreakerRegistry.get('zapier-api');

    return await breaker.execute(async () => {
      const startTime = Date.now();

      const url = category
        ? `${this.baseUrl}/apps?category=${category}`
        : `${this.baseUrl}/apps`;

      const response = await fetch(url, {
        headers: {
          'Authorization': this.getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`Zapier Apps error: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      MetricsCollector.recordAPICall('zapier', true, duration);

      return data.apps || [];
    });
  }

  /**
   * Search Zap Templates
   */
  async searchTemplates(query: string, apps?: string[]): Promise<ZapTemplate[]> {
    if (!this.config) throw new Error('Zapier not initialized');

    const breaker = CircuitBreakerRegistry.get('zapier-api');

    return await breaker.execute(async () => {
      const startTime = Date.now();

      const params = new URLSearchParams({ q: query });
      if (apps) {
        apps.forEach(app => params.append('app', app));
      }

      const response = await fetch(`${this.baseUrl}/zap-templates?${params}`, {
        headers: {
          'Authorization': this.getAuthHeader()
        }
      });

      if (!response.ok) {
        throw new Error(`Zapier Templates error: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      MetricsCollector.recordAPICall('zapier', true, duration);

      return data.templates || [];
    });
  }

  /**
   * Create a Zap
   */
  async createZap(userId: string, zapData: {
    title: string;
    steps: ZapStep[];
    state?: 'on' | 'off' | 'draft';
  }): Promise<Zap> {
    if (!this.config) throw new Error('Zapier not initialized');

    const userToken = this.userTokens.get(userId);
    if (!userToken) {
      throw new Error('User not authenticated with Zapier');
    }

    const breaker = CircuitBreakerRegistry.get('zapier-api');

    return await breaker.execute(async () => {
      const startTime = Date.now();

      const response = await fetch(`${this.baseUrl}/zaps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken.access}`
        },
        body: JSON.stringify(zapData)
      });

      if (!response.ok) {
        throw new Error(`Zapier Create Zap error: ${response.status}`);
      }

      const data = await response.json();
      const duration = Date.now() - startTime;

      MetricsCollector.recordAPICall('zapier', true, duration);
      MetricsCollector.incrementCounter('zapier.zaps.created', 1);

      console.log('✅ Zap created:', data.title);
      return data;
    });
  }

  /**
   * Get embed code for Workflow Element
   */
  getEmbedCode(zapTemplateId: string): string {
    return `
<script type="module" src="${this.embedUrl}/workflow-element.js"></script>

<zapier-workflow-element
  template-id="${zapTemplateId}"
  client-id="${this.config?.clientId}"
  theme="auto"
  presentation="modal"
></zapier-workflow-element>
    `.trim();
  }

  /**
   * Pre-built workflows for content monetization
   */
  async getContentMonetizationTemplates(): Promise<ZapTemplate[]> {
    const queries = [
      'publish blog post',
      'share to social media',
      'YouTube upload',
      'TikTok post',
      'affiliate tracking',
      'email marketing',
      'content distribution',
      'social media scheduling'
    ];

    const allTemplates: ZapTemplate[] = [];

    for (const query of queries) {
      try {
        const templates = await this.searchTemplates(query);
        allTemplates.push(...templates);
      } catch (error) {
        console.error(`Failed to search "${query}":`, error);
      }
    }

    // Deduplicate
    const unique = Array.from(
      new Map(allTemplates.map(t => [t.id, t])).values()
    );

    return unique;
  }

  /**
   * Auto-create workflows for passive income
   */
  async setupPassiveIncomeWorkflows(userId: string): Promise<Zap[]> {
    const workflows = [
      {
        title: 'Auto-publish content to YouTube',
        steps: [
          {
            id: '1',
            app: 'webhook',
            action: 'catch_hook',
            params: { content: '{{content}}', title: '{{title}}' }
          },
          {
            id: '2',
            app: 'youtube',
            action: 'upload_video',
            params: { title: '{{1.title}}', description: '{{1.content}}' }
          }
        ],
        state: 'on' as const
      },
      {
        title: 'Share content to Twitter/X',
        steps: [
          {
            id: '1',
            app: 'webhook',
            action: 'catch_hook',
            params: { content: '{{content}}' }
          },
          {
            id: '2',
            app: 'twitter',
            action: 'create_tweet',
            params: { text: '{{1.content}}' }
          }
        ],
        state: 'on' as const
      },
      {
        title: 'Track affiliate earnings in Google Sheets',
        steps: [
          {
            id: '1',
            app: 'webhook',
            action: 'catch_hook',
            params: { amount: '{{amount}}', source: '{{source}}' }
          },
          {
            id: '2',
            app: 'google-sheets',
            action: 'create_spreadsheet_row',
            params: {
              spreadsheet: 'Passive Income Tracker',
              amount: '{{1.amount}}',
              source: '{{1.source}}',
              date: '{{1.timestamp}}'
            }
          }
        ],
        state: 'on' as const
      }
    ];

    const createdZaps: Zap[] = [];

    for (const workflow of workflows) {
      try {
        const zap = await this.createZap(userId, workflow);
        createdZaps.push(zap);
      } catch (error) {
        console.error(`Failed to create workflow "${workflow.title}":`, error);
      }
    }

    console.log(`✅ Created ${createdZaps.length} passive income workflows`);
    return createdZaps;
  }

  /**
   * Get integration statistics
   */
  getStats(): {
    accountsCreated: number;
    zapsCreated: number;
    actionsRun: number;
    zapsGuessed: number;
  } {
    return {
      accountsCreated: MetricsCollector.getCounter('zapier.accounts.created'),
      zapsCreated: MetricsCollector.getCounter('zapier.zaps.created'),
      actionsRun: MetricsCollector.getCounter('zapier.actions.run'),
      zapsGuessed: MetricsCollector.getCounter('zapier.zaps.guessed')
    };
  }

  /**
   * Get configuration
   */
  getConfig(): ZapierConfig | null {
    return this.config;
  }
}

export const zapierIntegration = new ZapierIntegration();
export default zapierIntegration;

/**
 * React Hook
 */
import React from 'react';

export function useZapier() {
  const [isReady, setIsReady] = React.useState(false);
  const [stats, setStats] = React.useState({
    accountsCreated: 0,
    zapsCreated: 0,
    actionsRun: 0,
    zapsGuessed: 0
  });

  React.useEffect(() => {
    setIsReady(zapierIntegration.isReady());
    if (zapierIntegration.isReady()) {
      setStats(zapierIntegration.getStats());
    }
  }, []);

  const refreshStats = () => {
    setStats(zapierIntegration.getStats());
  };

  return {
    isReady,
    stats,
    initialize: (config: ZapierConfig) => {
      zapierIntegration.initialize(config);
      setIsReady(true);
      refreshStats();
    },
    createQuickAccount: async (request: QuickAccountRequest) => {
      const result = await zapierIntegration.createQuickAccount(request);
      refreshStats();
      return result;
    },
    guessZap: async (request: ZapGuessRequest) => {
      const result = await zapierIntegration.guessZap(request);
      refreshStats();
      return result;
    },
    runAction: async (request: ActionRunRequest) => {
      const result = await zapierIntegration.runAction(request);
      refreshStats();
      return result;
    },
    searchTemplates: zapierIntegration.searchTemplates.bind(zapierIntegration),
    getContentMonetizationTemplates: zapierIntegration.getContentMonetizationTemplates.bind(zapierIntegration),
    setupPassiveIncomeWorkflows: async (userId: string) => {
      const result = await zapierIntegration.setupPassiveIncomeWorkflows(userId);
      refreshStats();
      return result;
    },
    getEmbedCode: zapierIntegration.getEmbedCode.bind(zapierIntegration),
    listApps: zapierIntegration.listApps.bind(zapierIntegration)
  };
}
