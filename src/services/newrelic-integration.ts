/**
 * NEW RELIC INTEGRATION
 * Enterprise observability and monitoring platform
 *
 * Features:
 * - Application performance monitoring (APM)
 * - Infrastructure monitoring
 * - Browser monitoring
 * - Custom events and metrics
 * - Alerts and notifications
 */

import { MetricsCollector } from '../core/MetricsCollector';
import { CircuitBreakerRegistry } from '../core/CircuitBreaker';

export interface NewRelicConfig {
  accountId: string;
  apiKey: string;
  region?: 'US' | 'EU';
  appName?: string;
}

export interface NewRelicEvent {
  eventType: string;
  timestamp: number;
  attributes: { [key: string]: any };
}

export interface NewRelicMetric {
  name: string;
  type: 'count' | 'gauge' | 'summary';
  value: number;
  timestamp: number;
  attributes?: { [key: string]: any };
}

class NewRelicIntegration {
  private config: NewRelicConfig | null = null;
  private apiEndpoint = 'https://insights-collector.newrelic.com/v1/accounts';
  private metricsEndpoint = 'https://metric-api.newrelic.com/metric/v1';
  private isInitialized = false;

  /**
   * Initialize New Relic integration
   */
  initialize(config: NewRelicConfig): void {
    this.config = config;
    this.isInitialized = true;

    // Save to localStorage
    localStorage.setItem('newrelic_account_id', config.accountId);
    localStorage.setItem('newrelic_api_key', config.apiKey);
    localStorage.setItem('newrelic_app_name', config.appName || 'Unified Mega App');

    console.log('✅ New Relic integration initialized');
    console.log(`📊 Account ID: ${config.accountId}`);
    console.log(`📍 Region: ${config.region || 'US'}`);

    // Start auto-sync
    this.startAutoSync();
  }

  /**
   * Load configuration from localStorage
   */
  loadFromStorage(): void {
    const accountId = localStorage.getItem('newrelic_account_id');
    const apiKey = localStorage.getItem('newrelic_api_key');
    const appName = localStorage.getItem('newrelic_app_name');

    if (accountId && apiKey) {
      this.config = {
        accountId,
        apiKey,
        appName: appName || 'Unified Mega App'
      };
      this.isInitialized = true;
      console.log('✅ New Relic config loaded from storage');
    }
  }

