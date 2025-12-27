import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  LinearProgress,
  Tooltip,
  Menu,
  MenuItem,
  styled,
  keyframes,
} from '@mui/material';
import {
  Image,
  Upload,
  Palette,
  DollarSign,
  Tag,
  Sparkles,
  Trash2,
  Edit,
  Heart,
  Eye,
  X,
  Search,
  Filter,
  TrendingUp,
  Package,
} from 'lucide-react';

// Types
interface ArtworkData {
  id: string;
  title: string;
  tags: string[];
  imageUrl: string;
  colors: string[];
  mood: string;
  suggestedProducts: string[];
  earnings: number;
  productsCount: number;
  createdAt: number;
  isFavorite: boolean;
}

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.6);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Styled Components
const Container = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 50%, #0f0a1a 100%)',
  padding: '2rem',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
});

const StatsHeader = styled(Box)({
  display: 'flex',
  gap: '1.5rem',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  animation: `${fadeIn} 0.6s ease-out`,
});

const StatCard = styled(Card)({
  flex: '1 1 200px',
  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
  border: '1px solid rgba(124, 58, 237, 0.3)',
  borderRadius: '12px',
  padding: '1.5rem',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    borderColor: 'rgba(139, 92, 246, 0.6)',
    animation: `${pulseGlow} 2s infinite`,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.1), transparent)',
    transition: 'left 0.5s',
  },
  '&:hover::before': {
    left: '100%',
  },
});

const UploadZone = styled(Box)<{ isDragging: boolean }>(({ isDragging }) => ({
  border: `2px dashed ${isDragging ? '#fbbf24' : 'rgba(124, 58, 237, 0.5)'}`,
  borderRadius: '16px',
  padding: '3rem 2rem',
  textAlign: 'center',
  background: isDragging
    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%)'
    : 'rgba(124, 58, 237, 0.05)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  marginBottom: '2rem',
  position: 'relative',
  overflow: 'hidden',
  animation: `${fadeIn} 0.8s ease-out`,
  '&:hover': {
    borderColor: '#8b5cf6',
    background: 'rgba(139, 92, 246, 0.1)',
  },
}));

const ArtCard = styled(Card)({
  background: 'linear-gradient(135deg, rgba(26, 16, 40, 0.9) 0%, rgba(10, 8, 18, 0.9) 100%)',
  border: '1px solid rgba(124, 58, 237, 0.3)',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  position: 'relative',
  animation: `${fadeIn} 0.6s ease-out`,
  '&:hover': {
    transform: 'translateY(-10px)',
    borderColor: '#8b5cf6',
    boxShadow: '0 10px 40px rgba(124, 58, 237, 0.4)',
  },
  '&:hover .preview-overlay': {
    opacity: 1,
  },
});

const PreviewOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.9)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 10,
  padding: '1rem',
});

const GoldButton = styled(Button)({
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#0a0812',
  fontWeight: 'bold',
  padding: '0.5rem 1.5rem',
  borderRadius: '8px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 5px 20px rgba(251, 191, 36, 0.4)',
  },
});

const PurpleButton = styled(Button)({
  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontWeight: 'bold',
  padding: '0.5rem 1.5rem',
  borderRadius: '8px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    transform: 'scale(1.05)',
    boxShadow: '0 5px 20px rgba(139, 92, 246, 0.4)',
  },
});

const AIBadge = styled(Box)({
  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%)',
  borderRadius: '8px',
  padding: '0.5rem 1rem',
  marginTop: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  animation: `${shimmer} 3s infinite`,
  backgroundSize: '200% 100%',
});

const FilterBar = styled(Box)({
  display: 'flex',
  gap: '1rem',
  marginBottom: '2rem',
  flexWrap: 'wrap',
  alignItems: 'center',
  animation: `${fadeIn} 0.7s ease-out`,
});

