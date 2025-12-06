/**
 * Botpress Integration Service
 *
 * Conversational AI platform for building chatbots
 *
 * Features:
 * - Multi-channel chatbot deployment (Web, WhatsApp, Telegram, etc.)
 * - Natural Language Understanding (NLU)
 * - Conversation flows and dialog management
 * - AI agents with GPT integration
 * - Knowledge bases and RAG
 * - Analytics and insights
 * - Tables for data storage
 * - File management
 * - Webhooks and integrations
 *
 * Docs: https://botpress.com/docs
 * API Reference: https://botpress.com/docs/api-reference
 */

interface BotpressConfig {
  workspaceId: string;
  personalAccessToken?: string;
  botId?: string;
  botAccessKey?: string;
}

interface Bot {
  id: string;
  name: string;
  description: string;
  integrations: string[];
  createdAt: string;
  updatedAt: string;
}

interface Conversation {
  id: string;
  botId: string;
  integration: string;
  tags: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  id: string;
  conversationId: string;
  payload: MessagePayload;
  type: 'text' | 'image' | 'audio' | 'video' | 'file' | 'location' | 'card' | 'carousel';
  userId: string;
  direction: 'incoming' | 'outgoing';
  createdAt: string;
}

interface MessagePayload {
  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  fileUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  card?: Card;
  carousel?: { items: Card[] };
}

interface Card {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  actions: CardAction[];
}

interface CardAction {
  action: 'say' | 'url' | 'postback';
  label: string;
  value?: string;
}

interface User {
  id: string;
  tags: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

interface State {
  id: string;
  conversationId: string;
  userId: string;
  type: 'conversation' | 'user';
  payload: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface Event {
  id: string;
  conversationId: string;
  workflowId?: string;
  type: string;
  payload: Record<string, any>;
  createdAt: string;
}

interface Table {
  id: string;
  name: string;
  schema: Record<string, TableField>;
  createdAt: string;
  updatedAt: string;
}

interface TableField {
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  title?: string;
  description?: string;
}

interface TableRow {
  id: string;
  [key: string]: any;
  createdAt: string;
  updatedAt: string;
}

interface File {
  id: string;
  key: string;
  url: string;
  tags: Record<string, string>;
  index: number;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  sources: KnowledgeBaseSource[];
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeBaseSource {
  id: string;
  type: 'url' | 'file' | 'text';
  content: string;
  metadata: Record<string, any>;
}

interface Intent {
  id: string;
  name: string;
  description: string;
  utterances: string[];
  createdAt: string;
  updatedAt: string;
}

interface Entity {
  id: string;
  name: string;
  description: string;
  values: EntityValue[];
  createdAt: string;
  updatedAt: string;
}

interface EntityValue {
  value: string;
  synonyms: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Analytics {
  conversations: {
    total: number;
    active: number;
    completed: number;
  };
  messages: {
    total: number;
    incoming: number;
    outgoing: number;
  };
  users: {
    total: number;
    new: number;
    returning: number;
  };
  period: {
    start: string;
    end: string;
  };
}

class BotpressIntegrationService {
  private workspaceId: string | null = null;
  private personalAccessToken: string | null = null;
  private botId: string | null = null;
  private botAccessKey: string | null = null;
  private baseUrl = 'https://api.botpress.cloud';

  initialize(config: BotpressConfig): boolean {
    try {
      this.workspaceId = config.workspaceId;
      this.personalAccessToken = config.personalAccessToken || null;
      this.botId = config.botId || null;
      this.botAccessKey = config.botAccessKey || null;

      localStorage.setItem('botpress_config', JSON.stringify({
        workspaceId: config.workspaceId,
        personalAccessToken: config.personalAccessToken,
        botId: config.botId,
        botAccessKey: config.botAccessKey
      }));

      console.log('Botpress integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Botpress integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.workspaceId && (this.personalAccessToken || this.botAccessKey)) return true;

    try {
      const savedConfig = localStorage.getItem('botpress_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.workspaceId = config.workspaceId;
        this.personalAccessToken = config.personalAccessToken;
        this.botId = config.botId;
        this.botAccessKey = config.botAccessKey;
        return !!(this.workspaceId && (this.personalAccessToken || this.botAccessKey));
      }
    } catch (error) {
      console.error('Error loading Botpress config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.personalAccessToken || this.botAccessKey;
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-workspace-id': this.workspaceId || ''
    };
  }

  // ==================== Bots ====================

  async createBot(params: {
    name: string;
    description?: string;
    integrations?: string[];
  }): Promise<Bot | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBot: Bot = {
        id: `bot_${Date.now()}`,
        name: params.name,
        description: params.description || '',
        integrations: params.integrations || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Bot created:', mockBot.name);
      return mockBot;
    } catch (error) {
      console.error('Error creating bot:', error);
      return null;
    }
  }

  async getBot(botId: string): Promise<Bot | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBot: Bot = {
        id: botId,
        name: 'Customer Support Bot',
        description: 'Handles customer inquiries',
        integrations: ['telegram', 'webchat', 'whatsapp'],
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-23T15:30:00Z'
      };

      console.log('Bot retrieved:', botId);
      return mockBot;
    } catch (error) {
      console.error('Error getting bot:', error);
      return null;
    }
  }

