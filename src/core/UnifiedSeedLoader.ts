/**
 * UNIFIED SEED LOADER
 *
 * Consolidates ALL seed data from the app into a single loader.
 * Eliminates redundancy and provides consistent access.
 */

import { db } from '../utils/database';

// ============================================
// TYPES
// ============================================

export interface SeedStats {
  totalItems: number;
  byCategory: Record<string, number>;
  loadedAt: Date;
  sources: string[];
}

export interface UnifiedIdea {
  id: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  tags: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  spoonCost?: number;
  estimatedTime?: string;
  favorite?: boolean;
  source: string;
  metadata?: any;
}

// ============================================
// UNIFIED SEED LOADER CLASS
// ============================================

class UnifiedSeedLoader {
  private ideas: UnifiedIdea[] = [];
  private loaded = false;
  private stats: SeedStats = {
    totalItems: 0,
    byCategory: {},
    loadedAt: new Date(),
    sources: []
  };

  // ============================================
  // MAIN LOADING FUNCTION
  // ============================================

  async loadAll(): Promise<SeedStats> {
    if (this.loaded) {
      return this.stats;
    }

    console.log('🌱 Loading unified seed data...');

    const loaders = [
      this.loadHealthIdeas(),
      this.loadFoodIdeas(),
      this.loadArtIdeas(),
      this.loadSewingIdeas(),
      this.loadHoodooIdeas(),
      this.loadPassiveIncomeIdeas(),
      this.loadDnDIdeas(),
      this.loadEntertainmentIdeas(),
      this.loadLearningIdeas(),
      this.loadMentalHealthIdeas()
    ];

    const results = await Promise.allSettled(loaders);

    // Count successes
    const successful = results.filter(r => r.status === 'fulfilled').length;
    console.log(`   ✅ Loaded ${successful}/${loaders.length} seed sources`);

    // Update stats
    this.stats.totalItems = this.ideas.length;
    this.stats.loadedAt = new Date();

    // Count by category
    this.ideas.forEach(idea => {
      this.stats.byCategory[idea.category] = (this.stats.byCategory[idea.category] || 0) + 1;
    });

    this.loaded = true;

    console.log(`   📊 Total ideas: ${this.ideas.length}`);
    console.log(`   📂 Categories: ${Object.keys(this.stats.byCategory).length}`);

    return this.stats;
  }

  // ============================================
  // INDIVIDUAL LOADERS
  // ============================================

  private async loadHealthIdeas(): Promise<void> {
    try {
      const data = await import('../data/health_ideas.json');
      const rawData = (data as any).default || data;
      const items = Array.isArray(rawData) ? rawData : (rawData.items || []);

      items.forEach((item: any, index: number) => {
        this.ideas.push({
          id: `health-${index}`,
          title: item.title || item.name || `Health Activity ${index}`,
          description: item.description,
          category: 'health',
          subcategory: item.type || item.category,
          tags: item.tags || [],
          difficulty: this.mapDifficulty(item.difficulty),
          spoonCost: item.spoons || item.spoonCost || 2,
          estimatedTime: item.duration || item.time,
          source: 'health_ideas.json',
          metadata: item
        });
      });

      this.stats.sources.push('health_ideas.json');
    } catch (error) {
      console.warn('Could not load health ideas');
    }
  }

  private async loadFoodIdeas(): Promise<void> {
    try {
      const data = await import('../data/food_ideas.json');
      const rawData = (data as any).default || data;
      const items = Array.isArray(rawData) ? rawData : (rawData.items || []);

      items.forEach((item: any, index: number) => {
        this.ideas.push({
          id: `food-${index}`,
          title: item.name || item.title || `Recipe ${index}`,
          description: item.description || item.notes,
          category: 'food',
          subcategory: item.category || item.type,
          tags: [...(item.tags || []), item.potsFlexible ? 'pots-friendly' : ''].filter(Boolean),
          difficulty: this.mapDifficulty(item.difficulty),
          spoonCost: item.spoons || item.prepTime ? Math.ceil(item.prepTime / 15) : 2,
          estimatedTime: item.prepTime ? `${item.prepTime} min` : undefined,
          source: 'food_ideas.json',
          metadata: { ...item, sodiumContent: item.sodium || item.sodiumContent }
        });
      });

      this.stats.sources.push('food_ideas.json');
    } catch (error) {
      console.warn('Could not load food ideas');
    }
  }

