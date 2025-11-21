/**
 * App Initialization System
 * Handles first-run setup and seed data population
 */

import { seedAllData } from './seedData';
import { db } from './database';

const FIRST_RUN_KEY = 'app_initialized';
const SEED_DATA_KEY = 'seed_data_loaded';
const INIT_VERSION_KEY = 'init_version';
const CURRENT_VERSION = '1.0.0';

export interface InitializationStatus {
  isFirstRun: boolean;
  seedDataLoaded: boolean;
  version: string;
  timestamp: Date;
  needsUpdate: boolean;
}

export interface InitializationResult {
  success: boolean;
  status: InitializationStatus;
  message: string;
  error?: string;
}

/**
 * Check if this is the first run of the app
 */
export function isFirstRun(): boolean {
  return !localStorage.getItem(FIRST_RUN_KEY);
}

/**
 * Check if seed data has been loaded
 */
export function isSeedDataLoaded(): boolean {
  return localStorage.getItem(SEED_DATA_KEY) === 'true';
}

/**
 * Get the current initialization version
 */
export function getInitVersion(): string | null {
  return localStorage.getItem(INIT_VERSION_KEY);
}

/**
 * Check if the app needs an update/re-initialization
 */
export function needsUpdate(): boolean {
  const currentVersion = getInitVersion();
  return !currentVersion || currentVersion !== CURRENT_VERSION;
}

/**
 * Get the current initialization status
 */
export function getInitializationStatus(): InitializationStatus {
  return {
    isFirstRun: isFirstRun(),
    seedDataLoaded: isSeedDataLoaded(),
    version: getInitVersion() || 'none',
    timestamp: new Date(),
    needsUpdate: needsUpdate()
  };
}

/**
 * Mark the app as initialized
 */
function markAsInitialized(): void {
  localStorage.setItem(FIRST_RUN_KEY, 'true');
  localStorage.setItem(INIT_VERSION_KEY, CURRENT_VERSION);
  localStorage.setItem('app_initialized_at', new Date().toISOString());
}

/**
 * Mark seed data as loaded
 */
function markSeedDataLoaded(): void {
  localStorage.setItem(SEED_DATA_KEY, 'true');
  localStorage.setItem('seed_data_loaded_at', new Date().toISOString());
}

/**
 * Initialize the app on first run
 * This will:
 * 1. Check if it's the first run
 * 2. Load seed data if needed
 * 3. Set up localStorage flags
 * 4. Initialize database
 */
