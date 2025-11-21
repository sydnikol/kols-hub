/**
 * Theme Integration Example
 * Shows how to integrate the theme system into your components
 */

import React, { useEffect } from 'react';
import {
  useTheme,
  useThemeGenerator,
  usePainAdaptiveTheme,
  useAutoTheme,
} from '../hooks/useTheme';
import { db } from '../utils/database';

// Example 1: Simple theme-aware component
export const ThemedComponent: React.FC = () => {
  const { theme } = useTheme();

  if (!theme) return null;

  return (
    <div
      style={{
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        padding: theme.spacing.lg,
        borderRadius: theme.effects.borderRadius.lg,
        fontFamily: theme.typography.fontFamily.body,
      }}
    >
      <h2
        style={{
          fontFamily: theme.typography.fontFamily.heading,
          fontSize: theme.typography.fontSize['2xl'],
          color: theme.colors.primary,
          marginBottom: theme.spacing.md,
        }}
      >
        Theme-Aware Component
      </h2>
      <p style={{ color: theme.colors.textSecondary }}>
        This component automatically uses the current theme's colors, typography, and spacing.
      </p>
    </div>
  );
};

// Example 2: Pain-responsive component
export const PainAdaptiveComponent: React.FC = () => {
  const { adaptToPainLevel } = usePainAdaptiveTheme();
  const { theme } = useTheme();

  const handlePainLog = async (painLevel: number) => {
    // Log pain to database
    await db.pain.add({
      timestamp: new Date(),
      painLevel,
      location: ['general'],
    });

    // Adapt theme to pain level
    await adaptToPainLevel(painLevel);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Log Pain Level</h3>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
          <button
            key={level}
            onClick={() => handlePainLog(level)}
            className="px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: theme?.colors.surface,
              borderColor: theme?.colors.border,
              color: theme?.colors.text,
            }}
          >
            {level}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-400">
        Theme will automatically adapt to your pain level
      </p>
    </div>
  );
};

// Example 3: Auto-evolving theme component
export const AutoEvolvingComponent: React.FC = () => {
  const { enabled, setEnabled } = useAutoTheme();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Auto-Evolving Theme</h3>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span>Enable auto-evolution</span>
      </label>
      {enabled && (
        <p className="text-sm text-green-400">
          Theme will adapt hourly based on your body weather logs
        </p>
      )}
    </div>
  );
};

// Example 4: Custom theme generator
export const CustomThemeGenerator: React.FC = () => {
  const { generateTheme } = useThemeGenerator();
  const { applyTheme } = useTheme();

  const createMorningTheme = async () => {
    const theme = await generateTheme({
      prompt: 'Create a bright, energizing morning theme',
      timeOfDay: 'morning',
      mood: 'energetic',
    });

    if (theme) {
      await applyTheme(theme);
    }
  };

  const createNightTheme = async () => {
    const theme = await generateTheme({
      prompt: 'Create a calm, dark theme for nighttime',
      timeOfDay: 'night',
      mood: 'calm',
      accessibility: {
        reducedMotion: true,
      },
    });

    if (theme) {
      await applyTheme(theme);
    }
  };

  const createPainTheme = async (painLevel: number) => {
    const theme = await generateTheme({
      category: painLevel > 7 ? 'minimalist' : 'ocean',
      mood: 'healing',
      painLevel,
      accessibility: {
        reducedMotion: painLevel > 7,
        highContrast: false,
      },
    });

    if (theme) {
      await applyTheme(theme);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Quick Theme Generators</h3>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={createMorningTheme}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white"
        >
          Morning Theme
        </button>
        <button
          onClick={createNightTheme}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white"
        >
          Night Theme
        </button>
        <button
          onClick={() => createPainTheme(8)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
        >
          High Pain Theme
        </button>
      </div>
    </div>
  );
};

// Example 5: Body Weather integration
export const BodyWeatherThemeIntegration: React.FC = () => {
  const { adaptToPainLevel } = usePainAdaptiveTheme();

  useEffect(() => {
    // Check latest body weather log and adapt theme
    const checkAndAdapt = async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const recentLogs = await db.bodyWeatherLogs
        .where('createdAt')
        .aboveOrEqual(today)
        .reverse()
        .limit(1)
        .toArray();

      if (recentLogs.length > 0 && recentLogs[0].painLevel) {
        await adaptToPainLevel(recentLogs[0].painLevel);
      }
    };

    checkAndAdapt();
  }, [adaptToPainLevel]);

  return null; // This is a background integration component
};

// Example 6: Using theme colors in Tailwind classes
export const TailwindThemedComponent: React.FC = () => {
  const { theme } = useTheme();

  // You can use theme values directly in inline styles
  // Or create dynamic Tailwind classes
  return (
    <div
      className="p-6 rounded-lg shadow-lg"
      style={{
        backgroundColor: theme?.colors.surface,
        borderColor: theme?.colors.border,
      }}
    >
      <h3
        className="text-2xl font-bold mb-4"
        style={{ color: theme?.colors.primary }}
      >
        Hybrid Approach
      </h3>
      <p
        className="mb-4"
        style={{ color: theme?.colors.text }}
      >
        Use Tailwind for layout and theme values for colors
      </p>
      <button
        className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-80"
        style={{
          backgroundColor: theme?.colors.primary,
          color: theme?.colors.text,
        }}
      >
        Themed Button
      </button>
    </div>
  );
};

// Example 7: Theme context provider (for deeper integration)
export const ThemeAwareApp: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      // Apply theme to document root
      const root = document.documentElement;

      // Set CSS variables for global use
      root.style.setProperty('--color-primary', theme.colors.primary);
      root.style.setProperty('--color-secondary', theme.colors.secondary);
      root.style.setProperty('--color-accent', theme.colors.accent);
      root.style.setProperty('--color-background', theme.colors.background);
      root.style.setProperty('--color-surface', theme.colors.surface);
      root.style.setProperty('--color-text', theme.colors.text);
      root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
      root.style.setProperty('--font-heading', theme.typography.fontFamily.heading);
      root.style.setProperty('--font-body', theme.typography.fontFamily.body);
    }
  }, [theme]);

  return <>{children}</>;
};

// Example 8: Accessibility-aware component
export const AccessibleThemedComponent: React.FC = () => {
  const { theme } = useTheme();

  if (!theme) return null;

  const buttonStyle = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.text,
    padding: theme.spacing.md,
    borderRadius: theme.effects.borderRadius.md,
    fontSize: theme.typography.fontSize.base,
    transition: `all ${theme.animations.duration.normal}`,
    cursor: 'pointer',
    border: 'none',
    fontFamily: theme.typography.fontFamily.body,
  };

  return (
    <div>
      <button
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (!theme.animations.motionReduced) {
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Accessible Button
      </button>
      <p className="text-xs mt-2 text-gray-400">
        {theme.accessibility.reducedMotion && 'Reduced motion enabled'}
        {theme.accessibility.highContrast && ' • High contrast enabled'}
        {theme.accessibility.dyslexiaFont && ' • Dyslexia font enabled'}
      </p>
    </div>
  );
};

export default {
  ThemedComponent,
  PainAdaptiveComponent,
  AutoEvolvingComponent,
  CustomThemeGenerator,
  BodyWeatherThemeIntegration,
  TailwindThemedComponent,
  ThemeAwareApp,
  AccessibleThemedComponent,
};
