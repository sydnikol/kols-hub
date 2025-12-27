// Gothic Theme Explorer
// Full-featured theme browser with live preview and color management

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Palette,
  Eye,
  Copy,
  Heart,
  Sparkles,
  Moon,
  Sun,
  Search,
  X,
} from 'lucide-react';
import themesData from '../../data/gothic-themes-100.json';

// ============================================================================
// Types
// ============================================================================

interface GothicTheme {
  id: number;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
  aesthetic: string;
}

// ============================================================================
// Animations
// ============================================================================

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const sparkle = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

// ============================================================================
// Styled Components
// ============================================================================

const ExplorerContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
  paddingTop: '48px',
});

const Header = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '3rem',
  fontWeight: 700,
  background: 'linear-gradient(90deg, #581c87, #7e22ce, #a855f7, #7e22ce, #581c87)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 4s linear infinite`,
  textAlign: 'center',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
});

const SubHeader = styled(Typography)({
  color: '#c0b0d0',
  fontStyle: 'italic',
  textAlign: 'center',
  marginBottom: '32px',
  fontSize: '1.1rem',
});

const SearchField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    background: 'rgba(88, 28, 135, 0.15)',
    borderRadius: '16px',
    fontSize: '1rem',
    '& fieldset': {
      borderColor: 'rgba(126, 34, 206, 0.3)',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(126, 34, 206, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#7e22ce',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#a855f7',
  },
});

const ThemeCard = styled(Box)<{ isFavorite: boolean; isApplied: boolean }>(
  ({ isFavorite, isApplied }) => ({
    background: 'rgba(20, 20, 30, 0.8)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: isApplied
      ? '3px solid #22c55e'
      : isFavorite
      ? '2px solid #ec4899'
      : '1px solid rgba(126, 34, 206, 0.3)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(126, 34, 206, 0.3), 0 0 30px rgba(168, 85, 247, 0.2)',
      borderColor: '#7e22ce',
    },
  })
);

const ColorSwatchStrip = styled(Box)({
  display: 'flex',
  height: '60px',
  width: '100%',
  gap: 0,
});

const ColorSwatch = styled(Box)<{ color: string }>(({ color }) => ({
  flex: 1,
  background: color,
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    flex: 1.5,
    zIndex: 1,
  },
}));

const ThemeCardContent = styled(Box)({
  padding: '20px',
});

const ThemeName = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '1.3rem',
  fontWeight: 700,
  color: '#e0d0f0',
  marginBottom: '8px',
});

const AestheticText = styled(Typography)({
  color: '#9080a0',
  fontSize: '0.9rem',
  marginBottom: '16px',
  fontStyle: 'italic',
  lineHeight: 1.5,
});

const ActionButton = styled(Box)<{ variant?: 'primary' | 'secondary' }>(({ variant = 'primary' }) => ({
  padding: '10px 20px',
  borderRadius: '12px',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  background: variant === 'primary' ? '#7e22ce' : 'transparent',
  color: variant === 'primary' ? '#fff' : '#7e22ce',
  border: variant === 'primary' ? 'none' : '2px solid #7e22ce',
  '&:hover': {
    background: variant === 'primary' ? '#581c87' : 'rgba(126, 34, 206, 0.1)',
    transform: 'scale(1.05)',
  },
}));

const RandomButton = styled(Box)({
  padding: '16px 32px',
  borderRadius: '16px',
  fontSize: '1.1rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  background: 'linear-gradient(135deg, #581c87, #7e22ce)',
  color: '#fff',
  border: '2px solid #a855f7',
  boxShadow: '0 8px 24px rgba(126, 34, 206, 0.4)',
  '&:hover': {
    transform: 'scale(1.08) translateY(-2px)',
    boxShadow: '0 12px 32px rgba(126, 34, 206, 0.6)',
    '& .sparkle-icon': {
      animation: `${sparkle} 0.6s ease-in-out`,
    },
  },
});

const FavoriteIcon = styled(Box)<{ isFavorite: boolean }>(({ isFavorite }) => ({
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: isFavorite ? '#ec4899' : 'rgba(20, 20, 30, 0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  zIndex: 2,
  border: isFavorite ? '2px solid #fbbf24' : '1px solid rgba(126, 34, 206, 0.3)',
  '&:hover': {
    transform: 'scale(1.15)',
    background: isFavorite ? '#db2777' : 'rgba(126, 34, 206, 0.3)',
  },
}));

const AppliedBadge = styled(Box)({
  position: 'absolute',
  top: '12px',
  left: '12px',
  padding: '6px 12px',
  borderRadius: '8px',
  background: '#22c55e',
  color: '#fff',
  fontSize: '0.75rem',
  fontWeight: 700,
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  animation: `${pulse} 2s ease-in-out infinite`,
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'transparent',
    boxShadow: 'none',
    maxWidth: '900px',
    width: '100%',
  },
});

