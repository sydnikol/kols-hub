/**
 * Secure Authentication Service
 *
 * Implements Google OAuth 2.0 with PKCE for secure client-side authentication
 * Also supports guest mode for users who don't want to sign in
 */

interface AuthConfig {
  googleClientId: string;
  redirectUri: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt: number;
  isGuest?: boolean;
}

// PKCE helpers for secure OAuth
const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

class AuthService {
  private config?: AuthConfig;
  private currentUser?: User;
  private codeVerifier?: string;

  initialize(config: AuthConfig) {
    this.config = config;

    // Check for existing session
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);

        // Check if token expired (for non-guest users)
        if (this.currentUser && !this.currentUser.isGuest && this.currentUser.expiresAt < Date.now()) {
          console.log('Token expired, logging out');
          this.logout();
        }
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('auth_user');
      }
    }

    console.log('Auth service initialized');
  }

  /**
   * Continue as guest without authentication
   */
  loginAsGuest(): User {
    const guestId = localStorage.getItem('guest_id') || `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guest_id', guestId);

    this.currentUser = {
      id: guestId,
      email: 'guest@kolhub.local',
      name: 'Guest User',
      expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year
      isGuest: true
    };

    localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
    console.log('✅ Logged in as guest:', guestId);
    return this.currentUser;
  }

  /**
   * Start Google OAuth flow with PKCE
   * SECURE: Uses PKCE (Proof Key for Code Exchange) for client-side OAuth
   */
  async loginWithGoogle(): Promise<void> {
    if (!this.config) {
      throw new Error('Auth not configured');
    }

    if (!this.config.googleClientId || this.config.googleClientId === '') {
      console.warn('Google OAuth not configured, using guest mode');
      this.loginAsGuest();
      return;
    }

    // Generate PKCE code verifier and challenge
    this.codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(this.codeVerifier);

    // Store code verifier for callback
    sessionStorage.setItem('oauth_code_verifier', this.codeVerifier);

    const params = new URLSearchParams({
      client_id: this.config.googleClientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.heart_rate.read',
        'https://www.googleapis.com/auth/fitness.sleep.read',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/gmail.readonly'
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

    // Open Google's secure login page
    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback with PKCE
   */
  async handleCallback(code: string): Promise<User> {
    if (!this.config) {
      throw new Error('Auth not configured');
    }

    // Get stored code verifier
    const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
    if (!codeVerifier) {
      throw new Error('No code verifier found - OAuth flow may have been interrupted');
    }

    try {
      // Exchange code for tokens using PKCE (no client secret needed)
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: this.config.googleClientId,
          redirect_uri: this.config.redirectUri,
          grant_type: 'authorization_code',
          code_verifier: codeVerifier
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Token exchange failed:', errorData);
        throw new Error(errorData.error_description || 'Token exchange failed');
      }

      const tokens = await response.json();

      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userInfo = await userResponse.json();

      this.currentUser = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: Date.now() + (tokens.expires_in * 1000),
        isGuest: false
      };

      localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
      sessionStorage.removeItem('oauth_code_verifier');

      console.log('✅ Logged in:', this.currentUser.email);
      return this.currentUser;

    } catch (error) {
      console.error('OAuth callback error:', error);
      sessionStorage.removeItem('oauth_code_verifier');

      // Fall back to guest mode on auth failure
      console.log('Falling back to guest mode');
      return this.loginAsGuest();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    if (!this.config || !this.currentUser?.refreshToken) {
      return false;
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.config.googleClientId,
          refresh_token: this.currentUser.refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        return false;
      }

      const tokens = await response.json();

      this.currentUser = {
        ...this.currentUser,
        accessToken: tokens.access_token,
        expiresAt: Date.now() + (tokens.expires_in * 1000)
      };

      localStorage.setItem('auth_user', JSON.stringify(this.currentUser));
      console.log('✅ Token refreshed');
      return true;

    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  logout() {
    this.currentUser = undefined;
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('oauth_code_verifier');
    console.log('Logged out');
  }

  getCurrentUser(): User | null {
    return this.currentUser || null;
  }

  isAuthenticated(): boolean {
    if (!this.currentUser) return false;

    // Guest users are always "authenticated"
    if (this.currentUser.isGuest) return true;

    // For OAuth users, check token expiry
    return this.currentUser.expiresAt > Date.now();
  }

  isGuestUser(): boolean {
    return this.currentUser?.isGuest || false;
  }

  getAccessToken(): string | null {
    if (!this.currentUser) return null;

    // No token for guests
    if (this.currentUser.isGuest) return null;

    return this.currentUser.accessToken || null;
  }

  /**
   * Check if token needs refresh and refresh if needed
   */
  async ensureValidToken(): Promise<string | null> {
    if (!this.currentUser || this.currentUser.isGuest) {
      return null;
    }

    // If token expires in less than 5 minutes, refresh it
    if (this.currentUser.expiresAt - Date.now() < 5 * 60 * 1000) {
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        return null;
      }
    }

    return this.currentUser.accessToken || null;
  }
}

export const authService = new AuthService();
