/**
 * METRICS & MONITORING SYSTEM (Netflix Spectator-inspired)
 * Real-time metrics collection and monitoring for production systems
 */

export interface Metric {
  name: string;
  value: number;
  timestamp: number;
  tags: { [key: string]: string };
}

export interface CounterMetric extends Metric {
  type: 'counter';
}

export interface GaugeMetric extends Metric {
  type: 'gauge';
}

export interface TimerMetric extends Metric {
  type: 'timer';
  duration: number;
}

export interface DistributionMetric {
  name: string;
  count: number;
  sum: number;
  min: number;
  max: number;
  mean: number;
  p50: number;
  p95: number;
  p99: number;
  tags: { [key: string]: string };
}

export class MetricsCollector {
  private static counters: Map<string, number> = new Map();
  private static gauges: Map<string, number> = new Map();
  private static timers: Map<string, number[]> = new Map();
  private static history: Metric[] = [];
  private static maxHistorySize = 10000;

  // COUNTER: Increment-only metric
  static incrementCounter(name: string, value: number = 1, tags: { [key: string]: string } = {}): void {
    const key = this.getKey(name, tags);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);

    this.recordMetric({
      name,
      value: current + value,
      timestamp: Date.now(),
      tags,
      type: 'counter'
    } as CounterMetric);
  }

  // GAUGE: Snapshot of a value at a point in time
  static setGauge(name: string, value: number, tags: { [key: string]: string } = {}): void {
    const key = this.getKey(name, tags);
    this.gauges.set(key, value);

    this.recordMetric({
      name,
      value,
      timestamp: Date.now(),
      tags,
      type: 'gauge'
    } as GaugeMetric);
  }

  // TIMER: Track duration of operations
  static recordTimer(name: string, duration: number, tags: { [key: string]: string } = {}): void {
    const key = this.getKey(name, tags);
    const timings = this.timers.get(key) || [];
    timings.push(duration);
    this.timers.set(key, timings);

    this.recordMetric({
      name,
      value: duration,
      duration,
      timestamp: Date.now(),
      tags,
      type: 'timer'
    } as TimerMetric);
  }

  // Utility: Time a function execution
  static async timeAsync<T>(
    name: string,
    fn: () => Promise<T>,
    tags: { [key: string]: string } = {}
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.recordTimer(name, duration, tags);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordTimer(name, duration, { ...tags, error: 'true' });
      throw error;
    }
  }

  static timeSync<T>(
    name: string,
    fn: () => T,
    tags: { [key: string]: string } = {}
  ): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      this.recordTimer(name, duration, tags);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordTimer(name, duration, { ...tags, error: 'true' });
      throw error;
    }
  }

  // Get metric values
  static getCounter(name: string, tags: { [key: string]: string } = {}): number {
    const key = this.getKey(name, tags);
    return this.counters.get(key) || 0;
  }

  static getGauge(name: string, tags: { [key: string]: string } = {}): number {
    const key = this.getKey(name, tags);
    return this.gauges.get(key) || 0;
  }

  static getTimerDistribution(name: string, tags: { [key: string]: string } = {}): DistributionMetric | null {
    const key = this.getKey(name, tags);
    const timings = this.timers.get(key);
    if (!timings || timings.length === 0) return null;

    const sorted = [...timings].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      name,
      count: sorted.length,
      sum,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: sum / sorted.length,
      p50: this.percentile(sorted, 0.50),
      p95: this.percentile(sorted, 0.95),
      p99: this.percentile(sorted, 0.99),
      tags
    };
  }

  private static percentile(sorted: number[], p: number): number {
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }

  // Get all metrics
  static getAllMetrics(): {
    counters: { [key: string]: number };
    gauges: { [key: string]: number };
    timers: { [key: string]: DistributionMetric };
  } {
    const counters: { [key: string]: number } = {};
    this.counters.forEach((value, key) => {
      counters[key] = value;
    });

    const gauges: { [key: string]: number } = {};
    this.gauges.forEach((value, key) => {
      gauges[key] = value;
    });

    const timers: { [key: string]: DistributionMetric } = {};
    this.timers.forEach((_, key) => {
      const [name, tagsStr] = key.split('|');
      const tags = tagsStr ? JSON.parse(tagsStr) : {};
      const dist = this.getTimerDistribution(name, tags);
      if (dist) {
        timers[key] = dist;
      }
    });

    return { counters, gauges, timers };
  }

  // Get metric history
  static getHistory(limit?: number): Metric[] {
    return limit ? this.history.slice(-limit) : [...this.history];
  }

  static getHistoryForMetric(name: string, limit?: number): Metric[] {
    const filtered = this.history.filter(m => m.name === name);
    return limit ? filtered.slice(-limit) : filtered;
  }

  // Clear metrics
  static reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.timers.clear();
    this.history = [];
  }

  static resetMetric(name: string, tags: { [key: string]: string } = {}): void {
    const key = this.getKey(name, tags);
    this.counters.delete(key);
    this.gauges.delete(key);
    this.timers.delete(key);
  }

  // Helper methods
  private static getKey(name: string, tags: { [key: string]: string }): string {
    const tagStr = Object.keys(tags).length > 0 ? JSON.stringify(tags) : '';
    return tagStr ? `${name}|${tagStr}` : name;
  }

  private static recordMetric(metric: Metric): void {
    this.history.push(metric);

    // Trim history if too large
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
  }

  // System metrics
  static recordEarnings(amount: number, source: string): void {
    this.incrementCounter('earnings.total', amount, { source });
    this.setGauge('earnings.latest', amount, { source });

    // Auto-sync to New Relic if available
    this.syncToNewRelic('earnings', amount, source);
  }

  static recordContentGenerated(count: number, type: string): void {
    this.incrementCounter('content.generated', count, { type });

    // Auto-sync to New Relic if available
    this.syncToNewRelic('content', count, type);
  }

  static recordAPICall(service: string, success: boolean, duration: number): void {
    this.incrementCounter('api.calls', 1, { service, success: success.toString() });
    this.recordTimer('api.duration', duration, { service });

    // Auto-sync to New Relic if available
    this.syncToNewRelic('api', duration, service, success);
  }

  static recordError(service: string, errorType: string): void {
    this.incrementCounter('errors', 1, { service, errorType });

    // Auto-sync to New Relic if available
    this.syncToNewRelic('error', 1, service, errorType);
  }

  // Helper to sync to New Relic
  private static async syncToNewRelic(type: string, value: number, ...args: any[]): Promise<void> {
    try {
      // Dynamic import to avoid circular dependency
      const { newRelicIntegration } = await import('../services/newrelic-integration');

      if (!newRelicIntegration.isReady()) return;

      switch (type) {
        case 'earnings':
          await newRelicIntegration.trackEarnings(value, args[0]);
          break;
        case 'content':
          await newRelicIntegration.trackContentGeneration(value, args[0]);
          break;
        case 'api':
          await newRelicIntegration.trackAPICall(args[0], value, args[1]);
          break;
        case 'error':
          await newRelicIntegration.trackCustomEvent('Error', {
            service: args[0],
            errorType: args[1]
          });
          break;
      }
    } catch (error) {
      // Silent fail if New Relic not available
      console.debug('New Relic sync skipped:', error);
    }
  }
}

