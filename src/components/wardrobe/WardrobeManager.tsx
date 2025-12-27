// Wardrobe Manager Component
// Virtual closet with AI scanning and outfit building

import React, { useState } from 'react';
import { Box, Typography, Grid, Tabs, Tab, Chip, TextField, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Shirt, Camera, Sparkles, Heart, Tag, Plus,
  Search, Filter, Palette, Clock, Star, Trash2,
  Crown, ChevronLeft
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const WardrobeContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a080c 0%, #1a1020 50%, #0a080c 100%)',
  padding: '32px',
});

const ClothingCard = styled(GothicCard)<{ selected?: boolean }>(({ selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  border: selected ? '2px solid #8b5cf6' : undefined,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
  },
}));

const ClothingImage = styled(Box)({
  width: '100%',
  aspectRatio: '3/4',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(20, 20, 30, 0.8))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '12px',
  fontSize: '4rem',
});

const CategoryChip = styled(Chip)<{ active?: boolean }>(({ active }) => ({
  cursor: 'pointer',
  background: active ? 'rgba(139, 92, 246, 0.3)' : 'rgba(50, 50, 60, 0.5)',
  color: active ? '#a78bfa' : '#888888',
  border: active ? '1px solid #8b5cf6' : '1px solid transparent',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.2)',
  },
}));

const ScannerBox = styled(Box)({
  border: '2px dashed rgba(139, 92, 246, 0.5)',
  borderRadius: '16px',
  padding: '48px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: 'rgba(139, 92, 246, 0.05)',
  '&:hover': {
    borderColor: '#8b5cf6',
    background: 'rgba(139, 92, 246, 0.1)',
  },
});

// Clothing item types
interface ClothingItem {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  color: string;
  pattern: string;
  season: string[];
  occasions: string[];
  image: string;
  favorite: boolean;
  timesWorn: number;
  lastWorn: string;
  tags: string[];
}

const clothingItems: ClothingItem[] = [
  { id: '1', name: 'Black Velvet Dress', category: 'Dresses', subcategory: 'Evening', color: 'Black', pattern: 'Solid', season: ['Fall', 'Winter'], occasions: ['Formal', 'Night Out'], image: '👗', favorite: true, timesWorn: 12, lastWorn: '2 weeks ago', tags: ['Gothic', 'Elegant'] },
  { id: '2', name: 'Purple Silk Blouse', category: 'Tops', subcategory: 'Blouse', color: 'Purple', pattern: 'Solid', season: ['All'], occasions: ['Work', 'Casual'], image: '👚', favorite: true, timesWorn: 24, lastWorn: '3 days ago', tags: ['Professional', 'Versatile'] },
  { id: '3', name: 'High-Waisted Black Pants', category: 'Bottoms', subcategory: 'Pants', color: 'Black', pattern: 'Solid', season: ['All'], occasions: ['Work', 'Casual', 'Formal'], image: '👖', favorite: false, timesWorn: 45, lastWorn: 'Yesterday', tags: ['Staple', 'Comfortable'] },
  { id: '4', name: 'Lace Victorian Collar', category: 'Accessories', subcategory: 'Neckwear', color: 'White', pattern: 'Lace', season: ['All'], occasions: ['Formal', 'Special'], image: '🎀', favorite: true, timesWorn: 8, lastWorn: '1 month ago', tags: ['Victorian', 'Statement'] },
  { id: '5', name: 'Burgundy Ankle Boots', category: 'Shoes', subcategory: 'Boots', color: 'Burgundy', pattern: 'Solid', season: ['Fall', 'Winter'], occasions: ['Casual', 'Night Out'], image: '👢', favorite: true, timesWorn: 30, lastWorn: '1 week ago', tags: ['Comfortable', 'Stylish'] },
  { id: '6', name: 'Embroidered Kimono', category: 'Outerwear', subcategory: 'Cardigan', color: 'Black', pattern: 'Floral', season: ['Spring', 'Summer'], occasions: ['Casual', 'Festival'], image: '🧥', favorite: false, timesWorn: 15, lastWorn: '2 months ago', tags: ['Bohemian', 'Unique'] },
  { id: '7', name: 'Silver Moon Pendant', category: 'Accessories', subcategory: 'Jewelry', color: 'Silver', pattern: 'N/A', season: ['All'], occasions: ['All'], image: '🌙', favorite: true, timesWorn: 100, lastWorn: 'Today', tags: ['Daily Wear', 'Spiritual'] },
  { id: '8', name: 'Oversized Cozy Sweater', category: 'Tops', subcategory: 'Sweater', color: 'Gray', pattern: 'Cable Knit', season: ['Fall', 'Winter'], occasions: ['Casual', 'Lounging'], image: '🧶', favorite: false, timesWorn: 20, lastWorn: '4 days ago', tags: ['Cozy', 'Sensory-Friendly'] },
];

