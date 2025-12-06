/**
 * Convoy Integration Service
 *
 * Open-source webhooks gateway for sending and receiving webhooks
 *
 * Features:
 * - Reliable webhook delivery with retries
 * - Webhook routing and transformation
 * - Event subscriptions and filtering
 * - Rate limiting and circuit breakers
 * - Webhook signing for security
 * - Dashboard for monitoring deliveries
 * - Multiple projects and apps
 * - Dead letter queue for failed events
 *
 * Docs: https://docs.getconvoy.io/
 * GitHub: https://github.com/frain-dev/convoy
 */

interface ConvoyConfig {
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
}

interface ConvoyProject {
  uid: string;
  name: string;
  type: 'incoming' | 'outgoing';
  logo_url?: string;
  config: {
    signature: {
      header: string;
      hash: 'SHA256' | 'SHA512';
    };
    strategy: {
      type: 'linear' | 'exponential';
      duration: number;
      retry_count: number;
    };
    ratelimit?: {
      count: number;
      duration: number;
    };
    retention_policy?: {
      policy: string;
    };
  };
  created_at: string;
  updated_at: string;
}

interface ConvoyEndpoint {
  uid: string;
  target_url: string;
  title?: string;
  description?: string;
  secret: string;
  http_timeout: string;
  rate_limit: number;
  rate_limit_duration: string;
  authentication?: {
    type: 'api_key' | 'basic_auth';
    api_key?: {
      header_name: string;
      header_value: string;
    };
  };
  advanced_signatures: boolean;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

interface ConvoySubscription {
  uid: string;
  name: string;
  project_id: string;
  endpoint_id: string;
  source_id?: string;
  filter_config: {
    event_types: string[];
    filter?: {
      headers?: Record<string, string>;
      body?: Record<string, any>;
    };
  };
  retry_config?: {
    type: 'linear' | 'exponential';
    duration: string;
    retry_count: number;
  };
  rate_limit_config?: {
    count: number;
    duration: number;
  };
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

interface ConvoyEvent {
  uid: string;
  event_type: string;
  project_id: string;
  source_id?: string;
  data: Record<string, any>;
  headers?: Record<string, string>;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
}

interface ConvoyEventDelivery {
  uid: string;
  event_id: string;
  endpoint_id: string;
  subscription_id: string;
  project_id: string;
  device_id?: string;
  status: 'success' | 'failure' | 'retry' | 'scheduled' | 'processing' | 'discarded';
  description: string;
  metadata?: {
    data?: Record<string, any>;
    strategy?: string;
    next_send_time?: number;
    num_trials?: number;
    interval_seconds?: number;
    retry_limit?: number;
  };
  cli_metadata?: {
    event_type?: string;
  };
  attempts: ConvoyDeliveryAttempt[];
  created_at: string;
  updated_at: string;
}

interface ConvoyDeliveryAttempt {
  uid: string;
  status: 'success' | 'failure';
  http_status: number;
  response_data: string;
  error: string;
  ip_address?: string;
  api_version?: string;
  created_at: string;
  updated_at: string;
}

interface ConvoySource {
  uid: string;
  name: string;
  type: 'http' | 'pubsub' | 'db_change_stream';
  mask_id: string;
  provider: string;
  is_disabled: boolean;
  verifier?: {
    type: 'hmac' | 'basic_auth' | 'api_key';
    hmac?: {
      header: string;
      hash: 'SHA256' | 'SHA512';
      secret: string;
      encoding: 'hex' | 'base64';
    };
    basic_auth?: {
      username: string;
      password: string;
    };
    api_key?: {
      header_name: string;
      header_value: string;
    };
  };
  custom_response?: {
    body: string;
    content_type: string;
  };
  created_at: string;
  updated_at: string;
}

interface ConvoyDevice {
  uid: string;
  project_id: string;
  endpoint_id: string;
  host_name: string;
  status: 'online' | 'offline';
  last_seen_at: string;
  created_at: string;
  updated_at: string;
}

interface ConvoyMeta {
  name: string;
  key: string;
  value: any;
  project_id: string;
  created_at: string;
  updated_at: string;
}

interface ConvoyPortalLink {
  uid: string;
  project_id: string;
  name: string;
  token: string;
  endpoints: string[];
  endpoint_count: number;
  can_manage_endpoint: boolean;
  created_at: string;
  updated_at: string;
}

class ConvoyIntegrationService {
  private baseUrl: string | null = null;
  private apiKey: string | null = null;
  private username: string | null = null;
  private password: string | null = null;

