/**
 * DETAILED 2D APARTMENT - FULLY VISIBLE & INTERACTIVE
 * Every room, every object, every detail rendered beautifully
 */

import React, { useState } from 'react';
import { Home, Sofa, Utensils, Bed, Monitor, Bath, Sparkles, Sun, Moon, Coffee, Music, Book, Heart, Tv, ShoppingCart, Palette, DollarSign, TrendingUp, Briefcase, PieChart, Gamepad2, Film, Dices, Activity, Brain, Stethoscope, Mic, Radio, Paintbrush, Camera, Trees, Flower2, Bird, CloudRain, Users2, GitBranch, Flame, Ghost, Star, Zap, Circle } from 'lucide-react';

interface RoomObject {
  id: string;
  name: string;
  x: number; // percentage
  y: number; // percentage
  width: number;
  height: number;
  color: string;
  icon?: any;
  interactive?: boolean;
  onClick?: () => void;
  details?: string;
}

interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  wallColor: string;
  floorColor: string;
  objects: RoomObject[];
  mood?: string;
}

interface ApartmentTheme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
}

const themes: ApartmentTheme[] = [
  // Original 8 themes
  { name: 'Gothic Purple', primaryColor: '#6d28d9', secondaryColor: '#4a1942', accentColor: '#a855f7', backgroundColor: '#1a1a2e', textColor: '#e0e0e0' },
  { name: 'Cyberpunk Neon', primaryColor: '#00ffff', secondaryColor: '#ff00ff', accentColor: '#ffff00', backgroundColor: '#0a0a1a', textColor: '#00ff00' },
  { name: 'Forest Green', primaryColor: '#2a4a2a', secondaryColor: '#1a3a1a', accentColor: '#4a7a4a', backgroundColor: '#0a1a0a', textColor: '#d0e0d0' },
  { name: 'Ocean Blue', primaryColor: '#1e3a8a', secondaryColor: '#1e40af', accentColor: '#3b82f6', backgroundColor: '#0f172a', textColor: '#dbeafe' },
  { name: 'Sunset Orange', primaryColor: '#ea580c', secondaryColor: '#c2410c', accentColor: '#fb923c', backgroundColor: '#1a0f0a', textColor: '#fed7aa' },
  { name: 'Rose Gold', primaryColor: '#be185d', secondaryColor: '#9f1239', accentColor: '#f472b6', backgroundColor: '#1a0a14', textColor: '#fce7f3' },
  { name: 'Midnight Blue', primaryColor: '#1e293b', secondaryColor: '#0f172a', accentColor: '#334155', backgroundColor: '#020617', textColor: '#cbd5e1' },
  { name: 'Warm Beige', primaryColor: '#92400e', secondaryColor: '#78350f', accentColor: '#d97706', backgroundColor: '#1c1917', textColor: '#fef3c7' },

  // Gothic & Dark themes (10)
  { name: 'Vampire Red', primaryColor: '#7f1d1d', secondaryColor: '#450a0a', accentColor: '#dc2626', backgroundColor: '#1a0505', textColor: '#fecaca' },
  { name: 'Shadow Black', primaryColor: '#18181b', secondaryColor: '#09090b', accentColor: '#52525b', backgroundColor: '#000000', textColor: '#fafafa' },
  { name: 'Blood Moon', primaryColor: '#991b1b', secondaryColor: '#7f1d1d', accentColor: '#f87171', backgroundColor: '#1a0a0a', textColor: '#fee2e2' },
  { name: 'Obsidian', primaryColor: '#1c1917', secondaryColor: '#0c0a09', accentColor: '#78716c', backgroundColor: '#0a0908', textColor: '#e7e5e4' },
  { name: 'Dark Velvet', primaryColor: '#4c1d95', secondaryColor: '#2e1065', accentColor: '#8b5cf6', backgroundColor: '#1a0f2e', textColor: '#ddd6fe' },
  { name: 'Raven Wing', primaryColor: '#27272a', secondaryColor: '#18181b', accentColor: '#71717a', backgroundColor: '#0a0a0b', textColor: '#e4e4e7' },
  { name: 'Midnight Purple', primaryColor: '#581c87', secondaryColor: '#3b0764', accentColor: '#a855f7', backgroundColor: '#1a0a2e', textColor: '#e9d5ff' },
  { name: 'Charcoal', primaryColor: '#374151', secondaryColor: '#1f2937', accentColor: '#9ca3af', backgroundColor: '#111827', textColor: '#f3f4f6' },
  { name: 'Onyx', primaryColor: '#292524', secondaryColor: '#1c1917', accentColor: '#78716c', backgroundColor: '#0f0e0d', textColor: '#e7e5e4' },
  { name: 'Dark Plum', primaryColor: '#701a75', secondaryColor: '#4a044e', accentColor: '#c026d3', backgroundColor: '#1a0a1d', textColor: '#f5d0fe' },

  // Vibrant & Neon themes (10)
  { name: 'Electric Blue', primaryColor: '#0ea5e9', secondaryColor: '#0369a1', accentColor: '#38bdf8', backgroundColor: '#0c1a2a', textColor: '#e0f2fe' },
  { name: 'Hot Pink', primaryColor: '#ec4899', secondaryColor: '#be185d', accentColor: '#f9a8d4', backgroundColor: '#1a0a14', textColor: '#fce7f3' },
  { name: 'Lime Green', primaryColor: '#84cc16', secondaryColor: '#4d7c0f', accentColor: '#bef264', backgroundColor: '#0a1a05', textColor: '#ecfccb' },
  { name: 'Neon Purple', primaryColor: '#a855f7', secondaryColor: '#7e22ce', accentColor: '#c084fc', backgroundColor: '#1a0a2e', textColor: '#e9d5ff' },
  { name: 'Cyan Glow', primaryColor: '#06b6d4', secondaryColor: '#0e7490', accentColor: '#67e8f9', backgroundColor: '#0a1a1d', textColor: '#cffafe' },
  { name: 'Magenta', primaryColor: '#d946ef', secondaryColor: '#a21caf', accentColor: '#e879f9', backgroundColor: '#1d0a1a', textColor: '#f5d0fe' },
  { name: 'Toxic Green', primaryColor: '#22c55e', secondaryColor: '#16a34a', accentColor: '#4ade80', backgroundColor: '#0a1a0f', textColor: '#dcfce7' },
  { name: 'Bright Orange', primaryColor: '#f97316', secondaryColor: '#c2410c', accentColor: '#fb923c', backgroundColor: '#1a0f05', textColor: '#fed7aa' },
  { name: 'Laser Red', primaryColor: '#ef4444', secondaryColor: '#b91c1c', accentColor: '#f87171', backgroundColor: '#1a0a0a', textColor: '#fee2e2' },
  { name: 'Neon Yellow', primaryColor: '#eab308', secondaryColor: '#a16207', accentColor: '#fde047', backgroundColor: '#1a1a05', textColor: '#fef9c3' },

  // Pastel & Soft themes (10)
  { name: 'Soft Pink', primaryColor: '#f9a8d4', secondaryColor: '#f472b6', accentColor: '#fbcfe8', backgroundColor: '#fce7f3', textColor: '#4a044e' },
  { name: 'Baby Blue', primaryColor: '#93c5fd', secondaryColor: '#60a5fa', accentColor: '#bfdbfe', backgroundColor: '#dbeafe', textColor: '#1e3a8a' },
  { name: 'Mint Cream', primaryColor: '#86efac', secondaryColor: '#4ade80', accentColor: '#bbf7d0', backgroundColor: '#dcfce7', textColor: '#14532d' },
  { name: 'Lavender Dream', primaryColor: '#c4b5fd', secondaryColor: '#a78bfa', accentColor: '#ddd6fe', backgroundColor: '#ede9fe', textColor: '#4c1d95' },
  { name: 'Peach', primaryColor: '#fdba74', secondaryColor: '#fb923c', accentColor: '#fed7aa', backgroundColor: '#ffedd5', textColor: '#7c2d12' },
  { name: 'Lilac', primaryColor: '#e9d5ff', secondaryColor: '#d8b4fe', accentColor: '#f3e8ff', backgroundColor: '#fae8ff', textColor: '#581c87' },
  { name: 'Sky Blue', primaryColor: '#7dd3fc', secondaryColor: '#38bdf8', accentColor: '#bae6fd', backgroundColor: '#e0f2fe', textColor: '#075985' },
  { name: 'Lemon', primaryColor: '#fde047', secondaryColor: '#facc15', accentColor: '#fef08a', backgroundColor: '#fef9c3', textColor: '#713f12' },
  { name: 'Coral', primaryColor: '#fca5a5', secondaryColor: '#f87171', accentColor: '#fecaca', backgroundColor: '#fee2e2', textColor: '#7f1d1d' },
  { name: 'Aqua', primaryColor: '#5eead4', secondaryColor: '#2dd4bf', accentColor: '#99f6e4', backgroundColor: '#ccfbf1', textColor: '#134e4a' },

  // Earth & Natural themes (10)
  { name: 'Terra Cotta', primaryColor: '#c2410c', secondaryColor: '#9a3412', accentColor: '#fb923c', backgroundColor: '#1c1917', textColor: '#fed7aa' },
  { name: 'Sage Green', primaryColor: '#84cc16', secondaryColor: '#65a30d', accentColor: '#a3e635', backgroundColor: '#1a2e05', textColor: '#d9f99d' },
  { name: 'Clay Brown', primaryColor: '#92400e', secondaryColor: '#78350f', accentColor: '#d97706', backgroundColor: '#1c1917', textColor: '#fef3c7' },
  { name: 'Moss', primaryColor: '#4d7c0f', secondaryColor: '#3f6212', accentColor: '#84cc16', backgroundColor: '#14190a', textColor: '#d9f99d' },
  { name: 'Sand', primaryColor: '#ca8a04', secondaryColor: '#a16207', accentColor: '#eab308', backgroundColor: '#1c1917', textColor: '#fef9c3' },
  { name: 'Stone Gray', primaryColor: '#6b7280', secondaryColor: '#4b5563', accentColor: '#9ca3af', backgroundColor: '#1f2937', textColor: '#f3f4f6' },
  { name: 'Olive', primaryColor: '#65a30d', secondaryColor: '#4d7c0f', accentColor: '#84cc16', backgroundColor: '#14190a', textColor: '#d9f99d' },
  { name: 'Rust', primaryColor: '#c2410c', secondaryColor: '#9a3412', accentColor: '#f97316', backgroundColor: '#1a0f05', textColor: '#fed7aa' },
  { name: 'Slate', primaryColor: '#475569', secondaryColor: '#334155', accentColor: '#64748b', backgroundColor: '#1e293b', textColor: '#cbd5e1' },
  { name: 'Bark', primaryColor: '#78350f', secondaryColor: '#57260c', accentColor: '#92400e', backgroundColor: '#1c1917', textColor: '#fef3c7' },

  // Jewel tones (10)
  { name: 'Sapphire', primaryColor: '#1e40af', secondaryColor: '#1e3a8a', accentColor: '#3b82f6', backgroundColor: '#0f172a', textColor: '#dbeafe' },
  { name: 'Emerald', primaryColor: '#059669', secondaryColor: '#047857', accentColor: '#10b981', backgroundColor: '#0a1a14', textColor: '#d1fae5' },
  { name: 'Ruby', primaryColor: '#be123c', secondaryColor: '#9f1239', accentColor: '#fb7185', backgroundColor: '#1a0a0f', textColor: '#fecdd3' },
  { name: 'Amethyst', primaryColor: '#7e22ce', secondaryColor: '#6b21a8', accentColor: '#a855f7', backgroundColor: '#1a0a2e', textColor: '#e9d5ff' },
  { name: 'Topaz', primaryColor: '#d97706', secondaryColor: '#b45309', accentColor: '#fbbf24', backgroundColor: '#1a140a', textColor: '#fef3c7' },
  { name: 'Garnet', primaryColor: '#991b1b', secondaryColor: '#7f1d1d', accentColor: '#dc2626', backgroundColor: '#1a0505', textColor: '#fecaca' },
  { name: 'Aquamarine', primaryColor: '#0891b2', secondaryColor: '#0e7490', accentColor: '#22d3ee', backgroundColor: '#0a1a1d', textColor: '#cffafe' },
  { name: 'Peridot', primaryColor: '#65a30d', secondaryColor: '#4d7c0f', accentColor: '#a3e635', backgroundColor: '#14190a', textColor: '#d9f99d' },
  { name: 'Citrine', primaryColor: '#ca8a04', secondaryColor: '#a16207', accentColor: '#fbbf24', backgroundColor: '#1a140a', textColor: '#fef9c3' },
  { name: 'Jade', primaryColor: '#14b8a6', secondaryColor: '#0f766e', accentColor: '#2dd4bf', backgroundColor: '#0a1a14', textColor: '#99f6e4' },

  // Monochrome & Grayscale (10)
  { name: 'Pure White', primaryColor: '#f9fafb', secondaryColor: '#f3f4f6', accentColor: '#ffffff', backgroundColor: '#ffffff', textColor: '#111827' },
  { name: 'Light Gray', primaryColor: '#e5e7eb', secondaryColor: '#d1d5db', accentColor: '#f3f4f6', backgroundColor: '#f9fafb', textColor: '#374151' },
  { name: 'Medium Gray', primaryColor: '#9ca3af', secondaryColor: '#6b7280', accentColor: '#d1d5db', backgroundColor: '#4b5563', textColor: '#f3f4f6' },
  { name: 'Dark Gray', primaryColor: '#4b5563', secondaryColor: '#374151', accentColor: '#6b7280', backgroundColor: '#1f2937', textColor: '#e5e7eb' },
  { name: 'Pure Black', primaryColor: '#09090b', secondaryColor: '#000000', accentColor: '#27272a', backgroundColor: '#000000', textColor: '#fafafa' },
  { name: 'Silver', primaryColor: '#d1d5db', secondaryColor: '#9ca3af', accentColor: '#e5e7eb', backgroundColor: '#f3f4f6', textColor: '#1f2937' },
  { name: 'Pewter', primaryColor: '#6b7280', secondaryColor: '#4b5563', accentColor: '#9ca3af', backgroundColor: '#374151', textColor: '#e5e7eb' },
  { name: 'Graphite', primaryColor: '#27272a', secondaryColor: '#18181b', accentColor: '#52525b', backgroundColor: '#09090b', textColor: '#e4e4e7' },
  { name: 'Ash', primaryColor: '#71717a', secondaryColor: '#52525b', accentColor: '#a1a1aa', backgroundColor: '#27272a', textColor: '#fafafa' },
  { name: 'Smoke', primaryColor: '#a1a1aa', secondaryColor: '#71717a', accentColor: '#d4d4d8', backgroundColor: '#52525b', textColor: '#fafafa' },

  // Metallic themes (10)
  { name: 'Gold', primaryColor: '#ca8a04', secondaryColor: '#a16207', accentColor: '#fbbf24', backgroundColor: '#1a140a', textColor: '#fef3c7' },
  { name: 'Bronze', primaryColor: '#92400e', secondaryColor: '#78350f', accentColor: '#c2410c', backgroundColor: '#1c1917', textColor: '#fed7aa' },
  { name: 'Copper', primaryColor: '#c2410c', secondaryColor: '#9a3412', accentColor: '#ea580c', backgroundColor: '#1a0f05', textColor: '#fed7aa' },
  { name: 'Platinum', primaryColor: '#e5e7eb', secondaryColor: '#d1d5db', accentColor: '#f9fafb', backgroundColor: '#f3f4f6', textColor: '#1f2937' },
  { name: 'Steel', primaryColor: '#6b7280', secondaryColor: '#4b5563', accentColor: '#9ca3af', backgroundColor: '#374151', textColor: '#e5e7eb' },
  { name: 'Chrome', primaryColor: '#d1d5db', secondaryColor: '#9ca3af', accentColor: '#f3f4f6', backgroundColor: '#e5e7eb', textColor: '#1f2937' },
  { name: 'Brass', primaryColor: '#a16207', secondaryColor: '#854d0e', accentColor: '#ca8a04', backgroundColor: '#1a140a', textColor: '#fef3c7' },
  { name: 'Iron', primaryColor: '#52525b', secondaryColor: '#3f3f46', accentColor: '#71717a', backgroundColor: '#18181b', textColor: '#e4e4e7' },
  { name: 'Titanium', primaryColor: '#71717a', secondaryColor: '#52525b', accentColor: '#a1a1aa', backgroundColor: '#27272a', textColor: '#fafafa' },
  { name: 'Gunmetal', primaryColor: '#3f3f46', secondaryColor: '#27272a', accentColor: '#71717a', backgroundColor: '#18181b', textColor: '#d4d4d8' },

  // Fantasy & Mystical (10)
  { name: 'Dragon Fire', primaryColor: '#dc2626', secondaryColor: '#991b1b', accentColor: '#fca5a5', backgroundColor: '#1a0505', textColor: '#fee2e2' },
  { name: 'Fairy Dust', primaryColor: '#f0abfc', secondaryColor: '#d946ef', accentColor: '#f5d0fe', backgroundColor: '#fae8ff', textColor: '#701a75' },
  { name: 'Wizard Blue', primaryColor: '#3b82f6', secondaryColor: '#2563eb', accentColor: '#93c5fd', backgroundColor: '#0f172a', textColor: '#dbeafe' },
  { name: 'Phoenix Gold', primaryColor: '#f59e0b', secondaryColor: '#d97706', accentColor: '#fcd34d', backgroundColor: '#1a140a', textColor: '#fef3c7' },
  { name: 'Unicorn Pink', primaryColor: '#ec4899', secondaryColor: '#db2777', accentColor: '#f9a8d4', backgroundColor: '#1a0a14', textColor: '#fce7f3' },
  { name: 'Enchanted Forest', primaryColor: '#16a34a', secondaryColor: '#15803d', accentColor: '#4ade80', backgroundColor: '#0a1a0f', textColor: '#dcfce7' },
  { name: 'Mystic Purple', primaryColor: '#9333ea', secondaryColor: '#7e22ce', accentColor: '#c084fc', backgroundColor: '#1a0a2e', textColor: '#e9d5ff' },
  { name: 'Crystal Blue', primaryColor: '#0ea5e9', secondaryColor: '#0284c7', accentColor: '#7dd3fc', backgroundColor: '#0c1a2a', textColor: '#e0f2fe' },
  { name: 'Elven Silver', primaryColor: '#d1d5db', secondaryColor: '#9ca3af', accentColor: '#f3f4f6', backgroundColor: '#e5e7eb', textColor: '#1f2937' },
  { name: 'Dark Magic', primaryColor: '#581c87', secondaryColor: '#3b0764', accentColor: '#a855f7', backgroundColor: '#1a0a2e', textColor: '#e9d5ff' },

  // Seasonal themes (10)
  { name: 'Spring Blossom', primaryColor: '#f9a8d4', secondaryColor: '#ec4899', accentColor: '#fbcfe8', backgroundColor: '#fdf2f8', textColor: '#831843' },
  { name: 'Summer Sun', primaryColor: '#fbbf24', secondaryColor: '#f59e0b', accentColor: '#fde047', backgroundColor: '#fffbeb', textColor: '#78350f' },
  { name: 'Autumn Leaves', primaryColor: '#ea580c', secondaryColor: '#c2410c', accentColor: '#fb923c', backgroundColor: '#1a0f05', textColor: '#fed7aa' },
  { name: 'Winter Frost', primaryColor: '#60a5fa', secondaryColor: '#3b82f6', accentColor: '#93c5fd', backgroundColor: '#eff6ff', textColor: '#1e3a8a' },
  { name: 'Spring Green', primaryColor: '#84cc16', secondaryColor: '#65a30d', accentColor: '#bef264', backgroundColor: '#f7fee7', textColor: '#365314' },
  { name: 'Summer Beach', primaryColor: '#0ea5e9', secondaryColor: '#0284c7', accentColor: '#38bdf8', backgroundColor: '#f0f9ff', textColor: '#0c4a6e' },
  { name: 'Autumn Gold', primaryColor: '#d97706', secondaryColor: '#b45309', accentColor: '#fbbf24', backgroundColor: '#fffbeb', textColor: '#78350f' },
  { name: 'Winter Snow', primaryColor: '#f3f4f6', secondaryColor: '#e5e7eb', accentColor: '#ffffff', backgroundColor: '#ffffff', textColor: '#1f2937' },
  { name: 'Spring Rain', primaryColor: '#6ee7b7', secondaryColor: '#34d399', accentColor: '#a7f3d0', backgroundColor: '#ecfdf5', textColor: '#065f46' },
  { name: 'Summer Sunset', primaryColor: '#fb7185', secondaryColor: '#f43f5e', accentColor: '#fda4af', backgroundColor: '#fff1f2', textColor: '#881337' }
];

