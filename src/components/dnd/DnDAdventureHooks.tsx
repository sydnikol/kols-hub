import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Sword,
  Shield,
  Users,
  Map,
  Sparkles,
  Bookmark,
  Dice6,
  Search,
  X,
  User,
  UserPlus,
  CheckCircle2,
  Shuffle,
} from 'lucide-react';

// Import D&D data
import dndData from '../../data/dnd_adventure_hooks.json';

// Animations
const diceRoll = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(185, 28, 28, 0.4), 0 0 40px rgba(251, 191, 36, 0.2); }
  50% { box-shadow: 0 0 40px rgba(185, 28, 28, 0.6), 0 0 60px rgba(251, 191, 36, 0.4); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
`;

// Styled components
const PageContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  padding: '24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '400px',
    background: 'radial-gradient(ellipse at center top, rgba(153, 27, 27, 0.3) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
});

const Header = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
  position: 'relative',
  zIndex: 1,
});

const Title = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  background: 'linear-gradient(135deg, #991b1b 0%, #b91c1c 50%, #fbbf24 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  '& svg': {
    animation: `${diceRoll} 3s ease-in-out infinite`,
    color: '#fbbf24',
  },
});

const Subtitle = styled(Typography)({
  color: 'rgba(251, 191, 36, 0.8)',
  fontSize: '1rem',
});

const SearchContainer = styled(Box)({
  maxWidth: '600px',
  margin: '0 auto 24px',
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(26, 16, 40, 0.8)',
    borderRadius: '16px',
    color: '#f0e6ff',
    '& fieldset': {
      borderColor: 'rgba(185, 28, 28, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(185, 28, 28, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#b91c1c',
    },
  },
  '& .MuiInputAdornment-root svg': {
    color: '#fbbf24',
  },
});

const FilterContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '24px',
});

const FilterChip = styled(Chip)<{ selected?: boolean; chipcolor?: string }>(({ selected, chipcolor }) => ({
  backgroundColor: selected ? chipcolor : 'rgba(26, 16, 40, 0.6)',
  color: selected ? '#0a0812' : chipcolor,
  border: `1px solid ${chipcolor}`,
  fontWeight: selected ? 600 : 400,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: selected ? chipcolor : `${chipcolor}20`,
    transform: 'translateY(-2px)',
  },
}));

const StatsPanel = styled(Box)({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '32px',
});

const StatCard = styled(Box)({
  background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.8) 0%, rgba(13, 13, 26, 0.9) 100%)',
  borderRadius: '16px',
  padding: '16px 24px',
  border: '1px solid rgba(185, 28, 28, 0.3)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '140px',
});

const StatNumber = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#fbbf24',
});

const StatLabel = styled(Typography)({
  fontSize: '0.75rem',
  color: 'rgba(251, 191, 36, 0.7)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

const RandomButton = styled(Button)({
  background: 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
  color: '#fbbf24',
  borderRadius: '20px',
  padding: '12px 28px',
  fontWeight: 600,
  marginBottom: '24px',
  border: '1px solid rgba(251, 191, 36, 0.3)',
  animation: `${glow} 2s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)',
    transform: 'scale(1.05)',
    border: '1px solid rgba(251, 191, 36, 0.5)',
  },
});

const AdventureGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
  gap: '20px',
  maxWidth: '1400px',
  margin: '0 auto',
});

const AdventureCard = styled(Card)<{ vibe?: string }>(({ vibe }) => {
  const colors: Record<string, string> = {
    cozy: '#22c55e',
    dark: '#8b5cf6',
    epic: '#ef4444',
    mystery: '#3b82f6',
    'slice-of-life': '#f59e0b',
  };
  const color = colors[vibe || 'mystery'] || colors.mystery;

  return {
    background: 'linear-gradient(145deg, rgba(26, 16, 40, 0.9) 0%, rgba(13, 13, 26, 0.95) 100%)',
    borderRadius: '20px',
    border: `2px solid ${color}30`,
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
      background: `linear-gradient(90deg, ${color}, ${color}80, #fbbf24)`,
    },
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: `0 12px 40px ${color}30, 0 0 20px rgba(251, 191, 36, 0.2)`,
      border: `2px solid ${color}60`,
    },
  };
});

const AdventureTitle = styled(Typography)({
  fontSize: '1.2rem',
  fontWeight: 600,
  color: '#f0e6ff',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const AdventureDescription = styled(Typography)({
  fontSize: '0.875rem',
  color: 'rgba(240, 230, 255, 0.7)',
  lineHeight: 1.5,
  marginBottom: '12px',
});

const BadgeContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '12px',
});

