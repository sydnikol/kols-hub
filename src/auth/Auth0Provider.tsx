import React from 'react';
import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

interface Auth0ProviderWithConfigProps {
  children: React.ReactNode;
}

// Auth0 Configuration
const getAuth0Config = (): Auth0ProviderOptions => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE || '';

  // Determine redirect URI based on environment
  const getRedirectUri = () => {
    if (typeof window === 'undefined') return '';

    // Check if running on mobile (Capacitor)
    const isCapacitor = window.location.protocol === 'capacitor:' ||
                        window.location.href.includes('localhost') === false &&
                        !window.location.href.includes('netlify');

    if (isCapacitor) {
      return 'kolhub://auth/callback';
    }

    return `${window.location.origin}/auth/callback`;
  };

  return {
    domain,
    clientId,
    authorizationParams: {
      redirect_uri: getRedirectUri(),
      audience: audience || undefined,
      scope: 'openid profile email offline_access',
    },
    cacheLocation: 'localstorage',
    useRefreshTokens: true,
    useRefreshTokensFallback: true,
  };
};

// Auth0 Provider with Navigation Support
export const Auth0ProviderWithNavigate: React.FC<Auth0ProviderWithConfigProps> = ({ children }) => {
  const navigate = useNavigate();
  const config = getAuth0Config();

  const onRedirectCallback = (appState?: { returnTo?: string }) => {
    navigate(appState?.returnTo || '/dashboard');
  };

  if (!config.domain || !config.clientId) {
    console.warn('Auth0 not configured. Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID');
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      {...config}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

// Standalone Auth0 Provider (for use outside Router)
export const Auth0ProviderWithConfig: React.FC<Auth0ProviderWithConfigProps> = ({ children }) => {
  const config = getAuth0Config();

  if (!config.domain || !config.clientId) {
    console.warn('Auth0 not configured. Set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID');
    return <>{children}</>;
  }

  return (
    <Auth0Provider {...config}>
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