// Real-time monitoring dashboard data
export class MonitoringDashboard {
  static getSystemHealth(): {
    uptime: number;
    totalEarnings: number;
    contentGenerated: number;
    apiSuccessRate: number;
    errorRate: number;
    averageAPILatency: number;
  } {
    const metrics = MetricsCollector.getAllMetrics();

    // Calculate earnings
    let totalEarnings = 0;
    Object.entries(metrics.counters).forEach(([key, value]) => {
      if (key.startsWith('earnings.total')) {
        totalEarnings += value;
      }
    });

    // Calculate content generated
    let contentGenerated = 0;
    Object.entries(metrics.counters).forEach(([key, value]) => {
      if (key.startsWith('content.generated')) {
        contentGenerated += value;
      }
    });

    // Calculate API success rate
    let apiCalls = 0;
    let apiSuccess = 0;
    Object.entries(metrics.counters).forEach(([key, value]) => {
      if (key.includes('api.calls')) {
        apiCalls += value;
        if (key.includes('"success":"true"')) {
          apiSuccess += value;
        }
      }
    });
    const apiSuccessRate = apiCalls > 0 ? (apiSuccess / apiCalls) * 100 : 100;

    // Calculate error rate
    let errors = 0;
    Object.entries(metrics.counters).forEach(([key, value]) => {
      if (key.startsWith('errors')) {
        errors += value;
      }
    });
    const errorRate = apiCalls > 0 ? (errors / apiCalls) * 100 : 0;

    // Calculate average API latency
    let totalLatency = 0;
    let latencyCount = 0;
    Object.values(metrics.timers).forEach(dist => {
      if (dist.name === 'api.duration') {
        totalLatency += dist.mean * dist.count;
        latencyCount += dist.count;
      }
    });
    const averageAPILatency = latencyCount > 0 ? totalLatency / latencyCount : 0;

    return {
      uptime: Date.now(),
      totalEarnings,
      contentGenerated,
      apiSuccessRate,
      errorRate,
      averageAPILatency
    };
  }
}
