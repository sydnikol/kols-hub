import { WardrobeItem, Outfit, WearLog, Plan } from '../models/WardrobeModels';

export class WardrobeComfortService {
  private wardrobeItems: Map<string, WardrobeItem>;
  private outfits: Map<string, Outfit>;
  private wearLogs: WearLog[];
  private plans: Map<string, Plan>;

  constructor() {
    this.wardrobeItems = new Map();
    this.outfits = new Map();
    this.wearLogs = [];
    this.plans = new Map();
  }

  // Wardrobe Item Management
  async addWardrobeItem(item: WardrobeItem): Promise<WardrobeItem> {
    this.wardrobeItems.set(item.id, item);
    return item;
  }

  async getUserWardrobe(userId: string): Promise<WardrobeItem[]> {
    return Array.from(this.wardrobeItems.values()).filter(
      (item) => item.userId === userId
    );
  }

  async getWardrobeByCategory(
    userId: string,
    category: WardrobeItem['category']
  ): Promise<WardrobeItem[]> {
    return Array.from(this.wardrobeItems.values()).filter(
      (item) => item.userId === userId && item.category === category
    );
  }

  async getSensoryFriendlyItems(userId: string): Promise<WardrobeItem[]> {
    return Array.from(this.wardrobeItems.values()).filter(
      (item) => item.userId === userId && item.sensory_safe
    );
  }

  async getEDSFriendlyItems(userId: string): Promise<WardrobeItem[]> {
    return Array.from(this.wardrobeItems.values()).filter(
      (item) => item.userId === userId && item.eds_friendly
    );
  }

  // Outfit Management
  async createOutfit(outfit: Outfit): Promise<Outfit> {
    outfit.created_at = new Date();
    this.outfits.set(outfit.id, outfit);
    return outfit;
  }

  async getUserOutfits(userId: string): Promise<Outfit[]> {
    return Array.from(this.outfits.values()).filter(
      (outfit) => outfit.userId === userId
    );
  }

  async getOutfitsByComfortProfile(
    userId: string,
    profile: Outfit['comfort_profile']
  ): Promise<Outfit[]> {
    return Array.from(this.outfits.values()).filter(
      (outfit) => outfit.userId === userId && outfit.comfort_profile === profile
    );
  }

  async getOutfitsByTag(userId: string, tag: string): Promise<Outfit[]> {
    return Array.from(this.outfits.values()).filter(
      (outfit) => outfit.userId === userId && outfit.tags.includes(tag)
    );
  }

  // AI-powered Outfit Suggestions
  async suggestOutfit(
    userId: string,
    context: {
      weather?: string;
      event_type?: string;
      energy_level?: number; // 0-10
      pain_level?: number; // 0-10
      sensory_needs?: 'high' | 'medium' | 'low';
    }
  ): Promise<Outfit | null> {
    const userOutfits = await this.getUserOutfits(userId);

    // Filter based on context
    let suitable = userOutfits;

    if (context.weather) {
      suitable = suitable.filter((outfit) =>
        outfit.weather_suitability?.includes(context.weather)
      );
    }

    if (context.event_type) {
      suitable = suitable.filter((outfit) =>
        outfit.tags.includes(context.event_type)
      );
    }

    // Prioritize comfort based on pain/energy levels
    if (context.pain_level && context.pain_level > 6) {
      suitable = suitable.filter(
        (outfit) =>
          outfit.comfort_profile === 'flare_day' ||
          outfit.comfort_profile === 'low_spoon'
      );
    } else if (context.energy_level && context.energy_level < 4) {
      suitable = suitable.filter(
        (outfit) => outfit.comfort_profile === 'low_spoon'
      );
    }

    // Sort by historical wear feedback
    const outfitsWithScores = await Promise.all(
      suitable.map(async (outfit) => {
        const avgComfort = await this.getOutfitAverageComfort(outfit.id);
        return { outfit, score: avgComfort };
      })
    );

    outfitsWithScores.sort((a, b) => b.score - a.score);

    return outfitsWithScores[0]?.outfit || null;
  }

  private async getOutfitAverageComfort(outfitId: string): Promise<number> {
    const logs = this.wearLogs.filter((log) => log.outfit_id === outfitId);

    if (logs.length === 0) return 5; // Default neutral score

    const avgComfort =
      logs.reduce((sum, log) => sum + log.comfort_rating, 0) / logs.length;

    return avgComfort;
  }

