import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Theme Interface
export interface Theme {
  id: string;
  name: string;
  description: string;
  category: 'gothic' | 'nature' | 'cosmic' | 'seasonal' | 'cultural' | 'mood';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundGradient?: string;
    text: string;
    textSecondary: string;
    textMuted: string;
  };
  effects: {
    glow?: string;
    shadow?: string;
    borderGlow?: string;
    textShadow?: string;
  };
}

// ============================================
// GOTHIC THEMES (10)
// ============================================
const gothicThemes: Theme[] = [
  {
    id: 'classic-gothic',
    name: 'Classic Gothic',
    description: 'Timeless elegance with gold accents on deep black',
    category: 'gothic',
    colors: {
      primary: '#D4AF37',
      secondary: '#1a1a1a',
      accent: '#FFD700',
      background: '#0a0a0a',
      backgroundGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      text: '#F5F5DC',
      textSecondary: '#D4AF37',
      textMuted: '#666666',
    },
    effects: {
      glow: '0 0 20px rgba(212, 175, 55, 0.5)',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
      borderGlow: '0 0 10px rgba(212, 175, 55, 0.3)',
      textShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
    },
  },
  {
    id: 'victorian-rose',
    name: 'Victorian Rose',
    description: 'Romantic Victorian aesthetic with rose and burgundy',
    category: 'gothic',
    colors: {
      primary: '#C41E3A',
      secondary: '#4A0000',
      accent: '#FFB6C1',
      background: '#1A0A0A',
      backgroundGradient: 'linear-gradient(135deg, #1A0A0A 0%, #2D0A0A 50%, #1A0A0A 100%)',
      text: '#FFF0F5',
      textSecondary: '#FFB6C1',
      textMuted: '#8B4557',
    },
    effects: {
      glow: '0 0 20px rgba(196, 30, 58, 0.5)',
      shadow: '0 4px 20px rgba(74, 0, 0, 0.8)',
      borderGlow: '0 0 10px rgba(255, 182, 193, 0.3)',
      textShadow: '0 0 10px rgba(196, 30, 58, 0.5)',
    },
  },
  {
    id: 'midnight-velvet',
    name: 'Midnight Velvet',
    description: 'Luxurious purple velvet on deepest midnight',
    category: 'gothic',
    colors: {
      primary: '#9B30FF',
      secondary: '#1A0A2E',
      accent: '#E6E6FA',
      background: '#0D0015',
      backgroundGradient: 'linear-gradient(135deg, #0D0015 0%, #1A0A2E 50%, #0D0015 100%)',
      text: '#E6E6FA',
      textSecondary: '#9B30FF',
      textMuted: '#6B238E',
    },
    effects: {
      glow: '0 0 25px rgba(155, 48, 255, 0.6)',
      shadow: '0 4px 20px rgba(13, 0, 21, 0.9)',
      borderGlow: '0 0 15px rgba(155, 48, 255, 0.4)',
      textShadow: '0 0 12px rgba(155, 48, 255, 0.6)',
    },
  },
  {
    id: 'crimson-moon',
    name: 'Crimson Moon',
    description: 'Blood red moon rising over dark landscapes',
    category: 'gothic',
    colors: {
      primary: '#DC143C',
      secondary: '#2B0000',
      accent: '#FF6B6B',
      background: '#0F0000',
      backgroundGradient: 'radial-gradient(ellipse at top, #3D0000 0%, #0F0000 70%)',
      text: '#FFE4E1',
      textSecondary: '#DC143C',
      textMuted: '#8B0000',
    },
    effects: {
      glow: '0 0 30px rgba(220, 20, 60, 0.6)',
      shadow: '0 4px 25px rgba(15, 0, 0, 0.9)',
      borderGlow: '0 0 15px rgba(220, 20, 60, 0.4)',
      textShadow: '0 0 15px rgba(220, 20, 60, 0.7)',
    },
  },
  {
    id: 'absinthe-dream',
    name: 'Absinthe Dream',
    description: 'Mysterious green hues of the green fairy',
    category: 'gothic',
    colors: {
      primary: '#4E9A06',
      secondary: '#0A1F0A',
      accent: '#ADFF2F',
      background: '#050F05',
      backgroundGradient: 'linear-gradient(135deg, #050F05 0%, #0A1F0A 50%, #051505 100%)',
      text: '#E0FFE0',
      textSecondary: '#73D216',
      textMuted: '#2E5D0B',
    },
    effects: {
      glow: '0 0 25px rgba(78, 154, 6, 0.5)',
      shadow: '0 4px 20px rgba(5, 15, 5, 0.9)',
      borderGlow: '0 0 12px rgba(173, 255, 47, 0.3)',
      textShadow: '0 0 10px rgba(78, 154, 6, 0.6)',
    },
  },
  {
    id: 'silver-dusk',
    name: 'Silver Dusk',
    description: 'Elegant silver against charcoal twilight',
    category: 'gothic',
    colors: {
      primary: '#C0C0C0',
      secondary: '#2F2F2F',
      accent: '#E8E8E8',
      background: '#1A1A1A',
      backgroundGradient: 'linear-gradient(180deg, #252525 0%, #1A1A1A 50%, #0F0F0F 100%)',
      text: '#E8E8E8',
      textSecondary: '#C0C0C0',
      textMuted: '#707070',
    },
    effects: {
      glow: '0 0 20px rgba(192, 192, 192, 0.4)',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.7)',
      borderGlow: '0 0 10px rgba(192, 192, 192, 0.3)',
      textShadow: '0 0 8px rgba(192, 192, 192, 0.4)',
    },
  },
  {
    id: 'onyx-pearl',
    name: 'Onyx & Pearl',
    description: 'Striking contrast of pure black and white',
    category: 'gothic',
    colors: {
      primary: '#FFFFFF',
      secondary: '#000000',
      accent: '#D4D4D4',
      background: '#0A0A0A',
      backgroundGradient: 'linear-gradient(135deg, #000000 0%, #1A1A1A 50%, #000000 100%)',
      text: '#FFFFFF',
      textSecondary: '#E0E0E0',
      textMuted: '#808080',
    },
    effects: {
      glow: '0 0 20px rgba(255, 255, 255, 0.3)',
      shadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
      borderGlow: '0 0 10px rgba(255, 255, 255, 0.2)',
      textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
    },
  },
  {
    id: 'haunted-manor',
    name: 'Haunted Manor',
    description: 'Moss-covered stones and aged wood of forgotten estates',
    category: 'gothic',
    colors: {
      primary: '#556B2F',
      secondary: '#2F1F0F',
      accent: '#8B7355',
      background: '#0F0A05',
      backgroundGradient: 'linear-gradient(135deg, #0F0A05 0%, #1A1510 50%, #0F0A05 100%)',
      text: '#D2B48C',
      textSecondary: '#6B8E23',
      textMuted: '#4A4A35',
    },
    effects: {
      glow: '0 0 20px rgba(85, 107, 47, 0.4)',
      shadow: '0 4px 20px rgba(15, 10, 5, 0.8)',
      borderGlow: '0 0 10px rgba(107, 142, 35, 0.3)',
      textShadow: '0 0 8px rgba(85, 107, 47, 0.5)',
    },
  },
  {
    id: 'gothic-romance',
    name: 'Gothic Romance',
    description: 'Dark romantic aesthetic with pink and black',
    category: 'gothic',
    colors: {
      primary: '#FF69B4',
      secondary: '#1A0A14',
      accent: '#FFB6C1',
      background: '#0F050A',
      backgroundGradient: 'linear-gradient(135deg, #0F050A 0%, #1A0A14 50%, #0F050A 100%)',
      text: '#FFF0F5',
      textSecondary: '#FF69B4',
      textMuted: '#8B4570',
    },
    effects: {
      glow: '0 0 25px rgba(255, 105, 180, 0.5)',
      shadow: '0 4px 20px rgba(15, 5, 10, 0.8)',
      borderGlow: '0 0 12px rgba(255, 105, 180, 0.4)',
      textShadow: '0 0 10px rgba(255, 105, 180, 0.5)',
    },
  },
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    description: 'Scholarly aesthetic with rich browns and cream',
    category: 'gothic',
    colors: {
      primary: '#8B4513',
      secondary: '#2C1810',
      accent: '#D2691E',
      background: '#1A1410',
      backgroundGradient: 'linear-gradient(135deg, #1A1410 0%, #2C1810 50%, #1A1410 100%)',
      text: '#FFF8DC',
      textSecondary: '#DEB887',
      textMuted: '#6B4423',
    },
    effects: {
      glow: '0 0 20px rgba(139, 69, 19, 0.4)',
      shadow: '0 4px 20px rgba(26, 20, 16, 0.8)',
      borderGlow: '0 0 10px rgba(210, 105, 30, 0.3)',
      textShadow: '0 0 8px rgba(139, 69, 19, 0.4)',
    },
  },
];

