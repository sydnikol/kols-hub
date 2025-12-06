/**
 * CIRCUIT BREAKER PATTERN (Netflix Hystrix-inspired)
 * Prevents cascading failures in distributed systems
 * Automatically handles failures and enables graceful degradation
 */

export enum CircuitState {
  CLOSED = 'CLOSED',   // Normal operation
  OPEN = 'OPEN',       // Failure threshold reached, rejecting calls
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

export interface CircuitBreakerConfig {
  failureThreshold: number;      // Number of failures before opening circuit
  successThreshold: number;      // Number of successes to close circuit
  timeout: number;               // Timeout in milliseconds
  resetTimeout: number;          // Time before attempting to close circuit
  monitoringPeriod: number;      // Time window for tracking failures
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
  lastFailureTime?: number;
  lastSuccessTime?: number;
  totalCalls: number;
  totalFailures: number;
  totalSuccesses: number;
  totalTimeouts: number;
  totalRejected: number;
}

export class CircuitBreaker {
  private config: CircuitBreakerConfig;
  private state: CircuitState = CircuitState.CLOSED;
  private stats: CircuitBreakerStats;
  private failureTimestamps: number[] = [];
  private resetTimer?: NodeJS.Timeout;

  constructor(
    private name: string,
    config?: Partial<CircuitBreakerConfig>
  ) {
    this.config = {
      failureThreshold: config?.failureThreshold || 5,
      successThreshold: config?.successThreshold || 2,
      timeout: config?.timeout || 10000,
      resetTimeout: config?.resetTimeout || 60000,
      monitoringPeriod: config?.monitoringPeriod || 60000
    };

    this.stats = {
      state: CircuitState.CLOSED,
      failures: 0,
      successes: 0,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      totalCalls: 0,
      totalFailures: 0,
      totalSuccesses: 0,
      totalTimeouts: 0,
      totalRejected: 0
    };
  }

  async execute<T>(operation: () => Promise<T>, fallback?: () => Promise<T>): Promise<T> {
    this.stats.totalCalls++;

    // If circuit is OPEN, reject immediately
    if (this.state === CircuitState.OPEN) {
      this.stats.totalRejected++;
      if (fallback) {
        return fallback();
      }
      throw new Error(`Circuit breaker [${this.name}] is OPEN - service unavailable`);
    }

    try {
      // Execute with timeout
      const result = await this.executeWithTimeout(operation);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();

      // Use fallback if available
      if (fallback) {
        try {
          return await fallback();
        } catch (fallbackError) {
          throw error; // Throw original error if fallback fails
        }
      }

      throw error;
    }
  }

  private async executeWithTimeout<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.stats.totalTimeouts++;
        reject(new Error(`Operation timed out after ${this.config.timeout}ms`));
      }, this.config.timeout);

      operation()
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  private onSuccess(): void {
    this.stats.successes++;
    this.stats.totalSuccesses++;
    this.stats.consecutiveSuccesses++;
    this.stats.consecutiveFailures = 0;
    this.stats.lastSuccessTime = Date.now();

    // If in HALF_OPEN and success threshold reached, close circuit
    if (this.state === CircuitState.HALF_OPEN &&
        this.stats.consecutiveSuccesses >= this.config.successThreshold) {
      this.closeCircuit();
    }
  }

  private onFailure(): void {
    const now = Date.now();
    this.stats.failures++;
    this.stats.totalFailures++;
    this.stats.consecutiveFailures++;
    this.stats.consecutiveSuccesses = 0;
    this.stats.lastFailureTime = now;

    // Track failure timestamps
    this.failureTimestamps.push(now);
    this.cleanOldFailures();

    // Check if failure threshold reached
    if (this.failureTimestamps.length >= this.config.failureThreshold) {
      this.openCircuit();
    }
  }

  private cleanOldFailures(): void {
    const cutoff = Date.now() - this.config.monitoringPeriod;
    this.failureTimestamps = this.failureTimestamps.filter(ts => ts > cutoff);
  }

  private openCircuit(): void {
    if (this.state === CircuitState.OPEN) return;

    console.warn(`Circuit breaker [${this.name}] OPENED after ${this.stats.consecutiveFailures} failures`);
    this.state = CircuitState.OPEN;
    this.stats.state = CircuitState.OPEN;

    // Schedule transition to HALF_OPEN
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }

    this.resetTimer = setTimeout(() => {
      this.halfOpenCircuit();
    }, this.config.resetTimeout);
  }

  private halfOpenCircuit(): void {
    console.log(`Circuit breaker [${this.name}] entering HALF_OPEN state - testing service`);
    this.state = CircuitState.HALF_OPEN;
    this.stats.state = CircuitState.HALF_OPEN;
    this.stats.consecutiveSuccesses = 0;
    this.stats.consecutiveFailures = 0;
  }

  private closeCircuit(): void {
    console.log(`Circuit breaker [${this.name}] CLOSED - service recovered`);
    this.state = CircuitState.CLOSED;
    this.stats.state = CircuitState.CLOSED;
    this.failureTimestamps = [];
    this.stats.consecutiveFailures = 0;
    this.stats.failures = 0;
  }

  getStats(): CircuitBreakerStats {
    return { ...this.stats };
  }

  getState(): CircuitState {
    return this.state;
  }

  forceOpen(): void {
    this.openCircuit();
  }

  forceClose(): void {
    this.closeCircuit();
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.stats = {
      state: CircuitState.CLOSED,
      failures: 0,
      successes: 0,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      totalCalls: 0,
      totalFailures: 0,
      totalSuccesses: 0,
      totalTimeouts: 0,
      totalRejected: 0
    };
    this.failureTimestamps = [];
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
  }
}

// Global circuit breaker registry
export class CircuitBreakerRegistry {
  private static breakers: Map<string, CircuitBreaker> = new Map();

  static get(name: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(name, config));
    }
    return this.breakers.get(name)!;
  }

  static getAll(): Map<string, CircuitBreaker> {
    return this.breakers;
  }

  static getAllStats(): { [key: string]: CircuitBreakerStats } {
    const stats: { [key: string]: CircuitBreakerStats } = {};
    this.breakers.forEach((breaker, name) => {
      stats[name] = breaker.getStats();
    });
    return stats;
  }

  static reset(name?: string): void {
    if (name) {
      this.breakers.get(name)?.reset();
    } else {
      this.breakers.forEach(breaker => breaker.reset());
    }
  }
}
