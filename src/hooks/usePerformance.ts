/**
 * Performance Hooks
 * React hooks for performance optimization in the Gothic Dollhouse
 */

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  RefObject,
} from 'react';
import {
  debounce,
  throttle,
  createIntersectionObserver,
  IntersectionObserverOptions,
} from '../utils/performance';

// ============================================================================
// useDebounce Hook
// ============================================================================

/**
 * Returns a debounced version of the provided value
 * The value only updates after the specified delay has passed
 * without any new updates.
 *
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
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
 * Returns a debounced callback function
 *
 * @param callback - The callback to debounce
 * @param delay - The delay in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns A debounced version of the callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
} {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedFn = useMemo(
    () =>
      debounce((...args: Parameters<T>) => {
        callbackRef.current(...args);
      }, delay),
    [delay, ...deps]
  );

  useEffect(() => {
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedFn]);

  return debouncedFn;
}

// ============================================================================
// useThrottle Hook
// ============================================================================

/**
 * Returns a throttled callback function that only executes
 * at most once per specified time interval.
 *
 * @param callback - The callback to throttle
 * @param delay - The minimum time between executions in milliseconds
 * @param deps - Dependencies array for the callback
 * @returns A throttled version of the callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): {
  (...args: Parameters<T>): void;
  cancel: () => void;
} {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledFn = useMemo(
    () =>
      throttle((...args: Parameters<T>) => {
        callbackRef.current(...args);
      }, delay),
    [delay, ...deps]
  );

  useEffect(() => {
    return () => {
      throttledFn.cancel();
    };
  }, [throttledFn]);

  return throttledFn;
}

/**
 * Returns a throttled version of a value
 * The value only updates at most once per specified time interval.
 *
 * @param value - The value to throttle
 * @param delay - The minimum time between updates in milliseconds
 * @returns The throttled value
 */
export function useThrottledValue<T>(value: T, delay: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdateRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeSinceLastUpdate >= delay) {
      lastUpdateRef.current = now;
      setThrottledValue(value);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        lastUpdateRef.current = Date.now();
        setThrottledValue(value);
      }, delay - timeSinceLastUpdate);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return throttledValue;
}

// ============================================================================
// useLazyLoad Hook
// ============================================================================

/**
 * Hook for lazy loading content when an element becomes visible
 *
 * @param ref - Reference to the element to observe
 * @param options - Intersection observer options
 * @returns Object containing loading state and intersection info
 */
export function useLazyLoad(
  ref: RefObject<Element>,
  options: IntersectionObserverOptions = {}
): {
  isVisible: boolean;
  hasLoaded: boolean;
  load: () => void;
} {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasLoaded) return;

    observerRef.current = createIntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (options.freezeOnceVisible !== false) {
            setHasLoaded(true);
            observerRef.current?.disconnect();
          }
        } else if (!options.freezeOnceVisible) {
          setIsVisible(false);
        }
      },
      {
        rootMargin: options.rootMargin ?? '100px',
        threshold: options.threshold ?? 0,
        root: options.root,
      }
    );

    if (observerRef.current) {
      observerRef.current.observe(element);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [ref, hasLoaded, options.rootMargin, options.threshold, options.root, options.freezeOnceVisible]);

  const load = useCallback(() => {
    setIsVisible(true);
    setHasLoaded(true);
    observerRef.current?.disconnect();
  }, []);

  return { isVisible, hasLoaded, load };
}

// ============================================================================
// useInView Hook
// ============================================================================

export interface UseInViewOptions extends IntersectionObserverOptions {
  triggerOnce?: boolean;
  initialInView?: boolean;
}

/**
 * Hook to detect when an element is in the viewport
 *
 * @param ref - Reference to the element to observe
 * @param options - Intersection observer options
 * @returns Object containing inView state and entry
 */