// ============================================
// NATURE THEMES (8)
// ============================================
const natureThemes: Theme[] = [
  {
    id: 'forest-sanctuary',
    name: 'Forest Sanctuary',
    description: 'Deep woodland greens and earthy browns',
    category: 'nature',
    colors: {
      primary: '#228B22',
      secondary: '#2D4A2D',
      accent: '#90EE90',
      background: '#0A1F0A',
      backgroundGradient: 'linear-gradient(180deg, #0A1F0A 0%, #162816 50%, #0A1F0A 100%)',
      text: '#E0FFE0',
      textSecondary: '#90EE90',
      textMuted: '#3D5A3D',
    },
    effects: {
      glow: '0 0 20px rgba(34, 139, 34, 0.5)',
      shadow: '0 4px 20px rgba(10, 31, 10, 0.8)',
      borderGlow: '0 0 10px rgba(144, 238, 144, 0.3)',
      textShadow: '0 0 8px rgba(34, 139, 34, 0.5)',
    },
  },
  {
    id: 'ocean-depths',
    name: 'Ocean Depths',
    description: 'Deep blue waters and mysterious teal',
    category: 'nature',
    colors: {
      primary: '#006994',
      secondary: '#003344',
      accent: '#00CED1',
      background: '#001A20',
      backgroundGradient: 'linear-gradient(180deg, #002030 0%, #001A20 50%, #000F15 100%)',
      text: '#E0FFFF',
      textSecondary: '#00CED1',
      textMuted: '#2F6A6A',
    },
    effects: {
      glow: '0 0 25px rgba(0, 206, 209, 0.5)',
      shadow: '0 4px 25px rgba(0, 26, 32, 0.8)',
      borderGlow: '0 0 12px rgba(0, 206, 209, 0.4)',
      textShadow: '0 0 10px rgba(0, 206, 209, 0.5)',
    },
  },
  {
    id: 'desert-sunset',
    name: 'Desert Sunset',
    description: 'Warm oranges and sandy browns of desert twilight',
    category: 'nature',
    colors: {
      primary: '#FF7F50',
      secondary: '#8B4513',
      accent: '#FFD700',
      background: '#1A0F05',
      backgroundGradient: 'linear-gradient(180deg, #2D1A0F 0%, #1A0F05 60%, #0F0A05 100%)',
      text: '#FFF8DC',
      textSecondary: '#FFA500',
      textMuted: '#8B6914',
    },
    effects: {
      glow: '0 0 25px rgba(255, 127, 80, 0.5)',
      shadow: '0 4px 20px rgba(26, 15, 5, 0.8)',
      borderGlow: '0 0 12px rgba(255, 215, 0, 0.3)',
      textShadow: '0 0 10px rgba(255, 127, 80, 0.5)',
    },
  },
  {
    id: 'mountain-mist',
    name: 'Mountain Mist',
    description: 'Cool grays and soft blues of misty peaks',
    category: 'nature',
    colors: {
      primary: '#708090',
      secondary: '#4A5568',
      accent: '#B0C4DE',
      background: '#1A1E24',
      backgroundGradient: 'linear-gradient(180deg, #2D3748 0%, #1A1E24 50%, #0F1318 100%)',
      text: '#E2E8F0',
      textSecondary: '#B0C4DE',
      textMuted: '#5A6A7A',
    },
    effects: {
      glow: '0 0 20px rgba(176, 196, 222, 0.4)',
      shadow: '0 4px 20px rgba(26, 30, 36, 0.8)',
      borderGlow: '0 0 10px rgba(176, 196, 222, 0.3)',
      textShadow: '0 0 8px rgba(112, 128, 144, 0.5)',
    },
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    description: 'Delicate pink petals on soft white',
    category: 'nature',
    colors: {
      primary: '#FFB7C5',
      secondary: '#FFF0F5',
      accent: '#FF69B4',
      background: '#1A1518',
      backgroundGradient: 'linear-gradient(135deg, #1A1518 0%, #251A20 50%, #1A1518 100%)',
      text: '#FFF0F5',
      textSecondary: '#FFB7C5',
      textMuted: '#8B6B75',
    },
    effects: {
      glow: '0 0 25px rgba(255, 183, 197, 0.5)',
      shadow: '0 4px 20px rgba(26, 21, 24, 0.7)',
      borderGlow: '0 0 12px rgba(255, 105, 180, 0.3)',
      textShadow: '0 0 10px rgba(255, 183, 197, 0.5)',
    },
  },
  {
    id: 'autumn-harvest',
    name: 'Autumn Harvest',
    description: 'Rich oranges, reds, and golden browns of fall',
    category: 'nature',
    colors: {
      primary: '#D2691E',
      secondary: '#8B4513',
      accent: '#FF8C00',
      background: '#1A0F08',
      backgroundGradient: 'linear-gradient(135deg, #1A0F08 0%, #2D1A0F 50%, #1A0F08 100%)',
      text: '#FFF8DC',
      textSecondary: '#DEB887',
      textMuted: '#6B4423',
    },
    effects: {
      glow: '0 0 20px rgba(210, 105, 30, 0.5)',
      shadow: '0 4px 20px rgba(26, 15, 8, 0.8)',
      borderGlow: '0 0 10px rgba(255, 140, 0, 0.4)',
      textShadow: '0 0 10px rgba(210, 105, 30, 0.5)',
    },
  },
  {
    id: 'northern-lights',
    name: 'Northern Lights',
    description: 'Dancing aurora of green, purple, and blue',
    category: 'nature',
    colors: {
      primary: '#00FF7F',
      secondary: '#9932CC',
      accent: '#00BFFF',
      background: '#050510',
      backgroundGradient: 'linear-gradient(180deg, #0A0A1A 0%, #050510 50%, #000005 100%)',
      text: '#E0FFFF',
      textSecondary: '#00FF7F',
      textMuted: '#4A6B6B',
    },
    effects: {
      glow: '0 0 30px rgba(0, 255, 127, 0.5)',
      shadow: '0 4px 25px rgba(5, 5, 16, 0.9)',
      borderGlow: '0 0 15px rgba(0, 191, 255, 0.4)',
      textShadow: '0 0 12px rgba(0, 255, 127, 0.6)',
    },
  },
  {
    id: 'lavender-fields',
    name: 'Lavender Fields',
    description: 'Soft purple blooms against green hills',
    category: 'nature',
    colors: {
      primary: '#E6E6FA',
      secondary: '#9370DB',
      accent: '#DDA0DD',
      background: '#0F0A14',
      backgroundGradient: 'linear-gradient(135deg, #0F0A14 0%, #1A1424 50%, #0F0A14 100%)',
      text: '#F5F5FF',
      textSecondary: '#E6E6FA',
      textMuted: '#6B5A8E',
    },
    effects: {
      glow: '0 0 25px rgba(230, 230, 250, 0.4)',
      shadow: '0 4px 20px rgba(15, 10, 20, 0.8)',
      borderGlow: '0 0 12px rgba(221, 160, 221, 0.3)',
      textShadow: '0 0 10px rgba(230, 230, 250, 0.5)',
    },
  },
];

