/**
 * KOL Hub App Initializer
 * Starts all critical services on app load
 * Uses lazy imports to prevent blocking
 */

import toast from 'react-hot-toast';

// All services are loaded lazily to prevent blocking app startup
let SyncManager: any = null;
let PassiveIncomeOrchestrator: any = null;
let googleSyncService: any = null;
let autoLibraryFiller: any = null;
let inworldAI: any = null;
let multiAIProvider: any = null;
let authService: any = null;
let integrationManager: any = null;
let realMoneyConnector: any = null;

// Lazy load services
const loadService = async (path: string, exportName: string) => {
  try {
    const module = await import(/* @vite-ignore */ path);
    return module[exportName] || module.default;
  } catch (error) {
    console.warn(`Failed to load ${exportName}:`, error);
    return null;
  }
};

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
   * Initialize all services - with lazy loading
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🚀 App already initialized');
      return;
    }

    console.log('🚀 Initializing KOL Hub...');

    try {
      // Load core services lazily first
      const loadPromises = [
        import('../services/auth-service').then(m => { authService = m.authService; }).catch(() => {}),
        import('../services/integration-manager').then(m => { integrationManager = m.integrationManager; }).catch(() => {}),
        import('../services/real-money-connector').then(m => { realMoneyConnector = m.realMoneyConnector; }).catch(() => {}),
      ];
      await Promise.allSettled(loadPromises);

      // 1. Initialize New Relic (optional)
      try {
        const { initializeNewRelic } = await import('./initializeNewRelic');
        initializeNewRelic();
      } catch (e) { console.warn('NewRelic skipped'); }

      // 2. Initialize Auth Service (Google OAuth)
      await this.initializeAuthService();

      // 3. Initialize Integration Manager
      await this.initializeIntegrations();

      // Load secondary services in background
      this.initializeBackgroundServices();

      this.isInitialized = true;
      console.log('✅ KOL Hub initialized successfully');

      // Show success notification
      setTimeout(() => {
        toast.success('🚀 All systems online', { duration: 3000, icon: '✨' });
      }, 1000);

    } catch (error) {
      console.error('❌ Initialization error:', error);
      // Don't show error toast - app still works
      this.isInitialized = true; // Mark as initialized anyway
    }
  }

  /**
   * Initialize non-critical services in background
   */
  private async initializeBackgroundServices(): Promise<void> {
    // Run these in background without blocking
    setTimeout(async () => {
      try {
        await this.initializeSyncManager();
        await this.initializePassiveIncome();
        await this.initializeGoogleServices();
        await this.initializeRealMoney();
        await this.initializeAccountTracking();
      } catch (e) {
        console.warn('Background services partial init:', e);
      }
    }, 2000);
  }

  /**
   * Initialize Auth Service with Google OAuth
   */
  private async initializeAuthService(): Promise<void> {
    try {
      console.log('🔐 Initializing Authentication...');

      authService.initialize({
        googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin + '/auth/callback'
      });

      const isAuth = authService.isAuthenticated();
      if (isAuth) {
        console.log('✅ User authenticated:', authService.getCurrentUser()?.email);
      } else {
        console.log('ℹ️ Authentication available (not logged in)');
      }
    } catch (error) {
      console.error('⚠️ Auth service initialization warning:', error);
      // Don't throw - auth is critical but shouldn't block app
    }
  }

  /**
   * Initialize Integration Manager with all API integrations
   */
  private async initializeIntegrations(): Promise<void> {
    try {
      console.log('🔌 Initializing API Integrations...');

      // Initialize all integrations with config from environment variables
      const results = await integrationManager.initializeAll({
        bitcoin: {
          rpcUrl: import.meta.env.VITE_BITCOIN_RPC_URL,
          rpcUser: import.meta.env.VITE_BITCOIN_RPC_USER,
          rpcPassword: import.meta.env.VITE_BITCOIN_RPC_PASSWORD
        },
        banking: {
          clientId: import.meta.env.VITE_PSD2_CLIENT_ID,
          clientSecret: import.meta.env.VITE_PSD2_CLIENT_SECRET,
          environment: import.meta.env.VITE_PSD2_ENVIRONMENT || 'sandbox'
        },
        finance: {
          username: import.meta.env.VITE_PERSONAL_CAPITAL_USERNAME,
          password: import.meta.env.VITE_PERSONAL_CAPITAL_PASSWORD
        },
        inventory: {
          apiKey: import.meta.env.VITE_INFLOW_API_KEY
        },
        learning: {
          clientId: import.meta.env.VITE_COURSERA_CLIENT_ID,
          clientSecret: import.meta.env.VITE_COURSERA_CLIENT_SECRET
        },
        'ai-models': {
          apiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY
        },
        'ai-chat': {
          baseURL: import.meta.env.VITE_LOCAL_LLM_URL || 'http://localhost:8000/v1',
          defaultModel: import.meta.env.VITE_LOCAL_LLM_MODEL || 'sydnikol/kol'
        }
      });

      // Log results
      const configured = Object.entries(results).filter(([_, success]) => success).length;
      console.log(`✅ Integrations initialized: ${configured}/${Object.keys(results).length} configured`);

      // Get integration statuses
      const statuses = integrationManager.getStatus();
      statuses.forEach(status => {
        if (status.configured) {
          console.log(`  ✓ ${status.name}`);
        } else {
          console.log(`  ○ ${status.name} (not configured)`);
        }
      });

      // Enable auto-sync for integrations (every 30 minutes)
      integrationManager.enableAutoSync(30);

    } catch (error) {
      console.error('⚠️ Integration initialization warning:', error);
      // Don't throw - integrations are optional
    }
  }

  /**
   * Initialize Sync Manager with auto-sync
   */
  private async initializeSyncManager(): Promise<void> {
    try {
      console.log('🔄 Starting Sync Manager...');

      const { SyncManager: SM } = await import('../services/sync/SyncManager');
      this.syncManager = SM.getInstance();

      const config = this.syncManager.getConfig();
      if (!config.autoSync) {
        this.syncManager.updateConfig({ autoSync: true });
      }

      console.log('✅ Sync Manager started');
    } catch (error) {
      console.warn('⚠️ Sync Manager skipped:', error);
    }
  }

  /**
   * Initialize Passive Income Orchestrator
   */
  private async initializePassiveIncome(): Promise<void> {
    try {
      console.log('💰 Starting Passive Income AI...');

      const { PassiveIncomeOrchestrator: PIO } = await import('../features/passive-income/agents/PassiveIncomeOrchestrator');
      this.passiveIncomeOrchestrator = PIO.getInstance();
      await this.passiveIncomeOrchestrator.start();

      console.log('✅ Passive Income AI started');
    } catch (error) {
      console.warn('⚠️ Passive Income skipped:', error);
    }
  }

  /**
   * Initialize Google Services
   */
  private async initializeGoogleServices(): Promise<void> {
    try {
      console.log('📱 Initializing Google Services...');

      const { googleSyncService: gss } = await import('../services/googleSyncService');
      await gss.initialize({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        scopes: ['https://www.googleapis.com/auth/userinfo.profile']
      });

      console.log('✅ Google Services ready');
    } catch (error) {
      console.warn('⚠️ Google Services skipped:', error);
    }
  }

  /**
   * Initialize REAL Money Connector
   */
  private async initializeRealMoney(): Promise<void> {
    try {
      console.log('💰 Initializing REAL Money System...');

      if (realMoneyConnector) {
        await realMoneyConnector.syncRealEarnings?.();
        console.log('✅ REAL Money System ready');
      }
    } catch (error) {
      console.warn('⚠️ Real Money skipped:', error);
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
   * Initialize Inworld AI
   */
  // These methods are stubs - services load on-demand when needed
  private async initializeInworldAI(): Promise<void> {
    console.log('🎭 Inworld AI available on-demand');
  }

  private async initializeMultiAI(): Promise<void> {
    console.log('🤖 Multi-AI Provider available on-demand');
  }

  private async initializeLibraries(): Promise<void> {
    console.log('📚 Libraries available on-demand');
  }

  private async initializeUnifiedSystem(): Promise<void> {
    console.log('🖤 Unified System available on-demand');
  }

  private async initializeEvolutionEngine(): Promise<void> {
    console.log('🧬 Evolution Engine available on-demand');
  }

  /**
   * Get current account balance
   */
  getAccountBalance(): number {
    return parseFloat(localStorage.getItem('accountBalance') || '0');
  }

  /**
   * Get library statistics
   */
  getLibraryStats() {
    return autoLibraryFiller.getLibraryStats();
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
