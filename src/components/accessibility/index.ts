// Accessibility Provider (Main Context System)
export {
  AccessibilityProvider,
  useAccessibility,
} from './AccessibilityProvider';
export type {
  AccessibilitySettings,
  FontSize,
} from './AccessibilityProvider';
export { default } from './AccessibilityProvider';

// Accessibility Panel (Settings UI from AccessibilityPanel.tsx)
export {
  AccessibilityPanel,
  AccessibilityProvider as LegacyAccessibilityProvider,
  useAccessibility as useLegacyAccessibility,
} from './AccessibilityPanel';
export type { AccessibilitySettings as LegacyAccessibilitySettings } from './AccessibilityPanel';

// Accessibility Toolkit
export { AccessibilityToolkit } from './AccessibilityToolkit';

// Accessibility Engine (Enhanced with System Degradation Modes)
export {
  AccessibilityEngineProvider,
  AccessibilityEnginePanel,
  useAccessibilityEngine,
  DEGRADATION_MODES,
  FONT_SIZE_VALUES,
  LINE_SPACING_VALUES,
  DEFAULT_ACCESSIBILITY_ENGINE_SETTINGS,
} from './AccessibilityEngine';
export type {
  AccessibilityEngineSettings,
  AccessibilityEngineContextType,
  DegradationMode,
  DegradationModeConfig,
  SensorySettings,
  FontSizeLevel,
  LineSpacingLevel,
} from './AccessibilityEngine';
