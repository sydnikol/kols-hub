// Room Components
// All 16 rooms in the Gothic Dollhouse (4 floors x 4 rooms)

// Level 1 - Ground Floor
export { GrandFoyer } from './GrandFoyer';
export { AncestorHall } from './AncestorHall';
export { PetSanctuary } from './PetSanctuary';
export { GuestQuarters } from './GuestQuarters';

// Level 2 - Second Floor
export { OfficeHub } from './OfficeHub';
export { WardrobePalace } from './WardrobePalace';
export { KitchenLab } from './KitchenLab';
export { MusicRoom } from './MusicRoom';

// Level 3 - Third Floor
export { Apothecary } from './Apothecary';
export { GamingDen } from './GamingDen';
export { LibraryStudy } from './LibraryStudy';
export { CreativeStudio } from './CreativeStudio';

// Level 4 - Penthouse
export { RooftopObservatory } from './RooftopObservatory';
export { DreamArchives } from './DreamArchives';
export { FortuneTellerAlcove } from './FortuneTellerAlcove';
export { CloudGarden } from './CloudGarden';

// Room configuration type
export interface RoomConfig {
  id: string;
  name: string;
  description: string;
  floor: number;
  position: number;
  icon: string;
  color: string;
  linkedFeatures: string[];
}

// Room definitions for navigation
export const roomConfigs: RoomConfig[] = [
  // Level 1 - Ground Floor
  { id: 'grand-foyer', name: 'Grand Foyer', description: 'Welcome dashboard', floor: 1, position: 1, icon: '🏠', color: '#d4af37', linkedFeatures: ['dashboard', 'settings'] },
  { id: 'ancestor-hall', name: 'Ancestor Hall', description: 'Historical figures gallery', floor: 1, position: 2, icon: '🖼️', color: '#7c2d12', linkedFeatures: ['history', 'figures'] },
  { id: 'pet-sanctuary', name: 'Pet Sanctuary', description: 'Virtual companions', floor: 1, position: 3, icon: '🐾', color: '#ec4899', linkedFeatures: ['pets', 'companions'] },
  { id: 'guest-quarters', name: 'Guest Quarters', description: 'Social connections', floor: 1, position: 4, icon: '👥', color: '#60a5fa', linkedFeatures: ['social', 'friends'] },

  // Level 2 - Second Floor
  { id: 'office-hub', name: 'Finance Hub', description: 'Financial command center', floor: 2, position: 1, icon: '💼', color: '#10b981', linkedFeatures: ['finance', 'budget', 'income'] },
  { id: 'wardrobe-palace', name: 'Wardrobe Palace', description: 'Virtual closet', floor: 2, position: 2, icon: '👗', color: '#8b5cf6', linkedFeatures: ['wardrobe', 'fashion'] },
  { id: 'kitchen-lab', name: 'Kitchen Lab', description: 'Recipes and meal planning', floor: 2, position: 3, icon: '🍳', color: '#f97316', linkedFeatures: ['recipes', 'cooking', 'meals'] },
  { id: 'music-room', name: 'Music Room', description: 'Soundscapes and playlists', floor: 2, position: 4, icon: '🎵', color: '#a855f7', linkedFeatures: ['music', 'playlists', 'ambient'] },

  // Level 3 - Third Floor
  { id: 'apothecary', name: 'The Apothecary', description: 'Spiritual practices', floor: 3, position: 1, icon: '🔮', color: '#dc2626', linkedFeatures: ['spirituality', 'herbs', 'rituals'] },
  { id: 'gaming-den', name: 'Gaming Den', description: 'D&D and games', floor: 3, position: 2, icon: '🎮', color: '#a855f7', linkedFeatures: ['gaming', 'dnd', 'boardgames'] },
  { id: 'library-study', name: 'Library Study', description: 'Learning hub', floor: 3, position: 3, icon: '📚', color: '#84cc16', linkedFeatures: ['learning', 'courses', 'education'] },
  { id: 'creative-studio', name: 'Creative Studio', description: 'Art and writing', floor: 3, position: 4, icon: '🎨', color: '#ec4899', linkedFeatures: ['creative', 'art', 'writing'] },

  // Level 4 - Penthouse
  { id: 'rooftop-observatory', name: 'Rooftop Observatory', description: 'Meditation and stargazing', floor: 4, position: 1, icon: '🔭', color: '#60a5fa', linkedFeatures: ['meditation', 'astronomy', 'mindfulness'] },
  { id: 'dream-archives', name: 'Dream Archives', description: 'Dream journal', floor: 4, position: 2, icon: '☁️', color: '#a78bfa', linkedFeatures: ['dreams', 'lucid', 'journal'] },
  { id: 'fortune-teller', name: "Fortune Teller's Alcove", description: 'Tarot and divination', floor: 4, position: 3, icon: '🃏', color: '#d4af37', linkedFeatures: ['tarot', 'divination', 'oracle'] },
  { id: 'cloud-garden', name: 'Cloud Garden', description: 'Plant care', floor: 4, position: 4, icon: '🌿', color: '#10b981', linkedFeatures: ['plants', 'garden', 'nature'] },
];

// Helper to get room by ID
export const getRoomById = (id: string): RoomConfig | undefined =>
  roomConfigs.find(room => room.id === id);

// Helper to get rooms by floor
export const getRoomsByFloor = (floor: number): RoomConfig[] =>
  roomConfigs.filter(room => room.floor === floor);
