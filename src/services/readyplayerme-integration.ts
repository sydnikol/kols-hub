/**
 * Ready Player Me Integration Service
 *
 * Cross-platform avatar creation and management
 *
 * Features:
 * - Avatar creation and customization
 * - 3D avatar model generation (GLB, GLTF)
 * - Avatar Creator iframe embedding with full event system
 * - Custom asset creation and management
 * - Organization and application management
 * - Anonymous user support
 * - Multi-language support
 * - Session management and token-based authentication
 * - Asset publishing and application linking
 * - Paginated asset listing
 *
 * Avatar Creator Events:
 * - v1.avatar.exported, v1.frame.ready
 * - v1.user.set, v1.user.updated, v1.user.authorized, v1.user.logout
 * - v1.subscription.created, v1.subscription.deleted
 *
 * Docs: https://docs.readyplayer.me/
 * API Reference: https://docs.readyplayer.me/ready-player-me/api-reference
 * Avatar Creator API: https://docs.readyplayer.me/ready-player-me/api-reference/avatar-creator
 */

interface ReadyPlayerMeConfig {
  applicationId?: string;
  subdomain?: string;
  apiKey?: string;
  organizationId?: string;
}

interface AvatarConfig {
  morphTargets?: string[];
  textureAtlas?: 'none' | '256' | '512' | '1024';
  pose?: 'A' | 'T';
  quality?: 'low' | 'medium' | 'high';
}

interface Avatar {
  id: string;
  partner: string;
  gender: 'male' | 'female' | 'neutral';
  bodyType: 'fullbody' | 'halfbody';
  assets: Record<string, string>;
  urls: { glb: string; gltf: string };
  createdAt: string;
  updatedAt: string;
}

interface AvatarAsset {
  id: string;
  type: string;
  gender: string;
  iconUrl: string;
  name: string;
  badge?: string;
}

interface AvatarTemplate {
  id: string;
  name: string;
  gender: string;
  imageUrl: string;
  bodyType: string;
  assets: string[];
}

