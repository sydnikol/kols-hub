// Avatar Utility Functions
// ========================

import { ReadyPlayerMeAvatar } from '../types/avatar';

/**
 * Default avatar ID
 */
export const DEFAULT_AVATAR_ID = '68e94e474099d80b93c9b714';

/**
 * Get the Ready Player Me avatar URL from avatar ID
 */
export const getAvatarUrl = (avatarId: string, quality: 'low' | 'medium' | 'high' = 'medium'): string => {
  const qualityParam = quality === 'high' ? '' : `?quality=${quality}`;
  return `https://models.readyplayer.me/${avatarId}.glb${qualityParam}`;
};

/**
 * Get avatar thumbnail URL
 */
export const getAvatarThumbnailUrl = (avatarId: string): string => {
  return `https://models.readyplayer.me/${avatarId}.png`;
};

/**
 * Validate avatar ID format
 */
export const isValidAvatarId = (avatarId: string): boolean => {
  // Ready Player Me avatar IDs are typically 24 character hex strings
  return /^[a-f0-9]{24}$/i.test(avatarId);
};

/**
 * Create a new avatar object
 */
export const createAvatarObject = (
  avatarId: string, 
  name: string = 'My Avatar'
): ReadyPlayerMeAvatar => {
  return {
    id: avatarId,
    name,
    url: getAvatarUrl(avatarId),
    thumbnailUrl: getAvatarThumbnailUrl(avatarId),    createdAt: new Date(),
    lastUsed: new Date(),
    isFavorite: false,
    tags: [],
  };
};

/**
 * Get default avatar configuration from environment
 */
export const getDefaultAvatarConfig = () => {
  return {
    subdomain: import.meta.env.VITE_RPM_SUBDOMAIN || 'kols-hub-674o9x',
    appId: import.meta.env.VITE_RPM_APP_ID || '69158de3771c8dd1a3a74702',
    defaultAvatarId: import.meta.env.VITE_RPM_DEFAULT_AVATAR_ID || '68e94e474099d80b93c9b714',
  };
};

/**
 * Build Ready Player Me iframe URL
 */
export const buildAvatarCreatorUrl = (subdomain: string, options: {
  bodyType?: 'fullbody' | 'halfbody';
  quickStart?: boolean;
  clearCache?: boolean;
} = {}): string => {
  const baseUrl = `https://${subdomain}.readyplayer.me/avatar`;
  const params = new URLSearchParams();
  
  if (options.bodyType) params.append('bodyType', options.bodyType);
  if (options.quickStart) params.append('quickStart', 'true');
  if (options.clearCache) params.append('clearCache', 'true');
  
  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

/**
 * Extract avatar ID from Ready Player Me URL
 */export const extractAvatarIdFromUrl = (url: string): string | null => {
  // Match patterns like: https://models.readyplayer.me/{id}.glb
  const match = url.match(/readyplayer\.me\/([a-f0-9]{24})(?:\.glb)?/i);
  return match ? match[1] : null;
};

/**
 * Load avatar from localStorage
 */
export const loadAvatarsFromStorage = (): ReadyPlayerMeAvatar[] => {
  try {
    const stored = localStorage.getItem('kol-avatars');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading avatars:', error);
    return [];
  }
};

/**
 * Save avatars to localStorage
 */
export const saveAvatarsToStorage = (avatars: ReadyPlayerMeAvatar[]): void => {
  try {
    localStorage.setItem('kol-avatars', JSON.stringify(avatars));
  } catch (error) {
    console.error('Error saving avatars:', error);
  }
};

/**
 * Get current avatar from storage
 */
export const getCurrentAvatar = (): ReadyPlayerMeAvatar | null => {
  try {
    const stored = localStorage.getItem('kol-current-avatar');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading current avatar:', error);
    return null;
  }
};
/**
 * Set current avatar in storage
 */
export const setCurrentAvatar = (avatar: ReadyPlayerMeAvatar): void => {
  try {
    localStorage.setItem('kol-current-avatar', JSON.stringify(avatar));
  } catch (error) {
    console.error('Error setting current avatar:', error);
  }
};

/**
 * Get avatar quality based on device performance
 */
export const getRecommendedQuality = (): 'low' | 'medium' | 'high' => {
  // Check device memory (if available)
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return 'low';
  if (memory && memory < 8) return 'medium';
  
  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) return 'medium';
  
  return 'high';
};

/**
 * Preload avatar model
 */
export const preloadAvatar = async (avatarUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(avatarUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error preloading avatar:', error);
    return false;
  }
};