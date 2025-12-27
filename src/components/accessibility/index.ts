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
