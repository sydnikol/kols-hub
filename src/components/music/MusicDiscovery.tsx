// MusicDiscovery Component
// Explore music through recommendations, genres, decades, and random discovery

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  InputAdornment,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Shuffle,
  Play,
  Heart,
  Plus,
  ChevronRight,
  Music,
  Disc3,
  Clock,
  Sparkles,
  TrendingUp,
  Calendar,
  Globe,
  Headphones,
  Radio,
  Star,
  ArrowRight,
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import {
  Track,
  Genre,
  musicLibrary,
  genreInfo,
  getSimilarTracks,
  getRandomTracks,
  getTracksByGenre,
  getTracksByDecade,
  searchTracks,
} from '../../data/music_library';

// Animations
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

// Types
interface MusicDiscoveryProps {
  onTrackPlay?: (track: Track) => void;
  onAddToPlaylist?: (track: Track) => void;
  compact?: boolean;
}

type DiscoveryTab = 'recommendations' | 'genres' | 'decades' | 'random' | 'recent';

// Styled Components
const Container = styled(Box)({
  padding: '24px',
  background: 'linear-gradient(180deg, rgba(10, 8, 18, 0.95) 0%, rgba(20, 16, 32, 0.98) 100%)',
  borderRadius: '20px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
});

const Title = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '1.8rem',
  color: '#d4af37',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const SearchContainer = styled(Box)({
  marginBottom: '24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '16px',
    color: '#f0e6ff',
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
  '& .MuiInputAdornment-root svg': {
    color: '#8b5cf6',
  },
});

const StyledTabs = styled(Tabs)({
  marginBottom: '24px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#d4af37',
  },
  '& .MuiTab-root': {
    color: '#888888',
    textTransform: 'none',
    fontFamily: '"Cinzel", serif',
    fontSize: '0.9rem',
    minWidth: 'auto',
    padding: '12px 16px',
    '&.Mui-selected': {
      color: '#d4af37',
    },
  },
});

const GenreGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: '16px',
});

const GenreCard = styled(GothicCard)<{ genreColor: string }>(({ genreColor }) => ({
  cursor: 'pointer',
  padding: '20px',
  background: `linear-gradient(135deg, ${genreColor}20, rgba(20, 16, 32, 0.9))`,
  borderColor: `${genreColor}40`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: genreColor,
    boxShadow: `0 10px 30px ${genreColor}30`,
  },
}));

const GenreIcon = styled(Box)<{ color: string }>(({ color }) => ({
  fontSize: '2rem',
  marginBottom: '12px',
  filter: `drop-shadow(0 0 10px ${color}50)`,
}));

const DecadeGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: '12px',
});

const DecadeCard = styled(Box)<{ selected: boolean }>(({ selected }) => ({
  padding: '16px',
  borderRadius: '12px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: selected
    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(139, 92, 246, 0.2))'
    : 'rgba(26, 16, 40, 0.6)',
  border: selected ? '2px solid #d4af37' : '2px solid transparent',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const TrackGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: '16px',
});

const TrackCard = styled(GothicCard)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 30px rgba(139, 92, 246, 0.2)',
    '& .vinyl': {
      animation: `${spin} 2s linear infinite`,
    },
  },
});

const VinylThumbnail = styled(Box)({
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  background: `
    radial-gradient(circle at 50% 50%, #1a1a1a 0%, #1a1a1a 20%,
    #2a2a2a 20%, #2a2a2a 30%,
    #1a1a1a 30%, #1a1a1a 40%,
    #2a2a2a 40%, #2a2a2a 100%)
  `,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  flexShrink: 0,
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4af37, #b8860b)',
  },
});

const RecommendationSection = styled(Box)({
  marginBottom: '32px',
});

const SectionHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
});

const SectionTitle = styled(Typography)({
  color: '#a78bfa',
  fontSize: '1.1rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const TrackList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

const TrackListItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(139, 92, 246, 0.1)',
  },
});

const RandomButton = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  borderRadius: '20px',
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(212, 175, 55, 0.1))',
  border: '2px dashed rgba(139, 92, 246, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(212, 175, 55, 0.2))',
    borderColor: '#8b5cf6',
    '& .shuffle-icon': {
      animation: `${pulse} 0.5s ease-in-out`,
    },
  },
});

