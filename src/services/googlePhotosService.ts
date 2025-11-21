/**
 * Google Photos Integration Service
 * Connects to Google Photos API to scan and import clothing photos
 * Now uses the comprehensive googleSyncService for authentication
 */

import { googleSyncService } from './googleSyncService';

export interface ClothingItem {
  id: string;
  photoUrl: string;
  googlePhotoId?: string;
  category: 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory' | 'other';
  subcategory?: string; // e.g., 't-shirt', 'jeans', 'sneakers'
  colors: string[];
  season?: 'spring' | 'summer' | 'fall' | 'winter' | 'all-season';
  style?: string[]; // e.g., 'casual', 'formal', 'gothic', 'punk'
  favorite?: boolean;
  tags?: string[];
  lastWorn?: Date;
  addedDate: Date;
}

export interface Wardrobe {
  userId: string;
  items: ClothingItem[];
  lastSynced?: Date;
}

class GooglePhotosService {
  private readonly STORAGE_KEY = 'wardrobe';

  /**
   * Initialize Google Photos service
   */
  async initialize(): Promise<void> {
    await googleSyncService.initialize();
  }

  /**
   * Check if Google Photos is connected
   */
  async isConnected(): Promise<boolean> {
    return await googleSyncService.isAuthenticated();
  }

