// Music Library - 200+ song/artist suggestions organized by genre
// Each track includes metadata for mood matching and discovery

export interface Track {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  subGenre?: string;
  mood: Mood[];
  tempo: 'slow' | 'medium' | 'fast';
  energy: 'low' | 'medium' | 'high';
  year: number;
  decade: string;
  spotifyId?: string;
  appleMusicId?: string;
  duration?: string;
  tags: string[];
}

export type Genre =
  | 'gothic'
  | 'rnb'
  | 'classical'
  | 'jazz'
  | 'lofi'
  | 'ambient'
  | 'hiphop'
  | 'world'
  | 'electronic'
  | 'rock'
  | 'indie'
  | 'soul';

export type Mood =
  | 'dark'
  | 'melancholic'
  | 'romantic'
  | 'energetic'
  | 'calm'
  | 'dreamy'
  | 'mysterious'
  | 'uplifting'
  | 'introspective'
  | 'sensual'
  | 'ethereal'
  | 'haunting'
  | 'chill'
  | 'focus'
  | 'sleep';

export type PlaylistMood = 'Gothic' | 'Chill' | 'Energetic' | 'Focus' | 'Sleep' | 'Romantic';

export interface PlaylistCover {
  id: string;
  name: string;
  gradient: string;
  icon: string;
}

