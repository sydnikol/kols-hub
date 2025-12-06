/**
 * PocketBase Integration Service
 *
 * PocketBase is an open-source backend in 1 file - database, auth, file storage, and realtime.
 * Perfect for building SaaS applications, mobile apps, and real-time systems.
 *
 * Features:
 * - SQLite database with relations
 * - Authentication (email/password, OAuth2)
 * - File storage and uploads
 * - Real-time subscriptions
 * - Admin dashboard
 * - Collection-based API
 * - TypeScript support
 * - Self-hostable
 * - Built-in admin UI
 * - Automatic REST & Realtime API
 *
 * API Documentation: https://pocketbase.io/docs/
 * GitHub: https://github.com/pocketbase/pocketbase
 * Value: Open-source BaaS (Backend as a Service)
 */

interface PocketBaseConfig {
  url: string; // PocketBase instance URL
  adminEmail?: string;
  adminPassword?: string;
}

// Auth Types
interface AuthData {
  token: string;
  record: User;
}

interface User {
  id: string;
  collectionId: string;
  collectionName: string;
  username?: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  created: string;
  updated: string;
  avatar?: string;
  name?: string;
  [key: string]: any; // Custom fields
}

// Collection Types
interface Collection {
  id: string;
  name: string;
  type: 'base' | 'auth' | 'view';
  system: boolean;
  schema: SchemaField[];
  indexes: string[];
  listRule?: string;
  viewRule?: string;
  createRule?: string;
  updateRule?: string;
  deleteRule?: string;
  options?: Record<string, any>;
}

interface SchemaField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'bool' | 'email' | 'url' | 'date' | 'select' | 'file' | 'relation' | 'json';
  system: boolean;
  required: boolean;
  options?: {
    min?: number;
    max?: number;
    pattern?: string;
    maxSelect?: number;
    maxSize?: number;
    values?: string[];
    collectionId?: string;
  };
}

// Record Types
interface Record {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  [key: string]: any;
}

interface RecordListResult<T = Record> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

// File Types
interface FileUpload {
  field: string;
  file: File;
}

// Realtime Types
interface RealtimeMessage {
  action: 'create' | 'update' | 'delete';
  record: Record;
}

type RealtimeCallback = (data: RealtimeMessage) => void;

// Admin Types
interface AdminAuth {
  token: string;
  admin: Admin;
}

interface Admin {
  id: string;
  email: string;
  avatar: number;
  created: string;
  updated: string;
}

// Log Types
interface LogRequest {
  id: string;
  url: string;
  method: string;
  status: number;
  auth: string;
  userIp: string;
  remoteIp: string;
  referer: string;
  userAgent: string;
  meta: Record<string, any>;
  created: string;
  updated: string;
}

class PocketBaseIntegrationService {
  private baseUrl: string = '';
  private authToken: string | null = null;
  private adminToken: string | null = null;
  private realtimeConnections: Map<string, WebSocket> = new Map();

  /**
   * Initialize PocketBase integration
   */
  initialize(config: PocketBaseConfig): void {
    this.baseUrl = config.url.replace(/\/$/, ''); // Remove trailing slash

    // Store in localStorage
    localStorage.setItem('pocketbase_url', this.baseUrl);

    // Restore auth token if exists
    const savedToken = localStorage.getItem('pocketbase_auth_token');
    if (savedToken) {
      this.authToken = savedToken;
    }
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!this.baseUrl;
  }