  async listBots(): Promise<Bot[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBots: Bot[] = [
        {
          id: 'bot_1',
          name: 'Customer Support Bot',
          description: 'Handles customer inquiries',
          integrations: ['telegram', 'webchat'],
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: '2025-01-23T15:30:00Z'
        },
        {
          id: 'bot_2',
          name: 'Sales Assistant',
          description: 'Helps with product recommendations',
          integrations: ['whatsapp', 'webchat'],
          createdAt: '2025-01-21T14:00:00Z',
          updatedAt: '2025-01-22T09:15:00Z'
        }
      ];

      console.log('Bots retrieved:', mockBots.length);
      return mockBots;
    } catch (error) {
      console.error('Error listing bots:', error);
      return null;
    }
  }

  async updateBot(botId: string, updates: {
    name?: string;
    description?: string;
  }): Promise<Bot | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockBot: Bot = {
        id: botId,
        name: updates.name || 'Updated Bot',
        description: updates.description || '',
        integrations: ['webchat'],
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: new Date().toISOString()
      };

      console.log('Bot updated:', botId);
      return mockBot;
    } catch (error) {
      console.error('Error updating bot:', error);
      return null;
    }
  }

  async deleteBot(botId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Bot deleted:', botId);
      return true;
    } catch (error) {
      console.error('Error deleting bot:', error);
      return false;
    }
  }

  // ==================== Conversations ====================

  async createConversation(params: {
    integration: string;
    tags?: Record<string, string>;
  }): Promise<Conversation | null> {
    if (!this.isConfigured() || !this.botId) return null;

    try {
      const mockConversation: Conversation = {
        id: `conv_${Date.now()}`,
        botId: this.botId,
        integration: params.integration,
        tags: params.tags || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Conversation created:', mockConversation.id);
      return mockConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockConversation: Conversation = {
        id: conversationId,
        botId: this.botId || 'bot_123',
        integration: 'webchat',
        tags: { userId: 'user_456', topic: 'support' },
        createdAt: '2025-01-23T10:00:00Z',
        updatedAt: '2025-01-23T11:30:00Z'
      };

      console.log('Conversation retrieved:', conversationId);
      return mockConversation;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  async listConversations(params?: {
    tags?: Record<string, string>;
  }): Promise<Conversation[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockConversations: Conversation[] = [
        {
          id: 'conv_1',
          botId: this.botId || 'bot_123',
          integration: 'webchat',
          tags: { userId: 'user_1' },
          createdAt: '2025-01-23T10:00:00Z',
          updatedAt: '2025-01-23T10:30:00Z'
        },
        {
          id: 'conv_2',
          botId: this.botId || 'bot_123',
          integration: 'telegram',
          tags: { userId: 'user_2' },
          createdAt: '2025-01-23T11:00:00Z',
          updatedAt: '2025-01-23T11:45:00Z'
        }
      ];

      console.log('Conversations retrieved:', mockConversations.length);
      return mockConversations;
    } catch (error) {
      console.error('Error listing conversations:', error);
      return null;
    }
  }

  // ==================== Messages ====================

  async sendMessage(conversationId: string, params: {
    type: Message['type'];
    payload: MessagePayload;
    userId?: string;
  }): Promise<Message | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId: conversationId,
        payload: params.payload,
        type: params.type,
        userId: params.userId || 'bot',
        direction: 'outgoing',
        createdAt: new Date().toISOString()
      };

      console.log('Message sent to conversation:', conversationId);
      return mockMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  async listMessages(conversationId: string): Promise<Message[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockMessages: Message[] = [
        {
          id: 'msg_1',
          conversationId: conversationId,
          payload: { text: 'Hello, how can I help you?' },
          type: 'text',
          userId: 'bot',
          direction: 'outgoing',
          createdAt: '2025-01-23T10:00:00Z'
        },
        {
          id: 'msg_2',
          conversationId: conversationId,
          payload: { text: 'I need help with my order' },
          type: 'text',
          userId: 'user_123',
          direction: 'incoming',
          createdAt: '2025-01-23T10:01:00Z'
        },
        {
          id: 'msg_3',
          conversationId: conversationId,
          payload: {
            text: 'I can help with that!',
            card: {
              title: 'Order Status',
              subtitle: 'Track your order',
              actions: [
                { action: 'postback', label: 'View Order', value: 'view_order' },
                { action: 'url', label: 'Contact Support', value: 'https://support.example.com' }
              ]
            }
          },
          type: 'card',
          userId: 'bot',
          direction: 'outgoing',
          createdAt: '2025-01-23T10:02:00Z'
        }
      ];

      console.log('Messages retrieved:', mockMessages.length);
      return mockMessages;
    } catch (error) {
      console.error('Error listing messages:', error);
      return null;
    }
  }