const VibeBadge = styled(Box)<{ vibe?: string }>(({ vibe }) => {
  const colors: Record<string, { bg: string; text: string }> = {
    cozy: { bg: 'rgba(34, 197, 94, 0.2)', text: '#22c55e' },
    dark: { bg: 'rgba(139, 92, 246, 0.2)', text: '#8b5cf6' },
    epic: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
    mystery: { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' },
    'slice-of-life': { bg: 'rgba(245, 158, 11, 0.2)', text: '#f59e0b' },
  };
  const style = colors[vibe || 'mystery'] || colors.mystery;

  return {
    backgroundColor: style.bg,
    color: style.text,
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: `1px solid ${style.text}40`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  };
});

const ModeBadge = styled(Box)<{ mode?: string }>(({ mode }) => {
  const icons: Record<string, any> = {
    solo: User,
    duet: UserPlus,
    group: Users,
  };
  const Icon = icons[mode || 'group'] || Users;

  return {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    color: '#fbbf24',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid rgba(251, 191, 36, 0.4)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  };
});

const SavedBadge = styled(Box)({
  position: 'absolute',
  top: '16px',
  right: '16px',
  backgroundColor: 'rgba(251, 191, 36, 0.2)',
  color: '#fbbf24',
  padding: '6px 10px',
  borderRadius: '10px',
  fontSize: '0.7rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  border: '1px solid rgba(251, 191, 36, 0.4)',
});

const UsedBadge = styled(Box)({
  position: 'absolute',
  top: '16px',
  right: '16px',
  backgroundColor: 'rgba(185, 28, 28, 0.3)',
  color: '#b91c1c',
  padding: '6px 10px',
  borderRadius: '10px',
  fontSize: '0.7rem',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  border: '1px solid rgba(185, 28, 28, 0.5)',
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '2px solid rgba(185, 28, 28, 0.4)',
    maxWidth: '700px',
    width: '100%',
  },
});

const DetailSection = styled(Box)({
  marginBottom: '20px',
});