  private async loadArtIdeas(): Promise<void> {
    try {
      const data = await import('../data/art_ideas_seed_extended.json');
      const rawData = (data as any).default || data;
      const items = Array.isArray(rawData) ? rawData : (rawData.items || []);

      items.forEach((item: any, index: number) => {
        this.ideas.push({
          id: `art-${item.id || index}`,
          title: item.title || item.name || `Art Project ${index}`,
          description: item.description || item.notes,
          category: 'art',
          subcategory: item.medium || item.category,
          tags: item.tags || [],
          difficulty: this.mapDifficulty(item.difficulty),
          spoonCost: item.spoons || 3,
          estimatedTime: item.time || item.duration,
          favorite: item.favorite,
          source: 'art_ideas_seed_extended.json',
          metadata: { mood: item.mood, createdBy: item.createdBy }
        });
      });

      this.stats.sources.push('art_ideas_seed_extended.json');
    } catch (error) {
      console.warn('Could not load art ideas');
    }
  }

  private async loadSewingIdeas(): Promise<void> {
    try {
      const data = await import('../data/sewing_ideas.json');
      const rawData = (data as any).default || data;
      const items = Array.isArray(rawData) ? rawData : (rawData.items || []);

      items.forEach((item: any, index: number) => {
        this.ideas.push({
          id: `sewing-${index}`,
          title: item.title || item.name || `Sewing Project ${index}`,
          description: item.description || item.pattern,
          category: 'sewing',
          subcategory: item.type || item.category,
          tags: [...(item.tags || []), 'sensory-safe'].filter(Boolean),
          difficulty: this.mapDifficulty(item.skill || item.difficulty),
          spoonCost: item.spoons || 4,
          estimatedTime: item.time || item.duration,
          source: 'sewing_ideas.json',
          metadata: item
        });
      });

      this.stats.sources.push('sewing_ideas.json');
    } catch (error) {
      console.warn('Could not load sewing ideas');
    }
  }

  private async loadHoodooIdeas(): Promise<void> {
    try {
      // Load both hoodoo sources
      const [basicData, libraryData] = await Promise.allSettled([
        import('../data/hoodoo_ideas.json'),
        import('../data/kols_hoodoo_library_200.json')
      ]);

      // Basic hoodoo ideas
      if (basicData.status === 'fulfilled') {
        const rawData = (basicData.value as any).default || basicData.value;
        const items = Array.isArray(rawData) ? rawData : (rawData.items || []);
        items.forEach((item: any, index: number) => {
          this.ideas.push({
            id: `hoodoo-basic-${index}`,
            title: item.title || item.name || `Ritual ${index}`,
            description: item.description,
            category: 'spiritual',
            subcategory: 'hoodoo',
            tags: item.tags || [],
            spoonCost: item.spoons || 2,
            source: 'hoodoo_ideas.json',
            metadata: item
          });
        });
        this.stats.sources.push('hoodoo_ideas.json');
      }

      // Extended hoodoo library (200+ rituals)
      if (libraryData.status === 'fulfilled') {
        const rawData = (libraryData.value as any).default || libraryData.value;
        const items = Array.isArray(rawData) ? rawData : (rawData.seed || rawData.items || []);
        items.forEach((item: any, index: number) => {
          this.ideas.push({
            id: `hoodoo-lib-${item.id || index}`,
            title: item.title || item.name || `Hoodoo Ritual ${index}`,
            description: item.description || item.steps?.join(' '),
            category: 'spiritual',
            subcategory: 'hoodoo-library',
            tags: item.tags || [],
            spoonCost: item.spoons || 3,
            source: 'kols_hoodoo_library_200.json',
            metadata: {
              ingredients: item.ingredients,
              psalms: item.psalms,
              steps: item.steps,
              safetyNotes: item.safety_notes,
              scheduleHint: item.schedule_hint
            }
          });
        });
        this.stats.sources.push('kols_hoodoo_library_200.json');
      }
    } catch (error) {
      console.warn('Could not load hoodoo ideas');
    }
  }