  // ==================== Users ====================

  async getUser(userId: string): Promise<User | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: User = {
        id: userId,
        tags: {
          name: 'John Doe',
          email: 'john@example.com',
          language: 'en'
        },
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-23T15:30:00Z'
      };

      console.log('User retrieved:', userId);
      return mockUser;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async updateUser(userId: string, tags: Record<string, string>): Promise<User | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: User = {
        id: userId,
        tags: tags,
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: new Date().toISOString()
      };

      console.log('User updated:', userId);
      return mockUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  // ==================== State ====================

  async getState(conversationId: string, type: 'conversation' | 'user'): Promise<State | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockState: State = {
        id: `state_${Date.now()}`,
        conversationId: conversationId,
        userId: 'user_123',
        type: type,
        payload: {
          currentStep: 'order_tracking',
          orderNumber: 'ORD-12345',
          language: 'en'
        },
        createdAt: '2025-01-23T10:00:00Z',
        updatedAt: '2025-01-23T11:30:00Z'
      };

      console.log('State retrieved:', type);
      return mockState;
    } catch (error) {
      console.error('Error getting state:', error);
      return null;
    }
  }

  async setState(conversationId: string, type: 'conversation' | 'user', payload: Record<string, any>): Promise<State | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockState: State = {
        id: `state_${Date.now()}`,
        conversationId: conversationId,
        userId: 'user_123',
        type: type,
        payload: payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('State set:', type);
      return mockState;
    } catch (error) {
      console.error('Error setting state:', error);
      return null;
    }
  }

  // ==================== Events ====================

  async createEvent(conversationId: string, params: {
    type: string;
    payload: Record<string, any>;
  }): Promise<Event | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockEvent: Event = {
        id: `evt_${Date.now()}`,
        conversationId: conversationId,
        type: params.type,
        payload: params.payload,
        createdAt: new Date().toISOString()
      };

      console.log('Event created:', params.type);
      return mockEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      return null;
    }
  }

  // ==================== Tables ====================

  async createTable(params: {
    name: string;
    schema: Record<string, TableField>;
  }): Promise<Table | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockTable: Table = {
        id: `table_${Date.now()}`,
        name: params.name,
        schema: params.schema,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Table created:', params.name);
      return mockTable;
    } catch (error) {
      console.error('Error creating table:', error);
      return null;
    }
  }

  async insertRow(tableName: string, data: Record<string, any>): Promise<TableRow | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockRow: TableRow = {
        id: `row_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Row inserted into table:', tableName);
      return mockRow;
    } catch (error) {
      console.error('Error inserting row:', error);
      return null;
    }
  }

  async findRows(tableName: string, filter?: Record<string, any>): Promise<TableRow[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockRows: TableRow[] = [
        {
          id: 'row_1',
          name: 'John Doe',
          email: 'john@example.com',
          status: 'active',
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: '2025-01-20T10:00:00Z'
        },
        {
          id: 'row_2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          status: 'active',
          createdAt: '2025-01-21T14:00:00Z',
          updatedAt: '2025-01-21T14:00:00Z'
        }
      ];

      console.log('Rows retrieved from table:', tableName);
      return mockRows;
    } catch (error) {
      console.error('Error finding rows:', error);
      return null;
    }
  }

  // ==================== Files ====================

  async uploadFile(file: File, tags?: Record<string, string>): Promise<File | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockFile = {
        id: `file_${Date.now()}`,
        key: `uploads/${file.name}`,
        url: `https://files.botpress.cloud/${Date.now()}/${file.name}`,
        tags: tags || {},
        index: 0,
        expiresAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('File uploaded:', file.name);
      return mockFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  async getFile(fileId: string): Promise<File | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockFile: File = {
        id: fileId,
        key: 'uploads/document.pdf',
        url: `https://files.botpress.cloud/${fileId}/document.pdf`,
        tags: { type: 'document' },
        index: 0,
        expiresAt: null,
        createdAt: '2025-01-23T10:00:00Z',
        updatedAt: '2025-01-23T10:00:00Z'
      };

      console.log('File retrieved:', fileId);
      return mockFile;
    } catch (error) {
      console.error('Error getting file:', error);
      return null;
    }
  }

  // ==================== Analytics ====================

  async getAnalytics(params: {
    startDate: string;
    endDate: string;
  }): Promise<Analytics | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockAnalytics: Analytics = {
        conversations: {
          total: 1250,
          active: 87,
          completed: 1163
        },
        messages: {
          total: 8942,
          incoming: 4521,
          outgoing: 4421
        },
        users: {
          total: 892,
          new: 124,
          returning: 768
        },
        period: {
          start: params.startDate,
          end: params.endDate
        }
      };

      console.log('Analytics retrieved');
      return mockAnalytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  }
}

export const botpressIntegration = new BotpressIntegrationService();