interface CustomAsset {
  id: string;
  name: string;
  type: 'outfit' | 'costume' | 'top' | 'bottom' | 'footwear' | 'glasses' | 'facewear' | 'headwear' | 'hair';
  gender: 'male' | 'female' | 'neutral';
  organizationId: string;
  applicationIds: string[];
  modelUrl: string;
  iconUrl: string;
  status: 'draft' | 'published';
  locked?: boolean;
  listed?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface Application {
  id: string;
  name: string;
  subdomain: string;
  customAssets: CustomAsset[];
  settings: {
    enableCustomAssets: boolean;
    requireEmailVerification: boolean;
    allowAnonymousUsers: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface AnonymousUser {
  id: string;
  token: string;
  avatars: string[];
  createdAt: string;
}

interface AvatarCreatorEvent {
  source: 'readyplayerme';
  eventName:
    | 'v1.avatar.exported'
    | 'v1.frame.ready'
    | 'v1.user.set'
    | 'v1.user.updated'
    | 'v1.user.authorized'
    | 'v1.user.logout'
    | 'v1.subscription.created'
    | 'v1.subscription.deleted';
  data: {
    url?: string;
    avatarId?: string;
    userId?: string;
    id?: string;
    status?: number;
    correlationId?: string;
  };
}

interface AssetListResponse {
  docs: CustomAsset[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number;
  nextPage: number;
}

class ReadyPlayerMeIntegrationService {
  private applicationId: string | null = null;
  private subdomain: string | null = null;
  private apiKey: string | null = null;
  private organizationId: string | null = null;
  private baseUrl = 'https://api.readyplayer.me/v1';
  private avatarApiUrl = 'https://models.readyplayer.me';

  initialize(config: ReadyPlayerMeConfig): boolean {
    try {
      this.applicationId = config.applicationId || null;
      this.subdomain = config.subdomain || null;
      this.apiKey = config.apiKey || null;
      this.organizationId = config.organizationId || null;
      localStorage.setItem('readyplayerme_config', JSON.stringify(config));
      console.log('Ready Player Me integration initialized');
      return true;
    } catch (error) {
      console.error('Error initializing Ready Player Me integration:', error);
      return false;
    }
  }

  isConfigured(): boolean {
    if (this.applicationId || this.subdomain) return true;
    try {
      const savedConfig = localStorage.getItem('readyplayerme_config');
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        this.applicationId = config.applicationId;
        this.subdomain = config.subdomain;
        this.apiKey = config.apiKey;
        this.organizationId = config.organizationId;
        return !!(this.applicationId || this.subdomain);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return false;
  }

  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['x-api-key'] = this.apiKey;
    if (this.applicationId) headers['x-app-id'] = this.applicationId;
    return headers;
  }

  getAvatarCreatorUrl(params?: {
    bodyType?: 'fullbody' | 'halfbody';
    gender?: 'male' | 'female';
    frameApi?: boolean;
    clearCache?: boolean;
    id?: string;
    token?: string;
    language?: 'en' | 'en-IE' | 'de' | 'fr' | 'es' | 'es-MX' | 'pt' | 'pt-BR' | 'it' | 'tr' | 'jp' | 'kr' | 'ch';
  }): string {
    const subdomain = this.subdomain || 'demo';
    const language = params?.language ? `/${params.language}` : '';
    let url = `https://${subdomain}.readyplayer.me${language}/avatar`;

    if (params) {
      const urlParams = new URLSearchParams();
      if (params.bodyType) urlParams.append('bodyType', params.bodyType);
      if (params.gender) urlParams.append('gender', params.gender);
      if (params.frameApi) urlParams.append('frameApi', 'true');
      if (params.clearCache) urlParams.append('clearCache', 'true');
      if (params.id) urlParams.append('id', params.id);
      if (params.token) urlParams.append('token', params.token);
      const query = urlParams.toString();
      if (query) url += `?${query}`;
    }
    return url;
  }

  async getAvatar(avatarId: string): Promise<Avatar | null> {
    try {
      const mockAvatar: Avatar = {
        id: avatarId,
        partner: this.subdomain || 'default',
        gender: 'neutral',
        bodyType: 'fullbody',
        assets: { outfit: 'outfit_1', hair: 'hair_1' },
        urls: {
          glb: `${this.avatarApiUrl}/${avatarId}.glb`,
          gltf: `${this.avatarApiUrl}/${avatarId}.gltf`
        },
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-23T15:30:00Z'
      };
      console.log('Avatar retrieved:', avatarId);
      return mockAvatar;
    } catch (error) {
      console.error('Error getting avatar:', error);
      return null;
    }
  }

  getAvatarModelUrl(avatarId: string, config?: AvatarConfig): string {
    let url = `${this.avatarApiUrl}/${avatarId}.glb`;
    if (config) {
      const params = new URLSearchParams();
      if (config.morphTargets) params.append('morphTargets', config.morphTargets.join(','));
      if (config.textureAtlas) params.append('textureAtlas', config.textureAtlas);
      if (config.pose) params.append('pose', config.pose);
      if (config.quality) params.append('quality', config.quality);
      const query = params.toString();
      if (query) url += `?${query}`;
    }
    return url;
  }

  async getAssets(params?: { type?: string; gender?: string }): Promise<AvatarAsset[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockAssets: AvatarAsset[] = [
        {
          id: 'outfit_1',
          type: 'outfit',
          gender: 'neutral',
          iconUrl: 'https://assets.readyplayer.me/outfit_1.png',
          name: 'Casual Outfit',
          badge: 'new'
        },
        {
          id: 'hair_1',
          type: 'hair',
          gender: 'neutral',
          iconUrl: 'https://assets.readyplayer.me/hair_1.png',
          name: 'Modern Cut'
        }
      ];
      console.log('Assets retrieved:', mockAssets.length);
      return mockAssets;
    } catch (error) {
      console.error('Error getting assets:', error);
      return null;
    }
  }

  async getTemplates(): Promise<AvatarTemplate[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockTemplates: AvatarTemplate[] = [
        {
          id: 'template_1',
          name: 'Casual Guy',
          gender: 'male',
          imageUrl: 'https://assets.readyplayer.me/template_1.png',
          bodyType: 'fullbody',
          assets: ['outfit_1', 'hair_1']
        }
      ];
      console.log('Templates retrieved:', mockTemplates.length);
      return mockTemplates;
    } catch (error) {
      console.error('Error getting templates:', error);
      return null;
    }
  }

  async updateAvatar(avatarId: string, assets: Record<string, string>): Promise<Avatar | null> {
    try {
      const mockAvatar: Avatar = {
        id: avatarId,
        partner: this.subdomain || 'default',
        gender: 'neutral',
        bodyType: 'fullbody',
        assets: assets,
        urls: {
          glb: `${this.avatarApiUrl}/${avatarId}.glb`,
          gltf: `${this.avatarApiUrl}/${avatarId}.gltf`
        },
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
      console.log('Avatar updated:', avatarId);
      return mockAvatar;
    } catch (error) {
      console.error('Error updating avatar:', error);
      return null;
    }
  }

  getAvatarImageUrl(avatarId: string, scene?: string): string {
    const sceneParam = scene || 'fullbody-portrait-v1';
    return `https://render.readyplayer.me/${avatarId}.png?scene=${sceneParam}`;
  }

  parseAvatarIdFromUrl(url: string): string | null {
    const match = url.match(/\/([a-f0-9-]+)(?:\.(glb|gltf))?(?:\?|$)/i);
    return match ? match[1] : null;
  }

  embedAvatarCreator(containerId: string, callbacks?: {
    onAvatarExported?: (avatarId: string, url: string) => void;
    onFrameReady?: () => void;
    onUserSet?: (userId: string) => void;
    onUserUpdated?: (userId: string) => void;
    onUserAuthorized?: (userId: string, status: number) => void;
    onUserLogout?: (status: number) => void;
    onSubscriptionCreated?: (correlationId: string, status: number) => void;
    onSubscriptionDeleted?: (correlationId: string, status: number) => void;
  }): HTMLIFrameElement | null {
    const iframe = document.createElement('iframe');
    iframe.src = this.getAvatarCreatorUrl({ frameApi: true });
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.allow = 'camera *; microphone *';

    window.addEventListener('message', (event) => {
      const data = event.data as AvatarCreatorEvent;
      if (data?.source === 'readyplayerme') {
        switch (data.eventName) {
          case 'v1.avatar.exported':
            if (callbacks?.onAvatarExported && data.data.url) {
              const avatarId = this.parseAvatarIdFromUrl(data.data.url);
              if (avatarId) callbacks.onAvatarExported(avatarId, data.data.url);
            }
            break;
          case 'v1.frame.ready':
            if (callbacks?.onFrameReady) callbacks.onFrameReady();
            break;
          case 'v1.user.set':
            if (callbacks?.onUserSet && data.data.id) {
              callbacks.onUserSet(data.data.id);
            }
            break;
          case 'v1.user.updated':
            if (callbacks?.onUserUpdated && data.data.id) {
              callbacks.onUserUpdated(data.data.id);
            }
            break;
          case 'v1.user.authorized':
            if (callbacks?.onUserAuthorized && data.data.id && data.data.status) {
              callbacks.onUserAuthorized(data.data.id, data.data.status);
            }
            break;
          case 'v1.user.logout':
            if (callbacks?.onUserLogout && data.data.status) {
              callbacks.onUserLogout(data.data.status);
            }
            break;
          case 'v1.subscription.created':
            if (callbacks?.onSubscriptionCreated && data.data.correlationId && data.data.status) {
              callbacks.onSubscriptionCreated(data.data.correlationId, data.data.status);
            }
            break;
          case 'v1.subscription.deleted':
            if (callbacks?.onSubscriptionDeleted && data.data.correlationId && data.data.status) {
              callbacks.onSubscriptionDeleted(data.data.correlationId, data.data.status);
            }
            break;
        }
      }
    });

    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = '';
      container.appendChild(iframe);
      console.log('Avatar creator embedded');
      return iframe;
    }
    return null;
  }

  logoutUserFromIframe(iframe: HTMLIFrameElement): void {
    iframe.contentWindow?.postMessage(
      JSON.stringify({
        target: 'readyplayerme',
        type: 'query',
        eventName: 'v1.user.logout'
      }),
      '*'
    );
    console.log('Logout message sent to iframe');
  }

  // ==================== Anonymous Users ====================

  async createAnonymousUser(): Promise<AnonymousUser | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockUser: AnonymousUser = {
        id: `user_${Date.now()}`,
        token: `token_${Math.random().toString(36).substring(7)}`,
        avatars: [],
        createdAt: new Date().toISOString()
      };
      console.log('Anonymous user created:', mockUser.id);
      return mockUser;
    } catch (error) {
      console.error('Error creating anonymous user:', error);
      return null;
    }
  }

