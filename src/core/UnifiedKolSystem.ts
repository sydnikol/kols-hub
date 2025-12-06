/**
 * UNIFIED KOL SYSTEM - The Self-Evolving Core
 *
 * This is the central nervous system that connects ALL features,
 * loads ALL seed data, and enables autonomous learning & feature generation.
 *
 * "One hand on the keyboard, one hand on the altar"
 */

import { db } from '../utils/database';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface SystemState {
  initialized: boolean;
  lastSync: Date;
  activeFeatures: number;
  totalIdeas: number;
  learningEvents: number;
  healthScore: number;
  incomeToday: number;
  spoons: number;
}

export interface FeatureIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  status: 'idea' | 'planned' | 'building' | 'complete';
  generatedBy: 'user' | 'ai' | 'system';
  connections: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningEvent {
  id: string;
  type: 'pattern' | 'preference' | 'correlation' | 'insight';
  source: string;
  data: any;
  confidence: number;
  actionable: boolean;
  timestamp: Date;
}

export interface CrossSystemConnection {
  fromModule: string;
  toModule: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

// ============================================
// UNIFIED DATA SOURCES
// ============================================

const SEED_DATA_SOURCES = {
  // Health & Wellness
  medications: () => import('../data/medications'),
  healthIdeas: () => import('../data/health_ideas.json'),
  foodIdeas: () => import('../data/food_ideas.json'),

  // Financial
  passiveIncomeIdeas: () => import('../data/kol_1000_passive_ideas_seed.json'),
  passiveIncomeCore: () => import('../data/passive-income-seed'),

  // Creative
  artIdeas: () => import('../data/art_ideas_seed_extended.json'),
  sewingIdeas: () => import('../data/sewing_ideas.json'),
  ideasVault: () => import('../data/ideas-vault-seed'),

  // Entertainment
  dndModules: () => import('../data/dnd_modules.json'),
  entertainmentLibrary: () => import('../data/entertainment_library.json'),

  // Spiritual
  hoodooLibrary: () => import('../data/kols_hoodoo_library_200.json'),
  hoodooIdeas: () => import('../data/hoodoo_ideas.json'),

  // Learning
  learningCurriculum: () => import('../data/learning/learning-curriculum-300'),

  // Theme
  themePack: () => import('../data/kol_theme_pack.json'),
  gothThemes: () => import('../data/alt_goth_ui_themes_100.json'),

  // Family
  familyTree: () => import('../data/sydney_jones_family.json'),
  sampleAncestors: () => import('../data/sampleAncestors'),

  // Support
  supportHandbooks: () => import('../data/support_handbooks.json'),
  emergencyCards: () => import('../data/emergency_cards.json'),

  // Features
  masterFeatures: () => import('../data/kolhub_master_features.json'),
  fullFeatureSet: () => import('../data/full-app-feature-set.json'),

  // AI Characters
  aiCharacters: () => import('../data/ai_characters.json'),

  // Recipes
  recipes: () => import('../data/recipes'),
};

// ============================================
// CROSS-SYSTEM CONNECTIONS
// ============================================

const SYSTEM_CONNECTIONS: CrossSystemConnection[] = [
  // Health → Everything
  { fromModule: 'health', toModule: 'smartHome', trigger: 'lowEnergy', action: 'activateCalmScene', enabled: true },
  { fromModule: 'health', toModule: 'food', trigger: 'lowSodium', action: 'suggestSaltySnacks', enabled: true },
  { fromModule: 'health', toModule: 'passiveIncome', trigger: 'goodDay', action: 'increaseWorkload', enabled: true },
  { fromModule: 'health', toModule: 'passiveIncome', trigger: 'badDay', action: 'reduceWorkload', enabled: true },
  { fromModule: 'health', toModule: 'chronomuse', trigger: 'moodChange', action: 'adjustAvatar', enabled: true },

  // Passive Income → Finance
  { fromModule: 'passiveIncome', toModule: 'finance', trigger: 'newEarnings', action: 'updateBudget', enabled: true },
  { fromModule: 'passiveIncome', toModule: 'finance', trigger: 'withdrawalReady', action: 'notifyWithdrawal', enabled: true },

  // Learning → Everything
  { fromModule: 'learning', toModule: 'passiveIncome', trigger: 'newSkill', action: 'suggestMonetization', enabled: true },
  { fromModule: 'learning', toModule: 'resume', trigger: 'certComplete', action: 'addToResume', enabled: true },

  // Creative → Content
  { fromModule: 'creative', toModule: 'contentMonetization', trigger: 'newArt', action: 'analyzeMarketability', enabled: true },
  { fromModule: 'creative', toModule: 'passiveIncome', trigger: 'contentReady', action: 'submitToPlatforms', enabled: true },

  // Smart Home → Health
  { fromModule: 'smartHome', toModule: 'health', trigger: 'sleepDetected', action: 'logSleep', enabled: true },
  { fromModule: 'smartHome', toModule: 'health', trigger: 'activityDetected', action: 'logActivity', enabled: true },

  // Calendar → Everything
  { fromModule: 'calendar', toModule: 'health', trigger: 'appointmentReminder', action: 'prepareVisit', enabled: true },
  { fromModule: 'calendar', toModule: 'relationships', trigger: 'partnerEvent', action: 'sendReminder', enabled: true },

  // Ancestry → ChronoMuse
  { fromModule: 'ancestry', toModule: 'chronomuse', trigger: 'ancestorViewed', action: 'summonNPC', enabled: true },

  // Entertainment → Mood
  { fromModule: 'entertainment', toModule: 'health', trigger: 'watchComplete', action: 'checkMood', enabled: true },
];

// ============================================
// FEATURE CATEGORIES
// ============================================

const FEATURE_CATEGORIES = [
  'health', 'mental-health', 'medication', 'vitals', 'hydration', 'pain',
  'finance', 'passive-income', 'investments', 'budget', 'crypto',
  'creative', 'art', 'sewing', 'writing', 'photography',
  'entertainment', 'gaming', 'streaming', 'reading', 'podcasts',
  'learning', 'education', 'certifications', 'skills', 'languages',
  'relationships', 'social', 'caregiving', 'advocacy',
  'smart-home', 'automation', 'integrations',
  'spiritual', 'hoodoo', 'rituals', 'ancestors',
  'dnd', 'characters', 'campaigns',
  'wardrobe', 'fashion', 'avatar',
  'travel', 'transportation', 'housing',
  'food', 'cooking', 'nutrition', 'meal-planning',
  'productivity', 'goals', 'habits', 'journaling',
  'accessibility', 'crisis-support', 'therapy'
];

// ============================================
// UNIFIED KOL SYSTEM CLASS
// ============================================

class UnifiedKolSystem {
  private state: SystemState = {
    initialized: false,
    lastSync: new Date(),
    activeFeatures: 0,
    totalIdeas: 0,
    learningEvents: 0,
    healthScore: 100,
    incomeToday: 0,
    spoons: 5
  };

