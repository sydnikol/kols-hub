import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  LinearProgress,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  keyframes,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp,
  DollarSign,
  Play,
  CheckCircle,
  Activity,
  Layers,
  BarChart3,
  Link2,
  Sparkles,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ShoppingBag,
  Palette,
  Clock,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Lazy load sub-components
const ArtLibrary = lazy(() => import('./ArtLibrary').catch(() => ({
  default: () => <PlaceholderComponent name="ArtLibrary" />
})));

const ExecutionPipeline = lazy(() => import('./ExecutionPipeline').catch(() => ({
  default: () => <PlaceholderComponent name="ExecutionPipeline" />
})));

// Import services
import kolPassiveIdeas from '../../data/kol_1000_passive_ideas_seed.json';

// Keyframe animations
const coinSpin = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(16, 185, 129, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.7), 0 0 60px rgba(16, 185, 129, 0.5);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Styled components
const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '2rem',
});

const HeaderCard = styled(Card)({
  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)',
  borderRadius: '24px',
  border: '2px solid rgba(245, 158, 11, 0.3)',
  padding: '2rem',
  marginBottom: '2rem',
  animation: `${pulseGlow} 3s ease-in-out infinite`,
  position: 'relative',
  overflow: 'hidden',
});

const EarningsDisplay = styled(Box)({
  textAlign: 'center',
  marginBottom: '2rem',
});

const EarningsAmount = styled(Typography)({
  fontSize: '4rem',
  fontWeight: 900,
  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #10b981 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontFamily: 'monospace',
  animation: `${shimmer} 3s linear infinite`,
  backgroundSize: '200% auto',
});

const ProgressCard = styled(Box)({
  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)',
  borderRadius: '16px',
  padding: '1.5rem',
  border: '1px solid rgba(16, 185, 129, 0.3)',
  marginBottom: '1rem',
});

const StatsGrid = styled(Grid)({
  marginBottom: '2rem',
});

const StatCard = styled(Card)({
  background: 'linear-gradient(145deg, #1a1028 0%, #2a1838 100%)',
  borderRadius: '16px',
  border: '1px solid rgba(245, 158, 11, 0.2)',
  padding: '1.5rem',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
    boxShadow: '0 10px 30px rgba(245, 158, 11, 0.3)',
  },
});

const StyledTabs = styled(Tabs)({
  marginBottom: '2rem',
  '& .MuiTabs-indicator': {
    backgroundColor: '#f59e0b',
    height: '3px',
  },
});

const StyledTab = styled(Tab)({
  color: '#9ca3af',
  fontWeight: 700,
  fontSize: '1rem',
  textTransform: 'none',
  '&.Mui-selected': {
    color: '#f59e0b',
  },
  '&:hover': {
    color: '#fbbf24',
  },
});

const IdeaCard = styled(Card)<{ highlighted?: boolean }>(({ highlighted }) => ({
  background: highlighted
    ? 'linear-gradient(145deg, rgba(245, 158, 11, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%)'
    : 'linear-gradient(145deg, #1a1028 0%, #2a1838 100%)',
  borderRadius: '12px',
  border: highlighted
    ? '2px solid #f59e0b'
    : '1px solid rgba(16, 185, 129, 0.2)',
  padding: '1.5rem',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    borderColor: '#10b981',
    boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
  },
}));

const ExecuteButton = styled(Button)({
  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  color: '#0a0812',
  fontWeight: 800,
  borderRadius: '12px',
  padding: '10px 24px',
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    transform: 'scale(1.05)',
  },
  transition: 'all 0.3s ease',
});

const PlatformCard = styled(Card)<{ connected?: boolean }>(({ connected }) => ({
  background: connected
    ? 'linear-gradient(145deg, rgba(16, 185, 129, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)'
    : 'linear-gradient(145deg, #1a1028 0%, #2a1838 100%)',
  borderRadius: '16px',
  border: connected
    ? '2px solid #10b981'
    : '1px solid rgba(107, 114, 128, 0.3)',
  padding: '1.5rem',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    borderColor: connected ? '#10b981' : '#f59e0b',
  },
}));

const RecommendationCard = styled(Card)({
  background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
  borderRadius: '16px',
  border: '2px solid rgba(99, 102, 241, 0.3)',
  padding: '1.5rem',
  marginBottom: '1rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(10px)',
    borderColor: 'rgba(99, 102, 241, 0.5)',
  },
});

