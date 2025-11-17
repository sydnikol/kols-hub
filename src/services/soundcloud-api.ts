/**
 * 🎵 SoundCloud API Service - Part 1
 * Core types and authentication
 */

import { SOUNDCLOUD_CONFIG, TRACK_ACCESS } from '../utils/soundcloud-config';

// Core Types
export interface SoundCloudUser {
  urn: string;
  kind: string;
  username: string;
  permalink: string;
  permalink_url: string;
  avatar_url: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  description?: string;
  city?: string;
  country?: string;
  followers_count: number;
  followings_count: number;
  track_count: number;
  playlist_count: number;
  public_favorites_count: number;
  reposts_count?: number;
  created_at: string;
  last_modified: string;
  website?: string;
  plan?: string;
}
export interface SoundCloudTrack {
  urn: string;
  kind: string;
  title: string;
  permalink_url: string;
  artwork_url?: string;
  description?: string;
  duration: number;
  genre?: string;
  tag_list?: string;
  user: SoundCloudUser;
  created_at: string;
  playback_count?: number;
  favoritings_count?: number;
  comment_count?: number;
  download_count?: number;
  reposts_count?: number;
  downloadable?: boolean;
  streamable?: boolean;
  access?: 'playable' | 'preview' | 'blocked';
  waveform_url?: string;
  stream_url?: string;
  bpm?: number;
  key_signature?: string;
  release?: string;
  license?: string;
}

export interface SoundCloudPlaylist {
  urn: string;  kind: string;
  title: string;
  description?: string;
  artwork_url?: string;
  permalink_url: string;
  tracks?: SoundCloudTrack[];
  track_count: number;
  duration: number;
  user: SoundCloudUser;
  created_at: string;
  likes_count?: number;
  genre?: string;
  sharing?: string;
  tags?: string;
}

export interface SoundCloudComment {
  urn: string;
  kind: string;
  body: string;
  timestamp?: number;
  user: SoundCloudUser;
  created_at: string;
}

export interface SoundCloudStreams {
  http_mp3_128_url?: string;
  hls_mp3_128_url?: string;
  hls_opus_64_url?: string;
  preview_mp3_128_url?: string;
}