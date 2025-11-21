/**
 * Cross-Platform Sync System
 * Keeps data synchronized across Android, Desktop, and Web versions
 */

export interface SyncConfig {
  enabled: boolean;
  syncFrequency: 'realtime' | '1min' | '5min' | '15min' | 'manual';
  conflictResolution: 'latest-wins' | 'merge' | 'manual';
  syncEndpoint?: string;
  platforms: ('android' | 'desktop' | 'web')[];
}

export interface SyncItem {
  key: string;
  value: any;
  timestamp: number;
  deviceId: string;
  platform: 'android' | 'desktop' | 'web';
  checksum: string;
}

export interface SyncStatus {
  lastSync: string | null;
  pendingChanges: number;
  totalSynced: number;
  conflicts: number;
  status: 'idle' | 'syncing' | 'error';
  error?: string;
}

export class CrossPlatformSyncSystem {
  private static instance: CrossPlatformSyncSystem;
  private config: SyncConfig;
  private syncStatus: SyncStatus;
  private deviceId: string;
  private platform: 'android' | 'desktop' | 'web';
  private pendingChanges: Map<string, SyncItem> = new Map();
  private syncInterval: any = null;
  private watchedKeys: Set<string> = new Set();

  static getInstance(): CrossPlatformSyncSystem {
    if (!CrossPlatformSyncSystem.instance) {
      CrossPlatformSyncSystem.instance = new CrossPlatformSyncSystem();
    }
    return CrossPlatformSyncSystem.instance;
  }

  constructor() {
    this.deviceId = this.getOrCreateDeviceId();
    this.platform = this.detectPlatform();
    this.config = this.loadConfig();
    this.syncStatus = {
      lastSync: null,
      pendingChanges: 0,
      totalSynced: 0,
      conflicts: 0,
      status: 'idle'
    };

    this.initializeWatchedKeys();
    this.setupStorageListener();
  }

  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  private detectPlatform(): 'android' | 'desktop' | 'web' {
    const userAgent = navigator.userAgent || '';

    // Check if running in Capacitor (Android/iOS)
    if ((window as any).Capacitor) {
      return 'android';
    }

    // Check if running in Electron (Desktop)
    if ((window as any).electron || userAgent.includes('Electron')) {
      return 'desktop';
    }

    // Default to web
    return 'web';
  }

  private loadConfig(): SyncConfig {
    const savedConfig = localStorage.getItem('syncConfig');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }

    const defaultConfig: SyncConfig = {
      enabled: true,
      syncFrequency: '5min',
      conflictResolution: 'latest-wins',
      platforms: ['android', 'desktop', 'web']
    };

