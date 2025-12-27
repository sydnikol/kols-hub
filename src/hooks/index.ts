/**
 * Hooks Index
 * Central export point for all React hooks
 */

// Performance Hooks
export {
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
} from './usePerformance';
export type { UseInViewOptions } from './usePerformance';

// Theme Hooks
export {
  useTheme,
  useThemeGenerator,
  useContextualTheme,
  useAutoTheme,
  useThemeLibrary,
  useAccessibleTheme,
  usePainAdaptiveTheme,
  useMoodTheme,
  useCircadianTheme,
} from './useTheme';

// Mobile Detection Hook
export { useIsMobile } from './useIsMobile';

// AI Manager Hook
export { useAIManager } from './useAIManager';

// Ancestry Data Hook
export { useAncestryData } from './useAncestryData';

// Weather and Time Hooks
export {
  useWeatherTime,
  useTimeStyles,
  useWeatherEffects,
  useSeasonalStyles,
} from './useWeatherTime';
