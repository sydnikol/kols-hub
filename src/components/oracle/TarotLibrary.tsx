// TarotLibrary.tsx
// Browse all 78 cards with filtering, detail view, study mode, and learning tracking

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Box, Typography, TextField, Chip, IconButton, Tooltip, Dialog,
  DialogContent, LinearProgress, InputAdornment, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search, X, CheckCircle, Circle, Star, BookOpen, Eye, Filter,
  Grid, List, ChevronLeft, ChevronRight, Sparkles, Moon, Flame,
  Droplets, Wind, Leaf, GraduationCap, RotateCcw
} from 'lucide-react';
import {
  TarotCard,
  completeTarotDeck,
  majorArcana,
  wands,
  cups,
  swords,
  pentacles,
  suitInfo,
  Suit
} from '../../data/tarot_cards';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

// Styled components
const LibraryContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '24px',
});

const LibraryTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(90deg, #d4af37, #f4d03f, #d4af37)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${shimmer} 4s linear infinite`,
  textAlign: 'center',
  marginBottom: '8px',
});

const FilterBar = styled(Box)({
  display: 'flex',
  gap: '12px',
  marginBottom: '24px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
});

const SearchField = styled(TextField)({
  maxWidth: '400px',
  '& .MuiOutlinedInput-root': {
    color: '#e0e0e0',
    background: 'rgba(20, 20, 30, 0.8)',
    borderRadius: '24px',
    '& fieldset': {
      borderColor: 'rgba(100, 100, 120, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#8b5cf6',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#888888',
  },
});

const SuitFilter = styled(Chip)<{ suitColor: string; selected: boolean }>(({ suitColor, selected }) => ({
  margin: '4px',
  background: selected ? `${suitColor}30` : 'rgba(30, 30, 40, 0.6)',
  border: selected ? `2px solid ${suitColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  color: selected ? suitColor : '#888888',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: `${suitColor}20`,
    borderColor: suitColor,
  },
}));

const CardGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: '20px',
  marginBottom: '32px',
});

const CardListView = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '32px',
});

const CardTile = styled(Box)<{ suitColor: string; learned: boolean }>(({ suitColor, learned }) => ({
  borderRadius: '12px',
  background: 'rgba(20, 20, 30, 0.8)',
  border: learned ? `2px solid ${suitColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  padding: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  animation: `${fadeIn} 0.4s ease-out`,
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: suitColor,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 20px ${suitColor}20`,
    borderColor: suitColor,
  },
}));

const CardListItem = styled(Box)<{ suitColor: string; learned: boolean }>(({ suitColor, learned }) => ({
  borderRadius: '12px',
  background: 'rgba(20, 20, 30, 0.8)',
  border: learned ? `2px solid ${suitColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  padding: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
  '&:hover': {
    background: 'rgba(30, 30, 45, 0.8)',
    borderColor: suitColor,
  },
}));

const LearnedBadge = styled(Box)({
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  background: 'rgba(16, 185, 129, 0.2)',
  border: '2px solid #10b981',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ProgressBar = styled(Box)({
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '12px',
  padding: '16px 24px',
  marginBottom: '24px',
  border: '1px solid rgba(100, 100, 120, 0.3)',
});

const StudyModeCard = styled(Box)<{ suitColor: string }>(({ suitColor }) => ({
  width: '280px',
  height: '420px',
  borderRadius: '16px',
  background: 'linear-gradient(180deg, #1a1028 0%, #0a0812 100%)',
  border: `2px solid ${suitColor}60`,
  boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 30px ${suitColor}30`,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: suitColor,
  },
}));

const StudyControls = styled(Box)({
  display: 'flex',
  gap: '12px',
  justifyContent: 'center',
  marginTop: '24px',
});

// Helper function to get suit icon
const getSuitIcon = (suit: Suit): React.ReactNode => {
  switch (suit) {
    case 'major': return <Star size={16} />;
    case 'wands': return <Flame size={16} />;
    case 'cups': return <Droplets size={16} />;
    case 'swords': return <Wind size={16} />;
    case 'pentacles': return <Leaf size={16} />;
    default: return <Star size={16} />;
  }
};

interface TarotLibraryProps {
  onSelectCard?: (card: TarotCard) => void;
  onClose?: () => void;
}

export const TarotLibrary: React.FC<TarotLibraryProps> = ({
  onSelectCard,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuits, setSelectedSuits] = useState<Suit[]>([]);
  const [learnedCards, setLearnedCards] = useState<Set<string>>(new Set());
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [studyMode, setStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [filterLearned, setFilterLearned] = useState<'all' | 'learned' | 'unlearned'>('all');

  // Load learned cards from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('tarot_learned_cards');
    if (saved) {
      try {
        setLearnedCards(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Error loading learned cards:', e);
      }
    }
  }, []);

  // Save learned cards to localStorage
  const saveLearned = useCallback((cards: Set<string>) => {
    localStorage.setItem('tarot_learned_cards', JSON.stringify([...cards]));
  }, []);

  const toggleLearned = useCallback((cardId: string) => {
    setLearnedCards(prev => {
      const updated = new Set(prev);
      if (updated.has(cardId)) {
        updated.delete(cardId);
      } else {
        updated.add(cardId);
      }
      saveLearned(updated);
      return updated;
    });
  }, [saveLearned]);

  const toggleSuit = useCallback((suit: Suit) => {
    setSelectedSuits(prev =>
      prev.includes(suit)
        ? prev.filter(s => s !== suit)
        : [...prev, suit]
    );
  }, []);

  const filteredCards = useMemo(() => {
    let cards = completeTarotDeck;

    // Filter by suit
    if (selectedSuits.length > 0) {
      cards = cards.filter(card => selectedSuits.includes(card.suit));
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      cards = cards.filter(card =>
        card.name.toLowerCase().includes(query) ||
        card.keywords.some(k => k.toLowerCase().includes(query)) ||
        card.uprightMeaning.toLowerCase().includes(query) ||
        card.reversedMeaning.toLowerCase().includes(query)
      );
    }

    // Filter by learned status
    if (filterLearned === 'learned') {
      cards = cards.filter(card => learnedCards.has(card.id));
    } else if (filterLearned === 'unlearned') {
      cards = cards.filter(card => !learnedCards.has(card.id));
    }

    return cards;
  }, [selectedSuits, searchQuery, filterLearned, learnedCards]);

  const studyCards = useMemo(() => {
    return filterLearned === 'unlearned'
      ? filteredCards
      : completeTarotDeck.filter(card => !learnedCards.has(card.id));
  }, [filteredCards, filterLearned, learnedCards]);

  const getSuitColor = (suit: Suit): string => {
    return suitInfo[suit]?.color || '#d4af37';
  };

  const progressPercent = useMemo(() => {
    return Math.round((learnedCards.size / completeTarotDeck.length) * 100);
  }, [learnedCards]);

  const handleNextStudy = () => {
    setShowMeaning(false);
    setStudyIndex((prev) => (prev + 1) % studyCards.length);
  };

  const handlePrevStudy = () => {
    setShowMeaning(false);
    setStudyIndex((prev) => (prev - 1 + studyCards.length) % studyCards.length);
  };

  const currentStudyCard = studyCards[studyIndex];

  return (
    <LibraryContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <LibraryTitle>
          <BookOpen size={36} style={{ marginRight: '12px', verticalAlign: 'middle', color: '#d4af37' }} />
          Tarot Library
        </LibraryTitle>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          Study the ancient wisdom of the 78 cards
        </Typography>
      </Box>

      {/* Progress Bar */}
      <ProgressBar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ color: '#a78bfa', fontWeight: 600 }}>
            <GraduationCap size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Learning Progress
          </Typography>
          <Typography sx={{ color: '#10b981', fontWeight: 600 }}>
            {learnedCards.size} / {completeTarotDeck.length} cards ({progressPercent}%)
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(100, 100, 120, 0.3)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#10b981',
              borderRadius: 5,
            },
          }}
        />
      </ProgressBar>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3, flexWrap: 'wrap' }}>
        <GothicButton
          variant={studyMode ? 'primary' : 'secondary'}
          startIcon={<GraduationCap size={18} />}
          onClick={() => {
            setStudyMode(!studyMode);
            setStudyIndex(0);
            setShowMeaning(false);
          }}
        >
          {studyMode ? 'Exit Study Mode' : 'Study Mode'}
        </GothicButton>

        <GothicButton
          variant="ghost"
          startIcon={<RotateCcw size={18} />}
          onClick={() => {
            setLearnedCards(new Set());
            saveLearned(new Set());
          }}
        >
          Reset Progress
        </GothicButton>
      </Box>

      {/* Study Mode */}
      {studyMode && studyCards.length > 0 && currentStudyCard && (
        <GothicCard variant="elevated" sx={{ mb: 4, p: 4, maxWidth: '600px', mx: 'auto' }}>
          <Typography sx={{
            color: '#d4af37',
            fontFamily: '"Cinzel", serif',
            textAlign: 'center',
            mb: 3,
            fontSize: '1.2rem'
          }}>
            <GraduationCap size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Study Card {studyIndex + 1} of {studyCards.length}
          </Typography>

          <StudyModeCard suitColor={getSuitColor(currentStudyCard.suit)}>
            <Typography sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '1.5rem',
              color: getSuitColor(currentStudyCard.suit),
              textAlign: 'center',
              mb: 2
            }}>
              {currentStudyCard.name}
            </Typography>

            <Box sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              background: `${getSuitColor(currentStudyCard.suit)}10`,
              mb: 2
            }}>
              {getSuitIcon(currentStudyCard.suit)}
            </Box>

            <Typography sx={{ color: '#888888', textAlign: 'center', fontSize: '0.9rem' }}>
              {suitInfo[currentStudyCard.suit]?.name}
            </Typography>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 0.5 }}>
              {currentStudyCard.keywords.slice(0, 3).map((kw, i) => (
                <Chip
                  key={i}
                  label={kw}
                  size="small"
                  sx={{
                    background: `${getSuitColor(currentStudyCard.suit)}15`,
                    color: getSuitColor(currentStudyCard.suit),
                    fontSize: '0.7rem'
                  }}
                />
              ))}
            </Box>
          </StudyModeCard>

          {showMeaning && (
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ color: '#a78bfa', fontWeight: 600, mb: 1 }}>Upright Meaning</Typography>
              <Typography sx={{ color: '#d0d0d0', fontSize: '0.9rem', mb: 2 }}>
                {currentStudyCard.uprightMeaning}
              </Typography>

              <Typography sx={{ color: '#ef4444', fontWeight: 600, mb: 1 }}>Reversed Meaning</Typography>
              <Typography sx={{ color: '#d0d0d0', fontSize: '0.9rem', mb: 2 }}>
                {currentStudyCard.reversedMeaning}
              </Typography>

              <Typography sx={{ color: '#9080a0', fontStyle: 'italic', fontSize: '0.85rem' }}>
                {currentStudyCard.gothicDescription}
              </Typography>
            </Box>
          )}

          <StudyControls>
            <GothicButton variant="ghost" onClick={handlePrevStudy}>
              <ChevronLeft size={20} />
            </GothicButton>

            <GothicButton
              variant="secondary"
              onClick={() => setShowMeaning(!showMeaning)}
            >
              {showMeaning ? 'Hide Meaning' : 'Show Meaning'}
            </GothicButton>

            <GothicButton
              variant={learnedCards.has(currentStudyCard.id) ? 'primary' : 'ghost'}
              onClick={() => toggleLearned(currentStudyCard.id)}
            >
              {learnedCards.has(currentStudyCard.id) ? (
                <><CheckCircle size={18} /> Learned</>
              ) : (
                <><Circle size={18} /> Mark Learned</>
              )}
            </GothicButton>

            <GothicButton variant="ghost" onClick={handleNextStudy}>
              <ChevronRight size={20} />
            </GothicButton>
          </StudyControls>
        </GothicCard>
      )}

      {/* Filters */}
      {!studyMode && (
        <>
          <FilterBar>
            <SearchField
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <X size={16} color="#888" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FilterBar>

          <FilterBar>
            {Object.entries(suitInfo).map(([key, info]) => (
              <SuitFilter
                key={key}
                icon={getSuitIcon(key as Suit)}
                label={info.name}
                suitColor={info.color}
                selected={selectedSuits.includes(key as Suit)}
                onClick={() => toggleSuit(key as Suit)}
              />
            ))}
          </FilterBar>

          <FilterBar>
            <ToggleButtonGroup
              value={filterLearned}
              exclusive
              onChange={(e, val) => val && setFilterLearned(val)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: '#888888',
                  borderColor: 'rgba(100, 100, 120, 0.3)',
                  '&.Mui-selected': {
                    color: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  },
                },
              }}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="learned">Learned</ToggleButton>
              <ToggleButton value="unlearned">To Learn</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(e, val) => val && setViewMode(val)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  color: '#888888',
                  borderColor: 'rgba(100, 100, 120, 0.3)',
                  '&.Mui-selected': {
                    color: '#a78bfa',
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  },
                },
              }}
            >
              <ToggleButton value="grid"><Grid size={18} /></ToggleButton>
              <ToggleButton value="list"><List size={18} /></ToggleButton>
            </ToggleButtonGroup>
          </FilterBar>

          {/* Results count */}
          <Typography sx={{ color: '#888888', textAlign: 'center', mb: 3 }}>
            Showing {filteredCards.length} card{filteredCards.length !== 1 ? 's' : ''}
          </Typography>

          {/* Card Grid/List */}
          {viewMode === 'grid' ? (
            <CardGrid>
              {filteredCards.map(card => {
                const suitColor = getSuitColor(card.suit);
                const isLearned = learnedCards.has(card.id);
                return (
                  <CardTile
                    key={card.id}
                    suitColor={suitColor}
                    learned={isLearned}
                    onClick={() => setSelectedCard(card)}
                  >
                    {isLearned && (
                      <LearnedBadge>
                        <CheckCircle size={14} color="#10b981" />
                      </LearnedBadge>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: suitColor }}>
                      {getSuitIcon(card.suit)}
                      <Typography sx={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                        {suitInfo[card.suit]?.name}
                      </Typography>
                    </Box>
                    <Typography sx={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: '1rem',
                      color: '#e0e0e0',
                      mb: 1
                    }}>
                      {card.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {card.keywords.slice(0, 3).map((kw, i) => (
                        <Chip
                          key={i}
                          label={kw}
                          size="small"
                          sx={{
                            height: '20px',
                            fontSize: '0.65rem',
                            background: `${suitColor}15`,
                            color: suitColor
                          }}
                        />
                      ))}
                    </Box>
                  </CardTile>
                );
              })}
            </CardGrid>
          ) : (
            <CardListView>
              {filteredCards.map(card => {
                const suitColor = getSuitColor(card.suit);
                const isLearned = learnedCards.has(card.id);
                return (
                  <CardListItem
                    key={card.id}
                    suitColor={suitColor}
                    learned={isLearned}
                    onClick={() => setSelectedCard(card)}
                  >
                    <Box sx={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '8px',
                      background: `${suitColor}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: suitColor,
                      flexShrink: 0
                    }}>
                      {getSuitIcon(card.suit)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{
                          fontFamily: '"Cinzel", serif',
                          color: '#e0e0e0',
                          fontWeight: 600
                        }}>
                          {card.name}
                        </Typography>
                        {isLearned && <CheckCircle size={16} color="#10b981" />}
                      </Box>
                      <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                        {suitInfo[card.suit]?.name} - {card.keywords.slice(0, 3).join(', ')}
                      </Typography>
                    </Box>
                  </CardListItem>
                );
              })}
            </CardListView>
          )}
        </>
      )}

      {/* Card Detail Modal */}
      <Dialog
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(180deg, #1a1028 0%, #0a0812 100%)',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '16px',
          }
        }}
      >
        {selectedCard && (
          <DialogContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: getSuitColor(selectedCard.suit) }}>
                  {getSuitIcon(selectedCard.suit)}
                  <Typography sx={{ fontSize: '0.9rem', textTransform: 'uppercase' }}>
                    {suitInfo[selectedCard.suit]?.name}
                  </Typography>
                </Box>
                <Typography sx={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: '2rem',
                  color: getSuitColor(selectedCard.suit)
                }}>
                  {selectedCard.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title={learnedCards.has(selectedCard.id) ? 'Mark as unlearned' : 'Mark as learned'}>
                  <IconButton
                    onClick={() => toggleLearned(selectedCard.id)}
                    sx={{ color: learnedCards.has(selectedCard.id) ? '#10b981' : '#888888' }}
                  >
                    {learnedCards.has(selectedCard.id) ? <CheckCircle size={24} /> : <Circle size={24} />}
                  </IconButton>
                </Tooltip>
                <IconButton onClick={() => setSelectedCard(null)} sx={{ color: '#888888' }}>
                  <X size={24} />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
              {selectedCard.keywords.map((kw, i) => (
                <Chip
                  key={i}
                  label={kw}
                  sx={{
                    background: `${getSuitColor(selectedCard.suit)}15`,
                    color: getSuitColor(selectedCard.suit)
                  }}
                />
              ))}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#a78bfa', fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                Upright Meaning
              </Typography>
              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.6 }}>
                {selectedCard.uprightMeaning}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#ef4444', fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                Reversed Meaning
              </Typography>
              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.6 }}>
                {selectedCard.reversedMeaning}
              </Typography>
            </Box>

            <Box sx={{ mb: 3, p: 3, borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <Typography sx={{ color: '#d4af37', fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                Gothic Description
              </Typography>
              <Typography sx={{ color: '#9080a0', fontStyle: 'italic', lineHeight: 1.6 }}>
                {selectedCard.gothicDescription}
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: '#888888', fontWeight: 600, mb: 1 }}>
                Symbolism
              </Typography>
              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.6 }}>
                {selectedCard.symbolism}
              </Typography>
            </Box>

            <Box sx={{ p: 3, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Typography sx={{ color: '#10b981', fontWeight: 600, mb: 1 }}>
                Advice
              </Typography>
              <Typography sx={{ color: '#d0d0d0', lineHeight: 1.6 }}>
                {selectedCard.advice}
              </Typography>
            </Box>

            {selectedCard.element && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2, color: '#888888', fontSize: '0.9rem' }}>
                <Typography>Element: <span style={{ color: '#a78bfa' }}>{selectedCard.element}</span></Typography>
                {selectedCard.zodiac && (
                  <Typography>Zodiac: <span style={{ color: '#a78bfa' }}>{selectedCard.zodiac}</span></Typography>
                )}
                {selectedCard.planet && (
                  <Typography>Planet: <span style={{ color: '#a78bfa' }}>{selectedCard.planet}</span></Typography>
                )}
              </Box>
            )}
          </DialogContent>
        )}
      </Dialog>
    </LibraryContainer>
  );
};

export default TarotLibrary;