const CoinIcon = styled(DollarSign)({
  color: '#f59e0b',
  animation: `${coinSpin} 3s linear infinite, ${floatAnimation} 2s ease-in-out infinite`,
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(145deg, #1a1028 0%, #2a1838 100%)',
    borderRadius: '24px',
    border: '2px solid rgba(245, 158, 11, 0.3)',
    minWidth: '500px',
  },
});

// Interfaces
interface PassiveIncomeIdea {
  title: string;
  kind: 'passive' | 'active';
  estMonthly: number;
  startupCost: number;
  hoursPerWeek: number;
  notes: string;
  url: string;
}

interface Platform {
  name: string;
  connected: boolean;
  earnings: number;
  listings: number;
  icon: React.ReactNode;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  type: 'trending' | 'optimization' | 'timing';
}

// Placeholder component for missing imports
const PlaceholderComponent: React.FC<{ name: string }> = ({ name }) => (
  <Box
    sx={{
      padding: '4rem',
      textAlign: 'center',
      background: 'rgba(245, 158, 11, 0.05)',
      borderRadius: '16px',
      border: '2px dashed rgba(245, 158, 11, 0.3)',
    }}
  >
    <Activity size={64} style={{ color: '#f59e0b', marginBottom: '1rem', opacity: 0.5 }} />
    <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 700, mb: 1 }}>
      {name} Coming Soon
    </Typography>
    <Typography sx={{ color: '#9ca3af' }}>
      This component will be available in the next update
    </Typography>
  </Box>
);