const SearchField = styled(TextField)({
  flex: '1 1 300px',
  '& .MuiOutlinedInput-root': {
    background: 'rgba(26, 16, 40, 0.6)',
    borderRadius: '8px',
    color: '#ffffff',
    '& fieldset': {
      borderColor: 'rgba(124, 58, 237, 0.5)',
    },
    '&:hover fieldset': {
      borderColor: '#8b5cf6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fbbf24',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

// Utility functions
const generateId = (): string => {
  return `art_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const analyzeImage = (imageUrl: string): Pick<ArtworkData, 'colors' | 'mood' | 'suggestedProducts'> => {
  // Simulated AI analysis - in production, this would call an actual AI service
  const moods = ['Dark & Mysterious', 'Vibrant & Energetic', 'Calm & Serene', 'Bold & Dramatic', 'Ethereal & Dreamy'];
  const colorPalettes = [
    ['#1a1028', '#7c3aed', '#fbbf24'],
    ['#0a0812', '#8b5cf6', '#f59e0b'],
    ['#2d1b4e', '#a78bfa', '#fcd34d'],
  ];
  const productTypes = [
    ['T-Shirts', 'Hoodies', 'Posters'],
    ['Canvas Prints', 'Phone Cases', 'Stickers'],
    ['Digital Downloads', 'NFTs', 'Wall Art'],
    ['Mugs', 'Notebooks', 'Tote Bags'],
  ];

  return {
    colors: colorPalettes[Math.floor(Math.random() * colorPalettes.length)],
    mood: moods[Math.floor(Math.random() * moods.length)],
    suggestedProducts: productTypes[Math.floor(Math.random() * productTypes.length)],
  };
};

const STORAGE_KEY = 'art_library_data';

const loadArtworks = (): ArtworkData[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading artworks:', error);
    return [];
  }
};

const saveArtworks = (artworks: ArtworkData[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks));
  } catch (error) {
    console.error('Error saving artworks:', error);
  }
};

// Main Component
const ArtLibrary: React.FC = React.memo(() => {
  const [artworks, setArtworks] = useState<ArtworkData[]>(loadArtworks);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingArt, setEditingArt] = useState<ArtworkData | null>(null);
  const [previewArt, setPreviewArt] = useState<ArtworkData | null>(null);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);

  // Save to localStorage whenever artworks change
  useEffect(() => {
    saveArtworks(artworks);
  }, [artworks]);

  // Stats calculations
  const stats = useMemo(() => {
    const totalEarnings = artworks.reduce((sum, art) => sum + art.earnings, 0);
    const totalProducts = artworks.reduce((sum, art) => sum + art.productsCount, 0);
    return {
      totalArtworks: artworks.length,
      totalProducts,
      totalEarnings,
    };
  }, [artworks]);

  // Filter artworks
  const filteredArtworks = useMemo(() => {
    let filtered = artworks;

    if (searchQuery) {
      filtered = filtered.filter(art =>
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(art => art.tags.includes(selectedTag));
    }

    return filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return b.createdAt - a.createdAt;
    });
  }, [artworks, searchQuery, selectedTag]);

  // All available tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    artworks.forEach(art => {
      art.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [artworks]);

  // Handle file upload
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const newArtworks: ArtworkData[] = [];
    let processed = 0;

    Array.from(files).forEach((file, index) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const analysis = analyzeImage(imageUrl);

        const artwork: ArtworkData = {
          id: generateId(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          tags: ['Uncategorized'],
          imageUrl,
          ...analysis,
          earnings: 0,
          productsCount: 0,
          createdAt: Date.now() + index,
          isFavorite: false,
        };

        newArtworks.push(artwork);
        processed++;

        setUploadProgress((processed / files.length) * 100);

        if (processed === files.length) {
          setTimeout(() => {
            setArtworks(prev => [...newArtworks, ...prev]);
            setUploading(false);
            setUploadProgress(0);
          }, 500);
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  }, [handleFileUpload]);

  // Art management actions
  const handleToggleFavorite = useCallback((id: string) => {
    setArtworks(prev =>
      prev.map(art =>
        art.id === id ? { ...art, isFavorite: !art.isFavorite } : art
      )
    );
  }, []);

  const handleDeleteArt = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      setArtworks(prev => prev.filter(art => art.id !== id));
    }
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingArt) return;

    setArtworks(prev =>
      prev.map(art => (art.id === editingArt.id ? editingArt : art))
    );
    setEditingArt(null);
  }, [editingArt]);

  const handleCreateProducts = useCallback((art: ArtworkData) => {
    console.log('Create products from artwork:', art);
    // This would open a product creation flow
    alert(`Creating products from: ${art.title}\nSuggested: ${art.suggestedProducts.join(', ')}`);
  }, []);

  const handleViewProducts = useCallback((art: ArtworkData) => {
    console.log('View products for artwork:', art);
    alert(`Viewing ${art.productsCount} products created from: ${art.title}`);
  }, []);

  const handleViewEarnings = useCallback((art: ArtworkData) => {
    console.log('View earnings for artwork:', art);
    alert(`Earnings from "${art.title}": $${art.earnings.toFixed(2)}`);
  }, []);

  return (
    <Container>
      {/* Stats Header */}
      <StatsHeader>
        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Image size={24} color="#8b5cf6" />
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Total Artworks
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ color: '#fbbf24', fontWeight: 'bold' }}>
            {stats.totalArtworks}
          </Typography>
        </StatCard>

        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Package size={24} color="#8b5cf6" />
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Products Created
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ color: '#fbbf24', fontWeight: 'bold' }}>
            {stats.totalProducts}
          </Typography>
        </StatCard>

        <StatCard>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <DollarSign size={24} color="#fbbf24" />
            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 'bold' }}>
              Total Earnings
            </Typography>
          </Box>
          <Typography variant="h3" sx={{ color: '#10b981', fontWeight: 'bold' }}>
            ${stats.totalEarnings.toFixed(2)}
          </Typography>
        </StatCard>
      </StatsHeader>

      {/* Upload Zone */}
      <UploadZone
        isDragging={isDragging}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*,.psd"
          onChange={(e) => handleFileUpload(e.target.files)}
          style={{ display: 'none' }}
        />
        <Box sx={{ animation: `${float} 3s ease-in-out infinite` }}>
          <Upload size={48} color="#8b5cf6" />
        </Box>
        <Typography variant="h5" sx={{ color: '#ffffff', mt: 2, mb: 1, fontWeight: 'bold' }}>
          {isDragging ? 'Drop your artwork here' : 'Upload Your Artwork'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Drag and drop or click to upload • PNG, JPG, SVG, PSD supported
        </Typography>
        {uploading && (
          <Box sx={{ width: '80%', mx: 'auto', mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                backgroundColor: 'rgba(124, 58, 237, 0.2)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #7c3aed 0%, #fbbf24 100%)',
                },
              }}
            />
            <Typography variant="caption" sx={{ color: '#fbbf24', mt: 1, display: 'block' }}>
              Uploading... {Math.round(uploadProgress)}%
            </Typography>
          </Box>
        )}
      </UploadZone>

      {/* Filter Bar */}
      <FilterBar>
        <SearchField
          placeholder="Search artworks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search size={20} color="#8b5cf6" style={{ marginRight: '0.5rem' }} />,
          }}
        />

        <PurpleButton
          startIcon={<Filter size={20} />}
          onClick={(e) => setFilterMenuAnchor(e.currentTarget)}
        >
          Filter by Tag
        </PurpleButton>

        {selectedTag && (
          <Chip
            label={selectedTag}
            onDelete={() => setSelectedTag(null)}
            sx={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontWeight: 'bold',
            }}
          />
        )}

        <Menu
          anchorEl={filterMenuAnchor}
          open={Boolean(filterMenuAnchor)}
          onClose={() => setFilterMenuAnchor(null)}
          PaperProps={{
            sx: {
              background: 'rgba(26, 16, 40, 0.95)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <MenuItem onClick={() => { setSelectedTag(null); setFilterMenuAnchor(null); }}>
            <Typography sx={{ color: '#ffffff' }}>All Tags</Typography>
          </MenuItem>
          {allTags.map(tag => (
            <MenuItem
              key={tag}
              onClick={() => {
                setSelectedTag(tag);
                setFilterMenuAnchor(null);
              }}
            >
              <Typography sx={{ color: '#ffffff' }}>{tag}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </FilterBar>

      {/* Art Grid */}
      <Grid container spacing={3}>
        {filteredArtworks.map((art, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={art.id}>
            <ArtCard style={{ animationDelay: `${index * 0.1}s` }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={art.imageUrl}
                  alt={art.title}
                  sx={{ objectFit: 'cover' }}
                />
                <PreviewOverlay className="preview-overlay" onClick={() => setPreviewArt(art)}>
                  <Eye size={48} color="#fbbf24" />
                </PreviewOverlay>
                <IconButton
                  onClick={() => handleToggleFavorite(art.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(0, 0, 0, 0.6)',
                    color: art.isFavorite ? '#fbbf24' : '#ffffff',
                    '&:hover': {
                      background: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                >
                  <Heart size={20} fill={art.isFavorite ? '#fbbf24' : 'none'} />
                </IconButton>
              </Box>

              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {art.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
                  {art.tags.slice(0, 3).map(tag => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      icon={<Tag size={12} />}
                      sx={{
                        background: 'rgba(124, 58, 237, 0.3)',
                        color: '#fbbf24',
                        fontSize: '0.7rem',
                        height: '20px',
                      }}
                    />
                  ))}
                </Box>

                <AIBadge>
                  <Sparkles size={16} color="#fbbf24" />
                  <Typography variant="caption" sx={{ color: '#ffffff', fontSize: '0.75rem' }}>
                    {art.mood}
                  </Typography>
                </AIBadge>

                <Box sx={{ mt: 1, mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block' }}>
                    Best for: {art.suggestedProducts.join(', ')}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                  {art.colors.map((color, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '4px',
                        backgroundColor: color,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 1 }}>
                  <Tooltip title="Products Created">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Package size={16} color="#8b5cf6" />
                      <Typography variant="caption" sx={{ color: '#ffffff' }}>
                        {art.productsCount}
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Earnings">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <DollarSign size={16} color="#10b981" />
                      <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 'bold' }}>
                        ${art.earnings.toFixed(2)}
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Upload Date">
                    <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                      {new Date(art.createdAt).toLocaleDateString()}
                    </Typography>
                  </Tooltip>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                  <GoldButton
                    fullWidth
                    size="small"
                    startIcon={<Palette size={16} />}
                    onClick={() => handleCreateProducts(art)}
                  >
                    Create Products
                  </GoldButton>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="View Products">
                      <IconButton
                        size="small"
                        onClick={() => handleViewProducts(art)}
                        sx={{
                          flex: 1,
                          background: 'rgba(124, 58, 237, 0.2)',
                          color: '#8b5cf6',
                          '&:hover': { background: 'rgba(124, 58, 237, 0.4)' },
                        }}
                      >
                        <Package size={16} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View Earnings">
                      <IconButton
                        size="small"
                        onClick={() => handleViewEarnings(art)}
                        sx={{
                          flex: 1,
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          '&:hover': { background: 'rgba(16, 185, 129, 0.4)' },
                        }}
                      >
                        <TrendingUp size={16} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => setEditingArt(art)}
                        sx={{
                          flex: 1,
                          background: 'rgba(251, 191, 36, 0.2)',
                          color: '#fbbf24',
                          '&:hover': { background: 'rgba(251, 191, 36, 0.4)' },
                        }}
                      >
                        <Edit size={16} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteArt(art.id)}
                        sx={{
                          flex: 1,
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          '&:hover': { background: 'rgba(239, 68, 68, 0.4)' },
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </ArtCard>
          </Grid>
        ))}
      </Grid>

      {filteredArtworks.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            animation: `${fadeIn} 0.6s ease-out`,
          }}
        >
          <Palette size={64} color="#8b5cf6" style={{ opacity: 0.5 }} />
          <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 2 }}>
            {searchQuery || selectedTag ? 'No artworks found' : 'No artworks yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.4)', mt: 1 }}>
            {searchQuery || selectedTag
              ? 'Try adjusting your filters'
              : 'Upload your first artwork to get started'}
          </Typography>
        </Box>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={Boolean(editingArt)}
        onClose={() => setEditingArt(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '12px',
          },
        }}
      >
        <DialogTitle sx={{ color: '#ffffff', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Edit size={24} color="#fbbf24" />
          Edit Artwork
        </DialogTitle>
        <DialogContent>
          {editingArt && (
            <>
              <TextField
                fullWidth
                label="Title"
                value={editingArt.title}
                onChange={(e) => setEditingArt({ ...editingArt, title: e.target.value })}
                sx={{
                  mt: 2,
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': { borderColor: 'rgba(124, 58, 237, 0.5)' },
                    '&:hover fieldset': { borderColor: '#8b5cf6' },
                    '&.Mui-focused fieldset': { borderColor: '#fbbf24' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={editingArt.tags.join(', ')}
                onChange={(e) =>
                  setEditingArt({
                    ...editingArt,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                  })
                }
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    color: '#ffffff',
                    '& fieldset': { borderColor: 'rgba(124, 58, 237, 0.5)' },
                    '&:hover fieldset': { borderColor: '#8b5cf6' },
                    '&.Mui-focused fieldset': { borderColor: '#fbbf24' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                  AI Analysis:
                </Typography>
                <Typography variant="caption" sx={{ color: '#fbbf24' }}>
                  Mood: {editingArt.mood} • Suggested: {editingArt.suggestedProducts.join(', ')}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditingArt(null)} sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Cancel
          </Button>
          <GoldButton onClick={handleSaveEdit}>Save Changes</GoldButton>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={Boolean(previewArt)}
        onClose={() => setPreviewArt(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1028 0%, #0a0812 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '12px',
          },
        }}
      >
        {previewArt && (
          <>
            <DialogTitle
              sx={{
                color: '#ffffff',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Eye size={24} color="#fbbf24" />
                {previewArt.title}
              </Box>
              <IconButton onClick={() => setPreviewArt(null)} sx={{ color: '#ffffff' }}>
                <X size={24} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box
                component="img"
                src={previewArt.imageUrl}
                alt={previewArt.title}
                sx={{
                  width: '100%',
                  maxHeight: '60vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  mb: 2,
                }}
              />
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                    Tags:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {previewArt.tags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{
                          background: 'rgba(124, 58, 237, 0.3)',
                          color: '#fbbf24',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 1 }}>
                    AI Analysis:
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    Mood: {previewArt.mood}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Suggested: {previewArt.suggestedProducts.join(', ')}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
});

ArtLibrary.displayName = 'ArtLibrary';

export default ArtLibrary;
export { ArtLibrary };
