/**
 * KOL Hub App Initializer
 * Starts all critical services on app load
 */

import { SyncManager } from '../services/sync/SyncManager';
import { PassiveIncomeOrchestrator } from '../features/passive-income/agents/PassiveIncomeOrchestrator';
import { googleSyncService } from '../services/googleSyncService';
import toast from 'react-hot-toast';

export class AppInitializer {
  private static instance: AppInitializer;
  private isInitialized = false;
  private syncManager: SyncManager | null = null;
  private passiveIncomeOrchestrator: PassiveIncomeOrchestrator | null = null;

  private constructor() {}

  static getInstance(): AppInitializer {
    if (!AppInitializer.instance) {
      AppInitializer.instance = new AppInitializer();
    }
    return AppInitializer.instance;
  }

  /**
   * Initialize all services
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🚀 App already initialized');
      return;
    }

    console.log('🚀 Initializing KOL Hub...');

    try {
      // 1. Initialize Sync Manager
      await this.initializeSyncManager();

      // 2. Initialize Passive Income Orchestrator
      await this.initializePassiveIncome();

      // 3. Initialize Google Services
      await this.initializeGoogleServices();

      // 4. Initialize Account Balance Tracking
      await this.initializeAccountTracking();

      this.isInitialized = true;
      console.log('✅ KOL Hub initialized successfully');

      // Show success notification after a delay
      setTimeout(() => {
        toast.success('🚀 All systems online', {
          duration: 3000,
          icon: '✨',
        });
      }, 1000);

    } catch (error) {
      console.error('❌ Initialization error:', error);
      toast.error('Failed to initialize some services');
    }
  }

  /**
   * Initialize Sync Manager with auto-sync
   */
  private async initializeSyncManager(): Promise<void> {
    try {
      console.log('🔄 Starting Sync Manager...');

      this.syncManager = SyncManager.getInstance();

      // Sync Manager auto-starts if configured
      const config = this.syncManager.getConfig();

      if (!config.autoSync) {
        // Enable auto-sync if not already enabled
        this.syncManager.updateConfig({ autoSync: true });
      }

      // Perform initial sync
      console.log('🔄 Running initial sync...');
      await this.syncManager.syncAll();

      console.log('✅ Sync Manager started');
    } catch (error) {
      console.error('❌ Sync Manager initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize Passive Income Orchestrator
   */
  private async initializePassiveIncome(): Promise<void> {
    try {
      console.log('💰 Starting Passive Income AI...');

      this.passiveIncomeOrchestrator = PassiveIncomeOrchestrator.getInstance();

      // Start all passive income agents
      await this.passiveIncomeOrchestrator.start();

      console.log('✅ Passive Income AI started');
    } catch (error) {
      console.error('❌ Passive Income initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize Google Services
   */
  private async initializeGoogleServices(): Promise<void> {
    try {
      console.log('📱 Initializing Google Services...');

      // Initialize Google Sync Service
      await googleSyncService.initialize({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        scopes: [
          'https://www.googleapis.com/auth/photoslibrary.readonly',
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ]
      });

      // Check if already authenticated
      const isAuthenticated = await googleSyncService.isAuthenticated();

      if (isAuthenticated) {
        console.log('✅ Google Services authenticated');
      } else {
        console.log('ℹ️ Google Services available (not authenticated)');
      }
    } catch (error) {
      console.error('⚠️ Google Services initialization warning:', error);
      // Don't throw - Google services are optional
    }
  }

  /**
   * Initialize Account Balance Tracking
   * Connects passive income earnings to user account
   */
  private async initializeAccountTracking(): Promise<void> {
    try {
      console.log('💵 Setting up account tracking...');

      // Set up periodic account balance updates from passive income
      setInterval(async () => {
        if (this.passiveIncomeOrchestrator) {
          const stats = await this.passiveIncomeOrchestrator.getStats();

          // Update account balance in localStorage
          const currentBalance = parseFloat(localStorage.getItem('accountBalance') || '0');
          const newBalance = currentBalance + (stats.todayRevenue || 0);

          localStorage.setItem('accountBalance', newBalance.toString());
          localStorage.setItem('totalPassiveIncome', stats.monthlyRevenue.toString());

          // Log balance update
          if (stats.todayRevenue > 0) {
            console.log(`💰 Account updated: +$${stats.todayRevenue.toFixed(2)} | Balance: $${newBalance.toFixed(2)}`);
          }
        }
      }, 60000); // Check every minute

      console.log('✅ Account tracking initialized');
    } catch (error) {
      console.error('⚠️ Account tracking warning:', error);
      // Don't throw - this is not critical
    }
  }

  /**
   * Get Sync Manager instance
   */
  getSyncManager(): SyncManager | null {
    return this.syncManager;
  }

  /**
   * Get Passive Income Orchestrator instance
   */
  getPassiveIncomeOrchestrator(): PassiveIncomeOrchestrator | null {
    return this.passiveIncomeOrchestrator;
  }

  /**
   * Get current account balance
   */
  getAccountBalance(): number {
    return parseFloat(localStorage.getItem('accountBalance') || '0');
  }

  /**
   * Get total passive income
   */
  getTotalPassiveIncome(): number {
    return parseFloat(localStorage.getItem('totalPassiveIncome') || '0');
  }

  /**
   * Manual sync trigger
   */
  async manualSync(): Promise<void> {
    if (this.syncManager) {
      await this.syncManager.syncAll();
      toast.success('Sync complete!');
    } else {
      toast.error('Sync Manager not initialized');
    }
  }

  /**
   * Get passive income stats
   */
  async getPassiveIncomeStats() {
    if (this.passiveIncomeOrchestrator) {
      return await this.passiveIncomeOrchestrator.getStats();
    }
    return null;
  }

  /**
   * Check if initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const appInitializer = AppInitializer.getInstance();
export default appInitializer;