export async function initializeApp(options?: {
  skipSeedData?: boolean;
  forceReload?: boolean;
}): Promise<InitializationResult> {
  const { skipSeedData = false, forceReload = false } = options || {};

  try {
    console.log('Initializing app...');

    const status = getInitializationStatus();

    // If it's the first run or force reload is requested
    if (status.isFirstRun || forceReload) {
      console.log('First run detected - setting up app...');

      // Wait for database to be ready
      await db.open();
      console.log('Database ready');

      // Load seed data unless explicitly skipped
      if (!skipSeedData) {
        console.log('Loading seed data...');
        const seedResult = await seedAllData();

        if (!seedResult.success) {
          throw new Error(`Failed to load seed data: ${seedResult.error}`);
        }

        markSeedDataLoaded();
        console.log('Seed data loaded successfully');
      }

      // Mark app as initialized
      markAsInitialized();

      // Set up default preferences (if not already set by seed data)
      await ensureDefaultPreferences();

      console.log('App initialized successfully');

      return {
        success: true,
        status: getInitializationStatus(),
        message: forceReload
          ? 'App reinitialized successfully with fresh seed data'
          : 'Welcome! Your app has been set up with helpful starter data.'
      };
    }

    // App already initialized
    console.log('App already initialized');

    // Check if we need to update
    if (status.needsUpdate) {
      console.log('App version update detected');
      await handleVersionUpdate();
    }

    return {
      success: true,
      status: getInitializationStatus(),
      message: 'App is ready'
    };

  } catch (error) {
    console.error('App initialization failed:', error);
    return {
      success: false,
      status: getInitializationStatus(),
      message: 'Failed to initialize app',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Ensure default preferences are set
 */
async function ensureDefaultPreferences(): Promise<void> {
  const existingPrefs = await db.preferences.toArray();

  // If preferences already exist (from seed data), don't override
  if (existingPrefs.length > 0) {
    return;
  }

  const defaultPreferences = [
    { key: 'theme', value: 'gothic-purple', updatedAt: new Date() },
    { key: 'spoonCount', value: 5, updatedAt: new Date() },
    { key: 'medicationReminders', value: true, updatedAt: new Date() },
    { key: 'hydrationGoal', value: 2500, updatedAt: new Date() },
    { key: 'sodiumGoal', value: 4000, updatedAt: new Date() },
    { key: 'aiMode', value: 'companion', updatedAt: new Date() },
    { key: 'showWelcomeMessage', value: true, updatedAt: new Date() },
    { key: 'dataPrivacy', value: 'local-only', updatedAt: new Date() }
  ];

  await db.preferences.bulkAdd(defaultPreferences);
  console.log('Default preferences set');
}

/**
 * Handle version updates
 */
async function handleVersionUpdate(): Promise<void> {
  const oldVersion = getInitVersion();
  console.log(`Updating from version ${oldVersion} to ${CURRENT_VERSION}`);

  // Add migration logic here as the app evolves
  // For now, just update the version
  localStorage.setItem(INIT_VERSION_KEY, CURRENT_VERSION);
  localStorage.setItem('app_last_updated', new Date().toISOString());

  await db.logEvolution('App version updated', 'system', {
    oldVersion,
    newVersion: CURRENT_VERSION
  });

  console.log('Version update complete');
}

/**
 * Reset the app to first-run state
 * WARNING: This will clear all initialization flags but NOT the data
 * Use clearAllData() from seedData.ts to clear data
 */
export function resetInitialization(): void {
  localStorage.removeItem(FIRST_RUN_KEY);
  localStorage.removeItem(SEED_DATA_KEY);
  localStorage.removeItem(INIT_VERSION_KEY);
  localStorage.removeItem('app_initialized_at');
  localStorage.removeItem('seed_data_loaded_at');
  console.log('Initialization flags reset');
}

/**
 * Get initialization diagnostics
 */
export function getInitDiagnostics(): {
  status: InitializationStatus;
  localStorage: Record<string, string | null>;
  recommendations: string[];
} {
  const status = getInitializationStatus();
  const localStorageData = {
    firstRun: localStorage.getItem(FIRST_RUN_KEY),
    seedDataLoaded: localStorage.getItem(SEED_DATA_KEY),
    version: localStorage.getItem(INIT_VERSION_KEY),
    initializedAt: localStorage.getItem('app_initialized_at'),
    seedDataLoadedAt: localStorage.getItem('seed_data_loaded_at'),
    lastUpdated: localStorage.getItem('app_last_updated')
  };

  const recommendations: string[] = [];

  if (status.isFirstRun) {
    recommendations.push('Run initializeApp() to set up the app for first use');
  }

  if (!status.seedDataLoaded) {
    recommendations.push('Seed data not loaded - consider running seedAllData()');
  }

  if (status.needsUpdate) {
    recommendations.push('App version update available - initialization will handle this automatically');
  }

  return {
    status,
    localStorage: localStorageData,
    recommendations
  };
}

/**
 * Auto-initialize on app load (called from main app entry point)
 * This is a convenience function that can be called from App.tsx or main.tsx
 */
export async function autoInitialize(): Promise<InitializationResult> {
  // Only auto-initialize on first run
  if (isFirstRun()) {
    console.log('Auto-initializing app on first run...');
    return await initializeApp();
  }

  // Check for updates
  if (needsUpdate()) {
    console.log('Auto-updating app...');
    return await initializeApp({ skipSeedData: true });
  }

  // App already initialized and up to date
  return {
    success: true,
    status: getInitializationStatus(),
    message: 'App ready'
  };
}

/**
 * Development helper: Force reinitialize with fresh seed data
 * WARNING: This will reload all seed data (but won't delete existing data)
 */
export async function devReinitialize(): Promise<InitializationResult> {
  console.warn('DEV MODE: Force reinitialization with fresh seed data');
  resetInitialization();
  return await initializeApp({ forceReload: true });
}

// Export everything
export default {
  initializeApp,
  autoInitialize,
  isFirstRun,
  isSeedDataLoaded,
  getInitVersion,
  needsUpdate,
  getInitializationStatus,
  resetInitialization,
  getInitDiagnostics,
  devReinitialize
};
