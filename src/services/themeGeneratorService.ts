/**
 * AI-Powered Theme Generation Service
 * Generates dynamic, contextual themes that evolve with user needs
 */

import { db } from '../utils/database';

// Core theme interfaces
export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  background: string;
  backgroundLight: string;
  backgroundDark: string;
  surface: string;
  surfaceLight: string;
  surfaceDark: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Typography {
  fontFamily: {
    heading: string;
    body: string;
    monospace: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface Spacing {
  unit: number;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface Effects {
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    inner: string;
  };
  blur: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  opacity: {
    disabled: number;
    hover: number;
    active: number;
  };
}

export interface Animations {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
  motionReduced: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'xlarge';
  focusVisible: boolean;
}

export interface Theme {
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

export type ThemeCategory =
  | 'gothic'
  | 'cyberpunk'
  | 'cottagecore'
  | 'vaporwave'
  | 'minimalist'
  | 'nature'
  | 'ocean'
  | 'forest'
  | 'desert'
  | 'space'
  | 'neon'
  | 'pastel'
  | 'monochrome'
  | 'witchy'
  | 'ethereal'
  | 'industrial'
  | 'retro'
  | 'futuristic'
  | 'warm'
  | 'cool'
  | 'custom';

export type ThemeMood =
  | 'energetic'
  | 'calm'
  | 'focused'
  | 'playful'
  | 'serious'
  | 'cozy'
  | 'mysterious'
  | 'dreamy'
  | 'bold'
  | 'gentle'
  | 'healing'
  | 'empowering';

export interface ThemeGenerationRequest {
  prompt?: string;
  category?: ThemeCategory;
  mood?: ThemeMood;
  painLevel?: number;
  energyLevel?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  season?: 'spring' | 'summer' | 'fall' | 'winter';
  culturalInfluence?: string[];
  accessibility?: Partial<AccessibilitySettings>;
  baseTheme?: Theme;
}

export interface ThemeEvolutionConfig {
  enabled: boolean;
  dailyChangeIntensity: number; // 0-1
  seasonalAdaptation: boolean;
  moodTracking: boolean;
  painAdaptation: boolean;
  circadianRhythm: boolean;
  learningEnabled: boolean;
}

class ThemeGeneratorService {
  private currentTheme: Theme | null = null;
  private evolutionConfig: ThemeEvolutionConfig = {
    enabled: true,
    dailyChangeIntensity: 0.05,
    seasonalAdaptation: true,
    moodTracking: true,
    painAdaptation: true,
    circadianRhythm: true,
    learningEnabled: true,
  };

  // Pre-generated themes library
  private presetThemes: Theme[] = [
    this.createGothicTheme(),
    this.createCyberpunkTheme(),
    this.createCottagecoreTheme(),
    this.createVaporwaveTheme(),
    this.createMinimalistTheme(),
    this.createOceanTheme(),
    this.createForestTheme(),
    this.createNeonTheme(),
    this.createPastelTheme(),
    this.createWitchyTheme(),
    this.createEtherealTheme(),
    this.createIndustrialTheme(),
    this.createRetroTheme(),
    this.createSpaceTheme(),
    this.createDesertTheme(),
    this.createMigraineSafeTheme(),
    this.createHighPainTheme(),
    this.createAnxietyCalmTheme(),
    this.createFocusModeTheme(),
    this.createHealingTheme(),
  ];

  constructor() {
    this.initializeThemeSystem();
  }

  private async initializeThemeSystem() {
    // Load saved theme from database
    const savedThemeId = await this.getSavedThemeId();
    if (savedThemeId) {
      this.currentTheme = await this.loadTheme(savedThemeId);
    } else {
      this.currentTheme = this.presetThemes[0]; // Default to gothic
    }

    // Start evolution if enabled
    if (this.evolutionConfig.enabled) {
      this.startAutoEvolution();
    }
  }

  // AI Theme Generation
  async generateTheme(request: ThemeGenerationRequest): Promise<Theme> {
    console.log('Generating theme with request:', request);

    // If prompt provided, parse it for theme characteristics
    let category = request.category;
    let mood = request.mood;

    if (request.prompt) {
      const parsed = this.parseThemePrompt(request.prompt);
      category = category || parsed.category;
      mood = mood || parsed.mood;
    }

    // Generate base colors from context
    const colors = this.generateColorPalette({
      category: category || 'gothic',
      mood: mood || 'calm',
      painLevel: request.painLevel,
      timeOfDay: request.timeOfDay,
      accessibility: request.accessibility,
    });

    // Generate typography
    const typography = this.generateTypography({
      category: category || 'gothic',
      accessibility: request.accessibility,
    });

    // Generate spacing and effects
    const spacing = this.generateSpacing();
    const effects = this.generateEffects(category || 'gothic');
    const animations = this.generateAnimations(request.accessibility?.reducedMotion);

    // Create theme
    const theme: Theme = {
      id: `theme_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: request.prompt || `${category} ${mood}`,
      description: this.generateThemeDescription(category || 'gothic', mood || 'calm'),
      category: category || 'gothic',
      mood: mood || 'calm',
      colors,
      typography,
      spacing,
      effects,
      animations,
      accessibility: {
        highContrast: request.accessibility?.highContrast || false,
        colorblindMode: request.accessibility?.colorblindMode || 'none',
        dyslexiaFont: request.accessibility?.dyslexiaFont || false,
        reducedMotion: request.accessibility?.reducedMotion || false,
        fontSize: request.accessibility?.fontSize || 'normal',
        focusVisible: true,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        author: 'AI Generator',
        tags: this.generateTags(category, mood),
        isCustom: true,
        isFavorite: false,
        usageCount: 0,
      },
      context: this.generateContext(request),
    };

    // Save to database
    await this.saveTheme(theme);

    return theme;
  }

  // Parse natural language theme prompts
  private parseThemePrompt(prompt: string): { category: ThemeCategory; mood: ThemeMood } {
    const lowerPrompt = prompt.toLowerCase();

    // Category detection
    let category: ThemeCategory = 'custom';
    if (lowerPrompt.includes('gothic') || lowerPrompt.includes('vampire') || lowerPrompt.includes('dark')) {
      category = 'gothic';
    } else if (lowerPrompt.includes('cyber') || lowerPrompt.includes('neon') || lowerPrompt.includes('futuristic')) {
      category = 'cyberpunk';
    } else if (lowerPrompt.includes('cottage') || lowerPrompt.includes('cozy') || lowerPrompt.includes('rustic')) {
      category = 'cottagecore';
    } else if (lowerPrompt.includes('vapor') || lowerPrompt.includes('aesthetic') || lowerPrompt.includes('80s')) {
      category = 'vaporwave';
    } else if (lowerPrompt.includes('minimal') || lowerPrompt.includes('clean') || lowerPrompt.includes('simple')) {
      category = 'minimalist';
    } else if (lowerPrompt.includes('ocean') || lowerPrompt.includes('sea') || lowerPrompt.includes('water')) {
      category = 'ocean';
    } else if (lowerPrompt.includes('forest') || lowerPrompt.includes('nature') || lowerPrompt.includes('green')) {
      category = 'forest';
    } else if (lowerPrompt.includes('space') || lowerPrompt.includes('cosmic') || lowerPrompt.includes('galaxy')) {
      category = 'space';
    } else if (lowerPrompt.includes('witch') || lowerPrompt.includes('magic') || lowerPrompt.includes('mystical')) {
      category = 'witchy';
    } else if (lowerPrompt.includes('pastel') || lowerPrompt.includes('soft') || lowerPrompt.includes('gentle')) {
      category = 'pastel';
    }

    // Mood detection
    let mood: ThemeMood = 'calm';
    if (lowerPrompt.includes('energetic') || lowerPrompt.includes('bright') || lowerPrompt.includes('vibrant')) {
      mood = 'energetic';
    } else if (lowerPrompt.includes('calm') || lowerPrompt.includes('peaceful') || lowerPrompt.includes('relaxing')) {
      mood = 'calm';
    } else if (lowerPrompt.includes('focus') || lowerPrompt.includes('concentrated') || lowerPrompt.includes('work')) {
      mood = 'focused';
    } else if (lowerPrompt.includes('cozy') || lowerPrompt.includes('warm') || lowerPrompt.includes('comfort')) {
      mood = 'cozy';
    } else if (lowerPrompt.includes('healing') || lowerPrompt.includes('pain') || lowerPrompt.includes('gentle')) {
      mood = 'healing';
    } else if (lowerPrompt.includes('empower') || lowerPrompt.includes('strong') || lowerPrompt.includes('bold')) {
      mood = 'empowering';
    }

    return { category, mood };
  }

  // Generate color palette based on context
  private generateColorPalette(context: {
    category: ThemeCategory;
    mood: ThemeMood;
    painLevel?: number;
    timeOfDay?: string;
    accessibility?: Partial<AccessibilitySettings>;
  }): ColorPalette {
    const { category, mood, painLevel, timeOfDay, accessibility } = context;

    // Base color generation logic
    let baseHue = 270; // Default purple
    let saturation = 70;
    let lightness = 50;

    // Adjust based on category
    switch (category) {
      case 'gothic':
        baseHue = 270; // Purple
        saturation = 60;
        lightness = 45;
        break;
      case 'cyberpunk':
        baseHue = 300; // Magenta/Pink
        saturation = 80;
        lightness = 50;
        break;
      case 'cottagecore':
        baseHue = 120; // Green
        saturation = 40;
        lightness = 55;
        break;
      case 'vaporwave':
        baseHue = 300; // Pink/Purple
        saturation = 75;
        lightness = 65;
        break;
      case 'ocean':
        baseHue = 200; // Blue
        saturation = 60;
        lightness = 50;
        break;
      case 'forest':
        baseHue = 120; // Green
        saturation = 50;
        lightness = 40;
        break;
      case 'space':
        baseHue = 240; // Dark Blue
        saturation = 70;
        lightness = 30;
        break;
      case 'witchy':
        baseHue = 270; // Purple
        saturation = 50;
        lightness = 35;
        break;
      case 'pastel':
        baseHue = 330; // Pink
        saturation = 40;
        lightness = 75;
        break;
      case 'minimalist':
        saturation = 10;
        lightness = 50;
        break;
    }

    // Adjust for pain level (darker, less saturated for high pain)
    if (painLevel !== undefined) {
      if (painLevel > 7) {
        saturation = Math.max(20, saturation - 30);
        lightness = Math.max(25, lightness - 15);
      } else if (painLevel > 4) {
        saturation = Math.max(30, saturation - 15);
        lightness = Math.max(35, lightness - 10);
      }
    }

    // Adjust for time of day
    if (timeOfDay === 'night') {
      lightness = Math.max(20, lightness - 20);
    } else if (timeOfDay === 'morning') {
      lightness = Math.min(65, lightness + 10);
      saturation = Math.min(80, saturation + 10);
    }

    // High contrast mode
    if (accessibility?.highContrast) {
      saturation = 100;
      lightness = 50;
    }

    // Generate palette
    return {
      primary: this.hsl(baseHue, saturation, lightness),
      primaryLight: this.hsl(baseHue, saturation - 10, lightness + 15),
      primaryDark: this.hsl(baseHue, saturation + 10, lightness - 15),
      secondary: this.hsl((baseHue + 30) % 360, saturation - 10, lightness),
      secondaryLight: this.hsl((baseHue + 30) % 360, saturation - 20, lightness + 15),
      secondaryDark: this.hsl((baseHue + 30) % 360, saturation, lightness - 15),
      accent: this.hsl((baseHue + 180) % 360, saturation + 10, lightness + 10),
      accentLight: this.hsl((baseHue + 180) % 360, saturation, lightness + 20),
      accentDark: this.hsl((baseHue + 180) % 360, saturation + 20, lightness - 10),
      background: this.hsl(baseHue, 15, 10),
      backgroundLight: this.hsl(baseHue, 12, 15),
      backgroundDark: this.hsl(baseHue, 20, 5),
      surface: this.hsl(baseHue, 20, 15),
      surfaceLight: this.hsl(baseHue, 18, 20),
      surfaceDark: this.hsl(baseHue, 25, 12),
      text: this.hsl(baseHue, 10, 95),
      textSecondary: this.hsl(baseHue, 8, 70),
      textMuted: this.hsl(baseHue, 5, 50),
      border: this.hsl(baseHue, 25, 25),
      borderLight: this.hsl(baseHue, 20, 35),
      success: this.hsl(140, 60, 50),
      warning: this.hsl(45, 90, 55),
      error: this.hsl(0, 70, 55),
      info: this.hsl(200, 70, 55),
    };
  }

  // HSL to CSS string
  private hsl(h: number, s: number, l: number): string {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  // Generate typography settings
  private generateTypography(context: {
    category: ThemeCategory;
    accessibility?: Partial<AccessibilitySettings>;
  }): Typography {
    const { category, accessibility } = context;

    let headingFont = "'Cinzel', serif";
    let bodyFont = "'Inter', sans-serif";
    let monoFont = "'Fira Code', monospace";

    // Category-specific fonts
    switch (category) {
      case 'gothic':
        headingFont = "'Cinzel', serif";
        bodyFont = "'Cormorant Garamond', serif";
        break;
      case 'cyberpunk':
        headingFont = "'Orbitron', sans-serif";
        bodyFont = "'Rajdhani', sans-serif";
        break;
      case 'cottagecore':
        headingFont = "'Libre Baskerville', serif";
        bodyFont = "'Lora', serif";
        break;
      case 'minimalist':
        headingFont = "'Inter', sans-serif";
        bodyFont = "'Inter', sans-serif";
        break;
    }

    // Dyslexia-friendly font
    if (accessibility?.dyslexiaFont) {
      headingFont = "'OpenDyslexic', sans-serif";
      bodyFont = "'OpenDyslexic', sans-serif";
    }

    // Font size scaling
    const sizeMultiplier = accessibility?.fontSize === 'small' ? 0.875 :
                          accessibility?.fontSize === 'large' ? 1.125 :
                          accessibility?.fontSize === 'xlarge' ? 1.25 : 1;

    return {
      fontFamily: {
        heading: headingFont,
        body: bodyFont,
        monospace: monoFont,
      },
      fontSize: {
        xs: `${0.75 * sizeMultiplier}rem`,
        sm: `${0.875 * sizeMultiplier}rem`,
        base: `${1 * sizeMultiplier}rem`,
        lg: `${1.125 * sizeMultiplier}rem`,
        xl: `${1.25 * sizeMultiplier}rem`,
        '2xl': `${1.5 * sizeMultiplier}rem`,
        '3xl': `${1.875 * sizeMultiplier}rem`,
        '4xl': `${2.25 * sizeMultiplier}rem`,
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
      },
    };
  }

  private generateSpacing(): Spacing {
    return {
      unit: 4,
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
    };
  }

  private generateEffects(category: ThemeCategory): Effects {
    const roundness = category === 'minimalist' ? 'sm' :
                     category === 'cyberpunk' ? 'none' : 'md';

    return {
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
      },
      shadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      blur: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      opacity: {
        disabled: 0.5,
        hover: 0.8,
        active: 1,
      },
    };
  }

  private generateAnimations(reducedMotion?: boolean): Animations {
    return {
      duration: {
        fast: reducedMotion ? '0ms' : '150ms',
        normal: reducedMotion ? '0ms' : '300ms',
        slow: reducedMotion ? '0ms' : '500ms',
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
      },
      motionReduced: reducedMotion || false,
    };
  }

  private generateThemeDescription(category: ThemeCategory, mood: ThemeMood): string {
    return `A ${mood} ${category} theme designed for comfort and accessibility`;
  }

  private generateTags(category?: ThemeCategory, mood?: ThemeMood): string[] {
    const tags: string[] = [];
    if (category) tags.push(category);
    if (mood) tags.push(mood);
    return tags;
  }

  private generateContext(request: ThemeGenerationRequest): Theme['context'] {
    return {
      bestForPainLevel: request.painLevel ? [request.painLevel] : undefined,
      bestForMood: request.mood ? [request.mood] : undefined,
      bestForTimeOfDay: request.timeOfDay ? [request.timeOfDay] : undefined,
      bestForSeason: request.season ? [request.season] : undefined,
    };
  }

  // Pre-generated theme templates
  private createGothicTheme(): Theme {
    return {
      id: 'gothic_dark',
      name: 'Gothic Futurism',
      description: 'Deep purples and blacks with mystical undertones',
      category: 'gothic',
      mood: 'mysterious',
      colors: {
        primary: 'hsl(270, 60, 45)',
        primaryLight: 'hsl(270, 50, 60)',
        primaryDark: 'hsl(270, 70, 30)',
        secondary: 'hsl(280, 55, 45)',
        secondaryLight: 'hsl(280, 45, 60)',
        secondaryDark: 'hsl(280, 65, 30)',
        accent: 'hsl(330, 70, 55)',
        accentLight: 'hsl(330, 60, 70)',
        accentDark: 'hsl(330, 80, 40)',
        background: 'hsl(270, 15, 10)',
        backgroundLight: 'hsl(270, 12, 15)',
        backgroundDark: 'hsl(270, 20, 5)',
        surface: 'hsl(270, 20, 15)',
        surfaceLight: 'hsl(270, 18, 20)',
        surfaceDark: 'hsl(270, 25, 12)',
        text: 'hsl(270, 10, 95)',
        textSecondary: 'hsl(270, 8, 70)',
        textMuted: 'hsl(270, 5, 50)',
        border: 'hsl(270, 25, 25)',
        borderLight: 'hsl(270, 20, 35)',
        success: 'hsl(140, 60, 50)',
        warning: 'hsl(45, 90, 55)',
        error: 'hsl(0, 70, 55)',
        info: 'hsl(200, 70, 55)',
      },
      typography: this.generateTypography({ category: 'gothic' }),
      spacing: this.generateSpacing(),
      effects: this.generateEffects('gothic'),
      animations: this.generateAnimations(false),
      accessibility: {
        highContrast: false,
        colorblindMode: 'none',
        dyslexiaFont: false,
        reducedMotion: false,
        fontSize: 'normal',
        focusVisible: true,
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1,
        author: 'System',
        tags: ['gothic', 'dark', 'purple', 'mysterious'],
        isCustom: false,
        isFavorite: false,
        usageCount: 0,
      },
      context: {
        bestForPainLevel: [1, 2, 3, 4, 5],
        bestForMood: ['focused', 'calm', 'mysterious'],
        bestForTimeOfDay: ['evening', 'night'],
      },
    };
  }

  private createCyberpunkTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'cyberpunk_neon',
      name: 'Cyberpunk Neon',
      description: 'High-tech neon colors with dark backgrounds',
      category: 'cyberpunk',
      mood: 'energetic',
      colors: {
        ...base.colors,
        primary: 'hsl(300, 80, 50)',
        accent: 'hsl(180, 80, 50)',
        background: 'hsl(0, 0, 5)',
      },
      metadata: {
        ...base.metadata,
        tags: ['cyberpunk', 'neon', 'futuristic', 'energetic'],
      },
    };
  }

  private createCottagecoreTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'cottagecore_cozy',
      name: 'Cottagecore Cozy',
      description: 'Warm, natural tones for a peaceful atmosphere',
      category: 'cottagecore',
      mood: 'cozy',
      colors: {
        ...base.colors,
        primary: 'hsl(120, 40, 55)',
        secondary: 'hsl(35, 60, 60)',
        accent: 'hsl(15, 70, 60)',
        background: 'hsl(40, 20, 95)',
        surface: 'hsl(40, 25, 90)',
        text: 'hsl(30, 10, 20)',
        textSecondary: 'hsl(30, 8, 40)',
      },
      metadata: {
        ...base.metadata,
        tags: ['cottagecore', 'cozy', 'natural', 'warm'],
      },
    };
  }

  private createVaporwaveTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'vaporwave_aesthetic',
      name: 'Vaporwave Aesthetic',
      description: 'Retro-futuristic pastels and gradients',
      category: 'vaporwave',
      mood: 'dreamy',
      colors: {
        ...base.colors,
        primary: 'hsl(300, 75, 65)',
        secondary: 'hsl(180, 70, 60)',
        accent: 'hsl(60, 80, 65)',
        background: 'hsl(280, 30, 20)',
      },
      metadata: {
        ...base.metadata,
        tags: ['vaporwave', 'retro', 'pastel', 'aesthetic'],
      },
    };
  }

  private createMinimalistTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'minimalist_clean',
      name: 'Minimalist Clean',
      description: 'Simple, clean design with focus on content',
      category: 'minimalist',
      mood: 'focused',
      colors: {
        ...base.colors,
        primary: 'hsl(0, 0, 20)',
        secondary: 'hsl(0, 0, 40)',
        accent: 'hsl(210, 100, 50)',
        background: 'hsl(0, 0, 100)',
        surface: 'hsl(0, 0, 98)',
        text: 'hsl(0, 0, 10)',
        textSecondary: 'hsl(0, 0, 40)',
      },
      metadata: {
        ...base.metadata,
        tags: ['minimalist', 'clean', 'simple', 'focused'],
      },
    };
  }

  private createOceanTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'ocean_depths',
      name: 'Ocean Depths',
      description: 'Deep blues and teals like the ocean',
      category: 'ocean',
      mood: 'calm',
      colors: {
        ...base.colors,
        primary: 'hsl(200, 60, 50)',
        secondary: 'hsl(180, 55, 45)',
        accent: 'hsl(190, 70, 60)',
        background: 'hsl(210, 40, 12)',
      },
      context: {
        bestForPainLevel: [1, 2, 3, 4, 5, 6],
        bestForMood: ['calm', 'peaceful', 'healing'],
      },
      metadata: {
        ...base.metadata,
        tags: ['ocean', 'blue', 'calm', 'peaceful'],
      },
    };
  }

  private createForestTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'forest_mystique',
      name: 'Forest Mystique',
      description: 'Deep greens and earth tones',
      category: 'forest',
      mood: 'healing',
      colors: {
        ...base.colors,
        primary: 'hsl(120, 50, 40)',
        secondary: 'hsl(140, 45, 45)',
        accent: 'hsl(90, 60, 50)',
        background: 'hsl(120, 25, 15)',
      },
      metadata: {
        ...base.metadata,
        tags: ['forest', 'green', 'nature', 'healing'],
      },
    };
  }

  private createNeonTheme(): Theme {
    const base = this.createCyberpunkTheme();
    return {
      ...base,
      id: 'neon_dreams',
      name: 'Neon Dreams',
      description: 'Bright neon colors on dark backgrounds',
      category: 'neon',
      mood: 'energetic',
      metadata: {
        ...base.metadata,
        tags: ['neon', 'bright', 'energetic', 'vibrant'],
      },
    };
  }

  private createPastelTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'pastel_dreams',
      name: 'Pastel Dreams',
      description: 'Soft, gentle pastel colors',
      category: 'pastel',
      mood: 'gentle',
      colors: {
        ...base.colors,
        primary: 'hsl(330, 40, 75)',
        secondary: 'hsl(200, 35, 75)',
        accent: 'hsl(60, 40, 75)',
        background: 'hsl(300, 20, 95)',
        surface: 'hsl(300, 15, 90)',
        text: 'hsl(300, 10, 20)',
      },
      context: {
        bestForPainLevel: [1, 2, 3, 4, 5, 6, 7],
        bestForMood: ['gentle', 'calm', 'healing'],
      },
      metadata: {
        ...base.metadata,
        tags: ['pastel', 'soft', 'gentle', 'healing'],
      },
    };
  }

  private createWitchyTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'witchy_mystical',
      name: 'Witchy Mystical',
      description: 'Mystical purples and dark greens',
      category: 'witchy',
      mood: 'mysterious',
      colors: {
        ...base.colors,
        primary: 'hsl(270, 50, 35)',
        secondary: 'hsl(140, 40, 30)',
        accent: 'hsl(280, 60, 50)',
      },
      metadata: {
        ...base.metadata,
        tags: ['witchy', 'mystical', 'magic', 'mysterious'],
      },
    };
  }

  private createEtherealTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'ethereal_light',
      name: 'Ethereal Light',
      description: 'Light, airy colors with soft gradients',
      category: 'ethereal',
      mood: 'dreamy',
      colors: {
        ...base.colors,
        primary: 'hsl(200, 50, 70)',
        secondary: 'hsl(280, 45, 75)',
        accent: 'hsl(340, 50, 75)',
        background: 'hsl(220, 30, 95)',
        text: 'hsl(220, 10, 25)',
      },
      metadata: {
        ...base.metadata,
        tags: ['ethereal', 'light', 'dreamy', 'soft'],
      },
    };
  }

  private createIndustrialTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'industrial_metal',
      name: 'Industrial Metal',
      description: 'Dark grays and metallic accents',
      category: 'industrial',
      mood: 'serious',
      colors: {
        ...base.colors,
        primary: 'hsl(0, 0, 30)',
        secondary: 'hsl(200, 10, 40)',
        accent: 'hsl(30, 60, 50)',
        background: 'hsl(0, 0, 10)',
      },
      metadata: {
        ...base.metadata,
        tags: ['industrial', 'metal', 'dark', 'serious'],
      },
    };
  }

  private createRetroTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'retro_vintage',
      name: 'Retro Vintage',
      description: 'Warm retro colors from the 70s',
      category: 'retro',
      mood: 'playful',
      colors: {
        ...base.colors,
        primary: 'hsl(30, 70, 50)',
        secondary: 'hsl(45, 80, 55)',
        accent: 'hsl(10, 75, 55)',
        background: 'hsl(40, 30, 90)',
        text: 'hsl(30, 10, 20)',
      },
      metadata: {
        ...base.metadata,
        tags: ['retro', 'vintage', '70s', 'playful'],
      },
    };
  }

  private createSpaceTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'space_cosmic',
      name: 'Space Cosmic',
      description: 'Deep space blacks with cosmic purples',
      category: 'space',
      mood: 'mysterious',
      colors: {
        ...base.colors,
        primary: 'hsl(240, 70, 30)',
        secondary: 'hsl(260, 65, 35)',
        accent: 'hsl(280, 70, 50)',
        background: 'hsl(240, 40, 5)',
      },
      metadata: {
        ...base.metadata,
        tags: ['space', 'cosmic', 'galaxy', 'mysterious'],
      },
    };
  }

  private createDesertTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'desert_warmth',
      name: 'Desert Warmth',
      description: 'Warm desert tones and sandy colors',
      category: 'desert',
      mood: 'cozy',
      colors: {
        ...base.colors,
        primary: 'hsl(30, 60, 50)',
        secondary: 'hsl(45, 70, 55)',
        accent: 'hsl(15, 75, 50)',
        background: 'hsl(35, 40, 90)',
        text: 'hsl(30, 10, 20)',
      },
      metadata: {
        ...base.metadata,
        tags: ['desert', 'warm', 'sandy', 'cozy'],
      },
    };
  }

  private createMigraineSafeTheme(): Theme {
    const base = this.createGothicTheme();
    return {
      ...base,
      id: 'migraine_safe',
      name: 'Migraine Safe',
      description: 'Low contrast, muted colors for migraine relief',
      category: 'minimalist',
      mood: 'healing',
      colors: {
        ...base.colors,
        primary: 'hsl(0, 0, 40)',
        secondary: 'hsl(0, 0, 50)',
        accent: 'hsl(200, 20, 50)',
        background: 'hsl(0, 0, 15)',
        surface: 'hsl(0, 0, 18)',
        text: 'hsl(0, 0, 70)',
        textSecondary: 'hsl(0, 0, 55)',
      },
      animations: this.generateAnimations(true),
      context: {
        bestForPainLevel: [7, 8, 9, 10],
        bestForMood: ['healing', 'calm'],
      },
      metadata: {
        ...base.metadata,
        tags: ['migraine', 'low-contrast', 'healing', 'accessible'],
      },
    };
  }

  private createHighPainTheme(): Theme {
    const base = this.createMigraineSafeTheme();
    return {
      ...base,
      id: 'high_pain_comfort',
      name: 'High Pain Comfort',
      description: 'Ultra-gentle theme for high pain days',
      category: 'minimalist',
      mood: 'healing',
      animations: this.generateAnimations(true),
      context: {
        bestForPainLevel: [8, 9, 10],
        bestForMood: ['healing', 'gentle'],
      },
      metadata: {
        ...base.metadata,
        tags: ['high-pain', 'comfort', 'healing', 'gentle'],
      },
    };
  }

  private createAnxietyCalmTheme(): Theme {
    const base = this.createOceanTheme();
    return {
      ...base,
      id: 'anxiety_calm',
      name: 'Anxiety Calm',
      description: 'Soothing blues and greens for anxiety relief',
      category: 'ocean',
      mood: 'calm',
      colors: {
        ...base.colors,
        primary: 'hsl(180, 40, 50)',
        secondary: 'hsl(200, 35, 55)',
        accent: 'hsl(140, 40, 55)',
      },
      context: {
        bestForMood: ['calm', 'peaceful', 'healing'],
      },
      metadata: {
        ...base.metadata,
        tags: ['anxiety', 'calm', 'soothing', 'peaceful'],
      },
    };
  }

  private createFocusModeTheme(): Theme {
    const base = this.createMinimalistTheme();
    return {
      ...base,
      id: 'focus_mode',
      name: 'Focus Mode',
      description: 'Minimal distractions for maximum focus',
      category: 'minimalist',
      mood: 'focused',
      colors: {
        ...base.colors,
        primary: 'hsl(210, 100, 50)',
        accent: 'hsl(210, 80, 45)',
      },
      context: {
        bestForActivity: ['work', 'study', 'learning'],
        bestForMood: ['focused'],
      },
      metadata: {
        ...base.metadata,
        tags: ['focus', 'minimal', 'productive', 'work'],
      },
    };
  }

  private createHealingTheme(): Theme {
    const base = this.createPastelTheme();
    return {
      ...base,
      id: 'healing_gentle',
      name: 'Healing Gentle',
      description: 'Soft, healing colors for recovery',
      category: 'pastel',
      mood: 'healing',
      context: {
        bestForPainLevel: [1, 2, 3, 4, 5, 6, 7],
        bestForMood: ['healing', 'gentle', 'calm'],
      },
      metadata: {
        ...base.metadata,
        tags: ['healing', 'gentle', 'recovery', 'soft'],
      },
    };
  }

  // Get all preset themes
  getPresetThemes(): Theme[] {
    return this.presetThemes;
  }

  // Get theme by ID
  async getThemeById(id: string): Promise<Theme | null> {
    // Check presets first
    const preset = this.presetThemes.find(t => t.id === id);
    if (preset) return preset;

    // Check database
    return await this.loadTheme(id);
  }

  // Apply theme
  async applyTheme(theme: Theme): Promise<void> {
    this.currentTheme = theme;
    await this.saveCurrentThemeId(theme.id);

    // Apply to DOM
    this.applyThemeToDOM(theme);

    // Increment usage count
    theme.metadata.usageCount++;
    await this.saveTheme(theme);

    // Log evolution
    await db.logEvolution('Theme applied', 'theming', { themeId: theme.id, themeName: theme.name });
  }

  // Apply theme to DOM
  private applyThemeToDOM(theme: Theme): void {
    const root = document.documentElement;

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${this.kebabCase(key)}`, value);
    });

    // Apply typography
    root.style.setProperty('--font-heading', theme.typography.fontFamily.heading);
    root.style.setProperty('--font-body', theme.typography.fontFamily.body);
    root.style.setProperty('--font-mono', theme.typography.fontFamily.monospace);

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      if (key !== 'unit') {
        root.style.setProperty(`--spacing-${key}`, value);
      }
    });

    // Apply border radius
    Object.entries(theme.effects.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Apply shadows
    Object.entries(theme.effects.shadow).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply animation durations
    Object.entries(theme.animations.duration).forEach(([key, value]) => {
      root.style.setProperty(`--duration-${key}`, value);
    });
  }

  private kebabCase(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  // Auto-evolution system
  private startAutoEvolution(): void {
    // Daily subtle changes
    setInterval(() => {
      if (this.evolutionConfig.enabled && this.evolutionConfig.dailyChangeIntensity > 0) {
        this.evolveThemeSubtly();
      }
    }, 24 * 60 * 60 * 1000); // Daily

    // Circadian rhythm adaptation
    if (this.evolutionConfig.circadianRhythm) {
      setInterval(() => {
        this.adaptToTimeOfDay();
      }, 60 * 60 * 1000); // Hourly
    }
  }

  private async evolveThemeSubtly(): Promise<void> {
    if (!this.currentTheme) return;

    // Small color shifts based on evolution intensity
    const intensity = this.evolutionConfig.dailyChangeIntensity;

    // This would implement subtle color palette evolution
    console.log(`Evolving theme subtly with intensity ${intensity}`);

    await db.logEvolution('Theme evolved', 'theming', { intensity });
  }

  private async adaptToTimeOfDay(): Promise<void> {
    if (!this.currentTheme) return;

    const hour = new Date().getHours();
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';

    if (hour >= 5 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    console.log(`Adapting theme for ${timeOfDay}`);
  }

  // Context-aware theme selection
  async suggestThemeForContext(context: {
    painLevel?: number;
    mood?: string;
    activity?: string;
  }): Promise<Theme[]> {
    const suggestions: Theme[] = [];

    // Filter themes by context
    for (const theme of this.presetThemes) {
      let score = 0;

      if (context.painLevel && theme.context.bestForPainLevel) {
        if (theme.context.bestForPainLevel.includes(context.painLevel)) {
          score += 10;
        }
      }

      if (context.mood && theme.context.bestForMood) {
        if (theme.context.bestForMood.includes(context.mood)) {
          score += 5;
        }
      }

      if (context.activity && theme.context.bestForActivity) {
        if (theme.context.bestForActivity.includes(context.activity)) {
          score += 5;
        }
      }

      if (score > 0) {
        suggestions.push(theme);
      }
    }

    // Sort by usage count and score
    suggestions.sort((a, b) => b.metadata.usageCount - a.metadata.usageCount);

    return suggestions.slice(0, 5);
  }

  // Database operations
  private async saveTheme(theme: Theme): Promise<void> {
    const themes = await this.getAllThemes();
    const existing = themes.find(t => t.id === theme.id);

    if (existing) {
      localStorage.setItem(`theme_${theme.id}`, JSON.stringify(theme));
    } else {
      localStorage.setItem(`theme_${theme.id}`, JSON.stringify(theme));
    }
  }

  private async loadTheme(id: string): Promise<Theme | null> {
    const stored = localStorage.getItem(`theme_${id}`);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  }

  private async getAllThemes(): Promise<Theme[]> {
    const themes: Theme[] = [...this.presetThemes];

    // Load custom themes from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('theme_')) {
        const stored = localStorage.getItem(key);
        if (stored) {
          themes.push(JSON.parse(stored));
        }
      }
    }

    return themes;
  }

  private async saveCurrentThemeId(id: string): Promise<void> {
    localStorage.setItem('current_theme_id', id);
  }

  private async getSavedThemeId(): Promise<string | null> {
    return localStorage.getItem('current_theme_id');
  }

  getCurrentTheme(): Theme | null {
    return this.currentTheme;
  }

  // Export/Import themes
  exportTheme(theme: Theme): string {
    return JSON.stringify(theme, null, 2);
  }

  importTheme(jsonString: string): Theme {
    return JSON.parse(jsonString);
  }

  // Toggle favorite
  async toggleFavorite(themeId: string): Promise<void> {
    const theme = await this.getThemeById(themeId);
    if (theme) {
      theme.metadata.isFavorite = !theme.metadata.isFavorite;
      await this.saveTheme(theme);
    }
  }

  // Get favorites
  async getFavoriteThemes(): Promise<Theme[]> {
    const allThemes = await this.getAllThemes();
    return allThemes.filter(t => t.metadata.isFavorite);
  }
}

export const themeGenerator = new ThemeGeneratorService();
export default themeGenerator;