const DialogInner = styled(Box)<{ bgColor: string; accentColor: string }>(
  ({ bgColor, accentColor }) => ({
    background: bgColor,
    borderRadius: '24px',
    overflow: 'hidden',
    border: `3px solid ${accentColor}`,
    boxShadow: `0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px ${accentColor}40`,
  })
);

const ColorBlock = styled(Box)<{ color: string }>(({ color }) => ({
  background: color,
  padding: '24px',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '120px',
  border: '2px solid rgba(255, 255, 255, 0.1)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
}));

const ColorHex = styled(Typography)({
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '1.2rem',
  fontWeight: 700,
  color: '#fff',
  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
  marginBottom: '8px',
});

const ColorLabel = styled(Typography)({
  fontSize: '0.85rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.8)',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
});

const CopyButton = styled(Box)({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  opacity: 0,
  transition: 'all 0.3s ease',
  '.ColorBlock:hover &': {
    opacity: 1,
  },
  '&:hover': {
    background: 'rgba(0, 0, 0, 0.8)',
    transform: 'scale(1.1)',
  },
});

const LivePreviewSection = styled(Box)<{ bgColor: string }>(({ bgColor }) => ({
  background: bgColor,
  padding: '32px',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StatsContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  marginBottom: '32px',
  flexWrap: 'wrap',
});

const StatCard = styled(Box)({
  background: 'rgba(88, 28, 135, 0.2)',
  border: '1px solid rgba(126, 34, 206, 0.4)',
  borderRadius: '16px',
  padding: '16px 24px',
  textAlign: 'center',
  minWidth: '140px',
});

const StatValue = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 700,
  color: '#a855f7',
  marginBottom: '4px',
});

const StatLabel = styled(Typography)({
  fontSize: '0.85rem',
  color: '#9080a0',
  textTransform: 'uppercase',
  letterSpacing: '1px',
});

// ============================================================================
// Main Component
// ============================================================================

