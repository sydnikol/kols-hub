/**
 * AI Theme Prompt Component
 * Natural language input for generating custom themes
 */

import React, { useState } from 'react';
import { Sparkles, Wand2, Image, Palette } from 'lucide-react';
import { ThemeCategory, ThemeMood } from '../../services/themeGeneratorService';

interface AIThemePromptProps {
  onGenerate: (prompt: string, options: GenerationOptions) => void;
  loading?: boolean;
}

interface GenerationOptions {
  category?: ThemeCategory;
  mood?: ThemeMood;
  painLevel?: number;
  energyLevel?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  accessibility?: {
    highContrast?: boolean;
    colorblindMode?: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    dyslexiaFont?: boolean;
    reducedMotion?: boolean;
  };
}

export const AIThemePrompt: React.FC<AIThemePromptProps> = ({ onGenerate, loading = false }) => {
  const [prompt, setPrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState<GenerationOptions>({});

  const examplePrompts = [
    "Create a gothic vampire theme with deep purples and blood reds",
    "Make a soft cottagecore theme for relaxing",
    "Generate a high-energy cyberpunk theme with neon colors",
    "Design a migraine-safe minimal theme with low contrast",
    "Create a calming ocean theme for anxiety relief",
    "Make a warm desert theme for cozy evenings",
    "Generate a mystical witchy theme with dark greens",
    "Design a bright, energetic morning theme",
    "Create a gentle pastel theme for high pain days",
    "Make a focused minimalist theme for work",
  ];

  const moodOptions: { value: ThemeMood; label: string; emoji: string }[] = [
    { value: 'energetic', label: 'Energetic', emoji: '⚡' },
    { value: 'calm', label: 'Calm', emoji: '🌊' },
    { value: 'focused', label: 'Focused', emoji: '🎯' },
    { value: 'playful', label: 'Playful', emoji: '🎨' },
    { value: 'cozy', label: 'Cozy', emoji: '🔥' },
    { value: 'mysterious', label: 'Mysterious', emoji: '🌙' },
    { value: 'dreamy', label: 'Dreamy', emoji: '✨' },
    { value: 'healing', label: 'Healing', emoji: '💚' },
    { value: 'empowering', label: 'Empowering', emoji: '💪' },
    { value: 'gentle', label: 'Gentle', emoji: '🌸' },
  ];

  const categoryOptions: { value: ThemeCategory; label: string }[] = [
    { value: 'gothic', label: 'Gothic' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'cottagecore', label: 'Cottagecore' },
    { value: 'vaporwave', label: 'Vaporwave' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'forest', label: 'Forest' },
    { value: 'space', label: 'Space' },
    { value: 'witchy', label: 'Witchy' },
    { value: 'pastel', label: 'Pastel' },
    { value: 'neon', label: 'Neon' },
    { value: 'retro', label: 'Retro' },
  ];

  const handleGenerate = () => {
    if (prompt.trim() || options.category || options.mood) {
      onGenerate(prompt, options);
    }
  };

  const useExample = (example: string) => {
    setPrompt(example);
  };

  return (
    <div className="space-y-6">
      {/* Main Prompt Input */}
      <div className="space-y-3">
        <label className="block text-lg font-semibold text-purple-300">
          Describe your ideal theme
        </label>
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., 'Create a calming ocean theme with soft blues for meditation'"
            className="w-full h-32 px-4 py-3 bg-purple-950/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400 resize-none"
          />
          <Sparkles className="absolute top-3 right-3 text-purple-400" size={20} />
        </div>
      </div>

      {/* Example Prompts */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-purple-400">
          Example Prompts (click to use)
        </label>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.slice(0, 5).map((example, idx) => (
            <button
              key={idx}
              onClick={() => useExample(example)}
              className="text-xs px-3 py-1.5 bg-purple-900/30 hover:bg-purple-800/40 border border-purple-500/20 hover:border-purple-400/40 rounded-full text-purple-300 transition-all"
            >
              {example.slice(0, 40)}...
            </button>
          ))}
        </div>
      </div>

      {/* Quick Mood Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-purple-400">
          Quick Mood Selection
        </label>
        <div className="grid grid-cols-5 gap-2">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setOptions({ ...options, mood: mood.value })}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                options.mood === mood.value
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-purple-500/20 hover:border-purple-400/40 bg-purple-950/30'
              }`}
            >
              <div className="text-2xl mb-1">{mood.emoji}</div>
              <div className="text-xs text-purple-300">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2"
      >
        <Wand2 size={16} />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
      </button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 p-4 bg-purple-950/20 border border-purple-500/20 rounded-lg">
          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-400">
              Theme Category
            </label>
            <select
              value={options.category || ''}
              onChange={(e) => setOptions({ ...options, category: e.target.value as ThemeCategory })}
              className="w-full px-3 py-2 bg-purple-950/30 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              <option value="">Auto-detect from prompt</option>
              {categoryOptions.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pain Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-400">
              Current Pain Level (affects contrast and colors)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="10"
                value={options.painLevel || 0}
                onChange={(e) => setOptions({ ...options, painLevel: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-purple-300 font-mono w-8 text-center">
                {options.painLevel || 0}
              </span>
            </div>
            <div className="text-xs text-purple-400">
              Higher pain = softer colors and reduced motion
            </div>
          </div>

          {/* Energy Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-400">
              Energy Level (spoons)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="10"
                value={options.energyLevel || 5}
                onChange={(e) => setOptions({ ...options, energyLevel: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-purple-300 font-mono w-8 text-center">
                {options.energyLevel || 5}
              </span>
            </div>
          </div>

          {/* Time of Day */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-400">
              Time of Day
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                <button
                  key={time}
                  onClick={() => setOptions({ ...options, timeOfDay: time as any })}
                  className={`px-3 py-2 rounded-lg border capitalize ${
                    options.timeOfDay === time
                      ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                      : 'border-purple-500/20 bg-purple-950/30 text-purple-400 hover:border-purple-400/40'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Season */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-purple-400">
              Season
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['spring', 'summer', 'fall', 'winter'].map((season) => (
                <button
                  key={season}
                  onClick={() => setOptions({ ...options, season: season as any })}
                  className={`px-3 py-2 rounded-lg border capitalize ${
                    options.season === season
                      ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                      : 'border-purple-500/20 bg-purple-950/30 text-purple-400 hover:border-purple-400/40'
                  }`}
                >
                  {season}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-purple-400">
              Accessibility Features
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.accessibility?.highContrast || false}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      accessibility: {
                        ...options.accessibility,
                        highContrast: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-purple-500"
                />
                <span className="text-sm text-purple-300">High Contrast Mode</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.accessibility?.dyslexiaFont || false}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      accessibility: {
                        ...options.accessibility,
                        dyslexiaFont: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-purple-500"
                />
                <span className="text-sm text-purple-300">Dyslexia-Friendly Font</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.accessibility?.reducedMotion || false}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      accessibility: {
                        ...options.accessibility,
                        reducedMotion: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-purple-500"
                />
                <span className="text-sm text-purple-300">Reduced Motion</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-purple-400">
                Colorblind Mode
              </label>
              <select
                value={options.accessibility?.colorblindMode || 'none'}
                onChange={(e) =>
                  setOptions({
                    ...options,
                    accessibility: {
                      ...options.accessibility,
                      colorblindMode: e.target.value as any,
                    },
                  })
                }
                className="w-full px-3 py-2 bg-purple-950/30 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
              >
                <option value="none">None</option>
                <option value="protanopia">Protanopia (Red-Blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || (!prompt.trim() && !options.category && !options.mood)}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            Generating Theme...
          </>
        ) : (
          <>
            <Palette size={20} />
            Generate Theme
          </>
        )}
      </button>

      {/* Refinement Info */}
      <div className="text-xs text-purple-400 text-center">
        After generation, you can refine colors, typography, and spacing in the theme editor
      </div>
    </div>
  );
};

export default AIThemePrompt;