  private seedData: Map<string, any> = new Map();
  private learningHistory: LearningEvent[] = [];
  private featureIdeas: FeatureIdea[] = [];
  private connections: CrossSystemConnection[] = SYSTEM_CONNECTIONS;

  // ============================================
  // INITIALIZATION
  // ============================================

  async initialize(): Promise<void> {
    console.log('🖤 Initializing Unified KOL System...');

    try {
      // Load all seed data
      await this.loadAllSeedData();

      // Initialize cross-system connections
      this.initializeConnections();

      // Start learning engine
      this.startLearningEngine();

      // Start feature evolution
      this.startFeatureEvolution();

      // Sync with database
      await this.syncWithDatabase();

      this.state.initialized = true;
      this.state.lastSync = new Date();

      console.log('✅ Unified KOL System initialized!');
      console.log(`   📊 Loaded ${this.seedData.size} data sources`);
      console.log(`   🔗 ${this.connections.length} cross-system connections active`);
      console.log(`   💡 ${this.featureIdeas.length} feature ideas loaded`);

      await db.logEvolution('System initialized', 'system', this.state);
    } catch (error) {
      console.error('❌ Failed to initialize Unified KOL System:', error);
      throw error;
    }
  }

  // ============================================
  // SEED DATA LOADING
  // ============================================

