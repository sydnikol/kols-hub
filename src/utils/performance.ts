/**
 * Performance Optimization Utilities
 * Debounce, throttle, memoization, and lazy loading helpers for the Gothic Dollhouse
 */

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

// ============================================================================
// DEBOUNCE UTILITY
// ============================================================================

/**
 * Creates a debounced version of a function that delays execution
 * until after the specified wait time has elapsed since the last call.
 *
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
      lastArgs = null;
    }, delay);
  };

  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  };

  debounced.flush = () => {
    if (timeoutId && lastArgs) {
      clearTimeout(timeoutId);
      fn(...lastArgs);
      timeoutId = null;
      lastArgs = null;
    }
  };

  return debounced;
}

// ============================================================================
// THROTTLE UTILITY
// ============================================================================

/**
 * Creates a throttled version of a function that only executes
 * at most once per specified time interval.
 *
 * @param fn - The function to throttle
 * @param delay - The minimum time between executions in milliseconds
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  let lastExecuted = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttled = (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted;

    if (timeSinceLastExecution >= delay) {
      lastExecuted = now;
      fn(...args);
    } else {
      lastArgs = args;
      if (!timeoutId) {
        timeoutId = setTimeout(() => {
          lastExecuted = Date.now();
          if (lastArgs) {
            fn(...lastArgs);
          }
          timeoutId = null;
          lastArgs = null;
        }, delay - timeSinceLastExecution);
      }
    }
  };

  throttled.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = null;
    }
  };

  return throttled;
}

// ============================================================================
// MEMOIZATION UTILITY
// ============================================================================

/**
 * Creates a memoized version of a function that caches results
 * based on the arguments provided.
 *
 * @param fn - The function to memoize
 * @param options - Optional configuration for cache size and key generation
 * @returns A memoized version of the function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    maxSize?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
  } = {}
): T & { cache: Map<string, ReturnType<T>>; clear: () => void } {
  const { maxSize = 100, keyGenerator = (...args) => JSON.stringify(args) } = options;
  const cache = new Map<string, ReturnType<T>>();

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator(...args);

    if (cache.has(key)) {
      // Move to end for LRU behavior
      const value = cache.get(key)!;
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = fn(...args);
    cache.set(key, result);

    // Evict oldest entries if cache is full
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    return result;
  }) as T & { cache: Map<string, ReturnType<T>>; clear: () => void };

  memoized.cache = cache;
  memoized.clear = () => cache.clear();

  return memoized;
}

// ============================================================================
// LAZY LOADING WRAPPER
// ============================================================================

/**
 * Creates a lazy-loaded value that is only computed when first accessed.
 *
 * @param factory - The factory function that creates the value
 * @returns An object with a `value` getter that returns the lazily-computed value
 */
export function lazy<T>(factory: () => T): { value: T } {
  let computed = false;
  let cachedValue: T;

  return {
    get value(): T {
      if (!computed) {
        cachedValue = factory();
        computed = true;
      }
      return cachedValue;
    },
  };
}

/**
 * Lazy module loader with retry logic
 *
 * @param importFn - Dynamic import function
 * @param retries - Number of retry attempts
 * @param delay - Delay between retries in milliseconds
 */
export async function lazyLoad<T>(
  importFn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await importFn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

// ============================================================================
// INTERSECTION OBSERVER UTILITIES
// ============================================================================

export interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
}

/**
 * Creates an intersection observer hook for lazy component loading
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverOptions = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    root: options.root ?? null,
    rootMargin: options.rootMargin ?? '0px',
    threshold: options.threshold ?? 0,
  });
}

// ============================================================================
// VIRTUAL LIST UTILITIES
// ============================================================================

export interface VirtualListConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  totalItems: number;
}

export interface VirtualListRange {
  startIndex: number;
  endIndex: number;
  offsetY: number;
  visibleItems: number[];
}

/**
 * Calculates the visible range for a virtual list
 *
 * @param config - Virtual list configuration
 * @param scrollTop - Current scroll position
 * @returns The range of visible items and offset
 */
export function calculateVirtualListRange(
  config: VirtualListConfig,
  scrollTop: number
): VirtualListRange {
  const { itemHeight, containerHeight, overscan = 3, totalItems } = config;

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + overscan * 2);

  const visibleItems: number[] = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push(i);
  }

  return {
    startIndex,
    endIndex,
    offsetY: startIndex * itemHeight,
    visibleItems,
  };
}