  private async loadPassiveIncomeIdeas(): Promise<void> {
    try {
      const data = await import('../data/kol_1000_passive_ideas_seed.json');
      const rawData = (data as any).default || data;
      const items = Array.isArray(rawData) ? rawData : (rawData.items || []);

      items.forEach((item: any, index: number) => {
        this.ideas.push({
          id: `income-${index}`,
          title: item.title || item.name || `Income Stream ${index}`,
          description: item.notes || item.description,
          category: 'passive-income',
          subcategory: item.kind || item.category,
          tags: item.tags || [item.kind],
          difficulty: item.hoursPerWeek <= 2 ? 'easy' : item.hoursPerWeek <= 5 ? 'medium' : 'hard',
          estimatedTime: item.hoursPerWeek ? `${item.hoursPerWeek} hrs/week` : undefined,
          source: 'kol_1000_passive_ideas_seed.json',
          metadata: {
            estMonthly: item.estMonthly,
            startupCost: item.startupCost,
            url: item.url,
            kind: item.kind
          }
        });
      });

      this.stats.sources.push('kol_1000_passive_ideas_seed.json');
    } catch (error) {
      console.warn('Could not load passive income ideas');
    }
  }

  private async loadDnDIdeas(): Promise<void> {
    try {
      const data = await import('../data/dnd_modules.json');
      const rawData = (data as any).default || data;
      const items = Array.isArray(rawData) ? rawData : (rawData.items || []);

      items.forEach((item: any, index: number) => {
        this.ideas.push({
          id: `dnd-${item.id || index}`,
          title: item.title || item.name || `D&D Adventure ${index}`,
          description: item.description || item.hook,
          category: 'gaming',
          subcategory: 'dnd',
          tags: [item.mode, item.vibe].filter(Boolean),
          difficulty: this.mapDifficulty(item.difficulty),
          source: 'dnd_modules.json',
          metadata: { mode: item.mode, vibe: item.vibe }
        });
      });

      this.stats.sources.push('dnd_modules.json');
    } catch (error) {
      console.warn('Could not load D&D ideas');
    }
  }

  private async loadEntertainmentIdeas(): Promise<void> {
    try {
      const data = await import('../data/entertainment_library.json');
      const rawData = (data as any).default || data;
      const items = Array.isArray(rawData) ? rawData : (rawData.items || []);

      items.forEach((item: any, index: number) => {
        this.ideas.push({
          id: `entertainment-${index}`,
          title: item.title || item.name || `Media ${index}`,
          description: item.description || item.notes,
          category: 'entertainment',
          subcategory: item.type || item.category,
          tags: item.tags || [],
          source: 'entertainment_library.json',
          metadata: { status: item.status, rating: item.rating }
        });
      });

      this.stats.sources.push('entertainment_library.json');
    } catch (error) {
      console.warn('Could not load entertainment ideas');
    }
  }