const categories = ['All', 'Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

const stylePresets = [
  { id: 'sensory-safe', name: 'Sensory Safe', description: 'Soft fabrics, no tags, comfortable fit', icon: '🌿', color: '#10b981' },
  { id: 'academic-goth', name: 'Academic Goth', description: 'Dark academia meets gothic elegance', icon: '📚', color: '#7c2d12' },
  { id: 'afrofuturist', name: 'Afrofuturist', description: 'Bold, cosmic, cultural pride', icon: '✨', color: '#d4af37' },
  { id: 'cyberpunk-witch', name: 'Cyberpunk Witch', description: 'Tech meets magic aesthetic', icon: '🔮', color: '#8b5cf6' },
  { id: 'minimalist-black', name: 'Quiet Mode', description: 'Clean lines, all black everything', icon: '🖤', color: '#1a1a1a' },
  { id: 'cozy-spooky', name: 'Cozy Spooky', description: 'Comfortable with a dark twist', icon: '🦇', color: '#4a1a4a' },
];

// Era Closets - Historical Fashion Collections
interface EraItem {
  name: string;
  emoji: string;
  type: string;
}

interface EraCloset {
  id: string;
  name: string;
  era: string;
  description: string;
  items: EraItem[];
  accentColor: string;
}

const eraClosets: EraCloset[] = [
  {
    id: 'victorian',
    name: 'Victorian Gothic',
    era: '1837-1901',
    description: 'Corsets, bustles, high collars, and dark elegance',
    accentColor: '#4a1a4a',
    items: [
      { name: 'Black Velvet Corset', emoji: '🖤', type: 'Top' },
      { name: 'Bustle Skirt', emoji: '👗', type: 'Bottom' },
      { name: 'Lace Choker', emoji: '📿', type: 'Accessory' },
      { name: 'Mourning Veil', emoji: '🧣', type: 'Headwear' },
      { name: 'Button Boots', emoji: '👢', type: 'Shoes' },
    ]
  },
  {
    id: 'harlem-renaissance',
    name: 'Harlem Renaissance',
    era: '1920s-1930s',
    description: 'Jazz age glamour, flapper style, and Afrocentric fashion',
    accentColor: '#d4af37',
    items: [
      { name: 'Beaded Flapper Dress', emoji: '✨', type: 'Dress' },
      { name: 'Feather Headband', emoji: '🪶', type: 'Headwear' },
      { name: 'Pearl Rope Necklace', emoji: '📿', type: 'Accessory' },
      { name: 'T-Strap Heels', emoji: '👠', type: 'Shoes' },
      { name: 'Fur Stole', emoji: '🧥', type: 'Outerwear' },
    ]
  },
  {
    id: 'civil-rights',
    name: 'Civil Rights Era',
    era: '1950s-1960s',
    description: 'Dignified resistance, Sunday best, and movement style',
    accentColor: '#1e3a5f',
    items: [
      { name: 'A-Line Dress', emoji: '👗', type: 'Dress' },
      { name: 'Pillbox Hat', emoji: '🎩', type: 'Headwear' },
      { name: 'White Gloves', emoji: '🧤', type: 'Accessory' },
      { name: 'Kitten Heels', emoji: '👠', type: 'Shoes' },
      { name: 'Pencil Skirt', emoji: '👔', type: 'Bottom' },
    ]
  },
  {
    id: 'afrofuturist',
    name: 'Afrofuturist',
    era: 'Future',
    description: 'Sci-fi meets African heritage, cosmic royalty',
    accentColor: '#8b5cf6',
    items: [
      { name: 'Holographic Bodysuit', emoji: '🌟', type: 'Full' },
      { name: 'Geometric Crown', emoji: '👑', type: 'Headwear' },
      { name: 'LED Jewelry', emoji: '💫', type: 'Accessory' },
      { name: 'Platform Boots', emoji: '👢', type: 'Shoes' },
      { name: 'Metallic Cape', emoji: '🦸', type: 'Outerwear' },
    ]
  },
  {
    id: 'disco-soul',
    name: 'Disco & Soul',
    era: '1970s',
    description: 'Funk, glitter, platform shoes, and bold expression',
    accentColor: '#ec4899',
    items: [
      { name: 'Bell Bottoms', emoji: '👖', type: 'Bottom' },
      { name: 'Halter Top', emoji: '👚', type: 'Top' },
      { name: 'Platform Shoes', emoji: '👟', type: 'Shoes' },
      { name: 'Afro Pick', emoji: '✊', type: 'Accessory' },
      { name: 'Jumpsuit', emoji: '🕺', type: 'Full' },
    ]
  },
  {
    id: 'hip-hop-golden',
    name: 'Hip Hop Golden Age',
    era: '1980s-1990s',
    description: 'Streetwear, bold colors, gold chains, and fresh kicks',
    accentColor: '#f59e0b',
    items: [
      { name: 'Bomber Jacket', emoji: '🧥', type: 'Outerwear' },
      { name: 'Gold Chain', emoji: '⛓️', type: 'Accessory' },
      { name: 'Kangol Hat', emoji: '🧢', type: 'Headwear' },
      { name: 'High-Top Sneakers', emoji: '👟', type: 'Shoes' },
      { name: 'Baggy Jeans', emoji: '👖', type: 'Bottom' },
    ]
  },
];

// Styled components for Era Closets
const EraCard = styled(GothicCard)<{ accentColor?: string }>(({ accentColor = '#8b5cf6' }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${accentColor}, transparent)`,
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px ${accentColor}40`,
  },
}));

