/**
 * 🎵 SoundCloud OAuth Configuration & Settings
 * Complete integration with all API features
 */

export const SOUNDCLOUD_CONFIG = {
  // OAuth 2.1 endpoints (updated endpoints from the API spec)
  AUTH_URL: 'https://secure.soundcloud.com/authorize',
  TOKEN_URL: 'https://secure.soundcloud.com/oauth/token',
  API_BASE_URL: 'https://api.soundcloud.com',
  
  // OAuth redirect for local development & production
  REDIRECT_URI: process.env.VITE_SOUNDCLOUD_REDIRECT_URI || 
    (window.location.hostname === 'localhost' 
      ? 'http://localhost:5173/soundcloud/callback'
      : `${window.location.origin}/soundcloud/callback`),
  
  // Client credentials (to be filled in by user)
  CLIENT_ID: process.env.VITE_SOUNDCLOUD_CLIENT_ID || '',
  CLIENT_SECRET: process.env.VITE_SOUNDCLOUD_CLIENT_SECRET || '',
  
  // API Settings
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 200,
  
  // Storage keys for tokens and data
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'sc_access_token',
    REFRESH_TOKEN: 'sc_refresh_token',
    TOKEN_EXPIRY: 'sc_token_expiry',
    USER_DATA: 'sc_user_data',
    CACHED_TRACKS: 'sc_cached_tracks',
    CACHED_PLAYLISTS: 'sc_cached_playlists',
    PLAY_HISTORY: 'sc_play_history',
    OFFLINE_QUEUE: 'sc_offline_queue',
  },
  
  // Feature flags
  FEATURES: {
    ENABLE_OFFLINE_MODE: true,
    ENABLE_CACHE: true,
    ENABLE_ANALYTICS: true,
    ENABLE_SOCIAL: true,
    ENABLE_UPLOADS: true,
    ENABLE_REPOSTS: true,
    ENABLE_COMMENTS: true,
  },
  
  // Rate limiting
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 15000, // SoundCloud's limit
    MAX_UPLOADS_PER_DAY: 180, // For free accounts
  },
};

// OAuth scopes (SoundCloud uses default scope)
export const SOUNDCLOUD_SCOPES = '';

// Genres for filtering
export const SOUNDCLOUD_GENRES = [
  'Alternative Rock', 'Ambient', 'Classical', 'Country', 'Dance & EDM',
  'Dancehall', 'Deep House', 'Disco', 'Drum & Bass', 'Dubstep',
  'Electronic', 'Folk & Singer-Songwriter', 'Hip-Hop & Rap', 'House',
  'Indie', 'Jazz & Blues', 'Latin', 'Metal', 'Piano', 'Pop',
  'R&B & Soul', 'Reggae', 'Reggaeton', 'Rock', 'Soundtrack',
  'Techno', 'Trance', 'Trap', 'Triphop', 'World'
];

// Track access levels
export const TRACK_ACCESS = {
  PLAYABLE: 'playable',
  PREVIEW: 'preview',
  BLOCKED: 'blocked'
};

// Track sharing types
export const TRACK_SHARING = {
  PUBLIC: 'public',
  PRIVATE: 'private'
};

// License types
export const LICENSE_TYPES = {
  NO_RIGHTS_RESERVED: 'no-rights-reserved',
  ALL_RIGHTS_RESERVED: 'all-rights-reserved',
  CC_BY: 'cc-by',
  CC_BY_NC: 'cc-by-nc',
  CC_BY_ND: 'cc-by-nd',
  CC_BY_SA: 'cc-by-sa',
  CC_BY_NC_ND: 'cc-by-nc-nd',
  CC_BY_NC_SA: 'cc-by-nc-sa'
};
