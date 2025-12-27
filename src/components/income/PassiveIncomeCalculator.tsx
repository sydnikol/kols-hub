import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  styled,
  keyframes,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingUp,
  DollarSign,
  Clock,
  Coins,
  Sparkles,
  Calculator,
  Bookmark,
  CheckCircle2,
  Shuffle,
  X,
  TrendingDown,
  Play,
} from 'lucide-react';
import kolPassiveIdeas from '../../data/kol_1000_passive_ideas_seed.json';

// Keyframe animations
const coinFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(5deg);
  }
  50% {
    transform: translateY(-5px) rotate(-5deg);
  }
  75% {
    transform: translateY(-15px) rotate(3deg);
  }
`;

const countUp = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const shimmerAnimation = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const goldenGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(234, 179, 8, 0.4), 0 0 40px rgba(234, 179, 8, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(234, 179, 8, 0.6), 0 0 60px rgba(234, 179, 8, 0.3);
  }
`;

// Styled components with gothic dark theme + emerald green + gold
const StyledContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
  padding: '2rem',
});

const StyledHeader = styled(Box)({
  background: 'linear-gradient(90deg, #047857 0%, #059669 25%, #047857 50%, #eab308 75%, #059669 100%)',
  backgroundSize: '200% auto',
  padding: '2rem',
  borderRadius: '16px',
  marginBottom: '2rem',
  animation: `${shimmerAnimation} 4s linear infinite`,
  boxShadow: '0 8px 32px rgba(4, 120, 87, 0.4), 0 4px 16px rgba(234, 179, 8, 0.3)',
  position: 'relative',
  overflow: 'hidden',
});

const HeaderTitle = styled(Typography)({
  color: '#0a0812',
  fontWeight: 800,
  fontSize: '2.5rem',
  textAlign: 'center',
  marginBottom: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
});

const HeaderSubtitle = styled(Typography)({
  color: '#1a1028',
  fontSize: '1.1rem',
  textAlign: 'center',
  fontWeight: 600,
});

const FloatingCoin = styled(Coins)({
  position: 'absolute',
  color: '#eab308',
  opacity: 0.3,
  animation: `${coinFloat} 3s ease-in-out infinite`,
});

const StyledCard = styled(Card)<{ selected?: boolean }>(({ selected }) => ({
  background: selected
    ? 'linear-gradient(145deg, #1a1028 0%, #2a1838 100%)'
    : 'linear-gradient(145deg, #1a1028 0%, #2a1838 100%)',
  borderRadius: '12px',
  border: selected
    ? '2px solid #eab308'
    : '1px solid rgba(4, 120, 87, 0.2)',
  transition: 'all 0.3s ease',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: selected
      ? '0 12px 40px rgba(234, 179, 8, 0.5)'
      : '0 12px 40px rgba(4, 120, 87, 0.4)',
    borderColor: selected ? '#eab308' : 'rgba(5, 150, 105, 0.5)',
  },
}));

const KindChip = styled(Chip)<{ kind: string }>(({ kind }) => ({
  background: kind === 'passive'
    ? 'linear-gradient(135deg, #047857 0%, #059669 100%)'
    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const CategoryChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  background: selected
    ? 'linear-gradient(135deg, #047857 0%, #059669 100%)'
    : 'rgba(4, 120, 87, 0.1)',
  color: selected ? '#ffffff' : '#059669',
  border: `1px solid ${selected ? '#059669' : 'rgba(4, 120, 87, 0.3)'}`,
  fontWeight: 600,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: selected
      ? 'linear-gradient(135deg, #047857 0%, #059669 100%)'
      : 'rgba(4, 120, 87, 0.2)',
    transform: 'scale(1.05)',
  },
}));

const IncomeBox = styled(Box)({
  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(4, 120, 87, 0.1) 100%)',
  padding: '1.5rem',
  borderRadius: '12px',
  border: '2px solid rgba(234, 179, 8, 0.4)',
  textAlign: 'center',
  marginTop: '1rem',
  marginBottom: '1rem',
  animation: `${countUp} 0.6s ease-out`,
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1028 0%, #2a1838 100%)',
    borderRadius: '16px',
    border: '2px solid rgba(4, 120, 87, 0.3)',
    maxWidth: '800px',
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(4, 120, 87, 0.05)',
    color: '#059669',
    borderRadius: '8px',
    '& fieldset': {
      borderColor: 'rgba(4, 120, 87, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(5, 150, 105, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#047857',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#059669',
  },
});