const EraItemCard = styled(Box)<{ accentColor?: string }>(({ accentColor = '#8b5cf6' }) => ({
  background: 'rgba(20, 20, 30, 0.6)',
  borderRadius: '12px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.3s ease',
  border: '1px solid transparent',
  '&:hover': {
    background: 'rgba(30, 30, 40, 0.8)',
    borderColor: `${accentColor}50`,
    transform: 'translateY(-4px)',
  },
}));

const AvatarDisplay = styled(Box)({
  width: '200px',
  height: '300px',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.1) 0%, rgba(20, 20, 30, 0.9) 100%)',
  border: '2px solid rgba(139, 92, 246, 0.3)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

export const WardrobeManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  // Era Closets state
  const [selectedEra, setSelectedEra] = useState<EraCloset | null>(null);
  const [tryOnItems, setTryOnItems] = useState<EraItem[]>([]);

  const filteredItems = clothingItems.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Era Closets helper functions
  const handleEraSelect = (era: EraCloset) => {
    setSelectedEra(era);
    setTryOnItems([]);
  };

  const handleBackToEras = () => {
    setSelectedEra(null);
    setTryOnItems([]);
  };

  const handleTryOn = (item: EraItem) => {
    setTryOnItems(prev => {
      // Check if item of same type exists, replace it
      const existingIndex = prev.findIndex(i => i.type === item.type);
      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex] = item;
        return newItems;
      }
      return [...prev, item];
    });
  };

  const handleRemoveTryOn = (item: EraItem) => {
    setTryOnItems(prev => prev.filter(i => i.name !== item.name));
  };

  const clearTryOn = () => {
    setTryOnItems([]);
  };

  return (
    <WardrobeContainer>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#8b5cf6',
            letterSpacing: '0.1em',
            textShadow: '0 0 30px rgba(139, 92, 246, 0.4)',
            mb: 1,
          }}
        >
          <Shirt size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Wardrobe Palace
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Your digital closet awaits
        </Typography>
      </Box>

      {/* Stats Bar */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Shirt size={24} color="#8b5cf6" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>
              {clothingItems.length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Total Items</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Heart size={24} color="#ec4899" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#ec4899', fontSize: '1.5rem', fontWeight: 700 }}>
              {clothingItems.filter(i => i.favorite).length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Favorites</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Star size={24} color="#d4af37" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#d4af37', fontSize: '1.5rem', fontWeight: 700 }}>
              24
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Outfits Created</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center' }}>
            <Palette size={24} color="#10b981" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
              6
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Style Presets</Typography>
          </GothicCard>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        centered
        sx={{
          mb: 4,
          '& .MuiTab-root': { color: '#888888', fontFamily: '"Cinzel", serif' },
          '& .Mui-selected': { color: '#8b5cf6' },
          '& .MuiTabs-indicator': { backgroundColor: '#8b5cf6' },
        }}
      >
        <Tab label="My Closet" />
        <Tab label="Scan Item" />
        <Tab label="Style Presets" />
        <Tab label="Era Closets" />
        <Tab label="Outfit Builder" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                flex: 1,
                minWidth: '200px',
                '& .MuiOutlinedInput-root': {
                  color: '#e0e0e0',
                  background: 'rgba(20, 20, 30, 0.8)',
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: '#8b5cf6' },
                },
              }}
              InputProps={{
                startAdornment: <Search size={18} color="#888888" style={{ marginRight: '8px' }} />,
              }}
            />
            <GothicButton variant="secondary" startIcon={<Filter size={16} />}>
              Filters
            </GothicButton>
            <GothicButton variant="accent" startIcon={<Plus size={16} />}>
              Add Item
            </GothicButton>
          </Box>

          {/* Category Pills */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              />
            ))}
          </Box>

          {/* Clothing Grid */}
          <Grid container spacing={2}>
            {filteredItems.map((item) => (
              <Grid item xs={6} sm={4} md={3} key={item.id}>
                <ClothingCard
                  variant="glass"
                  selected={selectedItems.includes(item.id)}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  {item.favorite && (
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <Heart size={18} color="#ec4899" fill="#ec4899" />
                    </Box>
                  )}
                  <ClothingImage>{item.image}</ClothingImage>
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.8rem', mb: 1 }}>
                    {item.category} • {item.color}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {item.tags.slice(0, 2).map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', fontSize: '0.65rem', height: '20px' }}
                      />
                    ))}
                  </Box>
                </ClothingCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <GothicCard variant="elevated" ornate sx={{ maxWidth: '600px', mx: 'auto' }}>
          <Typography sx={{ color: '#8b5cf6', fontFamily: '"Cinzel", serif', fontSize: '1.5rem', mb: 3, textAlign: 'center' }}>
            <Camera size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            AI Clothing Scanner
          </Typography>
          <ScannerBox>
            <Camera size={48} color="#8b5cf6" style={{ marginBottom: '16px' }} />
            <Typography sx={{ color: '#e0e0e0', fontSize: '1.1rem', mb: 1 }}>
              Drop a photo or click to scan
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.9rem', mb: 3 }}>
              Our AI will identify the item, color, pattern, and suggest categories
            </Typography>
            <GothicButton variant="primary" startIcon={<Camera size={18} />}>
              Take Photo
            </GothicButton>
          </ScannerBox>
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem', textAlign: 'center' }}>
              <Sparkles size={16} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
              AI can detect: Color, pattern, category, occasion, and style tags
            </Typography>
          </Box>
        </GothicCard>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Style Presets
          </Typography>
          <Grid container spacing={3}>
            {stylePresets.map((preset) => (
              <Grid item xs={12} sm={6} md={4} key={preset.id}>
                <GothicCard
                  variant="glass"
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${preset.color}40`,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: `${preset.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                      }}
                    >
                      {preset.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem' }}>
                        {preset.name}
                      </Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                        {preset.description}
                      </Typography>
                    </Box>
                  </Box>
                  <GothicButton variant="ghost" size="small" sx={{ width: '100%' }}>
                    Apply Style
                  </GothicButton>
                </GothicCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          {!selectedEra ? (
            // Era Selection Grid
            <>
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <Crown size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Historical Fashion Collections
              </Typography>
              <Typography sx={{ color: '#9080a0', mb: 4, fontStyle: 'italic' }}>
                Explore fashion through the ages - from Victorian elegance to Afrofuturist visions
              </Typography>
              <Grid container spacing={3}>
                {eraClosets.map((era) => (
                  <Grid item xs={12} sm={6} md={4} key={era.id}>
                    <EraCard
                      variant="glass"
                      accentColor={era.accentColor}
                      onClick={() => handleEraSelect(era)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                          sx={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '12px',
                            background: `${era.accentColor}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                          }}
                        >
                          {era.items[0]?.emoji || '👗'}
                        </Box>
                        <Box>
                          <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem' }}>
                            {era.name}
                          </Typography>
                          <Typography sx={{ color: era.accentColor, fontSize: '0.85rem', fontWeight: 500 }}>
                            {era.era}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ color: '#888888', fontSize: '0.9rem', mb: 2 }}>
                        {era.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        {era.items.slice(0, 3).map((item, idx) => (
                          <Chip
                            key={idx}
                            label={item.emoji}
                            size="small"
                            sx={{
                              background: `${era.accentColor}20`,
                              color: era.accentColor,
                              fontSize: '1rem',
                            }}
                          />
                        ))}
                        {era.items.length > 3 && (
                          <Chip
                            label={`+${era.items.length - 3}`}
                            size="small"
                            sx={{
                              background: 'rgba(50, 50, 60, 0.5)',
                              color: '#888888',
                              fontSize: '0.75rem',
                            }}
                          />
                        )}
                      </Box>
                      <GothicButton variant="ghost" size="small" sx={{ width: '100%' }}>
                        Explore Collection
                      </GothicButton>
                    </EraCard>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            // Selected Era Detail View
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <GothicButton
                  variant="ghost"
                  size="small"
                  startIcon={<ChevronLeft size={18} />}
                  onClick={handleBackToEras}
                >
                  Back to Eras
                </GothicButton>
              </Box>
              <Grid container spacing={4}>
                {/* Left side - Avatar Display */}
                <Grid item xs={12} md={4}>
                  <GothicCard variant="elevated" ornate>
                    <Typography sx={{ color: selectedEra.accentColor, fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2, textAlign: 'center' }}>
                      Virtual Try-On
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      <AvatarDisplay>
                        {tryOnItems.length === 0 ? (
                          <Typography sx={{ color: '#888888', fontSize: '0.9rem', textAlign: 'center', px: 2 }}>
                            Click "Try On" to see items here
                          </Typography>
                        ) : (
                          tryOnItems.map((item, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                background: 'rgba(20, 20, 30, 0.6)',
                                px: 2,
                                py: 1,
                                borderRadius: '8px',
                                cursor: 'pointer',
                                '&:hover': {
                                  background: 'rgba(239, 68, 68, 0.2)',
                                },
                              }}
                              onClick={() => handleRemoveTryOn(item)}
                            >
                              <Typography sx={{ fontSize: '1.5rem' }}>{item.emoji}</Typography>
                              <Typography sx={{ color: '#e0e0e0', fontSize: '0.8rem' }}>{item.type}</Typography>
                            </Box>
                          ))
                        )}
                      </AvatarDisplay>
                    </Box>
                    {tryOnItems.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <GothicButton variant="primary" size="small" sx={{ flex: 1 }}>
                          Save Look
                        </GothicButton>
                        <GothicButton variant="ghost" size="small" onClick={clearTryOn}>
                          Clear
                        </GothicButton>
                      </Box>
                    )}
                  </GothicCard>
                </Grid>
                {/* Right side - Era Items */}
                <Grid item xs={12} md={8}>
                  <Box sx={{ mb: 3 }}>
                    <Typography sx={{ color: selectedEra.accentColor, fontFamily: '"Cinzel", serif', fontSize: '1.5rem', mb: 1 }}>
                      {selectedEra.name}
                    </Typography>
                    <Typography sx={{ color: '#888888', fontSize: '0.9rem' }}>
                      {selectedEra.era} - {selectedEra.description}
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {selectedEra.items.map((item, idx) => (
                      <Grid item xs={6} sm={4} key={idx}>
                        <EraItemCard accentColor={selectedEra.accentColor}>
                          <Box
                            sx={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '12px',
                              background: `${selectedEra.accentColor}15`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '3rem',
                              mb: 1,
                            }}
                          >
                            {item.emoji}
                          </Box>
                          <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.type}
                            size="small"
                            sx={{
                              background: `${selectedEra.accentColor}20`,
                              color: selectedEra.accentColor,
                              fontSize: '0.7rem',
                              height: '22px',
                            }}
                          />
                          <GothicButton
                            variant="accent"
                            size="small"
                            sx={{ mt: 1, width: '100%' }}
                            onClick={() => handleTryOn(item)}
                          >
                            Try On
                          </GothicButton>
                        </EraItemCard>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      )}

      {activeTab === 4 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <GothicCard variant="elevated" ornate>
              <Typography sx={{ color: '#8b5cf6', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 2 }}>
                Selected Items ({selectedItems.length})
              </Typography>
              {selectedItems.length === 0 ? (
                <Typography sx={{ color: '#888888', textAlign: 'center', py: 4 }}>
                  Select items from your closet to build an outfit
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {selectedItems.map((id) => {
                    const item = clothingItems.find(i => i.id === id);
                    return item ? (
                      <Box
                        key={id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 1.5,
                          background: 'rgba(20, 20, 30, 0.6)',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography sx={{ fontSize: '2rem' }}>{item.image}</Typography>
                        <Box sx={{ flex: 1 }}>
                          <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{item.name}</Typography>
                          <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{item.category}</Typography>
                        </Box>
                        <Trash2
                          size={16}
                          color="#ef4444"
                          style={{ cursor: 'pointer' }}
                          onClick={() => toggleItemSelection(id)}
                        />
                      </Box>
                    ) : null;
                  })}
                </Box>
              )}
              {selectedItems.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <GothicButton variant="primary" sx={{ flex: 1 }}>
                    Save Outfit
                  </GothicButton>
                  <GothicButton variant="ghost" onClick={() => setSelectedItems([])}>
                    Clear
                  </GothicButton>
                </Box>
              )}
            </GothicCard>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 2 }}>
              Click items to add to outfit
            </Typography>
            <Grid container spacing={2}>
              {clothingItems.map((item) => (
                <Grid item xs={4} sm={3} key={item.id}>
                  <ClothingCard
                    variant="glass"
                    selected={selectedItems.includes(item.id)}
                    onClick={() => toggleItemSelection(item.id)}
                    sx={{ p: 1.5 }}
                  >
                    <ClothingImage sx={{ aspectRatio: '1', fontSize: '2.5rem' }}>{item.image}</ClothingImage>
                    <Typography sx={{ color: '#e0e0e0', fontSize: '0.75rem', textAlign: 'center' }}>
                      {item.name}
                    </Typography>
                  </ClothingCard>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </WardrobeContainer>
  );
};

export default WardrobeManager;
