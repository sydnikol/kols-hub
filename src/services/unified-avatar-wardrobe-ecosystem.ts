/**
 * UNIFIED AVATAR & WARDROBE ECOSYSTEM
 *
 * Consolidates all avatar and wardrobe functionality:
 * - Avatar creation and customization
 * - Virtual wardrobe management
 * - Clothing scanner with AI detection
 * - Outfit planning and recommendations
 * - AI Avatar Teacher integration
 *
 * Cross-system connections:
 * - Weather: Outfit recommendations based on forecast
 * - Calendar: Outfit planning for events
 * - Finance: Clothing budget tracking
 * - Creative: Sewing project integration
 */

import { eventBus } from './unified-data-hub';

// ============================================================================
// INTERFACES
// ============================================================================

export interface Avatar {
  id: string;
  name: string;
  type: '2d' | '3d' | 'pixel' | 'realistic';
  baseImage?: string;
  model3dUrl?: string;
  features: {
    skinTone: string;
    hairColor: string;
    hairStyle: string;
    eyeColor: string;
    faceShape: string;
    bodyType: string;
    height: 'short' | 'average' | 'tall';
    accessories: string[];
  };
  expressions: Array<{
    name: string;
    imageUrl: string;
  }>;
  poses: Array<{
    name: string;
    imageUrl?: string;
  }>;
  currentOutfit?: string; // Outfit ID
  voiceSettings?: {
    voiceId: string;
    pitch: number;
    speed: number;
    provider: 'elevenlabs' | 'google' | 'azure' | 'local';
  };
  personalityTraits: string[];
  purpose: 'main' | 'teacher' | 'assistant' | 'gaming' | 'social';
  isDefault: boolean;
  readyPlayerMeId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClothingItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'shoes' | 'accessories' | 'underwear' | 'sleepwear' | 'activewear' | 'swimwear' | 'formal';
  subcategory?: string;
  brand?: string;
  color: string[];
  pattern?: string;
  material?: string[];
  size: string;
  fit?: 'tight' | 'fitted' | 'regular' | 'loose' | 'oversized';
  season: ('spring' | 'summer' | 'fall' | 'winter')[];
  occasion: ('casual' | 'work' | 'formal' | 'athletic' | 'sleep' | 'lounge')[];
  style: string[];
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'worn';
  purchaseDate?: Date;
  purchasePrice?: number;
  currentValue?: number;
  wearCount: number;
  lastWorn?: Date;
  washInstructions?: string;
  needsRepair: boolean;
  repairNotes?: string;
  images: string[];
  thumbnailImage?: string;
  avatarOverlayImage?: string;
  favoriteLevel: 0 | 1 | 2 | 3; // 0=none, 3=favorite
  donated: boolean;
  donatedDate?: Date;
  location?: string;
  notes?: string;
  linkedSewingProjectId?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Outfit {
  id: string;
  name: string;
  items: Array<{
    clothingItemId: string;
    layerOrder: number;
  }>;
  occasion: string[];
  season: ('spring' | 'summer' | 'fall' | 'winter')[];
  style: string[];
  weatherRange?: {
    minTemp: number;
    maxTemp: number;
    conditions: ('sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy')[];
  };
  rating?: number;
  wearCount: number;
  lastWorn?: Date;
  images: string[];
  notes?: string;
  plannedDates: Date[];
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WearLog {
  id: string;
  outfitId?: string;
  itemIds: string[];
  date: Date;
  occasion?: string;
  weather?: {
    temp: number;
    conditions: string;
  };
  comfort?: number; // 1-5
  compliments?: number;
  photos?: string[];
  notes?: string;
  mood?: string;
  createdAt: Date;
}

export interface ClothingScan {
  id: string;
  imageUrl: string;
  scanDate: Date;
  detectedItems: Array<{
    category: string;
    confidence: number;
    boundingBox?: { x: number; y: number; width: number; height: number };
    color?: string;
    pattern?: string;
    style?: string;
    brand?: string;
    similarItems?: string[];
    purchaseLinks?: Array<{ store: string; url: string; price: number }>;
  }>;
  addedToWardrobe: boolean;
  clothingItemId?: string;
  createdAt: Date;
}

export interface LaundryItem {
  id: string;
  clothingItemId: string;
  status: 'dirty' | 'washing' | 'drying' | 'ironing' | 'clean';
  addedDate: Date;
  washDate?: Date;
  completedDate?: Date;
  specialInstructions?: string;
}

export interface WardrobeStats {
  totalItems: number;
  byCategory: Record<string, number>;
  totalValue: number;
  mostWorn: ClothingItem[];
  leastWorn: ClothingItem[];
  needsAttention: ClothingItem[];
  colorDistribution: Record<string, number>;
  styleDistribution: Record<string, number>;
  seasonalBalance: Record<string, number>;
}

export interface OutfitRecommendation {
  outfit: Outfit;
  score: number;
  reasons: string[];
  weather?: { temp: number; conditions: string };
  occasion?: string;
}

// ============================================================================
// UNIFIED AVATAR & WARDROBE ECOSYSTEM CLASS
// ============================================================================

class UnifiedAvatarWardrobeEcosystem {
  private static instance: UnifiedAvatarWardrobeEcosystem;
  private avatars: Map<string, Avatar> = new Map();
  private clothingItems: Map<string, ClothingItem> = new Map();
  private outfits: Map<string, Outfit> = new Map();
  private wearLogs: WearLog[] = [];
  private scans: ClothingScan[] = [];
  private laundry: Map<string, LaundryItem> = new Map();

  private constructor() {
    this.initializeEventListeners();
    this.loadFromStorage();
  }

  static getInstance(): UnifiedAvatarWardrobeEcosystem {
    if (!UnifiedAvatarWardrobeEcosystem.instance) {
      UnifiedAvatarWardrobeEcosystem.instance = new UnifiedAvatarWardrobeEcosystem();
    }
    return UnifiedAvatarWardrobeEcosystem.instance;
  }

  private initializeEventListeners(): void {
    // Weather integration for outfit recommendations
    eventBus.on('weather:forecast', (data: any) => {
      this.generateWeatherBasedRecommendations(data);
    });

    // Calendar integration for event outfit planning
    eventBus.on('calendar:event:upcoming', (data: any) => {
      if (data.needsOutfit) {
        this.suggestOutfitForEvent(data);
      }
    });

    // Finance integration for clothing purchases
    eventBus.on('finance:budget:clothing', (data: any) => {
      console.log('[Wardrobe] Clothing budget updated:', data.amount);
    });

    // Creative integration for sewing projects
    eventBus.on('creative:project:completed', (data: any) => {
      if (data.type === 'sewing') {
        this.linkSewingProject(data);
      }
    });
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('unified_avatar_wardrobe_ecosystem');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.avatars) data.avatars.forEach((a: Avatar) => this.avatars.set(a.id, a));
        if (data.clothingItems) data.clothingItems.forEach((c: ClothingItem) => this.clothingItems.set(c.id, c));
        if (data.outfits) data.outfits.forEach((o: Outfit) => this.outfits.set(o.id, o));
        if (data.wearLogs) this.wearLogs = data.wearLogs;
        if (data.scans) this.scans = data.scans;
        if (data.laundry) data.laundry.forEach((l: LaundryItem) => this.laundry.set(l.id, l));
      }
    } catch (error) {
      console.error('[Wardrobe] Failed to load from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        avatars: Array.from(this.avatars.values()),
        clothingItems: Array.from(this.clothingItems.values()),
        outfits: Array.from(this.outfits.values()),
        wearLogs: this.wearLogs.slice(-500),
        scans: this.scans.slice(-100),
        laundry: Array.from(this.laundry.values())
      };
      localStorage.setItem('unified_avatar_wardrobe_ecosystem', JSON.stringify(data));
    } catch (error) {
      console.error('[Wardrobe] Failed to save to storage:', error);
    }
  }

  // ============================================================================
  // AVATAR MANAGEMENT
  // ============================================================================

  async createAvatar(avatar: Omit<Avatar, 'id' | 'createdAt' | 'updatedAt'>): Promise<Avatar> {
    const newAvatar: Avatar = {
      ...avatar,
      id: `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // If this is the first avatar or marked as default, make it default
    if (this.avatars.size === 0 || avatar.isDefault) {
      // Unset other defaults
      for (const existing of this.avatars.values()) {
        if (existing.isDefault) {
          existing.isDefault = false;
          this.avatars.set(existing.id, existing);
        }
      }
      newAvatar.isDefault = true;
    }

    this.avatars.set(newAvatar.id, newAvatar);
    this.saveToStorage();

    eventBus.emit('avatar:created', newAvatar);
    return newAvatar;
  }

  async updateAvatar(avatarId: string, updates: Partial<Avatar>): Promise<Avatar | null> {
    const avatar = this.avatars.get(avatarId);
    if (!avatar) return null;

    Object.assign(avatar, updates, { updatedAt: new Date() });
    this.avatars.set(avatarId, avatar);
    this.saveToStorage();

    eventBus.emit('avatar:updated', avatar);
    return avatar;
  }

  async setAvatarOutfit(avatarId: string, outfitId: string): Promise<Avatar | null> {
    const avatar = this.avatars.get(avatarId);
    const outfit = this.outfits.get(outfitId);
    if (!avatar || !outfit) return null;

    avatar.currentOutfit = outfitId;
    avatar.updatedAt = new Date();
    this.avatars.set(avatarId, avatar);
    this.saveToStorage();

    eventBus.emit('avatar:outfit:changed', { avatar, outfit });
    return avatar;
  }

  async connectReadyPlayerMe(avatarId: string, rpmId: string): Promise<Avatar | null> {
    const avatar = this.avatars.get(avatarId);
    if (!avatar) return null;

    avatar.readyPlayerMeId = rpmId;
    avatar.type = '3d';
    avatar.model3dUrl = `https://models.readyplayer.me/${rpmId}.glb`;
    avatar.updatedAt = new Date();

    this.avatars.set(avatarId, avatar);
    this.saveToStorage();

    return avatar;
  }

  getAvatar(avatarId: string): Avatar | undefined {
    return this.avatars.get(avatarId);
  }

  getDefaultAvatar(): Avatar | undefined {
    return Array.from(this.avatars.values()).find(a => a.isDefault);
  }

  getAllAvatars(): Avatar[] {
    return Array.from(this.avatars.values());
  }

  getTeacherAvatar(): Avatar | undefined {
    return Array.from(this.avatars.values()).find(a => a.purpose === 'teacher') || this.getDefaultAvatar();
  }

  // ============================================================================
  // CLOTHING ITEM MANAGEMENT
  // ============================================================================

  async addClothingItem(item: Omit<ClothingItem, 'id' | 'wearCount' | 'createdAt' | 'updatedAt'>): Promise<ClothingItem> {
    const newItem: ClothingItem = {
      ...item,
      id: `clothing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wearCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.clothingItems.set(newItem.id, newItem);
    this.saveToStorage();

    // Track purchase cost
    if (newItem.purchasePrice) {
      eventBus.emit('finance:expense', {
        amount: newItem.purchasePrice,
        category: 'clothing',
        description: `${newItem.brand || ''} ${newItem.name}`.trim(),
        linkedId: newItem.id
      });
    }

    eventBus.emit('wardrobe:item:added', newItem);
    return newItem;
  }

  async updateClothingItem(itemId: string, updates: Partial<ClothingItem>): Promise<ClothingItem | null> {
    const item = this.clothingItems.get(itemId);
    if (!item) return null;

    Object.assign(item, updates, { updatedAt: new Date() });
    this.clothingItems.set(itemId, item);
    this.saveToStorage();

    return item;
  }

  async wearItem(itemId: string): Promise<ClothingItem | null> {
    const item = this.clothingItems.get(itemId);
    if (!item) return null;

    item.wearCount++;
    item.lastWorn = new Date();
    item.updatedAt = new Date();
    this.clothingItems.set(itemId, item);
    this.saveToStorage();

    return item;
  }

  async markItemDonated(itemId: string): Promise<ClothingItem | null> {
    const item = this.clothingItems.get(itemId);
    if (!item) return null;

    item.donated = true;
    item.donatedDate = new Date();
    item.updatedAt = new Date();
    this.clothingItems.set(itemId, item);
    this.saveToStorage();

    eventBus.emit('wardrobe:item:donated', item);
    return item;
  }

  getClothingItem(itemId: string): ClothingItem | undefined {
    return this.clothingItems.get(itemId);
  }

  getAllClothingItems(includesDonated: boolean = false): ClothingItem[] {
    let items = Array.from(this.clothingItems.values());
    if (!includesDonated) {
      items = items.filter(i => !i.donated);
    }
    return items;
  }

  getClothingByCategory(category: ClothingItem['category']): ClothingItem[] {
    return Array.from(this.clothingItems.values()).filter(i => i.category === category && !i.donated);
  }

  getClothingBySeason(season: 'spring' | 'summer' | 'fall' | 'winter'): ClothingItem[] {
    return Array.from(this.clothingItems.values()).filter(i => i.season.includes(season) && !i.donated);
  }

  getClothingByOccasion(occasion: ClothingItem['occasion'][0]): ClothingItem[] {
    return Array.from(this.clothingItems.values()).filter(i => i.occasion.includes(occasion) && !i.donated);
  }

  searchClothing(query: string): ClothingItem[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.clothingItems.values()).filter(i =>
      !i.donated && (
        i.name.toLowerCase().includes(lowerQuery) ||
        i.brand?.toLowerCase().includes(lowerQuery) ||
        i.color.some(c => c.toLowerCase().includes(lowerQuery)) ||
        i.tags.some(t => t.toLowerCase().includes(lowerQuery))
      )
    );
  }

  // ============================================================================
  // OUTFIT MANAGEMENT
  // ============================================================================

  async createOutfit(outfit: Omit<Outfit, 'id' | 'wearCount' | 'createdAt' | 'updatedAt'>): Promise<Outfit> {
    const newOutfit: Outfit = {
      ...outfit,
      id: `outfit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      wearCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.outfits.set(newOutfit.id, newOutfit);
    this.saveToStorage();

    eventBus.emit('wardrobe:outfit:created', newOutfit);
    return newOutfit;
  }

  async updateOutfit(outfitId: string, updates: Partial<Outfit>): Promise<Outfit | null> {
    const outfit = this.outfits.get(outfitId);
    if (!outfit) return null;

    Object.assign(outfit, updates, { updatedAt: new Date() });
    this.outfits.set(outfitId, outfit);
    this.saveToStorage();

    return outfit;
  }

  async planOutfitForDate(outfitId: string, date: Date): Promise<Outfit | null> {
    const outfit = this.outfits.get(outfitId);
    if (!outfit) return null;

    outfit.plannedDates.push(date);
    outfit.updatedAt = new Date();
    this.outfits.set(outfitId, outfit);
    this.saveToStorage();

    eventBus.emit('wardrobe:outfit:planned', { outfit, date });
    return outfit;
  }

  getOutfit(outfitId: string): Outfit | undefined {
    return this.outfits.get(outfitId);
  }

  getAllOutfits(): Outfit[] {
    return Array.from(this.outfits.values());
  }

  getFavoriteOutfits(): Outfit[] {
    return Array.from(this.outfits.values()).filter(o => o.favorite);
  }

  getOutfitsForOccasion(occasion: string): Outfit[] {
    return Array.from(this.outfits.values()).filter(o => o.occasion.includes(occasion));
  }

  getPlannedOutfits(): Array<{ outfit: Outfit; date: Date }> {
    const now = new Date();
    const planned: Array<{ outfit: Outfit; date: Date }> = [];

    for (const outfit of this.outfits.values()) {
      for (const date of outfit.plannedDates) {
        if (new Date(date) >= now) {
          planned.push({ outfit, date: new Date(date) });
        }
      }
    }

    return planned.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // ============================================================================
  // WEAR LOGGING
  // ============================================================================

  async logWear(log: Omit<WearLog, 'id' | 'createdAt'>): Promise<WearLog> {
    const newLog: WearLog = {
      ...log,
      id: `wear_${Date.now()}`,
      createdAt: new Date()
    };

    this.wearLogs.push(newLog);

    // Update wear counts
    for (const itemId of log.itemIds) {
      await this.wearItem(itemId);
    }

    if (log.outfitId) {
      const outfit = this.outfits.get(log.outfitId);
      if (outfit) {
        outfit.wearCount++;
        outfit.lastWorn = log.date;
        this.outfits.set(log.outfitId, outfit);
      }
    }

    this.saveToStorage();

    eventBus.emit('wardrobe:wear:logged', newLog);
    return newLog;
  }

  getWearHistory(options?: { itemId?: string; outfitId?: string; limit?: number }): WearLog[] {
    let logs = [...this.wearLogs];

    if (options?.itemId) {
      logs = logs.filter(l => l.itemIds.includes(options.itemId!));
    }
    if (options?.outfitId) {
      logs = logs.filter(l => l.outfitId === options.outfitId);
    }

    logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (options?.limit) {
      logs = logs.slice(0, options.limit);
    }

    return logs;
  }

  // ============================================================================
  // AI CLOTHING SCANNER
  // ============================================================================

  async scanClothing(imageUrl: string): Promise<ClothingScan> {
    // Simulate AI detection - in production would use actual AI service
    const detectedItems = await this.simulateClothingDetection(imageUrl);

    const scan: ClothingScan = {
      id: `scan_${Date.now()}`,
      imageUrl,
      scanDate: new Date(),
      detectedItems,
      addedToWardrobe: false,
      createdAt: new Date()
    };

    this.scans.push(scan);
    this.saveToStorage();

    eventBus.emit('wardrobe:scan:completed', scan);
    return scan;
  }

  private async simulateClothingDetection(imageUrl: string): Promise<ClothingScan['detectedItems']> {
    // Simulated AI detection - in production would use actual AI
    return [
      {
        category: 'tops',
        confidence: 0.92,
        color: 'blue',
        pattern: 'solid',
        style: 'casual',
        similarItems: [],
        purchaseLinks: [
          { store: 'Amazon', url: '#', price: 29.99 },
          { store: 'Target', url: '#', price: 24.99 }
        ]
      }
    ];
  }

  async addScanToWardrobe(scanId: string, itemDetails: Partial<ClothingItem>): Promise<ClothingItem | null> {
    const scan = this.scans.find(s => s.id === scanId);
    if (!scan || scan.addedToWardrobe) return null;

    const detected = scan.detectedItems[0];
    const newItem = await this.addClothingItem({
      name: itemDetails.name || 'Scanned Item',
      category: (detected?.category as ClothingItem['category']) || 'tops',
      color: detected?.color ? [detected.color] : ['unknown'],
      size: itemDetails.size || 'M',
      season: ['spring', 'summer', 'fall', 'winter'],
      occasion: ['casual'],
      style: detected?.style ? [detected.style] : [],
      condition: 'good',
      needsRepair: false,
      images: [scan.imageUrl],
      favoriteLevel: 0,
      donated: false,
      tags: [],
      ...itemDetails
    });

    scan.addedToWardrobe = true;
    scan.clothingItemId = newItem.id;
    this.saveToStorage();

    return newItem;
  }

  getScans(limit?: number): ClothingScan[] {
    let scans = [...this.scans].sort((a, b) => new Date(b.scanDate).getTime() - new Date(a.scanDate).getTime());
    if (limit) scans = scans.slice(0, limit);
    return scans;
  }

  // ============================================================================
  // LAUNDRY MANAGEMENT
  // ============================================================================

  async addToLaundry(itemId: string, specialInstructions?: string): Promise<LaundryItem> {
    const item: LaundryItem = {
      id: `laundry_${Date.now()}`,
      clothingItemId: itemId,
      status: 'dirty',
      addedDate: new Date(),
      specialInstructions
    };

    this.laundry.set(item.id, item);
    this.saveToStorage();

    return item;
  }

  async updateLaundryStatus(laundryId: string, status: LaundryItem['status']): Promise<LaundryItem | null> {
    const item = this.laundry.get(laundryId);
    if (!item) return null;

    item.status = status;
    if (status === 'washing') item.washDate = new Date();
    if (status === 'clean') {
      item.completedDate = new Date();
      // Remove from laundry after marking clean
      setTimeout(() => {
        this.laundry.delete(laundryId);
        this.saveToStorage();
      }, 1000);
    }

    this.laundry.set(laundryId, item);
    this.saveToStorage();

    return item;
  }

  getLaundryItems(): LaundryItem[] {
    return Array.from(this.laundry.values());
  }

  getDirtyClothes(): ClothingItem[] {
    const dirtyIds = Array.from(this.laundry.values())
      .filter(l => l.status === 'dirty')
      .map(l => l.clothingItemId);

    return dirtyIds.map(id => this.clothingItems.get(id)).filter((c): c is ClothingItem => !!c);
  }

  // ============================================================================
  // OUTFIT RECOMMENDATIONS
  // ============================================================================

  getOutfitRecommendations(options: {
    weather?: { temp: number; conditions: string };
    occasion?: string;
    excludeRecentlyWorn?: boolean;
    spoonLevel?: number;
  }): OutfitRecommendation[] {
    const recommendations: OutfitRecommendation[] = [];
    const recentlyWorn = new Set<string>();

    if (options.excludeRecentlyWorn) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      this.wearLogs
        .filter(l => new Date(l.date) >= weekAgo)
        .forEach(l => {
          if (l.outfitId) recentlyWorn.add(l.outfitId);
        });
    }

    for (const outfit of this.outfits.values()) {
      if (options.excludeRecentlyWorn && recentlyWorn.has(outfit.id)) continue;

      let score = 50;
      const reasons: string[] = [];

      // Weather matching
      if (options.weather && outfit.weatherRange) {
        const { temp, conditions } = options.weather;
        if (temp >= outfit.weatherRange.minTemp && temp <= outfit.weatherRange.maxTemp) {
          score += 20;
          reasons.push('Perfect for the temperature');
        }
        if (outfit.weatherRange.conditions.some(c => conditions.toLowerCase().includes(c))) {
          score += 10;
          reasons.push('Matches weather conditions');
        }
      }

      // Occasion matching
      if (options.occasion && outfit.occasion.includes(options.occasion)) {
        score += 25;
        reasons.push(`Great for ${options.occasion}`);
      }

      // Favorite bonus
      if (outfit.favorite) {
        score += 10;
        reasons.push('One of your favorites');
      }

      // Check if all items are clean
      const dirtyItemIds = Array.from(this.laundry.values()).map(l => l.clothingItemId);
      const hasCleanItems = outfit.items.every(i => !dirtyItemIds.includes(i.clothingItemId));
      if (!hasCleanItems) {
        score -= 50;
        reasons.push('Some items need washing');
      }

      // Low spoon - prefer comfortable outfits
      if (options.spoonLevel !== undefined && options.spoonLevel <= 3) {
        if (outfit.style.includes('comfortable') || outfit.style.includes('casual')) {
          score += 15;
          reasons.push('Comfortable for low energy');
        }
      }

      if (score > 0) {
        recommendations.push({
          outfit,
          score,
          reasons,
          weather: options.weather,
          occasion: options.occasion
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  private generateWeatherBasedRecommendations(weatherData: any): void {
    const recommendations = this.getOutfitRecommendations({
      weather: weatherData,
      excludeRecentlyWorn: true
    });

    if (recommendations.length > 0) {
      eventBus.emit('wardrobe:recommendations:ready', recommendations);
    }
  }

  private suggestOutfitForEvent(eventData: any): void {
    const recommendations = this.getOutfitRecommendations({
      occasion: eventData.type,
      excludeRecentlyWorn: true
    });

    if (recommendations.length > 0) {
      eventBus.emit('wardrobe:event:suggestion', {
        event: eventData,
        recommendations
      });
    }
  }

  private linkSewingProject(projectData: any): void {
    // When a sewing project is completed, optionally add to wardrobe
    console.log('[Wardrobe] Sewing project completed, ready to add to wardrobe:', projectData.title);
  }

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  getWardrobeStats(): WardrobeStats {
    const items = Array.from(this.clothingItems.values()).filter(i => !i.donated);

    // By category
    const byCategory: Record<string, number> = {};
    items.forEach(i => {
      byCategory[i.category] = (byCategory[i.category] || 0) + 1;
    });

    // Total value
    const totalValue = items.reduce((sum, i) => sum + (i.currentValue || i.purchasePrice || 0), 0);

    // Most worn
    const mostWorn = [...items].sort((a, b) => b.wearCount - a.wearCount).slice(0, 5);

    // Least worn (with at least 30 days since added)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const leastWorn = items
      .filter(i => new Date(i.createdAt) < thirtyDaysAgo)
      .sort((a, b) => a.wearCount - b.wearCount)
      .slice(0, 5);

    // Needs attention (repair or hasn't been worn in 6+ months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const needsAttention = items.filter(i =>
      i.needsRepair ||
      (i.lastWorn && new Date(i.lastWorn) < sixMonthsAgo) ||
      (!i.lastWorn && new Date(i.createdAt) < sixMonthsAgo)
    );

    // Color distribution
    const colorDistribution: Record<string, number> = {};
    items.forEach(i => {
      i.color.forEach(c => {
        colorDistribution[c] = (colorDistribution[c] || 0) + 1;
      });
    });

    // Style distribution
    const styleDistribution: Record<string, number> = {};
    items.forEach(i => {
      i.style.forEach(s => {
        styleDistribution[s] = (styleDistribution[s] || 0) + 1;
      });
    });

    // Seasonal balance
    const seasonalBalance: Record<string, number> = {
      spring: 0, summer: 0, fall: 0, winter: 0
    };
    items.forEach(i => {
      i.season.forEach(s => {
        seasonalBalance[s]++;
      });
    });

    return {
      totalItems: items.length,
      byCategory,
      totalValue,
      mostWorn,
      leastWorn,
      needsAttention,
      colorDistribution,
      styleDistribution,
      seasonalBalance
    };
  }

  getCostPerWear(): Array<{ item: ClothingItem; costPerWear: number }> {
    return Array.from(this.clothingItems.values())
      .filter(i => !i.donated && i.purchasePrice && i.wearCount > 0)
      .map(i => ({
        item: i,
        costPerWear: (i.purchasePrice || 0) / i.wearCount
      }))
      .sort((a, b) => a.costPerWear - b.costPerWear);
  }

  getDonationSuggestions(): ClothingItem[] {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return Array.from(this.clothingItems.values())
      .filter(i =>
        !i.donated &&
        i.favoriteLevel === 0 &&
        (
          (i.lastWorn && new Date(i.lastWorn) < sixMonthsAgo) ||
          (!i.lastWorn && new Date(i.createdAt) < sixMonthsAgo) ||
          i.condition === 'worn' ||
          i.condition === 'poor'
        )
      )
      .slice(0, 10);
  }
}

// Export singleton instance
export const avatarWardrobeEcosystem = UnifiedAvatarWardrobeEcosystem.getInstance();

// Export convenience functions
export const createAvatar = (a: Parameters<typeof avatarWardrobeEcosystem.createAvatar>[0]) => avatarWardrobeEcosystem.createAvatar(a);
export const addClothingItem = (i: Parameters<typeof avatarWardrobeEcosystem.addClothingItem>[0]) => avatarWardrobeEcosystem.addClothingItem(i);
export const createOutfit = (o: Parameters<typeof avatarWardrobeEcosystem.createOutfit>[0]) => avatarWardrobeEcosystem.createOutfit(o);
export const scanClothing = (url: string) => avatarWardrobeEcosystem.scanClothing(url);
export const getWardrobeStats = () => avatarWardrobeEcosystem.getWardrobeStats();
export const getOutfitRecommendations = (options: Parameters<typeof avatarWardrobeEcosystem.getOutfitRecommendations>[0]) => avatarWardrobeEcosystem.getOutfitRecommendations(options);