// ============================================
// COSMIC THEMES (8)
// ============================================
const cosmicThemes: Theme[] = [
  {
    id: 'nebula-dreams',
    name: 'Nebula Dreams',
    description: 'Swirling cosmic clouds of pink, purple, and blue',
    category: 'cosmic',
    colors: {
      primary: '#FF1493',
      secondary: '#4B0082',
      accent: '#00BFFF',
      background: '#0A0510',
      backgroundGradient: 'radial-gradient(ellipse at center, #1A0A20 0%, #0A0510 70%)',
      text: '#E0E0FF',
      textSecondary: '#FF69B4',
      textMuted: '#6B3A8E',
    },
    effects: {
      glow: '0 0 30px rgba(255, 20, 147, 0.5)',
      shadow: '0 4px 25px rgba(10, 5, 16, 0.9)',
      borderGlow: '0 0 15px rgba(0, 191, 255, 0.4)',
      textShadow: '0 0 12px rgba(255, 20, 147, 0.6)',
    },
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    description: 'Intense orange and yellow of stellar eruptions',
    category: 'cosmic',
    colors: {
      primary: '#FF6600',
      secondary: '#FF9900',
      accent: '#FFCC00',
      background: '#0F0500',
      backgroundGradient: 'radial-gradient(ellipse at center, #2D1500 0%, #0F0500 70%)',
      text: '#FFF8E7',
      textSecondary: '#FFCC00',
      textMuted: '#8B6B00',
    },
    effects: {
      glow: '0 0 35px rgba(255, 102, 0, 0.6)',
      shadow: '0 4px 25px rgba(15, 5, 0, 0.9)',
      borderGlow: '0 0 18px rgba(255, 204, 0, 0.5)',
      textShadow: '0 0 15px rgba(255, 102, 0, 0.7)',
    },
  },
  {
    id: 'starlight-silver',
    name: 'Starlight Silver',
    description: 'Twinkling silver stars on navy canvas',
    category: 'cosmic',
    colors: {
      primary: '#C0C0C0',
      secondary: '#191970',
      accent: '#E8E8E8',
      background: '#050510',
      backgroundGradient: 'linear-gradient(180deg, #0A0A20 0%, #050510 50%, #000005 100%)',
      text: '#F0F0FF',
      textSecondary: '#C0C0C0',
      textMuted: '#5A5A8E',
    },
    effects: {
      glow: '0 0 20px rgba(192, 192, 192, 0.5)',
      shadow: '0 4px 20px rgba(5, 5, 16, 0.9)',
      borderGlow: '0 0 10px rgba(232, 232, 232, 0.4)',
      textShadow: '0 0 8px rgba(192, 192, 192, 0.5)',
    },
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    description: 'Dark orb with fiery corona ring',
    category: 'cosmic',
    colors: {
      primary: '#FF4500',
      secondary: '#000000',
      accent: '#FF8C00',
      background: '#000000',
      backgroundGradient: 'radial-gradient(circle at center, #1A0A00 0%, #000000 50%)',
      text: '#FFF5EE',
      textSecondary: '#FF4500',
      textMuted: '#5A2D00',
    },
    effects: {
      glow: '0 0 40px rgba(255, 69, 0, 0.7)',
      shadow: '0 4px 30px rgba(0, 0, 0, 1)',
      borderGlow: '0 0 20px rgba(255, 140, 0, 0.5)',
      textShadow: '0 0 15px rgba(255, 69, 0, 0.7)',
    },
  },
  {
    id: 'galaxy-spiral',
    name: 'Galaxy Spiral',
    description: 'Spinning arms of purple, blue, and pink',
    category: 'cosmic',
    colors: {
      primary: '#8A2BE2',
      secondary: '#4169E1',
      accent: '#FF69B4',
      background: '#050508',
      backgroundGradient: 'conic-gradient(from 0deg at 50% 50%, #0A0515 0deg, #050520 180deg, #0A0515 360deg)',
      text: '#E8E0FF',
      textSecondary: '#BA55D3',
      textMuted: '#5A4A6B',
    },
    effects: {
      glow: '0 0 30px rgba(138, 43, 226, 0.5)',
      shadow: '0 4px 25px rgba(5, 5, 8, 0.9)',
      borderGlow: '0 0 15px rgba(255, 105, 180, 0.4)',
      textShadow: '0 0 12px rgba(138, 43, 226, 0.6)',
    },
  },
  {
    id: 'meteor-shower',
    name: 'Meteor Shower',
    description: 'Streaking orange trails across gray sky',
    category: 'cosmic',
    colors: {
      primary: '#FF6347',
      secondary: '#4A4A4A',
      accent: '#FFA07A',
      background: '#0F0F0F',
      backgroundGradient: 'linear-gradient(135deg, #1A1A1A 0%, #0F0F0F 50%, #0A0A0A 100%)',
      text: '#E8E8E8',
      textSecondary: '#FF6347',
      textMuted: '#6A6A6A',
    },
    effects: {
      glow: '0 0 25px rgba(255, 99, 71, 0.5)',
      shadow: '0 4px 20px rgba(15, 15, 15, 0.9)',
      borderGlow: '0 0 12px rgba(255, 160, 122, 0.4)',
      textShadow: '0 0 10px rgba(255, 99, 71, 0.6)',
    },
  },
  {
    id: 'lunar-phase',
    name: 'Lunar Phase',
    description: 'Silver moon cycling through gray phases',
    category: 'cosmic',
    colors: {
      primary: '#D3D3D3',
      secondary: '#2F2F2F',
      accent: '#F5F5F5',
      background: '#0A0A0F',
      backgroundGradient: 'radial-gradient(ellipse at top, #1A1A25 0%, #0A0A0F 70%)',
      text: '#F0F0F5',
      textSecondary: '#D3D3D3',
      textMuted: '#5A5A60',
    },
    effects: {
      glow: '0 0 30px rgba(211, 211, 211, 0.4)',
      shadow: '0 4px 25px rgba(10, 10, 15, 0.9)',
      borderGlow: '0 0 15px rgba(245, 245, 245, 0.3)',
      textShadow: '0 0 12px rgba(211, 211, 211, 0.5)',
    },
  },
  {
    id: 'cosmic-dawn',
    name: 'Cosmic Dawn',
    description: 'Sunrise gradient emerging in space',
    category: 'cosmic',
    colors: {
      primary: '#FF7F50',
      secondary: '#4B0082',
      accent: '#FFD700',
      background: '#05050F',
      backgroundGradient: 'linear-gradient(180deg, #1A0A20 0%, #0F0510 30%, #1A0F05 70%, #0F0A05 100%)',
      text: '#FFF5E6',
      textSecondary: '#FFA07A',
      textMuted: '#6B4A5A',
    },
    effects: {
      glow: '0 0 30px rgba(255, 127, 80, 0.5)',
      shadow: '0 4px 25px rgba(5, 5, 15, 0.9)',
      borderGlow: '0 0 15px rgba(255, 215, 0, 0.4)',
      textShadow: '0 0 12px rgba(255, 127, 80, 0.6)',
    },
  },
];

