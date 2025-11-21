/**
 * Comprehensive Google Sync Service
 * Handles OAuth 2.0 authentication and syncing for:
 * - Google Photos
 * - Google Calendar
 * - Google Drive (backups)
 * - Google Home/Hub integration
 *
 * Works on both web and mobile (Capacitor) platforms
 */

import { Capacitor } from '@capacitor/core';

// Types
export interface GoogleAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  scopes: string[];
}

export interface GoogleTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  tokenType: string;
  scope: string;
}

export interface GoogleAuthResult {
  success: boolean;
  tokens?: GoogleTokens;
  error?: string;
}

export interface GoogleSyncStatus {
  photos: boolean;
  calendar: boolean;
  drive: boolean;
  lastSynced: {
    photos?: Date;
    calendar?: Date;
    drive?: Date;
  };
}

class GoogleSyncService {
  private readonly STORAGE_KEY_PREFIX = 'google_';
  private readonly TOKEN_STORAGE_KEY = 'google_tokens';
  private readonly SYNC_STATUS_KEY = 'google_sync_status';

  // Google OAuth endpoints
  private readonly AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly TOKEN_URL = 'https://oauth2.googleapis.com/token';
  private readonly REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

  // API endpoints
  private readonly PHOTOS_API = 'https://photoslibrary.googleapis.com/v1';
  private readonly CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
  private readonly DRIVE_API = 'https://www.googleapis.com/drive/v3';

  // Configuration
  private config: GoogleAuthConfig | null = null;
  private tokens: GoogleTokens | null = null;

  /**
   * Initialize the Google Sync Service
   */
  async initialize(config: Partial<GoogleAuthConfig> = {}): Promise<void> {
    // Get client ID from environment or config
    const clientId = config.clientId ||
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      'YOUR_GOOGLE_CLIENT_ID';

    // Determine redirect URI based on platform
    const redirectUri = config.redirectUri || this.getRedirectUri();

    // Default scopes for comprehensive access
    const scopes = config.scopes || [
      'https://www.googleapis.com/auth/photoslibrary.readonly',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];

    this.config = {
      clientId,
      clientSecret: config.clientSecret,
      redirectUri,
      scopes
    };

    // Try to load existing tokens
    await this.loadTokens();
  }

