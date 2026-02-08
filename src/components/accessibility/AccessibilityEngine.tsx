/**
 * AccessibilityEngine.tsx
 * Comprehensive Accessibility Engine with System Degradation Modes
 *
 * Features:
 * - Sensory Controls (light, sound, text density)
 * - One-tap Low Capacity Mode
 * - System Degradation Modes based on spoon theory
 * - Voice-free Operation
 * - Visual Simplicity
 * - Predictable Navigation
 * - No Surprise Notifications
 * - Reduce Motion
 *
 * Based on: ACCESSIBILITY_ENGINE and SYSTEM_DEGRADATION_MODES from kol-master-feature-list.ts
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type FontSizeLevel = 'small' | 'medium' | 'large' | 'extra-large';
export type LineSpacingLevel = 'compact' | 'normal' | 'relaxed' | 'spacious';
export type DegradationMode =
  | 'full-capacity'
  | 'low-energy'
  | 'flare-day'
  | 'crisis-mode'
  | 'post-crisis-recovery';

export interface SensorySettings {
  // Light controls
  brightness: number; // 50-150
  contrast: number; // 50-150
  darkMode: boolean;

  // Sound controls
  masterVolume: number; // 0-100
  notificationSounds: boolean;

  // Text density
  fontSize: FontSizeLevel;
  lineSpacing: LineSpacingLevel;
}

export interface AccessibilityEngineSettings {
  // Sensory controls
  sensory: SensorySettings;

  // One-tap mode
  lowCapacityMode: boolean;

  // System degradation
  currentDegradationMode: DegradationMode;
  spoonCount: number; // 0-12

  // Accessibility toggles
  voiceFreeOperation: boolean;
  visualSimplicity: boolean;
  predictableNavigation: boolean;
  noSurpriseNotifications: boolean;
  reduceMotion: boolean;
}

export interface DegradationModeConfig {
  name: string;
  description: string;
  spoonThreshold: string;
  features: string[];
  color: string;
  icon: string;
}

export interface AccessibilityEngineContextType {
  settings: AccessibilityEngineSettings;

  // Sensory controls
  updateSensorySetting: <K extends keyof SensorySettings>(
    key: K,
    value: SensorySettings[K]
  ) => void;

  // One-tap mode
  toggleLowCapacityMode: () => void;

  // System degradation
  setSpoonCount: (count: number) => void;
  setDegradationMode: (mode: DegradationMode) => void;
  getCurrentModeConfig: () => DegradationModeConfig;

  // Individual toggles
  toggleSetting: (key: keyof Omit<AccessibilityEngineSettings, 'sensory' | 'spoonCount' | 'currentDegradationMode'>) => void;

  // Reset
  resetToDefaults: () => void;

  // Helpers
  isFeatureAvailable: (featureName: string) => boolean;
  getAvailableFeatures: () => string[];
}

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = 'kols-hub-accessibility-engine';

export const DEGRADATION_MODES: Record<DegradationMode, DegradationModeConfig> = {
  'full-capacity': {
    name: 'Full Capacity',
    description: 'All features available',
    spoonThreshold: '8+',
    features: [
      'All navigation options',
      'Full media access',
      'Social features',
      'Creative tools',
      'Health tracking',
      'Notifications enabled',
      'All integrations'
    ],
    color: '#10b981',
    icon: 'battery-full'
  },
  'low-energy': {
    name: 'Low Energy',
    description: 'Simplified interface, essential features only',
    spoonThreshold: '4-7',
    features: [
      'Essential navigation only',
      'Core health tracking',
      'Medication reminders',
      'Simplified media',
      'Reduced notifications',
      'Quick access shortcuts'
    ],
    color: '#f59e0b',
    icon: 'battery-medium'
  },
  'flare-day': {
    name: 'Flare Day',
    description: 'Minimal interface, rest-focused',
    spoonThreshold: '2-3',
    features: [
      'Rest reminders',
      'Medication tracking only',
      'Emergency contacts visible',
      'Pain tracking',
      'Comfort suggestions',
      'No demands or tasks'
    ],
    color: '#f97316',
    icon: 'battery-low'
  },
  'crisis-mode': {
    name: 'Crisis Mode',
    description: 'Emergency contacts and essential info only',
    spoonThreshold: '0-1',
    features: [
      'Emergency contacts only',
      'Current medications',
      'Hospital preference',
      'Crisis protocols',
      'One-tap call support'
    ],
    color: '#ef4444',
    icon: 'alert-triangle'
  },
  'post-crisis-recovery': {
    name: 'Post-Crisis Recovery',
    description: 'Gentle reintegration, no demands',
    spoonThreshold: 'Recovering',
    features: [
      'Gentle check-ins',
      'Self-care suggestions',
      'Gradual feature unlock',
      'No productivity pressure',
      'Celebration of small wins',
      'Support access maintained'
    ],
    color: '#8b5cf6',
    icon: 'sunrise'
  }
};

const FONT_SIZE_VALUES: Record<FontSizeLevel, string> = {
  'small': '14px',
  'medium': '16px',
  'large': '20px',
  'extra-large': '24px'
};

const LINE_SPACING_VALUES: Record<LineSpacingLevel, string> = {
  'compact': '1.3',
  'normal': '1.5',
  'relaxed': '1.8',
  'spacious': '2.2'
};

const defaultSensorySettings: SensorySettings = {
  brightness: 100,
  contrast: 100,
  darkMode: true,
  masterVolume: 70,
  notificationSounds: true,
  fontSize: 'medium',
  lineSpacing: 'normal'
};

const defaultSettings: AccessibilityEngineSettings = {
  sensory: defaultSensorySettings,
  lowCapacityMode: false,
  currentDegradationMode: 'full-capacity',
  spoonCount: 12,
  voiceFreeOperation: false,
  visualSimplicity: false,
  predictableNavigation: true,
  noSurpriseNotifications: false,
  reduceMotion: false
};

// ============================================================================
// Context
// ============================================================================

const AccessibilityEngineContext = createContext<AccessibilityEngineContextType | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

export const useAccessibilityEngine = (): AccessibilityEngineContextType => {
  const context = useContext(AccessibilityEngineContext);
  if (!context) {
    throw new Error('useAccessibilityEngine must be used within an AccessibilityEngineProvider');
  }
  return context;
};

// ============================================================================
// Helper: Determine degradation mode from spoon count
// ============================================================================

const getDegradationModeFromSpoons = (spoons: number): DegradationMode => {
  if (spoons >= 8) return 'full-capacity';
  if (spoons >= 4) return 'low-energy';
  if (spoons >= 2) return 'flare-day';
  return 'crisis-mode';
};

// ============================================================================
// Provider Component
// ============================================================================

interface AccessibilityEngineProviderProps {
  children: ReactNode;
}

export const AccessibilityEngineProvider: React.FC<AccessibilityEngineProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilityEngineSettings>(() => {
    // Check system preferences
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...defaultSettings,
            ...parsed,
            sensory: {
              ...defaultSensorySettings,
              ...parsed.sensory,
              darkMode: parsed.sensory?.darkMode ?? prefersDark
            },
            reduceMotion: parsed.reduceMotion ?? prefersReducedMotion
          };
        } catch {
          // Invalid JSON, use defaults
        }
      }
    }

    return {
      ...defaultSettings,
      sensory: {
        ...defaultSensorySettings,
        darkMode: prefersDark
      },
      reduceMotion: prefersReducedMotion
    };
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const { sensory } = settings;

    // Brightness and contrast
    root.style.setProperty('--a11y-brightness', `${sensory.brightness}%`);
    root.style.setProperty('--a11y-contrast', `${sensory.contrast}%`);

    // Font settings
    root.style.setProperty('--a11y-font-size', FONT_SIZE_VALUES[sensory.fontSize]);
    root.style.setProperty('--a11y-line-height', LINE_SPACING_VALUES[sensory.lineSpacing]);

    // Apply body classes
    document.body.classList.toggle('dark-mode', sensory.darkMode);
    document.body.classList.toggle('low-capacity-mode', settings.lowCapacityMode);
    document.body.classList.toggle('visual-simplicity', settings.visualSimplicity);
    document.body.classList.toggle('reduced-motion', settings.reduceMotion);
    document.body.classList.toggle('voice-free', settings.voiceFreeOperation);
    document.body.classList.toggle('predictable-nav', settings.predictableNavigation);
    document.body.classList.toggle('no-surprise-notifications', settings.noSurpriseNotifications);

    // Set degradation mode as data attribute
    document.body.setAttribute('data-degradation-mode', settings.currentDegradationMode);
    document.body.setAttribute('data-spoon-count', String(settings.spoonCount));
  }, [settings]);

  // Listen for system preference changes
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({
        ...prev,
        reduceMotion: e.matches
      }));
    };

    const handleDarkChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({
        ...prev,
        sensory: {
          ...prev.sensory,
          darkMode: e.matches
        }
      }));
    };

    motionQuery.addEventListener('change', handleMotionChange);
    darkQuery.addEventListener('change', handleDarkChange);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      darkQuery.removeEventListener('change', handleDarkChange);
    };
  }, []);

  // Update sensory settings
  const updateSensorySetting = useCallback(<K extends keyof SensorySettings>(
    key: K,
    value: SensorySettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      sensory: {
        ...prev.sensory,
        [key]: value
      }
    }));
  }, []);

  // Toggle low capacity mode
  const toggleLowCapacityMode = useCallback(() => {
    setSettings(prev => {
      const newLowCapacity = !prev.lowCapacityMode;

      if (newLowCapacity) {
        // Enable low capacity mode with presets
        return {
          ...prev,
          lowCapacityMode: true,
          visualSimplicity: true,
          reduceMotion: true,
          noSurpriseNotifications: true,
          sensory: {
            ...prev.sensory,
            fontSize: 'large',
            lineSpacing: 'relaxed'
          }
        };
      } else {
        // Disable low capacity mode
        return {
          ...prev,
          lowCapacityMode: false
        };
      }
    });
  }, []);

  // Set spoon count and auto-adjust degradation mode
  const setSpoonCount = useCallback((count: number) => {
    const clampedCount = Math.max(0, Math.min(12, count));
    const newMode = getDegradationModeFromSpoons(clampedCount);

    setSettings(prev => ({
      ...prev,
      spoonCount: clampedCount,
      currentDegradationMode: newMode
    }));
  }, []);

  // Manually set degradation mode
  const setDegradationMode = useCallback((mode: DegradationMode) => {
    setSettings(prev => ({
      ...prev,
      currentDegradationMode: mode
    }));
  }, []);

  // Get current mode configuration
  const getCurrentModeConfig = useCallback((): DegradationModeConfig => {
    return DEGRADATION_MODES[settings.currentDegradationMode];
  }, [settings.currentDegradationMode]);

  // Toggle individual settings
  const toggleSetting = useCallback((
    key: keyof Omit<AccessibilityEngineSettings, 'sensory' | 'spoonCount' | 'currentDegradationMode'>
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setSettings({
      ...defaultSettings,
      sensory: {
        ...defaultSensorySettings,
        darkMode: prefersDark
      },
      reduceMotion: prefersReducedMotion
    });
  }, []);

  // Check if a feature is available in current mode
  const isFeatureAvailable = useCallback((featureName: string): boolean => {
    const currentMode = DEGRADATION_MODES[settings.currentDegradationMode];
    return currentMode.features.some(f =>
      f.toLowerCase().includes(featureName.toLowerCase())
    );
  }, [settings.currentDegradationMode]);

  // Get list of available features
  const getAvailableFeatures = useCallback((): string[] => {
    return DEGRADATION_MODES[settings.currentDegradationMode].features;
  }, [settings.currentDegradationMode]);

  const contextValue: AccessibilityEngineContextType = {
    settings,
    updateSensorySetting,
    toggleLowCapacityMode,
    setSpoonCount,
    setDegradationMode,
    getCurrentModeConfig,
    toggleSetting,
    resetToDefaults,
    isFeatureAvailable,
    getAvailableFeatures
  };

  return (
    <AccessibilityEngineContext.Provider value={contextValue}>
      {children}
      <AccessibilityEngineStyles />
    </AccessibilityEngineContext.Provider>
  );
};

// ============================================================================
// Global Styles Component
// ============================================================================

const AccessibilityEngineStyles: React.FC = () => (
  <style>{`
    /* Base CSS Variables */
    :root {
      --a11y-brightness: 100%;
      --a11y-contrast: 100%;
      --a11y-font-size: 16px;
      --a11y-line-height: 1.5;
    }

    /* Apply brightness/contrast filter */
    body {
      filter: brightness(var(--a11y-brightness)) contrast(var(--a11y-contrast));
    }

    /* Font size scaling */
    body {
      font-size: var(--a11y-font-size);
      line-height: var(--a11y-line-height);
    }

    /* Dark Mode */
    body.dark-mode {
      --bg-primary: #0a0812;
      --bg-secondary: #1a1028;
      --bg-tertiary: #2d1f42;
      --text-primary: #e0e0e0;
      --text-secondary: #a0a0a0;
      --accent-primary: #8b5cf6;
      --accent-secondary: #a78bfa;
      --accent-gold: #d4af37;
    }

    body:not(.dark-mode) {
      --bg-primary: #f8f6fc;
      --bg-secondary: #ebe6f5;
      --bg-tertiary: #ddd4eb;
      --text-primary: #1a1028;
      --text-secondary: #4a3f5c;
      --accent-primary: #7c3aed;
      --accent-secondary: #8b5cf6;
      --accent-gold: #b8860b;
    }

    /* Reduced Motion */
    body.reduced-motion *,
    body.reduced-motion *::before,
    body.reduced-motion *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }

    /* Visual Simplicity - removes decorative elements */
    body.visual-simplicity .decorative,
    body.visual-simplicity .ornament,
    body.visual-simplicity .gradient-border,
    body.visual-simplicity [class*="glow"],
    body.visual-simplicity [class*="shimmer"],
    body.visual-simplicity [class*="sparkle"] {
      display: none !important;
    }

    body.visual-simplicity * {
      border-radius: 4px !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }

    body.visual-simplicity {
      background: var(--bg-primary) !important;
    }

    /* Low Capacity Mode */
    body.low-capacity-mode .non-essential,
    body.low-capacity-mode .secondary-feature,
    body.low-capacity-mode .advanced-options {
      display: none !important;
    }

    body.low-capacity-mode .card,
    body.low-capacity-mode .panel {
      padding: 24px !important;
    }

    body.low-capacity-mode button,
    body.low-capacity-mode a {
      min-height: 48px !important;
      min-width: 48px !important;
      font-size: 1.1em !important;
    }

    /* Voice-free Operation */
    body.voice-free .voice-only,
    body.voice-free .audio-cue {
      display: none !important;
    }

    /* Predictable Navigation */
    body.predictable-nav nav,
    body.predictable-nav .navigation {
      position: sticky !important;
      top: 0 !important;
    }

    /* No Surprise Notifications */
    body.no-surprise-notifications .notification:not(.critical),
    body.no-surprise-notifications .toast:not(.critical),
    body.no-surprise-notifications .popup:not(.critical) {
      display: none !important;
    }

    /* Degradation Mode Styles */
    [data-degradation-mode="crisis-mode"] .non-critical,
    [data-degradation-mode="crisis-mode"] .entertainment,
    [data-degradation-mode="crisis-mode"] .social-features {
      display: none !important;
    }

    [data-degradation-mode="crisis-mode"] {
      background: linear-gradient(180deg, #1a0f0f 0%, #2d1f1f 100%) !important;
    }

    [data-degradation-mode="flare-day"] .high-energy,
    [data-degradation-mode="flare-day"] .requires-focus {
      opacity: 0.5 !important;
      pointer-events: none !important;
    }

    [data-degradation-mode="low-energy"] .optional-features {
      display: none !important;
    }

    [data-degradation-mode="post-crisis-recovery"] .demands,
    [data-degradation-mode="post-crisis-recovery"] .tasks,
    [data-degradation-mode="post-crisis-recovery"] .productivity {
      display: none !important;
    }

    /* Focus indicators for keyboard navigation */
    *:focus {
      outline: 2px solid var(--accent-primary, #8b5cf6) !important;
      outline-offset: 2px !important;
    }

    *:focus:not(:focus-visible) {
      outline: none !important;
    }

    *:focus-visible {
      outline: 3px solid var(--accent-primary, #8b5cf6) !important;
      outline-offset: 3px !important;
    }
  `}</style>
);

// ============================================================================
// UI Component
// ============================================================================

export const AccessibilityEnginePanel: React.FC = () => {
  const {
    settings,
    updateSensorySetting,
    toggleLowCapacityMode,
    setSpoonCount,
    setDegradationMode,
    getCurrentModeConfig,
    toggleSetting,
    resetToDefaults
  } = useAccessibilityEngine();

  const [isExpanded, setIsExpanded] = useState(false);
  const currentMode = getCurrentModeConfig();

  const fontSizes: FontSizeLevel[] = ['small', 'medium', 'large', 'extra-large'];
  const lineSpacings: LineSpacingLevel[] = ['compact', 'normal', 'relaxed', 'spacious'];
  const degradationModes: DegradationMode[] = [
    'full-capacity',
    'low-energy',
    'flare-day',
    'crisis-mode',
    'post-crisis-recovery'
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Floating Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-900 to-purple-700
                   border-2 border-purple-500/50 shadow-lg shadow-purple-500/20
                   flex items-center justify-center text-amber-400 hover:scale-110
                   transition-transform focus:outline-none focus:ring-2 focus:ring-amber-400"
        aria-label="Accessibility Settings"
        aria-expanded={isExpanded}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="4" r="2"/>
          <path d="M12 6v14"/>
          <path d="M6 10l6-2 6 2"/>
          <path d="M8 22l4-10 4 10"/>
        </svg>
      </button>

      {/* Panel */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 w-96 max-h-[80vh] overflow-y-auto
                        bg-gradient-to-b from-purple-950 to-gray-900
                        border border-purple-500/30 rounded-xl shadow-2xl
                        animate-fade-in">
          {/* Header */}
          <div className="sticky top-0 bg-purple-950/95 backdrop-blur-sm p-4
                          border-b border-purple-500/30">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-amber-400 font-serif">
                Accessibility Engine
              </h2>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white p-1"
                aria-label="Close panel"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Low Capacity Mode - One Tap */}
            <div className={`p-4 rounded-lg border-2 transition-colors cursor-pointer
                            ${settings.lowCapacityMode
                              ? 'bg-purple-600/20 border-purple-500'
                              : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50'}`}
                 onClick={toggleLowCapacityMode}
                 role="button"
                 aria-pressed={settings.lowCapacityMode}
                 tabIndex={0}
                 onKeyDown={(e) => e.key === 'Enter' && toggleLowCapacityMode()}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                                  ${settings.lowCapacityMode ? 'bg-purple-500' : 'bg-gray-700'}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                         stroke={settings.lowCapacityMode ? 'white' : '#9ca3af'} strokeWidth="2">
                      <path d="M3 12h18M12 3v18"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-white">Low Capacity Mode</div>
                    <div className="text-sm text-gray-400">One-tap simplification</div>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors
                                ${settings.lowCapacityMode ? 'bg-purple-500' : 'bg-gray-600'}`}>
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5
                                  transition-all ${settings.lowCapacityMode ? 'left-6' : 'left-0.5'}`}/>
                </div>
              </div>
            </div>

            {/* System Degradation / Spoon Tracker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                  Energy Level
                </h3>
                <span className="text-amber-400 font-medium">{settings.spoonCount}/12 spoons</span>
              </div>

              {/* Spoon Slider */}
              <input
                type="range"
                min="0"
                max="12"
                value={settings.spoonCount}
                onChange={(e) => setSpoonCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer
                           accent-purple-500"
                aria-label="Spoon count"
              />

              {/* Current Mode Display */}
              <div className="p-3 rounded-lg" style={{ backgroundColor: `${currentMode.color}20` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentMode.color }}/>
                  <span className="font-medium" style={{ color: currentMode.color }}>
                    {currentMode.name}
                  </span>
                  <span className="text-gray-500 text-sm">({currentMode.spoonThreshold} spoons)</span>
                </div>
                <p className="text-gray-400 text-sm">{currentMode.description}</p>
              </div>

              {/* Manual Mode Selection */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {degradationModes.map((mode) => {
                  const config = DEGRADATION_MODES[mode];
                  const isActive = settings.currentDegradationMode === mode;
                  return (
                    <button
                      key={mode}
                      onClick={() => setDegradationMode(mode)}
                      className={`p-2 rounded-lg text-sm text-left transition-colors
                                 ${isActive
                                   ? 'border-2'
                                   : 'border border-gray-700 hover:border-gray-600'}`}
                      style={{
                        borderColor: isActive ? config.color : undefined,
                        backgroundColor: isActive ? `${config.color}15` : 'rgba(31, 41, 55, 0.5)'
                      }}
                    >
                      <span style={{ color: isActive ? config.color : '#9ca3af' }}>
                        {config.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sensory Controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                Sensory Controls
              </h3>

              {/* Brightness */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Brightness</span>
                  <span className="text-gray-500">{settings.sensory.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={settings.sensory.brightness}
                  onChange={(e) => updateSensorySetting('brightness', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Contrast</span>
                  <span className="text-gray-500">{settings.sensory.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={settings.sensory.contrast}
                  onChange={(e) => updateSensorySetting('contrast', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-300">Dark Mode</span>
                <button
                  onClick={() => updateSensorySetting('darkMode', !settings.sensory.darkMode)}
                  className={`w-12 h-6 rounded-full relative transition-colors
                             ${settings.sensory.darkMode ? 'bg-purple-500' : 'bg-gray-600'}`}
                  aria-pressed={settings.sensory.darkMode}
                >
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5
                                  transition-all ${settings.sensory.darkMode ? 'left-6' : 'left-0.5'}`}/>
                </button>
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Volume</span>
                  <span className="text-gray-500">{settings.sensory.masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sensory.masterVolume}
                  onChange={(e) => updateSensorySetting('masterVolume', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>

              {/* Notification Sounds Toggle */}
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-300">Notification Sounds</span>
                <button
                  onClick={() => updateSensorySetting('notificationSounds', !settings.sensory.notificationSounds)}
                  className={`w-12 h-6 rounded-full relative transition-colors
                             ${settings.sensory.notificationSounds ? 'bg-green-500' : 'bg-gray-600'}`}
                  aria-pressed={settings.sensory.notificationSounds}
                >
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5
                                  transition-all ${settings.sensory.notificationSounds ? 'left-6' : 'left-0.5'}`}/>
                </button>
              </div>
            </div>

            {/* Text Density */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                Text Density
              </h3>

              {/* Font Size */}
              <div className="space-y-2">
                <span className="text-gray-300 text-sm">Font Size</span>
                <div className="grid grid-cols-4 gap-2">
                  {fontSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => updateSensorySetting('fontSize', size)}
                      className={`py-2 px-3 rounded-lg text-sm capitalize transition-colors
                                 ${settings.sensory.fontSize === size
                                   ? 'bg-purple-500 text-white'
                                   : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                      {size === 'extra-large' ? 'XL' : size.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Spacing */}
              <div className="space-y-2">
                <span className="text-gray-300 text-sm">Line Spacing</span>
                <div className="grid grid-cols-4 gap-2">
                  {lineSpacings.map((spacing) => (
                    <button
                      key={spacing}
                      onClick={() => updateSensorySetting('lineSpacing', spacing)}
                      className={`py-2 px-2 rounded-lg text-xs capitalize transition-colors
                                 ${settings.sensory.lineSpacing === spacing
                                   ? 'bg-purple-500 text-white'
                                   : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                      {spacing}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Accessibility Toggles */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wider">
                Accessibility Options
              </h3>

              {/* Voice-free Operation */}
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <span className="text-gray-300">Voice-free Operation</span>
                  <p className="text-xs text-gray-500">No voice/audio requirements</p>
                </div>
                <button
                  onClick={() => toggleSetting('voiceFreeOperation')}
                  className={`w-12 h-6 rounded-full relative transition-colors
                             ${settings.voiceFreeOperation ? 'bg-purple-500' : 'bg-gray-600'}`}
                  aria-pressed={settings.voiceFreeOperation}
                >
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5
                                  transition-all ${settings.voiceFreeOperation ? 'left-6' : 'left-0.5'}`}/>
                </button>
              </div>

              {/* Visual Simplicity */}
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <span className="text-gray-300">Visual Simplicity</span>
                  <p className="text-xs text-gray-500">Remove decorative elements</p>
                </div>
                <button
                  onClick={() => toggleSetting('visualSimplicity')}
                  className={`w-12 h-6 rounded-full relative transition-colors
                             ${settings.visualSimplicity ? 'bg-purple-500' : 'bg-gray-600'}`}
                  aria-pressed={settings.visualSimplicity}
                >
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5
                                  transition-all ${settings.visualSimplicity ? 'left-6' : 'left-0.5'}`}/>
                </button>
              </div>

              {/* Predictable Navigation */}
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <span className="text-gray-300">Predictable Navigation</span>
                  <p className="text-xs text-gray-500">Consistent layout always</p>
                </div>
                <button
                  onClick={() => toggleSetting('predictableNavigation')}
                  className={`w-12 h-6 rounded-full relative transition-colors
                             ${settings.predictableNavigation ? 'bg-purple-500' : 'bg-gray-600'}`}
                  aria-pressed={settings.predictableNavigation}
                >
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5
                                  transition-all ${settings.predictableNavigation ? 'left-6' : 'left-0.5'}`}/>
                </button>
              </div>

              {/* No Surprise Notifications */}
              <div className="flex items-center justify-between py-2 border-b border-gray-800">
                <div>
                  <span className="text-gray-300">No Surprise Notifications</span>
                  <p className="text-xs text-gray-500">Only critical alerts</p>
                </div>
                <button
                  onClick={() => toggleSetting('noSurpriseNotifications')}
                  className={`w-12 h-6 rounded-full relative transition-colors
                             ${settings.noSurpriseNotifications ? 'bg-purple-500' : 'bg-gray-600'}`}
                  aria-pressed={settings.noSurpriseNotifications}
                >
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5
                                  transition-all ${settings.noSurpriseNotifications ? 'left-6' : 'left-0.5'}`}/>
                </button>
              </div>

              {/* Reduce Motion */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-gray-300">Reduce Motion</span>
                  <p className="text-xs text-gray-500">Minimize animations</p>
                </div>
                <button
                  onClick={() => toggleSetting('reduceMotion')}
                  className={`w-12 h-6 rounded-full relative transition-colors
                             ${settings.reduceMotion ? 'bg-purple-500' : 'bg-gray-600'}`}
                  aria-pressed={settings.reduceMotion}
                >
                  <div className={`absolute w-5 h-5 rounded-full bg-white top-0.5
                                  transition-all ${settings.reduceMotion ? 'left-6' : 'left-0.5'}`}/>
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetToDefaults}
              className="w-full py-3 rounded-lg bg-gray-800 hover:bg-gray-700
                        text-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              Reset to Defaults
            </button>

            {/* Features Available Info */}
            <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Available Features in {currentMode.name}
              </div>
              <ul className="text-sm text-gray-400 space-y-1">
                {currentMode.features.slice(0, 4).map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                         stroke={currentMode.color} strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {feature}
                  </li>
                ))}
                {currentMode.features.length > 4 && (
                  <li className="text-gray-500 text-xs">
                    +{currentMode.features.length - 4} more...
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

// ============================================================================
// Exports
// ============================================================================

export {
  FONT_SIZE_VALUES,
  LINE_SPACING_VALUES,
  defaultSettings as DEFAULT_ACCESSIBILITY_ENGINE_SETTINGS
};

export default AccessibilityEngineProvider;