// ============================================
// SEASONAL THEMES (8)
// ============================================
const seasonalThemes: Theme[] = [
  {
    id: 'spring-bloom',
    name: 'Spring Bloom',
    description: 'Fresh pastels of new growth and flowers',
    category: 'seasonal',
    colors: {
      primary: '#98FB98',
      secondary: '#FFB6C1',
      accent: '#87CEEB',
      background: '#0F1510',
      backgroundGradient: 'linear-gradient(135deg, #0F1510 0%, #101815 50%, #0F1510 100%)',
      text: '#F0FFF0',
      textSecondary: '#90EE90',
      textMuted: '#4A6B4A',
    },
    effects: {
      glow: '0 0 20px rgba(152, 251, 152, 0.4)',
      shadow: '0 4px 20px rgba(15, 21, 16, 0.8)',
      borderGlow: '0 0 10px rgba(135, 206, 235, 0.3)',
      textShadow: '0 0 8px rgba(152, 251, 152, 0.5)',
    },
  },
  {
    id: 'summer-heat',
    name: 'Summer Heat',
    description: 'Bright yellows and oranges of hot days',
    category: 'seasonal',
    colors: {
      primary: '#FFD700',
      secondary: '#FF8C00',
      accent: '#00CED1',
      background: '#1A1505',
      backgroundGradient: 'linear-gradient(180deg, #2D2008 0%, #1A1505 50%, #0F0A00 100%)',
      text: '#FFFACD',
      textSecondary: '#FFD700',
      textMuted: '#8B7500',
    },
    effects: {
      glow: '0 0 25px rgba(255, 215, 0, 0.5)',
      shadow: '0 4px 20px rgba(26, 21, 5, 0.8)',
      borderGlow: '0 0 12px rgba(255, 140, 0, 0.4)',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
    },
  },
  {
    id: 'autumn-whisper',
    name: 'Autumn Whisper',
    description: 'Soft, muted tones of falling leaves',
    category: 'seasonal',
    colors: {
      primary: '#CD853F',
      secondary: '#8B4513',
      accent: '#DAA520',
      background: '#14100A',
      backgroundGradient: 'linear-gradient(135deg, #14100A 0%, #1F1610 50%, #14100A 100%)',
      text: '#F5DEB3',
      textSecondary: '#D2B48C',
      textMuted: '#6B5A3A',
    },
    effects: {
      glow: '0 0 20px rgba(205, 133, 63, 0.4)',
      shadow: '0 4px 20px rgba(20, 16, 10, 0.8)',
      borderGlow: '0 0 10px rgba(218, 165, 32, 0.3)',
      textShadow: '0 0 8px rgba(205, 133, 63, 0.5)',
    },
  },
  {
    id: 'winter-frost',
    name: 'Winter Frost',
    description: 'Icy blues and crisp whites of cold',
    category: 'seasonal',
    colors: {
      primary: '#ADD8E6',
      secondary: '#4682B4',
      accent: '#E0FFFF',
      background: '#0A0F14',
      backgroundGradient: 'linear-gradient(180deg, #101820 0%, #0A0F14 50%, #050A0F 100%)',
      text: '#F0FFFF',
      textSecondary: '#ADD8E6',
      textMuted: '#4A6A8A',
    },
    effects: {
      glow: '0 0 25px rgba(173, 216, 230, 0.4)',
      shadow: '0 4px 20px rgba(10, 15, 20, 0.9)',
      borderGlow: '0 0 12px rgba(224, 255, 255, 0.3)',
      textShadow: '0 0 10px rgba(173, 216, 230, 0.5)',
    },
  },
  {
    id: 'harvest-moon',
    name: 'Harvest Moon',
    description: 'Warm amber glow of autumn nights',
    category: 'seasonal',
    colors: {
      primary: '#FF8C00',
      secondary: '#8B4513',
      accent: '#FFD700',
      background: '#0F0A05',
      backgroundGradient: 'radial-gradient(ellipse at top, #2D1A0A 0%, #0F0A05 70%)',
      text: '#FFEFD5',
      textSecondary: '#FFA500',
      textMuted: '#6B4A14',
    },
    effects: {
      glow: '0 0 30px rgba(255, 140, 0, 0.5)',
      shadow: '0 4px 25px rgba(15, 10, 5, 0.9)',
      borderGlow: '0 0 15px rgba(255, 215, 0, 0.4)',
      textShadow: '0 0 12px rgba(255, 140, 0, 0.6)',
    },
  },
  {
    id: 'valentine-rose',
    name: 'Valentine Rose',
    description: 'Romantic reds and pinks of love',
    category: 'seasonal',
    colors: {
      primary: '#FF1744',
      secondary: '#880E4F',
      accent: '#FF80AB',
      background: '#140508',
      backgroundGradient: 'linear-gradient(135deg, #140508 0%, #1F0810 50%, #140508 100%)',
      text: '#FFE4E9',
      textSecondary: '#FF80AB',
      textMuted: '#8B3A5A',
    },
    effects: {
      glow: '0 0 25px rgba(255, 23, 68, 0.5)',
      shadow: '0 4px 20px rgba(20, 5, 8, 0.9)',
      borderGlow: '0 0 12px rgba(255, 128, 171, 0.4)',
      textShadow: '0 0 10px rgba(255, 23, 68, 0.6)',
    },
  },
  {
    id: 'halloween-spirit',
    name: 'Halloween Spirit',
    description: 'Spooky orange and black of All Hallows Eve',
    category: 'seasonal',
    colors: {
      primary: '#FF6600',
      secondary: '#1A1A1A',
      accent: '#9932CC',
      background: '#0A0500',
      backgroundGradient: 'linear-gradient(180deg, #1A0F00 0%, #0A0500 50%, #050000 100%)',
      text: '#FFF5E6',
      textSecondary: '#FF6600',
      textMuted: '#5A3D00',
    },
    effects: {
      glow: '0 0 30px rgba(255, 102, 0, 0.6)',
      shadow: '0 4px 25px rgba(10, 5, 0, 0.9)',
      borderGlow: '0 0 15px rgba(153, 50, 204, 0.4)',
      textShadow: '0 0 12px rgba(255, 102, 0, 0.7)',
    },
  },
  {
    id: 'holiday-magic',
    name: 'Holiday Magic',
    description: 'Festive red and green with golden sparkle',
    category: 'seasonal',
    colors: {
      primary: '#C41E3A',
      secondary: '#228B22',
      accent: '#FFD700',
      background: '#0A0F0A',
      backgroundGradient: 'linear-gradient(135deg, #0A0F0A 0%, #0F1410 50%, #0A0F0A 100%)',
      text: '#FFFAF0',
      textSecondary: '#FFD700',
      textMuted: '#4A5A4A',
    },
    effects: {
      glow: '0 0 25px rgba(255, 215, 0, 0.5)',
      shadow: '0 4px 20px rgba(10, 15, 10, 0.8)',
      borderGlow: '0 0 12px rgba(196, 30, 58, 0.4)',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.6)',
    },
  },
];

