/**
 * Utilities Index
 * Central export point for all utility functions
 */

// Performance Utilities
export {
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
} from './performance';
export type {
  IntersectionObserverOptions,
  VirtualListConfig,
  VirtualListRange,
  ImageLoadOptions,
  PerformanceMetrics,
} from './performance';

// Database Utilities
export { db } from './database';

// IndexedDB Utilities
export * from './indexedDB';

// Avatar Utilities
export * from './avatar-utils';

// SoundCloud Configuration
export * from './soundcloud-config';

// Medication Import Utilities
export * from './medication-import';

// App Initialization
export * from './initializeApp';
export * from './appInitializer';

// Google Drive Integration
export * from './googleDrive';

// Dev Console
export * from './devConsole';
