/**
 * Secure Authentication Service
 *
 * Implements Google OAuth 2.0 for secure authentication
 * DO NOT hardcode credentials - uses secure OAuth flow
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
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

class AuthService {
  private config?: AuthConfig;
  private currentUser?: User;

  initialize(config: AuthConfig) {
    this.config = config;

    // Check for existing session
    const stored = localStorage.getItem('auth_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);

      // Check if token expired
      if (this.currentUser && this.currentUser.expiresAt < Date.now()) {
        this.logout();
      }
    }

    console.log('Auth service initialized');
  }

  /**
   * Start Google OAuth flow
   * SECURE: Opens Google's authorization page, no hardcoded credentials
   */
  async loginWithGoogle(): Promise<void> {
    if (!this.config) {
      throw new Error('Auth not configured');
    }

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
      prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

    // Open Google's secure login page
    window.location.href = authUrl;
  }

  /**
   * Handle OAuth callback
   */
  async handleCallback(code: string): Promise<User> {
    if (!this.config) {
      throw new Error('Auth not configured');
    }

    // Exchange code for tokens (this should be done server-side in production)
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.config.googleClientId,
        redirect_uri: this.config.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    const tokens = await response.json();

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });

    const userInfo = await userResponse.json();

    this.currentUser = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: Date.now() + (tokens.expires_in * 1000)
    };

    localStorage.setItem('auth_user', JSON.stringify(this.currentUser));

    console.log('✅ Logged in:', this.currentUser.email);
    return this.currentUser;
  }

  logout() {
    this.currentUser = undefined;
    localStorage.removeItem('auth_user');
    console.log('Logged out');
  }

  getCurrentUser(): User | null {
    return this.currentUser || null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser && this.currentUser.expiresAt > Date.now();
  }

  getAccessToken(): string | null {
    return this.currentUser?.accessToken || null;
  }
}

export const authService = new AuthService();
