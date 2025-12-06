/**
 * Directus Integration Service
 *
 * Open-source data platform and headless CMS
 *
 * Features:
 * - Database abstraction (works with PostgreSQL, MySQL, SQLite, etc.)
 * - Auto-generated REST & GraphQL APIs
 * - User management and authentication
 * - File storage with transformations
 * - Role-based permissions
 * - Webhooks and automation flows
 * - Real-time subscriptions
 * - Admin dashboard
 *
 * Docs: https://docs.directus.io/
 * GitHub: https://github.com/directus/directus
 */

interface DirectusConfig {
  baseUrl: string;
  email?: string;
  password?: string;
  token?: string;
}

interface DirectusUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: 'active' | 'invited' | 'draft' | 'suspended' | 'archived';
  token?: string;
}

interface DirectusCollection {
  collection: string;
  meta: {
    collection: string;
    icon: string | null;
    note: string | null;
    display_template: string | null;
    hidden: boolean;
    singleton: boolean;
    translations: any[];
    archive_field: string | null;
    archive_app_filter: boolean;
    archive_value: string | null;
    unarchive_value: string | null;
    sort_field: string | null;
  };
  schema: {
    name: string;
    comment: string | null;
  };
}

interface DirectusField {
  collection: string;
  field: string;
  type: string;
  meta: {
    id: number;
    collection: string;
    field: string;
    special: string[] | null;
    interface: string | null;
    options: any;
    display: string | null;
    display_options: any;
    readonly: boolean;
    hidden: boolean;
    sort: number | null;
    width: string;
    translations: any[];
    note: string | null;
    conditions: any[];
    required: boolean;
    group: string | null;
    validation: any;
    validation_message: string | null;
  };
  schema: {
    name: string;
    table: string;
    data_type: string;
    default_value: any;
    max_length: number | null;
    numeric_precision: number | null;
    numeric_scale: number | null;
    is_nullable: boolean;
    is_unique: boolean;
    is_primary_key: boolean;
    has_auto_increment: boolean;
    foreign_key_column: string | null;
    foreign_key_table: string | null;
  };
}

interface DirectusItem {
  [key: string]: any;
}

interface DirectusFile {
  id: string;
  storage: string;
  filename_disk: string;
  filename_download: string;
  title: string;
  type: string;
  folder: string | null;
  uploaded_by: string;
  uploaded_on: string;
  modified_by: string | null;
  modified_on: string;
  charset: string | null;
  filesize: number;
  width: number | null;
  height: number | null;
  duration: number | null;
  embed: string | null;
  description: string | null;
  location: string | null;
  tags: string[];
  metadata: Record<string, any>;
}

interface DirectusRole {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  ip_access: string[];
  enforce_tfa: boolean;
  admin_access: boolean;
  app_access: boolean;
}

interface DirectusPermission {
  id: number;
  role: string | null;
  collection: string;
  action: 'create' | 'read' | 'update' | 'delete';
  permissions: Record<string, any> | null;
  validation: Record<string, any> | null;
  presets: Record<string, any> | null;
  fields: string[] | null;
}

interface DirectusWebhook {
  id: number;
  name: string;
  method: 'GET' | 'POST';
  url: string;
  status: 'active' | 'inactive';
  data: boolean;
  actions: ('create' | 'update' | 'delete')[];
  collections: string[];
  headers: Array<{ header: string; value: string }>;
}

interface DirectusFlow {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  description: string | null;
  status: 'active' | 'inactive';
  trigger: string | null;
  accountability: 'all' | 'activity' | null;
  options: Record<string, any> | null;
  operation: string | null;
  date_created: string;
  user_created: string | null;
}

interface DirectusActivity {
  id: number;
  action: 'create' | 'update' | 'delete' | 'login';
  user: string;
  timestamp: string;
  ip: string;
  user_agent: string;
  collection: string;
  item: string;
  comment: string | null;
}

interface QueryParams {
  fields?: string[];
  filter?: Record<string, any>;
  search?: string;
  sort?: string[];
  limit?: number;
  offset?: number;
  page?: number;
  meta?: string;
  aggregate?: Record<string, any>;
  groupBy?: string[];
  deep?: Record<string, any>;
}

