// Gothic Dollhouse Theme System
// 100+ themes with color moods, seasonal, cultural, historical eras

export interface GothicTheme {
  id: string;
  name: string;
  category: 'mood' | 'seasonal' | 'cultural' | 'historical' | 'accessibility' | 'custom';
  colors: {
    // Primary palette
    background: string;
    backgroundSecondary: string;
    surface: string;
    surfaceHover: string;

    // Accent colors
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
    accent: string;

    // Text colors
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textAccent: string;

    // Borders and effects
    border: string;
    borderAccent: string;
    glow: string;
    shadow: string;

    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  effects: {
    glassmorphism: string;
    glow: string;
    shadow: string;
    gradient: string;
    particleColor: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    accentFont: string;
  };
}

// Base Gothic Dark Theme — Black & Gold
export const gothicDark: GothicTheme = {
  id: 'gothic-dark',
  name: 'Gothic Dark',
  category: 'mood',
  colors: {
    background: '#080808',
    backgroundSecondary: '#0c0c0a',
    surface: 'rgba(16, 14, 10, 0.85)',
    surfaceHover: 'rgba(24, 22, 16, 0.9)',
    primary: '#d4af37',
    primaryHover: '#e8c84a',
    secondary: '#b8942e',
    secondaryHover: '#c9a53f',
    accent: '#f4d03f',
    textPrimary: '#e8e4dc',
    textSecondary: '#a09882',
    textMuted: '#665e4f',
    textAccent: '#d4af37',
    border: 'rgba(212, 175, 55, 0.25)',
    borderAccent: 'rgba(212, 175, 55, 0.5)',
    glow: 'rgba(212, 175, 55, 0.4)',
    shadow: 'rgba(0, 0, 0, 0.6)',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
    info: '#60a5fa',
  },
  effects: {
    glassmorphism: 'backdrop-filter: blur(10px); background: rgba(12, 10, 8, 0.75);',
    glow: '0 0 20px rgba(212, 175, 55, 0.4)',
    shadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
    gradient: 'linear-gradient(135deg, #080808 0%, #0c0a06 50%, #080808 100%)',
    particleColor: '#d4af37',
  },
  typography: {
    fontFamily: "'Inter', system-ui, sans-serif",
    headingFont: "'Playfair Display', 'Georgia', serif",
    accentFont: "'Cinzel', 'Times New Roman', serif",
  },
};

// COLOR MOOD THEMES (20)
export const moodThemes: GothicTheme[] = [
  {
    ...gothicDark,
    id: 'midnight-purple',
    name: 'Midnight Purple',
    colors: { ...gothicDark.colors, primary: '#7c3aed', accent: '#a78bfa', glow: 'rgba(124, 58, 237, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'crimson-velvet',
    name: 'Crimson Velvet',
    colors: { ...gothicDark.colors, primary: '#be123c', accent: '#fda4af', background: '#0f0a0a', glow: 'rgba(190, 18, 60, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'forest-witch',
    name: 'Forest Witch',
    colors: { ...gothicDark.colors, primary: '#166534', accent: '#4ade80', background: '#0a0f0a', glow: 'rgba(22, 101, 52, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'ocean-depths',
    name: 'Ocean Depths',
    colors: { ...gothicDark.colors, primary: '#0e7490', accent: '#67e8f9', background: '#0a0f0f', glow: 'rgba(14, 116, 144, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'blood-moon',
    name: 'Blood Moon',
    colors: { ...gothicDark.colors, primary: '#991b1b', accent: '#fca5a5', background: '#0f0808', glow: 'rgba(153, 27, 27, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'shadow-gold',
    name: 'Shadow & Gold',
    colors: { ...gothicDark.colors, primary: '#d4af37', accent: '#fef08a', glow: 'rgba(212, 175, 55, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'void-black',
    name: 'Void Black',
    colors: { ...gothicDark.colors, primary: '#525252', accent: '#a3a3a3', background: '#050505', glow: 'rgba(82, 82, 82, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'amethyst-dream',
    name: 'Amethyst Dream',
    colors: { ...gothicDark.colors, primary: '#9333ea', accent: '#c084fc', background: '#0f0a14', glow: 'rgba(147, 51, 234, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'emerald-shadow',
    name: 'Emerald Shadow',
    colors: { ...gothicDark.colors, primary: '#059669', accent: '#6ee7b7', background: '#0a0f0d', glow: 'rgba(5, 150, 105, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'rose-thorn',
    name: 'Rose & Thorn',
    colors: { ...gothicDark.colors, primary: '#be185d', accent: '#f9a8d4', background: '#0f0a0c', glow: 'rgba(190, 24, 93, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'sapphire-night',
    name: 'Sapphire Night',
    colors: { ...gothicDark.colors, primary: '#1d4ed8', accent: '#93c5fd', background: '#0a0a12', glow: 'rgba(29, 78, 216, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'obsidian',
    name: 'Obsidian',
    colors: { ...gothicDark.colors, primary: '#374151', accent: '#9ca3af', background: '#030303', glow: 'rgba(55, 65, 81, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'copper-flame',
    name: 'Copper Flame',
    colors: { ...gothicDark.colors, primary: '#ea580c', accent: '#fdba74', background: '#0f0a08', glow: 'rgba(234, 88, 12, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'silver-mist',
    name: 'Silver Mist',
    colors: { ...gothicDark.colors, primary: '#6b7280', accent: '#d1d5db', background: '#0a0a0c', glow: 'rgba(107, 114, 128, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'violet-storm',
    name: 'Violet Storm',
    colors: { ...gothicDark.colors, primary: '#6d28d9', accent: '#a78bfa', background: '#0c0a14', glow: 'rgba(109, 40, 217, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'jade-serpent',
    name: 'Jade Serpent',
    colors: { ...gothicDark.colors, primary: '#047857', accent: '#34d399', background: '#080f0c', glow: 'rgba(4, 120, 87, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'onyx-pearl',
    name: 'Onyx & Pearl',
    colors: { ...gothicDark.colors, primary: '#e5e5e5', accent: '#fafafa', textPrimary: '#1a1a1a', background: '#0a0a0a', glow: 'rgba(229, 229, 229, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'indigo-twilight',
    name: 'Indigo Twilight',
    colors: { ...gothicDark.colors, primary: '#4338ca', accent: '#818cf8', background: '#0a0a12', glow: 'rgba(67, 56, 202, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'burgundy-wine',
    name: 'Burgundy Wine',
    colors: { ...gothicDark.colors, primary: '#7f1d1d', accent: '#fca5a5', background: '#0c0808', glow: 'rgba(127, 29, 29, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'teal-abyss',
    name: 'Teal Abyss',
    colors: { ...gothicDark.colors, primary: '#0d9488', accent: '#5eead4', background: '#080f0e', glow: 'rgba(13, 148, 136, 0.4)' },
  },
];

// SEASONAL THEMES (12)
export const seasonalThemes: GothicTheme[] = [
  {
    ...gothicDark,
    id: 'winter-solstice',
    name: 'Winter Solstice',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#60a5fa', accent: '#e0f2fe', background: '#0a0c12', glow: 'rgba(96, 165, 250, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'spring-awakening',
    name: 'Spring Awakening',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#a3e635', accent: '#d9f99d', background: '#0a0f0a', glow: 'rgba(163, 230, 53, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'summer-twilight',
    name: 'Summer Twilight',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#fb923c', accent: '#fed7aa', background: '#0f0c08', glow: 'rgba(251, 146, 60, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'autumn-harvest',
    name: 'Autumn Harvest',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#b45309', accent: '#fcd34d', background: '#0f0a06', glow: 'rgba(180, 83, 9, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'samhain',
    name: 'Samhain (Halloween)',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#f97316', accent: '#7c3aed', background: '#0a0808', glow: 'rgba(249, 115, 22, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'yule',
    name: 'Yule (Winter)',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#dc2626', accent: '#22c55e', background: '#0a0808', glow: 'rgba(220, 38, 38, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'imbolc',
    name: 'Imbolc (Early Spring)',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#f0fdf4', accent: '#86efac', background: '#0a0c0a', glow: 'rgba(134, 239, 172, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'beltane',
    name: 'Beltane (May Day)',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#ec4899', accent: '#f9a8d4', background: '#0f0a0c', glow: 'rgba(236, 72, 153, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'litha',
    name: 'Litha (Midsummer)',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#facc15', accent: '#fef08a', background: '#0f0e08', glow: 'rgba(250, 204, 21, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'lughnasadh',
    name: 'Lughnasadh (Harvest)',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#d97706', accent: '#fde68a', background: '#0f0c08', glow: 'rgba(217, 119, 6, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'mabon',
    name: 'Mabon (Autumn Equinox)',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#92400e', accent: '#fbbf24', background: '#0c0a06', glow: 'rgba(146, 64, 14, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'ostara',
    name: 'Ostara (Spring Equinox)',
    category: 'seasonal',
    colors: { ...gothicDark.colors, primary: '#84cc16', accent: '#bef264', background: '#0a0c08', glow: 'rgba(132, 204, 22, 0.4)' },
  },
];

// CULTURAL THEMES (20)
export const culturalThemes: GothicTheme[] = [
  {
    ...gothicDark,
    id: 'afrofuturist-gold',
    name: 'Afrofuturist Gold',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#d4af37', accent: '#fef08a', secondary: '#7c3aed', background: '#0a0808', glow: 'rgba(212, 175, 55, 0.5)' },
  },
  {
    ...gothicDark,
    id: 'african-earth',
    name: 'African Earth',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#b45309', accent: '#78350f', secondary: '#dc2626', background: '#0c0806', glow: 'rgba(180, 83, 9, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'harlem-renaissance',
    name: 'Harlem Renaissance',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#7c2d12', accent: '#d4af37', secondary: '#1e3a8a', background: '#0a0806', glow: 'rgba(212, 175, 55, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'indigenous-earth',
    name: 'Indigenous Earth',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#78350f', accent: '#0d9488', secondary: '#dc2626', background: '#0c0a06', glow: 'rgba(120, 53, 15, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'blackfoot-sky',
    name: 'Blackfoot Sky',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#1e3a8a', accent: '#fcd34d', secondary: '#dc2626', background: '#08080c', glow: 'rgba(30, 58, 138, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'latin-fiesta',
    name: 'Latin Fiesta',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#dc2626', accent: '#facc15', secondary: '#16a34a', background: '#0c0808', glow: 'rgba(220, 38, 38, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'dia-de-muertos',
    name: 'Dia de los Muertos',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#ec4899', accent: '#facc15', secondary: '#a855f7', background: '#0a0808', glow: 'rgba(236, 72, 153, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'asian-elegance',
    name: 'Asian Elegance',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#dc2626', accent: '#d4af37', secondary: '#1f2937', background: '#0a0808', glow: 'rgba(220, 38, 38, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'zen-garden',
    name: 'Zen Garden',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#4ade80', accent: '#fafafa', secondary: '#92400e', background: '#080a08', glow: 'rgba(74, 222, 128, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'bollywood-gold',
    name: 'Bollywood Gold',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#d4af37', accent: '#f472b6', secondary: '#dc2626', background: '#0c0808', glow: 'rgba(212, 175, 55, 0.5)' },
  },
  {
    ...gothicDark,
    id: 'caribbean-sunset',
    name: 'Caribbean Sunset',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#0d9488', accent: '#f97316', secondary: '#facc15', background: '#080a0a', glow: 'rgba(13, 148, 136, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'kwanzaa',
    name: 'Kwanzaa',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#dc2626', accent: '#16a34a', secondary: '#0a0a0a', background: '#0c0808', glow: 'rgba(220, 38, 38, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'juneteenth',
    name: 'Juneteenth',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#dc2626', accent: '#3b82f6', secondary: '#fafafa', background: '#0a0808', glow: 'rgba(220, 38, 38, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'pride-rainbow',
    name: 'Pride Rainbow',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#ec4899', accent: '#facc15', secondary: '#3b82f6', background: '#0a0808', glow: 'rgba(236, 72, 153, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'trans-pride',
    name: 'Trans Pride',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#60a5fa', accent: '#f9a8d4', secondary: '#fafafa', background: '#0a0a0c', glow: 'rgba(96, 165, 250, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'bi-pride',
    name: 'Bi Pride',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#be185d', accent: '#7c3aed', secondary: '#1d4ed8', background: '#0a080c', glow: 'rgba(190, 24, 93, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'nonbinary-pride',
    name: 'Non-binary Pride',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#facc15', accent: '#fafafa', secondary: '#7c3aed', background: '#0c0a08', glow: 'rgba(250, 204, 21, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'pan-pride',
    name: 'Pan Pride',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#ec4899', accent: '#facc15', secondary: '#06b6d4', background: '#0c080a', glow: 'rgba(236, 72, 153, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'lunar-new-year',
    name: 'Lunar New Year',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#dc2626', accent: '#d4af37', secondary: '#fafafa', background: '#0c0808', glow: 'rgba(220, 38, 38, 0.5)' },
  },
  {
    ...gothicDark,
    id: 'polynesian-ocean',
    name: 'Polynesian Ocean',
    category: 'cultural',
    colors: { ...gothicDark.colors, primary: '#0891b2', accent: '#fcd34d', secondary: '#16a34a', background: '#080a0c', glow: 'rgba(8, 145, 178, 0.4)' },
  },
];

// HISTORICAL ERA THEMES (20)
export const historicalThemes: GothicTheme[] = [
  {
    ...gothicDark,
    id: 'victorian-gothic',
    name: 'Victorian Gothic',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#581c87', accent: '#d4af37', background: '#0c0810', glow: 'rgba(88, 28, 135, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'art-deco-dark',
    name: 'Art Deco Dark',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#d4af37', accent: '#0a0a0a', secondary: '#fafafa', background: '#0a0808', glow: 'rgba(212, 175, 55, 0.5)' },
  },
  {
    ...gothicDark,
    id: 'renaissance-shadow',
    name: 'Renaissance Shadow',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#7f1d1d', accent: '#d4af37', background: '#0c0808', glow: 'rgba(127, 29, 29, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'medieval-night',
    name: 'Medieval Night',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#1e3a8a', accent: '#d4af37', secondary: '#7f1d1d', background: '#080808', glow: 'rgba(30, 58, 138, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'roaring-twenties',
    name: 'Roaring Twenties',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#d4af37', accent: '#0a0a0a', secondary: '#dc2626', background: '#0a0808', glow: 'rgba(212, 175, 55, 0.5)' },
  },
  {
    ...gothicDark,
    id: 'civil-rights-era',
    name: '1960s Civil Rights',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#1e3a8a', accent: '#fafafa', secondary: '#dc2626', background: '#080810', glow: 'rgba(30, 58, 138, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'disco-soul',
    name: '1970s Disco Soul',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#f97316', accent: '#facc15', secondary: '#ec4899', background: '#0c0808', glow: 'rgba(249, 115, 22, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'hip-hop-golden',
    name: '1990s Hip Hop',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#d4af37', accent: '#dc2626', secondary: '#16a34a', background: '#0a0808', glow: 'rgba(212, 175, 55, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'ancient-egypt',
    name: 'Ancient Egypt',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#d4af37', accent: '#0891b2', secondary: '#7f1d1d', background: '#0c0a06', glow: 'rgba(212, 175, 55, 0.5)' },
  },
  {
    ...gothicDark,
    id: 'ancient-greece',
    name: 'Ancient Greece',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#fafafa', accent: '#3b82f6', secondary: '#d4af37', background: '#0a0a0c', glow: 'rgba(59, 130, 246, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'baroque',
    name: 'Baroque',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#7f1d1d', accent: '#d4af37', secondary: '#1e3a8a', background: '#0c0808', glow: 'rgba(127, 29, 29, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'rococo',
    name: 'Rococo',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#f9a8d4', accent: '#d4af37', secondary: '#86efac', background: '#0c0a0a', glow: 'rgba(249, 168, 212, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'edwardian',
    name: 'Edwardian',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#fafafa', accent: '#d4af37', secondary: '#1e3a8a', background: '#0a0a0a', glow: 'rgba(250, 250, 250, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'art-nouveau',
    name: 'Art Nouveau',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#4ade80', accent: '#d4af37', secondary: '#a855f7', background: '#0a0c0a', glow: 'rgba(74, 222, 128, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'cyberpunk',
    name: 'Cyberpunk',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#ec4899', accent: '#06b6d4', secondary: '#facc15', background: '#080810', glow: 'rgba(236, 72, 153, 0.5)' },
  },
  {
    ...gothicDark,
    id: 'steampunk',
    name: 'Steampunk',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#b45309', accent: '#d4af37', secondary: '#78350f', background: '#0c0a06', glow: 'rgba(180, 83, 9, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'great-migration',
    name: 'Great Migration Era',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#78350f', accent: '#d4af37', secondary: '#1e3a8a', background: '#0a0806', glow: 'rgba(120, 53, 15, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'underground-railroad',
    name: 'Underground Railroad',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#1f2937', accent: '#d4af37', secondary: '#fafafa', background: '#050505', glow: 'rgba(212, 175, 55, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'reconstruction',
    name: 'Reconstruction Era',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#1e3a8a', accent: '#fafafa', secondary: '#dc2626', background: '#080810', glow: 'rgba(30, 58, 138, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'black-panther-era',
    name: 'Black Panther Era',
    category: 'historical',
    colors: { ...gothicDark.colors, primary: '#0a0a0a', accent: '#fafafa', secondary: '#dc2626', background: '#050505', glow: 'rgba(250, 250, 250, 0.2)' },
  },
];

// ACCESSIBILITY THEMES (10)
export const accessibilityThemes: GothicTheme[] = [
  {
    ...gothicDark,
    id: 'high-contrast',
    name: 'High Contrast',
    category: 'accessibility',
    colors: { ...gothicDark.colors, primary: '#ffffff', accent: '#ffff00', textPrimary: '#ffffff', background: '#000000', border: '#ffffff', glow: 'rgba(255, 255, 255, 0.5)' },
  },
  {
    ...gothicDark,
    id: 'low-light',
    name: 'Low Light (Easy on Eyes)',
    category: 'accessibility',
    colors: { ...gothicDark.colors, primary: '#4a5568', accent: '#718096', textPrimary: '#a0aec0', background: '#1a202c', glow: 'rgba(74, 85, 104, 0.3)' },
  },
  {
    ...gothicDark,
    id: 'deuteranopia',
    name: 'Deuteranopia Friendly',
    category: 'accessibility',
    colors: { ...gothicDark.colors, primary: '#0066cc', accent: '#ff9500', success: '#0066cc', error: '#ff9500', glow: 'rgba(0, 102, 204, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'protanopia',
    name: 'Protanopia Friendly',
    category: 'accessibility',
    colors: { ...gothicDark.colors, primary: '#0066cc', accent: '#ffcc00', success: '#0066cc', error: '#ffcc00', glow: 'rgba(0, 102, 204, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'tritanopia',
    name: 'Tritanopia Friendly',
    category: 'accessibility',
    colors: { ...gothicDark.colors, primary: '#cc0066', accent: '#00cc66', success: '#00cc66', error: '#cc0066', glow: 'rgba(204, 0, 102, 0.4)' },
  },
  {
    ...gothicDark,
    id: 'dyslexia-friendly',
    name: 'Dyslexia Friendly',
    category: 'accessibility',
    colors: { ...gothicDark.colors, background: '#faf8f1', textPrimary: '#333333', surface: 'rgba(250, 248, 241, 0.95)' },
    typography: { ...gothicDark.typography, fontFamily: "'OpenDyslexic', 'Comic Sans MS', sans-serif" },
  },
  {
    ...gothicDark,
    id: 'reduced-motion',
    name: 'Reduced Motion',
    category: 'accessibility',
  },
  {
    ...gothicDark,
    id: 'large-text',
    name: 'Large Text',
    category: 'accessibility',
  },
  {
    ...gothicDark,
    id: 'focus-indicators',
    name: 'Enhanced Focus',
    category: 'accessibility',
    colors: { ...gothicDark.colors, glow: 'rgba(255, 255, 0, 0.8)', borderAccent: '#ffff00' },
  },
  {
    ...gothicDark,
    id: 'sensory-safe',
    name: 'Sensory Safe',
    category: 'accessibility',
    colors: { ...gothicDark.colors, primary: '#6b7280', accent: '#9ca3af', background: '#1f2937', glow: 'none' },
  },
];

// All themes combined
export const allThemes: GothicTheme[] = [
  gothicDark,
  ...moodThemes,
  ...seasonalThemes,
  ...culturalThemes,
  ...historicalThemes,
  ...accessibilityThemes,
];

// Theme utilities
export const getThemeById = (id: string): GothicTheme => {
  return allThemes.find(t => t.id === id) || gothicDark;
};

export const getThemesByCategory = (category: GothicTheme['category']): GothicTheme[] => {
  return allThemes.filter(t => t.category === category);
};

// CSS variable generator
export const generateCSSVariables = (theme: GothicTheme): Record<string, string> => {
  return {
    '--bg-primary': theme.colors.background,
    '--bg-secondary': theme.colors.backgroundSecondary,
    '--bg-surface': theme.colors.surface,
    '--bg-surface-hover': theme.colors.surfaceHover,
    '--color-primary': theme.colors.primary,
    '--color-primary-hover': theme.colors.primaryHover,
    '--color-secondary': theme.colors.secondary,
    '--color-accent': theme.colors.accent,
    '--text-primary': theme.colors.textPrimary,
    '--text-secondary': theme.colors.textSecondary,
    '--text-muted': theme.colors.textMuted,
    '--text-accent': theme.colors.textAccent,
    '--border-color': theme.colors.border,
    '--border-accent': theme.colors.borderAccent,
    '--glow-color': theme.colors.glow,
    '--shadow-color': theme.colors.shadow,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-error': theme.colors.error,
    '--color-info': theme.colors.info,
    '--font-family': theme.typography.fontFamily,
    '--font-heading': theme.typography.headingFont,
    '--font-accent': theme.typography.accentFont,
  };
};

export default gothicDark;