export const playlistCovers: PlaylistCover[] = [
  { id: 'vinyl', name: 'Vintage Vinyl', gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)', icon: '🎵' },
  { id: 'moon', name: 'Midnight Moon', gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', icon: '🌙' },
  { id: 'rose', name: 'Gothic Rose', gradient: 'linear-gradient(135deg, #2c003e, #512b58)', icon: '🥀' },
  { id: 'candle', name: 'Candlelit', gradient: 'linear-gradient(135deg, #3d2914, #5c3d2e)', icon: '🕯️' },
  { id: 'storm', name: 'Storm Night', gradient: 'linear-gradient(135deg, #1a1a2e, #4a4e69)', icon: '⛈️' },
  { id: 'crystal', name: 'Crystal Cave', gradient: 'linear-gradient(135deg, #2d1b4e, #4a2c7c)', icon: '💎' },
  { id: 'forest', name: 'Dark Forest', gradient: 'linear-gradient(135deg, #0d1f0d, #1a3a1a)', icon: '🌲' },
  { id: 'ocean', name: 'Deep Ocean', gradient: 'linear-gradient(135deg, #0a1628, #1a3a5c)', icon: '🌊' },
  { id: 'fire', name: 'Ember Glow', gradient: 'linear-gradient(135deg, #2d1f1f, #5c2e2e)', icon: '🔥' },
  { id: 'stars', name: 'Starfield', gradient: 'linear-gradient(135deg, #0f0f23, #1a1a40)', icon: '✨' },
  { id: 'raven', name: 'Raven Wing', gradient: 'linear-gradient(135deg, #0a0a0a, #2a2a2a)', icon: '🦇' },
  { id: 'velvet', name: 'Velvet Dreams', gradient: 'linear-gradient(135deg, #2e1a3d, #4a2d5c)', icon: '🎭' },
];

export const genreInfo: Record<Genre, { name: string; color: string; icon: string; description: string }> = {
  gothic: { name: 'Gothic/Dark', color: '#7c2d12', icon: '🦇', description: 'Dark wave, post-punk, and gothic rock' },
  rnb: { name: 'R&B/Soul', color: '#a855f7', icon: '💜', description: 'Contemporary R&B and neo-soul' },
  classical: { name: 'Classical', color: '#d4af37', icon: '🎻', description: 'Romantic and impressionist composers' },
  jazz: { name: 'Jazz', color: '#f59e0b', icon: '🎷', description: 'Classic and contemporary jazz' },
  lofi: { name: 'Lo-Fi/Chill', color: '#60a5fa', icon: '☕', description: 'Lo-fi beats and chill instrumentals' },
  ambient: { name: 'Ambient', color: '#10b981', icon: '🌿', description: 'Atmospheric and ambient soundscapes' },
  hiphop: { name: 'Hip-Hop', color: '#ef4444', icon: '🎤', description: 'Classic and alternative hip-hop' },
  world: { name: 'World Music', color: '#ec4899', icon: '🌍', description: 'Global sounds and traditional music' },
  electronic: { name: 'Electronic', color: '#06b6d4', icon: '🎹', description: 'Synthwave, darkwave, and electronic' },
  rock: { name: 'Rock', color: '#6b7280', icon: '🎸', description: 'Alternative and indie rock' },
  indie: { name: 'Indie', color: '#8b5cf6', icon: '🎧', description: 'Independent and alternative' },
  soul: { name: 'Soul', color: '#f97316', icon: '🎼', description: 'Classic and modern soul' },
};

export const musicLibrary: Track[] = [
  // GOTHIC/DARK (30+ tracks)
  { id: 'g1', title: 'Spellbound', artist: 'Siouxsie and the Banshees', genre: 'gothic', mood: ['dark', 'energetic', 'mysterious'], tempo: 'fast', energy: 'high', year: 1981, decade: '1980s', tags: ['post-punk', 'goth rock', 'iconic'] },
  { id: 'g2', title: 'Bela Lugosi\'s Dead', artist: 'Bauhaus', genre: 'gothic', mood: ['dark', 'haunting', 'mysterious'], tempo: 'slow', energy: 'low', year: 1979, decade: '1970s', tags: ['goth', 'seminal', 'atmospheric'] },
  { id: 'g3', title: 'A Forest', artist: 'The Cure', genre: 'gothic', mood: ['dark', 'melancholic', 'dreamy'], tempo: 'medium', energy: 'medium', year: 1980, decade: '1980s', tags: ['post-punk', 'atmospheric', 'classic'] },
  { id: 'g4', title: 'Lucretia My Reflection', artist: 'The Sisters of Mercy', genre: 'gothic', mood: ['dark', 'romantic', 'mysterious'], tempo: 'medium', energy: 'medium', year: 1987, decade: '1980s', tags: ['goth rock', 'dramatic'] },
  { id: 'g5', title: 'Love Will Tear Us Apart', artist: 'Joy Division', genre: 'gothic', mood: ['melancholic', 'dark', 'romantic'], tempo: 'medium', energy: 'medium', year: 1980, decade: '1980s', tags: ['post-punk', 'iconic', 'emotional'] },
  { id: 'g6', title: 'She Sells Sanctuary', artist: 'The Cult', genre: 'gothic', mood: ['energetic', 'dark', 'uplifting'], tempo: 'fast', energy: 'high', year: 1985, decade: '1980s', tags: ['goth rock', 'anthemic'] },
  { id: 'g7', title: 'Blue Monday', artist: 'New Order', genre: 'gothic', subGenre: 'electronic', mood: ['dark', 'energetic', 'melancholic'], tempo: 'medium', energy: 'high', year: 1983, decade: '1980s', tags: ['synth', 'dance', 'iconic'] },
  { id: 'g8', title: 'Just Like Heaven', artist: 'The Cure', genre: 'gothic', mood: ['romantic', 'dreamy', 'uplifting'], tempo: 'fast', energy: 'high', year: 1987, decade: '1980s', tags: ['new wave', 'joyful'] },
  { id: 'g9', title: 'Temple of Love', artist: 'The Sisters of Mercy', genre: 'gothic', mood: ['dark', 'dramatic', 'romantic'], tempo: 'medium', energy: 'high', year: 1983, decade: '1980s', tags: ['goth rock', 'epic'] },
  { id: 'g10', title: 'Cities in Dust', artist: 'Siouxsie and the Banshees', genre: 'gothic', mood: ['dark', 'energetic', 'mysterious'], tempo: 'fast', energy: 'high', year: 1985, decade: '1980s', tags: ['post-punk', 'atmospheric'] },
  { id: 'g11', title: 'This Corrosion', artist: 'The Sisters of Mercy', genre: 'gothic', mood: ['dark', 'energetic', 'dramatic'], tempo: 'medium', energy: 'high', year: 1987, decade: '1980s', tags: ['goth rock', 'epic', 'orchestral'] },
  { id: 'g12', title: 'Pictures of You', artist: 'The Cure', genre: 'gothic', mood: ['melancholic', 'dreamy', 'romantic'], tempo: 'slow', energy: 'low', year: 1989, decade: '1980s', tags: ['dreampop', 'emotional'] },
  { id: 'g13', title: 'Stigmata', artist: 'Ministry', genre: 'gothic', subGenre: 'industrial', mood: ['dark', 'energetic', 'intense'], tempo: 'fast', energy: 'high', year: 1988, decade: '1980s', tags: ['industrial', 'aggressive'] },
  { id: 'g14', title: 'Head Like a Hole', artist: 'Nine Inch Nails', genre: 'gothic', subGenre: 'industrial', mood: ['dark', 'energetic', 'intense'], tempo: 'fast', energy: 'high', year: 1989, decade: '1980s', tags: ['industrial', 'anthemic'] },
  { id: 'g15', title: 'Personal Jesus', artist: 'Depeche Mode', genre: 'gothic', subGenre: 'electronic', mood: ['dark', 'energetic', 'mysterious'], tempo: 'medium', energy: 'high', year: 1989, decade: '1980s', tags: ['synth', 'blues-influenced'] },
  { id: 'g16', title: 'Enjoy the Silence', artist: 'Depeche Mode', genre: 'gothic', subGenre: 'electronic', mood: ['melancholic', 'dreamy', 'romantic'], tempo: 'medium', energy: 'medium', year: 1990, decade: '1990s', tags: ['synth', 'classic'] },
  { id: 'g17', title: 'Cry Little Sister', artist: 'Gerard McMann', genre: 'gothic', mood: ['dark', 'haunting', 'romantic'], tempo: 'slow', energy: 'medium', year: 1987, decade: '1980s', tags: ['soundtrack', 'Lost Boys'] },
  { id: 'g18', title: 'All Tomorrow\'s Parties', artist: 'The Velvet Underground', genre: 'gothic', mood: ['melancholic', 'ethereal', 'dreamy'], tempo: 'slow', energy: 'low', year: 1967, decade: '1960s', tags: ['proto-goth', 'art rock'] },
  { id: 'g19', title: 'Venus in Furs', artist: 'The Velvet Underground', genre: 'gothic', mood: ['dark', 'sensual', 'mysterious'], tempo: 'slow', energy: 'medium', year: 1967, decade: '1960s', tags: ['proto-goth', 'experimental'] },
  { id: 'g20', title: 'Darklands', artist: 'The Jesus and Mary Chain', genre: 'gothic', mood: ['melancholic', 'dreamy', 'romantic'], tempo: 'slow', energy: 'low', year: 1987, decade: '1980s', tags: ['shoegaze', 'atmospheric'] },
  { id: 'g21', title: 'Charlotte Sometimes', artist: 'The Cure', genre: 'gothic', mood: ['dark', 'dreamy', 'mysterious'], tempo: 'medium', energy: 'medium', year: 1981, decade: '1980s', tags: ['post-punk', 'literary'] },
  { id: 'g22', title: 'Peek-a-Boo', artist: 'Siouxsie and the Banshees', genre: 'gothic', mood: ['dark', 'energetic', 'playful'], tempo: 'fast', energy: 'high', year: 1988, decade: '1980s', tags: ['alternative', 'quirky'] },
  { id: 'g23', title: 'Dominion', artist: 'The Sisters of Mercy', genre: 'gothic', mood: ['dark', 'dramatic', 'energetic'], tempo: 'medium', energy: 'high', year: 1988, decade: '1980s', tags: ['goth rock', 'powerful'] },
  { id: 'g24', title: 'Transmission', artist: 'Joy Division', genre: 'gothic', mood: ['dark', 'energetic', 'intense'], tempo: 'fast', energy: 'high', year: 1979, decade: '1970s', tags: ['post-punk', 'iconic'] },
  { id: 'g25', title: 'She\'s Lost Control', artist: 'Joy Division', genre: 'gothic', mood: ['dark', 'haunting', 'intense'], tempo: 'medium', energy: 'medium', year: 1979, decade: '1970s', tags: ['post-punk', 'raw'] },
  { id: 'g26', title: 'Tear You Apart', artist: 'She Wants Revenge', genre: 'gothic', mood: ['dark', 'sensual', 'mysterious'], tempo: 'medium', energy: 'medium', year: 2006, decade: '2000s', tags: ['post-punk revival', 'modern'] },
  { id: 'g27', title: 'Black', artist: 'Pearl Jam', genre: 'gothic', subGenre: 'rock', mood: ['melancholic', 'intense', 'romantic'], tempo: 'slow', energy: 'medium', year: 1991, decade: '1990s', tags: ['grunge', 'emotional'] },
  { id: 'g28', title: 'Fade Into You', artist: 'Mazzy Star', genre: 'gothic', subGenre: 'indie', mood: ['dreamy', 'melancholic', 'romantic'], tempo: 'slow', energy: 'low', year: 1993, decade: '1990s', tags: ['dream pop', 'ethereal'] },
  { id: 'g29', title: 'Song to the Siren', artist: 'This Mortal Coil', genre: 'gothic', mood: ['ethereal', 'haunting', 'romantic'], tempo: 'slow', energy: 'low', year: 1984, decade: '1980s', tags: ['ethereal wave', '4AD'] },
  { id: 'g30', title: 'Teardrop', artist: 'Massive Attack', genre: 'gothic', subGenre: 'electronic', mood: ['melancholic', 'ethereal', 'haunting'], tempo: 'slow', energy: 'low', year: 1998, decade: '1990s', tags: ['trip-hop', 'iconic'] },

  // R&B/SOUL (35+ tracks)
  { id: 'r1', title: 'Drunk in Love', artist: 'Beyonce', genre: 'rnb', mood: ['sensual', 'energetic', 'romantic'], tempo: 'medium', energy: 'high', year: 2013, decade: '2010s', tags: ['modern r&b', 'sultry'] },
  { id: 'r2', title: 'Good Days', artist: 'SZA', genre: 'rnb', mood: ['dreamy', 'uplifting', 'introspective'], tempo: 'slow', energy: 'low', year: 2020, decade: '2020s', tags: ['neo-soul', 'hopeful'] },
  { id: 'r3', title: 'Thinkin Bout You', artist: 'Frank Ocean', genre: 'rnb', mood: ['romantic', 'melancholic', 'dreamy'], tempo: 'slow', energy: 'low', year: 2012, decade: '2010s', tags: ['alternative r&b', 'vulnerable'] },
  { id: 'r4', title: 'Untitled (How Does It Feel)', artist: 'D\'Angelo', genre: 'rnb', mood: ['sensual', 'romantic', 'dreamy'], tempo: 'slow', energy: 'low', year: 2000, decade: '2000s', tags: ['neo-soul', 'classic'] },
  { id: 'r5', title: 'Golden', artist: 'Jill Scott', genre: 'rnb', subGenre: 'soul', mood: ['uplifting', 'romantic', 'calm'], tempo: 'slow', energy: 'low', year: 2004, decade: '2000s', tags: ['neo-soul', 'poetic'] },
  { id: 'r6', title: 'Electric', artist: 'Alicia Keys', genre: 'rnb', mood: ['romantic', 'dreamy', 'sensual'], tempo: 'slow', energy: 'low', year: 2012, decade: '2010s', tags: ['piano ballad', 'intimate'] },
  { id: 'r7', title: 'No Guidance', artist: 'Chris Brown ft. Drake', genre: 'rnb', mood: ['sensual', 'romantic', 'chill'], tempo: 'slow', energy: 'low', year: 2019, decade: '2010s', tags: ['modern r&b', 'smooth'] },
  { id: 'r8', title: 'Adorn', artist: 'Miguel', genre: 'rnb', mood: ['romantic', 'sensual', 'uplifting'], tempo: 'medium', energy: 'medium', year: 2012, decade: '2010s', tags: ['contemporary', 'seductive'] },
  { id: 'r9', title: 'Love Galore', artist: 'SZA ft. Travis Scott', genre: 'rnb', mood: ['melancholic', 'sensual', 'introspective'], tempo: 'slow', energy: 'low', year: 2017, decade: '2010s', tags: ['alternative r&b', 'vulnerable'] },
  { id: 'r10', title: 'Nights', artist: 'Frank Ocean', genre: 'rnb', mood: ['introspective', 'melancholic', 'dreamy'], tempo: 'medium', energy: 'medium', year: 2016, decade: '2010s', tags: ['experimental', 'layered'] },
  { id: 'r11', title: 'Cranes in the Sky', artist: 'Solange', genre: 'rnb', mood: ['melancholic', 'introspective', 'ethereal'], tempo: 'slow', energy: 'low', year: 2016, decade: '2010s', tags: ['alternative', 'poignant'] },
  { id: 'r12', title: 'Best Part', artist: 'Daniel Caesar ft. H.E.R.', genre: 'rnb', mood: ['romantic', 'calm', 'uplifting'], tempo: 'slow', energy: 'low', year: 2017, decade: '2010s', tags: ['duet', 'sweet'] },
  { id: 'r13', title: 'Fantasy', artist: 'Mariah Carey', genre: 'rnb', mood: ['uplifting', 'romantic', 'energetic'], tempo: 'fast', energy: 'high', year: 1995, decade: '1990s', tags: ['pop r&b', 'iconic'] },
  { id: 'r14', title: 'No Diggity', artist: 'Blackstreet ft. Dr. Dre', genre: 'rnb', mood: ['chill', 'sensual', 'confident'], tempo: 'medium', energy: 'medium', year: 1996, decade: '1990s', tags: ['90s classic', 'groovy'] },
  { id: 'r15', title: 'Crazy in Love', artist: 'Beyonce ft. Jay-Z', genre: 'rnb', mood: ['energetic', 'romantic', 'uplifting'], tempo: 'fast', energy: 'high', year: 2003, decade: '2000s', tags: ['iconic', 'horn section'] },
  { id: 'r16', title: 'Kiss of Life', artist: 'Sade', genre: 'rnb', subGenre: 'soul', mood: ['romantic', 'calm', 'sensual'], tempo: 'slow', energy: 'low', year: 1992, decade: '1990s', tags: ['smooth', 'sophisticated'] },
  { id: 'r17', title: 'The Weekend', artist: 'SZA', genre: 'rnb', mood: ['chill', 'sensual', 'melancholic'], tempo: 'slow', energy: 'low', year: 2017, decade: '2010s', tags: ['alternative r&b', 'honest'] },
  { id: 'r18', title: 'Redbone', artist: 'Childish Gambino', genre: 'rnb', subGenre: 'soul', mood: ['dreamy', 'sensual', 'mysterious'], tempo: 'slow', energy: 'low', year: 2016, decade: '2010s', tags: ['funk', 'retro'] },
  { id: 'r19', title: 'Green Light', artist: 'John Legend', genre: 'rnb', mood: ['romantic', 'sensual', 'uplifting'], tempo: 'medium', energy: 'medium', year: 2008, decade: '2000s', tags: ['funky', 'Andre 3000'] },
  { id: 'r20', title: 'I Wanna Be Your Lover', artist: 'Prince', genre: 'rnb', mood: ['romantic', 'energetic', 'sensual'], tempo: 'fast', energy: 'high', year: 1979, decade: '1970s', tags: ['funk', 'classic'] },
  { id: 'r21', title: 'If I Ain\'t Got You', artist: 'Alicia Keys', genre: 'rnb', mood: ['romantic', 'calm', 'introspective'], tempo: 'slow', energy: 'low', year: 2003, decade: '2000s', tags: ['piano ballad', 'classic'] },
  { id: 'r22', title: 'Video', artist: 'India.Arie', genre: 'rnb', subGenre: 'soul', mood: ['uplifting', 'calm', 'introspective'], tempo: 'medium', energy: 'low', year: 2001, decade: '2000s', tags: ['neo-soul', 'empowering'] },
  { id: 'r23', title: 'Pink + White', artist: 'Frank Ocean', genre: 'rnb', mood: ['dreamy', 'nostalgic', 'calm'], tempo: 'medium', energy: 'low', year: 2016, decade: '2010s', tags: ['alternative', 'summer'] },
  { id: 'r24', title: 'Say My Name', artist: 'Destiny\'s Child', genre: 'rnb', mood: ['energetic', 'confident', 'dramatic'], tempo: 'medium', energy: 'high', year: 1999, decade: '1990s', tags: ['iconic', 'harmony'] },
  { id: 'r25', title: 'Killing Me Softly', artist: 'Fugees', genre: 'rnb', subGenre: 'hiphop', mood: ['melancholic', 'romantic', 'calm'], tempo: 'slow', energy: 'low', year: 1996, decade: '1990s', tags: ['cover', 'classic'] },
  { id: 'r26', title: 'End of the Road', artist: 'Boyz II Men', genre: 'rnb', mood: ['melancholic', 'romantic', 'emotional'], tempo: 'slow', energy: 'low', year: 1992, decade: '1990s', tags: ['ballad', 'acapella'] },
  { id: 'r27', title: 'Bag Lady', artist: 'Erykah Badu', genre: 'rnb', subGenre: 'soul', mood: ['introspective', 'calm', 'uplifting'], tempo: 'slow', energy: 'low', year: 2000, decade: '2000s', tags: ['neo-soul', 'wisdom'] },
  { id: 'r28', title: 'Tyrone', artist: 'Erykah Badu', genre: 'rnb', subGenre: 'soul', mood: ['confident', 'chill', 'playful'], tempo: 'slow', energy: 'medium', year: 1997, decade: '1990s', tags: ['neo-soul', 'live version'] },
  { id: 'r29', title: 'The Hills', artist: 'The Weeknd', genre: 'rnb', mood: ['dark', 'sensual', 'mysterious'], tempo: 'slow', energy: 'medium', year: 2015, decade: '2010s', tags: ['dark r&b', 'atmospheric'] },
  { id: 'r30', title: 'Blinding Lights', artist: 'The Weeknd', genre: 'rnb', subGenre: 'electronic', mood: ['energetic', 'romantic', 'nostalgic'], tempo: 'fast', energy: 'high', year: 2019, decade: '2010s', tags: ['synthwave', '80s influenced'] },
  { id: 'r31', title: 'After the Storm', artist: 'Kali Uchis ft. Tyler, the Creator', genre: 'rnb', mood: ['dreamy', 'uplifting', 'romantic'], tempo: 'slow', energy: 'low', year: 2018, decade: '2010s', tags: ['psychedelic', 'hopeful'] },
  { id: 'r32', title: 'Focus', artist: 'H.E.R.', genre: 'rnb', mood: ['romantic', 'sensual', 'calm'], tempo: 'slow', energy: 'low', year: 2016, decade: '2010s', tags: ['contemporary', 'intimate'] },
  { id: 'r33', title: 'Come Over', artist: 'Jorja Smith', genre: 'rnb', mood: ['romantic', 'calm', 'sensual'], tempo: 'slow', energy: 'low', year: 2018, decade: '2010s', tags: ['UK r&b', 'soulful'] },
  { id: 'r34', title: 'On & On', artist: 'Erykah Badu', genre: 'rnb', subGenre: 'soul', mood: ['chill', 'introspective', 'dreamy'], tempo: 'slow', energy: 'low', year: 1997, decade: '1990s', tags: ['neo-soul', 'signature'] },
  { id: 'r35', title: 'Brown Skin Girl', artist: 'Beyonce ft. Wizkid & Saint Jhn', genre: 'rnb', mood: ['uplifting', 'romantic', 'celebratory'], tempo: 'slow', energy: 'low', year: 2019, decade: '2010s', tags: ['afrobeats', 'empowering'] },

  // CLASSICAL (30+ tracks)
  { id: 'c1', title: 'Nocturne Op. 9 No. 2', artist: 'Frederic Chopin', genre: 'classical', mood: ['romantic', 'dreamy', 'calm'], tempo: 'slow', energy: 'low', year: 1832, decade: '1830s', tags: ['piano', 'romantic era'] },
  { id: 'c2', title: 'Clair de Lune', artist: 'Claude Debussy', genre: 'classical', mood: ['dreamy', 'calm', 'ethereal'], tempo: 'slow', energy: 'low', year: 1905, decade: '1900s', tags: ['piano', 'impressionist'] },
  { id: 'c3', title: 'Gymnopedies No. 1', artist: 'Erik Satie', genre: 'classical', mood: ['calm', 'melancholic', 'introspective'], tempo: 'slow', energy: 'low', year: 1888, decade: '1880s', tags: ['piano', 'minimalist'] },
  { id: 'c4', title: 'Moonlight Sonata', artist: 'Ludwig van Beethoven', genre: 'classical', mood: ['melancholic', 'dark', 'introspective'], tempo: 'slow', energy: 'low', year: 1801, decade: '1800s', tags: ['piano', 'iconic'] },
  { id: 'c5', title: 'Arabesque No. 1', artist: 'Claude Debussy', genre: 'classical', mood: ['dreamy', 'romantic', 'ethereal'], tempo: 'medium', energy: 'low', year: 1891, decade: '1890s', tags: ['piano', 'impressionist'] },
  { id: 'c6', title: 'Reverie', artist: 'Claude Debussy', genre: 'classical', mood: ['dreamy', 'calm', 'romantic'], tempo: 'slow', energy: 'low', year: 1890, decade: '1890s', tags: ['piano', 'impressionist'] },
  { id: 'c7', title: 'Ballade No. 1 in G minor', artist: 'Frederic Chopin', genre: 'classical', mood: ['romantic', 'dramatic', 'melancholic'], tempo: 'medium', energy: 'medium', year: 1835, decade: '1830s', tags: ['piano', 'virtuosic'] },
  { id: 'c8', title: 'Prelude in E minor Op. 28 No. 4', artist: 'Frederic Chopin', genre: 'classical', mood: ['melancholic', 'dark', 'introspective'], tempo: 'slow', energy: 'low', year: 1839, decade: '1830s', tags: ['piano', 'haunting'] },
  { id: 'c9', title: 'The Four Seasons - Winter', artist: 'Antonio Vivaldi', genre: 'classical', mood: ['dark', 'dramatic', 'mysterious'], tempo: 'fast', energy: 'high', year: 1723, decade: '1720s', tags: ['violin', 'baroque'] },
  { id: 'c10', title: 'Canon in D', artist: 'Johann Pachelbel', genre: 'classical', mood: ['romantic', 'calm', 'uplifting'], tempo: 'slow', energy: 'low', year: 1680, decade: '1680s', tags: ['baroque', 'wedding'] },
  { id: 'c11', title: 'Prelude in C Major BWV 846', artist: 'J.S. Bach', genre: 'classical', mood: ['calm', 'uplifting', 'introspective'], tempo: 'medium', energy: 'low', year: 1722, decade: '1720s', tags: ['piano', 'baroque'] },
  { id: 'c12', title: 'La Campanella', artist: 'Franz Liszt', genre: 'classical', mood: ['energetic', 'dramatic', 'uplifting'], tempo: 'fast', energy: 'high', year: 1851, decade: '1850s', tags: ['piano', 'virtuosic'] },
  { id: 'c13', title: 'Liebestraum No. 3', artist: 'Franz Liszt', genre: 'classical', mood: ['romantic', 'dreamy', 'passionate'], tempo: 'slow', energy: 'low', year: 1850, decade: '1850s', tags: ['piano', 'love dream'] },
  { id: 'c14', title: 'Gnossienne No. 1', artist: 'Erik Satie', genre: 'classical', mood: ['mysterious', 'calm', 'introspective'], tempo: 'slow', energy: 'low', year: 1893, decade: '1890s', tags: ['piano', 'avant-garde'] },
  { id: 'c15', title: 'Adagio for Strings', artist: 'Samuel Barber', genre: 'classical', mood: ['melancholic', 'emotional', 'dramatic'], tempo: 'slow', energy: 'low', year: 1936, decade: '1930s', tags: ['orchestra', 'moving'] },
  { id: 'c16', title: 'The Swan', artist: 'Camille Saint-Saens', genre: 'classical', mood: ['romantic', 'calm', 'ethereal'], tempo: 'slow', energy: 'low', year: 1886, decade: '1880s', tags: ['cello', 'graceful'] },
  { id: 'c17', title: 'Piano Concerto No. 21', artist: 'Wolfgang Amadeus Mozart', genre: 'classical', mood: ['romantic', 'uplifting', 'calm'], tempo: 'medium', energy: 'medium', year: 1785, decade: '1780s', tags: ['piano concerto', 'elvira madigan'] },
  { id: 'c18', title: 'Nessun Dorma', artist: 'Giacomo Puccini', genre: 'classical', mood: ['dramatic', 'romantic', 'uplifting'], tempo: 'medium', energy: 'high', year: 1926, decade: '1920s', tags: ['opera', 'aria'] },
  { id: 'c19', title: 'Ave Maria', artist: 'Franz Schubert', genre: 'classical', mood: ['calm', 'ethereal', 'romantic'], tempo: 'slow', energy: 'low', year: 1825, decade: '1820s', tags: ['vocal', 'prayer'] },
  { id: 'c20', title: 'Fur Elise', artist: 'Ludwig van Beethoven', genre: 'classical', mood: ['romantic', 'melancholic', 'playful'], tempo: 'medium', energy: 'low', year: 1810, decade: '1810s', tags: ['piano', 'iconic'] },
  { id: 'c21', title: 'Symphony No. 9 - Ode to Joy', artist: 'Ludwig van Beethoven', genre: 'classical', mood: ['uplifting', 'dramatic', 'celebratory'], tempo: 'fast', energy: 'high', year: 1824, decade: '1820s', tags: ['symphony', 'choral'] },
  { id: 'c22', title: 'Requiem - Lacrimosa', artist: 'Wolfgang Amadeus Mozart', genre: 'classical', mood: ['dark', 'melancholic', 'dramatic'], tempo: 'slow', energy: 'medium', year: 1791, decade: '1790s', tags: ['choral', 'requiem'] },
  { id: 'c23', title: 'Pavane', artist: 'Gabriel Faure', genre: 'classical', mood: ['melancholic', 'ethereal', 'romantic'], tempo: 'slow', energy: 'low', year: 1887, decade: '1880s', tags: ['orchestra', 'elegant'] },
  { id: 'c24', title: 'Prelude a l\'apres-midi d\'un faune', artist: 'Claude Debussy', genre: 'classical', mood: ['dreamy', 'ethereal', 'sensual'], tempo: 'slow', energy: 'low', year: 1894, decade: '1890s', tags: ['orchestra', 'impressionist'] },
  { id: 'c25', title: 'In the Hall of the Mountain King', artist: 'Edvard Grieg', genre: 'classical', mood: ['mysterious', 'energetic', 'dramatic'], tempo: 'fast', energy: 'high', year: 1875, decade: '1870s', tags: ['orchestra', 'building intensity'] },
  { id: 'c26', title: 'Dance of the Sugar Plum Fairy', artist: 'Pyotr Ilyich Tchaikovsky', genre: 'classical', mood: ['mysterious', 'ethereal', 'playful'], tempo: 'medium', energy: 'low', year: 1892, decade: '1890s', tags: ['ballet', 'celesta'] },
  { id: 'c27', title: 'Air on the G String', artist: 'J.S. Bach', genre: 'classical', mood: ['calm', 'romantic', 'introspective'], tempo: 'slow', energy: 'low', year: 1717, decade: '1710s', tags: ['baroque', 'strings'] },
  { id: 'c28', title: 'Rhapsody in Blue', artist: 'George Gershwin', genre: 'classical', subGenre: 'jazz', mood: ['energetic', 'romantic', 'uplifting'], tempo: 'medium', energy: 'high', year: 1924, decade: '1920s', tags: ['jazz fusion', 'American'] },
  { id: 'c29', title: 'The Planets - Jupiter', artist: 'Gustav Holst', genre: 'classical', mood: ['uplifting', 'dramatic', 'majestic'], tempo: 'medium', energy: 'high', year: 1916, decade: '1910s', tags: ['orchestra', 'epic'] },
  { id: 'c30', title: 'Meditation from Thais', artist: 'Jules Massenet', genre: 'classical', mood: ['romantic', 'calm', 'melancholic'], tempo: 'slow', energy: 'low', year: 1894, decade: '1890s', tags: ['violin', 'opera'] },

  // JAZZ (30+ tracks)
  { id: 'j1', title: 'So What', artist: 'Miles Davis', genre: 'jazz', mood: ['chill', 'introspective', 'mysterious'], tempo: 'medium', energy: 'low', year: 1959, decade: '1950s', tags: ['modal jazz', 'cool'] },
  { id: 'j2', title: 'A Love Supreme, Pt. 1', artist: 'John Coltrane', genre: 'jazz', mood: ['introspective', 'ethereal', 'uplifting'], tempo: 'medium', energy: 'medium', year: 1965, decade: '1960s', tags: ['spiritual', 'modal'] },
  { id: 'j3', title: 'Strange Fruit', artist: 'Billie Holiday', genre: 'jazz', mood: ['dark', 'melancholic', 'haunting'], tempo: 'slow', energy: 'low', year: 1939, decade: '1930s', tags: ['protest', 'vocal'] },
  { id: 'j4', title: 'Take Five', artist: 'Dave Brubeck', genre: 'jazz', mood: ['chill', 'introspective', 'cool'], tempo: 'medium', energy: 'medium', year: 1959, decade: '1950s', tags: ['cool jazz', 'odd time'] },
  { id: 'j5', title: 'My Funny Valentine', artist: 'Chet Baker', genre: 'jazz', mood: ['romantic', 'melancholic', 'dreamy'], tempo: 'slow', energy: 'low', year: 1954, decade: '1950s', tags: ['vocal', 'intimate'] },
  { id: 'j6', title: 'Round Midnight', artist: 'Thelonious Monk', genre: 'jazz', mood: ['dark', 'introspective', 'mysterious'], tempo: 'slow', energy: 'low', year: 1947, decade: '1940s', tags: ['bebop', 'standard'] },
  { id: 'j7', title: 'Blue in Green', artist: 'Miles Davis', genre: 'jazz', mood: ['melancholic', 'dreamy', 'calm'], tempo: 'slow', energy: 'low', year: 1959, decade: '1950s', tags: ['modal', 'Kind of Blue'] },
  { id: 'j8', title: 'Autumn Leaves', artist: 'Cannonball Adderley', genre: 'jazz', mood: ['melancholic', 'romantic', 'nostalgic'], tempo: 'medium', energy: 'medium', year: 1958, decade: '1950s', tags: ['standard', 'classic'] },
  { id: 'j9', title: 'Summertime', artist: 'Ella Fitzgerald', genre: 'jazz', mood: ['calm', 'dreamy', 'romantic'], tempo: 'slow', energy: 'low', year: 1968, decade: '1960s', tags: ['vocal', 'Gershwin'] },
  { id: 'j10', title: 'In a Sentimental Mood', artist: 'Duke Ellington', genre: 'jazz', mood: ['romantic', 'calm', 'dreamy'], tempo: 'slow', energy: 'low', year: 1935, decade: '1930s', tags: ['big band', 'ballad'] },
  { id: 'j11', title: 'Stolen Moments', artist: 'Oliver Nelson', genre: 'jazz', mood: ['introspective', 'calm', 'mysterious'], tempo: 'slow', energy: 'low', year: 1961, decade: '1960s', tags: ['hard bop', 'mellow'] },
  { id: 'j12', title: 'Body and Soul', artist: 'Coleman Hawkins', genre: 'jazz', mood: ['romantic', 'sensual', 'introspective'], tempo: 'slow', energy: 'low', year: 1939, decade: '1930s', tags: ['tenor sax', 'standard'] },
  { id: 'j13', title: 'Misty', artist: 'Erroll Garner', genre: 'jazz', mood: ['romantic', 'dreamy', 'calm'], tempo: 'slow', energy: 'low', year: 1954, decade: '1950s', tags: ['piano', 'ballad'] },
  { id: 'j14', title: 'Naima', artist: 'John Coltrane', genre: 'jazz', mood: ['romantic', 'calm', 'ethereal'], tempo: 'slow', energy: 'low', year: 1959, decade: '1950s', tags: ['ballad', 'love song'] },
  { id: 'j15', title: 'Black Coffee', artist: 'Peggy Lee', genre: 'jazz', mood: ['melancholic', 'sensual', 'introspective'], tempo: 'slow', energy: 'low', year: 1948, decade: '1940s', tags: ['vocal', 'torch song'] },
  { id: 'j16', title: 'What a Wonderful World', artist: 'Louis Armstrong', genre: 'jazz', mood: ['uplifting', 'romantic', 'calm'], tempo: 'slow', energy: 'low', year: 1967, decade: '1960s', tags: ['vocal', 'iconic'] },
  { id: 'j17', title: 'Feeling Good', artist: 'Nina Simone', genre: 'jazz', mood: ['uplifting', 'dramatic', 'confident'], tempo: 'slow', energy: 'medium', year: 1965, decade: '1960s', tags: ['vocal', 'empowering'] },
  { id: 'j18', title: 'Sinnerman', artist: 'Nina Simone', genre: 'jazz', mood: ['energetic', 'intense', 'dark'], tempo: 'fast', energy: 'high', year: 1965, decade: '1960s', tags: ['spiritual', 'epic'] },
  { id: 'j19', title: 'I Put a Spell on You', artist: 'Nina Simone', genre: 'jazz', mood: ['dark', 'sensual', 'mysterious'], tempo: 'slow', energy: 'medium', year: 1965, decade: '1960s', tags: ['cover', 'sultry'] },
  { id: 'j20', title: 'Moanin\'', artist: 'Art Blakey', genre: 'jazz', mood: ['energetic', 'dark', 'groovy'], tempo: 'medium', energy: 'high', year: 1958, decade: '1950s', tags: ['hard bop', 'bluesy'] },
  { id: 'j21', title: 'Spain', artist: 'Chick Corea', genre: 'jazz', mood: ['energetic', 'romantic', 'uplifting'], tempo: 'fast', energy: 'high', year: 1972, decade: '1970s', tags: ['fusion', 'latin'] },
  { id: 'j22', title: 'Giant Steps', artist: 'John Coltrane', genre: 'jazz', mood: ['energetic', 'intense', 'uplifting'], tempo: 'fast', energy: 'high', year: 1960, decade: '1960s', tags: ['bebop', 'technical'] },
  { id: 'j23', title: 'Goodbye Pork Pie Hat', artist: 'Charles Mingus', genre: 'jazz', mood: ['melancholic', 'introspective', 'dark'], tempo: 'slow', energy: 'low', year: 1959, decade: '1950s', tags: ['elegy', 'bass'] },
  { id: 'j24', title: 'Girl from Ipanema', artist: 'Astrud Gilberto', genre: 'jazz', subGenre: 'world', mood: ['romantic', 'calm', 'dreamy'], tempo: 'medium', energy: 'low', year: 1964, decade: '1960s', tags: ['bossa nova', 'Brazilian'] },
  { id: 'j25', title: 'Freddie Freeloader', artist: 'Miles Davis', genre: 'jazz', mood: ['chill', 'groovy', 'calm'], tempo: 'medium', energy: 'medium', year: 1959, decade: '1950s', tags: ['modal', 'blues'] },
  { id: 'j26', title: 'All Blues', artist: 'Miles Davis', genre: 'jazz', mood: ['calm', 'introspective', 'dreamy'], tempo: 'medium', energy: 'low', year: 1959, decade: '1950s', tags: ['modal', '6/8 time'] },
  { id: 'j27', title: 'Night in Tunisia', artist: 'Dizzy Gillespie', genre: 'jazz', mood: ['energetic', 'mysterious', 'exotic'], tempo: 'fast', energy: 'high', year: 1942, decade: '1940s', tags: ['bebop', 'Afro-Cuban'] },
  { id: 'j28', title: 'Caravan', artist: 'Duke Ellington', genre: 'jazz', mood: ['mysterious', 'energetic', 'exotic'], tempo: 'medium', energy: 'high', year: 1936, decade: '1930s', tags: ['big band', 'exotica'] },
  { id: 'j29', title: 'Cantaloupe Island', artist: 'Herbie Hancock', genre: 'jazz', mood: ['groovy', 'chill', 'energetic'], tempo: 'medium', energy: 'medium', year: 1964, decade: '1960s', tags: ['hard bop', 'funky'] },
  { id: 'j30', title: 'Watermelon Man', artist: 'Herbie Hancock', genre: 'jazz', mood: ['energetic', 'groovy', 'uplifting'], tempo: 'medium', energy: 'high', year: 1962, decade: '1960s', tags: ['hard bop', 'funky'] },

  // LO-FI/AMBIENT (25+ tracks)
  { id: 'l1', title: 'Snowman', artist: 'WYS', genre: 'lofi', mood: ['calm', 'dreamy', 'focus'], tempo: 'slow', energy: 'low', year: 2019, decade: '2010s', tags: ['study beats', 'chill'] },
  { id: 'l2', title: 'Coffee', artist: 'Beabadoobee', genre: 'lofi', mood: ['romantic', 'dreamy', 'calm'], tempo: 'slow', energy: 'low', year: 2017, decade: '2010s', tags: ['bedroom pop', 'indie'] },
  { id: 'l3', title: 'Sleepy Fish', artist: 'Sleepy Fish', genre: 'lofi', mood: ['calm', 'sleep', 'dreamy'], tempo: 'slow', energy: 'low', year: 2020, decade: '2020s', tags: ['ambient', 'relaxing'] },
  { id: 'l4', title: 'Affection', artist: 'Jinsang', genre: 'lofi', mood: ['romantic', 'calm', 'nostalgic'], tempo: 'slow', energy: 'low', year: 2017, decade: '2010s', tags: ['sample-based', 'warm'] },
  { id: 'l5', title: 'Luv Letter', artist: 'DJ Okawari', genre: 'lofi', mood: ['romantic', 'calm', 'dreamy'], tempo: 'slow', energy: 'low', year: 2008, decade: '2000s', tags: ['piano', 'Japanese'] },
  { id: 'l6', title: 'Shiki No Uta', artist: 'Nujabes', genre: 'lofi', subGenre: 'hiphop', mood: ['melancholic', 'calm', 'introspective'], tempo: 'medium', energy: 'low', year: 2004, decade: '2000s', tags: ['Samurai Champloo', 'iconic'] },
  { id: 'l7', title: 'Aruarian Dance', artist: 'Nujabes', genre: 'lofi', mood: ['calm', 'dreamy', 'nostalgic'], tempo: 'slow', energy: 'low', year: 2004, decade: '2000s', tags: ['sample-based', 'legendary'] },
  { id: 'l8', title: 'Feather', artist: 'Nujabes', genre: 'lofi', mood: ['uplifting', 'calm', 'focus'], tempo: 'medium', energy: 'low', year: 2005, decade: '2000s', tags: ['chill hop', 'classic'] },
  { id: 'l9', title: 'Tomppabeats', artist: 'Harbor', genre: 'lofi', mood: ['calm', 'nostalgic', 'romantic'], tempo: 'slow', energy: 'low', year: 2017, decade: '2010s', tags: ['lofi hop', 'cozy'] },
  { id: 'l10', title: 'Idea 10', artist: 'Gibran Alcocer', genre: 'lofi', subGenre: 'classical', mood: ['melancholic', 'calm', 'introspective'], tempo: 'slow', energy: 'low', year: 2019, decade: '2010s', tags: ['piano', 'modern classical'] },
  { id: 'l11', title: 'An Ending (Ascent)', artist: 'Brian Eno', genre: 'ambient', mood: ['ethereal', 'calm', 'uplifting'], tempo: 'slow', energy: 'low', year: 1983, decade: '1980s', tags: ['ambient', 'Apollo'] },
  { id: 'l12', title: 'Music for Airports 1/1', artist: 'Brian Eno', genre: 'ambient', mood: ['calm', 'ethereal', 'introspective'], tempo: 'slow', energy: 'low', year: 1978, decade: '1970s', tags: ['ambient', 'pioneering'] },
  { id: 'l13', title: 'Avril 14th', artist: 'Aphex Twin', genre: 'ambient', subGenre: 'electronic', mood: ['melancholic', 'calm', 'introspective'], tempo: 'slow', energy: 'low', year: 2001, decade: '2000s', tags: ['piano', 'prepared piano'] },
  { id: 'l14', title: 'Weightless', artist: 'Marconi Union', genre: 'ambient', mood: ['calm', 'sleep', 'ethereal'], tempo: 'slow', energy: 'low', year: 2011, decade: '2010s', tags: ['therapeutic', 'relaxation'] },
  { id: 'l15', title: 'I Giorni', artist: 'Ludovico Einaudi', genre: 'ambient', subGenre: 'classical', mood: ['calm', 'romantic', 'introspective'], tempo: 'slow', energy: 'low', year: 2001, decade: '2000s', tags: ['piano', 'minimalist'] },
  { id: 'l16', title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', genre: 'ambient', subGenre: 'classical', mood: ['romantic', 'dreamy', 'uplifting'], tempo: 'slow', energy: 'low', year: 2004, decade: '2000s', tags: ['piano', 'popular'] },
  { id: 'l17', title: 'Experience', artist: 'Ludovico Einaudi', genre: 'ambient', subGenre: 'classical', mood: ['dramatic', 'uplifting', 'introspective'], tempo: 'slow', energy: 'medium', year: 2013, decade: '2010s', tags: ['piano', 'building'] },
  { id: 'l18', title: 'On the Nature of Daylight', artist: 'Max Richter', genre: 'ambient', subGenre: 'classical', mood: ['melancholic', 'ethereal', 'haunting'], tempo: 'slow', energy: 'low', year: 2004, decade: '2000s', tags: ['strings', 'film'] },
  { id: 'l19', title: 'Bloom', artist: 'The Paper Kites', genre: 'lofi', subGenre: 'indie', mood: ['romantic', 'calm', 'dreamy'], tempo: 'slow', energy: 'low', year: 2013, decade: '2010s', tags: ['folk', 'intimate'] },
  { id: 'l20', title: 'Sunset Lover', artist: 'Petit Biscuit', genre: 'lofi', subGenre: 'electronic', mood: ['uplifting', 'dreamy', 'romantic'], tempo: 'medium', energy: 'low', year: 2015, decade: '2010s', tags: ['electronic', 'summer'] },
  { id: 'l21', title: 'Eveningland', artist: 'Hammock', genre: 'ambient', mood: ['ethereal', 'dreamy', 'calm'], tempo: 'slow', energy: 'low', year: 2005, decade: '2000s', tags: ['post-rock', 'atmospheric'] },
  { id: 'l22', title: 'Everything in Its Right Place', artist: 'Radiohead', genre: 'ambient', subGenre: 'rock', mood: ['introspective', 'mysterious', 'dark'], tempo: 'slow', energy: 'low', year: 2000, decade: '2000s', tags: ['art rock', 'Kid A'] },
  { id: 'l23', title: 'Porcelain', artist: 'Moby', genre: 'ambient', subGenre: 'electronic', mood: ['melancholic', 'calm', 'ethereal'], tempo: 'slow', energy: 'low', year: 1999, decade: '1990s', tags: ['chill out', 'sampled'] },
  { id: 'l24', title: 'Pure Shores', artist: 'All Saints', genre: 'ambient', subGenre: 'electronic', mood: ['dreamy', 'calm', 'ethereal'], tempo: 'medium', energy: 'low', year: 2000, decade: '2000s', tags: ['trip-hop', 'Beach soundtrack'] },
  { id: 'l25', title: 'Outro', artist: 'M83', genre: 'ambient', subGenre: 'electronic', mood: ['uplifting', 'ethereal', 'dramatic'], tempo: 'slow', energy: 'medium', year: 2011, decade: '2010s', tags: ['synth', 'cinematic'] },

  // HIP-HOP (25+ tracks)
  { id: 'h1', title: 'Juicy', artist: 'The Notorious B.I.G.', genre: 'hiphop', mood: ['uplifting', 'nostalgic', 'confident'], tempo: 'medium', energy: 'medium', year: 1994, decade: '1990s', tags: ['East Coast', 'classic'] },
  { id: 'h2', title: 'N.Y. State of Mind', artist: 'Nas', genre: 'hiphop', mood: ['dark', 'introspective', 'intense'], tempo: 'medium', energy: 'medium', year: 1994, decade: '1990s', tags: ['East Coast', 'storytelling'] },
  { id: 'h3', title: 'C.R.E.A.M.', artist: 'Wu-Tang Clan', genre: 'hiphop', mood: ['dark', 'introspective', 'nostalgic'], tempo: 'slow', energy: 'medium', year: 1993, decade: '1990s', tags: ['East Coast', 'gritty'] },
  { id: 'h4', title: 'Electric Relaxation', artist: 'A Tribe Called Quest', genre: 'hiphop', mood: ['chill', 'romantic', 'groovy'], tempo: 'medium', energy: 'low', year: 1993, decade: '1990s', tags: ['jazz rap', 'smooth'] },
  { id: 'h5', title: 'Passin\' Me By', artist: 'The Pharcyde', genre: 'hiphop', mood: ['melancholic', 'romantic', 'nostalgic'], tempo: 'medium', energy: 'low', year: 1992, decade: '1990s', tags: ['alternative', 'sample-based'] },
  { id: 'h6', title: 'Runaway', artist: 'Kanye West ft. Pusha T', genre: 'hiphop', mood: ['melancholic', 'introspective', 'dramatic'], tempo: 'medium', energy: 'medium', year: 2010, decade: '2010s', tags: ['art rap', 'cinematic'] },
  { id: 'h7', title: 'Alright', artist: 'Kendrick Lamar', genre: 'hiphop', mood: ['uplifting', 'energetic', 'hopeful'], tempo: 'fast', energy: 'high', year: 2015, decade: '2010s', tags: ['conscious', 'anthem'] },
  { id: 'h8', title: 'Sing About Me, I\'m Dying of Thirst', artist: 'Kendrick Lamar', genre: 'hiphop', mood: ['dark', 'introspective', 'melancholic'], tempo: 'slow', energy: 'low', year: 2012, decade: '2010s', tags: ['storytelling', 'epic'] },
  { id: 'h9', title: 'Rosa Parks', artist: 'OutKast', genre: 'hiphop', mood: ['energetic', 'uplifting', 'playful'], tempo: 'fast', energy: 'high', year: 1998, decade: '1990s', tags: ['Southern', 'funky'] },
  { id: 'h10', title: 'Ms. Jackson', artist: 'OutKast', genre: 'hiphop', mood: ['melancholic', 'romantic', 'apologetic'], tempo: 'medium', energy: 'medium', year: 2000, decade: '2000s', tags: ['Southern', 'soulful'] },
  { id: 'h11', title: 'The Message', artist: 'Grandmaster Flash', genre: 'hiphop', mood: ['dark', 'intense', 'social'], tempo: 'medium', energy: 'medium', year: 1982, decade: '1980s', tags: ['old school', 'pioneering'] },
  { id: 'h12', title: 'Regulate', artist: 'Warren G & Nate Dogg', genre: 'hiphop', mood: ['chill', 'groovy', 'confident'], tempo: 'medium', energy: 'medium', year: 1994, decade: '1990s', tags: ['West Coast', 'G-funk'] },
  { id: 'h13', title: 'California Love', artist: '2Pac ft. Dr. Dre', genre: 'hiphop', mood: ['energetic', 'uplifting', 'confident'], tempo: 'fast', energy: 'high', year: 1995, decade: '1990s', tags: ['West Coast', 'anthem'] },
  { id: 'h14', title: 'Nuthin\' but a "G" Thang', artist: 'Dr. Dre ft. Snoop Dogg', genre: 'hiphop', mood: ['chill', 'confident', 'groovy'], tempo: 'medium', energy: 'medium', year: 1992, decade: '1990s', tags: ['G-funk', 'West Coast'] },
  { id: 'h15', title: 'Dear Mama', artist: '2Pac', genre: 'hiphop', mood: ['melancholic', 'romantic', 'nostalgic'], tempo: 'slow', energy: 'low', year: 1995, decade: '1990s', tags: ['emotional', 'tribute'] },
  { id: 'h16', title: 'Changes', artist: '2Pac', genre: 'hiphop', mood: ['melancholic', 'hopeful', 'social'], tempo: 'medium', energy: 'medium', year: 1998, decade: '1990s', tags: ['conscious', 'posthumous'] },
  { id: 'h17', title: 'Stan', artist: 'Eminem ft. Dido', genre: 'hiphop', mood: ['dark', 'intense', 'melancholic'], tempo: 'medium', energy: 'medium', year: 2000, decade: '2000s', tags: ['storytelling', 'dramatic'] },
  { id: 'h18', title: 'Lose Yourself', artist: 'Eminem', genre: 'hiphop', mood: ['intense', 'energetic', 'motivational'], tempo: 'fast', energy: 'high', year: 2002, decade: '2000s', tags: ['8 Mile', 'anthemic'] },
  { id: 'h19', title: 'HUMBLE.', artist: 'Kendrick Lamar', genre: 'hiphop', mood: ['energetic', 'confident', 'dark'], tempo: 'medium', energy: 'high', year: 2017, decade: '2010s', tags: ['trap influenced', 'minimalist'] },
  { id: 'h20', title: 'Money Trees', artist: 'Kendrick Lamar ft. Jay Rock', genre: 'hiphop', mood: ['introspective', 'chill', 'dark'], tempo: 'slow', energy: 'low', year: 2012, decade: '2010s', tags: ['West Coast', 'Beach House sample'] },
  { id: 'h21', title: 'Sicko Mode', artist: 'Travis Scott', genre: 'hiphop', mood: ['energetic', 'dark', 'intense'], tempo: 'fast', energy: 'high', year: 2018, decade: '2010s', tags: ['trap', 'psychedelic'] },
  { id: 'h22', title: 'DNA.', artist: 'Kendrick Lamar', genre: 'hiphop', mood: ['energetic', 'intense', 'confident'], tempo: 'fast', energy: 'high', year: 2017, decade: '2010s', tags: ['aggressive', 'DAMN.'] },
  { id: 'h23', title: 'Pyramids', artist: 'Frank Ocean', genre: 'hiphop', subGenre: 'rnb', mood: ['dreamy', 'introspective', 'sensual'], tempo: 'slow', energy: 'low', year: 2012, decade: '2010s', tags: ['experimental', 'epic'] },
  { id: 'h24', title: '93 \'Til Infinity', artist: 'Souls of Mischief', genre: 'hiphop', mood: ['chill', 'nostalgic', 'uplifting'], tempo: 'medium', energy: 'low', year: 1993, decade: '1990s', tags: ['alternative', 'bay area'] },
  { id: 'h25', title: 'Award Tour', artist: 'A Tribe Called Quest', genre: 'hiphop', mood: ['uplifting', 'groovy', 'chill'], tempo: 'medium', energy: 'medium', year: 1993, decade: '1990s', tags: ['jazz rap', 'classic'] },

  // WORLD MUSIC (20+ tracks)
  { id: 'w1', title: 'Pata Pata', artist: 'Miriam Makeba', genre: 'world', mood: ['uplifting', 'energetic', 'joyful'], tempo: 'fast', energy: 'high', year: 1967, decade: '1960s', tags: ['South African', 'Afropop'] },
  { id: 'w2', title: 'Ye ke Ye ke', artist: 'Mory Kante', genre: 'world', mood: ['energetic', 'uplifting', 'joyful'], tempo: 'fast', energy: 'high', year: 1987, decade: '1980s', tags: ['Guinean', 'Afrobeat'] },
  { id: 'w3', title: 'Biko', artist: 'Peter Gabriel', genre: 'world', mood: ['melancholic', 'uplifting', 'spiritual'], tempo: 'slow', energy: 'low', year: 1980, decade: '1980s', tags: ['protest', 'African influence'] },
  { id: 'w4', title: 'Mas Que Nada', artist: 'Sergio Mendes', genre: 'world', mood: ['energetic', 'uplifting', 'joyful'], tempo: 'fast', energy: 'high', year: 1966, decade: '1960s', tags: ['Brazilian', 'bossa nova'] },
  { id: 'w5', title: 'Waka Waka', artist: 'Shakira', genre: 'world', mood: ['energetic', 'uplifting', 'celebratory'], tempo: 'fast', energy: 'high', year: 2010, decade: '2010s', tags: ['African', 'World Cup'] },
  { id: 'w6', title: 'Bamboleo', artist: 'Gipsy Kings', genre: 'world', mood: ['energetic', 'romantic', 'passionate'], tempo: 'fast', energy: 'high', year: 1987, decade: '1980s', tags: ['Flamenco', 'Spanish'] },
  { id: 'w7', title: 'Chan Chan', artist: 'Buena Vista Social Club', genre: 'world', mood: ['nostalgic', 'romantic', 'chill'], tempo: 'medium', energy: 'low', year: 1997, decade: '1990s', tags: ['Cuban', 'son'] },
  { id: 'w8', title: 'Galang', artist: 'M.I.A.', genre: 'world', subGenre: 'electronic', mood: ['energetic', 'edgy', 'confident'], tempo: 'fast', energy: 'high', year: 2003, decade: '2000s', tags: ['Sri Lankan', 'grime'] },
  { id: 'w9', title: 'Paper Planes', artist: 'M.I.A.', genre: 'world', subGenre: 'hiphop', mood: ['energetic', 'edgy', 'dark'], tempo: 'medium', energy: 'high', year: 2007, decade: '2000s', tags: ['global', 'political'] },
  { id: 'w10', title: 'Jai Ho', artist: 'A.R. Rahman', genre: 'world', mood: ['uplifting', 'energetic', 'celebratory'], tempo: 'fast', energy: 'high', year: 2008, decade: '2000s', tags: ['Bollywood', 'Indian'] },
  { id: 'w11', title: 'Desert Rose', artist: 'Sting ft. Cheb Mami', genre: 'world', mood: ['romantic', 'mysterious', 'dreamy'], tempo: 'medium', energy: 'medium', year: 1999, decade: '1990s', tags: ['Rai', 'Algerian'] },
  { id: 'w12', title: 'Yeke Yeke (Hardfloor Mix)', artist: 'Mory Kante', genre: 'world', subGenre: 'electronic', mood: ['energetic', 'uplifting', 'hypnotic'], tempo: 'fast', energy: 'high', year: 1996, decade: '1990s', tags: ['trance', 'Afrobeat'] },
  { id: 'w13', title: 'Djelem Djelem', artist: 'Taraf de Haidouks', genre: 'world', mood: ['melancholic', 'passionate', 'dramatic'], tempo: 'medium', energy: 'medium', year: 2001, decade: '2000s', tags: ['Romani', 'gypsy'] },
  { id: 'w14', title: 'Didi', artist: 'Khaled', genre: 'world', mood: ['energetic', 'romantic', 'uplifting'], tempo: 'fast', energy: 'high', year: 1992, decade: '1990s', tags: ['Rai', 'Algerian'] },
  { id: 'w15', title: 'Nkosi Sikelel\'i Afrika', artist: 'Ladysmith Black Mambazo', genre: 'world', mood: ['uplifting', 'spiritual', 'emotional'], tempo: 'slow', energy: 'medium', year: 1987, decade: '1980s', tags: ['South African', 'isicathamiya'] },
  { id: 'w16', title: 'Asimbonanga', artist: 'Johnny Clegg', genre: 'world', mood: ['melancholic', 'uplifting', 'political'], tempo: 'medium', energy: 'medium', year: 1987, decade: '1980s', tags: ['South African', 'protest'] },
  { id: 'w17', title: 'Yamore', artist: 'Salif Keita ft. Cesaria Evora', genre: 'world', mood: ['romantic', 'melancholic', 'ethereal'], tempo: 'slow', energy: 'low', year: 2002, decade: '2000s', tags: ['Malian', 'Cape Verdean'] },
  { id: 'w18', title: 'Orinoco Flow', artist: 'Enya', genre: 'world', subGenre: 'ambient', mood: ['ethereal', 'uplifting', 'dreamy'], tempo: 'medium', energy: 'low', year: 1988, decade: '1980s', tags: ['Celtic', 'New Age'] },
  { id: 'w19', title: 'Sakura', artist: 'Traditional Japanese', genre: 'world', mood: ['calm', 'melancholic', 'ethereal'], tempo: 'slow', energy: 'low', year: 1900, decade: '1900s', tags: ['Japanese', 'traditional'] },
  { id: 'w20', title: 'Feeling Good', artist: 'Avicii ft. Audra Mae', genre: 'world', subGenre: 'electronic', mood: ['energetic', 'uplifting', 'celebratory'], tempo: 'fast', energy: 'high', year: 2015, decade: '2010s', tags: ['EDM', 'festival'] },

  // ELECTRONIC (20+ tracks)
  { id: 'e1', title: 'Midnight City', artist: 'M83', genre: 'electronic', mood: ['energetic', 'nostalgic', 'uplifting'], tempo: 'fast', energy: 'high', year: 2011, decade: '2010s', tags: ['synthpop', '80s inspired'] },
  { id: 'e2', title: 'Around the World', artist: 'Daft Punk', genre: 'electronic', mood: ['energetic', 'hypnotic', 'groovy'], tempo: 'fast', energy: 'high', year: 1997, decade: '1990s', tags: ['French house', 'repetitive'] },
  { id: 'e3', title: 'One More Time', artist: 'Daft Punk', genre: 'electronic', mood: ['uplifting', 'energetic', 'celebratory'], tempo: 'fast', energy: 'high', year: 2000, decade: '2000s', tags: ['house', 'anthemic'] },
  { id: 'e4', title: 'Strobe', artist: 'Deadmau5', genre: 'electronic', mood: ['melancholic', 'uplifting', 'dramatic'], tempo: 'medium', energy: 'medium', year: 2009, decade: '2000s', tags: ['progressive', 'emotional'] },
  { id: 'e5', title: 'Windowlicker', artist: 'Aphex Twin', genre: 'electronic', mood: ['mysterious', 'playful', 'dark'], tempo: 'medium', energy: 'medium', year: 1999, decade: '1990s', tags: ['IDM', 'experimental'] },
  { id: 'e6', title: 'Sandstorm', artist: 'Darude', genre: 'electronic', mood: ['energetic', 'uplifting', 'intense'], tempo: 'fast', energy: 'high', year: 1999, decade: '1990s', tags: ['trance', 'meme'] },
  { id: 'e7', title: 'In for the Kill', artist: 'La Roux', genre: 'electronic', mood: ['dark', 'energetic', 'romantic'], tempo: 'medium', energy: 'high', year: 2009, decade: '2000s', tags: ['synth pop', 'new wave'] },
  { id: 'e8', title: 'Dissolve', artist: 'Liquid Stranger', genre: 'electronic', mood: ['dark', 'intense', 'mysterious'], tempo: 'medium', energy: 'high', year: 2019, decade: '2010s', tags: ['bass', 'dubstep'] },
  { id: 'e9', title: 'Scary Monsters and Nice Sprites', artist: 'Skrillex', genre: 'electronic', mood: ['energetic', 'intense', 'dark'], tempo: 'fast', energy: 'high', year: 2010, decade: '2010s', tags: ['dubstep', 'brostep'] },
  { id: 'e10', title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell', genre: 'electronic', mood: ['uplifting', 'groovy', 'romantic'], tempo: 'medium', energy: 'medium', year: 2013, decade: '2010s', tags: ['disco', 'funk'] },
  { id: 'e11', title: 'Digital Love', artist: 'Daft Punk', genre: 'electronic', mood: ['romantic', 'dreamy', 'uplifting'], tempo: 'medium', energy: 'medium', year: 2001, decade: '2000s', tags: ['house', 'vocoder'] },
  { id: 'e12', title: 'Born Slippy', artist: 'Underworld', genre: 'electronic', mood: ['intense', 'dark', 'hypnotic'], tempo: 'fast', energy: 'high', year: 1996, decade: '1990s', tags: ['techno', 'Trainspotting'] },
  { id: 'e13', title: 'Children', artist: 'Robert Miles', genre: 'electronic', mood: ['dreamy', 'uplifting', 'melancholic'], tempo: 'medium', energy: 'medium', year: 1995, decade: '1990s', tags: ['dream trance', 'iconic'] },
  { id: 'e14', title: 'Opus', artist: 'Eric Prydz', genre: 'electronic', mood: ['uplifting', 'dramatic', 'ethereal'], tempo: 'medium', energy: 'high', year: 2016, decade: '2010s', tags: ['progressive', 'epic'] },
  { id: 'e15', title: 'Levels', artist: 'Avicii', genre: 'electronic', mood: ['uplifting', 'energetic', 'celebratory'], tempo: 'fast', energy: 'high', year: 2011, decade: '2010s', tags: ['EDM', 'anthemic'] },
  { id: 'e16', title: 'Titanium', artist: 'David Guetta ft. Sia', genre: 'electronic', mood: ['uplifting', 'energetic', 'empowering'], tempo: 'fast', energy: 'high', year: 2011, decade: '2010s', tags: ['EDM', 'vocal'] },
  { id: 'e17', title: 'Ghosts \'n\' Stuff', artist: 'Deadmau5 ft. Rob Swire', genre: 'electronic', mood: ['dark', 'energetic', 'mysterious'], tempo: 'fast', energy: 'high', year: 2008, decade: '2000s', tags: ['electro house', 'progressive'] },
  { id: 'e18', title: 'Innerbloom', artist: 'Rufus Du Sol', genre: 'electronic', mood: ['introspective', 'dreamy', 'romantic'], tempo: 'slow', energy: 'low', year: 2015, decade: '2010s', tags: ['deep house', 'indie dance'] },
  { id: 'e19', title: 'A Moment Apart', artist: 'Odesza', genre: 'electronic', mood: ['uplifting', 'dramatic', 'ethereal'], tempo: 'medium', energy: 'medium', year: 2017, decade: '2010s', tags: ['future bass', 'cinematic'] },
  { id: 'e20', title: 'Shelter', artist: 'Porter Robinson & Madeon', genre: 'electronic', mood: ['uplifting', 'melancholic', 'romantic'], tempo: 'fast', energy: 'high', year: 2016, decade: '2010s', tags: ['EDM', 'anime'] },

  // INDIE/ROCK (remaining tracks to reach 200+)
  { id: 'i1', title: 'Creep', artist: 'Radiohead', genre: 'indie', subGenre: 'rock', mood: ['melancholic', 'dark', 'introspective'], tempo: 'slow', energy: 'medium', year: 1992, decade: '1990s', tags: ['alternative', 'iconic'] },
  { id: 'i2', title: 'Karma Police', artist: 'Radiohead', genre: 'indie', subGenre: 'rock', mood: ['melancholic', 'mysterious', 'dark'], tempo: 'medium', energy: 'medium', year: 1997, decade: '1990s', tags: ['alternative', 'OK Computer'] },
  { id: 'i3', title: 'Smells Like Teen Spirit', artist: 'Nirvana', genre: 'rock', mood: ['energetic', 'dark', 'intense'], tempo: 'fast', energy: 'high', year: 1991, decade: '1990s', tags: ['grunge', 'iconic'] },
  { id: 'i4', title: 'The Less I Know the Better', artist: 'Tame Impala', genre: 'indie', mood: ['groovy', 'melancholic', 'romantic'], tempo: 'medium', energy: 'medium', year: 2015, decade: '2010s', tags: ['psychedelic', 'bass'] },
  { id: 'i5', title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', genre: 'indie', subGenre: 'rock', mood: ['sensual', 'dark', 'mysterious'], tempo: 'slow', energy: 'medium', year: 2013, decade: '2010s', tags: ['rock', 'riff'] },
  { id: 'i6', title: 'Take Me Out', artist: 'Franz Ferdinand', genre: 'indie', subGenre: 'rock', mood: ['energetic', 'uplifting', 'groovy'], tempo: 'fast', energy: 'high', year: 2004, decade: '2000s', tags: ['post-punk revival', 'dance'] },
  { id: 'i7', title: 'Mr. Brightside', artist: 'The Killers', genre: 'indie', subGenre: 'rock', mood: ['energetic', 'melancholic', 'romantic'], tempo: 'fast', energy: 'high', year: 2003, decade: '2000s', tags: ['alternative', 'anthemic'] },
  { id: 'i8', title: 'Somebody That I Used to Know', artist: 'Gotye ft. Kimbra', genre: 'indie', mood: ['melancholic', 'romantic', 'dramatic'], tempo: 'medium', energy: 'medium', year: 2011, decade: '2010s', tags: ['art pop', 'breakup'] },
  { id: 'i9', title: 'Ho Hey', artist: 'The Lumineers', genre: 'indie', subGenre: 'folk', mood: ['uplifting', 'romantic', 'joyful'], tempo: 'medium', energy: 'medium', year: 2012, decade: '2010s', tags: ['folk rock', 'singalong'] },
  { id: 'i10', title: 'Skinny Love', artist: 'Bon Iver', genre: 'indie', subGenre: 'folk', mood: ['melancholic', 'romantic', 'introspective'], tempo: 'slow', energy: 'low', year: 2007, decade: '2000s', tags: ['folk', 'falsetto'] },
  { id: 'i11', title: 'Holocene', artist: 'Bon Iver', genre: 'indie', subGenre: 'folk', mood: ['introspective', 'ethereal', 'melancholic'], tempo: 'slow', energy: 'low', year: 2011, decade: '2010s', tags: ['atmospheric', 'nature'] },
  { id: 'i12', title: 'Float On', artist: 'Modest Mouse', genre: 'indie', subGenre: 'rock', mood: ['uplifting', 'chill', 'optimistic'], tempo: 'medium', energy: 'medium', year: 2004, decade: '2000s', tags: ['alternative', 'positive'] },
  { id: 'i13', title: 'Two Weeks', artist: 'Grizzly Bear', genre: 'indie', mood: ['dreamy', 'uplifting', 'romantic'], tempo: 'medium', energy: 'medium', year: 2009, decade: '2000s', tags: ['baroque pop', 'vocal harmony'] },
  { id: 'i14', title: 'Sprawl II', artist: 'Arcade Fire', genre: 'indie', subGenre: 'electronic', mood: ['melancholic', 'uplifting', 'nostalgic'], tempo: 'medium', energy: 'medium', year: 2010, decade: '2010s', tags: ['synth', 'suburban'] },
  { id: 'i15', title: 'Youth', artist: 'Daughter', genre: 'indie', subGenre: 'folk', mood: ['melancholic', 'dark', 'introspective'], tempo: 'slow', energy: 'low', year: 2013, decade: '2010s', tags: ['dream folk', 'haunting'] },
];

// Room-to-music mapping suggestions
export const roomMusicSuggestions: Record<string, { genres: Genre[]; moods: Mood[]; description: string }> = {
  'grand-foyer': {
    genres: ['classical', 'jazz', 'ambient'],
    moods: ['romantic', 'ethereal', 'calm'],
    description: 'Elegant and welcoming orchestral pieces',
  },
  'ancestor-hall': {
    genres: ['classical', 'gothic', 'ambient'],
    moods: ['dark', 'mysterious', 'melancholic'],
    description: 'Haunting melodies honoring the past',
  },
  'wardrobe-palace': {
    genres: ['rnb', 'electronic', 'indie'],
    moods: ['uplifting', 'energetic', 'confident'],
    description: 'Fashion-forward beats for getting ready',
  },
  'library-study': {
    genres: ['classical', 'jazz', 'lofi'],
    moods: ['calm', 'focus', 'introspective'],
    description: 'Quiet concentration music for reading',
  },
  'apothecary': {
    genres: ['ambient', 'world', 'gothic'],
    moods: ['mysterious', 'ethereal', 'calm'],
    description: 'Mystical sounds for healing rituals',
  },
  'office-hub': {
    genres: ['lofi', 'jazz', 'electronic'],
    moods: ['focus', 'calm', 'energetic'],
    description: 'Productive beats for work sessions',
  },
  'gaming-den': {
    genres: ['electronic', 'hiphop', 'rock'],
    moods: ['energetic', 'intense', 'dark'],
    description: 'High-energy tracks for gaming',
  },
  'rooftop-observatory': {
    genres: ['ambient', 'classical', 'electronic'],
    moods: ['ethereal', 'dreamy', 'calm'],
    description: 'Celestial sounds for stargazing',
  },
  'dream-archives': {
    genres: ['ambient', 'lofi', 'gothic'],
    moods: ['dreamy', 'mysterious', 'sleep'],
    description: 'Surreal soundscapes for dream exploration',
  },
  'fortune-teller-alcove': {
    genres: ['world', 'gothic', 'ambient'],
    moods: ['mysterious', 'dark', 'ethereal'],
    description: 'Mystical music for divination',
  },
  'cloud-garden': {
    genres: ['ambient', 'lofi', 'world'],
    moods: ['calm', 'dreamy', 'uplifting'],
    description: 'Peaceful nature-inspired melodies',
  },
  'creative-studio': {
    genres: ['lofi', 'indie', 'electronic'],
    moods: ['focus', 'introspective', 'dreamy'],
    description: 'Inspiring beats for creative work',
  },
  'kitchen-lab': {
    genres: ['jazz', 'soul', 'world'],
    moods: ['uplifting', 'romantic', 'energetic'],
    description: 'Cooking vibes and kitchen jams',
  },
  'music-room': {
    genres: ['jazz', 'classical', 'lofi'],
    moods: ['romantic', 'calm', 'introspective'],
    description: 'Curated listening experience',
  },
  'pet-sanctuary': {
    genres: ['ambient', 'lofi', 'classical'],
    moods: ['calm', 'dreamy', 'uplifting'],
    description: 'Soothing sounds for pet relaxation',
  },
  'guest-quarters': {
    genres: ['jazz', 'lofi', 'rnb'],
    moods: ['romantic', 'chill', 'calm'],
    description: 'Welcoming ambiance for guests',
  },
};

// Activity-based playlist suggestions
export const activityPlaylists: Record<string, { genres: Genre[]; moods: Mood[]; tempo: ('slow' | 'medium' | 'fast')[]; energy: ('low' | 'medium' | 'high')[] }> = {
  studying: {
    genres: ['lofi', 'classical', 'ambient'],
    moods: ['focus', 'calm', 'introspective'],
    tempo: ['slow', 'medium'],
    energy: ['low'],
  },
  relaxing: {
    genres: ['ambient', 'lofi', 'jazz'],
    moods: ['calm', 'dreamy', 'chill'],
    tempo: ['slow'],
    energy: ['low'],
  },
  working: {
    genres: ['lofi', 'electronic', 'jazz'],
    moods: ['focus', 'calm', 'energetic'],
    tempo: ['medium'],
    energy: ['low', 'medium'],
  },
  exercising: {
    genres: ['electronic', 'hiphop', 'rock'],
    moods: ['energetic', 'uplifting', 'intense'],
    tempo: ['fast'],
    energy: ['high'],
  },
  sleeping: {
    genres: ['ambient', 'classical', 'lofi'],
    moods: ['sleep', 'calm', 'dreamy'],
    tempo: ['slow'],
    energy: ['low'],
  },
  cooking: {
    genres: ['jazz', 'soul', 'world'],
    moods: ['uplifting', 'romantic', 'chill'],
    tempo: ['medium'],
    energy: ['medium'],
  },
  meditating: {
    genres: ['ambient', 'world', 'classical'],
    moods: ['calm', 'ethereal', 'introspective'],
    tempo: ['slow'],
    energy: ['low'],
  },
  partying: {
    genres: ['electronic', 'hiphop', 'rnb'],
    moods: ['energetic', 'uplifting', 'sensual'],
    tempo: ['fast', 'medium'],
    energy: ['high'],
  },
  reading: {
    genres: ['classical', 'jazz', 'ambient'],
    moods: ['calm', 'introspective', 'dreamy'],
    tempo: ['slow'],
    energy: ['low'],
  },
  romantic: {
    genres: ['rnb', 'jazz', 'soul'],
    moods: ['romantic', 'sensual', 'calm'],
    tempo: ['slow', 'medium'],
    energy: ['low', 'medium'],
  },
};

// Time of day suggestions
export const timeOfDayPlaylists: Record<string, { genres: Genre[]; moods: Mood[]; description: string }> = {
  morning: {
    genres: ['lofi', 'jazz', 'indie'],
    moods: ['uplifting', 'calm', 'dreamy'],
    description: 'Gentle wake-up melodies',
  },
  afternoon: {
    genres: ['lofi', 'electronic', 'rnb'],
    moods: ['focus', 'chill', 'energetic'],
    description: 'Productive afternoon vibes',
  },
  evening: {
    genres: ['jazz', 'rnb', 'soul'],
    moods: ['romantic', 'calm', 'introspective'],
    description: 'Wind-down evening sounds',
  },
  night: {
    genres: ['gothic', 'ambient', 'electronic'],
    moods: ['dark', 'mysterious', 'dreamy'],
    description: 'Late-night atmospherics',
  },
  latenight: {
    genres: ['ambient', 'lofi', 'classical'],
    moods: ['sleep', 'calm', 'ethereal'],
    description: 'Peaceful sounds for rest',
  },
};

// Helper functions
export const getTracksByGenre = (genre: Genre): Track[] => {
  return musicLibrary.filter(track => track.genre === genre);
};

export const getTracksByMood = (mood: Mood): Track[] => {
  return musicLibrary.filter(track => track.mood.includes(mood));
};

export const getTracksByDecade = (decade: string): Track[] => {
  return musicLibrary.filter(track => track.decade === decade);
};

export const getTracksByTempo = (tempo: 'slow' | 'medium' | 'fast'): Track[] => {
  return musicLibrary.filter(track => track.tempo === tempo);
};

export const getTracksByEnergy = (energy: 'low' | 'medium' | 'high'): Track[] => {
  return musicLibrary.filter(track => track.energy === energy);
};

export const getSimilarTracks = (trackId: string, limit: number = 5): Track[] => {
  const track = musicLibrary.find(t => t.id === trackId);
  if (!track) return [];

  return musicLibrary
    .filter(t => t.id !== trackId)
    .map(t => ({
      track: t,
      score:
        (t.genre === track.genre ? 3 : 0) +
        (t.mood.filter(m => track.mood.includes(m)).length * 2) +
        (t.tempo === track.tempo ? 1 : 0) +
        (t.energy === track.energy ? 1 : 0) +
        (t.decade === track.decade ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.track);
};

export const getRandomTracks = (count: number = 10): Track[] => {
  const shuffled = [...musicLibrary].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const searchTracks = (query: string): Track[] => {
  const lowerQuery = query.toLowerCase();
  return musicLibrary.filter(track =>
    track.title.toLowerCase().includes(lowerQuery) ||
    track.artist.toLowerCase().includes(lowerQuery) ||
    track.genre.toLowerCase().includes(lowerQuery) ||
    track.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export default musicLibrary;
