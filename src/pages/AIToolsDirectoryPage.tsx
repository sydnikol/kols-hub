// AI Tools Directory Page
// Comprehensive searchable directory of 442+ free AI tools

import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, TextField, Chip, Grid, InputAdornment, Tabs, Tab, Badge, Tooltip, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search, Sparkles, Image, Video, Music, Code, FileText, MessageCircle,
  Mic, Brain, Palette, Wand2, Bot, Globe, Star, ExternalLink,
  Filter, Grid3X3, List, Heart, Bookmark, TrendingUp, Zap
} from 'lucide-react';
import aiToolsData from '../data/ai_tools_ideas.json';

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '32px',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 32px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    background: 'rgba(20, 20, 30, 0.8)',
    borderRadius: '16px',
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

const CategoryChip = styled(Chip)<{ selected: boolean; chipColor: string }>(({ selected, chipColor }) => ({
  margin: '4px',
  background: selected ? `${chipColor}30` : 'rgba(30, 30, 40, 0.6)',
  border: selected ? `2px solid ${chipColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  color: selected ? chipColor : '#888888',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `${chipColor}20`,
    borderColor: chipColor,
  },
}));

const ToolCard = styled(Box)<{ cardColor: string }>(({ cardColor }) => ({
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid rgba(100, 100, 120, 0.2)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: cardColor,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: `${cardColor}50`,
    boxShadow: `0 10px 30px ${cardColor}20`,
  },
}));

const StatCard = styled(Box)<{ color: string }>(({ color }) => ({
  textAlign: 'center',
  padding: '20px',
  borderRadius: '12px',
  background: `${color}10`,
  border: `1px solid ${color}30`,
}));

const TagChip = styled(Chip)({
  height: '22px',
  fontSize: '0.7rem',
  margin: '2px',
  background: 'rgba(139, 92, 246, 0.15)',
  color: '#a78bfa',
  border: 'none',
});

const FavoriteButton = styled(IconButton)<{ favorited: boolean }>(({ favorited }) => ({
  position: 'absolute',
  top: '12px',
  right: '12px',
  color: favorited ? '#ec4899' : '#666666',
  background: 'rgba(0, 0, 0, 0.3)',
  padding: '6px',
  '&:hover': {
    background: 'rgba(236, 72, 153, 0.2)',
    color: '#ec4899',
  },
}));

// Category configurations with icons and colors
const categoryConfig: Record<string, { icon: React.ElementType; color: string }> = {
  'Image Generators': { icon: Image, color: '#8b5cf6' },
  'Video Generators': { icon: Video, color: '#ec4899' },
  'Audio & Music': { icon: Music, color: '#f59e0b' },
  'Coding & Development': { icon: Code, color: '#10b981' },
  'Writing & Content': { icon: FileText, color: '#3b82f6' },
  'Chatbots & Assistants': { icon: MessageCircle, color: '#6366f1' },
  'Voice & Speech': { icon: Mic, color: '#f97316' },
  'Research & Analysis': { icon: Brain, color: '#a855f7' },
  'Design & Art': { icon: Palette, color: '#14b8a6' },
  'Productivity': { icon: Zap, color: '#eab308' },
  'Marketing': { icon: TrendingUp, color: '#22c55e' },
  'Education': { icon: Bot, color: '#0ea5e9' },
  'Other': { icon: Wand2, color: '#d4af37' },
};

const getCategoryConfig = (category: string) => {
  return categoryConfig[category] || categoryConfig['Other'];
};

interface AITool {
  id: string;
  category: string;
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export const AIToolsDirectoryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const tools: AITool[] = aiToolsData.items || [];

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    tools.forEach(tool => cats.add(tool.category));
    return Array.from(cats).sort();
  }, [tools]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tools.forEach(tool => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, [tools]);

  // Filtered tools
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = !searchQuery ||
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      const matchesFavorites = !showFavoritesOnly || favorites.has(tool.id);

      return matchesSearch && matchesCategory && matchesFavorites;
    });
  }, [tools, searchQuery, selectedCategory, showFavoritesOnly, favorites]);

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const newFavs = new Set(prev);
      if (newFavs.has(toolId)) {
        newFavs.delete(toolId);
      } else {
        newFavs.add(toolId);
      }
      return newFavs;
    });
  };

  const openTool = (url: string) => {
    window.open(`https://${url}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageContainer>
      <HeaderSection>
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
          <Sparkles size={36} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#8b5cf6' }} />
          AI Tools Directory
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic', mb: 2 }}>
          Discover {tools.length}+ free AI tools for creativity, productivity & more
        </Typography>
      </HeaderSection>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
        <Grid item xs={6} sm={3}>
          <StatCard color="#8b5cf6">
            <Bot size={24} color="#8b5cf6" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>
              {tools.length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Total Tools</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard color="#ec4899">
            <Grid3X3 size={24} color="#ec4899" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#ec4899', fontSize: '1.5rem', fontWeight: 700 }}>
              {categories.length}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Categories</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard color="#10b981">
            <Heart size={24} color="#10b981" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
              {favorites.size}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Favorites</Typography>
          </StatCard>
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard color="#f59e0b">
            <Star size={24} color="#f59e0b" style={{ marginBottom: '8px' }} />
            <Typography sx={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}>
              100%
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Free</Typography>
          </StatCard>
        </Grid>
      </Grid>

      {/* Search */}
      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search AI tools by name, description, or tags..."
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
      </SearchContainer>

      {/* Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <CategoryChip
          label="All Tools"
          selected={!selectedCategory}
          chipColor="#8b5cf6"
          onClick={() => setSelectedCategory(null)}
        />
        {categories.slice(0, 12).map(cat => {
          const config = getCategoryConfig(cat);
          return (
            <CategoryChip
              key={cat}
              icon={<config.icon size={14} />}
              label={`${cat} (${categoryCounts[cat]})`}
              selected={selectedCategory === cat}
              chipColor={config.color}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            />
          );
        })}
      </Box>

      {/* View Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography sx={{ color: '#888888' }}>
          Showing {filteredTools.length} of {tools.length} tools
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Show Favorites Only">
            <IconButton
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              sx={{
                color: showFavoritesOnly ? '#ec4899' : '#666666',
                background: showFavoritesOnly ? 'rgba(236, 72, 153, 0.2)' : 'transparent',
              }}
            >
              <Badge badgeContent={favorites.size} color="error">
                <Heart size={20} />
              </Badge>
            </IconButton>
          </Tooltip>
          <IconButton
            onClick={() => setViewMode('grid')}
            sx={{ color: viewMode === 'grid' ? '#8b5cf6' : '#666666' }}
          >
            <Grid3X3 size={20} />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            sx={{ color: viewMode === 'list' ? '#8b5cf6' : '#666666' }}
          >
            <List size={20} />
          </IconButton>
        </Box>
      </Box>

      {/* Tools Grid/List */}
      <Grid container spacing={3}>
        {filteredTools.map((tool) => {
          const config = getCategoryConfig(tool.category);
          const Icon = config.icon;
          const isFavorited = favorites.has(tool.id);

          return (
            <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} lg={viewMode === 'grid' ? 3 : 12} key={tool.id}>
              <ToolCard cardColor={config.color} onClick={() => openTool(tool.url)}>
                <FavoriteButton
                  favorited={isFavorited}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(tool.id);
                  }}
                >
                  <Heart size={16} fill={isFavorited ? '#ec4899' : 'none'} />
                </FavoriteButton>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      background: `${config.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} color={config.color} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: '#e0e0e0',
                        fontWeight: 600,
                        fontSize: '1rem',
                        mb: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {tool.title}
                      <ExternalLink size={14} color="#666666" />
                    </Typography>
                    <Chip
                      label={tool.category}
                      size="small"
                      sx={{
                        height: '20px',
                        fontSize: '0.7rem',
                        background: `${config.color}20`,
                        color: config.color,
                        border: 'none',
                      }}
                    />
                  </Box>
                </Box>

                <Typography
                  sx={{
                    color: '#888888',
                    fontSize: '0.85rem',
                    mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: viewMode === 'grid' ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {tool.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {tool.tags.slice(0, viewMode === 'grid' ? 3 : 6).map((tag) => (
                    <TagChip key={tag} label={tag} size="small" />
                  ))}
                  {tool.tags.length > (viewMode === 'grid' ? 3 : 6) && (
                    <TagChip label={`+${tool.tags.length - (viewMode === 'grid' ? 3 : 6)}`} size="small" />
                  )}
                </Box>
              </ToolCard>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Bot size={64} color="#666666" style={{ marginBottom: '16px' }} />
          <Typography sx={{ color: '#888888', fontSize: '1.2rem' }}>
            No tools found matching your search
          </Typography>
          <Typography sx={{ color: '#666666', fontSize: '0.9rem', mt: 1 }}>
            Try adjusting your filters or search terms
          </Typography>
        </Box>
      )}
    </PageContainer>
  );
};

export default AIToolsDirectoryPage;
