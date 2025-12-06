/**
 * Avatar Wardrobe Integration Service
 * Bridges the Virtual Wardrobe with the AI Avatar Teacher
 * Allows the AI teacher avatar to wear actual clothes from the user's wardrobe
 */

import { openDB, DBSchema } from 'idb';

// Types from Virtual Wardrobe
export interface WardrobeClothingItem {
  id: string;
  photoUrl: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory';
  colors: string[];
  tags: string[];
  favorite: boolean;
  name?: string;
  brand?: string;
  size?: string;
  notes?: string;
  dateAdded: string;
  lastWorn?: string;
  wearCount: number;
}

// Avatar outfit using real wardrobe items
export interface AvatarOutfit {
  id: string;
  name: string;
  top?: WardrobeClothingItem;
  bottom?: WardrobeClothingItem;
  dress?: WardrobeClothingItem;
  outerwear?: WardrobeClothingItem;
  shoes?: WardrobeClothingItem;
  accessories: WardrobeClothingItem[];
  mood?: string;
  occasion?: string;
  createdAt: string;
  isFavorite: boolean;
}

// Avatar appearance state with real clothes
export interface AvatarWardrobeState {
  currentOutfit: AvatarOutfit | null;
  savedOutfits: AvatarOutfit[];
  preferences: {
    preferredStyle: string;
    colorPalette: string[];
    avoidColors: string[];
    comfortLevel: 'casual' | 'semi-formal' | 'formal';
  };
}

interface AvatarWardrobeDB extends DBSchema {
  wardrobeItems: {
    key: string;
    value: WardrobeClothingItem;
    indexes: { 'by-category': string; 'by-favorite': number };
  };
  avatarOutfits: {
    key: string;
    value: AvatarOutfit;
    indexes: { 'by-favorite': number; 'by-date': string };
  };
  avatarState: {
    key: string;
    value: AvatarWardrobeState;
  };
}

class AvatarWardrobeIntegration {
  private dbName = 'kolhub-avatar-wardrobe';
  private dbVersion = 1;