  private async loadAllSeedData(): Promise<void> {
    console.log('📦 Loading all seed data...');

    const loadPromises = Object.entries(SEED_DATA_SOURCES).map(async ([key, loader]) => {
      try {
        const data = await loader();
        // Handle both default exports and named exports
        const resolvedData = (data as any).default || (data as any).items || (data as any).seed || data;
        this.seedData.set(key, resolvedData);
        return { key, success: true };
      } catch (error) {
        console.warn(`⚠️ Could not load seed data: ${key}`);
        return { key, success: false };
      }
    });

    const results = await Promise.allSettled(loadPromises);
    const loaded = results.filter(r => r.status === 'fulfilled').length;

    console.log(`   ✅ Loaded ${loaded}/${Object.keys(SEED_DATA_SOURCES).length} data sources`);

    // Count total ideas across all sources
    let totalIdeas = 0;
    this.seedData.forEach((data, key) => {
      if (Array.isArray(data)) {
        totalIdeas += data.length;
      } else if (data && typeof data === 'object') {
        // Count items in objects
        Object.values(data).forEach(v => {
          if (Array.isArray(v)) totalIdeas += v.length;
        });
      }
    });

    this.state.totalIdeas = totalIdeas;
    console.log(`   💡 Total ideas/items available: ${totalIdeas}`);
  }

  // ============================================
  // CROSS-SYSTEM CONNECTIONS
  // ============================================

  private initializeConnections(): void {
    console.log('🔗 Initializing cross-system connections...');

    // Set up event listeners for each connection
    this.connections.forEach(conn => {
      if (conn.enabled) {
        this.registerConnection(conn);
      }
    });

    console.log(`   ✅ ${this.connections.filter(c => c.enabled).length} connections active`);
  }

  private registerConnection(conn: CrossSystemConnection): void {
    // Create an internal event bus for cross-module communication
    const eventKey = `${conn.fromModule}:${conn.trigger}`;

    // Store in a way that can be triggered later
    if (!window.__kolEventBus) {
      window.__kolEventBus = new Map();
    }

    const handlers = window.__kolEventBus.get(eventKey) || [];
    handlers.push({
      toModule: conn.toModule,
      action: conn.action,
      handler: (data: any) => this.executeAction(conn.toModule, conn.action, data)
    });
    window.__kolEventBus.set(eventKey, handlers);
  }

  emit(module: string, trigger: string, data?: any): void {
    const eventKey = `${module}:${trigger}`;
    const handlers = window.__kolEventBus?.get(eventKey) || [];

    handlers.forEach((h: any) => {
      try {
        h.handler(data);
        this.logLearning('pattern', `${module}→${h.toModule}`, {
          trigger,
          action: h.action,
          timestamp: new Date()
        }, 0.9, false);
      } catch (error) {
        console.error(`Error executing ${h.action}:`, error);
      }
    });
  }

  private async executeAction(module: string, action: string, data: any): Promise<void> {
    console.log(`🎯 Executing: ${module}.${action}`);

    // Map actions to actual implementations
    const actionMap: Record<string, () => Promise<void>> = {
      'activateCalmScene': async () => {
        // Trigger smart home calm scene
        this.emit('smartHome', 'sceneActivated', { scene: 'calm', source: 'health' });
      },
      'suggestSaltySnacks': async () => {
        // Get high-sodium food suggestions
        const foodIdeas = this.seedData.get('foodIdeas') || [];
        const highSodium = foodIdeas.filter((f: any) => f.sodiumContent === 'high');
        this.emit('notifications', 'show', {
          title: 'Low Sodium Alert',
          message: `Try: ${highSodium[0]?.name || 'pickles, olives, or broth'}`
        });
      },
      'updateBudget': async () => {
        // Update financial dashboard
        if (data?.amount) {
          this.state.incomeToday += data.amount;
        }
      },
      'addToResume': async () => {
        // Add certification to resume entries
        await db.resume.add({
          type: 'certification',
          title: data?.title || 'New Certification',
          organization: data?.provider || 'Self-Study',
          description: data?.description || '',
          startDate: new Date().toISOString(),
          ongoing: false,
          skills: data?.skills || [],
          verified: true,
          autoGenerated: true,
          sourceId: data?.id
        });
      }
    };

    const actionFn = actionMap[action];
    if (actionFn) {
      await actionFn();
    }
  }

