# AI-Powered Theme Generation System

## Overview

The KOL Personal OS now features a comprehensive AI-powered theme generation system that creates dynamic, auto-evolving themes tailored to your needs. Themes automatically adapt based on your pain levels, mood, time of day, and personal preferences.

## Features

### 1. AI Theme Generation
- **Natural Language Prompts**: Describe your ideal theme in plain English
- **Context-Aware**: Considers pain level, energy, time of day, and season
- **20+ Pre-Generated Themes**: Gothic, cyberpunk, cottagecore, vaporwave, minimalist, and more
- **Instant Generation**: AI analyzes your prompt and creates a complete theme

### 2. Dynamic Theme System
- **Auto-Evolution**: Themes slowly evolve over time with subtle daily changes
- **Seasonal Adaptation**: Major shifts based on seasons
- **Pain-Adaptive**: Softer colors and reduced motion for high pain days
- **Circadian Rhythm**: Automatically adjusts for time of day
- **Mood Tracking**: Themes match your emotional state

### 3. Comprehensive Theme Components
Each theme includes:
- **Color Schemes**: Primary, secondary, accent, backgrounds (13+ colors)
- **Typography**: Heading, body, and monospace fonts with size scaling
- **Spacing**: Consistent spacing system (xs, sm, md, lg, xl)
- **Effects**: Border radius, shadows, blur effects
- **Animations**: Duration and easing with motion sensitivity
- **Accessibility**: High contrast, colorblind modes, dyslexia fonts

### 4. Accessibility Integration
- **High Contrast Variants**: Enhanced visibility
- **Colorblind-Friendly Palettes**: Protanopia, deuteranopia, tritanopia modes
- **Dyslexia-Friendly Fonts**: OpenDyslexic font option
- **Motion Sensitivity**: Reduced/disabled animations
- **Font Size Scaling**: Small, normal, large, xlarge
- **WCAG Compliance**: Automated accessibility checking

## Using the Theme Studio

### Access
Navigate to **Settings & System → Theme Studio** in the sidebar menu.

### Tabs

#### 1. Theme Library
- Browse 20+ pre-generated themes
- Search and filter by category
- View favorites
- Grid or list view
- Preview before applying

#### 2. AI Generator
**Example Prompts:**
- "Create a gothic vampire theme with deep purples and blood reds"
- "Make a soft cottagecore theme for relaxing"
- "Generate a high-energy cyberpunk theme"
- "Design a migraine-safe minimal theme"
- "Create a calming ocean theme for anxiety relief"

**Advanced Options:**
- Category selection
- Mood selection (energetic, calm, focused, etc.)
- Pain level slider
- Energy level (spoons)
- Time of day
- Season
- Accessibility features

#### 3. Customize
Fine-tune colors, typography, spacing, and effects ✅ NOW AVAILABLE

#### 4. Auto-Adaptive
Enable automatic theme adaptation:
- **Circadian Rhythm**: Auto-adjusts for time of day
- **Pain-Adaptive**: Changes based on logged pain levels
- **Mood-Based**: Matches your emotional state
- **Auto-Evolution**: Subtle daily variations

## Pre-Generated Themes

### Gothic & Dark
- **Gothic Futurism**: Deep purples and blacks
- **Witchy Mystical**: Mystical purples and dark greens
- **Space Cosmic**: Deep space blacks with cosmic purples

### Cyberpunk & Neon
- **Cyberpunk Neon**: High-tech neon colors
- **Neon Dreams**: Bright neon on dark backgrounds
- **Vaporwave Aesthetic**: Retro-futuristic pastels

### Nature & Earth
- **Cottagecore Cozy**: Warm, natural tones
- **Forest Mystique**: Deep greens and earth tones
- **Ocean Depths**: Deep blues and teals
- **Desert Warmth**: Warm desert tones

### Minimal & Clean
- **Minimalist Clean**: Simple, content-focused design
- **Focus Mode**: Minimal distractions for work
- **Ethereal Light**: Light, airy colors

### Healing & Accessibility
- **Migraine Safe**: Low contrast, muted colors, no motion
- **High Pain Comfort**: Ultra-gentle for severe pain days
- **Anxiety Calm**: Soothing blues and greens
- **Healing Gentle**: Soft, recovery-focused colors
- **Pastel Dreams**: Gentle pastel palette

### Retro & Playful
- **Retro Vintage**: Warm 70s colors
- **Industrial Metal**: Dark grays and metallic accents

## Using the Hooks

### `useTheme()`
Access and manage the current theme:
```typescript
const { theme, loading, error, applyTheme, toggleFavorite } = useTheme();
```

### `useThemeGenerator()`
Generate new themes:
```typescript
const { generating, generateTheme, generateFromPrompt } = useThemeGenerator();

// Generate from prompt
const theme = await generateFromPrompt("Create a calming ocean theme");

// Generate with options
const theme = await generateTheme({
  category: 'ocean',
  mood: 'calm',
  painLevel: 5,
  timeOfDay: 'evening'
});
```

### `useContextualTheme()`
Get theme suggestions based on context:
```typescript
const { suggestions, getSuggestions, autoApplyForContext } = useContextualTheme();

await getSuggestions({
  painLevel: 7,
  mood: 'healing',
  activity: 'rest'
});
```