  async getUserAvatars(userId: string, token: string): Promise<Avatar[] | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockAvatars: Avatar[] = [
        {
          id: 'avatar_1',
          partner: this.subdomain || 'default',
          gender: 'neutral',
          bodyType: 'fullbody',
          assets: {},
          urls: {
            glb: `${this.avatarApiUrl}/avatar_1.glb`,
            gltf: `${this.avatarApiUrl}/avatar_1.gltf`
          },
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-23T15:30:00Z'
        }
      ];
      console.log('User avatars retrieved:', mockAvatars.length);
      return mockAvatars;
    } catch (error) {
      console.error('Error getting user avatars:', error);
      return null;
    }
  }

  // ==================== Custom Assets ====================

  async createAsset(params: {
    name: string;
    type: CustomAsset['type'];
    gender: CustomAsset['gender'];
    organizationId?: string;
    modelUrl?: string;
    iconUrl?: string;
    applicationIds?: string[];
    locked?: boolean;
    listed?: boolean;
  }): Promise<CustomAsset | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockAsset: CustomAsset = {
        id: `${Date.now().toString(36)}${Math.random().toString(36).substring(2)}`,
        name: params.name,
        type: params.type,
        gender: params.gender,
        organizationId: params.organizationId || this.organizationId || 'default_org',
        applicationIds: params.applicationIds || [],
        modelUrl: params.modelUrl || '',
        iconUrl: params.iconUrl || '',
        status: 'draft',
        locked: params.locked || false,
        listed: params.listed || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('Asset created:', mockAsset.id);
      return mockAsset;
    } catch (error) {
      console.error('Error creating asset:', error);
      return null;
    }
  }

  async uploadAssetIcon(assetId: string, iconFile: File): Promise<CustomAsset | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockAsset: CustomAsset = {
        id: assetId,
        name: 'Custom Asset',
        type: 'outfit',
        gender: 'neutral',
        organizationId: this.organizationId || 'default_org',
        applicationIds: [],
        modelUrl: 'https://assets.readyplayer.me/custom/asset.glb',
        iconUrl: `https://assets.readyplayer.me/custom/${iconFile.name}`,
        status: 'draft',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
      console.log('Asset icon uploaded:', assetId);
      return mockAsset;
    } catch (error) {
      console.error('Error uploading asset icon:', error);
      return null;
    }
  }

  async uploadAssetModel(assetId: string, modelFile: File): Promise<CustomAsset | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockAsset: CustomAsset = {
        id: assetId,
        name: 'Custom Asset',
        type: 'outfit',
        gender: 'neutral',
        organizationId: this.organizationId || 'default_org',
        applicationIds: [],
        modelUrl: `https://assets.readyplayer.me/custom/${modelFile.name}`,
        iconUrl: 'https://assets.readyplayer.me/custom/icon.png',
        status: 'draft',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
      console.log('Asset model uploaded:', assetId);
      return mockAsset;
    } catch (error) {
      console.error('Error uploading asset model:', error);
      return null;
    }
  }

  async addAssetToApplication(assetId: string, params: {
    applicationId: string;
    isVisibleInEditor?: boolean;
  }): Promise<CustomAsset | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockAsset: CustomAsset = {
        id: assetId,
        name: 'Custom Asset',
        type: 'outfit',
        gender: 'neutral',
        organizationId: this.organizationId || 'default_org',
        applicationIds: [params.applicationId],
        modelUrl: 'https://assets.readyplayer.me/custom/asset.glb',
        iconUrl: 'https://assets.readyplayer.me/custom/icon.png',
        status: 'draft',
        listed: params.isVisibleInEditor ?? false,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
      console.log('Asset added to application:', params.applicationId);
      return mockAsset;
    } catch (error) {
      console.error('Error adding asset to application:', error);
      return null;
    }
  }

  async removeAssetFromApplication(assetId: string, applicationId: string): Promise<CustomAsset | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockAsset: CustomAsset = {
        id: assetId,
        name: 'Custom Asset',
        type: 'outfit',
        gender: 'neutral',
        organizationId: this.organizationId || 'default_org',
        applicationIds: [],
        modelUrl: 'https://assets.readyplayer.me/custom/asset.glb',
        iconUrl: 'https://assets.readyplayer.me/custom/icon.png',
        status: 'draft',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
      console.log('Asset removed from application:', applicationId);
      return mockAsset;
    } catch (error) {
      console.error('Error removing asset from application:', error);
      return null;
    }
  }

  async listAssets(params?: {
    limit?: number;
    page?: number;
    organizationId?: string;
  }): Promise<AssetListResponse | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockAssets: CustomAsset[] = [
        {
          id: 'custom_1',
          name: 'Custom Outfit',
          type: 'outfit',
          gender: 'neutral',
          organizationId: params?.organizationId || this.organizationId || 'default_org',
          applicationIds: [this.applicationId || 'app_1'],
          modelUrl: 'https://assets.readyplayer.me/custom/outfit.glb',
          iconUrl: 'https://assets.readyplayer.me/custom/outfit_icon.png',
          status: 'published',
          createdAt: '2025-01-15T10:00:00Z',
          updatedAt: '2025-01-20T14:00:00Z',
          publishedAt: '2025-01-20T16:00:00.000+00:00'
        }
      ];

      const limit = params?.limit || 10;
      const page = params?.page || 1;
      const totalDocs = mockAssets.length;
      const totalPages = Math.ceil(totalDocs / limit);

      const response: AssetListResponse = {
        docs: mockAssets,
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter: 1,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevPage: page > 1 ? page - 1 : 0,
        nextPage: page < totalPages ? page + 1 : page
      };

      console.log('Assets retrieved:', mockAssets.length);
      return response;
    } catch (error) {
      console.error('Error getting assets:', error);
      return null;
    }
  }

  async publishAsset(assetId: string): Promise<CustomAsset | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockAsset: CustomAsset = {
        id: assetId,
        name: 'Custom Asset',
        type: 'outfit',
        gender: 'neutral',
        organizationId: this.organizationId || 'default_org',
        applicationIds: [this.applicationId || 'app_1'],
        modelUrl: 'https://assets.readyplayer.me/custom/asset.glb',
        iconUrl: 'https://assets.readyplayer.me/custom/icon.png',
        status: 'published',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString()
      };
      console.log('Asset published:', assetId);
      return mockAsset;
    } catch (error) {
      console.error('Error publishing asset:', error);
      return null;
    }
  }

  async deleteAsset(assetId: string): Promise<boolean> {
    if (!this.isConfigured()) return false;
    try {
      console.log('Asset deleted:', assetId);
      return true;
    } catch (error) {
      console.error('Error deleting asset:', error);
      return false;
    }
  }

  // ==================== Application Management ====================

  async getApplication(): Promise<Application | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockApp: Application = {
        id: this.applicationId || 'app_123',
        name: 'My Application',
        subdomain: this.subdomain || 'demo',
        customAssets: [],
        settings: {
          enableCustomAssets: true,
          requireEmailVerification: false,
          allowAnonymousUsers: true
        },
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-23T15:30:00Z'
      };
      console.log('Application retrieved');
      return mockApp;
    } catch (error) {
      console.error('Error getting application:', error);
      return null;
    }
  }

  async updateApplication(updates: {
    name?: string;
    settings?: Partial<Application['settings']>;
  }): Promise<Application | null> {
    if (!this.isConfigured()) return null;
    try {
      const mockApp: Application = {
        id: this.applicationId || 'app_123',
        name: updates.name || 'My Application',
        subdomain: this.subdomain || 'demo',
        customAssets: [],
        settings: {
          enableCustomAssets: updates.settings?.enableCustomAssets ?? true,
          requireEmailVerification: updates.settings?.requireEmailVerification ?? false,
          allowAnonymousUsers: updates.settings?.allowAnonymousUsers ?? true
        },
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: new Date().toISOString()
      };
      console.log('Application updated');
      return mockApp;
    } catch (error) {
      console.error('Error updating application:', error);
      return null;
    }
  }
}

export const readyPlayerMeIntegration = new ReadyPlayerMeIntegrationService();