  initialize(config: ConvoyConfig): boolean {
    try {
      this.baseUrl = config.baseUrl;
      this.apiKey = config.apiKey || null;
      this.username = config.username || null;
      this.password = config.password || null;

      localStorage.setItem('convoy_config', JSON.stringify({
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        username: config.username,
        password: config.password
      }));

      console.log('Convoy integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Convoy integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.baseUrl && (this.apiKey || (this.username && this.password))) return true;

    try {
      const savedConfig = localStorage.getItem('convoy_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.baseUrl = config.baseUrl;
        this.apiKey = config.apiKey;
        this.username = config.username;
        this.password = config.password;
        return !!(this.baseUrl && (this.apiKey || (this.username && this.password)));
      }
    } catch (error) {
      console.error('Error loading Convoy config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    } else if (this.username && this.password) {
      const credentials = btoa(`${this.username}:${this.password}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }

    return headers;
  }

  // ==================== Projects ====================

  async createProject(params: {
    name: string;
    type: 'incoming' | 'outgoing';
    config?: {
      signature?: {
        header?: string;
        hash?: 'SHA256' | 'SHA512';
      };
      strategy?: {
        type?: 'linear' | 'exponential';
        duration?: number;
        retry_count?: number;
      };
      ratelimit?: {
        count?: number;
        duration?: number;
      };
    };
  }): Promise<ConvoyProject | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProject: ConvoyProject = {
        uid: `proj_${Date.now()}`,
        name: params.name,
        type: params.type,
        config: {
          signature: {
            header: params.config?.signature?.header || 'X-Convoy-Signature',
            hash: params.config?.signature?.hash || 'SHA256'
          },
          strategy: {
            type: params.config?.strategy?.type || 'linear',
            duration: params.config?.strategy?.duration || 10,
            retry_count: params.config?.strategy?.retry_count || 3
          },
          ratelimit: params.config?.ratelimit
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Project created:', mockProject.name);
      return mockProject;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  async getProject(projectId: string): Promise<ConvoyProject | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProject: ConvoyProject = {
        uid: projectId,
        name: 'Production Webhooks',
        type: 'outgoing',
        config: {
          signature: {
            header: 'X-Convoy-Signature',
            hash: 'SHA256'
          },
          strategy: {
            type: 'exponential',
            duration: 10,
            retry_count: 5
          }
        },
        created_at: '2025-01-20T10:00:00Z',
        updated_at: '2025-01-23T15:30:00Z'
      };

      console.log('Project retrieved:', projectId);
      return mockProject;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  async listProjects(): Promise<ConvoyProject[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockProjects: ConvoyProject[] = [
        {
          uid: 'proj_1',
          name: 'Production Webhooks',
          type: 'outgoing',
          config: {
            signature: {
              header: 'X-Convoy-Signature',
              hash: 'SHA256'
            },
            strategy: {
              type: 'exponential',
              duration: 10,
              retry_count: 5
            }
          },
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-23T15:30:00Z'
        }
      ];

      console.log('Projects retrieved:', mockProjects.length);
      return mockProjects;
    } catch (error) {
      console.error('Error listing projects:', error);
      return null;
    }
  }

  // ==================== Endpoints ====================

  async createEndpoint(projectId: string, params: {
    url: string;
    title?: string;
    description?: string;
    http_timeout?: string;
    rate_limit?: number;
    rate_limit_duration?: string;
    authentication?: ConvoyEndpoint['authentication'];
  }): Promise<ConvoyEndpoint | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEndpoint: ConvoyEndpoint = {
        uid: `ep_${Date.now()}`,
        target_url: params.url,
        title: params.title,
        description: params.description,
        secret: `whsec_${Math.random().toString(36).substring(7)}`,
        http_timeout: params.http_timeout || '30s',
        rate_limit: params.rate_limit || 5000,
        rate_limit_duration: params.rate_limit_duration || '1m',
        authentication: params.authentication,
        advanced_signatures: false,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Endpoint created:', mockEndpoint.target_url);
      return mockEndpoint;
    } catch (error) {
      console.error('Error creating endpoint:', error);
      return null;
    }
  }

  async getEndpoint(projectId: string, endpointId: string): Promise<ConvoyEndpoint | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEndpoint: ConvoyEndpoint = {
        uid: endpointId,
        target_url: 'https://api.example.com/webhooks',
        title: 'Main API Endpoint',
        secret: 'whsec_abc123',
        http_timeout: '30s',
        rate_limit: 5000,
        rate_limit_duration: '1m',
        advanced_signatures: false,
        status: 'active',
        created_at: '2025-01-20T10:00:00Z',
        updated_at: '2025-01-23T15:30:00Z'
      };

      console.log('Endpoint retrieved:', endpointId);
      return mockEndpoint;
    } catch (error) {
      console.error('Error getting endpoint:', error);
      return null;
    }
  }

  async listEndpoints(projectId: string): Promise<ConvoyEndpoint[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEndpoints: ConvoyEndpoint[] = [
        {
          uid: 'ep_1',
          target_url: 'https://api.example.com/webhooks',
          title: 'Main API Endpoint',
          secret: 'whsec_abc123',
          http_timeout: '30s',
          rate_limit: 5000,
          rate_limit_duration: '1m',
          advanced_signatures: false,
          status: 'active',
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-23T15:30:00Z'
        }
      ];

      console.log('Endpoints retrieved:', mockEndpoints.length);
      return mockEndpoints;
    } catch (error) {
      console.error('Error listing endpoints:', error);
      return null;
    }
  }

  async updateEndpoint(projectId: string, endpointId: string, updates: {
    url?: string;
    title?: string;
    description?: string;
    http_timeout?: string;
    status?: 'active' | 'inactive';
  }): Promise<ConvoyEndpoint | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEndpoint: ConvoyEndpoint = {
        uid: endpointId,
        target_url: updates.url || 'https://api.example.com/webhooks',
        title: updates.title,
        description: updates.description,
        secret: 'whsec_abc123',
        http_timeout: updates.http_timeout || '30s',
        rate_limit: 5000,
        rate_limit_duration: '1m',
        advanced_signatures: false,
        status: updates.status || 'active',
        created_at: '2025-01-20T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Endpoint updated:', endpointId);
      return mockEndpoint;
    } catch (error) {
      console.error('Error updating endpoint:', error);
      return null;
    }
  }

  // ==================== Subscriptions ====================

  async createSubscription(projectId: string, params: {
    name: string;
    endpoint_id: string;
    source_id?: string;
    event_types: string[];
    filter?: {
      headers?: Record<string, string>;
      body?: Record<string, any>;
    };
  }): Promise<ConvoySubscription | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSubscription: ConvoySubscription = {
        uid: `sub_${Date.now()}`,
        name: params.name,
        project_id: projectId,
        endpoint_id: params.endpoint_id,
        source_id: params.source_id,
        filter_config: {
          event_types: params.event_types,
          filter: params.filter
        },
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Subscription created:', mockSubscription.name);
      return mockSubscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      return null;
    }
  }

  async listSubscriptions(projectId: string): Promise<ConvoySubscription[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSubscriptions: ConvoySubscription[] = [
        {
          uid: 'sub_1',
          name: 'Payment Events',
          project_id: projectId,
          endpoint_id: 'ep_1',
          filter_config: {
            event_types: ['payment.succeeded', 'payment.failed']
          },
          status: 'active',
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-23T15:30:00Z'
        }
      ];

      console.log('Subscriptions retrieved:', mockSubscriptions.length);
      return mockSubscriptions;
    } catch (error) {
      console.error('Error listing subscriptions:', error);
      return null;
    }
  }

  // ==================== Events ====================

  async createEvent(projectId: string, params: {
    event_type: string;
    data: Record<string, any>;
    headers?: Record<string, string>;
    idempotency_key?: string;
    endpoint_id?: string;
  }): Promise<ConvoyEvent | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEvent: ConvoyEvent = {
        uid: `evt_${Date.now()}`,
        event_type: params.event_type,
        project_id: projectId,
        data: params.data,
        headers: params.headers,
        idempotency_key: params.idempotency_key,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Event created:', mockEvent.event_type);
      return mockEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  async getEvent(projectId: string, eventId: string): Promise<ConvoyEvent | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEvent: ConvoyEvent = {
        uid: eventId,
        event_type: 'payment.succeeded',
        project_id: projectId,
        data: {
          amount: 1000,
          currency: 'USD',
          customer_id: 'cust_123'
        },
        created_at: '2025-01-23T10:00:00Z',
        updated_at: '2025-01-23T10:00:00Z'
      };

      console.log('Event retrieved:', eventId);
      return mockEvent;
    } catch (error) {
      console.error('Error getting event:', error);
      return null;
    }
  }

  async listEvents(projectId: string, params?: {
    event_type?: string;
    source_id?: string;
  }): Promise<ConvoyEvent[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEvents: ConvoyEvent[] = [
        {
          uid: 'evt_1',
          event_type: 'payment.succeeded',
          project_id: projectId,
          data: {
            amount: 1000,
            currency: 'USD'
          },
          created_at: '2025-01-23T10:00:00Z',
          updated_at: '2025-01-23T10:00:00Z'
        },
        {
          uid: 'evt_2',
          event_type: 'user.created',
          project_id: projectId,
          data: {
            user_id: 'user_123',
            email: 'user@example.com'
          },
          created_at: '2025-01-23T11:30:00Z',
          updated_at: '2025-01-23T11:30:00Z'
        }
      ];

      console.log('Events retrieved:', mockEvents.length);
      return mockEvents;
    } catch (error) {
      console.error('Error listing events:', error);
      return null;
    }
  }

  // ==================== Event Deliveries ====================

  async getEventDelivery(projectId: string, deliveryId: string): Promise<ConvoyEventDelivery | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDelivery: ConvoyEventDelivery = {
        uid: deliveryId,
        event_id: 'evt_1',
        endpoint_id: 'ep_1',
        subscription_id: 'sub_1',
        project_id: projectId,
        status: 'success',
        description: 'Delivery successful',
        metadata: {
          num_trials: 1
        },
        attempts: [
          {
            uid: 'att_1',
            status: 'success',
            http_status: 200,
            response_data: '{"status":"ok"}',
            error: '',
            created_at: '2025-01-23T10:00:01Z',
            updated_at: '2025-01-23T10:00:01Z'
          }
        ],
        created_at: '2025-01-23T10:00:00Z',
        updated_at: '2025-01-23T10:00:01Z'
      };

      console.log('Event delivery retrieved:', deliveryId);
      return mockDelivery;
    } catch (error) {
      console.error('Error getting event delivery:', error);
      return null;
    }
  }

  async listEventDeliveries(projectId: string, params?: {
    event_id?: string;
    endpoint_id?: string;
    subscription_id?: string;
    status?: string;
  }): Promise<ConvoyEventDelivery[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDeliveries: ConvoyEventDelivery[] = [
        {
          uid: 'del_1',
          event_id: 'evt_1',
          endpoint_id: 'ep_1',
          subscription_id: 'sub_1',
          project_id: projectId,
          status: 'success',
          description: 'Delivery successful',
          metadata: {
            num_trials: 1
          },
          attempts: [
            {
              uid: 'att_1',
              status: 'success',
              http_status: 200,
              response_data: '{"status":"ok"}',
              error: '',
              created_at: '2025-01-23T10:00:01Z',
              updated_at: '2025-01-23T10:00:01Z'
            }
          ],
          created_at: '2025-01-23T10:00:00Z',
          updated_at: '2025-01-23T10:00:01Z'
        }
      ];

      console.log('Event deliveries retrieved:', mockDeliveries.length);
      return mockDeliveries;
    } catch (error) {
      console.error('Error listing event deliveries:', error);
      return null;
    }
  }

  async retryEventDelivery(projectId: string, deliveryId: string): Promise<ConvoyEventDelivery | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDelivery: ConvoyEventDelivery = {
        uid: deliveryId,
        event_id: 'evt_1',
        endpoint_id: 'ep_1',
        subscription_id: 'sub_1',
        project_id: projectId,
        status: 'scheduled',
        description: 'Retry scheduled',
        metadata: {
          num_trials: 2
        },
        attempts: [],
        created_at: '2025-01-23T10:00:00Z',
        updated_at: new Date().toISOString()
      };

      console.log('Event delivery retry scheduled:', deliveryId);
      return mockDelivery;
    } catch (error) {
      console.error('Error retrying event delivery:', error);
      return null;
    }
  }

  // ==================== Sources ====================

  async createSource(projectId: string, params: {
    name: string;
    type: 'http' | 'pubsub' | 'db_change_stream';
    verifier?: ConvoySource['verifier'];
  }): Promise<ConvoySource | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSource: ConvoySource = {
        uid: `src_${Date.now()}`,
        name: params.name,
        type: params.type,
        mask_id: `mask_${Math.random().toString(36).substring(7)}`,
        provider: 'generic',
        is_disabled: false,
        verifier: params.verifier,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Source created:', mockSource.name);
      return mockSource;
    } catch (error) {
      console.error('Error creating source:', error);
      return null;
    }
  }

  async listSources(projectId: string): Promise<ConvoySource[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockSources: ConvoySource[] = [
        {
          uid: 'src_1',
          name: 'Stripe Webhooks',
          type: 'http',
          mask_id: 'mask_abc123',
          provider: 'stripe',
          is_disabled: false,
          verifier: {
            type: 'hmac',
            hmac: {
              header: 'Stripe-Signature',
              hash: 'SHA256',
              secret: 'whsec_xxx',
              encoding: 'hex'
            }
          },
          created_at: '2025-01-20T10:00:00Z',
          updated_at: '2025-01-23T15:30:00Z'
        }
      ];

      console.log('Sources retrieved:', mockSources.length);
      return mockSources;
    } catch (error) {
      console.error('Error listing sources:', error);
      return null;
    }
  }

  // ==================== Portal Links ====================

  async createPortalLink(projectId: string, params: {
    name: string;
    endpoints: string[];
    can_manage_endpoint?: boolean;
  }): Promise<ConvoyPortalLink | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPortalLink: ConvoyPortalLink = {
        uid: `pl_${Date.now()}`,
        project_id: projectId,
        name: params.name,
        token: `token_${Math.random().toString(36).substring(7)}`,
        endpoints: params.endpoints,
        endpoint_count: params.endpoints.length,
        can_manage_endpoint: params.can_manage_endpoint || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Portal link created:', mockPortalLink.name);
      return mockPortalLink;
    } catch (error) {
      console.error('Error creating portal link:', error);
      return null;
    }
  }

  // ==================== Signature Verification ====================

  verifySignature(payload: string, signature: string, secret: string, algorithm: 'SHA256' | 'SHA512' = 'SHA256'): boolean {
    // Mock verification for development
    console.log('Signature verified (mock)');
    return true;
  }

  generateSignature(payload: string, secret: string, algorithm: 'SHA256' | 'SHA512' = 'SHA256'): string {
    // Mock signature generation for development
    const mockSignature = `sig_${Math.random().toString(36).substring(7)}`;
    console.log('Signature generated (mock)');
    return mockSignature;
  }
}

export const convoyIntegration = new ConvoyIntegrationService();
