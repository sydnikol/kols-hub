import axios from 'axios';
import { WearableData } from '../types';
import { config } from '../config';

export class WearableIntegration {
  private fitbitTokens: Map<string, { accessToken: string; refreshToken: string }>;
  private appleHealthData: Map<string, any>;

  constructor() {
    this.fitbitTokens = new Map();
    this.appleHealthData = new Map();
  }

  // Fitbit Integration
  async connectFitbit(userId: string, authCode: string): Promise<void> {
    try {
      const response = await axios.post(
        'https://api.fitbit.com/oauth2/token',
        new URLSearchParams({
          client_id: config.wearables.fitbit.clientId,
          client_secret: config.wearables.fitbit.clientSecret,
          code: authCode,
          grant_type: 'authorization_code',
        }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      this.fitbitTokens.set(userId, {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      });
    } catch (error) {
      console.error('Error connecting Fitbit:', error);
      throw new Error('Failed to connect Fitbit account');
    }
  }

  async getFitbitData(userId: string, dataType: string, date?: string): Promise<WearableData[]> {
    const tokens = this.fitbitTokens.get(userId);
    if (!tokens) {
      throw new Error('Fitbit not connected for this user');
    }

    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const endpoint = this.getFitbitEndpoint(dataType, targetDate);

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });

      return this.parseFitbitData(userId, dataType, response.data);
    } catch (error) {
      console.error('Error fetching Fitbit data:', error);
      throw new Error('Failed to fetch Fitbit data');
    }
  }

  private getFitbitEndpoint(dataType: string, date: string): string {
    const baseUrl = 'https://api.fitbit.com/1/user/-';
    switch (dataType) {
      case 'heart-rate':
        return `${baseUrl}/activities/heart/date/${date}/1d.json`;
      case 'steps':
        return `${baseUrl}/activities/steps/date/${date}/1d.json`;
      case 'sleep':
        return `${baseUrl}/sleep/date/${date}.json`;
      case 'activity':
        return `${baseUrl}/activities/date/${date}.json`;
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }
  }

  private parseFitbitData(userId: string, dataType: string, data: any): WearableData[] {
    const wearableData: WearableData[] = [];
    const now = new Date();

    // Parse based on data type - simplified example
    if (dataType === 'heart-rate' && data['activities-heart']) {
      const heartData = data['activities-heart'][0];
      if (heartData?.value?.restingHeartRate) {
        wearableData.push({
          userId,
          source: 'fitbit',
          type: 'heart-rate',
          value: heartData.value.restingHeartRate,
          unit: 'bpm',
          timestamp: now,
        });
      }
    }

    return wearableData;
  }

  // Apple Watch Integration (HealthKit)
  async storeAppleHealthData(userId: string, healthData: any): Promise<void> {
    // Store Apple HealthKit data received from iOS app
    this.appleHealthData.set(userId, healthData);
  }

  async getAppleHealthData(userId: string): Promise<WearableData[]> {
    const healthData = this.appleHealthData.get(userId);
    if (!healthData) {
      return [];
    }

    // Parse Apple Health data format
    return this.parseAppleHealthData(userId, healthData);
  }

  private parseAppleHealthData(userId: string, data: any): WearableData[] {
    const wearableData: WearableData[] = [];

    if (data.heartRate) {
      wearableData.push({
        userId,
        source: 'apple-watch',
        type: 'heart-rate',
        value: data.heartRate,
        unit: 'bpm',
        timestamp: new Date(data.timestamp),
      });
    }

    if (data.steps) {
      wearableData.push({
        userId,
        source: 'apple-watch',
        type: 'steps',
        value: data.steps,
        unit: 'steps',
        timestamp: new Date(data.timestamp),
      });
    }

    return wearableData;
  }

  async disconnectDevice(userId: string, source: 'fitbit' | 'apple-watch'): Promise<void> {
    if (source === 'fitbit') {
      this.fitbitTokens.delete(userId);
    } else if (source === 'apple-watch') {
      this.appleHealthData.delete(userId);
    }
  }
}