  // Wear Logging & Analytics
  async logWear(log: WearLog): Promise<WearLog> {
    this.wearLogs.push(log);

    // Update outfit last_worn
    const outfit = this.outfits.get(log.outfit_id);
    if (outfit) {
      outfit.last_worn = log.worn_at;
      this.outfits.set(log.outfit_id, outfit);
    }

    // Update wardrobe item reliability scores based on feedback
    await this.updateItemScores(log);

    return log;
  }

  private async updateItemScores(log: WearLog): Promise<void> {
    const outfit = this.outfits.get(log.outfit_id);
    if (!outfit) return;

    for (const itemId of outfit.wardrobe_item_ids) {
      const item = this.wardrobeItems.get(itemId);
      if (!item) continue;

      // Adjust comfort score based on wear log
      const comfortFactor = log.comfort_rating / 10;
      item.comfort_score = Math.min(
        100,
        item.comfort_score * 0.9 + comfortFactor * 100 * 0.1
      );

      // Adjust reliability score
      if (log.would_wear_again) {
        item.reliability_score = Math.min(100, item.reliability_score + 2);
      } else {
        item.reliability_score = Math.max(0, item.reliability_score - 5);
      }

      this.wardrobeItems.set(itemId, item);
    }
  }

  async getWearLogs(
    userId: string,
    outfitId?: string
  ): Promise<WearLog[]> {
    let logs = this.wearLogs.filter((log) => log.userId === userId);

    if (outfitId) {
      logs = logs.filter((log) => log.outfit_id === outfitId);
    }

    return logs.sort((a, b) => b.worn_at.getTime() - a.worn_at.getTime());
  }

  // Outfit Planning for Events
  async createPlan(plan: Plan): Promise<Plan> {
    this.plans.set(plan.id, plan);
    return plan;
  }

  async getUserPlans(userId: string): Promise<Plan[]> {
    return Array.from(this.plans.values()).filter(
      (plan) => plan.userId === userId
    );
  }

  async markPlanAsWorn(planId: string): Promise<void> {
    const plan = this.plans.get(planId);
    if (plan) {
      plan.acceptance_status = 'worn';
      this.plans.set(planId, plan);
    }
  }

  // Weather-based suggestions
  async getWeatherAppropriateOutfits(
    userId: string,
    weather: string
  ): Promise<Outfit[]> {
    return Array.from(this.outfits.values()).filter(
      (outfit) =>
        outfit.userId === userId &&
        outfit.weather_suitability?.includes(weather)
    );
  }

  // Partner outfit sync (for polyamorous outfit coordination)
  async getPartnerOutfitSuggestions(
    userIds: string[],
    event_type: string
  ): Promise<Map<string, Outfit | null>> {
    const suggestions = new Map<string, Outfit | null>();

    for (const userId of userIds) {
      const suggestion = await this.suggestOutfit(userId, { event_type });
      suggestions.set(userId, suggestion);
    }

    return suggestions;
  }

  // Analytics
  async getWardrobeStats(userId: string): Promise<{
    total_items: number;
    sensory_safe_items: number;
    eds_friendly_items: number;
    total_outfits: number;
    most_worn_outfit?: Outfit;
    highest_comfort_items: WardrobeItem[];
  }> {
    const items = await this.getUserWardrobe(userId);
    const outfits = await this.getUserOutfits(userId);

    const sensory_safe_items = items.filter((i) => i.sensory_safe).length;
    const eds_friendly_items = items.filter((i) => i.eds_friendly).length;

    // Find most worn outfit
    const wearCounts = new Map<string, number>();
    this.wearLogs
      .filter((log) => log.userId === userId)
      .forEach((log) => {
        wearCounts.set(log.outfit_id, (wearCounts.get(log.outfit_id) || 0) + 1);
      });

    let most_worn_outfit: Outfit | undefined;
    let maxWears = 0;
    wearCounts.forEach((count, outfitId) => {
      if (count > maxWears) {
        maxWears = count;
        most_worn_outfit = this.outfits.get(outfitId);
      }
    });

    // Top comfort items
    const highest_comfort_items = items
      .sort((a, b) => b.comfort_score - a.comfort_score)
      .slice(0, 5);

    return {
      total_items: items.length,
      sensory_safe_items,
      eds_friendly_items,
      total_outfits: outfits.length,
      most_worn_outfit,
      highest_comfort_items,
    };
  }
}
