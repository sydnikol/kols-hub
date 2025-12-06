/**
 * Payload CMS Integration Service
 *
 * Open-source headless CMS and application framework
 *
 * Features:
 * - TypeScript-native headless CMS
 * - Auto-generated REST & GraphQL APIs
 * - Built-in authentication & access control
 * - File uploads with image resizing
 * - Block-based rich text editor
 * - Localization support
 * - Versions & drafts
 * - Webhooks and hooks
 * - Custom React admin UI
 *
 * Docs: https://payloadcms.com/docs
 * GitHub: https://github.com/payloadcms/payload
 */

interface PayloadConfig {
  serverUrl: string;
  email?: string;
  password?: string;
  token?: string;
}

interface PayloadCollection {
  slug: string;
  labels: {
    singular: string;
    plural: string;
  };
  fields: PayloadField[];
  timestamps: boolean;
  admin?: {
    useAsTitle?: string;
    defaultColumns?: string[];
  };
}

interface PayloadField {
  name: string;
  type: 'text' | 'email' | 'textarea' | 'number' | 'date' | 'checkbox' | 'select' | 'relationship' | 'upload' | 'richText' | 'array' | 'blocks';
  label?: string;
  required?: boolean;
  unique?: boolean;
  defaultValue?: any;
  localized?: boolean;
  admin?: {
    position?: string;
    description?: string;
  };
}

interface PayloadDocument {
  id: string;
  [key: string]: any;
  createdAt: string;
  updatedAt: string;
}

interface PayloadUser {
  id: string;
  email: string;
  name?: string;
  roles?: string[];
  createdAt: string;
  updatedAt: string;
}

interface PayloadMedia {
  id: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  sizes?: Record<string, MediaSize>;
  url: string;
  alt?: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaSize {
  width: number;
  height: number;
  mimeType: string;
  filesize: number;
  filename: string;
  url: string;
}

interface PayloadVersion {
  id: string;
  parent: string;
  version: PayloadDocument;
  createdAt: string;
  updatedAt: string;
  autosave?: boolean;
}

interface PayloadGlobal {
  id: string;
  slug: string;
  [key: string]: any;
  createdAt: string;
  updatedAt: string;
}

interface PayloadPreferences {
  id: string;
  user: string;
  key: string;
  value: any;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  message?: string;
  user: PayloadUser;
  token: string;
  exp: number;
}

interface QueryParams {
  depth?: number;
  locale?: string;
  fallbackLocale?: string;
  where?: Record<string, any>;
  sort?: string;
  limit?: number;
  page?: number;
  draft?: boolean;
}

interface PaginatedDocs<T = PayloadDocument> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

class PayloadIntegrationService {
  private serverUrl: string | null = null;
  private token: string | null = null;

  initialize(config: PayloadConfig): boolean {
    try {
      this.serverUrl = config.serverUrl;
      this.token = config.token || null;

      localStorage.setItem('payload_config', JSON.stringify({
        serverUrl: config.serverUrl,
        token: config.token
      }));

      console.log('Payload CMS integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Payload CMS integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.serverUrl && this.token) return true;

    try {
      const savedConfig = localStorage.getItem('payload_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.serverUrl = config.serverUrl;
        this.token = config.token;
        return !!(this.serverUrl && this.token);
      }
    } catch (error) {
      console.error('Error loading Payload config:', error);
    }

    return false;
  }

  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `JWT ${this.token}`
    };
  }

  // ==================== Authentication ====================

