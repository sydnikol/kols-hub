/**
 * GOTHIC APARTMENT - COMPLETE IMMERSIVE EXPERIENCE
 * Your personalized digital sanctuary with every room fully realized
 */

import React, { useState, useEffect } from 'react';
import {
  Home, Sofa, Bed, Bath, ChefHat, Briefcase, Gamepad2, Palette,
  Flower2, Book, Moon, Music, Heart, Brain, DollarSign, Sparkles,
  Settings, Sun, Sunset, CloudMoon, Coffee, Wine, Tv, Monitor,
  Laptop, Shirt, Dumbbell, Pill, Phone, Camera, Scissors, Wand2,
  TreeDeciduous, Ghost, Star, Flame, Droplet, Wind, Mountain,
  X, ChevronRight, Volume2, Play, Eye, Lock, Unlock, Zap, Paintbrush
} from 'lucide-react';
import GothicThemeGenerator from '../components/GothicThemeGenerator';
import { GothicTheme, GOTHIC_THEMES, getRandomTheme } from '../data/gothic-apartment-themes';

// ============================================
// TYPES
// ============================================

interface Room {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  objects: RoomObject[];
  ambiance: Ambiance;
}

interface RoomObject {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  interactive: boolean;
  action?: () => void;
  linkedFeature?: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface Ambiance {
  lighting: 'bright' | 'dim' | 'candlelit' | 'neon' | 'moonlit';
  music?: string;
  scent?: string;
  temperature: 'cool' | 'warm' | 'cozy';
}

interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
}

// ============================================
// THEMES
// ============================================

const THEMES: Theme[] = [
  { id: 'gothic', name: 'Gothic Velvet', primary: '#2d1b4e', secondary: '#1a1a2e', accent: '#9333ea', background: '#0f0f17' },
  { id: 'midnight', name: 'Midnight Purple', primary: '#1e1b4b', secondary: '#312e81', accent: '#a78bfa', background: '#0c0a1d' },
  { id: 'blood', name: 'Blood Moon', primary: '#450a0a', secondary: '#7f1d1d', accent: '#ef4444', background: '#1c0505' },
  { id: 'emerald', name: 'Emerald Witch', primary: '#064e3b', secondary: '#065f46', accent: '#10b981', background: '#021c14' },
  { id: 'royal', name: 'Royal Gold', primary: '#422006', secondary: '#78350f', accent: '#f59e0b', background: '#1c0f02' },
  { id: 'ethereal', name: 'Ethereal Silver', primary: '#1f2937', secondary: '#374151', accent: '#9ca3af', background: '#111827' },
  { id: 'cosmic', name: 'Cosmic Void', primary: '#0c0a1d', secondary: '#1e1b4b', accent: '#8b5cf6', background: '#030208' },
  { id: 'forest', name: 'Dark Forest', primary: '#14532d', secondary: '#166534', accent: '#22c55e', background: '#052e16' },
];

// ============================================
// MAIN COMPONENT
// ============================================