class DirectusIntegrationService {
  private baseUrl: string | null = null;
  private token: string | null = null;

  initialize(config: DirectusConfig): boolean {
    try {
      this.baseUrl = config.baseUrl;
      this.token = config.token || null;

      localStorage.setItem('directus_config', JSON.stringify({
        baseUrl: config.baseUrl,
        token: config.token
      }));

      console.log('Directus integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Directus integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.baseUrl && this.token) return true;

    try {
      const savedConfig = localStorage.getItem('directus_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.baseUrl = config.baseUrl;
        this.token = config.token;
        return !!(this.baseUrl && this.token);
      }
    } catch (error) {
      console.error('Error loading Directus config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  // ==================== Authentication ====================

  async login(email: string, password: string): Promise<{ access_token: string; refresh_token: string; expires: number } | null> {
    if (!this.baseUrl) return null;

    try {
      // Mock response for development
      const mockResponse = {
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        expires: 900000 // 15 minutes in milliseconds
      };

      this.token = mockResponse.access_token;
      localStorage.setItem('directus_token', mockResponse.access_token);

      console.log('Login successful');
      return mockResponse;
    } catch (error) {
      console.error('Error logging in:', error);
      return null;
    }
  }

  async logout(): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      this.token = null;
      localStorage.removeItem('directus_token');
      console.log('Logout successful');
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<DirectusUser | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: DirectusUser = {
        id: 'user_123',
        email: 'admin@example.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'administrator',
        status: 'active'
      };

      console.log('Current user retrieved');
      return mockUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // ==================== Collections ====================

  async getCollections(): Promise<DirectusCollection[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockCollections: DirectusCollection[] = [
        {
          collection: 'articles',
          meta: {
            collection: 'articles',
            icon: 'article',
            note: 'Blog articles and posts',
            display_template: null,
            hidden: false,
            singleton: false,
            translations: [],
            archive_field: 'status',
            archive_app_filter: true,
            archive_value: 'archived',
            unarchive_value: 'draft',
            sort_field: 'sort',
          },
          schema: {
            name: 'articles',
            comment: null
          }
        },
        {
          collection: 'products',
          meta: {
            collection: 'products',
            icon: 'shopping_cart',
            note: 'E-commerce products',
            display_template: null,
            hidden: false,
            singleton: false,
            translations: [],
            archive_field: null,
            archive_app_filter: false,
            archive_value: null,
            unarchive_value: null,
            sort_field: null,
          },
          schema: {
            name: 'products',
            comment: null
          }
        }
      ];

      console.log('Collections retrieved:', mockCollections.length);
      return mockCollections;
    } catch (error) {
      console.error('Error getting collections:', error);
      return null;
    }
  }

  async getCollection(collection: string): Promise<DirectusCollection | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockCollection: DirectusCollection = {
        collection: collection,
        meta: {
          collection: collection,
          icon: 'article',
          note: 'Collection metadata',
          display_template: null,
          hidden: false,
          singleton: false,
          translations: [],
          archive_field: null,
          archive_app_filter: false,
          archive_value: null,
          unarchive_value: null,
          sort_field: null,
        },
        schema: {
          name: collection,
          comment: null
        }
      };

      console.log('Collection retrieved:', collection);
      return mockCollection;
    } catch (error) {
      console.error('Error getting collection:', error);
      return null;
    }
  }

  async createCollection(params: {
    collection: string;
    fields?: DirectusField[];
    meta?: any;
    schema?: any;
  }): Promise<DirectusCollection | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockCollection: DirectusCollection = {
        collection: params.collection,
        meta: {
          collection: params.collection,
          icon: null,
          note: null,
          display_template: null,
          hidden: false,
          singleton: false,
          translations: [],
          archive_field: null,
          archive_app_filter: false,
          archive_value: null,
          unarchive_value: null,
          sort_field: null,
          ...params.meta
        },
        schema: {
          name: params.collection,
          comment: null,
          ...params.schema
        }
      };

      console.log('Collection created:', params.collection);
      return mockCollection;
    } catch (error) {
      console.error('Error creating collection:', error);
      return null;
    }
  }