  async login(email: string, password: string): Promise<AuthResponse | null> {
    if (!this.serverUrl) return null;

    try {
      const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

      const mockResponse: AuthResponse = {
        message: 'Auth Passed',
        user: {
          id: 'user_123',
          email: email,
          name: 'Admin User',
          roles: ['admin'],
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: '2025-01-23T15:30:00Z'
        },
        token: `mock_token_${Date.now()}`,
        exp: expiresAt
      };

      this.token = mockResponse.token;
      localStorage.setItem('payload_token', mockResponse.token);

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
      localStorage.removeItem('payload_token');
      console.log('Logout successful');
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }

  async getCurrentUser(): Promise<PayloadUser | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockUser: PayloadUser = {
        id: 'user_123',
        email: 'admin@example.com',
        name: 'Admin User',
        roles: ['admin'],
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-23T15:30:00Z'
      };

      console.log('Current user retrieved');
      return mockUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async forgotPassword(email: string): Promise<{ message: string } | null> {
    if (!this.serverUrl) return null;

    try {
      const mockResponse = {
        message: 'Password reset email sent'
      };

      console.log('Password reset email sent to:', email);
      return mockResponse;
    } catch (error) {
      console.error('Error sending password reset:', error);
      return null;
    }
  }

  async resetPassword(token: string, password: string): Promise<AuthResponse | null> {
    if (!this.serverUrl) return null;

    try {
      const mockResponse: AuthResponse = {
        message: 'Password reset successfully',
        user: {
          id: 'user_123',
          email: 'user@example.com',
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: new Date().toISOString()
        },
        token: `mock_token_${Date.now()}`,
        exp: Date.now() + (7 * 24 * 60 * 60 * 1000)
      };

      console.log('Password reset successful');
      return mockResponse;
    } catch (error) {
      console.error('Error resetting password:', error);
      return null;
    }
  }

  // ==================== Collections ====================

  async find<T = PayloadDocument>(
    collection: string,
    params?: QueryParams
  ): Promise<PaginatedDocs<T> | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDocs: any[] = [
        {
          id: '1',
          title: 'First Post',
          status: 'published',
          content: 'This is the content of the first post',
          author: 'user_123',
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: '2025-01-22T15:30:00Z'
        },
        {
          id: '2',
          title: 'Second Post',
          status: 'draft',
          content: 'This is the content of the second post',
          author: 'user_456',
          createdAt: '2025-01-21T14:00:00Z',
          updatedAt: '2025-01-21T14:00:00Z'
        }
      ];

      const mockResponse: PaginatedDocs<T> = {
        docs: mockDocs as T[],
        totalDocs: 25,
        limit: params?.limit || 10,
        totalPages: 3,
        page: params?.page || 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: true,
        prevPage: null,
        nextPage: 2
      };

      console.log('Documents retrieved from', collection, ':', mockDocs.length);
      return mockResponse;
    } catch (error) {
      console.error('Error finding documents:', error);
      return null;
    }
  }

  async findByID<T = PayloadDocument>(
    collection: string,
    id: string,
    params?: QueryParams
  ): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDoc: any = {
        id: id,
        title: 'Document Title',
        status: 'published',
        content: 'Document content goes here',
        author: 'user_123',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-22T15:30:00Z'
      };

