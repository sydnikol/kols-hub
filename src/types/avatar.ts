// Avatar Types for Ready Player Me Integration
// ============================================

export interface ReadyPlayerMeAvatar {
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  createdAt: Date;
  lastUsed: Date;
  isFavorite: boolean;
  tags: string[];
  metadata?: {
    bodyType?: 'fullbody' | 'halfbody';
    gender?: string;
    outfit?: string;
    mood?: string;
    expression?: string;
  };
}

export interface AvatarState {
  currentAvatar: ReadyPlayerMeAvatar | null;
  savedAvatars: ReadyPlayerMeAvatar[];
  isLoading: boolean;
  error: string | null;
}

export interface AvatarCreatorConfig {
  subdomain: string;
  bodyType?: 'fullbody' | 'halfbody';
  quickStart?: boolean;
  clearCache?: boolean;
  language?: string;
}

export interface AvatarDisplayProps {
  avatarUrl: string;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  animationSpeed?: number;
  quality?: 'low' | 'medium' | 'high';
  enableRotation?: boolean;
  enableZoom?: boolean;
  mood?: 'neutral' | 'happy' | 'thinking' | 'excited' | 'mysterious' | 'sad' | 'angry' | 'curious';
  expression?: 'idle' | 'curious' | 'confident' | 'thinking';
  showControls?: boolean;
  backgroundColor?: 'transparent' | 'dark' | 'light' | string;
}

export interface AvatarAnimation {
  name: string;
  duration: number;
  loop: boolean;
  trigger: 'idle' | 'speaking' | 'thinking' | 'celebrating';
}

export type AvatarQuality = 'low' | 'medium' | 'high';

export type AvatarMood = 
  | 'neutral' 
  | 'happy' 
  | 'thinking' 
  | 'excited' 
  | 'mysterious' 
  | 'sad' 
  | 'angry' 
  | 'curious'
  | 'confident'
  | 'playful'
  | 'serious';

export type AvatarExpression = 
  | 'idle'
  | 'curious'
  | 'confident'
  | 'thinking'
  | 'smiling'
  | 'focused';

export interface AvatarSettings {
  quality: AvatarQuality;
  autoRotate: boolean;
  rotationSpeed: number;
  showBackground: boolean;
  backgroundColor: string;
  enableAnimations: boolean;
  animationSpeed: number;
  enableMoodEffects: boolean;
  defaultMood: AvatarMood;
}

export interface ReadyPlayerMeConfig {
  subdomain: string;
  appId: string;
  orgId: string;
  defaultAvatarId: string;
}

export interface AvatarProfileData {
  avatar: ReadyPlayerMeAvatar;
  personality: {
    primaryMood: AvatarMood;
    traits: string[];
    voiceStyle?: string;
  };
  customization: {
    favoriteOutfits: string[];
    preferredExpressions: AvatarExpression[];
    specialAnimations: string[];
  };
}