  /**
   * Send custom event to New Relic
   */
  async sendEvent(event: NewRelicEvent): Promise<boolean> {
    if (!this.isInitialized || !this.config) {
      console.warn('New Relic not initialized');
      return false;
    }

    const breaker = CircuitBreakerRegistry.get('newrelic-events');

    try {
      await breaker.execute(async () => {
        const url = `${this.apiEndpoint}/${this.config!.accountId}/events`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Insert-Key': this.config!.apiKey
          },
          body: JSON.stringify(event)
        });

        if (!response.ok) {
          throw new Error(`New Relic event failed: ${response.status}`);
        }

        MetricsCollector.incrementCounter('newrelic.events.sent', 1);
        return true;
      });

      return true;
    } catch (error) {
      MetricsCollector.recordError('newrelic', 'event_send_failed');
      console.error('Failed to send New Relic event:', error);
      return false;
    }
  }

  /**
   * Send custom metric to New Relic
   */
  async sendMetric(metric: NewRelicMetric): Promise<boolean> {
    if (!this.isInitialized || !this.config) {
      console.warn('New Relic not initialized');
      return false;
    }

    const breaker = CircuitBreakerRegistry.get('newrelic-metrics');

    try {
      await breaker.execute(async () => {
        const payload = {
          metrics: [{
            name: metric.name,
            type: metric.type,
            value: metric.value,
            timestamp: metric.timestamp,
            attributes: metric.attributes || {}
          }]
        };

        const response = await fetch(this.metricsEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': this.config!.apiKey
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`New Relic metric failed: ${response.status}`);
        }

        MetricsCollector.incrementCounter('newrelic.metrics.sent', 1);
        return true;
      });

      return true;
    } catch (error) {
      MetricsCollector.recordError('newrelic', 'metric_send_failed');
      console.error('Failed to send New Relic metric:', error);
      return false;
    }
  }

  /**
   * Track page view
   */
  async trackPageView(pageName: string, attributes?: { [key: string]: any }): Promise<void> {
    await this.sendEvent({
      eventType: 'PageView',
      timestamp: Date.now(),
      attributes: {
        pageName,
        appName: this.config?.appName || 'Unified Mega App',
        ...attributes
      }
    });
  }

  /**
   * Track custom event
   */
  async trackCustomEvent(name: string, attributes?: { [key: string]: any }): Promise<void> {
    await this.sendEvent({
      eventType: name,
      timestamp: Date.now(),
      attributes: {
        appName: this.config?.appName || 'Unified Mega App',
        ...attributes
      }
    });
  }

  /**
   * Track earnings
   */
  async trackEarnings(amount: number, source: string): Promise<void> {
    await this.sendEvent({
      eventType: 'Earning',
      timestamp: Date.now(),
      attributes: {
        amount,
        source,
        appName: this.config?.appName || 'Unified Mega App'
      }
    });

    await this.sendMetric({
      name: 'earnings.total',
      type: 'count',
      value: amount,
      timestamp: Date.now(),
      attributes: { source }
    });
  }

  /**
   * Track content generation
   */
  async trackContentGeneration(count: number, type: string): Promise<void> {
    await this.sendEvent({
      eventType: 'ContentGenerated',
      timestamp: Date.now(),
      attributes: {
        count,
        type,
        appName: this.config?.appName || 'Unified Mega App'
      }
    });

    await this.sendMetric({
      name: 'content.generated',
      type: 'count',
      value: count,
      timestamp: Date.now(),
      attributes: { type }
    });
  }

  /**
   * Track API call
   */
  async trackAPICall(service: string, duration: number, success: boolean): Promise<void> {
    await this.sendEvent({
      eventType: 'APICall',
      timestamp: Date.now(),
      attributes: {
        service,
        duration,
        success,
        appName: this.config?.appName || 'Unified Mega App'
      }
    });

    await this.sendMetric({
      name: 'api.duration',
      type: 'summary',
      value: duration,
      timestamp: Date.now(),
      attributes: { service, success: success.toString() }
    });
  }

  /**
   * Track error
   */
  async trackError(error: Error, context?: { [key: string]: any }): Promise<void> {
    await this.sendEvent({
      eventType: 'Error',
      timestamp: Date.now(),
      attributes: {
        errorMessage: error.message,
        errorStack: error.stack || '',
        appName: this.config?.appName || 'Unified Mega App',
        ...context
      }
    });
  }

  /**
   * Sync local metrics to New Relic
   */
  async syncMetrics(): Promise<void> {
    if (!this.isInitialized) return;

    const allMetrics = MetricsCollector.getAllMetrics();

    // Sync counters
    for (const [name, value] of Object.entries(allMetrics.counters)) {
      await this.sendMetric({
        name,
        type: 'count',
        value: value as number,
        timestamp: Date.now()
      });
    }

    // Sync gauges
    for (const [name, value] of Object.entries(allMetrics.gauges)) {
      await this.sendMetric({
        name,
        type: 'gauge',
        value: value as number,
        timestamp: Date.now()
      });
    }

    console.log('✅ Metrics synced to New Relic');
  }

  /**
   * Start auto-sync (every 60 seconds)
   */
  private startAutoSync(): void {
    setInterval(() => {
      this.syncMetrics();
    }, 60000); // 60 seconds

    console.log('✅ New Relic auto-sync started (60s interval)');
  }

  /**
   * Check if initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.config !== null;
  }

  /**
   * Get configuration
   */
  getConfig(): NewRelicConfig | null {
    return this.config;
  }

  /**
   * Get New Relic dashboard URL
   */
  getDashboardUrl(): string {
    if (!this.config) return '';
    return `https://one.newrelic.com/launcher/nr1-core.home?pane=eyJuZXJkbGV0SWQiOiJucjEtY29yZS5ob21lLXNjcmVlbiJ9&account=${this.config.accountId}`;
  }
}

export const newRelicIntegration = new NewRelicIntegration();

// Auto-load from storage on import
newRelicIntegration.loadFromStorage();

// React Hook
export function useNewRelic() {
  const [isReady, setIsReady] = React.useState(newRelicIntegration.isReady());
  const [config, setConfig] = React.useState(newRelicIntegration.getConfig());

  React.useEffect(() => {
    setIsReady(newRelicIntegration.isReady());
    setConfig(newRelicIntegration.getConfig());
  }, []);

  const initialize = (cfg: NewRelicConfig) => {
    newRelicIntegration.initialize(cfg);
    setIsReady(true);
    setConfig(cfg);
  };

  return {
    isReady,
    config,
    initialize,
    trackPageView: newRelicIntegration.trackPageView.bind(newRelicIntegration),
    trackCustomEvent: newRelicIntegration.trackCustomEvent.bind(newRelicIntegration),
    trackEarnings: newRelicIntegration.trackEarnings.bind(newRelicIntegration),
    trackContentGeneration: newRelicIntegration.trackContentGeneration.bind(newRelicIntegration),
    trackAPICall: newRelicIntegration.trackAPICall.bind(newRelicIntegration),
    trackError: newRelicIntegration.trackError.bind(newRelicIntegration),
    syncMetrics: newRelicIntegration.syncMetrics.bind(newRelicIntegration),
    getDashboardUrl: newRelicIntegration.getDashboardUrl.bind(newRelicIntegration)
  };
}

import React from 'react';