  /**
   * Get the appropriate redirect URI based on platform
   */
  private getRedirectUri(): string {
    if (Capacitor.isNativePlatform()) {
      // For mobile, use custom scheme
      return 'com.unified.megaapp://oauth/google';
    } else {
      // For web
      return `${window.location.origin}/auth/google/callback`;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    if (!this.tokens) {
      await this.loadTokens();
    }

    if (!this.tokens) {
      return false;
    }

    // Check if token is expired
    if (Date.now() >= this.tokens.expiresAt) {
      // Try to refresh
      return await this.refreshAccessToken();
    }

    return true;
  }

  /**
   * Start OAuth flow
   */
  async authenticate(): Promise<GoogleAuthResult> {
    if (!this.config) {
      throw new Error('Google Sync Service not initialized. Call initialize() first.');
    }

    try {
      if (Capacitor.isNativePlatform()) {
        return await this.authenticateMobile();
      } else {
        return await this.authenticateWeb();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    }
  }

  /**
   * Authenticate on web platform
   */
  private async authenticateWeb(): Promise<GoogleAuthResult> {
    if (!this.config) {
      throw new Error('Config not initialized');
    }

    // Build auth URL
    const authUrl = new URL(this.AUTH_URL);
    authUrl.searchParams.set('client_id', this.config.clientId);
    authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', this.config.scopes.join(' '));
    authUrl.searchParams.set('access_type', 'offline'); // Get refresh token
    authUrl.searchParams.set('prompt', 'consent'); // Force consent to get refresh token

    // Open popup or redirect
    return new Promise((resolve) => {
      // Create popup window
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        authUrl.toString(),
        'Google OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for message from callback
      const messageHandler = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'google-oauth-callback') {
          window.removeEventListener('message', messageHandler);
          popup?.close();

          if (event.data.code) {
            // Exchange code for tokens
            const result = await this.exchangeCodeForTokens(event.data.code);
            resolve(result);
          } else {
            resolve({
              success: false,
              error: event.data.error || 'Authentication cancelled'
            });
          }
        }
      };

      window.addEventListener('message', messageHandler);

      // Check if popup was blocked
      if (!popup || popup.closed) {
        window.removeEventListener('message', messageHandler);
        resolve({
          success: false,
          error: 'Popup was blocked. Please allow popups for this site.'
        });
      }

      // Poll for popup close
      const pollTimer = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(pollTimer);
          window.removeEventListener('message', messageHandler);
          resolve({
            success: false,
            error: 'Authentication cancelled'
          });
        }
      }, 1000);
    });
  }

  /**
   * Authenticate on mobile platform using Capacitor Browser
   */
  private async authenticateMobile(): Promise<GoogleAuthResult> {
    if (!this.config) {
      throw new Error('Config not initialized');
    }

    try {
      // Try to import Browser plugin
      const { Browser } = await import('@capacitor/browser');

      // Build auth URL
      const authUrl = new URL(this.AUTH_URL);
      authUrl.searchParams.set('client_id', this.config.clientId);
      authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', this.config.scopes.join(' '));
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');

      // Open browser for authentication
      await Browser.open({
        url: authUrl.toString(),
        windowName: '_self'
      });

      // Listen for app URL (deep link callback)
      return new Promise((resolve) => {
        const handleUrl = async (event: any) => {
          const url = event.url;

          if (url.startsWith(this.config!.redirectUri)) {
            // Parse callback URL
            const urlObj = new URL(url);
            const code = urlObj.searchParams.get('code');
            const error = urlObj.searchParams.get('error');

            // Close browser
            await Browser.close();

            if (error) {
              resolve({
                success: false,
                error: error
              });
            } else if (code) {
              // Exchange code for tokens
              const result = await this.exchangeCodeForTokens(code);
              resolve(result);
            } else {
              resolve({
                success: false,
                error: 'No authorization code received'
              });
            }
          }
        };

        // Add listener for URL events (App plugin)
        import('@capacitor/app').then(({ App }) => {
          App.addListener('appUrlOpen', handleUrl);
        });
      });
    } catch (error) {
      console.error('Mobile auth error:', error);
      return {
        success: false,
        error: 'Browser plugin not available. Please install @capacitor/browser'
      };
    }
  }

  /**
   * Exchange authorization code for tokens
   */
  private async exchangeCodeForTokens(code: string): Promise<GoogleAuthResult> {
    if (!this.config) {
      throw new Error('Config not initialized');
    }

    try {
      const response = await fetch(this.TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret || '',
          redirect_uri: this.config.redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Token exchange failed');
      }

      const data = await response.json();

      // Store tokens
      this.tokens = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
        tokenType: data.token_type,
        scope: data.scope,
      };

      await this.saveTokens();

      return {
        success: true,
        tokens: this.tokens,
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Token exchange failed',
      };
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    if (!this.tokens?.refreshToken || !this.config) {
      return false;
    }

    try {
      const response = await fetch(this.TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: this.tokens.refreshToken,
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret || '',
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      // Update tokens
      this.tokens = {
        ...this.tokens,
        accessToken: data.access_token,
        expiresAt: Date.now() + (data.expires_in * 1000),
        scope: data.scope || this.tokens.scope,
      };

      await this.saveTokens();
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear invalid tokens
      this.tokens = null;
      await this.clearTokens();
      return false;
    }
  }

  /**
   * Revoke access and sign out
   */
  async signOut(): Promise<void> {
    if (this.tokens?.accessToken) {
      try {
        await fetch(`${this.REVOKE_URL}?token=${this.tokens.accessToken}`, {
          method: 'POST',
        });
      } catch (error) {
        console.error('Token revocation error:', error);
      }
    }

    this.tokens = null;
    await this.clearTokens();
  }

  /**
   * Get current access token (auto-refresh if needed)
   */
  async getAccessToken(): Promise<string | null> {
    if (!await this.isAuthenticated()) {
      return null;
    }
    return this.tokens?.accessToken || null;
  }

  /**
   * Make authenticated API request
   */
  private async apiRequest<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken();

    if (!token) {
      throw new Error('Not authenticated. Please authenticate first.');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API request failed: ${response.status}`);
    }

    return await response.json();
  }

  // ========================================
  // GOOGLE PHOTOS METHODS
  // ========================================

  /**
   * Sync photos from Google Photos
   */
  async syncPhotos(options: {
    albumId?: string;
    maxResults?: number;
    filters?: {
      contentCategories?: string[];
      dateRange?: { startDate: Date; endDate: Date };
    };
  } = {}): Promise<any[]> {
    try {
      const maxResults = options.maxResults || 50;
      const body: any = {
        pageSize: maxResults,
      };

      if (options.filters) {
        body.filters = {};

        if (options.filters.contentCategories) {
          body.filters.contentFilter = {
            includedContentCategories: options.filters.contentCategories,
          };
        }

        if (options.filters.dateRange) {
          body.filters.dateFilter = {
            ranges: [{
              startDate: {
                year: options.filters.dateRange.startDate.getFullYear(),
                month: options.filters.dateRange.startDate.getMonth() + 1,
                day: options.filters.dateRange.startDate.getDate(),
              },
              endDate: {
                year: options.filters.dateRange.endDate.getFullYear(),
                month: options.filters.dateRange.endDate.getMonth() + 1,
                day: options.filters.dateRange.endDate.getDate(),
              },
            }],
          };
        }
      }

      if (options.albumId) {
        body.albumId = options.albumId;
      }

      const data = await this.apiRequest(`${this.PHOTOS_API}/mediaItems:search`, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      await this.updateSyncStatus('photos');
      return data.mediaItems || [];
    } catch (error) {
      console.error('Photo sync error:', error);
      throw error;
    }
  }

  /**
   * Get list of albums
   */
  async getPhotoAlbums(): Promise<any[]> {
    try {
      const data = await this.apiRequest(`${this.PHOTOS_API}/albums`);
      return data.albums || [];
    } catch (error) {
      console.error('Get albums error:', error);
      throw error;
    }
  }

  // ========================================
  // GOOGLE CALENDAR METHODS
  // ========================================

  /**
   * Sync calendar events
   */
  async syncCalendarEvents(options: {
    calendarId?: string;
    timeMin?: Date;
    timeMax?: Date;
    maxResults?: number;
  } = {}): Promise<any[]> {
    try {
      const calendarId = options.calendarId || 'primary';
      const timeMin = options.timeMin || new Date();
      const timeMax = options.timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      const maxResults = options.maxResults || 50;

      const url = new URL(`${this.CALENDAR_API}/calendars/${calendarId}/events`);
      url.searchParams.set('timeMin', timeMin.toISOString());
      url.searchParams.set('timeMax', timeMax.toISOString());
      url.searchParams.set('maxResults', maxResults.toString());
      url.searchParams.set('singleEvents', 'true');
      url.searchParams.set('orderBy', 'startTime');

      const data = await this.apiRequest(url.toString());

      await this.updateSyncStatus('calendar');
      return data.items || [];
    } catch (error) {
      console.error('Calendar sync error:', error);
      throw error;
    }
  }

  /**
   * Create calendar event
   */
  async createCalendarEvent(event: {
    summary: string;
    description?: string;
    start: Date;
    end: Date;
    location?: string;
    attendees?: string[];
    reminders?: { minutes: number }[];
  }): Promise<any> {
    try {
      const eventData: any = {
        summary: event.summary,
        description: event.description,
        location: event.location,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      if (event.attendees) {
        eventData.attendees = event.attendees.map(email => ({ email }));
      }

      if (event.reminders) {
        eventData.reminders = {
          useDefault: false,
          overrides: event.reminders.map(r => ({
            method: 'popup',
            minutes: r.minutes,
          })),
        };
      }

      return await this.apiRequest(`${this.CALENDAR_API}/calendars/primary/events`, {
        method: 'POST',
        body: JSON.stringify(eventData),
      });
    } catch (error) {
      console.error('Create event error:', error);
      throw error;
    }
  }

  /**
   * Get list of calendars
   */
  async getCalendars(): Promise<any[]> {
    try {
      const data = await this.apiRequest(`${this.CALENDAR_API}/users/me/calendarList`);
      return data.items || [];
    } catch (error) {
      console.error('Get calendars error:', error);
      throw error;
    }
  }

  // ========================================
  // GOOGLE DRIVE METHODS
  // ========================================

  /**
   * Upload file to Google Drive
   */
  async uploadToDrive(options: {
    fileName: string;
    content: Blob | string;
    mimeType: string;
    folderId?: string;
  }): Promise<any> {
    try {
      // Create metadata
      const metadata = {
        name: options.fileName,
        mimeType: options.mimeType,
        ...(options.folderId && { parents: [options.folderId] }),
      };

      // Create multipart request
      const boundary = '-------314159265358979323846';
      const delimiter = "\r\n--" + boundary + "\r\n";
      const close_delim = "\r\n--" + boundary + "--";

      let contentData: string;
      if (typeof options.content === 'string') {
        contentData = options.content;
      } else {
        contentData = await options.content.text();
      }

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + options.mimeType + '\r\n\r\n' +
        contentData +
        close_delim;

      const token = await this.getAccessToken();
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/related; boundary=' + boundary,
        },
        body: multipartRequestBody,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      await this.updateSyncStatus('drive');
      return await response.json();
    } catch (error) {
      console.error('Drive upload error:', error);
      throw error;
    }
  }

  /**
   * Download file from Google Drive
   */
  async downloadFromDrive(fileId: string): Promise<Blob> {
    try {
      const token = await this.getAccessToken();
      const response = await fetch(`${this.DRIVE_API}/files/${fileId}?alt=media`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Drive download error:', error);
      throw error;
    }
  }

  /**
   * List files in Google Drive
   */
  async listDriveFiles(options: {
    folderId?: string;
    query?: string;
    maxResults?: number;
  } = {}): Promise<any[]> {
    try {
      const url = new URL(`${this.DRIVE_API}/files`);

      let query = options.query || '';
      if (options.folderId) {
        query += (query ? ' and ' : '') + `'${options.folderId}' in parents`;
      }

      if (query) {
        url.searchParams.set('q', query);
      }

      url.searchParams.set('pageSize', (options.maxResults || 100).toString());
      url.searchParams.set('fields', 'files(id,name,mimeType,modifiedTime,size)');

      const data = await this.apiRequest(url.toString());
      return data.files || [];
    } catch (error) {
      console.error('List files error:', error);
      throw error;
    }
  }

  /**
   * Create backup on Google Drive
   */
  async createBackup(data: any, fileName: string = 'backup.json'): Promise<any> {
    const content = JSON.stringify(data, null, 2);
    return await this.uploadToDrive({
      fileName,
      content,
      mimeType: 'application/json',
    });
  }

  // ========================================
  // SYNC STATUS METHODS
  // ========================================

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<GoogleSyncStatus> {
    try {
      if (Capacitor.isNativePlatform()) {
        const { value } = await Preferences.get({ key: this.SYNC_STATUS_KEY });
        return value ? JSON.parse(value) : this.getDefaultSyncStatus();
      } else {
        const stored = localStorage.getItem(this.SYNC_STATUS_KEY);
        return stored ? JSON.parse(stored) : this.getDefaultSyncStatus();
      }
    } catch (error) {
      return this.getDefaultSyncStatus();
    }
  }

  /**
   * Update sync status for a service
   */
  private async updateSyncStatus(service: 'photos' | 'calendar' | 'drive'): Promise<void> {
    const status = await this.getSyncStatus();
    status[service] = true;
    status.lastSynced[service] = new Date();

    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: this.SYNC_STATUS_KEY,
        value: JSON.stringify(status),
      });
    } else {
      localStorage.setItem(this.SYNC_STATUS_KEY, JSON.stringify(status));
    }
  }

  /**
   * Get default sync status
   */
  private getDefaultSyncStatus(): GoogleSyncStatus {
    return {
      photos: false,
      calendar: false,
      drive: false,
      lastSynced: {},
    };
  }

  // ========================================
  // TOKEN STORAGE METHODS
  // ========================================

  /**
   * Save tokens to storage
   */
  private async saveTokens(): Promise<void> {
    if (!this.tokens) return;

    const tokensJson = JSON.stringify(this.tokens);

    if (Capacitor.isNativePlatform()) {
      await Preferences.set({
        key: this.TOKEN_STORAGE_KEY,
        value: tokensJson,
      });
    } else {
      localStorage.setItem(this.TOKEN_STORAGE_KEY, tokensJson);
    }
  }

  /**
   * Load tokens from storage
   */
  private async loadTokens(): Promise<void> {
    try {
      let tokensJson: string | null = null;

      if (Capacitor.isNativePlatform()) {
        const { value } = await Preferences.get({ key: this.TOKEN_STORAGE_KEY });
        tokensJson = value;
      } else {
        tokensJson = localStorage.getItem(this.TOKEN_STORAGE_KEY);
      }

      if (tokensJson) {
        this.tokens = JSON.parse(tokensJson);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      this.tokens = null;
    }
  }

  /**
   * Clear tokens from storage
   */
  private async clearTokens(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await Preferences.remove({ key: this.TOKEN_STORAGE_KEY });
      await Preferences.remove({ key: this.SYNC_STATUS_KEY });
    } else {
      localStorage.removeItem(this.TOKEN_STORAGE_KEY);
      localStorage.removeItem(this.SYNC_STATUS_KEY);
    }
  }
}

// Export singleton instance
export const googleSyncService = new GoogleSyncService();