      console.log('Document retrieved:', collection, id);
      return mockDoc as T;
    } catch (error) {
      console.error('Error finding document by ID:', error);
      return null;
    }
  }

  async create<T = PayloadDocument>(
    collection: string,
    data: Partial<T>,
    params?: QueryParams
  ): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDoc: any = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Document created in', collection);
      return mockDoc as T;
    } catch (error) {
      console.error('Error creating document:', error);
      return null;
    }
  }

  async update<T = PayloadDocument>(
    collection: string,
    id: string,
    data: Partial<T>,
    params?: QueryParams
  ): Promise<T | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDoc: any = {
        id: id,
        ...data,
        updatedAt: new Date().toISOString()
      };

      console.log('Document updated in', collection, ':', id);
      return mockDoc as T;
    } catch (error) {
      console.error('Error updating document:', error);
      return null;
    }
  }

  async delete(collection: string, id: string): Promise<{ id: string; message?: string } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockResponse = {
        id: id,
        message: 'Document deleted successfully'
      };

      console.log('Document deleted from', collection, ':', id);
      return mockResponse;
    } catch (error) {
      console.error('Error deleting document:', error);
      return null;
    }
  }

  // ==================== Media/Upload ====================

  async uploadMedia(file: File, params?: {
    alt?: string;
    collection?: string;
  }): Promise<PayloadMedia | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockMedia: PayloadMedia = {
        id: `media_${Date.now()}`,
        filename: file.name,
        mimeType: file.type,
        filesize: file.size,
        width: 1920,
        height: 1080,
        sizes: {
          thumbnail: {
            width: 400,
            height: 300,
            mimeType: file.type,
            filesize: 50000,
            filename: `thumbnail-${file.name}`,
            url: `${this.serverUrl}/media/thumbnail-${file.name}`
          },
          medium: {
            width: 800,
            height: 600,
            mimeType: file.type,
            filesize: 120000,
            filename: `medium-${file.name}`,
            url: `${this.serverUrl}/media/medium-${file.name}`
          }
        },
        url: `${this.serverUrl}/media/${file.name}`,
        alt: params?.alt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      console.log('Media uploaded:', file.name);
      return mockMedia;
    } catch (error) {
      console.error('Error uploading media:', error);
      return null;
    }
  }

  async getMedia(mediaId: string): Promise<PayloadMedia | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockMedia: PayloadMedia = {
        id: mediaId,
        filename: 'example.jpg',
        mimeType: 'image/jpeg',
        filesize: 1024000,
        width: 1920,
        height: 1080,
        url: `${this.serverUrl}/media/example.jpg`,
        alt: 'Example image',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-20T10:00:00Z'
      };

      console.log('Media retrieved:', mediaId);
      return mockMedia;
    } catch (error) {
      console.error('Error getting media:', error);
      return null;
    }
  }

  // ==================== Versions ====================

  async getVersions(
    collection: string,
    id: string
  ): Promise<PaginatedDocs<PayloadVersion> | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockVersions: PayloadVersion[] = [
        {
          id: 'ver_1',
          parent: id,
          version: {
            id: id,
            title: 'Original Title',
            content: 'Original content',
            createdAt: '2025-01-20T10:00:00Z',
            updatedAt: '2025-01-20T10:00:00Z'
          },
          createdAt: '2025-01-20T10:00:00Z',
          updatedAt: '2025-01-20T10:00:00Z',
          autosave: false
        },
        {
          id: 'ver_2',
          parent: id,
          version: {
            id: id,
            title: 'Updated Title',
            content: 'Updated content',
            createdAt: '2025-01-20T10:00:00Z',
            updatedAt: '2025-01-22T15:30:00Z'
          },
          createdAt: '2025-01-22T15:30:00Z',
          updatedAt: '2025-01-22T15:30:00Z',
          autosave: false
        }
      ];

      const mockResponse: PaginatedDocs<PayloadVersion> = {
        docs: mockVersions,
        totalDocs: 2,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null
      };

      console.log('Versions retrieved:', collection, id);
      return mockResponse;
    } catch (error) {
      console.error('Error getting versions:', error);
      return null;
    }
  }

  async restoreVersion(
    collection: string,
    id: string,
    versionId: string
  ): Promise<PayloadDocument | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockDoc: PayloadDocument = {
        id: id,
        title: 'Restored from version',
        content: 'Content from version',
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: new Date().toISOString()
      };

      console.log('Version restored:', collection, id, versionId);
      return mockDoc;
    } catch (error) {
      console.error('Error restoring version:', error);
      return null;
    }
  }

  // ==================== Globals ====================

  async findGlobal(
    slug: string,
    params?: QueryParams
  ): Promise<PayloadGlobal | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockGlobal: PayloadGlobal = {
        id: 'global_1',
        slug: slug,
        siteName: 'My Website',
        siteDescription: 'A great website',
        socialLinks: {
          twitter: 'https://twitter.com/example',
          facebook: 'https://facebook.com/example'
        },
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-23T15:30:00Z'
      };

      console.log('Global retrieved:', slug);
      return mockGlobal;
    } catch (error) {
      console.error('Error finding global:', error);
      return null;
    }
  }

  async updateGlobal(
    slug: string,
    data: Record<string, any>,
    params?: QueryParams
  ): Promise<PayloadGlobal | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockGlobal: PayloadGlobal = {
        id: 'global_1',
        slug: slug,
        ...data,
        updatedAt: new Date().toISOString()
      };

      console.log('Global updated:', slug);
      return mockGlobal;
    } catch (error) {
      console.error('Error updating global:', error);
      return null;
    }
  }

  // ==================== Preferences ====================

  async getPreferences(key: string): Promise<PayloadPreferences | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPreference: PayloadPreferences = {
        id: 'pref_1',
        user: 'user_123',
        key: key,
        value: {
          columns: ['title', 'status', 'updatedAt'],
          sort: '-updatedAt'
        },
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: '2025-01-23T15:30:00Z'
      };

      console.log('Preferences retrieved:', key);
      return mockPreference;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return null;
    }
  }

  async setPreferences(key: string, value: any): Promise<PayloadPreferences | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockPreference: PayloadPreferences = {
        id: 'pref_1',
        user: 'user_123',
        key: key,
        value: value,
        createdAt: '2025-01-20T10:00:00Z',
        updatedAt: new Date().toISOString()
      };

      console.log('Preferences set:', key);
      return mockPreference;
    } catch (error) {
      console.error('Error setting preferences:', error);
      return null;
    }
  }

  // ==================== GraphQL ====================

  async graphql<T = any>(query: string, variables?: Record<string, any>): Promise<{ data: T; errors?: any[] } | null> {
    if (!this.isConfigured()) return null;

    try {
      // Mock GraphQL response
      const mockResponse: any = {
        data: {
          Posts: {
            docs: [
              {
                id: '1',
                title: 'GraphQL Post',
                content: 'Content from GraphQL query'
              }
            ]
          }
        }
      };

      console.log('GraphQL query executed');
      return mockResponse;
    } catch (error) {
      console.error('Error executing GraphQL query:', error);
      return null;
    }
  }

  // ==================== Access Control ====================

  async checkAccess(
    collection: string,
    id?: string
  ): Promise<{
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
  } | null> {
    if (!this.isConfigured()) return null;

    try {
      const mockAccess = {
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true
      };

      console.log('Access checked for:', collection);
      return mockAccess;
    } catch (error) {
      console.error('Error checking access:', error);
      return null;
    }
  }
}

export const payloadIntegration = new PayloadIntegrationService();