// ============================================================================
// IMAGE LAZY LOADING UTILITIES
// ============================================================================

export interface ImageLoadOptions {
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Preloads an image and returns a promise that resolves when loaded
 *
 * @param src - The image source URL
 * @returns A promise that resolves with the image element
 */
export function preloadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Creates a low-quality image placeholder (LQIP) data URL
 *
 * @param color - The placeholder background color
 * @param width - Placeholder width
 * @param height - Placeholder height
 * @returns A data URL for the placeholder
 */
export function createPlaceholder(
  color: string = 'rgba(139, 92, 246, 0.2)',
  width: number = 100,
  height: number = 100
): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `.trim();

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// ============================================================================
// REQUEST ANIMATION FRAME UTILITIES
// ============================================================================

/**
 * Schedules a callback to run on the next animation frame
 * with automatic cleanup
 */
export function requestAnimationFrameCallback(
  callback: () => void
): () => void {
  const frameId = requestAnimationFrame(callback);
  return () => cancelAnimationFrame(frameId);
}

/**
 * Creates a batched update function that collects updates
 * and applies them in a single animation frame
 */
export function createBatchedUpdater<T>(
  applyUpdates: (updates: T[]) => void
): {
  schedule: (update: T) => void;
  flush: () => void;
} {
  let pending: T[] = [];
  let scheduled = false;

  const flush = () => {
    if (pending.length > 0) {
      const updates = pending;
      pending = [];
      scheduled = false;
      applyUpdates(updates);
    }
  };

  const schedule = (update: T) => {
    pending.push(update);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  };

  return { schedule, flush };
}

// ============================================================================
// IDLE CALLBACK UTILITIES
// ============================================================================

/**
 * Schedules work to be done during browser idle time
 * Falls back to setTimeout for unsupported browsers
 */
export function scheduleIdleWork(
  callback: () => void,
  options: { timeout?: number } = {}
): () => void {
  if ('requestIdleCallback' in window) {
    const id = (window as any).requestIdleCallback(callback, options);
    return () => (window as any).cancelIdleCallback(id);
  }

  const id = setTimeout(callback, options.timeout ?? 1);
  return () => clearTimeout(id);
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

export interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateCount: number;
}

/**
 * Creates a simple performance tracker
 */
export function createPerformanceTracker(): {
  start: (label: string) => void;
  end: (label: string) => number;
  getMetrics: () => Record<string, number>;
  clear: () => void;
} {
  const metrics: Record<string, number> = {};
  const startTimes: Record<string, number> = {};

  return {
    start: (label: string) => {
      startTimes[label] = performance.now();
    },
    end: (label: string) => {
      const startTime = startTimes[label];
      if (startTime !== undefined) {
        const duration = performance.now() - startTime;
        metrics[label] = duration;
        delete startTimes[label];
        return duration;
      }
      return 0;
    },
    getMetrics: () => ({ ...metrics }),
    clear: () => {
      Object.keys(metrics).forEach((key) => delete metrics[key]);
      Object.keys(startTimes).forEach((key) => delete startTimes[key]);
    },
  };
}

// ============================================================================
// REACT HOOKS (Exported for convenience)
// ============================================================================

/**
 * React hook for debounced values
 */
export function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * React hook for intersection observer
 */
export function useIntersectionObserverUtil<T extends Element>(
  options: IntersectionObserverOptions = {}
): {
  ref: React.RefObject<T>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const ref = useRef<T>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const frozen = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || frozen.current) return;

    const observer = createIntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setIsIntersecting(entry.isIntersecting);

        if (options.freezeOnceVisible && entry.isIntersecting) {
          frozen.current = true;
          observer?.disconnect();
        }
      },
      options
    );

    if (observer) {
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [options.root, options.rootMargin, options.threshold, options.freezeOnceVisible]);

  return { ref: ref as React.RefObject<T>, isIntersecting, entry };
}

// Export all utilities
export default {
  debounce,
  throttle,
  memoize,
  lazy,
  lazyLoad,
  createIntersectionObserver,
  calculateVirtualListRange,
  preloadImage,
  createPlaceholder,
  requestAnimationFrameCallback,
  createBatchedUpdater,
  scheduleIdleWork,
  createPerformanceTracker,
  useDebounceValue,
  useIntersectionObserverUtil,
};