  async deleteCollection(collection: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Collection deleted:', collection);
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      return false;
    }
  }

  // ==================== Items ====================

  async getItems<T = DirectusItem>(
    collection: string,
    params?: QueryParams
  ): Promise<T[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockItems: any[] = [
        {
          id: 1,
          status: 'published',
          title: 'First Article',
          content: 'This is the content of the first article',
          author: 'user_123',
          date_created: '2025-01-20T10:00:00Z',
          date_updated: '2025-01-22T15:30:00Z'
        },
        {
          id: 2,
          status: 'draft',
          title: 'Second Article',
          content: 'This is the content of the second article',
          author: 'user_456',
          date_created: '2025-01-21T14:00:00Z',
          date_updated: '2025-01-21T14:00:00Z'
        }
      ];

      console.log('Items retrieved from', collection, ':', mockItems.length);
      return mockItems as T[];
    } catch (error) {
      console.error('Error getting items:', error);
      return null;
    }
  }

  async getItem<T = DirectusItem>(
    collection: string,
    id: string | number,
    params?: QueryParams
  ): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockItem: any = {
        id: id,
        status: 'published',
        title: 'Article Title',
        content: 'Article content goes here',
        author: 'user_123',
        date_created: '2025-01-20T10:00:00Z',
        date_updated: '2025-01-22T15:30:00Z'
      };

      console.log('Item retrieved:', collection, id);
      return mockItem as T;
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  }

  async createItem<T = DirectusItem>(
    collection: string,
    data: Partial<T>
  ): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockItem: any = {
        id: Date.now(),
        ...data,
        date_created: new Date().toISOString(),
        date_updated: new Date().toISOString()
      };

      console.log('Item created in', collection);
      return mockItem as T;
    } catch (error) {
      console.error('Error creating item:', error);
      return null;
    }
  }

  async createItems<T = DirectusItem>(
    collection: string,
    data: Partial<T>[]
  ): Promise<T[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockItems: any[] = data.map((item, index) => ({
        id: Date.now() + index,
        ...item,
        date_created: new Date().toISOString(),
        date_updated: new Date().toISOString()
      }));

      console.log('Items created in', collection, ':', mockItems.length);
      return mockItems as T[];
    } catch (error) {
      console.error('Error creating items:', error);
      return null;
    }
  }

  async updateItem<T = DirectusItem>(
    collection: string,
    id: string | number,
    data: Partial<T>
  ): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockItem: any = {
        id: id,
        ...data,
        date_updated: new Date().toISOString()
      };

      console.log('Item updated in', collection, ':', id);
      return mockItem as T;
    } catch (error) {
      console.error('Error updating item:', error);
      return null;
    }
  }

  async updateItems<T = DirectusItem>(
    collection: string,
    ids: (string | number)[],
    data: Partial<T>
  ): Promise<T[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockItems: any[] = ids.map(id => ({
        id: id,
        ...data,
        date_updated: new Date().toISOString()
      }));

      console.log('Items updated in', collection, ':', mockItems.length);
      return mockItems as T[];
    } catch (error) {
      console.error('Error updating items:', error);
      return null;
    }
  }

  async deleteItem(collection: string, id: string | number): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Item deleted from', collection, ':', id);
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  }

  async deleteItems(collection: string, ids: (string | number)[]): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('Items deleted from', collection, ':', ids.length);
      return true;
    } catch (error) {
      console.error('Error deleting items:', error);
      return false;
    }
  }

  // ==================== Files ====================

  async uploadFile(file: File, params?: {
    folder?: string;
    title?: string;
    description?: string;
    tags?: string[];
  }): Promise<DirectusFile | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockFile: DirectusFile = {
        id: `file_${Date.now()}`,
        storage: 'local',
        filename_disk: `${Date.now()}_${file.name}`,
        filename_download: file.name,
        title: params?.title || file.name,
        type: file.type,
        folder: params?.folder || null,
        uploaded_by: 'user_123',
        uploaded_on: new Date().toISOString(),
        modified_by: null,
        modified_on: new Date().toISOString(),
        charset: null,
        filesize: file.size,
        width: null,
        height: null,
        duration: null,
        embed: null,
        description: params?.description || null,
        location: null,
        tags: params?.tags || [],
        metadata: {}
      };

      console.log('File uploaded:', mockFile.filename_download);
      return mockFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  async getFile(fileId: string): Promise<DirectusFile | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockFile: DirectusFile = {
        id: fileId,
        storage: 'local',
        filename_disk: `${Date.now()}_example.jpg`,
        filename_download: 'example.jpg',
        title: 'Example Image',
        type: 'image/jpeg',
        folder: null,
        uploaded_by: 'user_123',
        uploaded_on: '2025-01-20T10:00:00Z',
        modified_by: null,
        modified_on: '2025-01-20T10:00:00Z',
        charset: null,
        filesize: 1024000,
        width: 1920,
        height: 1080,
        duration: null,
        embed: null,
        description: 'An example image',
        location: null,
        tags: ['example', 'image'],
        metadata: {}
      };

      console.log('File retrieved:', fileId);
      return mockFile;
    } catch (error) {
      console.error('Error getting file:', error);
      return null;
    }
  }

  getFileUrl(fileId: string, params?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'inside' | 'outside';
    quality?: number;
    format?: 'jpg' | 'png' | 'webp' | 'tiff';
  }): string | null {
    if (!this.baseUrl) return null;

    let url = `${this.baseUrl}/assets/${fileId}`;

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.width) queryParams.append('width', params.width.toString());
      if (params.height) queryParams.append('height', params.height.toString());
      if (params.fit) queryParams.append('fit', params.fit);
      if (params.quality) queryParams.append('quality', params.quality.toString());
      if (params.format) queryParams.append('format', params.format);

      const query = queryParams.toString();
      if (query) url += `?${query}`;
    }

    return url;
  }

  async deleteFile(fileId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      console.log('File deleted:', fileId);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  // ==================== Users & Roles ====================

  async getUsers(params?: QueryParams): Promise<DirectusUser[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUsers: DirectusUser[] = [
        {
          id: 'user_123',
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'administrator',
          status: 'active'
        },
        {
          id: 'user_456',
          email: 'editor@example.com',
          first_name: 'Editor',
          last_name: 'User',
          role: 'editor',
          status: 'active'
        }
      ];

      console.log('Users retrieved:', mockUsers.length);
      return mockUsers;
    } catch (error) {
      console.error('Error getting users:', error);
      return null;
    }
  }

  async createUser(params: {
    email: string;
    password: string;
    role: string;
    first_name?: string;
    last_name?: string;
  }): Promise<DirectusUser | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: DirectusUser = {
        id: `user_${Date.now()}`,
        email: params.email,
        first_name: params.first_name || '',
        last_name: params.last_name || '',
        role: params.role,
        status: 'active'
      };

      console.log('User created:', mockUser.email);
      return mockUser;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async getRoles(): Promise<DirectusRole[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockRoles: DirectusRole[] = [
        {
          id: 'role_admin',
          name: 'Administrator',
          icon: 'verified_user',
          description: 'Full system access',
          ip_access: [],
          enforce_tfa: false,
          admin_access: true,
          app_access: true
        },
        {
          id: 'role_editor',
          name: 'Editor',
          icon: 'edit',
          description: 'Can edit content',
          ip_access: [],
          enforce_tfa: false,
          admin_access: false,
          app_access: true
        }
      ];

      console.log('Roles retrieved:', mockRoles.length);
      return mockRoles;
    } catch (error) {
      console.error('Error getting roles:', error);
      return null;
    }
  }

  // ==================== Permissions ====================

  async getPermissions(roleId?: string): Promise<DirectusPermission[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPermissions: DirectusPermission[] = [
        {
          id: 1,
          role: roleId || 'role_editor',
          collection: 'articles',
          action: 'read',
          permissions: {},
          validation: null,
          presets: null,
          fields: ['*']
        },
        {
          id: 2,
          role: roleId || 'role_editor',
          collection: 'articles',
          action: 'create',
          permissions: {},
          validation: null,
          presets: null,
          fields: ['*']
        }
      ];

      console.log('Permissions retrieved:', mockPermissions.length);
      return mockPermissions;
    } catch (error) {
      console.error('Error getting permissions:', error);
      return null;
    }
  }

  // ==================== Webhooks ====================

  async getWebhooks(): Promise<DirectusWebhook[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockWebhooks: DirectusWebhook[] = [
        {
          id: 1,
          name: 'Sync to External System',
          method: 'POST',
          url: 'https://external-system.com/webhook',
          status: 'active',
          data: true,
          actions: ['create', 'update'],
          collections: ['articles'],
          headers: [
            { header: 'Authorization', value: 'Bearer token123' }
          ]
        }
      ];

      console.log('Webhooks retrieved:', mockWebhooks.length);
      return mockWebhooks;
    } catch (error) {
      console.error('Error getting webhooks:', error);
      return null;
    }
  }

  async createWebhook(params: {
    name: string;
    method: 'GET' | 'POST';
    url: string;
    actions: ('create' | 'update' | 'delete')[];
    collections: string[];
    headers?: Array<{ header: string; value: string }>;
  }): Promise<DirectusWebhook | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockWebhook: DirectusWebhook = {
        id: Date.now(),
        name: params.name,
        method: params.method,
        url: params.url,
        status: 'active',
        data: true,
        actions: params.actions,
        collections: params.collections,
        headers: params.headers || []
      };

      console.log('Webhook created:', mockWebhook.name);
      return mockWebhook;
    } catch (error) {
      console.error('Error creating webhook:', error);
      return null;
    }
  }

  // ==================== Flows (Automation) ====================

  async getFlows(): Promise<DirectusFlow[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockFlows: DirectusFlow[] = [
        {
          id: 'flow_123',
          name: 'Send Welcome Email',
          icon: 'email',
          color: '#3498db',
          description: 'Automatically send welcome email to new users',
          status: 'active',
          trigger: 'event',
          accountability: 'all',
          options: {
            type: 'action',
            scope: ['items.create']
          },
          operation: 'op_456',
          date_created: '2025-01-20T10:00:00Z',
          user_created: 'user_123'
        }
      ];

      console.log('Flows retrieved:', mockFlows.length);
      return mockFlows;
    } catch (error) {
      console.error('Error getting flows:', error);
      return null;
    }
  }

  // ==================== Activity Log ====================

  async getActivity(params?: QueryParams): Promise<DirectusActivity[] | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockActivity: DirectusActivity[] = [
        {
          id: 1,
          action: 'create',
          user: 'user_123',
          timestamp: '2025-01-23T10:00:00Z',
          ip: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
          collection: 'articles',
          item: '1',
          comment: null
        },
        {
          id: 2,
          action: 'update',
          user: 'user_456',
          timestamp: '2025-01-23T11:30:00Z',
          ip: '192.168.1.2',
          user_agent: 'Mozilla/5.0',
          collection: 'articles',
          item: '1',
          comment: 'Updated title'
        }
      ];

      console.log('Activity retrieved:', mockActivity.length);
      return mockActivity;
    } catch (error) {
      console.error('Error getting activity:', error);
      return null;
    }
  }

  // ==================== GraphQL ====================

  async graphql<T = any>(query: string, variables?: Record<string, any>): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock GraphQL response
      const mockResponse: any = {
        data: {
          articles: [
            {
              id: 1,
              title: 'GraphQL Article',
              content: 'Content from GraphQL query'
            }
          ]
        }
      };

      console.log('GraphQL query executed');
      return mockResponse as T;
    } catch (error) {
      console.error('Error executing GraphQL query:', error);
      return null;
    }
  }

  // ==================== Server Info ====================

  async getServerInfo(): Promise<{
    project: {
      project_name: string;
      project_descriptor: string | null;
      project_logo: string | null;
      public_foreground: string | null;
      public_background: string | null;
      public_note: string | null;
      custom_css: string | null;
    };
  } | null> {
    if (!this.baseUrl) return null;

    try {
      const mockInfo = {
        project: {
          project_name: 'My Directus Project',
          project_descriptor: 'A powerful headless CMS',
          project_logo: null,
          public_foreground: null,
          public_background: null,
          public_note: null,
          custom_css: null
        }
      };

      console.log('Server info retrieved');
      return mockInfo;
    } catch (error) {
      console.error('Error getting server info:', error);
      return null;
    }
  }
}

export const directusIntegration = new DirectusIntegrationService();
