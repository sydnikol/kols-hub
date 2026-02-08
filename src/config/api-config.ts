// API Configuration Manager
// NOTE: All API keys should come from environment variables, never hardcode!

export const API_CONFIG = {
  youtube: {
    apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
    clientId: import.meta.env.VITE_YOUTUBE_OAUTH_CLIENT_ID || ''
  }
};

export interface YouTubeConfig {
  apiKey: string;
  clientId: string;
  scopes: string[];
  redirectUri: string;
}

export const getYouTubeConfig = (): YouTubeConfig => ({
  apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  clientId: import.meta.env.VITE_YOUTUBE_OAUTH_CLIENT_ID || '',
  scopes: [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ],
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/oauth/youtube` : 'http://localhost:5173/oauth/youtube'
});

// Validation helper
export const isYouTubeConfigured = (): boolean => {
  const config = getYouTubeConfig();
  return Boolean(config.apiKey && config.clientId);
};