const PassiveIncomeExecutor: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedIdea, setSelectedIdea] = useState<PassiveIncomeIdea | null>(null);
  const [executionDialogOpen, setExecutionDialogOpen] = useState(false);
  const [filterKind, setFilterKind] = useState<'all' | 'passive' | 'active'>('all');
  const [sortBy, setSortBy] = useState<'earnings' | 'cost' | 'time'>('earnings');

  // Mock data - replace with real data from services
  const totalEarnings = 1247.50;
  const dailyTarget = 1500;
  const dailyEarnings = 340;
  const trendPercentage = 23;
  const trendDirection: 'up' | 'down' = 'up';

  const quickStats = {
    activeListings: 127,
    productsCreated: 89,
    queueSize: 23,
    successRate: 94,
  };

  const platforms: Platform[] = useMemo(() => [
    { name: 'Etsy', connected: true, earnings: 450.25, listings: 45, icon: <ShoppingBag size={32} /> },
    { name: 'Gumroad', connected: true, earnings: 320.50, listings: 28, icon: <Package size={32} /> },
    { name: 'Printful', connected: false, earnings: 0, listings: 0, icon: <Palette size={32} /> },
    { name: 'Redbubble', connected: true, earnings: 187.75, listings: 32, icon: <Sparkles size={32} /> },
    { name: 'Society6', connected: false, earnings: 0, listings: 0, icon: <Layers size={32} /> },
    { name: 'Creative Market', connected: true, earnings: 289.00, listings: 22, icon: <Activity size={32} /> },
  ], []);

  const recommendations: Recommendation[] = useMemo(() => [
    {
      id: '1',
      title: 'Dark Cottagecore Trending',
      description: 'Adapt 3 pieces to dark cottagecore aesthetic',
      action: 'Execute',
      type: 'trending',
    },
    {
      id: '2',
      title: 'Friday Peak Performance',
      description: 'Your goth designs peak on Fridays - queue 5 more?',
      action: 'Yes',
      type: 'timing',
    },
    {
      id: '3',
      title: 'Price Optimization',
      description: 'Raise poster prices 15% based on demand',
      action: 'Apply',
      type: 'optimization',
    },
  ], []);

  // Load ideas from JSON
  const ideas: PassiveIncomeIdea[] = useMemo(() => {
    return kolPassiveIdeas.slice(0, 50); // Load first 50 for performance
  }, []);

  // Filter and sort ideas
  const filteredIdeas = useMemo(() => {
    let filtered = ideas;

    if (filterKind !== 'all') {
      filtered = filtered.filter(idea => idea.kind === filterKind);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'earnings':
          return b.estMonthly - a.estMonthly;
        case 'cost':
          return a.startupCost - b.startupCost;
        case 'time':
          return a.hoursPerWeek - b.hoursPerWeek;
        default:
          return 0;
      }
    });

    return sorted;
  }, [ideas, filterKind, sortBy]);

  // Handlers
  const handleTabChange = useCallback((_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  }, []);

  const handleExecuteIdea = useCallback((idea: PassiveIncomeIdea) => {
    setSelectedIdea(idea);
    setExecutionDialogOpen(true);
  }, []);

  const handleCloseExecutionDialog = useCallback(() => {
    setExecutionDialogOpen(false);
    setTimeout(() => setSelectedIdea(null), 300);
  }, []);

  const handleRecommendationAction = useCallback((recommendation: Recommendation) => {
    console.log('Executing recommendation:', recommendation);
    // Add implementation
  }, []);

  const handlePlatformSync = useCallback((platformName: string) => {
    console.log('Syncing platform:', platformName);
    // Add implementation
  }, []);

  const progressPercentage = (dailyEarnings / dailyTarget) * 100;

  return (
    <DashboardContainer>
      {/* HEADER SECTION */}
      <HeaderCard>
        <EarningsDisplay>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
            <CoinIcon size={48} />
            <EarningsAmount>
              ${totalEarnings.toFixed(2)}
            </EarningsAmount>
            <CoinIcon size={48} />
          </Box>
          <Typography sx={{ color: '#fbbf24', fontSize: '1.5rem', fontWeight: 700 }}>
            Total Earnings
          </Typography>
        </EarningsDisplay>

        {/* Daily Target Progress */}
        <ProgressCard>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography sx={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>
              Daily Progress
            </Typography>
            <Typography sx={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'monospace' }}>
              ${dailyEarnings} / ${dailyTarget}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 100%)',
                borderRadius: 6,
              },
            }}
          />
          <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mt: 1, textAlign: 'center' }}>
            {progressPercentage.toFixed(1)}% of daily target
          </Typography>
        </ProgressCard>

        {/* Trend Indicator */}
        <Box sx={{ textAlign: 'center' }}>
          <Chip
            icon={trendDirection === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            label={`${trendDirection === 'up' ? '↑' : '↓'} ${trendPercentage}% vs yesterday`}
            sx={{
              background: trendDirection === 'up'
                ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '1.5rem 1rem',
            }}
          />
        </Box>
      </HeaderCard>

      {/* QUICK STATS ROW */}
      <StatsGrid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Layers size={40} style={{ color: '#f59e0b', marginBottom: '0.5rem' }} />
            <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mb: 0.5 }}>
              Active Listings
            </Typography>
            <Typography sx={{ color: '#f59e0b', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'monospace' }}>
              {quickStats.activeListings}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Package size={40} style={{ color: '#10b981', marginBottom: '0.5rem' }} />
            <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mb: 0.5 }}>
              Products Created
            </Typography>
            <Typography sx={{ color: '#10b981', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'monospace' }}>
              {quickStats.productsCreated}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <Clock size={40} style={{ color: '#fbbf24', marginBottom: '0.5rem' }} />
            <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mb: 0.5 }}>
              Queue Size
            </Typography>
            <Typography sx={{ color: '#fbbf24', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'monospace' }}>
              {quickStats.queueSize}
            </Typography>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CheckCircle size={40} style={{ color: '#34d399', marginBottom: '0.5rem' }} />
            <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem', mb: 0.5 }}>
              Success Rate
            </Typography>
            <Typography sx={{ color: '#34d399', fontSize: '2.5rem', fontWeight: 900, fontFamily: 'monospace' }}>
              {quickStats.successRate}%
            </Typography>
          </StatCard>
        </Grid>
      </StatsGrid>

      {/* AI RECOMMENDATIONS SECTION */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sparkles size={28} />
          AI Recommendations
        </Typography>
        {recommendations.map((rec) => (
          <RecommendationCard key={rec.id}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
                {rec.type === 'trending' && '🔥 '}
                {rec.type === 'timing' && '⏰ '}
                {rec.type === 'optimization' && '📈 '}
                {rec.title}
              </Typography>
              <Typography sx={{ color: '#d1d5db', fontSize: '0.95rem' }}>
                {rec.description}
              </Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => handleRecommendationAction(rec)}
              sx={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: '#ffffff',
                fontWeight: 700,
                '&:hover': {
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                },
              }}
            >
              {rec.action}
            </Button>
          </RecommendationCard>
        ))}
      </Box>

      {/* MAIN TABS */}
      <StyledTabs value={activeTab} onChange={handleTabChange}>
        <StyledTab icon={<Zap size={20} />} iconPosition="start" label="Execute Ideas" />
        <StyledTab icon={<Palette size={20} />} iconPosition="start" label="My Art" />
        <StyledTab icon={<Activity size={20} />} iconPosition="start" label="Pipeline" />
        <StyledTab icon={<Link2 size={20} />} iconPosition="start" label="Platforms" />
        <StyledTab icon={<BarChart3 size={20} />} iconPosition="start" label="Analytics" />
      </StyledTabs>

      {/* TAB CONTENT */}
      <Box>
        {/* Execute Ideas Tab */}
        {activeTab === 0 && (
          <Box>
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel sx={{ color: '#10b981' }}>Filter by Kind</InputLabel>
                <Select
                  value={filterKind}
                  label="Filter by Kind"
                  onChange={(e) => setFilterKind(e.target.value as any)}
                  sx={{
                    color: '#10b981',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(16, 185, 129, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(16, 185, 129, 0.5)',
                    },
                  }}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="passive">Passive</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel sx={{ color: '#f59e0b' }}>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as any)}
                  sx={{
                    color: '#f59e0b',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(245, 158, 11, 0.3)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(245, 158, 11, 0.5)',
                    },
                  }}
                >
                  <MenuItem value="earnings">Potential Earnings</MenuItem>
                  <MenuItem value="cost">Startup Cost</MenuItem>
                  <MenuItem value="time">Time Required</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={2}>
              {filteredIdeas.map((idea, index) => (
                <Grid item xs={12} sm={6} md={4} key={`${idea.title}-${index}`}>
                  <IdeaCard highlighted={idea.estMonthly > 150}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip
                        label={idea.kind}
                        size="small"
                        sx={{
                          background: idea.kind === 'passive'
                            ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                          color: '#ffffff',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      />
                    </Box>

                    <Typography sx={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem', mb: 1, minHeight: '3em' }}>
                      {idea.title}
                    </Typography>

                    <Box sx={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      textAlign: 'center',
                      mb: 2,
                    }}>
                      <Typography sx={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 600, mb: 0.5 }}>
                        EST. MONTHLY
                      </Typography>
                      <Typography sx={{ color: '#f59e0b', fontSize: '1.8rem', fontWeight: 900, fontFamily: 'monospace' }}>
                        ${idea.estMonthly}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip
                        icon={<DollarSign size={14} />}
                        label={`$${idea.startupCost}`}
                        size="small"
                        sx={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontSize: '0.7rem' }}
                      />
                      <Chip
                        icon={<Clock size={14} />}
                        label={`${idea.hoursPerWeek}h/wk`}
                        size="small"
                        sx={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a78bfa', fontSize: '0.7rem' }}
                      />
                    </Box>

                    {idea.notes && (
                      <Typography sx={{
                        color: '#9ca3af',
                        fontSize: '0.85rem',
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {idea.notes}
                      </Typography>
                    )}

                    <ExecuteButton
                      fullWidth
                      startIcon={<Play size={18} />}
                      onClick={() => handleExecuteIdea(idea)}
                    >
                      Execute
                    </ExecuteButton>
                  </IdeaCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* My Art Tab */}
        {activeTab === 1 && (
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <CircularProgress sx={{ color: '#f59e0b' }} />
            </Box>
          }>
            <ArtLibrary />
          </Suspense>
        )}

        {/* Pipeline Tab */}
        {activeTab === 2 && (
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <CircularProgress sx={{ color: '#f59e0b' }} />
            </Box>
          }>
            <ExecutionPipeline />
          </Suspense>
        )}

        {/* Platforms Tab */}
        {activeTab === 3 && (
          <Box>
            <Grid container spacing={3}>
              {platforms.map((platform) => (
                <Grid item xs={12} sm={6} md={4} key={platform.name}>
                  <PlatformCard connected={platform.connected}>
                    <Box sx={{ mb: 2 }}>
                      {platform.icon}
                    </Box>
                    <Typography sx={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.3rem', mb: 1 }}>
                      {platform.name}
                    </Typography>

                    <Chip
                      icon={platform.connected ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                      label={platform.connected ? 'Connected' : 'Disconnected'}
                      sx={{
                        background: platform.connected
                          ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                          : 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
                        color: '#ffffff',
                        fontWeight: 700,
                        mb: 2,
                      }}
                    />

                    {platform.connected && (
                      <Box sx={{ mb: 2 }}>
                        <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                          Earnings: <strong style={{ color: '#10b981' }}>${platform.earnings.toFixed(2)}</strong>
                        </Typography>
                        <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                          Listings: <strong style={{ color: '#fbbf24' }}>{platform.listings}</strong>
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                      <Button
                        variant={platform.connected ? 'outlined' : 'contained'}
                        size="small"
                        sx={{
                          color: platform.connected ? '#ef4444' : '#ffffff',
                          borderColor: platform.connected ? '#ef4444' : undefined,
                          background: platform.connected ? undefined : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                          '&:hover': {
                            borderColor: platform.connected ? '#dc2626' : undefined,
                            background: platform.connected ? 'rgba(239, 68, 68, 0.1)' : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                          },
                        }}
                      >
                        {platform.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                      {platform.connected && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<RefreshCw size={16} />}
                          onClick={() => handlePlatformSync(platform.name)}
                          sx={{
                            color: '#f59e0b',
                            borderColor: '#f59e0b',
                            '&:hover': {
                              borderColor: '#fbbf24',
                              background: 'rgba(245, 158, 11, 0.1)',
                            },
                          }}
                        >
                          Sync Now
                        </Button>
                      )}
                    </Box>
                  </PlatformCard>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Analytics Tab */}
        {activeTab === 4 && (
          <Box sx={{
            padding: '4rem',
            textAlign: 'center',
            background: 'rgba(245, 158, 11, 0.05)',
            borderRadius: '16px',
            border: '2px dashed rgba(245, 158, 11, 0.3)',
          }}>
            <BarChart3 size={64} style={{ color: '#f59e0b', marginBottom: '1rem', opacity: 0.5 }} />
            <Typography variant="h5" sx={{ color: '#f59e0b', fontWeight: 700, mb: 1 }}>
              Analytics Dashboard Coming Soon
            </Typography>
            <Typography sx={{ color: '#9ca3af' }}>
              Detailed earnings charts, insights, and performance metrics will be available here
            </Typography>
          </Box>
        )}
      </Box>

      {/* EXECUTION MODAL */}
      <StyledDialog open={executionDialogOpen} onClose={handleCloseExecutionDialog}>
        {selectedIdea && (
          <>
            <DialogTitle sx={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #10b981 100%)',
              color: '#0a0812',
              fontWeight: 800,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Zap size={24} />
                Execute Idea
              </Box>
              <IconButton onClick={handleCloseExecutionDialog} sx={{ color: '#0a0812' }}>
                <X size={24} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Typography sx={{ color: '#f59e0b', fontSize: '1.3rem', fontWeight: 700, mb: 2 }}>
                {selectedIdea.title}
              </Typography>

              <Box sx={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                mb: 3,
              }}>
                <Typography sx={{ color: '#10b981', fontWeight: 700, mb: 1 }}>
                  Potential Monthly Income: ${selectedIdea.estMonthly}
                </Typography>
                <Typography sx={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                  Startup Cost: ${selectedIdea.startupCost} • Time: {selectedIdea.hoursPerWeek}h/week
                </Typography>
              </Box>

              <Typography sx={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.1rem', mb: 2 }}>
                Select Execution Mode:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      padding: '1rem',
                      borderColor: '#10b981',
                      color: '#10b981',
                      justifyContent: 'flex-start',
                      '&:hover': {
                        borderColor: '#34d399',
                        background: 'rgba(16, 185, 129, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                        🤖 Full Automation
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        AI handles everything from creation to publishing
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      padding: '1rem',
                      borderColor: '#f59e0b',
                      color: '#f59e0b',
                      justifyContent: 'flex-start',
                      '&:hover': {
                        borderColor: '#fbbf24',
                        background: 'rgba(245, 158, 11, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                        👤 Semi-Automated
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        AI creates, you review and approve before publishing
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      padding: '1rem',
                      borderColor: '#6366f1',
                      color: '#6366f1',
                      justifyContent: 'flex-start',
                      '&:hover': {
                        borderColor: '#8b5cf6',
                        background: 'rgba(99, 102, 241, 0.1)',
                      },
                    }}
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                        ✏️ Manual with AI Assist
                      </Typography>
                      <Typography sx={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        You create with AI suggestions and optimization
                      </Typography>
                    </Box>
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button
                onClick={handleCloseExecutionDialog}
                sx={{ color: '#9ca3af' }}
              >
                Cancel
              </Button>
            </DialogActions>
          </>
        )}
      </StyledDialog>
    </DashboardContainer>
  );
});

PassiveIncomeExecutor.displayName = 'PassiveIncomeExecutor';

export { PassiveIncomeExecutor };
export default PassiveIncomeExecutor;