  // ============================================
  // LEARNING ENGINE
  // ============================================

  private startLearningEngine(): void {
    console.log('🧠 Starting learning engine...');

    // Learn from user behavior every 5 minutes
    setInterval(() => this.analyzePatterns(), 5 * 60 * 1000);

    // Generate insights every hour
    setInterval(() => this.generateInsights(), 60 * 60 * 1000);

    // Initial analysis
    this.analyzePatterns();
  }

  private async analyzePatterns(): Promise<void> {
    // Get recent data from various modules
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // Analyze health patterns
      const recentMoods = await db.mood.where('timestamp').aboveOrEqual(today).toArray();
      const recentPain = await db.pain.where('timestamp').aboveOrEqual(today).toArray();
      const recentHydration = await db.hydration.where('timestamp').aboveOrEqual(today).toArray();

      // Detect correlations
      let avgMoodEnergy = 5;
      let avgPainLevel = 0;

      if (recentMoods.length > 0 && recentPain.length > 0) {
        avgMoodEnergy = recentMoods.reduce((s, m) => s + m.energy, 0) / recentMoods.length;
        avgPainLevel = recentPain.reduce((s, p) => s + p.painLevel, 0) / recentPain.length;

        if (avgPainLevel > 6 && avgMoodEnergy < 3) {
          this.logLearning('correlation', 'health', {
            pattern: 'high-pain-low-energy',
            avgPain: avgPainLevel,
            avgEnergy: avgMoodEnergy,
            recommendation: 'Consider rest day, activate calm mode'
          }, 0.85, true);

          // Trigger health system response
          this.emit('health', 'lowEnergy', { spoons: avgMoodEnergy });
        }
      }

      // Analyze hydration
      const totalWater = recentHydration.reduce((s, h) => s + h.waterIntake, 0);
      const totalSodium = recentHydration.reduce((s, h) => s + h.sodiumIntake, 0);

      if (totalSodium < 2000 && new Date().getHours() >= 14) {
        this.logLearning('insight', 'health', {
          pattern: 'low-sodium-afternoon',
          currentSodium: totalSodium,
          goal: 4000,
          recommendation: 'Increase salt intake with next meal'
        }, 0.9, true);

        this.emit('health', 'lowSodium', { current: totalSodium, goal: 4000 });
      }

      // Update spoons based on patterns
      const currentSpoons = Math.max(1, Math.min(10, 5 - Math.floor(avgPainLevel / 2) + Math.floor(avgMoodEnergy)));
      this.state.spoons = currentSpoons;

    } catch (error) {
      console.warn('Pattern analysis error:', error);
    }
  }

  private async generateInsights(): Promise<void> {
    console.log('💡 Generating insights...');

    // Analyze learning history for meta-patterns
    const recentEvents = this.learningHistory.slice(-50);

    // Group by type
    const typeGroups = recentEvents.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate feature suggestions based on patterns
    if (typeGroups.correlation > 10) {
      this.suggestFeature({
        title: 'Advanced Pattern Dashboard',
        description: 'You\'re generating lots of correlations - a dedicated pattern visualization dashboard would help',
        category: 'health',
        priority: 'P1',
        generatedBy: 'ai'
      });
    }

    await db.logEvolution('Insights generated', 'learning', {
      eventCount: recentEvents.length,
      typeGroups
    });
  }

