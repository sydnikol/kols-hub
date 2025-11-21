/**
 * Theme Management Hooks
 * React hooks for theme generation, application, and evolution
 */

import { useState, useEffect, useCallback } from 'react';
import {
  themeGenerator,
  Theme,
  ThemeGenerationRequest,
  ThemeEvolutionConfig,
} from '../services/themeGeneratorService';
import { db } from '../utils/database';

// Hook for current theme management
export function useTheme() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCurrentTheme();
  }, []);

  const loadCurrentTheme = async () => {
    try {
      setLoading(true);
      const currentTheme = themeGenerator.getCurrentTheme();
      setTheme(currentTheme);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load theme');
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = useCallback(async (newTheme: Theme) => {
    try {
      await themeGenerator.applyTheme(newTheme);
      setTheme(newTheme);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to apply theme');
    }
  }, []);

  const toggleFavorite = useCallback(async (themeId: string) => {
    try {
      await themeGenerator.toggleFavorite(themeId);
      if (theme && theme.id === themeId) {
        setTheme({ ...theme, metadata: { ...theme.metadata, isFavorite: !theme.metadata.isFavorite } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle favorite');
    }
  }, [theme]);

  return {
    theme,
    loading,
    error,
    applyTheme,
    toggleFavorite,
    refresh: loadCurrentTheme,
  };
}

// Hook for theme generation
export function useThemeGenerator() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTheme = useCallback(async (request: ThemeGenerationRequest): Promise<Theme | null> => {
    try {
      setGenerating(true);
      setError(null);
      const newTheme = await themeGenerator.generateTheme(request);
      return newTheme;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate theme');
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  const generateFromPrompt = useCallback(async (prompt: string): Promise<Theme | null> => {
    return generateTheme({ prompt });
  }, [generateTheme]);

  return {
    generating,
    error,
    generateTheme,
    generateFromPrompt,
  };
}

// Hook for contextual theme suggestions
export function useContextualTheme() {
  const [suggestions, setSuggestions] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);

  const getSuggestions = useCallback(async (context: {
    painLevel?: number;
    mood?: string;
    activity?: string;
  }) => {
    try {
      setLoading(true);
      const themes = await themeGenerator.suggestThemeForContext(context);
      setSuggestions(themes);
    } catch (err) {
      console.error('Failed to get theme suggestions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const autoApplyForContext = useCallback(async (context: {
    painLevel?: number;
    mood?: string;
    activity?: string;
  }) => {
    const themes = await themeGenerator.suggestThemeForContext(context);
    if (themes.length > 0) {
      await themeGenerator.applyTheme(themes[0]);
      return themes[0];
    }
    return null;
  }, []);

  return {
    suggestions,
    loading,
    getSuggestions,
    autoApplyForContext,
  };
}

// Hook for auto-evolving theme
export function useAutoTheme() {
  const [enabled, setEnabled] = useState(false);
  const { theme, applyTheme } = useTheme();
  const { getSuggestions } = useContextualTheme();

  useEffect(() => {
    if (!enabled) return;

    // Check body weather and adapt theme hourly
    const interval = setInterval(async () => {
      try {
        // Get recent body weather data
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const recentLogs = await db.bodyWeatherLogs
          .where('createdAt')
          .aboveOrEqual(today)
          .reverse()
          .limit(1)
          .toArray();

        if (recentLogs.length > 0) {
          const log = recentLogs[0];

          // Get contextual suggestions
          await getSuggestions({
            painLevel: log.painLevel,
            mood: log.moodLevel ? (log.moodLevel > 7 ? 'energetic' : log.moodLevel > 4 ? 'calm' : 'healing') : undefined,
          });
        }
      } catch (err) {
        console.error('Auto-theme adaptation error:', err);
      }
    }, 60 * 60 * 1000); // Every hour

    return () => clearInterval(interval);
  }, [enabled, getSuggestions]);

  return {
    enabled,
    setEnabled,
    currentTheme: theme,
  };
}

// Hook for theme library management
export function useThemeLibrary() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [favorites, setFavorites] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const allThemes = themeGenerator.getPresetThemes();
      setThemes(allThemes);

      const favThemes = await themeGenerator.getFavoriteThemes();
      setFavorites(favThemes);
    } catch (err) {
      console.error('Failed to load themes:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = useCallback(async (themeId: string) => {
    await themeGenerator.toggleFavorite(themeId);
    await loadThemes();
  }, []);

  const getThemeById = useCallback(async (id: string) => {
    return await themeGenerator.getThemeById(id);
  }, []);

  return {
    themes,
    favorites,
    loading,
    toggleFavorite,
    getThemeById,
    refresh: loadThemes,
  };
}

// Hook for accessibility-aware theming
export function useAccessibleTheme() {
  const { theme, applyTheme } = useTheme();
  const { generateTheme } = useThemeGenerator();

  const enableHighContrast = useCallback(async () => {
    if (!theme) return;

    const highContrastTheme = await generateTheme({
      baseTheme: theme,
      accessibility: {
        highContrast: true,
      },
    });

    if (highContrastTheme) {
      await applyTheme(highContrastTheme);
    }
  }, [theme, generateTheme, applyTheme]);

  const enableColorblindMode = useCallback(async (mode: 'protanopia' | 'deuteranopia' | 'tritanopia') => {
    if (!theme) return;

    const colorblindTheme = await generateTheme({
      baseTheme: theme,
      accessibility: {
        colorblindMode: mode,
      },
    });

    if (colorblindTheme) {
      await applyTheme(colorblindTheme);
    }
  }, [theme, generateTheme, applyTheme]);

  const enableDyslexiaFont = useCallback(async () => {
    if (!theme) return;

    const dyslexiaTheme = await generateTheme({
      baseTheme: theme,
      accessibility: {
        dyslexiaFont: true,
      },
    });

    if (dyslexiaTheme) {
      await applyTheme(dyslexiaTheme);
    }
  }, [theme, generateTheme, applyTheme]);

  const setFontSize = useCallback(async (size: 'small' | 'normal' | 'large' | 'xlarge') => {
    if (!theme) return;

    const resizedTheme = await generateTheme({
      baseTheme: theme,
      accessibility: {
        fontSize: size,
      },
    });

    if (resizedTheme) {
      await applyTheme(resizedTheme);
    }
  }, [theme, generateTheme, applyTheme]);

  const enableReducedMotion = useCallback(async () => {
    if (!theme) return;

    const reducedMotionTheme = await generateTheme({
      baseTheme: theme,
      accessibility: {
        reducedMotion: true,
      },
    });

    if (reducedMotionTheme) {
      await applyTheme(reducedMotionTheme);
    }
  }, [theme, generateTheme, applyTheme]);

  return {
    enableHighContrast,
    enableColorblindMode,
    enableDyslexiaFont,
    setFontSize,
    enableReducedMotion,
  };
}

// Hook for pain-adaptive theming
export function usePainAdaptiveTheme() {
  const { applyTheme } = useTheme();
  const { generateTheme } = useThemeGenerator();

  const adaptToPainLevel = useCallback(async (painLevel: number) => {
    let category: any = 'gothic';
    let mood: any = 'calm';

    // High pain - minimal, low contrast
    if (painLevel >= 8) {
      category = 'minimalist';
      mood = 'healing';
    }
    // Moderate pain - calm, soothing
    else if (painLevel >= 5) {
      category = 'ocean';
      mood = 'calm';
    }
    // Low pain - normal themes
    else {
      category = 'gothic';
      mood = 'focused';
    }

    const painTheme = await generateTheme({
      category,
      mood,
      painLevel,
      accessibility: {
        reducedMotion: painLevel >= 7,
      },
    });

    if (painTheme) {
      await applyTheme(painTheme);
    }
  }, [generateTheme, applyTheme]);

  const getMigraineSafeTheme = useCallback(async () => {
    const migraineTheme = await themeGenerator.getThemeById('migraine_safe');
    if (migraineTheme) {
      await applyTheme(migraineTheme);
    }
  }, [applyTheme]);

  return {
    adaptToPainLevel,
    getMigraineSafeTheme,
  };
}

// Hook for mood-based theming
export function useMoodTheme() {
  const { applyTheme } = useTheme();
  const { getSuggestions } = useContextualTheme();

  const adaptToMood = useCallback(async (mood: string) => {
    await getSuggestions({ mood });
  }, [getSuggestions]);

  const getAnxietyCalmTheme = useCallback(async () => {
    const anxietyTheme = await themeGenerator.getThemeById('anxiety_calm');
    if (anxietyTheme) {
      await applyTheme(anxietyTheme);
    }
  }, [applyTheme]);

  return {
    adaptToMood,
    getAnxietyCalmTheme,
  };
}

// Hook for circadian rhythm theming
export function useCircadianTheme() {
  const { applyTheme } = useTheme();
  const { generateTheme } = useThemeGenerator();

  const adaptToTimeOfDay = useCallback(async () => {
    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';

    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    const circadianTheme = await generateTheme({
      timeOfDay,
    });

    if (circadianTheme) {
      await applyTheme(circadianTheme);
    }
  }, [generateTheme, applyTheme]);

  useEffect(() => {
    // Auto-adapt every hour
    const interval = setInterval(adaptToTimeOfDay, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [adaptToTimeOfDay]);

  return {
    adaptToTimeOfDay,
  };
}

export default {
  useTheme,
  useThemeGenerator,
  useContextualTheme,
  useAutoTheme,
  useThemeLibrary,
  useAccessibleTheme,
  usePainAdaptiveTheme,
  useMoodTheme,
  useCircadianTheme,
};