// ============================================
// CULTURAL THEMES (8)
// ============================================
const culturalThemes: Theme[] = [
  {
    id: 'african-sunset',
    name: 'African Sunset',
    description: 'Warm oranges and reds of savanna skies',
    category: 'cultural',
    colors: {
      primary: '#E65100',
      secondary: '#BF360C',
      accent: '#FFB300',
      background: '#1A0A00',
      backgroundGradient: 'linear-gradient(180deg, #2D1500 0%, #1A0A00 50%, #0F0500 100%)',
      text: '#FFF3E0',
      textSecondary: '#FFAB40',
      textMuted: '#6B4A14',
    },
    effects: {
      glow: '0 0 25px rgba(230, 81, 0, 0.5)',
      shadow: '0 4px 20px rgba(26, 10, 0, 0.8)',
      borderGlow: '0 0 12px rgba(255, 179, 0, 0.4)',
      textShadow: '0 0 10px rgba(230, 81, 0, 0.6)',
    },
  },
  {
    id: 'caribbean-vibes',
    name: 'Caribbean Vibes',
    description: 'Vibrant turquoise and coral of island life',
    category: 'cultural',
    colors: {
      primary: '#00BCD4',
      secondary: '#FF7043',
      accent: '#FFEB3B',
      background: '#0A1418',
      backgroundGradient: 'linear-gradient(135deg, #0A1418 0%, #0F1A20 50%, #0A1418 100%)',
      text: '#E0F7FA',
      textSecondary: '#4DD0E1',
      textMuted: '#4A6A6A',
    },
    effects: {
      glow: '0 0 25px rgba(0, 188, 212, 0.5)',
      shadow: '0 4px 20px rgba(10, 20, 24, 0.8)',
      borderGlow: '0 0 12px rgba(255, 112, 67, 0.4)',
      textShadow: '0 0 10px rgba(0, 188, 212, 0.6)',
    },
  },
  {
    id: 'tokyo-neon',
    name: 'Tokyo Neon',
    description: 'Electric pink and blue of cyberpunk nights',
    category: 'cultural',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FF1493',
      background: '#050510',
      backgroundGradient: 'linear-gradient(135deg, #0A0520 0%, #050510 50%, #050510 100%)',
      text: '#F0F0FF',
      textSecondary: '#FF69B4',
      textMuted: '#6A4A8E',
    },
    effects: {
      glow: '0 0 35px rgba(255, 0, 255, 0.6)',
      shadow: '0 4px 25px rgba(5, 5, 16, 0.9)',
      borderGlow: '0 0 18px rgba(0, 255, 255, 0.5)',
      textShadow: '0 0 15px rgba(255, 0, 255, 0.7)',
    },
  },
  {
    id: 'morocco-nights',
    name: 'Morocco Nights',
    description: 'Warm spices and rich jewel tones',
    category: 'cultural',
    colors: {
      primary: '#C2185B',
      secondary: '#FF8F00',
      accent: '#00897B',
      background: '#140A08',
      backgroundGradient: 'linear-gradient(135deg, #140A08 0%, #1F100C 50%, #140A08 100%)',
      text: '#FFF8E1',
      textSecondary: '#FFB74D',
      textMuted: '#6B4A3A',
    },
    effects: {
      glow: '0 0 25px rgba(194, 24, 91, 0.5)',
      shadow: '0 4px 20px rgba(20, 10, 8, 0.8)',
      borderGlow: '0 0 12px rgba(255, 143, 0, 0.4)',
      textShadow: '0 0 10px rgba(194, 24, 91, 0.6)',
    },
  },
  {
    id: 'nordic-minimalist',
    name: 'Nordic Minimalist',
    description: 'Clean whites and natural wood tones',
    category: 'cultural',
    colors: {
      primary: '#F5F5F5',
      secondary: '#D7CCC8',
      accent: '#8D6E63',
      background: '#1A1A1A',
      backgroundGradient: 'linear-gradient(180deg, #252525 0%, #1A1A1A 50%, #0F0F0F 100%)',
      text: '#FAFAFA',
      textSecondary: '#E0E0E0',
      textMuted: '#757575',
    },
    effects: {
      glow: '0 0 15px rgba(245, 245, 245, 0.3)',
      shadow: '0 4px 15px rgba(26, 26, 26, 0.7)',
      borderGlow: '0 0 8px rgba(141, 110, 99, 0.3)',
      textShadow: '0 0 6px rgba(245, 245, 245, 0.3)',
    },
  },
  {
    id: 'celtic-twilight',
    name: 'Celtic Twilight',
    description: 'Mystical greens and ancient gold',
    category: 'cultural',
    colors: {
      primary: '#2E7D32',
      secondary: '#FFD700',
      accent: '#81C784',
      background: '#0A140A',
      backgroundGradient: 'linear-gradient(135deg, #0A140A 0%, #101A10 50%, #0A140A 100%)',
      text: '#E8F5E9',
      textSecondary: '#C8E6C9',
      textMuted: '#3A5A3A',
    },
    effects: {
      glow: '0 0 25px rgba(46, 125, 50, 0.5)',
      shadow: '0 4px 20px rgba(10, 20, 10, 0.8)',
      borderGlow: '0 0 12px rgba(255, 215, 0, 0.4)',
      textShadow: '0 0 10px rgba(46, 125, 50, 0.5)',
    },
  },
  {
    id: 'mediterranean-blue',
    name: 'Mediterranean Blue',
    description: 'Crisp white and deep blue of coastal villages',
    category: 'cultural',
    colors: {
      primary: '#1976D2',
      secondary: '#FFFFFF',
      accent: '#64B5F6',
      background: '#0A0F14',
      backgroundGradient: 'linear-gradient(180deg, #0F1A24 0%, #0A0F14 50%, #050A10 100%)',
      text: '#E3F2FD',
      textSecondary: '#90CAF9',
      textMuted: '#4A6A8A',
    },
    effects: {
      glow: '0 0 20px rgba(25, 118, 210, 0.5)',
      shadow: '0 4px 20px rgba(10, 15, 20, 0.8)',
      borderGlow: '0 0 10px rgba(100, 181, 246, 0.4)',
      textShadow: '0 0 8px rgba(25, 118, 210, 0.5)',
    },
  },
  {
    id: 'bohemian-garden',
    name: 'Bohemian Garden',
    description: 'Eclectic mix of earthy, natural tones',
    category: 'cultural',
    colors: {
      primary: '#8E744A',
      secondary: '#6B4423',
      accent: '#C2956E',
      background: '#14100A',
      backgroundGradient: 'linear-gradient(135deg, #14100A 0%, #1A1510 50%, #14100A 100%)',
      text: '#F5EBE0',
      textSecondary: '#D4A574',
      textMuted: '#5A4A3A',
    },
    effects: {
      glow: '0 0 20px rgba(142, 116, 74, 0.4)',
      shadow: '0 4px 20px rgba(20, 16, 10, 0.8)',
      borderGlow: '0 0 10px rgba(194, 149, 110, 0.3)',
      textShadow: '0 0 8px rgba(142, 116, 74, 0.5)',
    },
  },
];

