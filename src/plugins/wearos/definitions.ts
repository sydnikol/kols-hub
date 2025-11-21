/**
 * Wear OS Plugin for Google Pixel Watch 2
 * Syncs health data, notifications, and provides quick actions
 */

export interface WearOSPlugin {
  /**
   * Check if a Wear OS device is connected
   */
  isConnected(): Promise<{ connected: boolean; deviceName?: string }>;

  /**
   * Get current heart rate from watch
   */
  getHeartRate(): Promise<{ heartRate: number; timestamp: number }>;

  /**
   * Get step count for today
   */
  getStepCount(): Promise<{ steps: number; timestamp: number }>;

  /**
   * Get current activity type (walking, running, etc.)
   */
  getCurrentActivity(): Promise<{ activity: string; confidence: number }>;

  /**
   * Send notification to watch
   */
  sendNotification(options: {
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high';
  }): Promise<{ success: boolean }>;

  /**
   * Start health data sync
   */
  startHealthSync(): Promise<{ success: boolean }>;

  /**
   * Stop health data sync
   */
  stopHealthSync(): Promise<{ success: boolean }>;

  /**
   * Get battery level of watch
   */
  getBatteryLevel(): Promise<{ level: number; isCharging: boolean }>;

  /**
   * Listen for health data updates
   */
  addListener(
    eventName: 'healthData',
    listenerFunc: (data: HealthData) => void
  ): Promise<void>;

  /**
   * Listen for watch connection status changes
   */
  addListener(
    eventName: 'connectionStatus',
    listenerFunc: (data: { connected: boolean; deviceName?: string }) => void
  ): Promise<void>;

  /**
   * Remove all listeners
   */
  removeAllListeners(): Promise<void>;
}

export interface HealthData {
  heartRate?: number;
  steps?: number;
  calories?: number;
  distance?: number;
  timestamp: number;
}