export const DetailedApartment2D: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedObject, setSelectedObject] = useState<RoomObject | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon');
  const [lighting, setLighting] = useState(100);
  const [currentTheme, setCurrentTheme] = useState<ApartmentTheme>(themes[0]);

  // Define all rooms with exact measurements and details
  const rooms: Room[] = [
    {
      id: 'living-room',
      name: 'Living Room',
      x: 0,
      y: 0,
      width: 50,
      height: 60,
      color: '#1a1a2e',
      wallColor: '#2a2a3e',
      floorColor: '#3a2a2e',
      mood: 'cozy',
      objects: [
        {
          id: 'couch',
          name: 'Gothic Velvet Couch',
          x: 10,
          y: 20,
          width: 30,
          height: 15,
          color: '#6d28d9',
          icon: Sofa,
          interactive: true,
          details: 'Deep purple velvet couch with silver studs. Perfect for reading or resting.',
          onClick: () => alert('💜 Rest on the velvet couch?')
        },
        {
          id: 'coffee-table',
          name: 'Glass Coffee Table',
          x: 15,
          y: 40,
          width: 20,
          height: 10,
          color: '#4a5568',
          icon: Coffee,
          details: 'Sleek glass table with dark wood frame. Holds your favorite books and coffee mug.'
        },
        {
          id: 'tv',
          name: '65" Smart TV',
          x: 5,
          y: 5,
          width: 40,
          height: 8,
          color: '#1a1a1a',
          icon: Tv,
          interactive: true,
          details: 'Large smart TV for streaming shows and movies.',
          onClick: () => alert('🎬 What would you like to watch?')
        },
        {
          id: 'bookshelf',
          name: 'Floor-to-Ceiling Bookshelf',
          x: 2,
          y: 15,
          width: 6,
          height: 40,
          color: '#4a2511',
          icon: Book,
          interactive: true,
          details: 'Massive bookshelf filled with novels, art books, and journals.',
          onClick: () => alert('📚 Choose a book to read?')
        },
        {
          id: 'plant-1',
          name: 'Monstera Plant',
          x: 42,
          y: 50,
          width: 5,
          height: 8,
          color: '#2d5016',
          icon: Sparkles,
          details: 'Large monstera plant in a decorative pot.'
        },
        {
          id: 'rug',
          name: 'Persian Rug',
          x: 12,
          y: 18,
          width: 28,
          height: 35,
          color: '#4a1942',
          details: 'Vintage persian rug with intricate patterns in deep reds and purples.'
        }
      ]
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      x: 50,
      y: 0,
      width: 50,
      height: 35,
      color: '#2a2a3a',
      wallColor: '#3a3a4a',
      floorColor: '#e5e5e5',
      mood: 'functional',
      objects: [
        {
          id: 'stove',
          name: 'Gas Stove',
          x: 5,
          y: 5,
          width: 15,
          height: 10,
          color: '#1a1a1a',
          icon: Utensils,
          interactive: true,
          details: '4-burner gas stove. Ready for cooking!',
          onClick: () => alert('🍳 What would you like to cook?')
        },
        {
          id: 'fridge',
          name: 'Smart Refrigerator',
          x: 25,
          y: 5,
          width: 20,
          height: 15,
          color: '#e5e5e5',
          icon: ShoppingCart,
          interactive: true,
          details: 'Large smart fridge with touch screen. Shows grocery list and recipes.',
          onClick: () => alert('🧊 Check what\'s inside?')
        },
        {
          id: 'island',
          name: 'Kitchen Island',
          x: 10,
          y: 18,
          width: 30,
          height: 12,
          color: '#8b4513',
          icon: Coffee,
          interactive: true,
          details: 'Marble-top kitchen island with bar stools. Perfect for meal prep or working.',
          onClick: () => alert('☕ Make coffee here?')
        },
        {
          id: 'sink',
          name: 'Double Basin Sink',
          x: 48,
          y: 5,
          width: 15,
          height: 8,
          color: '#c0c0c0',
          details: 'Stainless steel double basin sink with modern faucet.'
        }
      ]
    },
    {
      id: 'bedroom',
      name: 'Bedroom',
      x: 50,
      y: 35,
      width: 50,
      height: 65,
      color: '#1a1a2e',
      wallColor: '#2a2040',
      floorColor: '#2a2a3e',
      mood: 'restful',
      objects: [
        {
          id: 'bed',
          name: 'King Size Bed',
          x: 10,
          y: 15,
          width: 35,
          height: 25,
          color: '#4a1942',
          icon: Bed,
          interactive: true,
          details: 'Luxurious king-size bed with velvet purple bedding and many pillows.',
          onClick: () => alert('😴 Time to rest?')
        },
        {
          id: 'nightstand-left',
          name: 'Left Nightstand',
          x: 5,
          y: 20,
          width: 8,
          height: 10,
          color: '#4a2511',
          icon: Moon,
          details: 'Dark wood nightstand with a lamp, book, and water glass.'
        },
        {
          id: 'nightstand-right',
          name: 'Right Nightstand',
          x: 42,
          y: 20,
          width: 8,
          height: 10,
          color: '#4a2511',
          icon: Heart,
          details: 'Matching nightstand with phone charger and essential oils.'
        },
        {
          id: 'desk',
          name: 'Work Desk',
          x: 5,
          y: 45,
          width: 40,
          height: 12,
          color: '#1a1a1a',
          icon: Monitor,
          interactive: true,
          details: 'Large L-shaped desk with dual monitors, keyboard, and RGB lighting.',
          onClick: () => alert('💻 Start working?')
        },
        {
          id: 'wardrobe',
          name: 'Walk-in Closet',
          x: 48,
          y: 45,
          width: 20,
          height: 30,
          color: '#3a2511',
          icon: Sparkles,
          interactive: true,
          details: 'Organized closet with all your clothes, shoes, and accessories. Seasonal Gothic Collection: Spring (flowy black lace), Summer (dark florals), Autumn (velvet and burgundy), Winter (heavy coats and deep purples). Complete wardrobe with 100+ gothic themes.',
          onClick: () => alert('👗 Choose outfit from Seasonal Gothic Collection?')
        },
        {
          id: 'mirror',
          name: 'Full-Length Mirror',
          x: 48,
          y: 5,
          width: 12,
          height: 20,
          color: '#c0c0c0',
          details: 'Large mirror with LED lights around the frame.'
        },
        {
          id: 'art-wall',
          name: 'Gallery Wall',
          x: 2,
          y: 2,
          width: 30,
          height: 10,
          color: '#6d28d9',
          icon: Palette,
          interactive: true,
          details: 'Collection of your artwork and photos arranged beautifully.',
          onClick: () => alert('🎨 View your art collection?')
        }
      ]
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      x: 0,
      y: 60,
      width: 50,
      height: 40,
      color: '#1a2a3a',
      wallColor: '#e5f5f5',
      floorColor: '#c5d5d5',
      mood: 'spa-like',
      objects: [
        {
          id: 'bathtub',
          name: 'Soaking Tub',
          x: 10,
          y: 10,
          width: 30,
          height: 20,
          color: '#ffffff',
          icon: Bath,
          interactive: true,
          details: 'Deep soaking tub with jets. Perfect for relaxation.',
          onClick: () => alert('🛁 Run a bath?')
        },
        {
          id: 'shower',
          name: 'Rain Shower',
          x: 5,
          y: 32,
          width: 15,
          height: 15,
          color: '#e5e5e5',
          details: 'Walk-in shower with rainfall showerhead and body jets.'
        },
        {
          id: 'vanity',
          name: 'Double Vanity',
          x: 25,
          y: 32,
          width: 20,
          height: 10,
          color: '#8b4513',
          icon: Sparkles,
          details: 'Marble double vanity with plenty of storage for toiletries and skincare.'
        },
        {
          id: 'plants',
          name: 'Hanging Plants',
          x: 42,
          y: 5,
          width: 6,
          height: 8,
          color: '#2d5016',
          details: 'Collection of hanging plants creating a spa atmosphere.'
        }
      ]
    },
    {
      id: 'office',
      name: 'Office & Financial Hub',
      x: 100,
      y: 0,
      width: 50,
      height: 50,
      color: '#1a2a1a',
      wallColor: '#2a3a2a',
      floorColor: '#2a2a2a',
      mood: 'productive',
      objects: [
        {
          id: 'financial-desk',
          name: 'Financial Command Center',
          x: 10,
          y: 10,
          width: 35,
          height: 15,
          color: '#1a1a1a',
          icon: TrendingUp,
          interactive: true,
          details: 'Multi-monitor setup for tracking finances, investments, and passive income streams. Finance Dashboard integrated.',
          onClick: () => alert('💰 Open Finance Dashboard?')
        },
        {
          id: 'budget-wall',
          name: 'Budget Visualization Wall',
          x: 5,
          y: 30,
          width: 40,
          height: 12,
          color: '#2d5016',
          icon: PieChart,
          interactive: true,
          details: 'Digital wall displaying real-time budget tracking, expense categories, and financial goals.',
          onClick: () => alert('📊 View budget breakdown?')
        },
        {
          id: 'passive-income-board',
          name: 'Passive Income Ideas Board',
          x: 50,
          y: 10,
          width: 45,
          height: 20,
          color: '#4a1942',
          icon: DollarSign,
          interactive: true,
          details: '1000 passive income ideas organized by category, startup cost, and time investment. Track implementation progress.',
          onClick: () => alert('💡 Browse passive income ideas?')
        },
        {
          id: 'advocacy-station',
          name: 'Advocacy & Support Station',
          x: 50,
          y: 35,
          width: 45,
          height: 25,
          color: '#1a4a2a',
          icon: Briefcase,
          interactive: true,
          details: 'Self-advocacy resources, healthcare documentation templates, accommodation requests, and support network management. 300-lesson curriculum available.',
          onClick: () => alert('🎓 Access advocacy resources?')
        },
        {
          id: 'safe-documents',
          name: 'Secure Document Safe',
          x: 10,
          y: 45,
          width: 30,
          height: 15,
          color: '#4a4a4a',
          icon: Briefcase,
          details: 'Encrypted storage for medical records, financial documents, legal papers, and important files.'
        },
        {
          id: 'standing-desk',
          name: 'Adjustable Standing Desk',
          x: 5,
          y: 65,
          width: 40,
          height: 12,
          color: '#8b4513',
          icon: Monitor,
          interactive: true,
          details: 'Electric standing desk with memory presets for optimal ergonomics and energy management.',
          onClick: () => alert('⬆️ Adjust desk height?')
        },
        {
          id: 'filing-system',
          name: 'Smart Filing System',
          x: 48,
          y: 65,
          width: 20,
          height: 15,
          color: '#4a2511',
          icon: Book,
          details: 'Organized filing system for bills, receipts, medical documents, and project materials.'
        },
        {
          id: 'health-tracking-station',
          name: 'Health & Wellness Station',
          x: 5,
          y: 80,
          width: 35,
          height: 18,
          color: '#1a4a3a',
          icon: Stethoscope,
          interactive: true,
          details: 'Body Weather Chart, spoons tracking, vital signs monitoring, and symptom logging. Complete health dashboard integration.',
          onClick: () => alert('🏥 Open Health Dashboard?')
        },
        {
          id: 'mental-health-corner',
          name: 'Mental Health Corner',
          x: 45,
          y: 82,
          width: 25,
          height: 16,
          color: '#3a2a4a',
          icon: Brain,
          interactive: true,
          details: 'Mood tracking, therapy session notes, coping strategies, and mental health resources. Safe space for emotional wellness.',
          onClick: () => alert('🧠 Access Mental Health Dashboard?')
        },
        {
          id: 'meditation-cushion',
          name: 'Meditation & Mindfulness Area',
          x: 72,
          y: 82,
          width: 23,
          height: 16,
          color: '#2a3a3a',
          icon: Activity,
          interactive: true,
          details: 'Comfortable meditation cushion with guided meditation app, calming sounds, and breathing exercises.',
          onClick: () => alert('🧘 Start meditation session?')
        }
      ]
    },
    {
      id: 'entertainment-hub',
      name: 'Entertainment Hub',
      x: 100,
      y: 50,
      width: 50,
      height: 50,
      color: '#2a1a3a',
      wallColor: '#3a2a4a',
      floorColor: '#2a1a2a',
      mood: 'fun',
      objects: [
        {
          id: 'gaming-setup',
          name: 'Ultimate Gaming Setup',
          x: 10,
          y: 10,
          width: 35,
          height: 18,
          color: '#1a1a1a',
          icon: Gamepad2,
          interactive: true,
          details: 'High-end gaming PC with triple monitors, RGB lighting, and all your Steam games ready to play.',
          onClick: () => alert('🎮 Launch Steam library?')
        },
        {
          id: 'console-station',
          name: 'Console Gaming Station',
          x: 50,
          y: 10,
          width: 45,
          height: 15,
          color: '#1a1a2a',
          icon: Gamepad2,
          interactive: true,
          details: 'PlayStation, Xbox, and Switch consoles with comfortable gaming chair.',
          onClick: () => alert('🕹️ Pick a console?')
        },
        {
          id: 'home-theater',
          name: 'Home Theater System',
          x: 5,
          y: 32,
          width: 90,
          height: 20,
          color: '#0a0a0a',
          icon: Film,
          interactive: true,
          details: '120" projection screen with 7.1 surround sound. Access your Entertainment Library here.',
          onClick: () => alert('🎬 Open Entertainment Library?')
        },
        {
          id: 'dnd-table',
          name: 'D&D Gaming Table',
          x: 10,
          y: 56,
          width: 35,
          height: 20,
          color: '#4a2511',
          icon: Dices,
          interactive: true,
          details: 'Custom D&D table with digital screen, miniature storage, and dice collection. Summon NPCs for campaigns!',
          onClick: () => alert('🎲 Start a D&D session?')
        },
        {
          id: 'vr-corner',
          name: 'VR Experience Corner',
          x: 50,
          y: 56,
          width: 20,
          height: 20,
          color: '#2a2a4a',
          icon: Sparkles,
          interactive: true,
          details: 'VR headset and motion tracking space for immersive gaming and virtual experiences.',
          onClick: () => alert('🥽 Enter VR mode?')
        },
        {
          id: 'lounge-seating',
          name: 'Theater Lounge Seating',
          x: 5,
          y: 80,
          width: 30,
          height: 15,
          color: '#4a1942',
          icon: Sofa,
          details: 'Reclining theater seats with cup holders and blanket storage for cozy viewing.'
        },
        {
          id: 'kollective-board-games',
          name: 'Kollective Board Game Library',
          x: 40,
          y: 80,
          width: 28,
          height: 18,
          color: '#2a3a2a',
          icon: Dices,
          interactive: true,
          details: 'Extensive collection of cooperative board games, card games, and party games. Track spoon levels, remote play options, and game sessions.',
          onClick: () => alert('🎲 Browse Kollective game library?')
        },
        {
          id: 'party-game-table',
          name: 'Social Gaming Table',
          x: 72,
          y: 78,
          width: 23,
          height: 20,
          color: '#3a2a1a',
          icon: Coffee,
          interactive: true,
          details: 'Perfect table for cooperative play, party games, and social gaming nights with friends and partners. Comfortable seating for 4-6 players.',
          onClick: () => alert('🎮 Set up a Kollective game night?')
        },
        {
          id: 'ai-roleplay-studio',
          name: 'AI Roleplay Studio',
          x: 5,
          y: 50,
          width: 45,
          height: 25,
          color: '#4a2a5a',
          icon: Sparkles,
          interactive: true,
          details: 'Create custom AI characters and immersive roleplay scenarios. Fantasy adventures, character conversations, story-driven interactions. Similar to ChatSmith & RedQuill platforms with character creation, scenario building, and AI-powered roleplay experiences.',
          onClick: () => alert('✨ Enter AI Roleplay Studio (Character Creation & Fantasy Scenarios)?')
        }
      ]
    },
    {
      id: 'studio',
      name: 'Creative Studio',
      x: 0,
      y: 100,
      width: 100,
      height: 40,
      color: '#2a1a2a',
      wallColor: '#3a2a3a',
      floorColor: '#2a1a2a',
      mood: 'creative',
      objects: [
        {
          id: 'art-station',
          name: 'Digital Art Workstation',
          x: 5,
          y: 10,
          width: 28,
          height: 18,
          color: '#1a1a2a',
          icon: Paintbrush,
          interactive: true,
          details: 'Drawing tablet, dual monitors, and full Adobe Creative Suite. Perfect for digital art, illustration, and design work.',
          onClick: () => alert('🎨 Start creating art?')
        },
        {
          id: 'music-production',
          name: 'Music Production Station',
          x: 38,
          y: 10,
          width: 28,
          height: 18,
          color: '#1a2a2a',
          icon: Music,
          interactive: true,
          details: 'MIDI keyboard, audio interface, studio monitors, and DAW software. Full music production setup with VST plugins.',
          onClick: () => alert('🎵 Launch music production?')
        },
        {
          id: 'recording-booth',
          name: 'Vocal Recording Booth',
          x: 70,
          y: 10,
          width: 25,
          height: 18,
          color: '#2a1a1a',
          icon: Mic,
          interactive: true,
          details: 'Soundproofed recording booth with professional microphone, pop filter, and audio treatment.',
          onClick: () => alert('🎤 Start recording vocals?')
        },
        {
          id: 'instrument-wall',
          name: 'Instrument Collection',
          x: 5,
          y: 32,
          width: 20,
          height: 25,
          color: '#3a2511',
          icon: Radio,
          interactive: true,
          details: 'Guitar, ukulele, keyboard, and other instruments neatly displayed and ready to play.',
          onClick: () => alert('🎸 Pick an instrument?')
        },
        {
          id: 'photography-setup',
          name: 'Photography Studio',
          x: 28,
          y: 32,
          width: 30,
          height: 25,
          color: '#1a1a1a',
          icon: Camera,
          interactive: true,
          details: 'Professional camera, lighting setup, backdrops, and photo editing workstation.',
          onClick: () => alert('📷 Start photo session?')
        },
        {
          id: 'craft-table',
          name: 'Crafting & Sewing Table',
          x: 62,
          y: 32,
          width: 33,
          height: 25,
          color: '#4a2a3a',
          icon: Sparkles,
          interactive: true,
          details: 'Large crafting table with sewing machine, fabric storage, art supplies, and project materials. Access to 200 sewing projects.',
          onClick: () => alert('✂️ Start sewing project?')
        },
        {
          id: 'inspiration-board',
          name: 'Mood & Inspiration Board',
          x: 5,
          y: 60,
          width: 40,
          height: 15,
          color: '#6d28d9',
          icon: Palette,
          interactive: true,
          details: 'Giant pinboard with artwork, photos, fabric swatches, and creative inspiration. Theme Studio integrated.',
          onClick: () => alert('💡 Browse inspiration?')
        },
        {
          id: 'creative-library',
          name: 'Art & Design Library',
          x: 48,
          y: 60,
          width: 47,
          height: 15,
          color: '#4a2511',
          icon: Book,
          interactive: true,
          details: 'Extensive collection of art books, design magazines, pattern books, and creative resources.',
          onClick: () => alert('📚 Browse creative library?')
        },
        {
          id: 'lounge-area',
          name: 'Creative Lounge',
          x: 5,
          y: 78,
          width: 40,
          height: 18,
          color: '#4a1942',
          icon: Sofa,
          details: 'Comfortable seating area for brainstorming, sketching, and creative breaks with good natural light.'
        },
        {
          id: 'historical-spirits',
          name: 'Historical Inspiration Spirits',
          x: 48,
          y: 78,
          width: 47,
          height: 18,
          color: 'transparent',
          icon: Ghost,
          interactive: true,
          details: 'Diverse historical figures appear as ghostly inspirations at night. BIPOC artists, writers, musicians, activists, and LGBTQ+ pioneers including James Baldwin, Frida Kahlo, Langston Hughes, Marsha P. Johnson, Bayard Rustin, Josephine Baker, Jean-Michel Basquiat, Audre Lorde, and many more. Their outfits change to match your selected theme (Gothic, Cyberpunk, Pastel, etc). Click to summon and converse with these creative spirits.',
          onClick: () => alert('👻 Summon Historical Creative Spirits (Theme-Adaptive Outfits)?')
        }
      ]
    },
    {
      id: 'garden',
      name: 'Heritage Garden',
      x: 100,
      y: 100,
      width: 50,
      height: 40,
      color: '#1a2a1a',
      wallColor: '#2a3a2a',
      floorColor: '#2a4a2a',
      mood: 'peaceful',
      objects: [
        {
          id: 'family-tree',
          name: 'Family Heritage Tree',
          x: 20,
          y: 15,
          width: 60,
          height: 50,
          color: '#3a5a2a',
          icon: GitBranch,
          interactive: true,
          details: 'Living genealogy tree visualization. Explore your family history, ancestors, cultural heritage, and generational connections. Integrated with Ancestry Hub.',
          onClick: () => alert('🌳 Explore Family Tree?')
        },
        {
          id: 'ancestor-memorial',
          name: 'Ancestor Memorial Bench',
          x: 5,
          y: 10,
          width: 12,
          height: 10,
          color: '#4a3a2a',
          icon: Users2,
          interactive: true,
          details: 'Quiet bench for reflecting on family history, honoring ancestors, and preserving generational wisdom.',
          onClick: () => alert('💜 Sit and reflect on ancestors?')
        },
        {
          id: 'garden-flowers',
          name: 'Memorial Flower Garden',
          x: 5,
          y: 25,
          width: 12,
          height: 20,
          color: '#2a4a3a',
          icon: Flower2,
          details: 'Beautiful flower garden planted in memory of ancestors. Each flower represents a family member.'
        },
        {
          id: 'bird-feeders',
          name: 'Bird Sanctuary',
          x: 82,
          y: 10,
          width: 13,
          height: 15,
          color: '#3a4a3a',
          icon: Bird,
          details: 'Bird feeders and sanctuary. Peaceful space for connection with nature.'
        },
        {
          id: 'meditation-path',
          name: 'Garden Walking Path',
          x: 5,
          y: 48,
          width: 90,
          height: 8,
          color: '#4a3a2a',
          icon: Trees,
          details: 'Peaceful walking path lined with trees and plants. Perfect for reflection and grounding.'
        },
        {
          id: 'heritage-plaque',
          name: 'Heritage Story Wall',
          x: 5,
          y: 60,
          width: 90,
          height: 15,
          color: '#3a2a1a',
          icon: Book,
          interactive: true,
          details: 'Wall with plaques telling family stories, historical context, and cultural traditions passed down through generations.',
          onClick: () => alert('📖 Read family stories?')
        },
        {
          id: 'rain-garden',
          name: 'Rain Garden & Water Feature',
          x: 82,
          y: 28,
          width: 13,
          height: 18,
          color: '#2a3a4a',
          icon: CloudRain,
          details: 'Small water feature with rain garden. Soothing sounds of water for meditation and peace.'
        },
        {
          id: 'cultural-plants',
          name: 'Cultural Heritage Plants',
          x: 5,
          y: 78,
          width: 20,
          height: 18,
          color: '#2a3a2a',
          icon: Sparkles,
          interactive: true,
          details: 'Plants from your ancestral homelands: African roots, historical regions. Living connection to your heritage.',
          onClick: () => alert('🌿 Learn about cultural plants?')
        },
        {
          id: 'hoodoo-altar',
          name: 'Hoodoo Spiritual Altar',
          x: 28,
          y: 78,
          width: 18,
          height: 18,
          color: '#3a1a2a',
          icon: Flame,
          interactive: true,
          details: '200 hoodoo practices library. Candles, herbs, roots, oils, and spiritual tools for rituals, protection, and ancestral connection.',
          onClick: () => alert('🕯️ Access Hoodoo Library (200 practices)?')
        },
        {
          id: 'ancestor-spirits',
          name: 'Ancestor Spirit Circle',
          x: 20,
          y: 15,
          width: 60,
          height: 50,
          color: 'transparent',
          icon: Ghost,
          interactive: true,
          details: '3D/2D models of ancestors floating around the Family Heritage Tree. Click to see their stories, wisdom, and connections. Animated spirits honoring your lineage.',
          onClick: () => alert('👻 View Ancestor Spirits & Stories?')
        },
        {
          id: 'ritual-space',
          name: 'Hoodoo Ritual Space',
          x: 48,
          y: 78,
          width: 20,
          height: 18,
          color: '#2a1a3a',
          icon: Star,
          interactive: true,
          details: 'Sacred space for hoodoo rituals, rootwork, and spiritual practices. Mojo bags, conjure work, and ancestral communication.',
          onClick: () => alert('⭐ Perform Hoodoo Ritual?')
        },
        {
          id: 'spirit-communication',
          name: 'Ancestor Communication Portal',
          x: 70,
          y: 78,
          width: 25,
          height: 18,
          color: '#1a2a3a',
          icon: Zap,
          interactive: true,
          details: 'Portal for communicating with ancestor spirits. Divination, messages, and spiritual guidance from your lineage.',
          onClick: () => alert('⚡ Open Communication Portal?')
        },
        {
          id: 'blackfoot-learning',
          name: 'Blackfoot Tribe Learning Center',
          x: 82,
          y: 50,
          width: 13,
          height: 25,
          color: '#3a2a1a',
          icon: Book,
          interactive: true,
          details: 'Educational center for learning about the Blackfoot tribe, their language (Siksiká), culture, traditions, history, and wisdom. Interactive language lessons and cultural studies.',
          onClick: () => alert('📚 Learn Blackfoot language and culture?')
        }
      ]
    }
  ];

  // Lighting effects based on time of day
  const getLightingFilter = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'brightness(1.2) saturate(1.1) hue-rotate(-5deg)';
      case 'afternoon':
        return 'brightness(1) saturate(1)';
      case 'evening':
        return 'brightness(0.8) saturate(0.9) hue-rotate(10deg)';
      case 'night':
        return 'brightness(0.4) saturate(0.7) hue-rotate(20deg)';
      default:
        return 'brightness(1)';
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-purple-900 p-4 overflow-auto">
      {/* Room Tabs */}
      <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedRoom(null)}
          className="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all"
          style={{
            backgroundColor: !selectedRoom ? currentTheme.primaryColor : 'rgba(0,0,0,0.4)',
            color: !selectedRoom ? currentTheme.textColor : currentTheme.accentColor,
            boxShadow: !selectedRoom ? `0 0 20px ${currentTheme.primaryColor}80` : 'none',
            transform: !selectedRoom ? 'scale(1.05)' : 'scale(1)'
          }}
        >
          🏠 All Rooms
        </button>
        {rooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setSelectedRoom(room.id)}
            className="px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all"
            style={{
              backgroundColor: selectedRoom === room.id ? currentTheme.primaryColor : 'rgba(0,0,0,0.4)',
              color: selectedRoom === room.id ? currentTheme.textColor : currentTheme.accentColor,
              boxShadow: selectedRoom === room.id ? `0 0 20px ${currentTheme.primaryColor}80` : 'none',
              transform: selectedRoom === room.id ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="mb-4 flex gap-4 items-center flex-wrap bg-black/30 p-4 rounded-lg backdrop-blur-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setTimeOfDay('morning')}
            className={`p-2 rounded ${timeOfDay === 'morning' ? 'bg-yellow-500' : 'bg-gray-700'}`}
          >
            <Sun className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTimeOfDay('afternoon')}
            className={`p-2 rounded ${timeOfDay === 'afternoon' ? 'bg-orange-500' : 'bg-gray-700'}`}
          >
            <Sun className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTimeOfDay('evening')}
            className={`p-2 rounded ${timeOfDay === 'evening' ? 'bg-purple-500' : 'bg-gray-700'}`}
          >
            <Moon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`p-2 rounded ${timeOfDay === 'night' ? 'bg-indigo-900' : 'bg-gray-700'}`}
          >
            <Moon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-white text-sm">Brightness:</span>
          <input
            type="range"
            min="20"
            max="150"
            value={lighting}
            onChange={(e) => setLighting(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-white text-sm">{lighting}%</span>
        </div>

        <div className="text-white font-bold">
          {selectedRoom ? `📍 ${rooms.find(r => r.id === selectedRoom)?.name}` : '🏠 KOL Apartment'}
        </div>

        {/* Theme Studio */}
        <div className="flex items-center gap-2">
          <span className="text-white text-sm">🎨 Theme:</span>
          <select
            value={currentTheme.name}
            onChange={(e) => setCurrentTheme(themes.find(t => t.name === e.target.value) || themes[0])}
            className="bg-black/50 text-white border border-purple-500/30 rounded px-3 py-1 text-sm"
          >
            {themes.map((theme) => (
              <option key={theme.name} value={theme.name}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Apartment Layout */}
      <div
        className="relative rounded-lg shadow-2xl overflow-auto"
        style={{
          width: '100%',
          minWidth: '1200px',
          height: '1000px',
          filter: getLightingFilter(),
          opacity: lighting / 100,
          backgroundColor: currentTheme.backgroundColor
        }}
      >
        {rooms.map((room) => (
          <div
            key={room.id}
            className="absolute border-2 transition-all cursor-pointer group"
            style={{
              left: `${room.x}%`,
              top: `${room.y}%`,
              width: `${room.width}%`,
              height: `${room.height}%`,
              backgroundColor: room.color,
              borderColor: selectedRoom === room.id ? currentTheme.accentColor : `${currentTheme.primaryColor}40`,
              boxShadow: selectedRoom === room.id ? `0 0 30px ${currentTheme.primaryColor}` : 'none'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = currentTheme.primaryColor}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = selectedRoom === room.id ? currentTheme.accentColor : `${currentTheme.primaryColor}40`}
            onClick={() => setSelectedRoom(room.id)}
          >
            {/* Room Name Label */}
            <div className="absolute top-2 left-2 bg-black/70 text-white px-3 py-1 rounded text-xs font-bold backdrop-blur-sm">
              {room.name}
            </div>

            {/* Floor */}
            <div
              className="absolute bottom-0 left-0 right-0 h-2 opacity-30"
              style={{ backgroundColor: room.floorColor }}
            />

            {/* Walls */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundColor: room.wallColor }}
            />

            {/* Objects in Room */}
            {room.objects.map((obj) => {
              const IconComponent = obj.icon;
              return (
                <div
                  key={obj.id}
                  className={`absolute flex items-center justify-center rounded shadow-lg hover:scale-105 transition-transform ${
                    obj.interactive ? 'cursor-pointer hover:ring-2 hover:ring-yellow-400' : ''
                  }`}
                  style={{
                    left: `${obj.x}%`,
                    top: `${obj.y}%`,
                    width: `${obj.width}%`,
                    height: `${obj.height}%`,
                    backgroundColor: obj.color,
                    boxShadow: selectedObject?.id === obj.id
                      ? '0 0 20px rgba(255, 215, 0, 0.8)'
                      : '0 2px 8px rgba(0,0,0,0.3)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedObject(obj);
                    if (obj.onClick) obj.onClick();
                  }}
                  title={obj.name}
                >
                  {IconComponent && (
                    <IconComponent className="text-white opacity-70" size={obj.width > 15 ? 32 : 20} />
                  )}
                  <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {obj.name}
                  </div>
                </div>
              );
            })}

            {/* Mood Indicator */}
            {room.mood && (
              <div className="absolute bottom-4 right-4 text-xs text-white/50">
                ✨ {room.mood}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Object Details Panel */}
      {selectedObject && (
        <div className="mt-4 bg-gradient-to-r from-purple-900 to-pink-900 p-6 rounded-lg shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-2">{selectedObject.name}</h3>
          {selectedObject.details && (
            <p className="text-purple-200 mb-4">{selectedObject.details}</p>
          )}
          <button
            onClick={() => setSelectedObject(null)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Room Info */}
      {selectedRoom && (
        <div className="mt-4 bg-black/50 p-6 rounded-lg backdrop-blur-sm">
          <h3 className="text-xl font-bold text-white mb-2">
            {rooms.find((r) => r.id === selectedRoom)?.name}
          </h3>
          <p className="text-purple-200 mb-4">
            {rooms.find((r) => r.id === selectedRoom)?.objects.length} objects in this room
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {rooms
              .find((r) => r.id === selectedRoom)
              ?.objects.map((obj) => (
                <button
                  key={obj.id}
                  className="bg-purple-800/50 hover:bg-purple-700/70 text-white px-3 py-2 rounded text-sm transition-colors"
                  onClick={() => setSelectedObject(obj)}
                >
                  {obj.name}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedApartment2D;