  private logLearning(
    type: LearningEvent['type'],
    source: string,
    data: any,
    confidence: number,
    actionable: boolean
  ): void {
    const event: LearningEvent = {
      id: `learn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      source,
      data,
      confidence,
      actionable,
      timestamp: new Date()
    };

    this.learningHistory.push(event);
    this.state.learningEvents++;

    // Keep history manageable
    if (this.learningHistory.length > 1000) {
      this.learningHistory = this.learningHistory.slice(-500);
    }

    // Log actionable insights
    if (actionable) {
      console.log(`🧠 Learning: ${type} from ${source} (${Math.round(confidence * 100)}% confidence)`);
    }
  }

  // ============================================
  // FEATURE EVOLUTION
  // ============================================

  private startFeatureEvolution(): void {
    console.log('🌱 Starting feature evolution engine...');

    // Check for feature opportunities daily
    setInterval(() => this.evolveFeatures(), 24 * 60 * 60 * 1000);

    // Initial load
    this.loadFeatureIdeas();
  }

  private async loadFeatureIdeas(): Promise<void> {
    try {
      const features = await db.features.toArray();
      this.featureIdeas = features.map(f => ({
        id: f.id?.toString() || '',
        title: f.title,
        description: f.description,
        category: f.category,
        priority: f.priority,
        status: f.status === 'Complete' ? 'complete' : f.status === 'In Progress' ? 'building' : 'idea',
        generatedBy: 'user',
        connections: [],
        createdAt: f.createdAt,
        updatedAt: f.updatedAt
      }));

      this.state.activeFeatures = this.featureIdeas.filter(f => f.status === 'complete').length;
    } catch (error) {
      console.warn('Could not load feature ideas:', error);
    }
  }

  private async evolveFeatures(): Promise<void> {
    console.log('🦋 Evolving features...');

    // Analyze usage patterns to suggest new features
    const patterns = this.learningHistory.filter(e => e.actionable);

    // Generate feature suggestions based on patterns
    const suggestions = this.generateFeatureSuggestions(patterns);

    for (const suggestion of suggestions) {
      this.suggestFeature(suggestion);
    }

    await db.logEvolution('Features evolved', 'evolution', {
      newSuggestions: suggestions.length
    });
  }

  private generateFeatureSuggestions(patterns: LearningEvent[]): Partial<FeatureIdea>[] {
    const suggestions: Partial<FeatureIdea>[] = [];

    // Analyze patterns to generate contextual suggestions
    const healthPatterns = patterns.filter(p => p.source === 'health');
    const financePatterns = patterns.filter(p => p.source === 'finance' || p.source === 'passiveIncome');

    if (healthPatterns.length > 5) {
      suggestions.push({
        title: 'Health Pattern Predictor',
        description: 'ML-based prediction of flare days based on your historical patterns',
        category: 'health',
        priority: 'P1',
        generatedBy: 'ai'
      });
    }

    if (financePatterns.length > 3) {
      suggestions.push({
        title: 'Income Optimization AI',
        description: 'Automatically adjust income streams based on performance patterns',
        category: 'finance',
        priority: 'P1',
        generatedBy: 'ai'
      });
    }

    return suggestions;
  }

  private async suggestFeature(feature: Partial<FeatureIdea>): Promise<void> {
    const fullFeature: FeatureIdea = {
      id: `feat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: feature.title || 'New Feature',
      description: feature.description || '',
      category: feature.category || 'general',
      priority: feature.priority || 'P2',
      status: 'idea',
      generatedBy: feature.generatedBy || 'system',
      connections: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Check for duplicates
    const exists = this.featureIdeas.some(f =>
      f.title.toLowerCase() === fullFeature.title.toLowerCase()
    );

    if (!exists) {
      this.featureIdeas.push(fullFeature);

      await db.features.add({
        title: fullFeature.title,
        description: fullFeature.description,
        category: fullFeature.category,
        priority: fullFeature.priority,
        status: 'Backlog',
        createdAt: fullFeature.createdAt,
        updatedAt: fullFeature.updatedAt
      });

      console.log(`💡 New feature suggested: ${fullFeature.title}`);
    }
  }

  // ============================================
  // DATABASE SYNC
  // ============================================

  private async syncWithDatabase(): Promise<void> {
    console.log('🔄 Syncing with database...');

    try {
      // Get summary stats
      const summary = await db.getTodaySummary();

      // Update state
      this.state.healthScore = this.calculateHealthScore(summary);

      // Get income streams
      const streams = await db.incomeStreams.toArray();
      this.state.incomeToday = streams
        .filter(s => s.status === 'active')
        .reduce((sum, s) => sum + (s.monthlyRevenue / 30), 0);

      console.log('   ✅ Database synced');
    } catch (error) {
      console.warn('Sync error:', error);
    }
  }

  private calculateHealthScore(summary: any): number {
    let score = 100;

    // Deduct for missed medications
    if (summary.medicationsDue > 0) {
      score -= summary.medicationsDue * 5;
    }

    // Deduct for high pain
    if (summary.pain.average > 5) {
      score -= (summary.pain.average - 5) * 3;
    }

    // Bonus for good hydration
    if (summary.hydration.water >= 2000) {
      score += 5;
    }

    if (summary.hydration.sodium >= 3000) {
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  // ============================================
  // PUBLIC API
  // ============================================

  getState(): SystemState {
    return { ...this.state };
  }

  getSeedData(key: string): any {
    return this.seedData.get(key);
  }

  getAllSeedDataKeys(): string[] {
    return Array.from(this.seedData.keys());
  }

  getConnections(): CrossSystemConnection[] {
    return [...this.connections];
  }

  getFeatureIdeas(): FeatureIdea[] {
    return [...this.featureIdeas];
  }

  getLearningHistory(): LearningEvent[] {
    return [...this.learningHistory];
  }

  getCategories(): string[] {
    return [...FEATURE_CATEGORIES];
  }

  // Get a random idea from any category
  getRandomIdea(category?: string): any {
    const sources = [
      'healthIdeas', 'foodIdeas', 'artIdeas', 'sewingIdeas',
      'hoodooIdeas', 'passiveIncomeIdeas', 'dndModules'
    ];

    const source = sources[Math.floor(Math.random() * sources.length)];
    const data = this.seedData.get(source);

    if (Array.isArray(data) && data.length > 0) {
      const filtered = category
        ? data.filter((d: any) => d.category === category || d.type === category)
        : data;
      return filtered[Math.floor(Math.random() * filtered.length)];
    }

    return null;
  }

  // Force trigger a module event
  trigger(module: string, event: string, data?: any): void {
    this.emit(module, event, data);
  }

  // Add a new connection dynamically
  addConnection(connection: CrossSystemConnection): void {
    this.connections.push(connection);
    if (connection.enabled) {
      this.registerConnection(connection);
    }
  }

  // Update spoons (energy level)
  setSpoons(spoons: number): void {
    this.state.spoons = Math.max(0, Math.min(10, spoons));

    // Trigger appropriate responses
    if (this.state.spoons <= 2) {
      this.emit('health', 'lowEnergy', { spoons: this.state.spoons });
    } else if (this.state.spoons >= 7) {
      this.emit('health', 'goodDay', { spoons: this.state.spoons });
    }
  }
}

// ============================================
// GLOBAL DECLARATIONS
// ============================================

declare global {
  interface Window {
    __kolEventBus?: Map<string, any[]>;
    __kolSystem?: UnifiedKolSystem;
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const kolSystem = new UnifiedKolSystem();

// Initialize on import (lazy)
let initPromise: Promise<void> | null = null;

export async function initializeKolSystem(): Promise<UnifiedKolSystem> {
  if (!initPromise) {
    initPromise = kolSystem.initialize();
  }
  await initPromise;
  window.__kolSystem = kolSystem;
  return kolSystem;
}

export default kolSystem;
