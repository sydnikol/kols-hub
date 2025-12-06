// KOL Hub Data Service - Centralized access to all enriched data
import dndAdventureHooks from '../data/dnd_adventure_hooks.json';
import healthWellnessIdeas from '../data/health_wellness_ideas.json';
import hoodooSpiritualIdeas from '../data/hoodoo_spiritual_ideas.json';
import passiveIncomeIdeas from '../data/passive_income_ideas.json';

// Types for D&D Adventure Hooks
export interface AdventureHook {
  id: string;
  title: string;
  mode: 'solo' | 'duet' | 'group';
  vibe: 'cozy' | 'dark' | 'epic' | 'mystery' | 'slice-of-life';
  description: string;
  setting: string;
  objective: string;
  npcs: string[];
  hooks: string[];
}

// Types for Health & Wellness Ideas
export interface HealthIdea {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  time_required: string;
  tools_needed: string[];
  benefits: string[];
  best_for: string[];
  instructions: string[];
}

// Types for Hoodoo Spiritual Ideas
export interface HoodooIdea {
  id: string;
  title: string;
  category: string;
  description: string;
  tradition: string;
  ingredients: string[];
  best_timing: string;
  instructions: string[];
  intentions: string;
  notes: string;
}

// Types for Passive Income Ideas
export interface PassiveIncomeIdea {
  id: string;
  title: string;
  category: string;
  description: string;
  startup_cost: string;
  time_investment: string;
  income_potential: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  energy_level: 'low' | 'medium' | 'high';
  skills_needed: string[];
  platforms: string[];
  steps: string[];
}

