/**
 * Kol's Hub - Cross-Device Sync System
 * Synchronizes data between mobile, desktop, and web platforms
 * Uses localStorage, IndexedDB, and cloud sync (Google Drive/Firebase)
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Types
interface KolsHubDB extends DBSchema {
  syncData: {
    key: string;
    value: SyncableData;
    indexes: { 'by-category': string; 'by-timestamp': number };
  };
  syncLog: {
    key: number;
    value: SyncLogEntry;
  };
  devices: {
    key: string;
    value: DeviceRecord;
  };
}

export interface SyncableData {
  id: string;
  category: SyncCategory;
  data: any;
  timestamp: number;
  deviceId: string;
  version: number;
  checksum: string;
}

export interface SyncLogEntry {
  id: number;
  action: 'create' | 'update' | 'delete' | 'sync';
  dataId: string;
  category: SyncCategory;
  timestamp: number;
  deviceId: string;
  status: 'pending' | 'synced' | 'conflict' | 'error';
  errorMessage?: string;
}

export interface DeviceRecord {
  id: string;
  name: string;
  platform: 'android' | 'ios' | 'web' | 'desktop' | 'electron';
  lastSeen: number;
  syncEnabled: boolean;
  pushToken?: string;
}

export type SyncCategory =
  | 'health'
  | 'medications'
  | 'contacts'
  | 'calendar'
  | 'notes'
  | 'settings'
  | 'themes'
  | 'ideas'
  | 'finance'
  | 'ancestry'
  | 'creative'
  | 'gaming'
  | 'all';

export interface SyncStatus {
  lastSync: number;
  pendingChanges: number;
  connectedDevices: number;
  syncEnabled: boolean;
  cloudConnected: boolean;
  conflicts: number;
}

export interface SyncConfig {
  autoSync: boolean;
  syncInterval: number; // minutes
  syncOnWifi: boolean;
  syncCategories: SyncCategory[];
  cloudProvider: 'google' | 'firebase' | 'local' | null;
  conflictResolution: 'latest' | 'manual' | 'merge';
}

// Sync Service
class CrossDeviceSyncService {
  private db: IDBPDatabase<KolsHubDB> | null = null;
  private deviceId: string;
  private config: SyncConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.deviceId = this.getOrCreateDeviceId();
    this.config = this.loadConfig();
    this.initialize();
  }

  private async initialize() {
    await this.openDatabase();
    await this.registerDevice();
    this.setupEventListeners();
    this.startAutoSync();
    console.log("Kol's Hub Sync Service initialized - Device:", this.deviceId);
  }

  // ==================== DATABASE ====================
  private async openDatabase(): Promise<void> {
    this.db = await openDB<KolsHubDB>('kolshub-sync', 1, {
      upgrade(db) {
        // Sync data store
        const syncStore = db.createObjectStore('syncData', { keyPath: 'id' });
        syncStore.createIndex('by-category', 'category');
        syncStore.createIndex('by-timestamp', 'timestamp');

        // Sync log store
        db.createObjectStore('syncLog', { keyPath: 'id', autoIncrement: true });

        // Devices store
        db.createObjectStore('devices', { keyPath: 'id' });
      },
    });
  }

  // ==================== DEVICE MANAGEMENT ====================
  private getOrCreateDeviceId(): string {
    let deviceId = localStorage.getItem('kolshub_device_id');
    if (!deviceId) {
      deviceId = `kh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('kolshub_device_id', deviceId);
    }
    return deviceId;
  }

  private async registerDevice(): Promise<void> {
    if (!this.db) return;

    const platform = this.detectPlatform();
    const device: DeviceRecord = {
      id: this.deviceId,
      name: `Kol's Hub - ${platform}`,
      platform,
      lastSeen: Date.now(),
      syncEnabled: true,
    };

    await this.db.put('devices', device);
  }

  private detectPlatform(): DeviceRecord['platform'] {
    if ((window as any).electronAPI) return 'electron';
    if ((window as any).Capacitor?.isNativePlatform()) {
      return /Android/i.test(navigator.userAgent) ? 'android' : 'ios';
    }
    return 'web';
  }

  async getConnectedDevices(): Promise<DeviceRecord[]> {
    if (!this.db) return [];
    return await this.db.getAll('devices');
  }

  // ==================== DATA SYNC ====================
  async saveData(category: SyncCategory, id: string, data: any): Promise<void> {
    if (!this.db) return;

    const syncData: SyncableData = {
      id: `${category}_${id}`,
      category,
      data,
      timestamp: Date.now(),
      deviceId: this.deviceId,
      version: await this.getNextVersion(`${category}_${id}`),
      checksum: this.calculateChecksum(data),
    };

    await this.db.put('syncData', syncData);
    await this.logSyncAction('create', syncData.id, category);

    // Trigger sync if auto-sync enabled
    if (this.config.autoSync && this.isOnline) {
      this.syncToCloud([syncData]);
    }

    this.emit('dataChanged', { category, id, data });
  }

  async getData(category: SyncCategory, id: string): Promise<any | null> {
    if (!this.db) return null;

    const syncData = await this.db.get('syncData', `${category}_${id}`);
    return syncData?.data || null;
  }

  async getAllData(category: SyncCategory): Promise<SyncableData[]> {
    if (!this.db) return [];

    if (category === 'all') {
      return await this.db.getAll('syncData');
    }

    return await this.db.getAllFromIndex('syncData', 'by-category', category);
  }

  async deleteData(category: SyncCategory, id: string): Promise<void> {
    if (!this.db) return;

    await this.db.delete('syncData', `${category}_${id}`);
    await this.logSyncAction('delete', `${category}_${id}`, category);

    this.emit('dataDeleted', { category, id });
  }

  private async getNextVersion(id: string): Promise<number> {
    if (!this.db) return 1;

    const existing = await this.db.get('syncData', id);
    return (existing?.version || 0) + 1;
  }

  private calculateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  // ==================== SYNC LOG ====================
  private async logSyncAction(
    action: SyncLogEntry['action'],
    dataId: string,
    category: SyncCategory
  ): Promise<void> {
    if (!this.db) return;

    const entry: Omit<SyncLogEntry, 'id'> = {
      action,
      dataId,
      category,
      timestamp: Date.now(),
      deviceId: this.deviceId,
      status: 'pending',
    };

    await this.db.add('syncLog', entry as SyncLogEntry);
  }

  async getSyncLog(limit: number = 100): Promise<SyncLogEntry[]> {
    if (!this.db) return [];

    const all = await this.db.getAll('syncLog');
    return all.slice(-limit).reverse();
  }

  async getPendingChanges(): Promise<SyncLogEntry[]> {
    if (!this.db) return [];

    const all = await this.db.getAll('syncLog');
    return all.filter(e => e.status === 'pending');
  }

  // ==================== CLOUD SYNC ====================
  async syncToCloud(data?: SyncableData[]): Promise<void> {
    if (!this.isOnline) {
      console.log("Kol's Hub: Offline - sync queued");
      return;
    }

    const toSync = data || await this.getAllData('all');
    const pending = await this.getPendingChanges();

    try {
      if (this.config.cloudProvider === 'google') {
        await this.syncWithGoogleDrive(toSync);
      } else if (this.config.cloudProvider === 'firebase') {
        await this.syncWithFirebase(toSync);
      }

      // Mark all pending as synced
      await this.markAsSynced(pending.map(p => p.id));

      this.emit('syncComplete', { itemsSynced: toSync.length });
    } catch (error) {
      console.error("Kol's Hub sync failed:", error);
      this.emit('syncError', { error });
    }
  }

  async pullFromCloud(): Promise<void> {
    if (!this.isOnline) return;

    try {
      let cloudData: SyncableData[] = [];

      if (this.config.cloudProvider === 'google') {
        cloudData = await this.fetchFromGoogleDrive();
      } else if (this.config.cloudProvider === 'firebase') {
        cloudData = await this.fetchFromFirebase();
      }

      // Merge with local data
      for (const item of cloudData) {
        await this.mergeData(item);
      }

      this.emit('pullComplete', { itemsPulled: cloudData.length });
    } catch (error) {
      console.error("Kol's Hub pull failed:", error);
      this.emit('pullError', { error });
    }
  }

  private async syncWithGoogleDrive(data: SyncableData[]): Promise<void> {
    const token = localStorage.getItem('google_access_token');
    if (!token) return;

    // Create or update sync file
    const syncContent = JSON.stringify({
      deviceId: this.deviceId,
      timestamp: Date.now(),
      data,
    });

    try {
      // Check if sync file exists
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='kolshub_sync.json'&spaces=appDataFolder`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const searchResult = await searchResponse.json();
      const fileId = searchResult.files?.[0]?.id;

      if (fileId) {
        // Update existing file
        await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: syncContent,
          }
        );
      } else {
        // Create new file
        const metadata = {
          name: 'kolshub_sync.json',
          parents: ['appDataFolder'],
          mimeType: 'application/json',
        };

        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', new Blob([syncContent], { type: 'application/json' }));

        await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: form,
          }
        );
      }
    } catch (error) {
      console.error('Google Drive sync failed:', error);
      throw error;
    }
  }

  private async fetchFromGoogleDrive(): Promise<SyncableData[]> {
    const token = localStorage.getItem('google_access_token');
    if (!token) return [];

    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='kolshub_sync.json'&spaces=appDataFolder`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const searchResult = await searchResponse.json();
      const fileId = searchResult.files?.[0]?.id;

      if (!fileId) return [];

      const contentResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const content = await contentResponse.json();
      return content.data || [];
    } catch (error) {
      console.error('Google Drive fetch failed:', error);
      return [];
    }
  }

  private async syncWithFirebase(data: SyncableData[]): Promise<void> {
    // Firebase sync implementation
    const firebaseConfig = localStorage.getItem('kolshub_firebase_config');
    if (!firebaseConfig) return;

    // Use Firebase REST API for simplicity
    const config = JSON.parse(firebaseConfig);
    const userId = localStorage.getItem('kolshub_user_id') || this.deviceId;

    try {
      await fetch(
        `${config.databaseURL}/users/${userId}/sync.json`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deviceId: this.deviceId,
            timestamp: Date.now(),
            data,
          }),
        }
      );
    } catch (error) {
      console.error('Firebase sync failed:', error);
      throw error;
    }
  }

  private async fetchFromFirebase(): Promise<SyncableData[]> {
    const firebaseConfig = localStorage.getItem('kolshub_firebase_config');
    if (!firebaseConfig) return [];

    const config = JSON.parse(firebaseConfig);
    const userId = localStorage.getItem('kolshub_user_id') || this.deviceId;

    try {
      const response = await fetch(
        `${config.databaseURL}/users/${userId}/sync.json`
      );

      const content = await response.json();
      return content?.data || [];
    } catch (error) {
      console.error('Firebase fetch failed:', error);
      return [];
    }
  }

  // ==================== CONFLICT RESOLUTION ====================
  private async mergeData(cloudData: SyncableData): Promise<void> {
    if (!this.db) return;

    const localData = await this.db.get('syncData', cloudData.id);

    if (!localData) {
      // No local data, accept cloud
      await this.db.put('syncData', cloudData);
      return;
    }

    // Check for conflicts
    if (localData.checksum !== cloudData.checksum) {
      if (this.config.conflictResolution === 'latest') {
        // Use whichever is newer
        if (cloudData.timestamp > localData.timestamp) {
          await this.db.put('syncData', cloudData);
        }
      } else if (this.config.conflictResolution === 'merge') {
        // Attempt to merge objects
        const merged = this.deepMerge(localData.data, cloudData.data);
        await this.db.put('syncData', {
          ...cloudData,
          data: merged,
          timestamp: Date.now(),
          deviceId: this.deviceId,
          version: Math.max(localData.version, cloudData.version) + 1,
          checksum: this.calculateChecksum(merged),
        });
      } else {
        // Manual resolution needed
        await this.logSyncAction('sync', cloudData.id, cloudData.category);
        this.emit('conflict', { local: localData, cloud: cloudData });
      }
    }
  }

  private deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || typeof source !== 'object') {
      return source;
    }

    const result = { ...target };
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null) {
          result[key] = this.deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    return result;
  }

  private async markAsSynced(ids: number[]): Promise<void> {
    if (!this.db) return;

    for (const id of ids) {
      const entry = await this.db.get('syncLog', id);
      if (entry) {
        entry.status = 'synced';
        await this.db.put('syncLog', entry);
      }
    }
  }

  // ==================== AUTO SYNC ====================
  private startAutoSync(): void {
    if (!this.config.autoSync) return;

    const interval = this.config.syncInterval * 60 * 1000;
    this.syncInterval = setInterval(() => {
      if (this.isOnline) {
        this.syncToCloud();
        this.pullFromCloud();
      }
    }, interval);
  }

  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // ==================== CONFIG ====================
  private loadConfig(): SyncConfig {
    const saved = localStorage.getItem('kolshub_sync_config');
    if (saved) {
      return JSON.parse(saved);
    }

    const defaultConfig: SyncConfig = {
      autoSync: true,
      syncInterval: 30, // 30 minutes
      syncOnWifi: true,
      syncCategories: ['health', 'medications', 'contacts', 'calendar', 'settings'],
      cloudProvider: 'google',
      conflictResolution: 'latest',
    };

    localStorage.setItem('kolshub_sync_config', JSON.stringify(defaultConfig));
    return defaultConfig;
  }

  updateConfig(updates: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...updates };
    localStorage.setItem('kolshub_sync_config', JSON.stringify(this.config));

    // Restart auto sync if interval changed
    if (updates.autoSync !== undefined || updates.syncInterval !== undefined) {
      this.stopAutoSync();
      this.startAutoSync();
    }
  }

  getConfig(): SyncConfig {
    return { ...this.config };
  }

  // ==================== STATUS ====================
  async getStatus(): Promise<SyncStatus> {
    const pending = await this.getPendingChanges();
    const devices = await this.getConnectedDevices();
    const conflicts = (await this.db?.getAll('syncLog') || [])
      .filter(e => e.status === 'conflict').length;

    return {
      lastSync: parseInt(localStorage.getItem('kolshub_last_sync') || '0'),
      pendingChanges: pending.length,
      connectedDevices: devices.length,
      syncEnabled: this.config.autoSync,
      cloudConnected: !!this.config.cloudProvider && this.isOnline,
      conflicts,
    };
  }

  // ==================== EVENTS ====================
  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('online', {});
      // Sync pending changes
      this.syncToCloud();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('offline', {});
    });
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  // ==================== EXPORT/IMPORT ====================
  async exportAllData(): Promise<string> {
    const allData = await this.getAllData('all');
    const devices = await this.getConnectedDevices();
    const config = this.getConfig();

    const exportData = {
      version: '5.0.0',
      exportDate: new Date().toISOString(),
      deviceId: this.deviceId,
      data: allData,
      devices,
      config,
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importData(jsonString: string): Promise<void> {
    try {
      const importData = JSON.parse(jsonString);

      for (const item of importData.data || []) {
        await this.db?.put('syncData', item);
      }

      if (importData.config) {
        this.updateConfig(importData.config);
      }

      this.emit('importComplete', { itemsImported: importData.data?.length || 0 });
    } catch (error) {
      console.error('Import failed:', error);
      this.emit('importError', { error });
    }
  }

  // ==================== CLEANUP ====================
  async clearAllData(): Promise<void> {
    if (!this.db) return;

    await this.db.clear('syncData');
    await this.db.clear('syncLog');

    this.emit('dataCleared', {});
  }

  async clearOldLogs(olderThanDays: number = 30): Promise<void> {
    if (!this.db) return;

    const cutoff = Date.now() - (olderThanDays * 24 * 60 * 60 * 1000);
    const all = await this.db.getAll('syncLog');

    for (const entry of all) {
      if (entry.timestamp < cutoff) {
        await this.db.delete('syncLog', entry.id);
      }
    }
  }
}

// Export singleton
export const crossDeviceSync = new CrossDeviceSyncService();
export default crossDeviceSync;