// ============================================
// MOOD THEMES (8)
// ============================================
const moodThemes: Theme[] = [
  {
    id: 'calm-zen',
    name: 'Calm Zen',
    description: 'Soft blues for peaceful meditation',
    category: 'mood',
    colors: {
      primary: '#81D4FA',
      secondary: '#B3E5FC',
      accent: '#4FC3F7',
      background: '#0A1014',
      backgroundGradient: 'linear-gradient(180deg, #0F1820 0%, #0A1014 50%, #050A0F 100%)',
      text: '#E1F5FE',
      textSecondary: '#81D4FA',
      textMuted: '#4A6A7A',
    },
    effects: {
      glow: '0 0 20px rgba(129, 212, 250, 0.3)',
      shadow: '0 4px 15px rgba(10, 16, 20, 0.7)',
      borderGlow: '0 0 10px rgba(79, 195, 247, 0.3)',
      textShadow: '0 0 8px rgba(129, 212, 250, 0.4)',
    },
  },
  {
    id: 'energetic-sunrise',
    name: 'Energetic Sunrise',
    description: 'Bright, warm colors to boost energy',
    category: 'mood',
    colors: {
      primary: '#FF9800',
      secondary: '#FFC107',
      accent: '#FF5722',
      background: '#14100A',
      backgroundGradient: 'linear-gradient(180deg, #1F1508 0%, #14100A 50%, #0F0A05 100%)',
      text: '#FFF8E1',
      textSecondary: '#FFB74D',
      textMuted: '#6B5A14',
    },
    effects: {
      glow: '0 0 25px rgba(255, 152, 0, 0.5)',
      shadow: '0 4px 20px rgba(20, 16, 10, 0.8)',
      borderGlow: '0 0 12px rgba(255, 87, 34, 0.4)',
      textShadow: '0 0 10px rgba(255, 152, 0, 0.6)',
    },
  },
  {
    id: 'melancholy-blue',
    name: 'Melancholy Blue',
    description: 'Deep blues for introspective moments',
    category: 'mood',
    colors: {
      primary: '#1A237E',
      secondary: '#283593',
      accent: '#5C6BC0',
      background: '#05050F',
      backgroundGradient: 'linear-gradient(180deg, #0A0A1F 0%, #05050F 50%, #000005 100%)',
      text: '#E8EAF6',
      textSecondary: '#9FA8DA',
      textMuted: '#3A4A6A',
    },
    effects: {
      glow: '0 0 25px rgba(26, 35, 126, 0.5)',
      shadow: '0 4px 25px rgba(5, 5, 15, 0.9)',
      borderGlow: '0 0 12px rgba(92, 107, 192, 0.4)',
      textShadow: '0 0 10px rgba(26, 35, 126, 0.6)',
    },
  },
  {
    id: 'joyful-rainbow',
    name: 'Joyful Rainbow',
    description: 'Vibrant spectrum of happiness',
    category: 'mood',
    colors: {
      primary: '#E91E63',
      secondary: '#9C27B0',
      accent: '#00BCD4',
      background: '#0F0A14',
      backgroundGradient: 'linear-gradient(135deg, #140A18 0%, #0F0A14 50%, #0A0A14 100%)',
      text: '#FCE4EC',
      textSecondary: '#F48FB1',
      textMuted: '#6A4A5A',
    },
    effects: {
      glow: '0 0 25px rgba(233, 30, 99, 0.5)',
      shadow: '0 4px 20px rgba(15, 10, 20, 0.8)',
      borderGlow: '0 0 12px rgba(0, 188, 212, 0.4)',
      textShadow: '0 0 10px rgba(233, 30, 99, 0.6)',
    },
  },
  {
    id: 'mysterious-noir',
    name: 'Mysterious Noir',
    description: 'Dark, shadowy atmosphere of mystery',
    category: 'mood',
    colors: {
      primary: '#37474F',
      secondary: '#263238',
      accent: '#78909C',
      background: '#0A0A0A',
      backgroundGradient: 'linear-gradient(135deg, #141414 0%, #0A0A0A 50%, #050505 100%)',
      text: '#ECEFF1',
      textSecondary: '#B0BEC5',
      textMuted: '#546E7A',
    },
    effects: {
      glow: '0 0 20px rgba(55, 71, 79, 0.4)',
      shadow: '0 4px 25px rgba(10, 10, 10, 0.9)',
      borderGlow: '0 0 10px rgba(120, 144, 156, 0.3)',
      textShadow: '0 0 8px rgba(55, 71, 79, 0.5)',
    },
  },
  {
    id: 'romantic-dusk',
    name: 'Romantic Dusk',
    description: 'Soft pinks and purples of evening romance',
    category: 'mood',
    colors: {
      primary: '#CE93D8',
      secondary: '#F48FB1',
      accent: '#B39DDB',
      background: '#0F0A14',
      backgroundGradient: 'linear-gradient(180deg, #1A0F20 0%, #0F0A14 50%, #0A050F 100%)',
      text: '#F3E5F5',
      textSecondary: '#CE93D8',
      textMuted: '#6A5A7A',
    },
    effects: {
      glow: '0 0 25px rgba(206, 147, 216, 0.4)',
      shadow: '0 4px 20px rgba(15, 10, 20, 0.8)',
      borderGlow: '0 0 12px rgba(179, 157, 219, 0.3)',
      textShadow: '0 0 10px rgba(206, 147, 216, 0.5)',
    },
  },
  {
    id: 'focused-minimal',
    name: 'Focused Minimal',
    description: 'Clean, distraction-free workspace',
    category: 'mood',
    colors: {
      primary: '#607D8B',
      secondary: '#455A64',
      accent: '#90A4AE',
      background: '#121212',
      backgroundGradient: 'linear-gradient(180deg, #1A1A1A 0%, #121212 50%, #0A0A0A 100%)',
      text: '#ECEFF1',
      textSecondary: '#B0BEC5',
      textMuted: '#546E7A',
    },
    effects: {
      glow: '0 0 15px rgba(96, 125, 139, 0.3)',
      shadow: '0 4px 15px rgba(18, 18, 18, 0.8)',
      borderGlow: '0 0 8px rgba(144, 164, 174, 0.2)',
      textShadow: '0 0 6px rgba(96, 125, 139, 0.3)',
    },
  },
  {
    id: 'dreamy-pastel',
    name: 'Dreamy Pastel',
    description: 'Soft, ethereal pastels of daydreams',
    category: 'mood',
    colors: {
      primary: '#FFB5E8',
      secondary: '#B5DEFF',
      accent: '#DCD3FF',
      background: '#14101A',
      backgroundGradient: 'linear-gradient(135deg, #1A1420 0%, #14101A 50%, #100A14 100%)',
      text: '#FFF5FA',
      textSecondary: '#FFD1E8',
      textMuted: '#6A5A6A',
    },
    effects: {
      glow: '0 0 25px rgba(255, 181, 232, 0.4)',
      shadow: '0 4px 20px rgba(20, 16, 26, 0.7)',
      borderGlow: '0 0 12px rgba(181, 222, 255, 0.3)',
      textShadow: '0 0 10px rgba(255, 181, 232, 0.4)',
    },
  },
];