// Data access functions
export const kolHubData = {
  // D&D Adventure Hooks
  dnd: {
    getAll: (): AdventureHook[] => dndAdventureHooks.items as AdventureHook[],
    getByMode: (mode: 'solo' | 'duet' | 'group'): AdventureHook[] =>
      (dndAdventureHooks.items as AdventureHook[]).filter(item => item.mode === mode),
    getByVibe: (vibe: string): AdventureHook[] =>
      (dndAdventureHooks.items as AdventureHook[]).filter(item => item.vibe === vibe),
    getRandom: (): AdventureHook => {
      const items = dndAdventureHooks.items as AdventureHook[];
      return items[Math.floor(Math.random() * items.length)];
    },
    getRandomByFilters: (mode?: string, vibe?: string): AdventureHook => {
      let items = dndAdventureHooks.items as AdventureHook[];
      if (mode) items = items.filter(item => item.mode === mode);
      if (vibe) items = items.filter(item => item.vibe === vibe);
      return items[Math.floor(Math.random() * items.length)];
    },
    getCategories: () => dndAdventureHooks.categories,
    getModule: () => dndAdventureHooks.module,
    count: () => dndAdventureHooks.items.length,
  },

  // Health & Wellness Ideas
  health: {
    getAll: (): HealthIdea[] => healthWellnessIdeas.items as HealthIdea[],
    getByCategory: (category: string): HealthIdea[] =>
      (healthWellnessIdeas.items as HealthIdea[]).filter(item => item.category === category),
    getByDifficulty: (difficulty: string): HealthIdea[] =>
      (healthWellnessIdeas.items as HealthIdea[]).filter(item => item.difficulty === difficulty),
    getRandom: (): HealthIdea => {
      const items = healthWellnessIdeas.items as HealthIdea[];
      return items[Math.floor(Math.random() * items.length)];
    },
    getRandomByCategory: (category: string): HealthIdea => {
      const items = (healthWellnessIdeas.items as HealthIdea[]).filter(item => item.category === category);
      return items[Math.floor(Math.random() * items.length)];
    },
    getCategories: () => healthWellnessIdeas.categories,
    getModule: () => healthWellnessIdeas.module,
    count: () => healthWellnessIdeas.items.length,
    getCategoryList: () => Object.keys(healthWellnessIdeas.categories),
  },

  // Hoodoo & Spiritual Ideas
  hoodoo: {
    getAll: (): HoodooIdea[] => hoodooSpiritualIdeas.items as HoodooIdea[],
    getByCategory: (category: string): HoodooIdea[] =>
      (hoodooSpiritualIdeas.items as HoodooIdea[]).filter(item => item.category === category),
    getRandom: (): HoodooIdea => {
      const items = hoodooSpiritualIdeas.items as HoodooIdea[];
      return items[Math.floor(Math.random() * items.length)];
    },
    getRandomByCategory: (category: string): HoodooIdea => {
      const items = (hoodooSpiritualIdeas.items as HoodooIdea[]).filter(item => item.category === category);
      return items[Math.floor(Math.random() * items.length)];
    },
    getCategories: () => hoodooSpiritualIdeas.categories,
    getModule: () => hoodooSpiritualIdeas.module,
    getDisclaimer: () => hoodooSpiritualIdeas.disclaimer,
    count: () => hoodooSpiritualIdeas.items.length,
    getCategoryList: () => Object.keys(hoodooSpiritualIdeas.categories),
  },

  // Passive Income Ideas
  passiveIncome: {
    getAll: (): PassiveIncomeIdea[] => passiveIncomeIdeas.items as PassiveIncomeIdea[],
    getByCategory: (category: string): PassiveIncomeIdea[] =>
      (passiveIncomeIdeas.items as PassiveIncomeIdea[]).filter(item => item.category === category),
    getByDifficulty: (difficulty: string): PassiveIncomeIdea[] =>
      (passiveIncomeIdeas.items as PassiveIncomeIdea[]).filter(item => item.difficulty === difficulty),
    getByEnergyLevel: (energyLevel: string): PassiveIncomeIdea[] =>
      (passiveIncomeIdeas.items as PassiveIncomeIdea[]).filter(item => item.energy_level === energyLevel),
    getLowEnergy: (): PassiveIncomeIdea[] =>
      (passiveIncomeIdeas.items as PassiveIncomeIdea[]).filter(item => item.energy_level === 'low'),
    getRandom: (): PassiveIncomeIdea => {
      const items = passiveIncomeIdeas.items as PassiveIncomeIdea[];
      return items[Math.floor(Math.random() * items.length)];
    },
    getRandomByCategory: (category: string): PassiveIncomeIdea => {
      const items = (passiveIncomeIdeas.items as PassiveIncomeIdea[]).filter(item => item.category === category);
      return items[Math.floor(Math.random() * items.length)];
    },
    getCategories: () => passiveIncomeIdeas.categories,
    getModule: () => passiveIncomeIdeas.module,
    count: () => passiveIncomeIdeas.items.length,
    getCategoryList: () => Object.keys(passiveIncomeIdeas.categories),
  },

  // Combined stats
  getStats: () => ({
    dndHooks: dndAdventureHooks.items.length,
    healthIdeas: healthWellnessIdeas.items.length,
    hoodooIdeas: hoodooSpiritualIdeas.items.length,
    passiveIncomeIdeas: passiveIncomeIdeas.items.length,
    total: dndAdventureHooks.items.length + healthWellnessIdeas.items.length +
           hoodooSpiritualIdeas.items.length + passiveIncomeIdeas.items.length,
  }),

  // Search across all data
  search: (query: string): {
    dnd: AdventureHook[];
    health: HealthIdea[];
    hoodoo: HoodooIdea[];
    passiveIncome: PassiveIncomeIdea[];
  } => {
    const lowerQuery = query.toLowerCase();
    return {
      dnd: (dndAdventureHooks.items as AdventureHook[]).filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      ),
      health: (healthWellnessIdeas.items as HealthIdea[]).filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      ),
      hoodoo: (hoodooSpiritualIdeas.items as HoodooIdea[]).filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      ),
      passiveIncome: (passiveIncomeIdeas.items as PassiveIncomeIdea[]).filter(item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      ),
    };
  },

  // Get daily suggestion (consistent per day)
  getDailySuggestion: (type: 'dnd' | 'health' | 'hoodoo' | 'passiveIncome') => {
    const today = new Date().toDateString();
    const hash = today.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0);

    switch (type) {
      case 'dnd':
        return (dndAdventureHooks.items as AdventureHook[])[Math.abs(hash) % dndAdventureHooks.items.length];
      case 'health':
        return (healthWellnessIdeas.items as HealthIdea[])[Math.abs(hash) % healthWellnessIdeas.items.length];
      case 'hoodoo':
        return (hoodooSpiritualIdeas.items as HoodooIdea[])[Math.abs(hash) % hoodooSpiritualIdeas.items.length];
      case 'passiveIncome':
        return (passiveIncomeIdeas.items as PassiveIncomeIdea[])[Math.abs(hash) % passiveIncomeIdeas.items.length];
    }
  },
};

export default kolHubData;
