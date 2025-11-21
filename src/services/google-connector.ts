/**
 * GOOGLE API CONNECTOR - All Google Services in One Place
 * Fixes and connects all Google integrations
 */

import axios from 'axios';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '';
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/callback';

export interface GoogleAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

export class GoogleConnector {
  private static instance: GoogleConnector;
  private accessToken: string = '';
  private refreshToken: string = '';
  private expiresAt: number = 0;

  static getInstance(): GoogleConnector {
    if (!GoogleConnector.instance) {
      GoogleConnector.instance = new GoogleConnector();
    }
    return GoogleConnector.instance;
  }

  /**
   * Initialize Google OAuth2 flow
   */
  initiateGoogleAuth(scopes: string[] = []) {
    const defaultScopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/fitness.activity.read',
      'https://www.googleapis.com/auth/fitness.body.read',
      'https://www.googleapis.com/auth/photoslibrary.readonly',
      'https://www.googleapis.com/auth/homegraph'
    ];

    const allScopes = [...new Set([...defaultScopes, ...scopes])];

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: 'code',
      scope: allScopes.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    })}`;

    window.location.href = authUrl;
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<GoogleAuthTokens> {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      });

      const tokens: GoogleAuthTokens = response.data;
      this.setTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Failed to exchange code for tokens:', error);
      throw error;
    }
  }

  /**
   * Set tokens and expiration
   */
  private setTokens(tokens: GoogleAuthTokens) {
    this.accessToken = tokens.access_token;
    if (tokens.refresh_token) {
      this.refreshToken = tokens.refresh_token;
      localStorage.setItem('google_refresh_token', tokens.refresh_token);
    }
    this.expiresAt = Date.now() + (tokens.expires_in * 1000);

    localStorage.setItem('google_access_token', tokens.access_token);
    localStorage.setItem('google_token_expires_at', this.expiresAt.toString());
  }

  /**
   * Load tokens from localStorage
   */
  loadTokensFromStorage() {
    this.accessToken = localStorage.getItem('google_access_token') || '';
    this.refreshToken = localStorage.getItem('google_refresh_token') || '';
    const expiresAt = localStorage.getItem('google_token_expires_at');
    this.expiresAt = expiresAt ? parseInt(expiresAt) : 0;
  }

  /**
   * Check if tokens are valid
   */
  isAuthenticated(): boolean {
    return this.accessToken !== '' && Date.now() < this.expiresAt;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: this.refreshToken,
        grant_type: 'refresh_token'
      });

      const tokens: GoogleAuthTokens = response.data;
      this.setTokens(tokens);
      return tokens.access_token;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw error;
    }
  }

  /**
   * Get valid access token (refreshes if needed)
   */
  async getAccessToken(): Promise<string> {
    if (this.isAuthenticated()) {
      return this.accessToken;
    }

    // Try to refresh
    if (this.refreshToken) {
      return await this.refreshAccessToken();
    }

    throw new Error('Not authenticated. Please login again.');
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest(url: string, options: any = {}) {
    const token = await this.getAccessToken();

    const response = await axios({
      url,
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    return response.data;
  }

  // ============= GOOGLE CALENDAR =============

  /**
   * Get calendar events
   */
  async getCalendarEvents(timeMin?: string, timeMax?: string, maxResults: number = 50) {
    const params: any = { maxResults };
    if (timeMin) params.timeMin = timeMin;
    if (timeMax) params.timeMax = timeMax;

    return await this.makeRequest(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${new URLSearchParams(params)}`
    );
  }

  /**
   * Create calendar event
   */
  async createCalendarEvent(event: any) {
    return await this.makeRequest(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        data: event
      }
    );
  }

  /**
   * Update calendar event
   */
  async updateCalendarEvent(eventId: string, event: any) {
    return await this.makeRequest(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: 'PUT',
        data: event
      }
    );
  }

  /**
   * Delete calendar event
   */
  async deleteCalendarEvent(eventId: string) {
    return await this.makeRequest(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
      {
        method: 'DELETE'
      }
    );
  }

  // ============= GMAIL =============

  /**
   * Get email messages
   */
  async getGmailMessages(maxResults: number = 50, query?: string) {
    const params: any = { maxResults };
    if (query) params.q = query;

    return await this.makeRequest(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?${new URLSearchParams(params)}`
    );
  }

  /**
   * Get specific email
   */
  async getGmailMessage(messageId: string) {
    return await this.makeRequest(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`
    );
  }

  /**
   * Send email
   */
  async sendGmail(to: string, subject: string, body: string) {
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');

    const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');

    return await this.makeRequest(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        data: { raw: encodedEmail }
      }
    );
  }

  // ============= GOOGLE DRIVE =============

  /**
   * List Drive files
   */
  async listDriveFiles(query?: string, pageSize: number = 50) {
    const params: any = { pageSize };
    if (query) params.q = query;

    return await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files?${new URLSearchParams(params)}`
    );
  }

  /**
   * Upload file to Drive
   */
  async uploadFileToDrive(fileName: string, fileContent: any, mimeType: string) {
    const metadata = { name: fileName, mimeType };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([fileContent], { type: mimeType }));

    const token = await this.getAccessToken();

    const response = await axios.post(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      form,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  }

  /**
   * Download file from Drive
   */
  async downloadDriveFile(fileId: string) {
    return await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`
    );
  }

  // ============= GOOGLE FIT =============

  /**
   * Get fitness data
   */
  async getFitnessData(startTime: number, endTime: number, dataSourceId: string) {
    return await this.makeRequest(
      `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
      {
        method: 'POST',
        data: {
          aggregateBy: [{ dataSourceId }],
          startTimeMillis: startTime,
          endTimeMillis: endTime
        }
      }
    );
  }

  /**
   * Get step count
   */
  async getStepCount(startTime: number, endTime: number) {
    return await this.getFitnessData(
      startTime,
      endTime,
      'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
    );
  }

  /**
   * Get heart rate
   */
  async getHeartRate(startTime: number, endTime: number) {
    return await this.getFitnessData(
      startTime,
      endTime,
      'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm'
    );
  }

  // ============= GOOGLE PHOTOS =============

  /**
   * List photos
   */
  async listPhotos(pageSize: number = 50, pageToken?: string) {
    const params: any = { pageSize };
    if (pageToken) params.pageToken = pageToken;

    return await this.makeRequest(
      `https://photoslibrary.googleapis.com/v1/mediaItems?${new URLSearchParams(params)}`
    );
  }

  /**
   * Upload photo
   */
  async uploadPhoto(fileName: string, fileContent: any) {
    const token = await this.getAccessToken();

    // Step 1: Upload bytes
    const uploadResponse = await axios.post(
      'https://photoslibrary.googleapis.com/v1/uploads',
      fileContent,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/octet-stream',
          'X-Goog-Upload-File-Name': fileName,
          'X-Goog-Upload-Protocol': 'raw'
        }
      }
    );

    const uploadToken = uploadResponse.data;

    // Step 2: Create media item
    return await this.makeRequest(
      'https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
      {
        method: 'POST',
        data: {
          newMediaItems: [
            {
              description: fileName,
              simpleMediaItem: {
                uploadToken
              }
            }
          ]
        }
      }
    );
  }

  // ============= GOOGLE HOME =============

  /**
   * Get smart home devices
   */
  async getHomeDevices() {
    return await this.makeRequest(
      'https://homegraph.googleapis.com/v1/devices:query',
      {
        method: 'POST',
        data: {
          requestId: crypto.randomUUID(),
          agentUserId: 'kol-hub-user'
        }
      }
    );
  }

  /**
   * Control smart home device
   */
  async controlHomeDevice(deviceId: string, command: string, params: any = {}) {
    return await this.makeRequest(
      'https://homegraph.googleapis.com/v1/devices:execute',
      {
        method: 'POST',
        data: {
          requestId: crypto.randomUUID(),
          agentUserId: 'kol-hub-user',
          commands: [
            {
              devices: [{ id: deviceId }],
              execution: [
                {
                  command,
                  params
                }
              ]
            }
          ]
        }
      }
    );
  }

  // ============= GOOGLE PAY =============

  /**
   * Note: Google Pay API requires special merchant setup
   * This is a placeholder for future implementation
   */
  async getGooglePayTransactions() {
    console.warn('Google Pay API requires merchant account setup');
    return [];
  }

  // ============= HELPER METHODS =============

  /**
   * Disconnect (sign out)
   */
  disconnect() {
    this.accessToken = '';
    this.refreshToken = '';
    this.expiresAt = 0;

    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_refresh_token');
    localStorage.removeItem('google_token_expires_at');

    console.log('✅ Disconnected from Google');
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      connected: this.isAuthenticated(),
      expiresAt: new Date(this.expiresAt),
      hasRefreshToken: !!this.refreshToken
    };
  }
}

// Export singleton instance
export const googleConnector = GoogleConnector.getInstance();

// Initialize on module load
googleConnector.loadTokensFromStorage();

// Export helper functions for easy access
export const connectGoogle = () => googleConnector.initiateGoogleAuth();
export const disconnectGoogle = () => googleConnector.disconnect();
export const isGoogleConnected = () => googleConnector.isAuthenticated();