const SimilarSection = styled(Box)({
  marginTop: '24px',
  padding: '20px',
  borderRadius: '16px',
  background: 'rgba(26, 16, 40, 0.6)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

const QuickActions = styled(Box)({
  display: 'flex',
  gap: '8px',
  opacity: 0,
  transition: 'opacity 0.2s ease',
});

// Constants
const decades = ['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

export const MusicDiscovery: React.FC<MusicDiscoveryProps> = ({
  onTrackPlay,
  onAddToPlaylist,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<DiscoveryTab>('recommendations');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [randomTracks, setRandomTracks] = useState<Track[]>([]);
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTracks(searchQuery).slice(0, 20);
  }, [searchQuery]);

  // Featured recommendations (curated picks)
  const featuredTracks = useMemo(() => {
    const featured = musicLibrary.filter(track =>
      track.tags.includes('iconic') ||
      track.tags.includes('classic') ||
      track.tags.includes('anthemic')
    );
    return featured.slice(0, 8);
  }, []);

  // If You Like X recommendations
  const recommendations = useMemo(() => {
    if (!selectedTrack) return [];
    return getSimilarTracks(selectedTrack.id, 8);
  }, [selectedTrack]);

  // Genre tracks
  const genreTracks = useMemo(() => {
    if (!selectedGenre) return [];
    return getTracksByGenre(selectedGenre).slice(0, 15);
  }, [selectedGenre]);

  // Decade tracks
  const decadeTracks = useMemo(() => {
    if (!selectedDecade) return [];
    return getTracksByDecade(selectedDecade).slice(0, 15);
  }, [selectedDecade]);

  // Handle random discovery
  const handleRandomDiscover = useCallback(() => {
    setRandomTracks(getRandomTracks(12));
  }, []);

  // Handle like toggle
  const handleToggleLike = useCallback((trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  }, []);

  // Render track card
  const renderTrackCard = (track: Track, showSimilar = true) => (
    <TrackCard
      key={track.id}
      variant="glass"
      onClick={() => {
        if (showSimilar) setSelectedTrack(track);
        onTrackPlay?.(track);
      }}
      sx={{
        '&:hover .quick-actions': {
          opacity: 1,
        },
      }}
    >
      <VinylThumbnail className="vinyl" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            color: '#e0e0e0',
            fontSize: '0.95rem',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {track.title}
        </Typography>
        <Typography
          sx={{
            color: '#888888',
            fontSize: '0.8rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {track.artist}
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
          <Chip
            label={genreInfo[track.genre]?.name || track.genre}
            size="small"
            sx={{
              backgroundColor: `${genreInfo[track.genre]?.color || '#8b5cf6'}20`,
              color: genreInfo[track.genre]?.color || '#8b5cf6',
              fontSize: '0.65rem',
              height: '18px',
            }}
          />
          <Chip
            label={track.decade}
            size="small"
            sx={{
              backgroundColor: 'rgba(212, 175, 55, 0.2)',
              color: '#d4af37',
              fontSize: '0.65rem',
              height: '18px',
            }}
          />
        </Box>
      </Box>
      <QuickActions className="quick-actions">
        <Tooltip title="Play">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onTrackPlay?.(track);
            }}
            sx={{ color: '#10b981' }}
          >
            <Play size={16} />
          </IconButton>
        </Tooltip>
        <Tooltip title={likedTracks.has(track.id) ? 'Unlike' : 'Like'}>
          <IconButton
            size="small"
            onClick={(e) => handleToggleLike(track.id, e)}
            sx={{ color: likedTracks.has(track.id) ? '#ec4899' : '#888888' }}
          >
            <Heart size={16} fill={likedTracks.has(track.id) ? '#ec4899' : 'none'} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add to Playlist">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist?.(track);
            }}
            sx={{ color: '#a78bfa' }}
          >
            <Plus size={16} />
          </IconButton>
        </Tooltip>
      </QuickActions>
    </TrackCard>
  );

  // Render track list item
  const renderTrackListItem = (track: Track, index: number) => (
    <TrackListItem
      key={track.id}
      onClick={() => {
        setSelectedTrack(track);
        onTrackPlay?.(track);
      }}
      sx={{
        '&:hover .quick-actions': {
          opacity: 1,
        },
      }}
    >
      <Typography sx={{ color: '#666666', width: '24px', textAlign: 'center' }}>
        {index + 1}
      </Typography>
      <VinylThumbnail className="vinyl" sx={{ width: '40px', height: '40px' }} />
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{track.title}</Typography>
        <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{track.artist}</Typography>
      </Box>
      <QuickActions className="quick-actions">
        <IconButton size="small" onClick={() => onTrackPlay?.(track)} sx={{ color: '#10b981' }}>
          <Play size={14} />
        </IconButton>
        <IconButton
          size="small"
          onClick={(e) => handleToggleLike(track.id, e)}
          sx={{ color: likedTracks.has(track.id) ? '#ec4899' : '#888888' }}
        >
          <Heart size={14} fill={likedTracks.has(track.id) ? '#ec4899' : 'none'} />
        </IconButton>
      </QuickActions>
    </TrackListItem>
  );

  return (
    <Container>
      <Header>
        <Title>
          <Radio size={28} color="#d4af37" />
          {compact ? 'Discover' : 'Music Discovery'}
        </Title>
        <GothicButton
          variant="secondary"
          startIcon={<Shuffle size={18} />}
          onClick={handleRandomDiscover}
        >
          Surprise Me
        </GothicButton>
      </Header>

      {/* Search */}
      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search artists, songs, genres..."
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

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionTitle sx={{ mb: 2 }}>
            <Search size={18} />
            Search Results ({searchResults.length})
          </SectionTitle>
          <TrackGrid>
            {searchResults.map(track => renderTrackCard(track))}
          </TrackGrid>
        </Box>
      )}

      {/* Tabs */}
      {!searchQuery && (
        <>
          <StyledTabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              value="recommendations"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Sparkles size={16} />
                  For You
                </Box>
              }
            />
            <Tab
              value="genres"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Music size={16} />
                  Genres
                </Box>
              }
            />
            <Tab
              value="decades"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Calendar size={16} />
                  Decades
                </Box>
              }
            />
            <Tab
              value="random"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Shuffle size={16} />
                  Random
                </Box>
              }
            />
          </StyledTabs>

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <>
              {/* Featured Picks */}
              <RecommendationSection>
                <SectionHeader>
                  <SectionTitle>
                    <Star size={18} color="#d4af37" />
                    Featured Picks
                  </SectionTitle>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem', cursor: 'pointer' }}>
                    See all <ChevronRight size={14} style={{ verticalAlign: 'middle' }} />
                  </Typography>
                </SectionHeader>
                <TrackGrid>
                  {featuredTracks.map(track => renderTrackCard(track))}
                </TrackGrid>
              </RecommendationSection>

              {/* If You Like Section */}
              {selectedTrack && recommendations.length > 0 && (
                <SimilarSection>
                  <SectionHeader>
                    <SectionTitle>
                      <TrendingUp size={18} />
                      If you like "{selectedTrack.title}"
                    </SectionTitle>
                    <IconButton
                      size="small"
                      onClick={() => setSelectedTrack(null)}
                      sx={{ color: '#888888' }}
                    >
                      <ArrowRight size={16} />
                    </IconButton>
                  </SectionHeader>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem', mb: 2 }}>
                    Based on similar mood, genre, and era
                  </Typography>
                  <TrackList>
                    {recommendations.map((track, index) => renderTrackListItem(track, index))}
                  </TrackList>
                </SimilarSection>
              )}

              {/* Click any track prompt */}
              {!selectedTrack && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    px: 2,
                    borderRadius: '12px',
                    background: 'rgba(26, 16, 40, 0.4)',
                  }}
                >
                  <Headphones size={40} color="#888888" style={{ marginBottom: '12px' }} />
                  <Typography sx={{ color: '#888888' }}>
                    Click any track to discover similar music
                  </Typography>
                </Box>
              )}
            </>
          )}

          {/* Genres Tab */}
          {activeTab === 'genres' && (
            <>
              {!selectedGenre ? (
                <GenreGrid>
                  {(Object.keys(genreInfo) as Genre[]).map(genre => {
                    const info = genreInfo[genre];
                    const trackCount = getTracksByGenre(genre).length;
                    return (
                      <GenreCard
                        key={genre}
                        variant="glass"
                        genreColor={info.color}
                        onClick={() => setSelectedGenre(genre)}
                      >
                        <GenreIcon color={info.color}>{info.icon}</GenreIcon>
                        <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 0.5 }}>
                          {info.name}
                        </Typography>
                        <Typography sx={{ color: '#888888', fontSize: '0.8rem', mb: 1 }}>
                          {info.description}
                        </Typography>
                        <Badge
                          badgeContent={trackCount}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: info.color,
                            },
                          }}
                        >
                          <Disc3 size={16} color="#888888" />
                        </Badge>
                      </GenreCard>
                    );
                  })}
                </GenreGrid>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <GothicButton variant="ghost" onClick={() => setSelectedGenre(null)}>
                      Back to Genres
                    </GothicButton>
                    <Typography sx={{ color: '#d4af37', fontSize: '1.2rem', fontWeight: 600 }}>
                      {genreInfo[selectedGenre].icon} {genreInfo[selectedGenre].name}
                    </Typography>
                    <Chip
                      label={`${genreTracks.length} tracks`}
                      size="small"
                      sx={{
                        backgroundColor: `${genreInfo[selectedGenre].color}20`,
                        color: genreInfo[selectedGenre].color,
                      }}
                    />
                  </Box>
                  <TrackGrid>
                    {genreTracks.map(track => renderTrackCard(track, false))}
                  </TrackGrid>
                </Box>
              )}
            </>
          )}

          {/* Decades Tab */}
          {activeTab === 'decades' && (
            <>
              <DecadeGrid sx={{ mb: 3 }}>
                {decades.map(decade => {
                  const count = getTracksByDecade(decade).length;
                  return (
                    <DecadeCard
                      key={decade}
                      selected={selectedDecade === decade}
                      onClick={() => setSelectedDecade(selectedDecade === decade ? null : decade)}
                    >
                      <Typography
                        sx={{
                          color: selectedDecade === decade ? '#d4af37' : '#e0e0e0',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                        }}
                      >
                        {decade}
                      </Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                        {count} tracks
                      </Typography>
                    </DecadeCard>
                  );
                })}
              </DecadeGrid>

              {selectedDecade && (
                <Box>
                  <SectionTitle sx={{ mb: 2 }}>
                    <Clock size={18} />
                    Tracks from the {selectedDecade}
                  </SectionTitle>
                  <TrackGrid>
                    {decadeTracks.map(track => renderTrackCard(track, false))}
                  </TrackGrid>
                </Box>
              )}

              {!selectedDecade && (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 4,
                    color: '#888888',
                  }}
                >
                  <Calendar size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <Typography>Select a decade to explore its music</Typography>
                </Box>
              )}
            </>
          )}

          {/* Random Tab */}
          {activeTab === 'random' && (
            <>
              {randomTracks.length === 0 ? (
                <RandomButton onClick={handleRandomDiscover}>
                  <Shuffle size={48} color="#8b5cf6" className="shuffle-icon" />
                  <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem', mt: 2, fontWeight: 500 }}>
                    Discover Random Tracks
                  </Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.9rem', mt: 1 }}>
                    Click to get a random selection from our library
                  </Typography>
                </RandomButton>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <SectionTitle>
                      <Shuffle size={18} />
                      Your Random Selection
                    </SectionTitle>
                    <GothicButton
                      variant="ghost"
                      startIcon={<Shuffle size={16} />}
                      onClick={handleRandomDiscover}
                    >
                      Shuffle Again
                    </GothicButton>
                  </Box>
                  <TrackGrid>
                    {randomTracks.map(track => renderTrackCard(track))}
                  </TrackGrid>
                </Box>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default MusicDiscovery;