  private async getDB() {
    return openDB<AvatarWardrobeDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Wardrobe items store
        if (!db.objectStoreNames.contains('wardrobeItems')) {
          const wardrobeStore = db.createObjectStore('wardrobeItems', { keyPath: 'id' });
          wardrobeStore.createIndex('by-category', 'category');
          wardrobeStore.createIndex('by-favorite', 'favorite');
        }

        // Avatar outfits store
        if (!db.objectStoreNames.contains('avatarOutfits')) {
          const outfitsStore = db.createObjectStore('avatarOutfits', { keyPath: 'id' });
          outfitsStore.createIndex('by-favorite', 'isFavorite');
          outfitsStore.createIndex('by-date', 'createdAt');
        }

        // Avatar state store
        if (!db.objectStoreNames.contains('avatarState')) {
          db.createObjectStore('avatarState', { keyPath: 'id' });
        }
      },
    });
  }

  // Sync wardrobe items from Virtual Wardrobe page
  async syncWardrobeItems(items: WardrobeClothingItem[]): Promise<void> {
    const db = await this.getDB();
    const tx = db.transaction('wardrobeItems', 'readwrite');

    for (const item of items) {
      await tx.store.put(item);
    }

    await tx.done;
  }

  // Get all wardrobe items
  async getAllWardrobeItems(): Promise<WardrobeClothingItem[]> {
    const db = await this.getDB();
    return db.getAll('wardrobeItems');
  }

  // Get items by category
  async getItemsByCategory(category: WardrobeClothingItem['category']): Promise<WardrobeClothingItem[]> {
    const db = await this.getDB();
    return db.getAllFromIndex('wardrobeItems', 'by-category', category);
  }

  // Get favorite items
  async getFavoriteItems(): Promise<WardrobeClothingItem[]> {
    const db = await this.getDB();
    const allItems = await db.getAll('wardrobeItems');
    return allItems.filter(item => item.favorite);
  }

  // Create a new avatar outfit from wardrobe items
  async createAvatarOutfit(outfit: Omit<AvatarOutfit, 'id' | 'createdAt'>): Promise<AvatarOutfit> {
    const db = await this.getDB();

    const newOutfit: AvatarOutfit = {
      ...outfit,
      id: `outfit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    await db.put('avatarOutfits', newOutfit);
    return newOutfit;
  }

  // Get all saved avatar outfits
  async getSavedOutfits(): Promise<AvatarOutfit[]> {
    const db = await this.getDB();
    return db.getAll('avatarOutfits');
  }

  // Set current avatar outfit
  async setCurrentOutfit(outfit: AvatarOutfit): Promise<void> {
    const db = await this.getDB();
    const state = await this.getAvatarState();

    await db.put('avatarState', {
      ...state,
      id: 'current',
      currentOutfit: outfit,
    });
  }

  // Get current avatar state
  async getAvatarState(): Promise<AvatarWardrobeState> {
    const db = await this.getDB();
    const state = await db.get('avatarState', 'current');

    return state || {
      currentOutfit: null,
      savedOutfits: [],
      preferences: {
        preferredStyle: 'casual',
        colorPalette: [],
        avoidColors: [],
        comfortLevel: 'casual',
      },
    };
  }

  // Generate outfit suggestion based on mood/occasion
  async suggestOutfit(params: {
    mood?: string;
    occasion?: string;
    weather?: 'hot' | 'warm' | 'cool' | 'cold';
    energyLevel?: 'low' | 'medium' | 'high';
  }): Promise<AvatarOutfit | null> {
    const items = await this.getAllWardrobeItems();

    if (items.length === 0) {
      return null;
    }

    // Get items by category
    const tops = items.filter(i => i.category === 'top');
    const bottoms = items.filter(i => i.category === 'bottom');
    const dresses = items.filter(i => i.category === 'dress');
    const outerwear = items.filter(i => i.category === 'outerwear');
    const shoes = items.filter(i => i.category === 'shoes');
    const accessories = items.filter(i => i.category === 'accessory');

    // Simple outfit generation logic
    const pickRandom = <T>(arr: T[]): T | undefined =>
      arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined;

    // Prefer favorites for special occasions
    const preferFavorites = params.occasion && ['date', 'interview', 'party'].includes(params.occasion);

    const filterItems = (categoryItems: WardrobeClothingItem[]) => {
      if (preferFavorites) {
        const favorites = categoryItems.filter(i => i.favorite);
        return favorites.length > 0 ? favorites : categoryItems;
      }
      return categoryItems;
    };

    // Decide between dress or top+bottom
    const useDress = dresses.length > 0 && Math.random() > 0.5;

    const suggestedOutfit: Omit<AvatarOutfit, 'id' | 'createdAt'> = {
      name: `${params.mood || 'Daily'} ${params.occasion || 'Look'}`,
      accessories: [],
      mood: params.mood,
      occasion: params.occasion,
      isFavorite: false,
    };

    if (useDress) {
      suggestedOutfit.dress = pickRandom(filterItems(dresses));
    } else {
      suggestedOutfit.top = pickRandom(filterItems(tops));
      suggestedOutfit.bottom = pickRandom(filterItems(bottoms));
    }

    // Add outerwear for cold weather
    if (params.weather === 'cold' || params.weather === 'cool') {
      suggestedOutfit.outerwear = pickRandom(filterItems(outerwear));
    }

    // Add shoes
    suggestedOutfit.shoes = pickRandom(filterItems(shoes));

    // Add 1-2 accessories
    const numAccessories = Math.floor(Math.random() * 2) + 1;
    const shuffledAccessories = [...filterItems(accessories)].sort(() => Math.random() - 0.5);
    suggestedOutfit.accessories = shuffledAccessories.slice(0, numAccessories);

    return this.createAvatarOutfit(suggestedOutfit);
  }

  // Get outfit colors for avatar rendering
  getOutfitColors(outfit: AvatarOutfit): {
    primary: string;
    secondary: string;
    accent: string;
  } {
    const colors: string[] = [];

    if (outfit.top?.colors) colors.push(...outfit.top.colors);
    if (outfit.bottom?.colors) colors.push(...outfit.bottom.colors);
    if (outfit.dress?.colors) colors.push(...outfit.dress.colors);
    if (outfit.outerwear?.colors) colors.push(...outfit.outerwear.colors);
    if (outfit.shoes?.colors) colors.push(...outfit.shoes.colors);

    return {
      primary: colors[0] || '#4a4a4a',
      secondary: colors[1] || '#6a6a6a',
      accent: colors[2] || '#8a8a8a',
    };
  }

  // Convert to AI Teacher compatible format
  toTeacherAppearance(outfit: AvatarOutfit): {
    clothing: {
      style: string;
      topColor: string;
      bottomColor: string;
      shoes: string;
      extras: string[];
      actualItems: {
        top?: { photoUrl: string; name?: string };
        bottom?: { photoUrl: string; name?: string };
        dress?: { photoUrl: string; name?: string };
        outerwear?: { photoUrl: string; name?: string };
        shoes?: { photoUrl: string; name?: string };
        accessories: { photoUrl: string; name?: string }[];
      };
    };
  } {
    const colors = this.getOutfitColors(outfit);

    // Determine style from tags
    const allTags: string[] = [];
    if (outfit.top?.tags) allTags.push(...outfit.top.tags);
    if (outfit.bottom?.tags) allTags.push(...outfit.bottom.tags);
    if (outfit.dress?.tags) allTags.push(...outfit.dress.tags);

    let style = 'casual';
    if (allTags.some(t => ['gothic', 'dark', 'punk'].includes(t.toLowerCase()))) {
      style = 'gothic';
    } else if (allTags.some(t => ['professional', 'formal', 'business'].includes(t.toLowerCase()))) {
      style = 'professional';
    } else if (allTags.some(t => ['elegant', 'fancy', 'dressy'].includes(t.toLowerCase()))) {
      style = 'elegant';
    } else if (allTags.some(t => ['cozy', 'comfy', 'soft'].includes(t.toLowerCase()))) {
      style = 'cozy';
    } else if (allTags.some(t => ['artistic', 'creative', 'bohemian'].includes(t.toLowerCase()))) {
      style = 'artistic';
    }

    return {
      clothing: {
        style,
        topColor: outfit.top?.colors[0] || outfit.dress?.colors[0] || colors.primary,
        bottomColor: outfit.bottom?.colors[0] || outfit.dress?.colors[1] || colors.secondary,
        shoes: outfit.shoes?.colors[0] || '#333333',
        extras: outfit.accessories.map(a => a.tags?.[0] || 'accessory'),
        actualItems: {
          top: outfit.top ? { photoUrl: outfit.top.photoUrl, name: outfit.top.name } : undefined,
          bottom: outfit.bottom ? { photoUrl: outfit.bottom.photoUrl, name: outfit.bottom.name } : undefined,
          dress: outfit.dress ? { photoUrl: outfit.dress.photoUrl, name: outfit.dress.name } : undefined,
          outerwear: outfit.outerwear ? { photoUrl: outfit.outerwear.photoUrl, name: outfit.outerwear.name } : undefined,
          shoes: outfit.shoes ? { photoUrl: outfit.shoes.photoUrl, name: outfit.shoes.name } : undefined,
          accessories: outfit.accessories.map(a => ({ photoUrl: a.photoUrl, name: a.name })),
        },
      },
    };
  }

  // Delete an outfit
  async deleteOutfit(outfitId: string): Promise<void> {
    const db = await this.getDB();
    await db.delete('avatarOutfits', outfitId);
  }

  // Update outfit favorite status
  async toggleOutfitFavorite(outfitId: string): Promise<AvatarOutfit | null> {
    const db = await this.getDB();
    const outfit = await db.get('avatarOutfits', outfitId);

    if (outfit) {
      outfit.isFavorite = !outfit.isFavorite;
      await db.put('avatarOutfits', outfit);
      return outfit;
    }

    return null;
  }
}

export const avatarWardrobeIntegration = new AvatarWardrobeIntegration();
export default avatarWardrobeIntegration;
