/**
 * Central Integration Manager
 *
 * Manages all platform integrations and keeps them in sync
 */

import { authService } from './auth-service';
import { bitcoinIntegration } from './bitcoin-integration';
import { creditSuissePSD2Integration } from './creditsuisse-psd2-integration';
import { personalCapitalIntegration } from './personalcapital-integration';
import { inflowIntegration } from './inflow-integration';
import { courseraIntegration } from './coursera-integration';
import { huggingfaceIntegration } from './huggingface-integration';
import { openaiCompatibleIntegration } from './openai-compatible-integration';

interface IntegrationStatus {
  name: string;
  configured: boolean;
  connected: boolean;
  lastSync?: number;
  error?: string;
}

class IntegrationManager {
  private integrations = new Map<string, any>();
  private syncIntervals = new Map<string, NodeJS.Timeout>();

  constructor() {
    // Register all integrations
    this.integrations.set('bitcoin', bitcoinIntegration);
    this.integrations.set('banking', creditSuissePSD2Integration);
    this.integrations.set('finance', personalCapitalIntegration);
    this.integrations.set('inventory', inflowIntegration);
    this.integrations.set('learning', courseraIntegration);
    this.integrations.set('ai-models', huggingfaceIntegration);
    this.integrations.set('ai-chat', openaiCompatibleIntegration);
  }

  /**
   * Initialize all integrations with user's configuration
   */
  async initializeAll(configs: Record<string, any>) {
    console.log('🚀 Initializing all integrations...');

    const results: Record<string, boolean> = {};

    for (const [name, integration] of this.integrations) {
      try {
        const config = configs[name];
        if (config && integration.initialize) {
          const success = integration.initialize(config);
          results[name] = success;
          console.log(`${success ? '✅' : '❌'} ${name}`);
        }
      } catch (error) {
        console.error(`❌ ${name} failed:`, error);
        results[name] = false;
      }
    }

    return results;
  }

  /**
   * Get status of all integrations
   */
  getStatus(): IntegrationStatus[] {
    const statuses: IntegrationStatus[] = [];

    for (const [name, integration] of this.integrations) {
      const status: IntegrationStatus = {
        name,
        configured: integration.isConfigured ? integration.isConfigured() : false,
        connected: false
      };

      // Get last sync time if available
      const statsKey = `${name}_stats`;
      const stats = localStorage.getItem(statsKey);
      if (stats) {
        try {
          const parsed = JSON.parse(stats);
          status.lastSync = parsed.lastSync ? new Date(parsed.lastSync).getTime() : undefined;
        } catch (e) {
          // Ignore
        }
      }

      statuses.push(status);
    }

    return statuses;
  }

  /**
   * Sync all integrations
   */
  async syncAll(): Promise<void> {
    console.log('🔄 Syncing all integrations...');

    const promises: Promise<any>[] = [];

    // Finance data sync
    if (personalCapitalIntegration.isConfigured()) {
      promises.push(personalCapitalIntegration.syncLearningData?.() || Promise.resolve());
    }

    // Learning data sync
    if (courseraIntegration.isConfigured()) {
      promises.push(courseraIntegration.syncLearningData?.() || Promise.resolve());
    }

    await Promise.allSettled(promises);
    console.log('✅ Sync complete');
  }

  /**
   * Enable auto-sync for all integrations
   */
  enableAutoSync(intervalMinutes: number = 30) {
    console.log(`⏰ Enabling auto-sync every ${intervalMinutes} minutes`);

    const interval = setInterval(() => {
      this.syncAll();
    }, intervalMinutes * 60 * 1000);

    this.syncIntervals.set('auto-sync', interval);
  }

  /**
   * Disable auto-sync
   */
  disableAutoSync() {
    for (const [key, interval] of this.syncIntervals) {
      clearInterval(interval);
    }
    this.syncIntervals.clear();
    console.log('⏸️  Auto-sync disabled');
  }

  /**
   * Get integration by name
   */
  get(name: string): any {
    return this.integrations.get(name);
  }