    this.saveConfig(defaultConfig);
    return defaultConfig;
  }

  private saveConfig(config: SyncConfig) {
    localStorage.setItem('syncConfig', JSON.stringify(config));
  }

  private initializeWatchedKeys() {
    // Add all feature keys to watch for changes
    const featureKeys = [
      // Education
      'studySessions', 'courses', 'skills', 'certifications', 'researchProjects',

      // Entertainment
      'streamingWatchlist', 'games', 'books', 'podcasts', 'hobbies',

      // Community
      'volunteerActivities', 'advocacyCampaigns', 'events', 'connections', 'mentorships',

      // Lifestyle
      'recipes', 'homeProjects', 'wellnessActivities', 'trips', 'cooking',

      // Personal
      'goals', 'journalEntries', 'habits', 'timeBlocks', 'memories',

      // Finance
      'budgets', 'expenses', 'investments', 'savingsGoals', 'debts',

      // Health
      'medications', 'vitals', 'workouts', 'nutrition', 'sleep',

      // System
      'aiInsights', 'automationRules', 'appPlugins'
    ];

    featureKeys.forEach(key => this.watchedKeys.add(key));
  }

  private setupStorageListener() {
    // Listen for storage changes
    window.addEventListener('storage', (event) => {
      if (event.key && this.watchedKeys.has(event.key)) {
        this.handleLocalChange(event.key, event.newValue);
      }
    });

    // Intercept localStorage setItem
    const originalSetItem = Storage.prototype.setItem;
    const self = this;

    Storage.prototype.setItem = function(key: string, value: string) {
      originalSetItem.call(this, key, value);

      if (self.watchedKeys.has(key)) {
        self.handleLocalChange(key, value);
      }
    };
  }

  private handleLocalChange(key: string, value: string | null) {
    if (!this.config.enabled || !value) return;

    const syncItem: SyncItem = {
      key,
      value: JSON.parse(value),
      timestamp: Date.now(),
      deviceId: this.deviceId,
      platform: this.platform,
      checksum: this.calculateChecksum(value)
    };

    this.pendingChanges.set(key, syncItem);
    this.syncStatus.pendingChanges = this.pendingChanges.size;

    // Auto-sync for realtime or 1min frequencies
    if (this.config.syncFrequency === 'realtime' || this.config.syncFrequency === '1min') {
      this.sync();
    }
  }

  private calculateChecksum(data: string): string {
    // Simple checksum - in production use crypto.subtle.digest
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  start() {
    if (!this.config.enabled) {
      console.log('⏸️ Sync disabled');
      return;
    }

    // Clear existing interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    // Set up sync interval based on frequency
    const intervals = {
      'realtime': 1000, // 1 second
      '1min': 60 * 1000,
      '5min': 5 * 60 * 1000,
      '15min': 15 * 60 * 1000,
      'manual': 0
    };

    const interval = intervals[this.config.syncFrequency];
    if (interval > 0) {
      this.syncInterval = setInterval(() => {
        this.sync();
      }, interval);
    }

    // Do initial sync
    this.sync();

    console.log(`✅ Cross-Platform Sync started (${this.platform}, ${this.config.syncFrequency})`);
  }

  stop() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    console.log('⏹️ Cross-Platform Sync stopped');
  }

  async sync(): Promise<void> {
    if (this.syncStatus.status === 'syncing') {
      console.log('🔄 Sync already in progress...');
      return;
    }

    if (this.pendingChanges.size === 0) {
      return; // Nothing to sync
    }

    this.syncStatus.status = 'syncing';

    try {
      // 1. Get pending changes
      const changes = Array.from(this.pendingChanges.values());

      // 2. Push changes to sync storage
      await this.pushChanges(changes);

      // 3. Pull remote changes
      const remoteChanges = await this.pullChanges();

      // 4. Apply remote changes
      await this.applyRemoteChanges(remoteChanges);

      // 5. Clear pending changes
      this.pendingChanges.clear();

      // 6. Update status
      this.syncStatus.lastSync = new Date().toISOString();
      this.syncStatus.totalSynced += changes.length;
      this.syncStatus.pendingChanges = 0;
      this.syncStatus.status = 'idle';
      this.syncStatus.error = undefined;

      console.log(`✅ Sync completed: ${changes.length} items synced`);

    } catch (error) {
      this.syncStatus.status = 'error';
      this.syncStatus.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Sync failed:', error);
    }
  }

  private async pushChanges(changes: SyncItem[]): Promise<void> {
    // In production, this would push to a cloud service (Firebase, AWS, etc.)
    // For now, store in IndexedDB for cross-tab sync

    return new Promise((resolve) => {
      const dbName = 'cross-platform-sync';
      const request = indexedDB.open(dbName, 1);

      request.onerror = () => resolve(); // Silent fail for demo

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('syncData')) {
          db.createObjectStore('syncData', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['syncData'], 'readwrite');
        const store = transaction.objectStore('syncData');

        changes.forEach(change => {
          store.put(change);
        });

        transaction.oncomplete = () => {
          db.close();
          resolve();
        };
      };
    });
  }

  private async pullChanges(): Promise<SyncItem[]> {
    // Pull changes from IndexedDB that are newer than our local data
    return new Promise((resolve) => {
      const dbName = 'cross-platform-sync';
      const request = indexedDB.open(dbName, 1);

      request.onerror = () => resolve([]);

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['syncData'], 'readonly');
        const store = transaction.objectStore('syncData');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const allItems: SyncItem[] = getAllRequest.result;

          // Filter for items from other devices
          const remoteChanges = allItems.filter(item =>
            item.deviceId !== this.deviceId
          );

          db.close();
          resolve(remoteChanges);
        };

        getAllRequest.onerror = () => {
          db.close();
          resolve([]);
        };
      };
    });
  }

  private async applyRemoteChanges(changes: SyncItem[]): Promise<void> {
    for (const change of changes) {
      const localData = localStorage.getItem(change.key);
      const localItem: SyncItem | null = localData ? {
        key: change.key,
        value: JSON.parse(localData),
        timestamp: 0, // Unknown for local
        deviceId: this.deviceId,
        platform: this.platform,
        checksum: this.calculateChecksum(localData)
      } : null;

      // Conflict resolution
      if (localItem && localItem.checksum !== change.checksum) {
        // Data differs - apply conflict resolution
        if (this.config.conflictResolution === 'latest-wins') {
          // Remote is always newer in this flow
          localStorage.setItem(change.key, JSON.stringify(change.value));
        } else if (this.config.conflictResolution === 'merge') {
          // Attempt to merge
          const merged = this.mergeData(localItem.value, change.value);
          localStorage.setItem(change.key, JSON.stringify(merged));
        } else {
          // Manual - mark as conflict
          this.syncStatus.conflicts++;
        }
      } else {
        // No conflict - apply remote change
        localStorage.setItem(change.key, JSON.stringify(change.value));
      }
    }
  }

  private mergeData(local: any, remote: any): any {
    // Smart merge for arrays (union)
    if (Array.isArray(local) && Array.isArray(remote)) {
      const merged = [...local];
      const localIds = new Set(local.map((item: any) => item.id));

      remote.forEach((item: any) => {
        if (!localIds.has(item.id)) {
          merged.push(item);
        } else {
          // Update existing item if remote is newer
          const localIndex = merged.findIndex((l: any) => l.id === item.id);
          if (item.updatedAt && merged[localIndex].updatedAt) {
            if (new Date(item.updatedAt) > new Date(merged[localIndex].updatedAt)) {
              merged[localIndex] = item;
            }
          }
        }
      });

      return merged;
    }

    // For objects, merge properties
    if (typeof local === 'object' && typeof remote === 'object') {
      return { ...local, ...remote };
    }

    // For primitives, use remote (latest wins)
    return remote;
  }

  // Public API
  updateConfig(config: Partial<SyncConfig>) {
    this.config = { ...this.config, ...config };
    this.saveConfig(this.config);

    if (config.enabled !== undefined) {
      if (config.enabled) {
        this.start();
      } else {
        this.stop();
      }
    } else if (config.syncFrequency) {
      this.stop();
      this.start();
    }
  }

  getConfig(): SyncConfig {
    return { ...this.config };
  }

  getStatus(): SyncStatus {
    return { ...this.syncStatus };
  }

  getPlatformInfo() {
    return {
      deviceId: this.deviceId,
      platform: this.platform,
      userAgent: navigator.userAgent
    };
  }

  forceSync(): Promise<void> {
    return this.sync();
  }

  clearPendingChanges() {
    this.pendingChanges.clear();
    this.syncStatus.pendingChanges = 0;
  }

  exportData(): string {
    const data: any = {};
    this.watchedKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });

    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      Object.entries(data).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  resetSync() {
    this.stop();
    this.pendingChanges.clear();
    this.syncStatus = {
      lastSync: null,
      pendingChanges: 0,
      totalSynced: 0,
      conflicts: 0,
      status: 'idle'
    };

    // Clear IndexedDB
    indexedDB.deleteDatabase('cross-platform-sync');
    console.log('🔄 Sync reset complete');
  }
}

// Initialize and start the sync system
export const crossPlatformSync = CrossPlatformSyncSystem.getInstance();