// ============================================
// ALL THEMES COMBINED
// ============================================
export const allThemes: Theme[] = [
  ...gothicThemes,
  ...natureThemes,
  ...cosmicThemes,
  ...seasonalThemes,
  ...culturalThemes,
  ...moodThemes,
];

// Theme categories for filtering
export const themeCategories = [
  { id: 'all', name: 'All Themes', count: allThemes.length },
  { id: 'gothic', name: 'Gothic', count: gothicThemes.length },
  { id: 'nature', name: 'Nature', count: natureThemes.length },
  { id: 'cosmic', name: 'Cosmic', count: cosmicThemes.length },
  { id: 'seasonal', name: 'Seasonal', count: seasonalThemes.length },
  { id: 'cultural', name: 'Cultural', count: culturalThemes.length },
  { id: 'mood', name: 'Mood', count: moodThemes.length },
] as const;

// ============================================
// THEME CONTEXT
// ============================================
interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  setThemeById: (id: string) => void;
  themes: Theme[];
  getThemesByCategory: (category: string) => Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'unified-mega-app-theme';

// ============================================
// THEME PROVIDER
// ============================================
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'classic-gothic'
}) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    // Try to load from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) {
        const found = allThemes.find(t => t.id === saved);
        if (found) return found;
      }
    }
    // Fall back to default
    return allThemes.find(t => t.id === defaultTheme) || allThemes[0];
  });

  // Persist theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, currentTheme.id);
    }
  }, [currentTheme]);

  // Apply CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const { colors, effects } = currentTheme;

    // Set CSS custom properties
    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-background', colors.background);
    root.style.setProperty('--theme-background-gradient', colors.backgroundGradient || colors.background);
    root.style.setProperty('--theme-text', colors.text);
    root.style.setProperty('--theme-text-secondary', colors.textSecondary);
    root.style.setProperty('--theme-text-muted', colors.textMuted);
    root.style.setProperty('--theme-glow', effects.glow || 'none');
    root.style.setProperty('--theme-shadow', effects.shadow || 'none');
    root.style.setProperty('--theme-border-glow', effects.borderGlow || 'none');
    root.style.setProperty('--theme-text-shadow', effects.textShadow || 'none');
  }, [currentTheme]);

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const setThemeById = (id: string) => {
    const theme = allThemes.find(t => t.id === id);
    if (theme) {
      setCurrentTheme(theme);
    }
  };

  const getThemesByCategory = (category: string): Theme[] => {
    if (category === 'all') return allThemes;
    return allThemes.filter(t => t.category === category);
  };

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        setTheme,
        setThemeById,
        themes: allThemes,
        getThemesByCategory,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// ============================================