const DetailTitle = styled(Typography)({
  color: '#fbbf24',
  fontWeight: 600,
  marginBottom: '8px',
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

const DetailText = styled(Typography)({
  color: 'rgba(240, 230, 255, 0.9)',
  fontSize: '0.95rem',
  lineHeight: 1.7,
});

const ListItem = styled(Box)({
  color: 'rgba(240, 230, 255, 0.85)',
  fontSize: '0.9rem',
  lineHeight: 1.6,
  marginBottom: '8px',
  paddingLeft: '20px',
  position: 'relative',
  '&::before': {
    content: '"⚔"',
    position: 'absolute',
    left: 0,
    color: '#fbbf24',
  },
});

// Types
interface AdventureHook {
  id: string;
  title: string;
  mode: string;
  vibe: string;
  description: string;
  setting: string;
  objective: string;
  npcs: string[];
  hooks: string[];
}

// Vibe configuration
const vibes = [
  { id: 'all', name: 'All Vibes', icon: Sparkles, color: '#d4af37' },
  { id: 'cozy', name: 'Cozy', icon: Shield, color: '#22c55e' },
  { id: 'dark', name: 'Dark', icon: Sword, color: '#8b5cf6' },
  { id: 'epic', name: 'Epic', icon: Sword, color: '#ef4444' },
  { id: 'mystery', name: 'Mystery', icon: Map, color: '#3b82f6' },
  { id: 'slice-of-life', name: 'Slice of Life', icon: Shield, color: '#f59e0b' },
];

// Mode configuration
const modes = [
  { id: 'all', name: 'All Modes', icon: Users, color: '#d4af37' },
  { id: 'solo', name: 'Solo', icon: User, color: '#8b5cf6' },
  { id: 'duet', name: 'Duet', icon: UserPlus, color: '#3b82f6' },
  { id: 'group', name: 'Group', icon: Users, color: '#22c55e' },
];

export const DnDAdventureHooks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedAdventure, setSelectedAdventure] = useState<AdventureHook | null>(null);
  const [savedAdventures, setSavedAdventures] = useState<Set<string>>(new Set());
  const [usedAdventures, setUsedAdventures] = useState<Set<string>>(new Set());

  const adventures: AdventureHook[] = dndData.items;

  const filteredAdventures = useMemo(() => {
    return adventures.filter((adventure) => {
      const matchesSearch =
        searchQuery === '' ||
        adventure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adventure.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adventure.setting.toLowerCase().includes(searchQuery.toLowerCase()) ||
        adventure.objective.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesVibe =
        selectedVibe === 'all' || adventure.vibe === selectedVibe;

      const matchesMode =
        selectedMode === 'all' || adventure.mode === selectedMode;

      return matchesSearch && matchesVibe && matchesMode;
    });
  }, [adventures, searchQuery, selectedVibe, selectedMode]);

  const stats = useMemo(() => {
    return {
      total: adventures.length,
      saved: savedAdventures.size,
      used: usedAdventures.size,
      unused: adventures.length - usedAdventures.size,
    };
  }, [adventures, savedAdventures, usedAdventures]);

  const getRandomAdventure = useCallback(() => {
    const available = filteredAdventures.filter((a) => !usedAdventures.has(a.id));
    if (available.length > 0) {
      const random = available[Math.floor(Math.random() * available.length)];
      setSelectedAdventure(random);
    } else if (filteredAdventures.length > 0) {
      const random = filteredAdventures[Math.floor(Math.random() * filteredAdventures.length)];
      setSelectedAdventure(random);
    }
  }, [filteredAdventures, usedAdventures]);

  const toggleSaved = useCallback((adventureId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedAdventures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(adventureId)) {
        newSet.delete(adventureId);
      } else {
        newSet.add(adventureId);
      }
      return newSet;
    });
  }, []);

  const toggleUsed = useCallback((adventureId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUsedAdventures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(adventureId)) {
        newSet.delete(adventureId);
      } else {
        newSet.add(adventureId);
      }
      return newSet;
    });
  }, []);

  const getModeIcon = (mode: string) => {
    const modeConfig = modes.find((m) => m.id === mode);
    return modeConfig ? modeConfig.icon : Users;
  };

  return (
    <PageContainer>
      <Header>
        <Title variant="h1">
          <Dice6 size={40} />
          D&D Adventure Hooks
        </Title>
        <Subtitle>Epic quests, mysterious tales, and cozy adventures for every campaign</Subtitle>
      </Header>

      <StatsPanel>
        <StatCard>
          <Map size={24} color="#fbbf24" />
          <Box>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Adventures</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Bookmark size={24} color="#22c55e" />
          <Box>
            <StatNumber>{stats.saved}</StatNumber>
            <StatLabel>Saved</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <CheckCircle2 size={24} color="#b91c1c" />
          <Box>
            <StatNumber>{stats.used}</StatNumber>
            <StatLabel>Used</StatLabel>
          </Box>
        </StatCard>
        <StatCard>
          <Sparkles size={24} color="#8b5cf6" />
          <Box>
            <StatNumber>{stats.unused}</StatNumber>
            <StatLabel>Unused</StatLabel>
          </Box>
        </StatCard>
      </StatsPanel>

      <Box sx={{ textAlign: 'center' }}>
        <RandomButton onClick={getRandomAdventure} startIcon={<Shuffle size={18} />}>
          Roll for Random Adventure
        </RandomButton>
      </Box>

      <SearchContainer>
        <StyledTextField
          fullWidth
          placeholder="Search adventures, settings, or objectives..."
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

      <Typography
        sx={{
          textAlign: 'center',
          color: '#fbbf24',
          marginBottom: '12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Filter by Vibe
      </Typography>
      <FilterContainer>
        {vibes.map((vibe) => {
          const Icon = vibe.icon;
          return (
            <FilterChip
              key={vibe.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} />
                  {vibe.name}
                </Box>
              }
              selected={selectedVibe === vibe.id}
              chipcolor={vibe.color}
              onClick={() => setSelectedVibe(vibe.id)}
            />
          );
        })}
      </FilterContainer>

      <Typography
        sx={{
          textAlign: 'center',
          color: '#fbbf24',
          marginBottom: '12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Filter by Mode
      </Typography>
      <FilterContainer>
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <FilterChip
              key={mode.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} />
                  {mode.name}
                </Box>
              }
              selected={selectedMode === mode.id}
              chipcolor={mode.color}
              onClick={() => setSelectedMode(mode.id)}
            />
          );
        })}
      </FilterContainer>

      <Typography
        sx={{
          textAlign: 'center',
          color: 'rgba(240, 230, 255, 0.6)',
          marginBottom: '24px',
          fontSize: '0.9rem',
        }}
      >
        Showing {filteredAdventures.length} of {adventures.length} adventure hooks
      </Typography>

      <AdventureGrid>
        {filteredAdventures.map((adventure) => {
          const isSaved = savedAdventures.has(adventure.id);
          const isUsed = usedAdventures.has(adventure.id);
          const ModeIcon = getModeIcon(adventure.mode);

          return (
            <AdventureCard
              key={adventure.id}
              vibe={adventure.vibe}
              onClick={() => setSelectedAdventure(adventure)}
            >
              {isUsed && (
                <UsedBadge>
                  <CheckCircle2 size={12} />
                  Used
                </UsedBadge>
              )}
              {isSaved && !isUsed && (
                <SavedBadge>
                  <Bookmark size={12} fill="#fbbf24" />
                  Saved
                </SavedBadge>
              )}
              <CardContent sx={{ padding: '24px' }}>
                <AdventureTitle>
                  <Sword size={18} color="#fbbf24" />
                  {adventure.title}
                </AdventureTitle>

                <BadgeContainer>
                  <VibeBadge vibe={adventure.vibe}>
                    <Sparkles size={10} />
                    {adventure.vibe}
                  </VibeBadge>
                  <ModeBadge mode={adventure.mode}>
                    <ModeIcon size={10} />
                    {adventure.mode}
                  </ModeBadge>
                </BadgeContainer>

                <AdventureDescription>{adventure.description}</AdventureDescription>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(251, 191, 36, 0.7)', fontSize: '0.8rem' }}>
                  <Map size={14} />
                  {adventure.setting}
                </Box>
              </CardContent>
            </AdventureCard>
          );
        })}
      </AdventureGrid>

      {/* Adventure Detail Dialog */}
      <DialogStyled
        open={!!selectedAdventure}
        onClose={() => setSelectedAdventure(null)}
        maxWidth="md"
      >
        {selectedAdventure && (
          <>
            <DialogTitle
              sx={{
                background: 'linear-gradient(135deg, rgba(153, 27, 27, 0.4) 0%, rgba(185, 28, 28, 0.2) 100%)',
                color: '#f0e6ff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid rgba(251, 191, 36, 0.3)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Dice6 size={24} color="#fbbf24" />
                {selectedAdventure.title}
              </Box>
              <IconButton onClick={() => setSelectedAdventure(null)} sx={{ color: '#f0e6ff' }}>
                <X size={20} />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ padding: '28px' }}>
              <BadgeContainer>
                <VibeBadge vibe={selectedAdventure.vibe}>
                  <Sparkles size={12} />
                  {selectedAdventure.vibe}
                </VibeBadge>
                <ModeBadge mode={selectedAdventure.mode}>
                  {React.createElement(getModeIcon(selectedAdventure.mode), { size: 12 })}
                  {selectedAdventure.mode}
                </ModeBadge>
              </BadgeContainer>

              <DetailSection>
                <DetailTitle>
                  <Sword size={16} />
                  Description
                </DetailTitle>
                <DetailText>{selectedAdventure.description}</DetailText>
              </DetailSection>

              <DetailSection>
                <DetailTitle>
                  <Map size={16} />
                  Setting
                </DetailTitle>
                <DetailText>{selectedAdventure.setting}</DetailText>
              </DetailSection>

              <DetailSection>
                <DetailTitle>
                  <Shield size={16} />
                  Objective
                </DetailTitle>
                <DetailText>{selectedAdventure.objective}</DetailText>
              </DetailSection>

              <DetailSection>
                <DetailTitle>
                  <Users size={16} />
                  NPCs
                </DetailTitle>
                {selectedAdventure.npcs.map((npc, index) => (
                  <ListItem key={index}>{npc}</ListItem>
                ))}
              </DetailSection>

              <DetailSection>
                <DetailTitle>
                  <Sparkles size={16} />
                  Adventure Hooks
                </DetailTitle>
                {selectedAdventure.hooks.map((hook, index) => (
                  <ListItem key={index}>{hook}</ListItem>
                ))}
              </DetailSection>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 28px', borderTop: '2px solid rgba(251, 191, 36, 0.2)' }}>
              <Button
                variant="outlined"
                onClick={(e) => toggleSaved(selectedAdventure.id, e)}
                startIcon={<Bookmark size={18} fill={savedAdventures.has(selectedAdventure.id) ? '#fbbf24' : 'none'} />}
                sx={{
                  borderColor: '#fbbf24',
                  color: '#fbbf24',
                  '&:hover': {
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)'
                  },
                }}
              >
                {savedAdventures.has(selectedAdventure.id) ? 'Saved' : 'Save Adventure'}
              </Button>
              <Button
                variant="contained"
                onClick={(e) => {
                  toggleUsed(selectedAdventure.id, e);
                  setSelectedAdventure(null);
                }}
                startIcon={usedAdventures.has(selectedAdventure.id) ? <X size={18} /> : <CheckCircle2 size={18} />}
                sx={{
                  backgroundColor: usedAdventures.has(selectedAdventure.id) ? '#6b7280' : '#b91c1c',
                  color: usedAdventures.has(selectedAdventure.id) ? '#fff' : '#fbbf24',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: usedAdventures.has(selectedAdventure.id) ? '#4b5563' : '#991b1b',
                  },
                }}
              >
                {usedAdventures.has(selectedAdventure.id) ? 'Mark Unused' : 'Mark as Used'}
              </Button>
            </DialogActions>
          </>
        )}
      </DialogStyled>
    </PageContainer>
  );
};

// Export both named and default
export default DnDAdventureHooks;
