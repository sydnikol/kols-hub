import { WebPlugin } from '@capacitor/core';
import type { WearOSPlugin, HealthData } from './definitions';

export class WearOSWeb extends WebPlugin implements WearOSPlugin {
  async isConnected(): Promise<{ connected: boolean; deviceName?: string }> {
    console.log('WearOS plugin not available on web');
    return { connected: false };
  }

  async getHeartRate(): Promise<{ heartRate: number; timestamp: number }> {
    throw this.unavailable('WearOS not available on web');
  }

  async getStepCount(): Promise<{ steps: number; timestamp: number }> {
    throw this.unavailable('WearOS not available on web');
  }

  async getCurrentActivity(): Promise<{ activity: string; confidence: number }> {
    throw this.unavailable('WearOS not available on web');
  }

  async sendNotification(options: {
    title: string;
    message: string;
    priority?: 'low' | 'normal' | 'high';
  }): Promise<{ success: boolean }> {
    console.log('Would send notification to watch:', options);
    return { success: false };
  }

  async startHealthSync(): Promise<{ success: boolean }> {
    console.log('Health sync not available on web');
    return { success: false };
  }

  async stopHealthSync(): Promise<{ success: boolean }> {
    return { success: true };
  }

  async getBatteryLevel(): Promise<{ level: number; isCharging: boolean }> {
    throw this.unavailable('WearOS not available on web');
  }

  async addListener(
    eventName: 'healthData' | 'connectionStatus',
    listenerFunc: (data: any) => void
  ): Promise<void> {
    console.log('Listener not available on web:', eventName);
  }

  async removeAllListeners(): Promise<void> {
    console.log('No listeners to remove on web');
  }
}