// USE THEME HOOK
// ============================================
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// ============================================
// THEME SELECTOR COMPONENT
// ============================================
interface ThemeSelectorProps {
  showCategories?: boolean;
  columns?: number;
  onThemeChange?: (theme: Theme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  showCategories = true,
  columns = 4,
  onThemeChange,
}) => {
  const { currentTheme, setTheme, getThemesByCategory } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const displayedThemes = getThemesByCategory(selectedCategory);

  const handleThemeSelect = (theme: Theme) => {
    setTheme(theme);
    onThemeChange?.(theme);
  };

  return (
    <div className="theme-selector" style={{ padding: '1rem' }}>
      {/* Category Filter */}
      {showCategories && (
        <div
          className="theme-categories"
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {themeCategories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                border: selectedCategory === category.id
                  ? `2px solid ${currentTheme.colors.primary}`
                  : '2px solid transparent',
                background: selectedCategory === category.id
                  ? currentTheme.colors.secondary
                  : 'rgba(255, 255, 255, 0.1)',
                color: currentTheme.colors.text,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem',
              }}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      )}

      {/* Theme Grid */}
      <div
        className="theme-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '1rem',
        }}
      >
        {displayedThemes.map(theme => (
          <div
            key={theme.id}
            onClick={() => handleThemeSelect(theme)}
            className="theme-preview"
            style={{
              cursor: 'pointer',
              borderRadius: '0.75rem',
              overflow: 'hidden',
              border: currentTheme.id === theme.id
                ? `3px solid ${theme.colors.primary}`
                : '3px solid transparent',
              boxShadow: currentTheme.id === theme.id
                ? theme.effects.glow
                : theme.effects.shadow,
              transition: 'all 0.3s ease',
            }}
          >
            {/* Color Preview */}
            <div
              style={{
                height: '80px',
                background: theme.colors.backgroundGradient || theme.colors.background,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
              }}
            >
              {/* Color Swatches */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: theme.colors.primary,
                  boxShadow: theme.effects.glow,
                }}
              />
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: theme.colors.secondary,
                }}
              />
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: theme.colors.accent,
                }}
              />
            </div>

            {/* Theme Info */}
            <div
              style={{
                padding: '0.75rem',
                background: theme.colors.background,
              }}
            >
              <h4
                style={{
                  margin: 0,
                  marginBottom: '0.25rem',
                  color: theme.colors.text,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textShadow: theme.effects.textShadow,
                }}
              >
                {theme.name}
              </h4>
              <p
                style={{
                  margin: 0,
                  color: theme.colors.textMuted,
                  fontSize: '0.75rem',
                  lineHeight: 1.4,
                }}
              >
                {theme.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
export const getThemeById = (id: string): Theme | undefined => {
  return allThemes.find(t => t.id === id);
};

export const getRandomTheme = (category?: string): Theme => {
  const themes = category ? allThemes.filter(t => t.category === category) : allThemes;
  return themes[Math.floor(Math.random() * themes.length)];
};

export const getThemeCSS = (theme: Theme): string => {
  return `
    :root {
      --theme-primary: ${theme.colors.primary};
      --theme-secondary: ${theme.colors.secondary};
      --theme-accent: ${theme.colors.accent};
      --theme-background: ${theme.colors.background};
      --theme-background-gradient: ${theme.colors.backgroundGradient || theme.colors.background};
      --theme-text: ${theme.colors.text};
      --theme-text-secondary: ${theme.colors.textSecondary};
      --theme-text-muted: ${theme.colors.textMuted};
      --theme-glow: ${theme.effects.glow || 'none'};
      --theme-shadow: ${theme.effects.shadow || 'none'};
      --theme-border-glow: ${theme.effects.borderGlow || 'none'};
      --theme-text-shadow: ${theme.effects.textShadow || 'none'};
    }
  `;
};

// Default export
export default {
  ThemeProvider,
  useTheme,
  ThemeSelector,
  allThemes,
  themeCategories,
  getThemeById,
  getRandomTheme,
  getThemeCSS,
};