  private async loadLearningIdeas(): Promise<void> {
    try {
      const data = await import('../data/learning/learning-curriculum-300');
      const curriculum = data.learningCurriculum || data.default || [];

      curriculum.forEach((item: any, index: number) => {
        this.ideas.push({
          id: `learning-${item.id || index}`,
          title: item.title || `Lesson ${index}`,
          description: item.learningObjective || item.description,
          category: 'learning',
          subcategory: item.category,
          tags: item.tags || [item.difficulty],
          difficulty: this.mapDifficulty(item.difficulty),
          estimatedTime: item.estimatedTimeMin ? `${item.estimatedTimeMin} min` : undefined,
          source: 'learning-curriculum-300.ts',
          metadata: {
            source: item.source,
            suggestedActivity: item.suggestedActivity
          }
        });
      });

      this.stats.sources.push('learning-curriculum-300.ts');
    } catch (error) {
      console.warn('Could not load learning ideas');
    }
  }

  private async loadMentalHealthIdeas(): Promise<void> {
    try {
      const data = await import('../data/mentalHealthIdeas.json');
      const items = Array.isArray(data.default) ? data.default : [];

      items.forEach((item: any, index: number) => {
        this.ideas.push({
          id: `mental-health-${index}`,
          title: item.title || item.name || `Activity ${index}`,
          description: item.description,
          category: 'mental-health',
          subcategory: item.type || item.category,
          tags: item.tags || [],
          spoonCost: item.spoons || 1,
          source: 'mentalHealthIdeas.json',
          metadata: item
        });
      });

      this.stats.sources.push('mentalHealthIdeas.json');
    } catch (error) {
      console.warn('Could not load mental health ideas');
    }
  }

  // ============================================
  // UTILITIES
  // ============================================

  private mapDifficulty(input?: string): 'easy' | 'medium' | 'hard' | undefined {
    if (!input) return undefined;
    const lower = input.toLowerCase();
    if (lower.includes('easy') || lower.includes('beginner') || lower === '1') return 'easy';
    if (lower.includes('hard') || lower.includes('advanced') || lower === '3') return 'hard';
    return 'medium';
  }

  // ============================================
  // PUBLIC API
  // ============================================

  getStats(): SeedStats {
    return { ...this.stats };
  }

  getAllIdeas(): UnifiedIdea[] {
    return [...this.ideas];
  }

  getByCategory(category: string): UnifiedIdea[] {
    return this.ideas.filter(i => i.category === category || i.subcategory === category);
  }

  getByTags(tags: string[]): UnifiedIdea[] {
    return this.ideas.filter(i =>
      tags.some(tag => i.tags.includes(tag))
    );
  }

  getBySpoonCost(maxSpoons: number): UnifiedIdea[] {
    return this.ideas.filter(i => (i.spoonCost || 5) <= maxSpoons);
  }

  getRandom(category?: string): UnifiedIdea | null {
    const pool = category ? this.getByCategory(category) : this.ideas;
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  search(query: string): UnifiedIdea[] {
    const lower = query.toLowerCase();
    return this.ideas.filter(i =>
      i.title.toLowerCase().includes(lower) ||
      i.description?.toLowerCase().includes(lower) ||
      i.tags.some(t => t.toLowerCase().includes(lower))
    );
  }

  getCategories(): string[] {
    return [...new Set(this.ideas.map(i => i.category))];
  }

  getSubcategories(category: string): string[] {
    return [...new Set(
      this.ideas
        .filter(i => i.category === category)
        .map(i => i.subcategory)
        .filter(Boolean) as string[]
    )];
  }

  // Seed the database with all ideas
  async seedDatabase(): Promise<void> {
    console.log('📥 Seeding database with ideas...');

    const existingCount = await db.ideaLibrary.count();
    if (existingCount > 100) {
      console.log('   ⏭️ Database already seeded');
      return;
    }

    const items = this.ideas.map(idea => ({
      title: idea.title,
      description: idea.description || '',
      type: idea.category,
      tags: idea.tags,
      createdAt: new Date()
    }));

    await db.ideaLibrary.bulkAdd(items);
    console.log(`   ✅ Seeded ${items.length} ideas to database`);
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const seedLoader = new UnifiedSeedLoader();

export async function loadAllSeeds(): Promise<SeedStats> {
  return seedLoader.loadAll();
}

export default seedLoader;