export const GothicThemeExplorer: React.FC = React.memo(() => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [selectedTheme, setSelectedTheme] = useState<GothicTheme | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Memoized themes data
  const themes = useMemo<GothicTheme[]>(() => {
    return themesData.themes;
  }, []);

  // Filtered themes based on search
  const filteredThemes = useMemo(() => {
    if (!searchQuery.trim()) {
      return themes;
    }

    const query = searchQuery.toLowerCase();
    return themes.filter(
      (theme) =>
        theme.name.toLowerCase().includes(query) ||
        theme.aesthetic.toLowerCase().includes(query)
    );
  }, [themes, searchQuery]);

  // Toggle favorite
  const toggleFavorite = useCallback((themeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      const id = String(themeId);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  }, []);

  // Toggle applied
  const toggleApplied = useCallback((themeId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setApplied((prev) => {
      const newApplied = new Set(prev);
      const id = String(themeId);
      if (newApplied.has(id)) {
        newApplied.delete(id);
      } else {
        newApplied.add(id);
      }
      return newApplied;
    });
  }, []);

  // Get random theme
  const getRandomTheme = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setSelectedTheme(themes[randomIndex]);
  }, [themes]);

  // Copy color to clipboard
  const copyColor = useCallback(async (color: string, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  }, []);

  // Open preview dialog
  const openPreview = useCallback((theme: GothicTheme, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTheme(theme);
  }, []);

  // Close preview dialog
  const closePreview = useCallback(() => {
    setSelectedTheme(null);
  }, []);

  return (
    <ExplorerContainer>
      {/* Header */}
      <Header>
        <Palette size={48} color="#a855f7" />
        Gothic Theme Explorer
      </Header>
      <SubHeader>
        Discover and explore {themes.length} dark gothic color schemes
      </SubHeader>

      {/* Stats */}
      <StatsContainer>
        <StatCard>
          <StatValue>{themes.length}</StatValue>
          <StatLabel>Total Themes</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{favorites.size}</StatValue>
          <StatLabel>Favorites</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{applied.size}</StatValue>
          <StatLabel>Applied</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{filteredThemes.length}</StatValue>
          <StatLabel>Showing</StatLabel>
        </StatCard>
      </StatsContainer>

      {/* Search and Random */}
      <Box sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}>
        <SearchField
          fullWidth
          placeholder="Search by theme name or aesthetic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Box sx={{ textAlign: 'center' }}>
          <RandomButton onClick={getRandomTheme}>
            <Sparkles size={24} className="sparkle-icon" />
            Random Theme Discovery
            <Sparkles size={24} className="sparkle-icon" />
          </RandomButton>
        </Box>
      </Box>

      {/* Theme Grid */}
      <Grid container spacing={3}>
        {filteredThemes.map((theme) => {
          const isFavorite = favorites.has(String(theme.id));
          const isApplied = applied.has(String(theme.id));

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={theme.id}>
              <ThemeCard
                isFavorite={isFavorite}
                isApplied={isApplied}
                onClick={(e) => openPreview(theme, e)}
              >
                {/* Applied Badge */}
                {isApplied && (
                  <AppliedBadge>
                    <Sun size={12} />
                    APPLIED
                  </AppliedBadge>
                )}

                {/* Favorite Icon */}
                <FavoriteIcon
                  isFavorite={isFavorite}
                  onClick={(e) => toggleFavorite(theme.id, e)}
                >
                  <Heart
                    size={20}
                    color={isFavorite ? '#fff' : '#7e22ce'}
                    fill={isFavorite ? '#fff' : 'none'}
                  />
                </FavoriteIcon>

                {/* Color Swatch Strip */}
                <ColorSwatchStrip>
                  <Tooltip title="Primary" arrow>
                    <ColorSwatch color={theme.primary} />
                  </Tooltip>
                  <Tooltip title="Secondary" arrow>
                    <ColorSwatch color={theme.secondary} />
                  </Tooltip>
                  <Tooltip title="Accent" arrow>
                    <ColorSwatch color={theme.accent} />
                  </Tooltip>
                  <Tooltip title="Text" arrow>
                    <ColorSwatch color={theme.text} />
                  </Tooltip>
                  <Tooltip title="Background" arrow>
                    <ColorSwatch color={theme.background} />
                  </Tooltip>
                </ColorSwatchStrip>

                {/* Card Content */}
                <ThemeCardContent>
                  <ThemeName>{theme.name}</ThemeName>
                  <AestheticText>{theme.aesthetic}</AestheticText>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <ActionButton
                      variant="primary"
                      onClick={(e) => openPreview(theme, e)}
                      sx={{ flex: 1 }}
                    >
                      <Eye size={16} />
                      Preview
                    </ActionButton>
                    <ActionButton
                      variant={isApplied ? 'primary' : 'secondary'}
                      onClick={(e) => toggleApplied(theme.id, e)}
                      sx={{ flex: 1 }}
                    >
                      {isApplied ? <Moon size={16} /> : <Sun size={16} />}
                      {isApplied ? 'Applied' : 'Apply'}
                    </ActionButton>
                  </Box>
                </ThemeCardContent>
              </ThemeCard>
            </Grid>
          );
        })}
      </Grid>

      {/* No Results */}
      {filteredThemes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography sx={{ color: '#9080a0', fontSize: '1.2rem' }}>
            No themes found matching "{searchQuery}"
          </Typography>
        </Box>
      )}

      {/* Preview Dialog */}
      <DialogStyled
        open={!!selectedTheme}
        onClose={closePreview}
        maxWidth="md"
        fullWidth
      >
        {selectedTheme && (
          <DialogInner
            bgColor={selectedTheme.background}
            accentColor={selectedTheme.accent}
          >
            {/* Dialog Header */}
            <Box
              sx={{
                p: 3,
                borderBottom: `1px solid ${selectedTheme.accent}40`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: selectedTheme.text,
                    mb: 1,
                  }}
                >
                  {selectedTheme.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1rem',
                    color: selectedTheme.accent,
                    fontStyle: 'italic',
                  }}
                >
                  {selectedTheme.aesthetic}
                </Typography>
              </Box>
              <IconButton onClick={closePreview} sx={{ color: selectedTheme.text }}>
                <X size={24} />
              </IconButton>
            </Box>

            {/* Color Blocks */}
            <Box sx={{ p: 3 }}>
              <Typography
                sx={{
                  color: selectedTheme.text,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  mb: 2,
                  opacity: 0.8,
                }}
              >
                Color Palette
              </Typography>
              <Grid container spacing={2}>
                {[
                  { label: 'Primary', color: selectedTheme.primary },
                  { label: 'Secondary', color: selectedTheme.secondary },
                  { label: 'Accent', color: selectedTheme.accent },
                  { label: 'Text', color: selectedTheme.text },
                  { label: 'Background', color: selectedTheme.background },
                ].map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.label}>
                    <ColorBlock
                      color={item.color}
                      onClick={(e) => copyColor(item.color, e)}
                    >
                      <CopyButton onClick={(e) => copyColor(item.color, e)}>
                        <Copy size={16} color="#fff" />
                      </CopyButton>
                      <ColorLabel>{item.label}</ColorLabel>
                      <ColorHex>{item.color}</ColorHex>
                      {copiedColor === item.color && (
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: '#22c55e',
                            fontWeight: 700,
                            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                          }}
                        >
                          Copied!
                        </Typography>
                      )}
                    </ColorBlock>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Live Preview Section */}
            <LivePreviewSection bgColor={selectedTheme.background}>
              <Typography
                sx={{
                  color: selectedTheme.text,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  mb: 3,
                  opacity: 0.8,
                }}
              >
                Live Preview
              </Typography>

              {/* Sample UI Elements */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Sample Text */}
                <Box>
                  <Typography
                    sx={{
                      color: selectedTheme.text,
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    The Gothic Interface
                  </Typography>
                  <Typography
                    sx={{
                      color: selectedTheme.text,
                      opacity: 0.8,
                      mb: 2,
                    }}
                  >
                    Experience the dark elegance of this carefully crafted color scheme.
                    Each hue has been selected to create a harmonious gothic atmosphere.
                  </Typography>
                </Box>

                {/* Sample Buttons */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      background: selectedTheme.primary,
                      color: selectedTheme.text,
                      borderRadius: '12px',
                      fontWeight: 600,
                    }}
                  >
                    Primary Button
                  </Box>
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      background: selectedTheme.secondary,
                      color: selectedTheme.text,
                      borderRadius: '12px',
                      fontWeight: 600,
                    }}
                  >
                    Secondary Button
                  </Box>
                  <Box
                    sx={{
                      px: 3,
                      py: 1.5,
                      background: selectedTheme.accent,
                      color: '#fff',
                      borderRadius: '12px',
                      fontWeight: 600,
                    }}
                  >
                    Accent Button
                  </Box>
                </Box>

                {/* Sample Card */}
                <Box
                  sx={{
                    p: 3,
                    background: selectedTheme.primary,
                    borderRadius: '16px',
                    border: `2px solid ${selectedTheme.accent}`,
                  }}
                >
                  <Typography
                    sx={{
                      color: selectedTheme.text,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    Sample Card Component
                  </Typography>
                  <Typography sx={{ color: selectedTheme.text, opacity: 0.8 }}>
                    This card demonstrates how content appears with the selected theme.
                  </Typography>
                </Box>
              </Box>
            </LivePreviewSection>

            {/* Dialog Actions */}
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${selectedTheme.accent}40`,
                display: 'flex',
                gap: 2,
                justifyContent: 'flex-end',
              }}
            >
              <ActionButton variant="secondary" onClick={closePreview}>
                Close
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={(e) => {
                  toggleApplied(selectedTheme.id, e);
                  closePreview();
                }}
              >
                <Sun size={16} />
                Apply Theme
              </ActionButton>
            </Box>
          </DialogInner>
        )}
      </DialogStyled>
    </ExplorerContainer>
  );
});

GothicThemeExplorer.displayName = 'GothicThemeExplorer';

export default GothicThemeExplorer;
