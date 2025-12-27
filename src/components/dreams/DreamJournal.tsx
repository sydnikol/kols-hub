import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Fade,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Moon,
  Sun,
  Star,
  Cloud,
  CloudRain,
  Eye,
  Heart,
  Skull,
  Bird,
  Home,
  Car,
  User,
  Users,
  Sparkles,
  Book,
  Plus,
  X,
  Search,
  Calendar,
  Tag,
  TrendingUp,
  Save,
  Mic,
  Edit3,
  Trash2,
  ChevronRight,
  Flame,
  Waves,
  Mountain,
  TreePine,
  Key,
  Lock,
  Crown,
  Feather,
  Ghost,
} from 'lucide-react';

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
`;

// Styled Components
const JournalContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #0d0a1a 50%, #1a0d1a 100%)',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'1\' fill=\'%23ffffff10\'/%3E%3Ccircle cx=\'50\' cy=\'30\' r=\'0.5\' fill=\'%23ffffff15\'/%3E%3Ccircle cx=\'80\' cy=\'60\' r=\'1.5\' fill=\'%23ffffff08\'/%3E%3Ccircle cx=\'30\' cy=\'80\' r=\'0.8\' fill=\'%23ffffff12\'/%3E%3C/svg%3E")',
    animation: `${twinkle} 3s infinite`,
    pointerEvents: 'none',
  },
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #6366f1 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
  marginBottom: '8px',
});

const MoonPhaseCard = styled(Card)<{ phase?: string }>(({ phase }) => ({
  background: phase === 'new'
    ? 'linear-gradient(135deg, rgba(30, 30, 40, 0.9) 0%, rgba(20, 20, 30, 0.8) 100%)'
    : phase === 'full'
    ? 'linear-gradient(135deg, rgba(255, 255, 240, 0.15) 0%, rgba(200, 200, 180, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid',
  borderColor: phase === 'full' ? 'rgba(255, 255, 200, 0.4)' : 'rgba(139, 92, 246, 0.3)',
  borderRadius: '16px',
  padding: '20px',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const DreamCard = styled(Card)<{ mood?: string }>(({ mood }) => ({
  background: mood === 'peaceful'
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
    : mood === 'nightmare'
    ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.1) 100%)'
    : mood === 'prophetic'
    ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(180, 140, 40, 0.1) 100%)'
    : mood === 'lucid'
    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)'
    : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
  },
}));

const SymbolChip = styled(Chip)<{ symbolcolor?: string }>(({ symbolcolor }) => ({
  background: `${symbolcolor}20`,
  color: symbolcolor,
  border: `1px solid ${symbolcolor}40`,
  margin: '2px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: `${symbolcolor}30`,
    transform: 'scale(1.05)',
  },
}));

const MoonIcon = styled(Box)<{ phase?: string }>(({ phase }) => ({
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: phase === 'new'
    ? 'linear-gradient(135deg, #1a1a2e 0%, #0a0a1a 100%)'
    : phase === 'full'
    ? 'linear-gradient(135deg, #f5f5dc 0%, #ddd8c4 100%)'
    : phase === 'waxing'
    ? 'linear-gradient(90deg, #1a1a2e 0%, #1a1a2e 50%, #f5f5dc 50%, #f5f5dc 100%)'
    : 'linear-gradient(90deg, #f5f5dc 0%, #f5f5dc 50%, #1a1a2e 50%, #1a1a2e 100%)',
  boxShadow: phase === 'full'
    ? '0 0 30px rgba(255, 255, 200, 0.5), inset 0 0 20px rgba(255, 255, 200, 0.3)'
    : '0 0 20px rgba(139, 92, 246, 0.3)',
  animation: `${floatAnimation} 4s ease-in-out infinite`,
  margin: '0 auto 16px',
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(139, 92, 246, 0.05)',
    borderRadius: '12px',
    color: '#e9d5ff',
    '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
    '&:hover fieldset': { borderColor: '#8b5cf6' },
    '&.Mui-focused fieldset': { borderColor: '#a855f7' },
  },
  '& .MuiInputLabel-root': { color: '#a78bfa' },
});


// Storage key for localStorage persistence
export const DREAM_STORAGE_KEY = 'gothic-dream-journal';

// Emotion tags for categorizing dream feelings
export const emotionTags = [
  'joy', 'fear', 'sadness', 'anger', 'surprise', 'disgust',
  'anticipation', 'trust', 'love', 'grief', 'terror', 'amazement',
  'loathing', 'rage', 'vigilance', 'admiration', 'ecstasy', 'serenity',
  'acceptance', 'apprehension', 'distraction', 'pensiveness', 'boredom',
  'annoyance', 'interest', 'awe', 'disapproval', 'remorse', 'contempt',
  'aggressiveness', 'optimism', 'submission', 'curiosity', 'confusion',
  'longing', 'nostalgia', 'hope', 'despair', 'relief', 'guilt',
];

// Dream Symbols
const dreamSymbols = [
  { id: 'water', name: 'Water', icon: Waves, color: '#3b82f6', meaning: 'Emotions, subconscious' },
  { id: 'fire', name: 'Fire', icon: Flame, color: '#ef4444', meaning: 'Passion, transformation' },
  { id: 'flying', name: 'Flying', icon: Bird, color: '#8b5cf6', meaning: 'Freedom, ambition' },
  { id: 'falling', name: 'Falling', icon: Mountain, color: '#f59e0b', meaning: 'Loss of control, anxiety' },
  { id: 'death', name: 'Death', icon: Skull, color: '#6b7280', meaning: 'Endings, transformation' },
  { id: 'chase', name: 'Being Chased', icon: Ghost, color: '#ec4899', meaning: 'Avoidance, fear' },
  { id: 'teeth', name: 'Teeth Falling', icon: Sparkles, color: '#f472b6', meaning: 'Insecurity, change' },
  { id: 'house', name: 'House', icon: Home, color: '#10b981', meaning: 'Self, psyche' },
  { id: 'car', name: 'Vehicle', icon: Car, color: '#64748b', meaning: 'Life direction' },
  { id: 'key', name: 'Key', icon: Key, color: '#d4af37', meaning: 'Access, solutions' },
  { id: 'lock', name: 'Lock', icon: Lock, color: '#6366f1', meaning: 'Secrets, barriers' },
  { id: 'crown', name: 'Crown', icon: Crown, color: '#fbbf24', meaning: 'Power, achievement' },
  { id: 'feather', name: 'Feather', icon: Feather, color: '#a78bfa', meaning: 'Spirituality, lightness' },
  { id: 'tree', name: 'Tree', icon: TreePine, color: '#22c55e', meaning: 'Growth, family' },
  { id: 'stranger', name: 'Stranger', icon: User, color: '#94a3b8', meaning: 'Unknown aspects of self' },
  { id: 'family', name: 'Family/Friends', icon: Users, color: '#f97316', meaning: 'Relationships' },
];

export const moonPhases = [
  { id: 'new', name: 'New Moon', description: 'New beginnings, setting intentions' },
  { id: 'waxing-crescent', name: 'Waxing Crescent', description: 'Growth, building momentum' },
  { id: 'first-quarter', name: 'First Quarter', description: 'Decision time, taking action' },
  { id: 'waxing-gibbous', name: 'Waxing Gibbous', description: 'Refinement, patience' },
  { id: 'full', name: 'Full Moon', description: 'Culmination, revelation, heightened emotions' },
  { id: 'waning-gibbous', name: 'Waning Gibbous', description: 'Gratitude, sharing wisdom' },
  { id: 'last-quarter', name: 'Last Quarter', description: 'Release, letting go' },
  { id: 'waning-crescent', name: 'Waning Crescent', description: 'Rest, reflection, surrender' },
];

export const dreamMoods = [
  { id: 'peaceful', name: 'Peaceful', color: '#22c55e' },
  { id: 'anxious', name: 'Anxious', color: '#f59e0b' },
  { id: 'nightmare', name: 'Nightmare', color: '#ef4444' },
  { id: 'prophetic', name: 'Prophetic', color: '#d4af37' },
  { id: 'lucid', name: 'Lucid', color: '#3b82f6' },
  { id: 'confusing', name: 'Confusing', color: '#8b5cf6' },
  { id: 'nostalgic', name: 'Nostalgic', color: '#ec4899' },
];

export interface DreamEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  moonPhase: string;
  mood: string;
  symbols: string[];
  tags: string[];
  clarity: number; // 1-5
  recurring: boolean;
}

// Get current moon phase (simplified calculation)
export const getMoonPhase = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09;
  const phase = jd / 29.53;
  const phaseDay = Math.floor((phase - Math.floor(phase)) * 29.53);

  if (phaseDay < 1) return 'new';
  if (phaseDay < 7) return 'waxing-crescent';
  if (phaseDay < 8) return 'first-quarter';
  if (phaseDay < 14) return 'waxing-gibbous';
  if (phaseDay < 16) return 'full';
  if (phaseDay < 22) return 'waning-gibbous';
  if (phaseDay < 23) return 'last-quarter';
  return 'waning-crescent';
};

// Sample dreams
const sampleDreams: DreamEntry[] = [
  {
    id: '1',
    date: '2024-12-25',
    title: 'Flight Over Ancient City',
    content: 'I was soaring over an ancient city with golden spires. The streets were filled with people in flowing robes. A voice called my name from below...',
    moonPhase: 'full',
    mood: 'prophetic',
    symbols: ['flying', 'crown', 'stranger'],
    tags: ['vivid', 'spiritual', 'ancestor'],
    clarity: 5,
    recurring: false,
  },
  {
    id: '2',
    date: '2024-12-20',
    title: 'The Locked Door',
    content: 'I kept finding doors that were locked. Each key I tried would dissolve in my hands. Finally, I realized I could walk through the walls instead.',
    moonPhase: 'waning-gibbous',
    mood: 'lucid',
    symbols: ['key', 'lock', 'house'],
    tags: ['problem-solving', 'breakthrough'],
    clarity: 4,
    recurring: true,
  },
  {
    id: '3',
    date: '2024-12-15',
    title: 'Ocean of Stars',
    content: 'The ocean had become filled with stars instead of water. I swam through constellations, breathing light instead of air.',
    moonPhase: 'new',
    mood: 'peaceful',
    symbols: ['water', 'flying', 'feather'],
    tags: ['cosmic', 'peaceful', 'transformation'],
    clarity: 5,
    recurring: false,
  },
];

export const DreamJournal: React.FC = () => {
  const [dreams, setDreams] = useState<DreamEntry[]>(sampleDreams);
  const [selectedDream, setSelectedDream] = useState<DreamEntry | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newDreamOpen, setNewDreamOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  // New dream form state
  const [newDream, setNewDream] = useState<Partial<DreamEntry>>({
    title: '',
    content: '',
    mood: 'peaceful',
    symbols: [],
    tags: [],
    clarity: 3,
    recurring: false,
    moonPhase: getMoonPhase(),
    date: new Date().toISOString().split('T')[0],
  });
  const [newTag, setNewTag] = useState('');

  const currentMoonPhase = getMoonPhase();
  const currentPhaseInfo = moonPhases.find(p => p.id === currentMoonPhase) || moonPhases[0];

  const filteredDreams = useMemo(() => {
    return dreams.filter(dream => {
      const matchesSearch = dream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dream.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMood = filterMood === 'all' || dream.mood === filterMood;
      return matchesSearch && matchesMood;
    });
  }, [dreams, searchQuery, filterMood]);

  const symbolStats = useMemo(() => {
    const stats: Record<string, number> = {};
    dreams.forEach(dream => {
      dream.symbols.forEach(symbol => {
        stats[symbol] = (stats[symbol] || 0) + 1;
      });
    });
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [dreams]);

  const toggleSymbol = (symbolId: string) => {
    setNewDream(prev => ({
      ...prev,
      symbols: prev.symbols?.includes(symbolId)
        ? prev.symbols.filter(s => s !== symbolId)
        : [...(prev.symbols || []), symbolId],
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !newDream.tags?.includes(newTag.trim())) {
      setNewDream(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const saveDream = () => {
    if (newDream.title && newDream.content) {
      const dream: DreamEntry = {
        id: Date.now().toString(),
        date: newDream.date || new Date().toISOString().split('T')[0],
        title: newDream.title,
        content: newDream.content,
        moonPhase: newDream.moonPhase || currentMoonPhase,
        mood: newDream.mood || 'peaceful',
        symbols: newDream.symbols || [],
        tags: newDream.tags || [],
        clarity: newDream.clarity || 3,
        recurring: newDream.recurring || false,
      };
      setDreams(prev => [dream, ...prev]);
      setNewDreamOpen(false);
      setNewDream({
        title: '',
        content: '',
        mood: 'peaceful',
        symbols: [],
        tags: [],
        clarity: 3,
        recurring: false,
        moonPhase: getMoonPhase(),
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const getSymbolInfo = (symbolId: string) => {
    return dreamSymbols.find(s => s.id === symbolId);
  };

  const getMoodColor = (moodId: string) => {
    return dreamMoods.find(m => m.id === moodId)?.color || '#8b5cf6';
  };

  return (
    <JournalContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
        <GothicTitle variant="h3">Dream Journal</GothicTitle>
        <Typography sx={{ color: '#a78bfa', fontSize: '1.1rem' }}>
          Record, analyze, and understand your dreams
        </Typography>
      </Box>

      {/* Moon Phase Card */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <MoonPhaseCard phase={currentMoonPhase.includes('full') ? 'full' : currentMoonPhase.includes('new') ? 'new' : 'other'}>
          <MoonIcon phase={currentMoonPhase.includes('full') ? 'full' : currentMoonPhase.includes('new') ? 'new' : currentMoonPhase.includes('waxing') ? 'waxing' : 'waning'} />
          <Typography sx={{ color: '#e9d5ff', fontWeight: 700, fontSize: '1.2rem', mb: 0.5 }}>
            {currentPhaseInfo.name}
          </Typography>
          <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem' }}>
            {currentPhaseInfo.description}
          </Typography>
          <Typography sx={{ color: '#6366f1', fontSize: '0.8rem', mt: 1 }}>
            Dreams during this phase often involve: {currentMoonPhase.includes('full') ? 'vivid imagery, emotional intensity' : 'new beginnings, introspection'}
          </Typography>
        </MoonPhaseCard>
      </Box>

      {/* Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setNewDreamOpen(true)}
          sx={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            px: 4,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': { background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' },
          }}
        >
          Record Dream
        </Button>
        <Button
          variant="outlined"
          startIcon={<Mic size={18} />}
          sx={{
            borderColor: 'rgba(139, 92, 246, 0.5)',
            color: '#a78bfa',
            px: 3,
            borderRadius: '12px',
            '&:hover': { borderColor: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' },
          }}
        >
          Voice Record
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            '& .MuiTab-root': { color: '#a78bfa' },
            '& .Mui-selected': { color: '#8b5cf6' },
            '& .MuiTabs-indicator': { background: '#8b5cf6' },
          }}
        >
          <Tab icon={<Book size={18} />} label="Journal" iconPosition="start" />
          <Tab icon={<TrendingUp size={18} />} label="Patterns" iconPosition="start" />
          <Tab icon={<Tag size={18} />} label="Symbols" iconPosition="start" />
        </Tabs>
      </Box>

      {/* Journal Tab */}
      {tabValue === 0 && (
        <>
          {/* Search and Filter */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <TextField
              placeholder="Search dreams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: <Search size={18} color="#8b5cf6" style={{ marginRight: 8 }} />,
              }}
              sx={{
                width: 300,
                '& .MuiOutlinedInput-root': {
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '10px',
                  color: '#e9d5ff',
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                sx={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '10px',
                  color: '#e9d5ff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                }}
              >
                <MenuItem value="all">All Moods</MenuItem>
                {dreamMoods.map(mood => (
                  <MenuItem key={mood.id} value={mood.id}>{mood.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Dreams Grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 3,
            position: 'relative',
            zIndex: 1,
          }}>
            {filteredDreams.map((dream) => (
              <Fade in key={dream.id}>
                <DreamCard
                  mood={dream.mood}
                  onClick={() => { setSelectedDream(dream); setDetailOpen(true); }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography sx={{ color: '#e9d5ff', fontWeight: 700, fontSize: '1.1rem', mb: 0.5 }}>
                          {dream.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calendar size={12} color="#a78bfa" />
                          <Typography sx={{ color: '#a78bfa', fontSize: '0.8rem' }}>
                            {new Date(dream.date).toLocaleDateString()}
                          </Typography>
                          <Moon size={12} color="#6366f1" />
                          <Typography sx={{ color: '#6366f1', fontSize: '0.8rem' }}>
                            {moonPhases.find(p => p.id === dream.moonPhase)?.name}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={dreamMoods.find(m => m.id === dream.mood)?.name}
                        size="small"
                        sx={{
                          background: `${getMoodColor(dream.mood)}20`,
                          color: getMoodColor(dream.mood),
                          border: `1px solid ${getMoodColor(dream.mood)}40`,
                        }}
                      />
                    </Box>

                    <Typography sx={{
                      color: '#c4b5fd',
                      fontSize: '0.9rem',
                      lineHeight: 1.5,
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {dream.content}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {dream.symbols.slice(0, 4).map((symbolId) => {
                        const symbol = getSymbolInfo(symbolId);
                        if (!symbol) return null;
                        const SymbolIcon = symbol.icon;
                        return (
                          <Tooltip key={symbolId} title={`${symbol.name}: ${symbol.meaning}`}>
                            <SymbolChip
                              symbolcolor={symbol.color}
                              icon={<SymbolIcon size={14} />}
                              label={symbol.name}
                              size="small"
                            />
                          </Tooltip>
                        );
                      })}
                      {dream.symbols.length > 4 && (
                        <Chip
                          label={`+${dream.symbols.length - 4}`}
                          size="small"
                          sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}
                        />
                      )}
                    </Box>

                    {dream.recurring && (
                      <Chip
                        label="Recurring"
                        size="small"
                        sx={{
                          mt: 1,
                          background: 'rgba(236, 72, 153, 0.2)',
                          color: '#f472b6',
                          border: '1px solid rgba(236, 72, 153, 0.4)',
                        }}
                      />
                    )}
                  </CardContent>
                </DreamCard>
              </Fade>
            ))}
          </Box>
        </>
      )}

      {/* Patterns Tab */}
      {tabValue === 1 && (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography sx={{ color: '#e9d5ff', fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Your Most Common Dream Symbols
          </Typography>

          {symbolStats.map(([symbolId, count]) => {
            const symbol = getSymbolInfo(symbolId);
            if (!symbol) return null;
            const SymbolIcon = symbol.icon;
            return (
              <Box
                key={symbolId}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '12px',
                  mb: 1,
                }}
              >
                <Avatar sx={{ background: `${symbol.color}30` }}>
                  <SymbolIcon size={24} color={symbol.color} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#e9d5ff', fontWeight: 600 }}>{symbol.name}</Typography>
                  <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>{symbol.meaning}</Typography>
                </Box>
                <Chip
                  label={`${count} dreams`}
                  sx={{ background: `${symbol.color}30`, color: symbol.color }}
                />
              </Box>
            );
          })}

          <Box sx={{
            mt: 4,
            p: 3,
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}>
            <Typography sx={{ color: '#e9d5ff', fontWeight: 600, mb: 2 }}>Dream Statistics</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, textAlign: 'center' }}>
              <Box>
                <Typography variant="h4" sx={{ color: '#8b5cf6' }}>{dreams.length}</Typography>
                <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>Total Dreams</Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: '#3b82f6' }}>
                  {dreams.filter(d => d.mood === 'lucid').length}
                </Typography>
                <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>Lucid Dreams</Typography>
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: '#ec4899' }}>
                  {dreams.filter(d => d.recurring).length}
                </Typography>
                <Typography sx={{ color: '#a78bfa', fontSize: '0.85rem' }}>Recurring</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Symbols Tab */}
      {tabValue === 2 && (
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Typography sx={{ color: '#e9d5ff', fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Dream Symbol Dictionary
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 2,
          }}>
            {dreamSymbols.map((symbol) => {
              const SymbolIcon = symbol.icon;
              return (
                <Box
                  key={symbol.id}
                  sx={{
                    p: 2,
                    background: `${symbol.color}10`,
                    border: `1px solid ${symbol.color}30`,
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  <Avatar sx={{ mx: 'auto', mb: 1, background: `${symbol.color}30` }}>
                    <SymbolIcon size={24} color={symbol.color} />
                  </Avatar>
                  <Typography sx={{ color: '#e9d5ff', fontWeight: 600 }}>{symbol.name}</Typography>
                  <Typography sx={{ color: '#a78bfa', fontSize: '0.8rem' }}>{symbol.meaning}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* New Dream Dialog */}
      <Dialog
        open={newDreamOpen}
        onClose={() => setNewDreamOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0a0812 0%, #0d0a1a 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '20px',
          },
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Moon size={24} color="#8b5cf6" />
            <Typography sx={{ color: '#e9d5ff', fontWeight: 600 }}>Record New Dream</Typography>
          </Box>
          <IconButton onClick={() => setNewDreamOpen(false)}>
            <X size={20} color="#8b5cf6" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <StyledTextField
              label="Dream Title"
              value={newDream.title}
              onChange={(e) => setNewDream(prev => ({ ...prev, title: e.target.value }))}
              fullWidth
            />

            <StyledTextField
              label="Describe your dream..."
              value={newDream.content}
              onChange={(e) => setNewDream(prev => ({ ...prev, content: e.target.value }))}
              multiline
              rows={5}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#a78bfa' }}>Mood</InputLabel>
                <Select
                  value={newDream.mood}
                  onChange={(e) => setNewDream(prev => ({ ...prev, mood: e.target.value }))}
                  label="Mood"
                  sx={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    color: '#e9d5ff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  }}
                >
                  {dreamMoods.map(mood => (
                    <MenuItem key={mood.id} value={mood.id}>{mood.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#a78bfa' }}>Clarity (1-5)</InputLabel>
                <Select
                  value={newDream.clarity}
                  onChange={(e) => setNewDream(prev => ({ ...prev, clarity: Number(e.target.value) }))}
                  label="Clarity (1-5)"
                  sx={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    color: '#e9d5ff',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  }}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <MenuItem key={n} value={n}>{n} - {n === 1 ? 'Hazy' : n === 5 ? 'Crystal Clear' : ''}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography sx={{ color: '#a78bfa', mb: 1, fontWeight: 600 }}>Dream Symbols</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {dreamSymbols.map((symbol) => {
                  const SymbolIcon = symbol.icon;
                  const isSelected = newDream.symbols?.includes(symbol.id);
                  return (
                    <Chip
                      key={symbol.id}
                      icon={<SymbolIcon size={14} />}
                      label={symbol.name}
                      onClick={() => toggleSymbol(symbol.id)}
                      sx={{
                        background: isSelected ? `${symbol.color}40` : `${symbol.color}15`,
                        color: symbol.color,
                        border: `1px solid ${isSelected ? symbol.color : `${symbol.color}40`}`,
                        cursor: 'pointer',
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            <Box>
              <Typography sx={{ color: '#a78bfa', mb: 1, fontWeight: 600 }}>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <StyledTextField
                  size="small"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  sx={{ flex: 1 }}
                />
                <IconButton onClick={addTag}>
                  <Plus size={20} color="#8b5cf6" />
                </IconButton>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {newDream.tags?.map((tag, i) => (
                  <Chip
                    key={i}
                    label={tag}
                    onDelete={() => setNewDream(prev => ({
                      ...prev,
                      tags: prev.tags?.filter((_, idx) => idx !== i),
                    }))}
                    sx={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#c4b5fd',
                      '& .MuiChip-deleteIcon': { color: '#a78bfa' },
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Save size={18} />}
              onClick={saveDream}
              disabled={!newDream.title || !newDream.content}
              sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                py: 1.5,
                borderRadius: '12px',
                '&:hover': { background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' },
              }}
            >
              Save Dream
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dream Detail Dialog */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0a0812 0%, #0d0a1a 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '20px',
          },
        }}
      >
        {selectedDream && (
          <>
            <DialogTitle sx={{
              borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Box>
                <Typography sx={{ color: '#e9d5ff', fontWeight: 700, fontSize: '1.3rem' }}>
                  {selectedDream.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 0.5 }}>
                  <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem' }}>
                    {new Date(selectedDream.date).toLocaleDateString()}
                  </Typography>
                  <Chip
                    icon={<Moon size={14} />}
                    label={moonPhases.find(p => p.id === selectedDream.moonPhase)?.name}
                    size="small"
                    sx={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}
                  />
                </Box>
              </Box>
              <IconButton onClick={() => setDetailOpen(false)}>
                <X size={20} color="#8b5cf6" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Typography sx={{ color: '#c4b5fd', lineHeight: 1.8, mb: 3 }}>
                {selectedDream.content}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography sx={{ color: '#a78bfa', fontWeight: 600, mb: 1 }}>Symbols Present</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedDream.symbols.map((symbolId) => {
                    const symbol = getSymbolInfo(symbolId);
                    if (!symbol) return null;
                    const SymbolIcon = symbol.icon;
                    return (
                      <Box
                        key={symbolId}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          background: `${symbol.color}15`,
                          border: `1px solid ${symbol.color}30`,
                          borderRadius: '8px',
                        }}
                      >
                        <SymbolIcon size={16} color={symbol.color} />
                        <Box>
                          <Typography sx={{ color: symbol.color, fontWeight: 600, fontSize: '0.85rem' }}>
                            {symbol.name}
                          </Typography>
                          <Typography sx={{ color: '#a78bfa', fontSize: '0.75rem' }}>
                            {symbol.meaning}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {selectedDream.tags.length > 0 && (
                <Box>
                  <Typography sx={{ color: '#a78bfa', fontWeight: 600, mb: 1 }}>Tags</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedDream.tags.map((tag, i) => (
                      <Chip
                        key={i}
                        label={tag}
                        sx={{
                          background: 'rgba(139, 92, 246, 0.2)',
                          color: '#c4b5fd',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
          </>
        )}
      </Dialog>
    </JournalContainer>
  );
};

export default DreamJournal;
