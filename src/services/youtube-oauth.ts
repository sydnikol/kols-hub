// 🔐 YOUTUBE OAUTH HANDLER - Google OAuth 2.0 Integration
// Gothic Futurist Authentication System

import { getYouTubeConfig } from '../config/api-config';

export interface YouTubeAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
  expires_at: number;
}

class YouTubeOAuthService {
  private config = getYouTubeConfig();
  private storageKey = 'kol-youtube-tokens';
  private authWindow: Window | null = null;

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const tokens = this.getStoredTokens();
    if (!tokens) return false;
    return Date.now() < tokens.expires_at;
  }

  // Get stored tokens
  getStoredTokens(): YouTubeAuthTokens | null {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to get stored tokens:', error);
      return null;
    }
  }

  // Store tokens
  private storeTokens(tokens: YouTubeAuthTokens): void {
    try {
      const expiresAt = Date.now() + (tokens.expires_in * 1000);
      const tokensWithExpiry = { ...tokens, expires_at: expiresAt };
      localStorage.setItem(this.storageKey, JSON.stringify(tokensWithExpiry));
    } catch (error) {
      console.error('Failed to store tokens:', error);
    }
  }

  // Clear tokens
  clearTokens(): void {
    localStorage.removeItem(this.storageKey);
  }

  // Build authorization URL
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'token',
      scope: this.config.scopes.join(' '),
      state: this.generateState()
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // Generate state for CSRF protection
  private generateState(): string {
    return Math.random().toString(36).substring(7);
  }

  // Start OAuth flow
  startAuthFlow(): Promise<YouTubeAuthTokens> {
    return new Promise((resolve, reject) => {
      const authUrl = this.getAuthUrl();
      
      // Open popup window
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      this.authWindow = window.open(
        authUrl,
        'YouTube OAuth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for OAuth callback
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'youtube-oauth-success') {
          window.removeEventListener('message', messageHandler);
          const tokens = event.data.tokens;
          this.storeTokens(tokens);
          resolve(tokens);
        } else if (event.data.type === 'youtube-oauth-error') {
          window.removeEventListener('message', messageHandler);
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageHandler);

      // Check if window was closed
      const checkClosed = setInterval(() => {
        if (this.authWindow?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          reject(new Error('OAuth window was closed'));
        }
      }, 1000);
    });
  }

  // Get access token (refresh if needed)
  async getAccessToken(): Promise<string> {
    const tokens = this.getStoredTokens();
    if (!tokens) {
      throw new Error('Not authenticated');
    }

    // Check if token is expired
    if (Date.now() >= tokens.expires_at) {
      // Token expired - need to re-authenticate
      throw new Error('Token expired - please re-authenticate');
    }

    return tokens.access_token;
  }

  // Logout
  logout(): void {
    this.clearTokens();
  }
}

export const youtubeOAuth = new YouTubeOAuthService();
