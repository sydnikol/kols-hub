// Core Types and Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  readyPlayerMeAvatar?: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  biometricEnabled?: boolean;
}

export interface VoiceInteractionConfig {
  language: string;
  voiceId?: string;
  sensitivity: number;
  wakeWord?: string;
}

export interface AICompanionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audio?: Buffer;
}

export interface WearableData {
  userId: string;
  source: 'fitbit' | 'apple-watch' | 'other';
  type: 'heart-rate' | 'steps' | 'sleep' | 'activity' | 'stress';
  value: number;
  unit: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface TelemedicineSession {
  id: string;
  userId: string;
  providerId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledTime: Date;
  duration?: number;
  roomName?: string;
  recordingUrl?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  streamUrl: string;
  mood?: string[];
  genre?: string[];
}

export interface CommunityPost {
  id: string;
  userId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'poll';
  tags?: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  isAnonymous?: boolean;
}

export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  config?: Record<string, any>;
  hooks: PluginHooks;
}

export interface PluginHooks {
  onLoad?: () => Promise<void>;
  onUnload?: () => Promise<void>;
  onMessage?: (message: AICompanionMessage) => Promise<AICompanionMessage>;
  onWearableData?: (data: WearableData) => Promise<WearableData>;
}

export interface HealthPortalData {
  userId: string;
  portal: 'myuhealth' | 'other';
  appointments?: any[];
  medications?: any[];
  labResults?: any[];
  lastSync: Date;
}

export interface CloudSyncConfig {
  enabled: boolean;
  provider: 'aws' | 'google' | 'azure';
  encryptionKey: string;
  autoSync: boolean;
  syncInterval: number;
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

export interface BiometricAuth {
  type: 'fingerprint' | 'face' | 'voice';
  enabled: boolean;
  deviceId?: string;
}