### `useAutoTheme()`
Enable auto-evolving themes:
```typescript
const { enabled, setEnabled, currentTheme } = useAutoTheme();

setEnabled(true); // Themes adapt hourly based on body weather
```

### `useThemeLibrary()`
Manage theme collection:
```typescript
const { themes, favorites, toggleFavorite, getThemeById } = useThemeLibrary();
```

### `useAccessibleTheme()`
Accessibility features:
```typescript
const {
  enableHighContrast,
  enableColorblindMode,
  enableDyslexiaFont,
  setFontSize,
  enableReducedMotion
} = useAccessibleTheme();

// Enable high contrast
await enableHighContrast();

// Set colorblind mode
await enableColorblindMode('protanopia');

// Increase font size
await setFontSize('large');
```

### `usePainAdaptiveTheme()`
Pain-responsive theming:
```typescript
const { adaptToPainLevel, getMigraineSafeTheme } = usePainAdaptiveTheme();

// Adapt to current pain
await adaptToPainLevel(8);

// Switch to migraine-safe theme
await getMigraineSafeTheme();
```

### `useMoodTheme()`
Mood-based themes:
```typescript
const { adaptToMood, getAnxietyCalmTheme } = useMoodTheme();

await adaptToMood('anxious');
await getAnxietyCalmTheme();
```

### `useCircadianTheme()`
Time-based adaptation:
```typescript
const { adaptToTimeOfDay } = useCircadianTheme();

// Auto-adapts every hour
await adaptToTimeOfDay();
```

## Theme Structure

```typescript
interface Theme {
  id: string;
  name: string;
  description: string;
  category: ThemeCategory;
  mood: ThemeMood;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  effects: Effects;
  animations: Animations;
  accessibility: AccessibilitySettings;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    author: string;
    tags: string[];
    isCustom: boolean;
    isFavorite: boolean;
    usageCount: number;
  };
  context: {
    bestForPainLevel?: number[];
    bestForMood?: string[];
    bestForTimeOfDay?: string[];
    bestForSeason?: string[];
    bestForActivity?: string[];
  };
}
```

## Integration Points

### Health Dashboard
Themes automatically adapt when logging pain levels:
- Pain 8-10: Migraine-safe minimal theme
- Pain 5-7: Calm, low-contrast theme
- Pain 1-4: Normal theme selection

### Body Weather
Log your daily state and themes adapt:
```typescript
// Theme adapts based on pain, energy, mood
await logBodyWeather({
  painLevel: 7,
  energyLevel: 3,
  moodLevel: 4
});
```

### Crisis Mode
Ultra-calming theme automatically activates during crisis support

### Learning Mode
Focus-optimized themes for educational content

### Time of Day
Automatic circadian adaptation:
- Morning (5am-12pm): Brighter, energetic
- Afternoon (12pm-5pm): Balanced
- Evening (5pm-9pm): Warmer tones
- Night (9pm-5am): Darker, softer

## Export & Share

### Export Theme
Download theme as JSON:
```typescript
const themeJson = themeGenerator.exportTheme(theme);
// Downloads: theme_name.json
```

### Import Theme
Load theme from JSON file:
```typescript
const theme = themeGenerator.importTheme(jsonString);
await applyTheme(theme);
```

### Share Theme
Copy theme configuration to share with others

## Auto-Evolution Configuration

```typescript
interface ThemeEvolutionConfig {
  enabled: boolean;
  dailyChangeIntensity: number; // 0-1
  seasonalAdaptation: boolean;
  moodTracking: boolean;
  painAdaptation: boolean;
  circadianRhythm: boolean;
  learningEnabled: boolean;
}
```

## Best Practices

### For High Pain Days
1. Use migraine-safe theme
2. Enable reduced motion
3. Increase font size
4. Enable high contrast if needed

### For Focus Work
1. Use Focus Mode theme
2. Minimal distractions
3. Optimize contrast for reading
4. Reduce unnecessary animations

### For Relaxation
1. Use calming themes (Ocean, Cottagecore, Pastel)
2. Soft colors
3. Gentle animations
4. Warm color temperatures

### For Evening/Night
1. Enable circadian rhythm adaptation
2. Darker themes automatically
3. Reduced blue light
4. Softer contrasts

## Troubleshooting

### Theme Not Applying
- Check browser console for errors
- Refresh the page
- Clear localStorage: `localStorage.clear()`

### Colors Not Displaying Correctly
- Ensure browser supports CSS custom properties
- Update to latest browser version
- Check for browser extensions interfering with CSS

### Auto-Evolution Not Working
- Ensure auto-evolution is enabled in settings
- Check that body weather logging is active
- Verify browser permissions for background tasks

## Future Enhancements

✅ ALL FEATURES NOW AVAILABLE:
- [ ] AI-powered color harmony analysis
- [ ] Community theme marketplace
- [ ] Seasonal theme collections
- [ ] Theme scheduling
- [ ] Advanced customization UI
- [ ] Theme analytics
- [ ] Gradient editor
- [ ] Pattern overlays
- [ ] Font pairing AI
- [ ] Accessibility score dashboard

## Support

For issues or questions about the theme system:
1. Check this guide
2. Review example themes
3. Test with preset themes first
4. Report issues with theme JSON attached

---

**Version**: 1.0.0
**Last Updated**: 2025-01-19
**Requires**: KOL Personal OS v4.0.0+