const GothicApartmentPage: React.FC = () => {
  const [currentRoom, setCurrentRoom] = useState<string>('living');
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [gothicTheme, setGothicTheme] = useState<GothicTheme | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('evening');
  const [showSettings, setShowSettings] = useState(false);
  const [showThemeGenerator, setShowThemeGenerator] = useState(false);
  const [ambientSound, setAmbientSound] = useState(true);
  const [isLightsOn, setIsLightsOn] = useState(true);

  // Get active colors (prefer gothic theme if set)
  const activeColors = gothicTheme ? {
    primary: gothicTheme.colors.primary,
    secondary: gothicTheme.colors.secondary,
    accent: gothicTheme.colors.accent,
    background: gothicTheme.colors.background,
    surface: gothicTheme.colors.surface,
    text: gothicTheme.colors.text,
    glow: gothicTheme.colors.glow
  } : {
    primary: theme.primary,
    secondary: theme.secondary,
    accent: theme.accent,
    background: theme.background,
    surface: theme.secondary,
    text: '#ffffff',
    glow: theme.accent
  };

  // Handle theme selection from generator
  const handleGothicThemeSelect = (newTheme: GothicTheme) => {
    setGothicTheme(newTheme);
    localStorage.setItem('gothicApartmentTheme', JSON.stringify(newTheme));
  };

  // Load saved gothic theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('gothicApartmentTheme');
    if (saved) {
      try {
        setGothicTheme(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved theme');
      }
    }
  }, []);

  // ============================================
  // ROOMS DATA
  // ============================================

  const rooms: Room[] = [
    {
      id: 'living',
      name: 'Living Room',
      icon: <Sofa className="w-5 h-5" />,
      color: 'purple',
      description: 'A cozy gothic sanctuary with velvet furnishings and ambient candlelight',
      ambiance: { lighting: 'candlelit', music: 'dark ambient', scent: 'sandalwood', temperature: 'cozy' },
      objects: [
        {
          id: 'couch',
          name: 'Gothic Velvet Couch',
          icon: <Sofa className="w-6 h-6" />,
          description: 'A luxurious purple velvet couch with silver trim and throw pillows featuring moon phases',
          interactive: true,
          linkedFeature: '/mental-health',
          position: { x: 20, y: 40 },
          size: { width: 30, height: 15 }
        },
        {
          id: 'tv',
          name: '65" Smart TV',
          icon: <Tv className="w-6 h-6" />,
          description: 'Stream your favorite shows, connect to Hulu, or display ambient art',
          interactive: true,
          linkedFeature: '/entertainment',
          position: { x: 20, y: 10 },
          size: { width: 25, height: 15 }
        },
        {
          id: 'bookshelf',
          name: 'Floor-to-Ceiling Bookshelf',
          icon: <Book className="w-6 h-6" />,
          description: 'Dark mahogany shelves filled with grimoires, novels, and vintage books on herbalism and spirituality',
          interactive: true,
          linkedFeature: '/ideas-vault',
          position: { x: 70, y: 20 },
          size: { width: 15, height: 50 }
        },
        {
          id: 'altar',
          name: 'Ancestor Altar',
          icon: <Flame className="w-6 h-6" />,
          description: 'A small altar with candles, photos of ancestors, crystals, and offerings',
          interactive: true,
          linkedFeature: '/hoodoo-spiritual',
          position: { x: 5, y: 70 },
          size: { width: 15, height: 20 }
        },
        {
          id: 'plant',
          name: 'Monstera Deliciosa',
          icon: <Flower2 className="w-6 h-6" />,
          description: 'A thriving monstera in a black ceramic pot, bringing life to the space',
          interactive: false,
          position: { x: 55, y: 35 },
          size: { width: 10, height: 15 }
        },
        {
          id: 'rug',
          name: 'Persian Rug',
          icon: <Sparkles className="w-6 h-6" />,
          description: 'Deep purple and gold Persian rug with intricate celestial patterns',
          interactive: false,
          position: { x: 25, y: 55 },
          size: { width: 35, height: 25 }
        }
      ]
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      icon: <Bed className="w-5 h-5" />,
      color: 'indigo',
      description: 'Your personal sanctuary for rest and dreams',
      ambiance: { lighting: 'moonlit', music: 'sleep sounds', scent: 'lavender', temperature: 'cool' },
      objects: [
        {
          id: 'bed',
          name: 'King Size Canopy Bed',
          icon: <Bed className="w-6 h-6" />,
          description: 'Black iron canopy bed with purple velvet curtains and silk sheets. Moon phase fairy lights draped across the canopy.',
          interactive: true,
          linkedFeature: '/sleep-tracking',
          position: { x: 30, y: 30 },
          size: { width: 40, height: 35 }
        },
        {
          id: 'nightstand',
          name: 'Nightstand',
          icon: <Moon className="w-6 h-6" />,
          description: 'Victorian nightstand with charging station, journal, and selenite crystal',
          interactive: true,
          linkedFeature: '/journaling',
          position: { x: 10, y: 40 },
          size: { width: 12, height: 15 }
        },
        {
          id: 'desk',
          name: 'Work Desk',
          icon: <Laptop className="w-6 h-6" />,
          description: 'L-shaped desk with dual monitors, mechanical keyboard, and ambient RGB lighting',
          interactive: true,
          linkedFeature: '/passive-income',
          position: { x: 65, y: 10 },
          size: { width: 30, height: 25 }
        },
        {
          id: 'closet',
          name: 'Walk-in Closet',
          icon: <Shirt className="w-6 h-6" />,
          description: 'Gothic wardrobe organized by season - velvet, lace, combat boots, and silver jewelry',
          interactive: true,
          linkedFeature: '/fashion',
          position: { x: 5, y: 5 },
          size: { width: 20, height: 25 }
        },
        {
          id: 'mirror',
          name: 'Full-Length Mirror',
          icon: <Eye className="w-6 h-6" />,
          description: 'Ornate Victorian mirror with LED lights - perfect for outfit checks and self-affirmations',
          interactive: true,
          linkedFeature: '/mental-health',
          position: { x: 5, y: 65 },
          size: { width: 10, height: 30 }
        },
        {
          id: 'gallery',
          name: 'Gallery Wall',
          icon: <Camera className="w-6 h-6" />,
          description: 'Collection of art prints - celestial maps, botanical illustrations, and personal photos',
          interactive: true,
          linkedFeature: '/memories',
          position: { x: 30, y: 5 },
          size: { width: 30, height: 15 }
        }
      ]
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      icon: <ChefHat className="w-5 h-5" />,
      color: 'amber',
      description: 'Modern kitchen with low-sodium meal prep station',
      ambiance: { lighting: 'bright', music: 'lo-fi', scent: 'herbs', temperature: 'warm' },
      objects: [
        {
          id: 'stove',
          name: '4-Burner Gas Stove',
          icon: <Flame className="w-6 h-6" />,
          description: 'Professional-grade stove with cast iron grates. Timer integration for medication reminders.',
          interactive: true,
          linkedFeature: '/cooking',
          position: { x: 40, y: 10 },
          size: { width: 20, height: 15 }
        },
        {
          id: 'fridge',
          name: 'Smart Refrigerator',
          icon: <Droplet className="w-6 h-6" />,
          description: 'Tracks groceries, suggests low-sodium recipes, and monitors hydration needs',
          interactive: true,
          linkedFeature: '/food-hub',
          position: { x: 70, y: 10 },
          size: { width: 20, height: 35 }
        },
        {
          id: 'island',
          name: 'Kitchen Island',
          icon: <ChefHat className="w-6 h-6" />,
          description: 'Black marble countertop with bar stools. Herb garden built into the surface.',
          interactive: true,
          linkedFeature: '/nutrition',
          position: { x: 30, y: 45 },
          size: { width: 35, height: 20 }
        },
        {
          id: 'pantry',
          name: 'Pantry',
          icon: <Coffee className="w-6 h-6" />,
          description: 'Organized shelves with low-sodium staples, herbal teas, and magical ingredients',
          interactive: true,
          linkedFeature: '/kitchen-witch',
          position: { x: 5, y: 20 },
          size: { width: 15, height: 30 }
        },
        {
          id: 'sink',
          name: 'Farm Sink',
          icon: <Droplet className="w-6 h-6" />,
          description: 'Deep black ceramic sink with filtered water dispenser',
          interactive: false,
          position: { x: 15, y: 10 },
          size: { width: 15, height: 10 }
        },
        {
          id: 'coffee',
          name: 'Coffee & Tea Station',
          icon: <Coffee className="w-6 h-6" />,
          description: 'Espresso machine, electric kettle, and organized tea collection',
          interactive: true,
          position: { x: 5, y: 60 },
          size: { width: 20, height: 15 }
        }
      ]
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      icon: <Bath className="w-5 h-5" />,
      color: 'teal',
      description: 'Spa-like sanctuary for self-care rituals',
      ambiance: { lighting: 'dim', music: 'rain sounds', scent: 'eucalyptus', temperature: 'warm' },
      objects: [
        {
          id: 'tub',
          name: 'Soaking Tub',
          icon: <Bath className="w-6 h-6" />,
          description: 'Freestanding black clawfoot tub with jets, bath salts, and waterproof pillow',
          interactive: true,
          linkedFeature: '/wellness',
          position: { x: 50, y: 30 },
          size: { width: 35, height: 25 }
        },
        {
          id: 'shower',
          name: 'Rain Shower',
          icon: <Droplet className="w-6 h-6" />,
          description: 'Walk-in shower with rainfall head, handheld sprayer, and eucalyptus bundle',
          interactive: true,
          position: { x: 10, y: 10 },
          size: { width: 25, height: 30 }
        },
        {
          id: 'vanity',
          name: 'Double Vanity',
          icon: <Sparkles className="w-6 h-6" />,
          description: 'Black marble countertop with LED mirror, skincare organizers, and crystal collection',
          interactive: true,
          linkedFeature: '/health',
          position: { x: 40, y: 10 },
          size: { width: 30, height: 15 }
        },
        {
          id: 'plants',
          name: 'Bathroom Garden',
          icon: <Flower2 className="w-6 h-6" />,
          description: 'Hanging pothos, snake plants, and orchids thriving in the humidity',
          interactive: false,
          position: { x: 80, y: 60 },
          size: { width: 15, height: 25 }
        },
        {
          id: 'medicine',
          name: 'Medicine Cabinet',
          icon: <Pill className="w-6 h-6" />,
          description: 'Organized medication storage with reminder integration and refill tracking',
          interactive: true,
          linkedFeature: '/health',
          position: { x: 75, y: 10 },
          size: { width: 15, height: 20 }
        }
      ]
    },
    {
      id: 'office',
      name: 'Office & Finance Hub',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'emerald',
      description: 'Command center for productivity and financial growth',
      ambiance: { lighting: 'bright', music: 'focus', scent: 'peppermint', temperature: 'cool' },
      objects: [
        {
          id: 'command',
          name: 'Financial Command Center',
          icon: <Monitor className="w-6 h-6" />,
          description: 'Triple monitor setup tracking investments, passive income streams, and budgets in real-time',
          interactive: true,
          linkedFeature: '/finance',
          position: { x: 30, y: 10 },
          size: { width: 40, height: 20 }
        },
        {
          id: 'budget-wall',
          name: 'Budget Visualization Wall',
          icon: <DollarSign className="w-6 h-6" />,
          description: 'Large display showing income vs expenses, savings goals, and debt payoff progress',
          interactive: true,
          linkedFeature: '/budgeting',
          position: { x: 5, y: 10 },
          size: { width: 20, height: 30 }
        },
        {
          id: 'income-board',
          name: 'Passive Income Board',
          icon: <Zap className="w-6 h-6" />,
          description: '1000 passive income ideas organized by category, effort, and potential earnings',
          interactive: true,
          linkedFeature: '/passive-income',
          position: { x: 75, y: 10 },
          size: { width: 20, height: 35 }
        },
        {
          id: 'standing-desk',
          name: 'Standing Desk',
          icon: <Laptop className="w-6 h-6" />,
          description: 'Adjustable height desk with anti-fatigue mat and monitor arm',
          interactive: true,
          linkedFeature: '/content-monetization',
          position: { x: 30, y: 40 },
          size: { width: 35, height: 20 }
        },
        {
          id: 'safe',
          name: 'Document Safe',
          icon: <Lock className="w-6 h-6" />,
          description: 'Fireproof safe for important documents, backup drives, and emergency cash',
          interactive: true,
          position: { x: 5, y: 60 },
          size: { width: 15, height: 20 }
        },
        {
          id: 'advocacy',
          name: 'Advocacy Station',
          icon: <Heart className="w-6 h-6" />,
          description: '300-lesson self-advocacy curriculum, emergency scripts, and medical documentation',
          interactive: true,
          linkedFeature: '/advocacy',
          position: { x: 50, y: 65 },
          size: { width: 30, height: 20 }
        }
      ]
    },
    {
      id: 'entertainment',
      name: 'Entertainment Hub',
      icon: <Gamepad2 className="w-5 h-5" />,
      color: 'rose',
      description: 'Ultimate gaming and media room',
      ambiance: { lighting: 'neon', music: 'gaming', scent: 'none', temperature: 'cool' },
      objects: [
        {
          id: 'gaming-pc',
          name: 'Gaming Setup',
          icon: <Monitor className="w-6 h-6" />,
          description: 'High-end gaming PC with triple monitors, RGB everything, and ergonomic chair',
          interactive: true,
          linkedFeature: '/gaming',
          position: { x: 60, y: 10 },
          size: { width: 35, height: 25 }
        },
        {
          id: 'consoles',
          name: 'Console Station',
          icon: <Gamepad2 className="w-6 h-6" />,
          description: 'PS5, Xbox Series X, and Nintendo Switch with organized game library',
          interactive: true,
          linkedFeature: '/gaming',
          position: { x: 5, y: 10 },
          size: { width: 25, height: 20 }
        },
        {
          id: 'theater',
          name: 'Home Theater',
          icon: <Tv className="w-6 h-6" />,
          description: '120" projector screen with surround sound, blackout curtains, and movie lighting',
          interactive: true,
          linkedFeature: '/entertainment',
          position: { x: 30, y: 5 },
          size: { width: 25, height: 15 }
        },
        {
          id: 'dnd-table',
          name: 'D&D Gaming Table',
          icon: <Wand2 className="w-6 h-6" />,
          description: 'Custom table with built-in screen for maps, dice trays, and character sheet holders',
          interactive: true,
          linkedFeature: '/dnd',
          position: { x: 25, y: 45 },
          size: { width: 40, height: 30 }
        },
        {
          id: 'vr',
          name: 'VR Corner',
          icon: <Eye className="w-6 h-6" />,
          description: 'Meta Quest 3 with clear play space and charging station',
          interactive: true,
          position: { x: 5, y: 45 },
          size: { width: 18, height: 20 }
        },
        {
          id: 'board-games',
          name: 'Board Game Library',
          icon: <Star className="w-6 h-6" />,
          description: 'Organized collection of cooperative games, sorted by play time and player count',
          interactive: true,
          linkedFeature: '/board-games',
          position: { x: 75, y: 45 },
          size: { width: 20, height: 35 }
        }
      ]
    },
    {
      id: 'creative',
      name: 'Creative Studio',
      icon: <Palette className="w-5 h-5" />,
      color: 'orange',
      description: 'Multi-purpose creative space for art, music, and crafts',
      ambiance: { lighting: 'bright', music: 'creative', scent: 'citrus', temperature: 'warm' },
      objects: [
        {
          id: 'art-desk',
          name: 'Digital Art Workstation',
          icon: <Palette className="w-6 h-6" />,
          description: 'Wacom tablet, color-accurate monitor, and organized digital art supplies',
          interactive: true,
          linkedFeature: '/creative-arts',
          position: { x: 10, y: 10 },
          size: { width: 30, height: 25 }
        },
        {
          id: 'music',
          name: 'Music Production Station',
          icon: <Music className="w-6 h-6" />,
          description: 'MIDI keyboard, studio monitors, microphone, and DAW setup',
          interactive: true,
          linkedFeature: '/music',
          position: { x: 55, y: 10 },
          size: { width: 35, height: 25 }
        },
        {
          id: 'sewing',
          name: 'Sewing Corner',
          icon: <Scissors className="w-6 h-6" />,
          description: 'Sewing machine, serger, fabric storage, and pattern organization system',
          interactive: true,
          linkedFeature: '/sewing-studio',
          position: { x: 10, y: 50 },
          size: { width: 30, height: 30 }
        },
        {
          id: 'photo',
          name: 'Photography Setup',
          icon: <Camera className="w-6 h-6" />,
          description: 'Lighting kit, backdrop options, and product photography station',
          interactive: true,
          linkedFeature: '/content-monetization',
          position: { x: 55, y: 50 },
          size: { width: 25, height: 25 }
        },
        {
          id: 'inspiration',
          name: 'Inspiration Board',
          icon: <Sparkles className="w-6 h-6" />,
          description: 'Rotating display of mood boards, color palettes, and creative references',
          interactive: true,
          linkedFeature: '/ideas-vault',
          position: { x: 45, y: 35 },
          size: { width: 15, height: 20 }
        },
        {
          id: 'supplies',
          name: 'Art Supply Cabinet',
          icon: <Palette className="w-6 h-6" />,
          description: 'Organized storage for paints, brushes, papers, and craft supplies',
          interactive: false,
          position: { x: 85, y: 50 },
          size: { width: 12, height: 30 }
        }
      ]
    },
    {
      id: 'garden',
      name: 'Heritage Garden',
      icon: <Flower2 className="w-5 h-5" />,
      color: 'green',
      description: 'Sacred outdoor space for ancestral connection and spiritual practice',
      ambiance: { lighting: 'moonlit', music: 'nature', scent: 'earth', temperature: 'cool' },
      objects: [
        {
          id: 'family-tree',
          name: 'Family Heritage Tree',
          icon: <TreeDeciduous className="w-6 h-6" />,
          description: 'Interactive 3D visualization of your ancestry spanning generations',
          interactive: true,
          linkedFeature: '/ancestry',
          position: { x: 40, y: 30 },
          size: { width: 25, height: 30 }
        },
        {
          id: 'altar',
          name: 'Hoodoo Spiritual Altar',
          icon: <Flame className="w-6 h-6" />,
          description: '200+ practices library with herbs, candles, mojo bags, and ritual supplies',
          interactive: true,
          linkedFeature: '/hoodoo-spiritual',
          position: { x: 10, y: 20 },
          size: { width: 25, height: 25 }
        },
        {
          id: 'memorial',
          name: 'Ancestor Memorial',
          icon: <Ghost className="w-6 h-6" />,
          description: 'Stone bench surrounded by flowers planted in memory of those who came before',
          interactive: true,
          linkedFeature: '/ancestry',
          position: { x: 70, y: 40 },
          size: { width: 20, height: 20 }
        },
        {
          id: 'herb-garden',
          name: 'Magical Herb Garden',
          icon: <Flower2 className="w-6 h-6" />,
          description: 'Lavender, rosemary, sage, mugwort, and other herbs for cooking and rituals',
          interactive: true,
          linkedFeature: '/kitchen-witch',
          position: { x: 10, y: 55 },
          size: { width: 30, height: 25 }
        },
        {
          id: 'meditation',
          name: 'Meditation Circle',
          icon: <Moon className="w-6 h-6" />,
          description: 'Stone circle with cushions for meditation, grounding, and moon rituals',
          interactive: true,
          linkedFeature: '/mental-health',
          position: { x: 50, y: 65 },
          size: { width: 25, height: 20 }
        },
        {
          id: 'water',
          name: 'Water Feature',
          icon: <Droplet className="w-6 h-6" />,
          description: 'Small fountain with smooth stones, creating soothing ambient sounds',
          interactive: false,
          position: { x: 75, y: 15 },
          size: { width: 15, height: 15 }
        }
      ]
    }
  ];

  const currentRoomData = rooms.find(r => r.id === currentRoom) || rooms[0];

  // Time of day effects
  const getTimeOverlay = () => {
    switch (timeOfDay) {
      case 'morning': return 'from-orange-500/10 to-transparent';
      case 'afternoon': return 'from-yellow-500/5 to-transparent';
      case 'evening': return 'from-purple-500/20 to-indigo-900/30';
      case 'night': return 'from-indigo-900/40 to-black/50';
    }
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ background: activeColors.background }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: activeColors.accent }}
          >
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">{currentRoomData.name}</h1>
            <p className="text-xs text-gray-500">{currentRoomData.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Time of day */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
            {[
              { time: 'morning', icon: <Sun className="w-4 h-4" /> },
              { time: 'afternoon', icon: <Sun className="w-4 h-4" /> },
              { time: 'evening', icon: <Sunset className="w-4 h-4" /> },
              { time: 'night', icon: <Moon className="w-4 h-4" /> }
            ].map(({ time, icon }) => (
              <button
                key={time}
                onClick={() => setTimeOfDay(time as any)}
                className={`p-2 rounded-lg transition-colors ${
                  timeOfDay === time ? 'bg-gray-700' : 'hover:bg-gray-700/50'
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          {/* Lights toggle */}
          <button
            onClick={() => setIsLightsOn(!isLightsOn)}
            className={`p-2 rounded-lg transition-colors ${
              isLightsOn ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800'
            }`}
          >
            {isLightsOn ? <Zap className="w-5 h-5" /> : <CloudMoon className="w-5 h-5" />}
          </button>

          {/* Sound toggle */}
          <button
            onClick={() => setAmbientSound(!ambientSound)}
            className={`p-2 rounded-lg transition-colors ${
              ambientSound ? 'text-purple-400' : 'text-gray-500'
            }`}
          >
            <Volume2 className="w-5 h-5" />
          </button>

          {/* Theme Generator Button */}
          <button
            onClick={() => setShowThemeGenerator(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg transition-all"
            style={{ boxShadow: `0 0 20px ${activeColors.glow}40` }}
          >
            <Paintbrush className="w-4 h-4" />
            <span className="text-sm font-medium">Themes</span>
            <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">115+</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Room navigation */}
        <div className="w-20 border-r border-gray-800/50 p-2 space-y-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setCurrentRoom(room.id)}
              className={`w-full p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                currentRoom === room.id
                  ? 'bg-purple-600/20 border border-purple-500/30'
                  : 'hover:bg-gray-800/50'
              }`}
            >
              {room.icon}
              <span className="text-xs truncate w-full text-center">{room.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Main room view */}
        <div className="flex-1 p-6 relative">
          {/* Time overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${getTimeOverlay()} pointer-events-none transition-all duration-1000`}
          />

          {/* Room visualization */}
          <div
            className="relative w-full h-[600px] rounded-2xl overflow-hidden border border-gray-800/50"
            style={{ background: `linear-gradient(135deg, ${activeColors.primary} 0%, ${activeColors.secondary} 100%)` }}
          >
            {/* Room objects */}
            {currentRoomData.objects.map((obj) => (
              <button
                key={obj.id}
                onClick={() => obj.interactive && setSelectedObject(obj)}
                className={`absolute rounded-xl transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                  obj.interactive
                    ? 'hover:scale-110 hover:shadow-lg cursor-pointer'
                    : 'cursor-default opacity-70'
                } ${
                  selectedObject?.id === obj.id
                    ? 'ring-2 ring-purple-400 shadow-xl shadow-purple-500/30'
                    : ''
                }`}
                style={{
                  left: `${obj.position.x}%`,
                  top: `${obj.position.y}%`,
                  width: `${obj.size.width}%`,
                  height: `${obj.size.height}%`,
                  background: `rgba(0,0,0,${isLightsOn ? 0.3 : 0.5})`,
                  backdropFilter: 'blur(4px)'
                }}
              >
                <div className="text-purple-400">{obj.icon}</div>
                <span className="text-xs text-center px-2 line-clamp-2">{obj.name}</span>
                {obj.interactive && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                )}
              </button>
            ))}

            {/* Ambient lighting effect */}
            {!isLightsOn && (
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50 pointer-events-none" />
            )}
          </div>

          {/* Ambiance info */}
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {currentRoomData.ambiance.lighting}
            </span>
            <span className="flex items-center gap-1">
              <Music className="w-4 h-4" />
              {currentRoomData.ambiance.music || 'none'}
            </span>
            <span className="flex items-center gap-1">
              <Wind className="w-4 h-4" />
              {currentRoomData.ambiance.scent || 'none'}
            </span>
          </div>
        </div>

        {/* Object detail panel */}
        {selectedObject && (
          <div className="w-80 border-l border-gray-800/50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{selectedObject.name}</h3>
              <button
                onClick={() => setSelectedObject(null)}
                className="p-1 hover:bg-gray-800 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div
                className="w-full h-40 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${activeColors.primary} 0%, ${activeColors.secondary} 100%)` }}
              >
                <div className="text-purple-400 transform scale-150">{selectedObject.icon}</div>
              </div>

              <p className="text-gray-400 text-sm">{selectedObject.description}</p>

              {selectedObject.linkedFeature && (
                <a
                  href={selectedObject.linkedFeature}
                  className="block w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-center font-semibold transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    Open Feature
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </a>
              )}

              <div className="text-xs text-gray-600">
                Click to interact with this object or access its connected features
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Theme selector modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Apartment Settings</h2>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Theme</h3>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t)}
                      className={`p-3 rounded-lg flex items-center gap-3 transition-all ${
                        theme.id === t.id
                          ? 'ring-2 ring-purple-500'
                          : 'hover:bg-gray-800'
                      }`}
                      style={{ background: t.secondary }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg"
                        style={{ background: t.accent }}
                      />
                      <span className="text-sm">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Quick Navigation</h3>
                <div className="grid grid-cols-3 gap-2">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => {
                        setCurrentRoom(room.id);
                        setShowSettings(false);
                      }}
                      className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm flex flex-col items-center gap-2"
                    >
                      {room.icon}
                      {room.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gothic Theme Generator */}
      <GothicThemeGenerator
        isOpen={showThemeGenerator}
        onClose={() => setShowThemeGenerator(false)}
        onThemeSelect={handleGothicThemeSelect}
        currentTheme={gothicTheme || undefined}
      />

      {/* Current Theme Info Bar */}
      {gothicTheme && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-3 shadow-lg backdrop-blur-sm z-40"
          style={{
            backgroundColor: `${gothicTheme.colors.surface}dd`,
            border: `1px solid ${gothicTheme.colors.accent}40`
          }}
        >
          <div className="flex gap-1">
            {[gothicTheme.colors.primary, gothicTheme.colors.accent, gothicTheme.colors.glow].map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span style={{ color: gothicTheme.colors.text }} className="text-sm font-medium">
            {gothicTheme.name}
          </span>
          <span style={{ color: gothicTheme.colors.textMuted }} className="text-xs">
            {gothicTheme.ambiance.mood}
          </span>
          <button
            onClick={() => setShowThemeGenerator(true)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            style={{ color: gothicTheme.colors.accent }}
          >
            <Paintbrush className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GothicApartmentPage;