const StyledSelect = styled(Select)({
  background: 'rgba(4, 120, 87, 0.05)',
  color: '#059669',
  borderRadius: '8px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(4, 120, 87, 0.3)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(5, 150, 105, 0.5)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#047857',
  },
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)',
  color: '#0a0812',
  fontWeight: 800,
  padding: '12px 32px',
  borderRadius: '12px',
  fontSize: '1.1rem',
  textTransform: 'none',
  animation: `${goldenGlow} 2s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.3s ease',
});

const SummaryCard = styled(Card)({
  background: 'linear-gradient(145deg, rgba(4, 120, 87, 0.15) 0%, rgba(234, 179, 8, 0.1) 100%)',
  borderRadius: '16px',
  border: '2px solid rgba(4, 120, 87, 0.3)',
  padding: '1.5rem',
  marginBottom: '2rem',
});

const CalculatorCard = styled(Card)({
  background: 'linear-gradient(145deg, rgba(234, 179, 8, 0.15) 0%, rgba(4, 120, 87, 0.1) 100%)',
  borderRadius: '16px',
  border: '2px solid rgba(234, 179, 8, 0.4)',
  padding: '2rem',
  marginBottom: '2rem',
  boxShadow: '0 8px 32px rgba(234, 179, 8, 0.2)',
});

// Interface matching data structure
interface PassiveIncomeIdea {
  title: string;
  kind: 'passive' | 'active';
  estMonthly: number;
  startupCost: number;
  hoursPerWeek: number;
  notes: string;
  url: string;
}

type SortOption = 'estMonthly' | 'startupCost' | 'hoursPerWeek';

const PassiveIncomeCalculator: React.FC = React.memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKind, setSelectedKind] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('estMonthly');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [started, setStarted] = useState<Set<string>>(new Set());
  const [selectedForCalculator, setSelectedForCalculator] = useState<Set<string>>(new Set());
  const [selectedIdea, setSelectedIdea] = useState<PassiveIncomeIdea | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const ideas: PassiveIncomeIdea[] = kolPassiveIdeas;

  // Filter ideas based on search and kind
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch =
        idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.notes.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesKind = selectedKind === 'all' || idea.kind === selectedKind;

      return matchesSearch && matchesKind;
    });
  }, [ideas, searchTerm, selectedKind]);

  // Sort filtered ideas
  const sortedIdeas = useMemo(() => {
    const sorted = [...filteredIdeas];

    switch (sortBy) {
      case 'estMonthly':
        return sorted.sort((a, b) => b.estMonthly - a.estMonthly);
      case 'startupCost':
        return sorted.sort((a, b) => a.startupCost - b.startupCost);
      case 'hoursPerWeek':
        return sorted.sort((a, b) => a.hoursPerWeek - b.hoursPerWeek);
      default:
        return sorted;
    }
  }, [filteredIdeas, sortBy]);

  // Summary statistics
  const summaryStats = useMemo(() => {
    const totalIdeas = filteredIdeas.length;
    const totalPotentialMonthly = filteredIdeas.reduce(
      (sum, idea) => sum + idea.estMonthly,
      0
    );
    const averageStartupCost =
      totalIdeas > 0
        ? filteredIdeas.reduce((sum, idea) => sum + idea.startupCost, 0) / totalIdeas
        : 0;

    return {
      totalIdeas,
      totalPotentialMonthly,
      averageStartupCost,
    };
  }, [filteredIdeas]);

  // Calculator total
  const calculatorTotal = useMemo(() => {
    return Array.from(selectedForCalculator).reduce((sum, title) => {
      const idea = ideas.find((i) => i.title === title);
      return sum + (idea?.estMonthly || 0);
    }, 0);
  }, [selectedForCalculator, ideas]);

  // Handlers
  const handleBookmark = useCallback((title: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setBookmarked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  }, []);

  const handleStarted = useCallback((title: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setStarted((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  }, []);

  const handleCalculatorToggle = useCallback((title: string, e?: React.ChangeEvent<HTMLInputElement>) => {
    e?.stopPropagation();
    setSelectedForCalculator((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  }, []);

  const handleRandomIdea = useCallback(() => {
    if (sortedIdeas.length > 0) {
      const randomIndex = Math.floor(Math.random() * sortedIdeas.length);
      const randomIdea = sortedIdeas[randomIndex];
      setSelectedIdea(randomIdea);
      setDialogOpen(true);
    }
  }, [sortedIdeas]);

  const handleCardClick = useCallback((idea: PassiveIncomeIdea) => {
    setSelectedIdea(idea);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setTimeout(() => setSelectedIdea(null), 300);
  }, []);

  return (
    <StyledContainer>
      {/* Header with animated coins */}
      <StyledHeader>
        <FloatingCoin size={40} style={{ top: '10%', left: '5%', animationDelay: '0s' }} />
        <FloatingCoin size={30} style={{ top: '20%', right: '10%', animationDelay: '0.5s' }} />
        <FloatingCoin size={35} style={{ bottom: '15%', left: '15%', animationDelay: '1s' }} />
        <FloatingCoin size={25} style={{ bottom: '10%', right: '20%', animationDelay: '1.5s' }} />

        <HeaderTitle>
          <DollarSign size={48} />
          Passive Income Calculator
          <Coins size={48} />
        </HeaderTitle>
        <HeaderSubtitle>
          Track, calculate, and optimize your wealth-building journey
        </HeaderSubtitle>
      </StyledHeader>

      {/* Summary Statistics */}
      <SummaryCard>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <TrendingUp size={32} style={{ color: '#059669', marginBottom: '0.5rem' }} />
              <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mb: 0.5 }}>
                Total Potential Monthly
              </Typography>
              <Typography
                sx={{
                  color: '#eab308',
                  fontSize: '2rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                ${summaryStats.totalPotentialMonthly.toLocaleString()}/mo
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <DollarSign size={32} style={{ color: '#059669', marginBottom: '0.5rem' }} />
              <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mb: 0.5 }}>
                Average Startup Cost
              </Typography>
              <Typography
                sx={{
                  color: '#047857',
                  fontSize: '2rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                ${summaryStats.averageStartupCost.toFixed(0)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Sparkles size={32} style={{ color: '#059669', marginBottom: '0.5rem' }} />
              <Typography sx={{ color: '#6b7280', fontSize: '0.9rem', mb: 0.5 }}>
                Total Ideas
              </Typography>
              <Typography
                sx={{
                  color: '#059669',
                  fontSize: '2rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}
              >
                {summaryStats.totalIdeas}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </SummaryCard>

      {/* Income Calculator */}
      <CalculatorCard>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Calculator size={32} style={{ color: '#eab308' }} />
          <Typography
            variant="h5"
            sx={{ color: '#eab308', fontWeight: 800, flexGrow: 1 }}
          >
            Combined Income Calculator
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {selectedForCalculator.size} selected
          </Typography>
        </Box>
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.3) 0%, rgba(4, 120, 87, 0.2) 100%)',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            border: '2px solid rgba(234, 179, 8, 0.5)',
          }}
        >
          <Typography sx={{ color: '#eab308', fontSize: '1rem', mb: 1, fontWeight: 600 }}>
            Combined Monthly Income
          </Typography>
          <Typography
            sx={{
              color: '#eab308',
              fontSize: '3.5rem',
              fontWeight: 900,
              fontFamily: 'monospace',
              animation: selectedForCalculator.size > 0 ? `${countUp} 0.5s ease-out` : 'none',
            }}
          >
            ${calculatorTotal.toLocaleString()}/mo
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.85rem', mt: 1 }}>
            Select ideas below to calculate combined income potential
          </Typography>
        </Box>
      </CalculatorCard>

      {/* Search and Controls */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              placeholder="Search by title or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Sparkles size={20} style={{ marginRight: '8px', color: '#059669' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#059669' }}>Sort By</InputLabel>
              <StyledSelect
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <MenuItem value="estMonthly">Monthly Income (Highest)</MenuItem>
                <MenuItem value="startupCost">Startup Cost (Lowest)</MenuItem>
                <MenuItem value="hoursPerWeek">Hours/Week (Lowest)</MenuItem>
              </StyledSelect>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <RandomButton
              fullWidth
              variant="contained"
              onClick={handleRandomIdea}
              disabled={sortedIdeas.length === 0}
              startIcon={<Shuffle size={20} />}
            >
              Random Idea
            </RandomButton>
          </Grid>
        </Grid>
      </Box>

      {/* Kind Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ color: '#059669', fontWeight: 600, mb: 1 }}>
          Filter by Type:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <CategoryChip
            label="All"
            selected={selectedKind === 'all'}
            onClick={() => setSelectedKind('all')}
          />
          <CategoryChip
            label="Passive Income"
            selected={selectedKind === 'passive'}
            onClick={() => setSelectedKind('passive')}
          />
          <CategoryChip
            label="Active Income"
            selected={selectedKind === 'active'}
            onClick={() => setSelectedKind('active')}
          />
        </Box>
      </Box>

      {/* Results Count */}
      <Typography sx={{ color: '#059669', mb: 2, fontWeight: 600 }}>
        Found {sortedIdeas.length} income {sortedIdeas.length === 1 ? 'idea' : 'ideas'}
      </Typography>

      {/* Card Grid */}
      <Grid container spacing={3}>
        {sortedIdeas.map((idea, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={`${idea.title}-${index}`}>
            <StyledCard selected={selectedForCalculator.has(idea.title)}>
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Calculator Checkbox */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedForCalculator.has(idea.title)}
                        onChange={(e) => handleCalculatorToggle(idea.title, e)}
                        sx={{
                          color: '#eab308',
                          '&.Mui-checked': {
                            color: '#eab308',
                          },
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label={
                      <Typography sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        Calculate
                      </Typography>
                    }
                  />
                  <KindChip label={idea.kind} size="small" kind={idea.kind} />
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    color: '#059669',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    lineHeight: 1.3,
                    mb: 1.5,
                    minHeight: '2.6em',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleCardClick(idea)}
                >
                  {idea.title}
                </Typography>

                {/* Monthly Income - Prominently Displayed */}
                <IncomeBox>
                  <Typography sx={{ color: '#eab308', fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}>
                    EST. MONTHLY INCOME
                  </Typography>
                  <Typography
                    sx={{
                      color: '#eab308',
                      fontSize: '2rem',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                    }}
                  >
                    ${idea.estMonthly}/mo
                  </Typography>
                </IncomeBox>

                {/* Badges Row */}
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip
                    icon={<DollarSign size={14} />}
                    label={`$${idea.startupCost} startup`}
                    size="small"
                    sx={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  />
                  <Chip
                    icon={<Clock size={14} />}
                    label={`${idea.hoursPerWeek}h/wk`}
                    size="small"
                    sx={{
                      background: 'rgba(168, 85, 247, 0.2)',
                      color: '#a78bfa',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {/* Notes Preview */}
                {idea.notes && (
                  <Typography
                    sx={{
                      color: '#9ca3af',
                      fontSize: '0.8rem',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {idea.notes}
                  </Typography>
                )}
              </CardContent>

              <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                <Button
                  size="small"
                  fullWidth
                  onClick={() => handleCardClick(idea)}
                  sx={{
                    color: '#059669',
                    borderColor: 'rgba(4, 120, 87, 0.3)',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#047857',
                      background: 'rgba(4, 120, 87, 0.1)',
                    },
                  }}
                  variant="outlined"
                >
                  View Details
                </Button>
                <IconButton
                  size="small"
                  onClick={(e) => handleBookmark(idea.title, e)}
                  sx={{
                    color: bookmarked.has(idea.title) ? '#eab308' : '#6b7280',
                    '&:hover': { color: '#eab308' },
                  }}
                >
                  <Bookmark size={20} fill={bookmarked.has(idea.title) ? '#eab308' : 'none'} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => handleStarted(idea.title, e)}
                  sx={{
                    color: started.has(idea.title) ? '#059669' : '#6b7280',
                    '&:hover': { color: '#059669' },
                  }}
                >
                  <Play size={20} fill={started.has(idea.title) ? '#059669' : 'none'} />
                </IconButton>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {sortedIdeas.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: '#6b7280',
          }}
        >
          <TrendingDown size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No ideas found
          </Typography>
          <Typography>
            Try adjusting your filters or search term
          </Typography>
        </Box>
      )}

      {/* Detail Dialog */}
      <StyledDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedIdea && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #eab308 100%)',
                color: '#ffffff',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Coins size={24} />
                {selectedIdea.title}
              </Box>
              <IconButton
                onClick={handleCloseDialog}
                sx={{
                  color: '#ffffff',
                  '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
                }}
              >
                <X size={24} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              {/* Kind Badge */}
              <Box sx={{ mb: 3 }}>
                <KindChip label={selectedIdea.kind} kind={selectedIdea.kind} />
              </Box>

              {/* Key Metrics Grid */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      background: 'rgba(234, 179, 8, 0.15)',
                      p: 2,
                      borderRadius: '8px',
                      border: '2px solid rgba(234, 179, 8, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <DollarSign size={24} style={{ color: '#eab308', marginBottom: '0.5rem' }} />
                    <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', mb: 0.5 }}>
                      Monthly Income
                    </Typography>
                    <Typography sx={{ color: '#eab308', fontWeight: 800, fontSize: '1.8rem', fontFamily: 'monospace' }}>
                      ${selectedIdea.estMonthly}/mo
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      background: 'rgba(59, 130, 246, 0.15)',
                      p: 2,
                      borderRadius: '8px',
                      border: '2px solid rgba(59, 130, 246, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <DollarSign size={24} style={{ color: '#60a5fa', marginBottom: '0.5rem' }} />
                    <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', mb: 0.5 }}>
                      Startup Cost
                    </Typography>
                    <Typography sx={{ color: '#60a5fa', fontWeight: 800, fontSize: '1.8rem', fontFamily: 'monospace' }}>
                      ${selectedIdea.startupCost}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      background: 'rgba(168, 85, 247, 0.15)',
                      p: 2,
                      borderRadius: '8px',
                      border: '2px solid rgba(168, 85, 247, 0.3)',
                      textAlign: 'center',
                    }}
                  >
                    <Clock size={24} style={{ color: '#a78bfa', marginBottom: '0.5rem' }} />
                    <Typography sx={{ color: '#6b7280', fontSize: '0.8rem', mb: 0.5 }}>
                      Hours Per Week
                    </Typography>
                    <Typography sx={{ color: '#a78bfa', fontWeight: 800, fontSize: '1.8rem', fontFamily: 'monospace' }}>
                      {selectedIdea.hoursPerWeek}h
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Notes */}
              {selectedIdea.notes && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      color: '#059669',
                      fontWeight: 700,
                      mb: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    Notes
                  </Typography>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '1rem', lineHeight: 1.7 }}>
                    {selectedIdea.notes}
                  </Typography>
                </Box>
              )}

              {/* URL */}
              {selectedIdea.url && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      color: '#059669',
                      fontWeight: 700,
                      mb: 1.5,
                      fontSize: '1.1rem',
                    }}
                  >
                    Resource
                  </Typography>
                  <a
                    href={selectedIdea.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#60a5fa', textDecoration: 'underline' }}
                  >
                    {selectedIdea.url}
                  </a>
                </Box>
              )}

              {/* ROI Calculation */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(4, 120, 87, 0.15) 100%)',
                  p: 2,
                  borderRadius: '12px',
                  border: '2px solid rgba(234, 179, 8, 0.3)',
                }}
              >
                <Typography sx={{ color: '#eab308', fontWeight: 700, mb: 1 }}>
                  ROI Calculation
                </Typography>
                <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                  Annual Income: <strong style={{ color: '#eab308' }}>${(selectedIdea.estMonthly * 12).toLocaleString()}</strong>
                </Typography>
                {selectedIdea.startupCost > 0 && (
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>
                    Break-even: <strong style={{ color: '#eab308' }}>
                      {(selectedIdea.startupCost / selectedIdea.estMonthly).toFixed(1)} months
                    </strong>
                  </Typography>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={(e) => handleBookmark(selectedIdea.title, e)}
                startIcon={<Bookmark size={18} />}
                sx={{
                  color: bookmarked.has(selectedIdea.title) ? '#eab308' : '#6b7280',
                  borderColor: bookmarked.has(selectedIdea.title) ? '#eab308' : '#6b7280',
                  '&:hover': {
                    borderColor: '#eab308',
                    background: 'rgba(234, 179, 8, 0.1)',
                  },
                }}
                variant="outlined"
              >
                {bookmarked.has(selectedIdea.title) ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button
                onClick={(e) => handleStarted(selectedIdea.title, e)}
                startIcon={<CheckCircle2 size={18} />}
                sx={{
                  color: started.has(selectedIdea.title) ? '#059669' : '#6b7280',
                  borderColor: started.has(selectedIdea.title) ? '#059669' : '#6b7280',
                  '&:hover': {
                    borderColor: '#047857',
                    background: 'rgba(4, 120, 87, 0.1)',
                  },
                }}
                variant="outlined"
              >
                {started.has(selectedIdea.title) ? 'Started' : 'Mark Started'}
              </Button>
              <Button
                onClick={handleCloseDialog}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </StyledContainer>
  );
});

PassiveIncomeCalculator.displayName = 'PassiveIncomeCalculator';

export { PassiveIncomeCalculator };
export default PassiveIncomeCalculator;
