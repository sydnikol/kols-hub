// Gothic Theme Gallery
// Browse and apply 100+ alt-goth UI themes

import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Grid, Chip, IconButton, Tooltip, TextField, InputAdornment } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Palette, Search, Heart, Check, Eye, Download, Star,
  Moon, Sparkles, Skull, Ghost, Flame, Snowflake, Zap,
  Crown, Wand2, Feather, Wind, Sun
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import themesData from '../../data/alt_goth_ui_themes_100.json';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const GalleryContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const ThemeCard = styled(Box)<{ selected: boolean; themeAccent: string }>(({ selected, themeAccent }) => ({
  borderRadius: '16px',
  overflow: 'hidden',
  border: selected ? `3px solid ${themeAccent}` : '1px solid rgba(100, 100, 120, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 10px 30px ${themeAccent}30`,
  },
}));

const ThemePreview = styled(Box)<{ bgColor: string; accentColor: string }>(({ bgColor, accentColor }) => ({
  height: '120px',
  background: bgColor,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const PreviewButton = styled(Box)<{ accentColor: string; radius: string }>(({ accentColor, radius }) => ({
  padding: '6px 12px',
  background: accentColor,
  borderRadius: radius,
  color: '#fff',
  fontSize: '0.7rem',
  display: 'inline-block',
  width: 'fit-content',
}));

const PreviewCard = styled(Box)<{ cardBg: string; shadow: string }>(({ cardBg, shadow }) => ({
  padding: '8px',
  background: cardBg,
  borderRadius: '8px',
  boxShadow: shadow,
}));

const ColorSwatch = styled(Box)<{ swatchColor: string }>(({ swatchColor }) => ({
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  background: swatchColor,
  border: '2px solid rgba(255, 255, 255, 0.2)',
}));

const CategoryChip = styled(Chip)<{ selected: boolean; chipColor: string }>(({ selected, chipColor }) => ({
  margin: '4px',
  background: selected ? `${chipColor}30` : 'rgba(30, 30, 40, 0.6)',
  border: selected ? `2px solid ${chipColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  color: selected ? chipColor : '#888888',
  cursor: 'pointer',
  '&:hover': {
    background: `${chipColor}20`,
    borderColor: chipColor,
  },
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    background: 'rgba(20, 20, 30, 0.8)',
    borderRadius: '12px',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#8b5cf6',
  },
});

// Theme categories based on colors and fonts
const themeCategories = [
  { id: 'all', name: 'All Themes', icon: Palette, color: '#8b5cf6' },
  { id: 'purple', name: 'Purple/Violet', icon: Moon, color: '#8b5cf6' },
  { id: 'red', name: 'Red/Crimson', icon: Flame, color: '#ef4444' },
  { id: 'cyan', name: 'Cyan/Teal', icon: Snowflake, color: '#22d3ee' },
  { id: 'gold', name: 'Gold/Orange', icon: Crown, color: '#f59e0b' },
  { id: 'green', name: 'Green/Emerald', icon: Feather, color: '#22c55e' },
  { id: 'pink', name: 'Pink/Magenta', icon: Heart, color: '#ec4899' },
  { id: 'gothic', name: 'Gothic Fonts', icon: Skull, color: '#a855f7' },
  { id: 'modern', name: 'Modern Fonts', icon: Zap, color: '#60a5fa' },
];

// Convert themes object to array
const getThemesArray = () => {
  const themes: any[] = [];
  Object.entries(themesData).forEach(([key, theme]: [string, any]) => {
    themes.push({
      id: key,
      ...theme,
    });
  });
  return themes;
};

// Categorize theme based on accent color
const categorizeTheme = (accentColor: string): string[] => {
  const color = accentColor.toLowerCase();
  const categories: string[] = [];

  if (color.includes('bb86fc') || color.includes('8b5') || color.includes('6a5a') || color.includes('9c27')) {
    categories.push('purple');
  }
  if (color.includes('ff4') || color.includes('f44') || color.includes('dc14') || color.includes('e91')) {
    categories.push('red');
  }
  if (color.includes('66fc') || color.includes('00ff') || color.includes('20b2') || color.includes('00ced')) {
    categories.push('cyan');
  }
  if (color.includes('ffd') || color.includes('ff9') || color.includes('f59') || color.includes('ffb')) {
    categories.push('gold');
  }
  if (color.includes('22c') || color.includes('10b') || color.includes('00ff00') || color.includes('39ff')) {
    categories.push('green');
  }
  if (color.includes('ff69') || color.includes('ff14') || color.includes('ec48') || color.includes('e91e')) {
    categories.push('pink');
  }

  return categories.length > 0 ? categories : ['purple'];
};

// Categorize by font
const categorizeByFont = (font: string): string => {
  const gothicFonts = ['UnifrakturCook', 'Creepster', 'Metal Mania', 'Nosifer', 'Eater'];
  return gothicFonts.some(f => font.includes(f)) ? 'gothic' : 'modern';
};

export const GothicThemeGallery: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<any | null>(null);

  const themes = useMemo(() => getThemesArray(), []);

  const filteredThemes = useMemo(() => {
    return themes.filter(theme => {
      const matchesSearch = !searchQuery ||
        theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theme.font.toLowerCase().includes(searchQuery.toLowerCase());

      if (selectedCategory === 'all') return matchesSearch;

      const colorCategories = categorizeTheme(theme.accentColor);
      const fontCategory = categorizeByFont(theme.font);

      const matchesCategory = colorCategories.includes(selectedCategory) ||
        (selectedCategory === 'gothic' && fontCategory === 'gothic') ||
        (selectedCategory === 'modern' && fontCategory === 'modern');

      return matchesSearch && matchesCategory;
    });
  }, [themes, searchQuery, selectedCategory]);

  const toggleFavorite = (themeId: string) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(themeId)) {
        newFavs.delete(themeId);
      } else {
        newFavs.add(themeId);
      }
      return newFavs;
    });
  };

  const applyTheme = (theme: any) => {
    setActiveTheme(theme.id);
    // In a real app, this would apply the theme globally
    console.log('Applying theme:', theme.name);
  };

  return (
    <GalleryContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #8b5cf6)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: `${shimmer} 3s linear infinite`,
            mb: 1,
          }}
        >
          <Palette size={36} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#8b5cf6' }} />
          Gothic Theme Gallery
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          {themes.length} dark themes to transform your experience
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center', py: 2 }}>
            <Palette size={24} color="#8b5cf6" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>{themes.length}</Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Themes</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center', py: 2 }}>
            <Heart size={24} color="#ec4899" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#ec4899', fontSize: '1.5rem', fontWeight: 700 }}>{favorites.size}</Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Favorites</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center', py: 2 }}>
            <Skull size={24} color="#a855f7" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#a855f7', fontSize: '1.5rem', fontWeight: 700 }}>
              {themes.filter(t => categorizeByFont(t.font) === 'gothic').length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Gothic Fonts</Typography>
          </GothicCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <GothicCard variant="glass" sx={{ textAlign: 'center', py: 2 }}>
            <Check size={24} color="#22c55e" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 700 }}>
              {activeTheme ? '1' : '0'}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Applied</Typography>
          </GothicCard>
        </Grid>
      </Grid>

      {/* Search */}
      <Box sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}>
        <StyledTextField
          fullWidth
          placeholder="Search themes by name or font..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Category Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.5, mb: 4 }}>
        {themeCategories.map(category => (
          <CategoryChip
            key={category.id}
            icon={<category.icon size={14} />}
            label={category.name}
            selected={selectedCategory === category.id}
            chipColor={category.color}
            onClick={() => setSelectedCategory(category.id)}
          />
        ))}
      </Box>

      {/* Results Count */}
      <Typography sx={{ color: '#888888', mb: 3, textAlign: 'center' }}>
        Showing {filteredThemes.length} of {themes.length} themes
      </Typography>

      {/* Theme Grid */}
      <Grid container spacing={3}>
        {filteredThemes.slice(0, 24).map((theme) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={theme.id}>
            <ThemeCard
              selected={activeTheme === theme.id}
              themeAccent={theme.accentColor}
            >
              {/* Preview Section */}
              <ThemePreview bgColor={theme.background} accentColor={theme.accentColor}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography
                    sx={{
                      color: theme.textColor,
                      fontFamily: theme.font,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                    }}
                  >
                    {theme.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(theme.id);
                    }}
                    sx={{ color: favorites.has(theme.id) ? '#ec4899' : 'rgba(255,255,255,0.5)' }}
                  >
                    <Heart size={16} fill={favorites.has(theme.id) ? '#ec4899' : 'none'} />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <PreviewButton
                    accentColor={theme.accentColor}
                    radius={theme.components?.button?.borderRadius || '8px'}
                  >
                    Button
                  </PreviewButton>
                  <PreviewCard
                    cardBg={theme.components?.card?.backgroundColor || theme.background}
                    shadow={theme.components?.card?.boxShadow || 'none'}
                  >
                    <Box sx={{ width: '40px', height: '8px', background: theme.textColor, borderRadius: '4px', opacity: 0.5 }} />
                  </PreviewCard>
                </Box>
              </ThemePreview>

              {/* Info Section */}
              <Box sx={{ p: 2, background: 'rgba(20, 20, 30, 0.9)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Background">
                      <ColorSwatch swatchColor={theme.background} />
                    </Tooltip>
                    <Tooltip title="Accent">
                      <ColorSwatch swatchColor={theme.accentColor} />
                    </Tooltip>
                    <Tooltip title="Text">
                      <ColorSwatch swatchColor={theme.textColor} />
                    </Tooltip>
                  </Box>
                  <Chip
                    size="small"
                    label={theme.font.split(',')[0]}
                    sx={{
                      height: '20px',
                      fontSize: '0.65rem',
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#a78bfa',
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <GothicButton
                    variant="ghost"
                    size="small"
                    sx={{ flex: 1 }}
                    startIcon={<Eye size={14} />}
                    onClick={() => setPreviewTheme(theme)}
                  >
                    Preview
                  </GothicButton>
                  <GothicButton
                    variant={activeTheme === theme.id ? 'secondary' : 'primary'}
                    size="small"
                    sx={{ flex: 1 }}
                    startIcon={activeTheme === theme.id ? <Check size={14} /> : <Sparkles size={14} />}
                    onClick={() => applyTheme(theme)}
                  >
                    {activeTheme === theme.id ? 'Applied' : 'Apply'}
                  </GothicButton>
                </Box>
              </Box>

              {/* Active Indicator */}
              {activeTheme === theme.id && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Check size={14} color="#fff" />
                </Box>
              )}
            </ThemeCard>
          </Grid>
        ))}
      </Grid>

      {/* Preview Modal */}
      {previewTheme && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
          onClick={() => setPreviewTheme(null)}
        >
          <Box
            sx={{
              maxWidth: '600px',
              width: '100%',
              background: previewTheme.background,
              borderRadius: '20px',
              overflow: 'hidden',
              border: `2px solid ${previewTheme.accentColor}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ p: 4 }}>
              <Typography
                sx={{
                  fontFamily: previewTheme.font,
                  fontSize: '2rem',
                  color: previewTheme.textColor,
                  mb: 2,
                }}
              >
                {previewTheme.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: previewTheme.font,
                  color: previewTheme.textColor,
                  opacity: 0.8,
                  mb: 3,
                }}
              >
                This is how your interface would look with this theme applied.
                The dark background and accent colors create a unique gothic atmosphere.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    background: previewTheme.accentColor,
                    borderRadius: previewTheme.components?.button?.borderRadius || '8px',
                    color: '#fff',
                    fontFamily: previewTheme.font,
                  }}
                >
                  Primary Button
                </Box>
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    background: 'transparent',
                    border: `2px solid ${previewTheme.accentColor}`,
                    borderRadius: previewTheme.components?.button?.borderRadius || '8px',
                    color: previewTheme.accentColor,
                    fontFamily: previewTheme.font,
                  }}
                >
                  Secondary Button
                </Box>
              </Box>
              <Box
                sx={{
                  p: 3,
                  background: previewTheme.components?.card?.backgroundColor || 'rgba(0,0,0,0.3)',
                  borderRadius: '12px',
                  boxShadow: previewTheme.components?.card?.boxShadow,
                }}
              >
                <Typography sx={{ color: previewTheme.textColor, fontFamily: previewTheme.font }}>
                  Sample Card Component
                </Typography>
              </Box>
            </Box>
            <Box sx={{ p: 2, background: 'rgba(0,0,0,0.3)', display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <GothicButton variant="ghost" onClick={() => setPreviewTheme(null)}>
                Close
              </GothicButton>
              <GothicButton
                variant="primary"
                onClick={() => {
                  applyTheme(previewTheme);
                  setPreviewTheme(null);
                }}
              >
                Apply Theme
              </GothicButton>
            </Box>
          </Box>
        </Box>
      )}
    </GalleryContainer>
  );
};

export default GothicThemeGallery;