  /**
   * Connect to Google Photos (start OAuth flow)
   */
  async connectGooglePhotos(): Promise<{ success: boolean; error?: string }> {
    try {
      // Initialize if not already done
      await this.initialize();

      // Start OAuth flow
      const result = await googleSyncService.authenticate();

      return {
        success: result.success,
        error: result.error,
      };
    } catch (error) {
      console.error('Failed to connect Google Photos:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  /**
   * Disconnect from Google Photos
   */
  async disconnectGooglePhotos(): Promise<void> {
    await googleSyncService.signOut();
  }

  /**
   * Scan Google Photos for clothing items
   */
  async scanPhotosForClothes(): Promise<ClothingItem[]> {
    try {
      // Ensure we're authenticated
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Photos. Please authenticate first.');
      }

      // Use the sync service to get photos with fashion/clothing filters
      const mediaItems = await googleSyncService.syncPhotos({
        maxResults: 100,
        filters: {
          contentCategories: ['FASHION', 'PEOPLE'],
        },
      });

      const foundItems: ClothingItem[] = [];

      for (const item of mediaItems) {
        const clothingItem = await this.analyzeClothingPhoto(item);
        if (clothingItem) {
          foundItems.push(clothingItem);
        }
      }

      // Save to wardrobe
      for (const item of foundItems) {
        await this.addToWardrobe(item);
      }

      return foundItems;
    } catch (error) {
      console.error('Failed to scan Google Photos:', error);
      throw error;
    }
  }

  /**
   * Get photos from a specific album
   */
  async scanAlbum(albumId: string): Promise<ClothingItem[]> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Photos. Please authenticate first.');
      }

      const mediaItems = await googleSyncService.syncPhotos({
        albumId,
        maxResults: 100,
      });

      const foundItems: ClothingItem[] = [];

      for (const item of mediaItems) {
        const clothingItem = await this.analyzeClothingPhoto(item);
        if (clothingItem) {
          foundItems.push(clothingItem);
        }
      }

      return foundItems;
    } catch (error) {
      console.error('Failed to scan album:', error);
      throw error;
    }
  }

  /**
   * Get list of photo albums
   */
  async getAlbums(): Promise<any[]> {
    try {
      if (!await this.isConnected()) {
        throw new Error('Not connected to Google Photos. Please authenticate first.');
      }

      return await googleSyncService.getPhotoAlbums();
    } catch (error) {
      console.error('Failed to get albums:', error);
      throw error;
    }
  }

  /**
   * Analyze a photo to detect clothing
   * In production, this would use Google Cloud Vision API or similar
   */
  private async analyzeClothingPhoto(photoItem: any): Promise<ClothingItem | null> {
    // For now, create a basic clothing item
    // In production, you'd use AI/ML to detect clothing type, colors, etc.

    const item: ClothingItem = {
      id: `clothing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      photoUrl: photoItem.baseUrl,
      googlePhotoId: photoItem.id,
      category: 'other', // Would be detected by AI
      colors: [], // Would be extracted by AI
      season: 'all-season',
      style: [],
      tags: [],
      addedDate: new Date(),
    };

    return item;
  }

  /**
   * Manual photo upload (from device)
   */
  async uploadClothingPhoto(file: File): Promise<ClothingItem> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const photoUrl = e.target?.result as string;

        // Analyze the uploaded photo
        const colors = await this.detectColors(photoUrl);
        const category = await this.detectClothingType(photoUrl);

        const item: ClothingItem = {
          id: `clothing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          photoUrl,
          category,
          colors,
          season: 'all-season',
          style: [],
          tags: [],
          addedDate: new Date(),
        };

        await this.addToWardrobe(item);
        resolve(item);
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Detect dominant colors in an image (simplified)
   */
  private async detectColors(imageUrl: string): Promise<string[]> {
    // In production, this would use Canvas API or ML to detect colors
    // For now, return common clothing colors
    const commonColors = [
      'black', 'white', 'gray', 'blue', 'red',
      'green', 'yellow', 'pink', 'purple', 'brown'
    ];

    // Return random colors for demo (would be actual detection in production)
    return [commonColors[Math.floor(Math.random() * commonColors.length)]];
  }

  /**
   * Detect clothing type (simplified)
   */
  private async detectClothingType(imageUrl: string): Promise<ClothingItem['category']> {
    // In production, this would use ML/AI image recognition
    // For now, default to 'other'
    return 'other';
  }

  /**
   * Get user's wardrobe
   */
  async getWardrobe(): Promise<ClothingItem[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const wardrobe: Wardrobe = JSON.parse(stored);
      return wardrobe.items || [];
    } catch (error) {
      console.error('Failed to load wardrobe:', error);
      return [];
    }
  }

  /**
   * Add item to wardrobe
   */
  async addToWardrobe(item: ClothingItem): Promise<void> {
    const items = await this.getWardrobe();
    items.push(item);
    await this.saveWardrobe(items);
  }

  /**
   * Save wardrobe
   */
  private async saveWardrobe(items: ClothingItem[]): Promise<void> {
    const wardrobe: Wardrobe = {
      userId: 'user_1', // TODO: Get from auth
      items,
      lastSynced: new Date(),
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wardrobe));
  }

  /**
   * Update clothing item
   */
  async updateClothingItem(itemId: string, updates: Partial<ClothingItem>): Promise<void> {
    const items = await this.getWardrobe();
    const index = items.findIndex(i => i.id === itemId);

    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      await this.saveWardrobe(items);
    }
  }

  /**
   * Delete clothing item
   */
  async deleteClothingItem(itemId: string): Promise<void> {
    const items = await this.getWardrobe();
    const filtered = items.filter(i => i.id !== itemId);
    await this.saveWardrobe(filtered);
  }

  /**
   * Filter wardrobe by category
   */
  async getByCategory(category: ClothingItem['category']): Promise<ClothingItem[]> {
    const items = await this.getWardrobe();
    return items.filter(item => item.category === category);
  }

  /**
   * Search wardrobe
   */
  async searchWardrobe(query: string): Promise<ClothingItem[]> {
    const items = await this.getWardrobe();
    const lowercaseQuery = query.toLowerCase();

    return items.filter(item =>
      item.category.includes(lowercaseQuery) ||
      item.subcategory?.toLowerCase().includes(lowercaseQuery) ||
      item.colors.some(color => color.toLowerCase().includes(lowercaseQuery)) ||
      item.style?.some(s => s.toLowerCase().includes(lowercaseQuery)) ||
      item.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Get outfit suggestions based on occasion
   */
  async getOutfitSuggestion(occasion: 'casual' | 'formal' | 'workout' | 'date' | 'interview'): Promise<{
    top?: ClothingItem;
    bottom?: ClothingItem;
    shoes?: ClothingItem;
    outerwear?: ClothingItem;
    accessory?: ClothingItem;
  }> {
    const items = await this.getWardrobe();

    // Simple algorithm to pick coordinating items
    // In production, this would use ML to suggest matching outfits

    const tops = items.filter(i => i.category === 'top');
    const bottoms = items.filter(i => i.category === 'bottom');
    const shoes = items.filter(i => i.category === 'shoes');
    const outerwear = items.filter(i => i.category === 'outerwear');
    const accessories = items.filter(i => i.category === 'accessory');

    return {
      top: tops[Math.floor(Math.random() * tops.length)],
      bottom: bottoms[Math.floor(Math.random() * bottoms.length)],
      shoes: shoes[Math.floor(Math.random() * shoes.length)],
      outerwear: outerwear[Math.floor(Math.random() * outerwear.length)],
      accessory: accessories[Math.floor(Math.random() * accessories.length)],
    };
  }
}

export const googlePhotosService = new GooglePhotosService();
