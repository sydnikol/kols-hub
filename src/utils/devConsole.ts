/**
 * Developer Console Helpers
 * Expose seed data functions to browser console for easy development
 *
 * Usage in browser console:
 * - window.kolDev.seed() - Seed all data
 * - window.kolDev.clear() - Clear all data
 * - window.kolDev.status() - Check initialization status
 * - window.kolDev.reset() - Reset and reseed
 */

import {
  seedAllData,
  clearAllData,
  seedHealthData,
  seedAICompanionData,
  seedEducationData,
  seedPassiveIncomeData,
  seedWardrobeData,
  seedEntertainmentData,
  seedDnDData,
  seedAncestryData,
  seedCrisisSupportData,
  seedCalendarTasksData
} from './seedData';

import {
  initializeApp,
  getInitializationStatus,
  getInitDiagnostics,
  devReinitialize,
  resetInitialization,
  isFirstRun,
  isSeedDataLoaded
} from './initializeApp';

import { db } from './database';

// Development helpers exposed to window
const kolDev = {
  // Quick actions
  seed: async () => {
    console.log('🌱 Seeding all data...');
    const result = await seedAllData();
    console.log(result.success ? '✅ Seed complete!' : '❌ Seed failed:', result.error);
    return result;
  },

  clear: async () => {
    console.log('🧹 Clearing all data...');
    const result = await clearAllData();
    console.log(result.success ? '✅ Clear complete!' : '❌ Clear failed:', result.error);
    return result;
  },

  reset: async () => {
    console.log('🔄 Resetting and reseeding...');
    await clearAllData();
    const result = await seedAllData();
    console.log(result.success ? '✅ Reset complete!' : '❌ Reset failed:', result.error);
    return result;
  },

  status: () => {
    const status = getInitializationStatus();
    console.table(status);
    return status;
  },

  diagnostics: () => {
    const diag = getInitDiagnostics();
    console.group('📊 Diagnostics');
    console.log('Status:', diag.status);
    console.log('LocalStorage:', diag.localStorage);
    console.log('Recommendations:', diag.recommendations);
    console.groupEnd();
    return diag;
  },

  // Individual seed functions
  seedHealth: async () => {
    console.log('💊 Seeding health data...');
    await seedHealthData();
    console.log('✅ Health data seeded');
  },

  seedAI: async () => {
    console.log('🤖 Seeding AI companion data...');
    await seedAICompanionData();
    console.log('✅ AI companion data seeded');
  },

  seedEducation: async () => {
    console.log('📚 Seeding education data...');
    await seedEducationData();
    console.log('✅ Education data seeded');
  },

  seedIncome: async () => {
    console.log('💰 Seeding passive income data...');
    await seedPassiveIncomeData();
    console.log('✅ Passive income data seeded');
  },

  seedWardrobe: async () => {
    console.log('👗 Seeding wardrobe data...');
    await seedWardrobeData();
    console.log('✅ Wardrobe data seeded');
  },

  seedEntertainment: async () => {
    console.log('🎮 Seeding entertainment data...');
    await seedEntertainmentData();
    console.log('✅ Entertainment data seeded');
  },

  seedDnD: async () => {
    console.log('🎲 Seeding D&D data...');
    await seedDnDData();
    console.log('✅ D&D data seeded');
  },

  seedAncestry: async () => {
    console.log('🌳 Seeding ancestry data...');
    await seedAncestryData();
    console.log('✅ Ancestry data seeded');
  },

  seedCrisis: async () => {
    console.log('🆘 Seeding crisis support data...');
    await seedCrisisSupportData();
    console.log('✅ Crisis support data seeded');
  },

  seedTasks: async () => {
    console.log('✅ Seeding tasks data...');
    await seedCalendarTasksData();
    console.log('✅ Tasks data seeded');
  },

  // Database helpers
  db: {
    stats: async () => {
      const stats = {
        medications: await db.medications.count(),
        vitals: await db.vitals.count(),
        hydration: await db.hydration.count(),
        pain: await db.pain.count(),
        mood: await db.mood.count(),
        bodyWeatherLogs: await db.bodyWeatherLogs.count(),
        conversations: await db.conversations.count(),
        education: await db.education.count(),
        learningMoments: await db.learningMoments.count(),
        passiveIncomeIdeas: await db.passiveIncomeIdeas.count(),
        wardrobe: await db.wardrobe.count(),
        ideaLibrary: await db.ideaLibrary.count(),
        advocacyScripts: await db.advocacyScripts.count(),
        supportHandbooks: await db.supportHandbooks.count(),
        emergencyCards: await db.emergencyCards.count(),
        tasks: await db.tasks.count(),
        preferences: await db.preferences.count(),
        evolutionLogs: await db.evolutionLogs.count()
      };
      console.table(stats);
      return stats;
    },

    vitals: async (limit = 10) => {
      const vitals = await db.vitals.orderBy('timestamp').reverse().limit(limit).toArray();
      console.table(vitals);
      return vitals;
    },

    meds: async () => {
      const meds = await db.medications.where('status').equals('Active').toArray();
      console.table(meds);
      return meds;
    },

    conversations: async (limit = 5) => {
      const convos = await db.conversations.orderBy('timestamp').reverse().limit(limit).toArray();
      console.table(convos);
      return convos;
    },

    courses: async () => {
      const courses = await db.education.toArray();
      console.table(courses.map(c => ({
        name: c.courseName,
        progress: `${c.progress}%`,
        status: c.status,
        credits: c.creditHours
      })));
      return courses;
    },

    tasks: async () => {
      const tasks = await db.tasks.toArray();
      console.table(tasks.map(t => ({
        title: t.title,
        completed: t.completed,
        priority: t.priority,
        dueDate: t.dueDate
      })));
      return tasks;
    }
  },

  // Initialization helpers
  init: {
    full: async () => {
      console.log('🚀 Full initialization...');
      const result = await initializeApp();
      console.log(result);
      return result;
    },

    skipSeed: async () => {
      console.log('🚀 Initialize without seed data...');
      const result = await initializeApp({ skipSeedData: true });
      console.log(result);
      return result;
    },

    force: async () => {
      console.log('🚀 Force reinitialize...');
      const result = await devReinitialize();
      console.log(result);
      return result;
    },

    resetFlags: () => {
      console.log('🔧 Resetting initialization flags...');
      resetInitialization();
      console.log('✅ Flags reset');
    },

    isFirstRun: () => {
      const first = isFirstRun();
      console.log('First run?', first);
      return first;
    },

    hasSeedData: () => {
      const has = isSeedDataLoaded();
      console.log('Seed data loaded?', has);
      return has;
    }
  },

  // Utility helpers
  utils: {
    clearLocalStorage: () => {
      const before = localStorage.length;
      localStorage.clear();
      console.log(`🧹 Cleared ${before} localStorage items`);
    },

    showLocalStorage: () => {
      const items: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) items[key] = localStorage.getItem(key);
      }
      console.table(items);
      return items;
    },

    exportData: async () => {
      console.log('📦 Exporting all data...');
      const data = {
        medications: await db.medications.toArray(),
        vitals: await db.vitals.toArray(),
        hydration: await db.hydration.toArray(),
        pain: await db.pain.toArray(),
        mood: await db.mood.toArray(),
        bodyWeatherLogs: await db.bodyWeatherLogs.toArray(),
        conversations: await db.conversations.toArray(),
        education: await db.education.toArray(),
        tasks: await db.tasks.toArray()
      };
      console.log('✅ Data exported to console');
      return data;
    }
  },

  // Help
  help: () => {
    console.log(`
🖤 KOL Dev Console Helpers
=========================

QUICK ACTIONS:
  kolDev.seed()        - Seed all data
  kolDev.clear()       - Clear all data
  kolDev.reset()       - Clear and reseed
  kolDev.status()      - Show initialization status
  kolDev.diagnostics() - Show detailed diagnostics

INDIVIDUAL SEEDS:
  kolDev.seedHealth()        - Health data only
  kolDev.seedAI()            - AI companion only
  kolDev.seedEducation()     - Education only
  kolDev.seedIncome()        - Passive income only
  kolDev.seedWardrobe()      - Wardrobe only
  kolDev.seedEntertainment() - Entertainment only
  kolDev.seedDnD()           - D&D only
  kolDev.seedAncestry()      - Ancestry only
  kolDev.seedCrisis()        - Crisis support only
  kolDev.seedTasks()         - Tasks only

DATABASE QUERIES:
  kolDev.db.stats()          - Count all tables
  kolDev.db.vitals()         - Show recent vitals
  kolDev.db.meds()           - Show active medications
  kolDev.db.conversations()  - Show recent AI conversations
  kolDev.db.courses()        - Show education courses
  kolDev.db.tasks()          - Show all tasks

INITIALIZATION:
  kolDev.init.full()         - Full initialization
  kolDev.init.skipSeed()     - Init without seed data
  kolDev.init.force()        - Force reinitialize
  kolDev.init.resetFlags()   - Reset init flags
  kolDev.init.isFirstRun()   - Check if first run
  kolDev.init.hasSeedData()  - Check if seed data loaded

UTILITIES:
  kolDev.utils.clearLocalStorage()  - Clear all localStorage
  kolDev.utils.showLocalStorage()   - Show localStorage items
  kolDev.utils.exportData()         - Export all data to console

Type kolDev.help() to see this message again.
    `);
  }
};

// Expose to window for console access
if (typeof window !== 'undefined') {
  (window as any).kolDev = kolDev;
  console.log('🖤 KOL Dev Console Ready! Type kolDev.help() for commands.');
}

export default kolDev;