  /**
   * Get all financial data from integrated services
   */
  async getFinancialSnapshot(): Promise<{
    netWorth: number;
    cashFlow: number;
    investments: number;
    crypto: number;
    bankAccounts: any[];
  }> {
    const snapshot = {
      netWorth: 0,
      cashFlow: 0,
      investments: 0,
      crypto: 0,
      bankAccounts: []
    };

    // Get Personal Capital data
    if (personalCapitalIntegration.isConfigured()) {
      try {
        const netWorth = await personalCapitalIntegration.getNetWorth();
        if (netWorth) {
          snapshot.netWorth = netWorth.netWorth;
          snapshot.investments = netWorth.breakdown.investments;
        }
      } catch (error) {
        console.error('Error fetching Personal Capital data:', error);
      }
    }

    // Get PSD2 banking data
    if (creditSuissePSD2Integration.isConfigured()) {
      try {
        const accounts = await creditSuissePSD2Integration.getAccounts();
        if (accounts) {
          snapshot.bankAccounts = accounts.accounts;
        }
      } catch (error) {
        console.error('Error fetching banking data:', error);
      }
    }

    return snapshot;
  }

  /**
   * Get learning progress from all platforms
   */
  async getLearningSnapshot(): Promise<{
    totalCourses: number;
    completed: number;
    inProgress: number;
    certificates: number;
    hours: number;
  }> {
    const snapshot = {
      totalCourses: 0,
      completed: 0,
      inProgress: 0,
      certificates: 0,
      hours: 0
    };

    if (courseraIntegration.isConfigured()) {
      try {
        const enrollments = await courseraIntegration.getEnrollments();
        if (enrollments) {
          snapshot.totalCourses = enrollments.length;
          snapshot.completed = enrollments.filter(e => e.status === 'completed').length;
          snapshot.inProgress = enrollments.filter(e => e.status === 'active').length;
        }

        const certs = await courseraIntegration.getCertificates();
        if (certs) {
          snapshot.certificates = certs.length;
        }
      } catch (error) {
        console.error('Error fetching Coursera data:', error);
      }
    }

    return snapshot;
  }

  /**
   * Get inventory summary
   */
  async getInventorySnapshot(): Promise<{
    totalProducts: number;
    totalValue: number;
    lowStock: number;
    pendingOrders: number;
  }> {
    const snapshot = {
      totalProducts: 0,
      totalValue: 0,
      lowStock: 0,
      pendingOrders: 0
    };

    if (inflowIntegration.isConfigured()) {
      try {
        const report = await inflowIntegration.getInventoryReport();
        if (report) {
          snapshot.totalProducts = report.summary.totalProducts;
          snapshot.totalValue = report.summary.totalValue;
          snapshot.lowStock = report.summary.lowStockItems;
        }
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    }

    return snapshot;
  }

  /**
   * Connect to real health data from Google Fit
   */
  async connectGoogleFit(): Promise<boolean> {
    const user = authService.getCurrentUser();
    if (!user) {
      console.error('Not authenticated');
      return false;
    }

    console.log('Connecting to Google Fit...');

    try {
      // Fetch real health data
      const accessToken = user.accessToken;

      // Heart rate data
      const heartRateResponse = await fetch(
        'https://www.googleapis.com/fitness/v1/users/me/dataSources',
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      if (heartRateResponse.ok) {
        const data = await heartRateResponse.json();
        localStorage.setItem('google_fit_heart_rate', JSON.stringify(data));
        console.log('✅ Connected to Google Fit');
        return true;
      }
    } catch (error) {
      console.error('Error connecting to Google Fit:', error);
    }

    return false;
  }

  /**
   * Get real health data
   */
  async getRealHealthData(): Promise<any> {
    const user = authService.getCurrentUser();
    if (!user) return null;

    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      const response = await fetch(
        'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            aggregateBy: [
              {
                dataTypeName: 'com.google.heart_rate.bpm',
                dataSourceId: 'derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm'
              },
              {
                dataTypeName: 'com.google.step_count.delta',
                dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
              },
              {
                dataTypeName: 'com.google.sleep.segment'
              }
            ],
            bucketByTime: { durationMillis: 86400000 }, // 1 day
            startTimeMillis: startTime.getTime(),
            endTimeMillis: now.getTime()
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Retrieved real health data');
        return data;
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    }

    return null;
  }
}

export const integrationManager = new IntegrationManager();
