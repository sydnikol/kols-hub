import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useMemo } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  nickname?: string;
  emailVerified?: boolean;
}

export interface UseAuthReturn {
  // State
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  error: Error | undefined;

  // Actions
  login: (options?: { returnTo?: string }) => Promise<void>;
  loginWithPopup: () => Promise<void>;
  logout: (options?: { returnTo?: string }) => void;
  getAccessToken: () => Promise<string | null>;

  // Helpers
  isConfigured: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const {
    isAuthenticated,
    isLoading,
    user: auth0User,
    error,
    loginWithRedirect,
    loginWithPopup: auth0LoginWithPopup,
    logout: auth0Logout,
    getAccessTokenSilently,
  } = useAuth0();

  // Check if Auth0 is configured
  const isConfigured = useMemo(() => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
    return Boolean(domain && clientId);
  }, []);

  // Transform Auth0 user to our user format
  const user: AuthUser | null = useMemo(() => {
    if (!auth0User) return null;

    return {
      id: auth0User.sub || '',
      email: auth0User.email || '',
      name: auth0User.name || auth0User.nickname || '',
      picture: auth0User.picture || '',
      nickname: auth0User.nickname,
      emailVerified: auth0User.email_verified,
    };
  }, [auth0User]);

  // Login with redirect
  const login = useCallback(async (options?: { returnTo?: string }) => {
    if (!isConfigured) {
      console.warn('Auth0 is not configured');
      return;
    }

    await loginWithRedirect({
      appState: { returnTo: options?.returnTo || window.location.pathname },
    });
  }, [isConfigured, loginWithRedirect]);

  // Login with popup
  const loginWithPopup = useCallback(async () => {
    if (!isConfigured) {
      console.warn('Auth0 is not configured');
      return;
    }

    await auth0LoginWithPopup();
  }, [isConfigured, auth0LoginWithPopup]);

  // Logout
  const logout = useCallback((options?: { returnTo?: string }) => {
    if (!isConfigured) {
      console.warn('Auth0 is not configured');
      return;
    }

    auth0Logout({
      logoutParams: {
        returnTo: options?.returnTo || window.location.origin,
      },
    });
  }, [isConfigured, auth0Logout]);

  // Get access token
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!isConfigured || !isAuthenticated) {
      return null;
    }

    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }, [isConfigured, isAuthenticated, getAccessTokenSilently]);

  return {
    isAuthenticated,
    isLoading,
    user,
    error,
    login,
    loginWithPopup,
    logout,
    getAccessToken,
    isConfigured,
  };
};

export default useAuth;