export function useInView(
  ref: RefObject<Element>,
  options: UseInViewOptions = {}
): {
  inView: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const {
    triggerOnce = false,
    initialInView = false,
    root,
    rootMargin = '0px',
    threshold = 0,
  } = options;

  const [inView, setInView] = useState(initialInView);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (triggerOnce && triggered.current) return;

    const observer = createIntersectionObserver(
      ([entry]) => {
        setEntry(entry);
        setInView(entry.isIntersecting);

        if (entry.isIntersecting && triggerOnce) {
          triggered.current = true;
          observer?.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    if (observer) {
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [ref, root, rootMargin, threshold, triggerOnce]);

  return { inView, entry };
}

/**
 * Combined hook that returns both ref and inView state
 * Useful when you don't have an existing ref
 */
export function useInViewRef<T extends Element>(
  options: UseInViewOptions = {}
): {
  ref: RefObject<T>;
  inView: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const ref = useRef<T>(null);
  const { inView, entry } = useInView(ref, options);
  return { ref, inView, entry };
}

// ============================================================================
// useIdleCallback Hook
// ============================================================================

/**
 * Hook to schedule work during browser idle time
 * Useful for non-urgent tasks that shouldn't block the main thread
 *
 * @param callback - The callback to execute during idle time
 * @param options - Options including timeout and dependencies
 */
export function useIdleCallback(
  callback: () => void,
  options: {
    timeout?: number;
    enabled?: boolean;
    deps?: React.DependencyList;
  } = {}
): void {
  const { timeout = 1000, enabled = true, deps = [] } = options;
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    let cancelFn: (() => void) | null = null;

    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(
        () => callbackRef.current(),
        { timeout }
      );
      cancelFn = () => (window as any).cancelIdleCallback(id);
    } else {
      // Fallback for browsers without requestIdleCallback
      const id = setTimeout(() => callbackRef.current(), 1);
      cancelFn = () => clearTimeout(id);
    }

    return () => {
      cancelFn?.();
    };
  }, [enabled, timeout, ...deps]);
}

/**
 * Hook that returns a function to schedule work during idle time
 */
export function useIdleQueue(): {
  schedule: (task: () => void, options?: { timeout?: number }) => void;
  clear: () => void;
} {
  const taskQueue = useRef<Array<{ task: () => void; timeout?: number }>>([]);
  const cancelFns = useRef<Array<() => void>>([]);

  const processQueue = useCallback(() => {
    const { task, timeout } = taskQueue.current.shift() || {};
    if (!task) return;

    let cancelFn: () => void;

    if ('requestIdleCallback' in window) {
      const id = (window as any).requestIdleCallback(
        () => {
          task();
          processQueue();
        },
        { timeout }
      );
      cancelFn = () => (window as any).cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => {
        task();
        processQueue();
      }, 1);
      cancelFn = () => clearTimeout(id);
    }

    cancelFns.current.push(cancelFn);
  }, []);

  const schedule = useCallback(
    (task: () => void, options?: { timeout?: number }) => {
      taskQueue.current.push({ task, timeout: options?.timeout });
      if (taskQueue.current.length === 1) {
        processQueue();
      }
    },
    [processQueue]
  );

  const clear = useCallback(() => {
    taskQueue.current = [];
    cancelFns.current.forEach((cancel) => cancel());
    cancelFns.current = [];
  }, []);

  useEffect(() => {
    return () => clear();
  }, [clear]);

  return { schedule, clear };
}

// ============================================================================
// Additional Performance Hooks
// ============================================================================

/**
 * Hook for measuring render performance
 */
export function useRenderCount(componentName?: string): number {
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    if (componentName && process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] Render count: ${renderCount.current}`);
    }
  });

  return renderCount.current;
}

/**
 * Hook for detecting when a component is slow to render
 */
export function useRenderTime(
  componentName: string,
  threshold: number = 16
): void {
  const startTime = useRef<number>(0);

  // Start timing before render
  startTime.current = performance.now();

  useEffect(() => {
    const renderTime = performance.now() - startTime.current;
    if (renderTime > threshold && process.env.NODE_ENV === 'development') {
      console.warn(
        `[${componentName}] Slow render detected: ${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
      );
    }
  });
}

/**
 * Hook for detecting component updates
 */
export function useWhyDidYouUpdate<T extends Record<string, any>>(
  componentName: string,
  props: T
): void {
  const previousProps = useRef<T>();

  useEffect(() => {
    if (previousProps.current && process.env.NODE_ENV === 'development') {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, { from: any; to: any }> = {};

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log(`[${componentName}] Changed props:`, changedProps);
      }
    }

    previousProps.current = props;
  });
}

/**
 * Hook for managing async state with loading and error tracking
 */
export function useAsyncState<T>(
  initialValue: T
): [
  T,
  (valueOrUpdater: T | ((prev: T) => T)) => void,
  { isLoading: boolean; error: Error | null }
] {
  const [state, setState] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const setAsyncState = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)) => {
      setError(null);
      if (valueOrUpdater instanceof Promise) {
        setIsLoading(true);
        (valueOrUpdater as Promise<T>)
          .then((value) => {
            setState(value);
            setIsLoading(false);
          })
          .catch((err) => {
            setError(err);
            setIsLoading(false);
          });
      } else {
        setState(valueOrUpdater as any);
      }
    },
    []
  );

  return [state, setAsyncState, { isLoading, error }];
}

// Export all hooks
export default {
  useDebounce,
  useDebouncedCallback,
  useThrottle,
  useThrottledValue,
  useLazyLoad,
  useInView,
  useInViewRef,
  useIdleCallback,
  useIdleQueue,
  useRenderCount,
  useRenderTime,
  useWhyDidYouUpdate,
  useAsyncState,
};
