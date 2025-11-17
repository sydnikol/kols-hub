// API Configuration Manager
export const API_CONFIG = {
  youtube: {
    apiKey: 'AIzaSyCYX4XRr7j2oKC-Xu6qNCMyIX6WF9ep5gY',
    clientId: '982711879367-2jcmmge9k858eercf865i2jo1c4v37p8.apps.googleusercontent.com'
  }
};
// API Configuration Manager - Part 2
export interface YouTubeConfig {
  apiKey: string;
  clientId: string;
  scopes: string[];
  redirectUri: string;
}

export const getYouTubeConfig = (): YouTubeConfig => ({
  apiKey: import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyCYX4XRr7j2oKC-Xu6qNCMyIX6WF9ep5gY',
  clientId: import.meta.env.VITE_YOUTUBE_OAUTH_CLIENT_ID || '982711879367-2jcmmge9k858eercf865i2jo1c4v37p8.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/youtube.readonly',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ],
  redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/oauth/youtube` : 'http://localhost:5173/oauth/youtube'
});