  /**
   * Get authentication headers
   */
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };

    if (this.authToken) {
      headers['Authorization'] = this.authToken;
    } else if (this.adminToken) {
      headers['Authorization'] = this.adminToken;
    }

    return headers;
  }

  // ==================== AUTHENTICATION ====================

  /**
   * Authenticate user with email and password
   */
  async authWithPassword(params: {
    email: string;
    password: string;
    collection?: string;
  }): Promise<AuthData | null> {
    if (!this.isConfigured()) {
      console.error('PocketBase not configured');
      return null;
    }

    try {
      const collection = params.collection || 'users';
      const response = await fetch(
        `${this.baseUrl}/api/collections/${collection}/auth-with-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identity: params.email,
            password: params.password
          })
        }
      );

      if (!response.ok) throw new Error(`Auth failed: ${response.status}`);

      const data: AuthData = await response.json();
      this.authToken = data.token;
      localStorage.setItem('pocketbase_auth_token', data.token);

      return data;
    } catch (error) {
      console.error('Error authenticating:', error);
      return null;
    }
  }

  /**
   * Create new user account
   */
  async createUser(params: {
    email: string;
    password: string;
    passwordConfirm: string;
    username?: string;
    name?: string;
    collection?: string;
  }): Promise<User | null> {
    if (!this.isConfigured()) return null;

    try {
      const collection = params.collection || 'users';
      const response = await fetch(
        `${this.baseUrl}/api/collections/${collection}/records`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        }
      );

      if (!response.ok) throw new Error(`User creation failed: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string, collection = 'users'): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections/${collection}/request-password-reset`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return false;
    }
  }

  /**
   * Request email verification
   */
  async requestVerification(email: string, collection = 'users'): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections/${collection}/request-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error requesting verification:', error);
      return false;
    }
  }

  /**
   * Logout current user
   */
  logout(): void {
    this.authToken = null;
    localStorage.removeItem('pocketbase_auth_token');
  }

  // ==================== COLLECTIONS ====================

  /**
   * Get all collections
   */
  async getCollections(): Promise<Collection[]> {
    if (!this.isConfigured()) return [];

    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections`,
        { headers: this.getAuthHeaders() }
      );

      if (!response.ok) throw new Error(`Failed to fetch collections: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
  }

  /**
   * Create a new collection
   */
  async createCollection(collection: Omit<Collection, 'id'>): Promise<Collection | null> {
    if (!this.isConfigured()) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections`,
        {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(collection)
        }
      );

      if (!response.ok) throw new Error(`Failed to create collection: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Error creating collection:', error);
      return null;
    }
  }

  // ==================== RECORDS (CRUD) ====================

  /**
   * Get list of records from a collection
   */
  async getRecords<T = Record>(
    collection: string,
    params?: {
      page?: number;
      perPage?: number;
      sort?: string;
      filter?: string;
      expand?: string;
    }
  ): Promise<RecordListResult<T>> {
    if (!this.isConfigured()) {
      return { page: 1, perPage: 30, totalItems: 0, totalPages: 0, items: [] };
    }

    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.perPage) queryParams.set('perPage', params.perPage.toString());
      if (params?.sort) queryParams.set('sort', params.sort);
      if (params?.filter) queryParams.set('filter', params.filter);
      if (params?.expand) queryParams.set('expand', params.expand);

      const url = `${this.baseUrl}/api/collections/${collection}/records?${queryParams}`;
      const response = await fetch(url, { headers: this.getAuthHeaders() });

      if (!response.ok) throw new Error(`Failed to fetch records: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Error fetching records:', error);
      return { page: 1, perPage: 30, totalItems: 0, totalPages: 0, items: [] };
    }
  }

  /**
   * Get a single record by ID
   */
  async getRecord<T = Record>(
    collection: string,
    id: string,
    expand?: string
  ): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      const queryParams = expand ? `?expand=${expand}` : '';
      const response = await fetch(
        `${this.baseUrl}/api/collections/${collection}/records/${id}${queryParams}`,
        { headers: this.getAuthHeaders() }
      );

      if (!response.ok) throw new Error(`Failed to fetch record: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Error fetching record:', error);
      return null;
    }
  }

  /**
   * Create a new record
   */
  async createRecord<T = Record>(
    collection: string,
    data: Partial<T>,
    files?: FileUpload[]
  ): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      let body: any;
      let headers: HeadersInit = {};

      if (files && files.length > 0) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        });
        files.forEach(({ field, file }) => {
          formData.append(field, file);
        });
        body = formData;
        // Don't set Content-Type for FormData, browser will set it with boundary
        if (this.authToken) {
          headers['Authorization'] = this.authToken;
        }
      } else {
        headers = this.getAuthHeaders();
        body = JSON.stringify(data);
      }

      const response = await fetch(
        `${this.baseUrl}/api/collections/${collection}/records`,
        {
          method: 'POST',
          headers,
          body
        }
      );

      if (!response.ok) throw new Error(`Failed to create record: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Error creating record:', error);
      return null;
    }
  }

  /**
   * Update an existing record
   */
  async updateRecord<T = Record>(
    collection: string,
    id: string,
    data: Partial<T>,
    files?: FileUpload[]
  ): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      let body: any;
      let headers: HeadersInit = {};

      if (files && files.length > 0) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
        });
        files.forEach(({ field, file }) => {
          formData.append(field, file);
        });
        body = formData;
        if (this.authToken) {
          headers['Authorization'] = this.authToken;
        }
      } else {
        headers = this.getAuthHeaders();
        body = JSON.stringify(data);
      }

      const response = await fetch(
        `${this.baseUrl}/api/collections/${collection}/records/${id}`,
        {
          method: 'PATCH',
          headers,
          body
        }
      );

      if (!response.ok) throw new Error(`Failed to update record: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Error updating record:', error);
      return null;
    }
  }

  /**
   * Delete a record
   */
  async deleteRecord(collection: string, id: string): Promise<boolean> {
    if (!this.isConfigured()) return false;

    try {
      const response = await fetch(
        `${this.baseUrl}/api/collections/${collection}/records/${id}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeaders()
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Error deleting record:', error);
      return false;
    }
  }

  // ==================== REALTIME ====================

  /**
   * Subscribe to realtime updates for a collection
   */
  subscribeToCollection(
    collection: string,
    callback: RealtimeCallback,
    filter?: string
  ): () => void {
    if (!this.isConfigured()) {
      console.error('PocketBase not configured');
      return () => {};
    }

    const wsUrl = this.baseUrl.replace(/^http/, 'ws') + '/api/realtime';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      // Subscribe to collection
      const subscribeMsg = {
        clientId: Math.random().toString(36).substring(7),
        subscriptions: filter
          ? [`${collection}?filter=${encodeURIComponent(filter)}`]
          : [collection]
      };
      ws.send(JSON.stringify(subscribeMsg));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.action && data.record) {
          callback(data as RealtimeMessage);
        }
      } catch (error) {
        console.error('Error parsing realtime message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.realtimeConnections.set(collection, ws);

    // Return unsubscribe function
    return () => {
      ws.close();
      this.realtimeConnections.delete(collection);
    };
  }

  /**
   * Unsubscribe from all realtime connections
   */
  unsubscribeAll(): void {
    this.realtimeConnections.forEach(ws => ws.close());
    this.realtimeConnections.clear();
  }

  // ==================== FILE STORAGE ====================

  /**
   * Get file URL
   */
  getFileUrl(record: Record, filename: string, queryParams?: Record<string, string>): string {
    if (!this.isConfigured()) return '';

    const params = queryParams
      ? '?' + new URLSearchParams(queryParams).toString()
      : '';

    return `${this.baseUrl}/api/files/${record.collectionId}/${record.id}/${filename}${params}`;
  }

  /**
   * Get file token for protected files
   */
  async getFileToken(collection: string, recordId: string): Promise<string | null> {
    if (!this.isConfigured()) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/api/files/token`,
        {
          method: 'POST',
          headers: this.getAuthHeaders()
        }
      );

      if (!response.ok) throw new Error(`Failed to get file token: ${response.status}`);

      const data = await response.json();
      return data.token;
    } catch (error) {
      console.error('Error getting file token:', error);
      return null;
    }
  }

  // ==================== ADMIN ====================

  /**
   * Authenticate as admin
   */
  async adminAuth(email: string, password: string): Promise<AdminAuth | null> {
    if (!this.isConfigured()) return null;

    try {
      const response = await fetch(
        `${this.baseUrl}/api/admins/auth-with-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identity: email, password })
        }
      );

      if (!response.ok) throw new Error(`Admin auth failed: ${response.status}`);

      const data: AdminAuth = await response.json();
      this.adminToken = data.token;
      localStorage.setItem('pocketbase_admin_token', data.token);

      return data;
    } catch (error) {
      console.error('Error authenticating admin:', error);
      return null;
    }
  }

  /**
   * Get request logs (admin only)
   */
  async getLogs(params?: {
    page?: number;
    perPage?: number;
    filter?: string;
  }): Promise<RecordListResult<LogRequest>> {
    if (!this.isConfigured()) {
      return { page: 1, perPage: 30, totalItems: 0, totalPages: 0, items: [] };
    }

    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.set('page', params.page.toString());
      if (params?.perPage) queryParams.set('perPage', params.perPage.toString());
      if (params?.filter) queryParams.set('filter', params.filter);

      const response = await fetch(
        `${this.baseUrl}/api/logs/requests?${queryParams}`,
        { headers: this.getAuthHeaders() }
      );

      if (!response.ok) throw new Error(`Failed to fetch logs: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error('Error fetching logs:', error);
      return { page: 1, perPage: 30, totalItems: 0, totalPages: 0, items: [] };
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ code: number; message: string; data: any }> {
    if (!this.isConfigured()) {
      return { code: 500, message: 'Not configured', data: {} };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      return { code: 500, message: 'Health check failed', data: {} };
    }
  }
}

// Export singleton instance
export const pocketBaseIntegration = new PocketBaseIntegrationService();
export default pocketBaseIntegration;
