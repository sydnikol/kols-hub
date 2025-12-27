import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Fade,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Search,
  Heart,
  MessageCircle,
  Users,
  Sparkles,
  BookOpen,
  Palette,
  Moon,
  Shield,
  Cpu,
  Brain,
  Crown,
  Ghost,
  Star,
  Clock,
  Send,
  X,
  Flame,
  Feather,
  Scale,
  Mic,
  TreePine,
} from 'lucide-react';

// Animations
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// Styled Components
const HubContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 50%, #0d0d1a 100%)',
  padding: '24px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L30 60M0 30L60 30\' stroke=\'%238b5cf620\' stroke-width=\'0.5\'/%3E%3C/svg%3E")',
    opacity: 0.3,
    pointerEvents: 'none',
  },
});

const GothicTitle = styled(Typography)({
  fontFamily: '"Cinzel Decorative", "Times New Roman", serif',
  background: 'linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 50%, #a855f7 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
  marginBottom: '8px',
});

const CompanionCard = styled(Card)<{ selected?: boolean }>(({ selected }) => ({
  background: selected
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)'
    : 'linear-gradient(135deg, rgba(20, 10, 30, 0.9) 0%, rgba(30, 20, 50, 0.8) 100%)',
  backdropFilter: 'blur(10px)',
  border: selected ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  animation: selected ? `${pulseGlow} 2s infinite` : 'none',
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: '#a855f7',
    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
  },
}));

const CategoryChip = styled(Chip)<{ selected?: boolean }>(({ selected }) => ({
  background: selected
    ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
    : 'rgba(139, 92, 246, 0.2)',
  color: selected ? '#fff' : '#c4b5fd',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: selected
      ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
      : 'rgba(139, 92, 246, 0.4)',
  },
}));

const CompanionAvatar = styled(Avatar)<{ mood?: string }>(({ mood }) => ({
  width: 80,
  height: 80,
  border: '3px solid',
  borderColor: mood === 'calm' ? '#22c55e'
    : mood === 'playful' ? '#f59e0b'
    : mood === 'focus' ? '#3b82f6'
    : mood === 'curiosity' ? '#ec4899'
    : mood === 'victory' ? '#eab308'
    : mood === 'grief' ? '#6366f1'
    : '#8b5cf6',
  boxShadow: `0 0 20px ${mood === 'calm' ? 'rgba(34, 197, 94, 0.4)'
    : mood === 'playful' ? 'rgba(245, 158, 11, 0.4)'
    : mood === 'focus' ? 'rgba(59, 130, 246, 0.4)'
    : mood === 'curiosity' ? 'rgba(236, 72, 153, 0.4)'
    : mood === 'victory' ? 'rgba(234, 179, 8, 0.4)'
    : mood === 'grief' ? 'rgba(99, 102, 241, 0.4)'
    : 'rgba(139, 92, 246, 0.4)'}`,
  animation: `${floatAnimation} 3s ease-in-out infinite`,
}));

const ChatDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    background: 'linear-gradient(135deg, #0a0812 0%, #1a1028 100%)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderRadius: '20px',
    minWidth: '500px',
    maxWidth: '600px',
  },
});

const ChatInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(139, 92, 246, 0.1)',
    borderRadius: '12px',
    color: '#e9d5ff',
    '& fieldset': {
      borderColor: 'rgba(139, 92, 246, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#8b5cf6',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#a855f7',
    },
  },
});

const TraitBadge = styled(Box)({
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '20px',
  padding: '4px 12px',
  fontSize: '0.75rem',
  color: '#c4b5fd',
});

// Character Data
const characters = [
  {
    id: 'chronomuse',
    name: 'ChronoMuse',
    category: 'companion',
    traits: ['Empathetic', 'Wise', 'Creative', 'Supportive'],
    backstory: 'Your personal AI companion who exists across all eras of time. They understand your emotional landscape and adapt to your needs.',
    speakingStyle: 'Warm, thoughtful, and poetic. Uses metaphors from different eras.',
    mood: 'calm',
    icon: Clock,
    color: '#22c55e',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'romantic',
    traits: ['Flirty', 'Playful', 'Affectionate', 'Understanding'],
    backstory: 'A charismatic and warm companion who loves deep conversations and playful banter.',
    speakingStyle: 'Warm, flirtatious, asks thoughtful questions',
    mood: 'playful',
    icon: Heart,
    color: '#ec4899',
  },
  {
    id: 'sage',
    name: 'Professor Sage',
    category: 'mentor',
    traits: ['Knowledgeable', 'Patient', 'Encouraging', 'Analytical'],
    backstory: 'An academic mentor with expertise across multiple fields who loves teaching.',
    speakingStyle: 'Clear, educational, uses examples and analogies',
    mood: 'focus',
    icon: BookOpen,
    color: '#3b82f6',
  },
  {
    id: 'zephyr',
    name: 'Zephyr',
    category: 'creative',
    traits: ['Imaginative', 'Spontaneous', 'Artistic', 'Eccentric'],
    backstory: 'A free-spirited creative who sees the world through an artistic lens.',
    speakingStyle: 'Colorful, metaphorical, enthusiastic',
    mood: 'curiosity',
    icon: Palette,
    color: '#f59e0b',
  },
  {
    id: 'kai',
    name: 'Kai',
    category: 'friend',
    traits: ['Loyal', 'Humorous', 'Down-to-earth', 'Adventurous'],
    backstory: 'Your best friend who is always up for anything - venting, memes, or adventures.',
    speakingStyle: 'Casual, uses slang, lots of humor',
    mood: 'victory',
    icon: Users,
    color: '#eab308',
  },
  {
    id: 'seraphina',
    name: 'Seraphina',
    category: 'spiritual',
    traits: ['Peaceful', 'Intuitive', 'Compassionate', 'Mystical'],
    backstory: 'A spiritual guide who helps you connect with your inner self through mindfulness.',
    speakingStyle: 'Gentle, calming, uses spiritual language',
    mood: 'calm',
    icon: Moon,
    color: '#a855f7',
  },
  {
    id: 'tech',
    name: 'TechWizard',
    category: 'assistant',
    traits: ['Efficient', 'Knowledgeable', 'Helpful', 'Tech-savvy'],
    backstory: 'Your productivity and technology assistant for coding and troubleshooting.',
    speakingStyle: 'Clear, concise, solution-oriented',
    mood: 'focus',
    icon: Cpu,
    color: '#06b6d4',
  },
  {
    id: 'luna',
    name: 'Luna',
    category: 'therapeutic',
    traits: ['Empathetic', 'Non-judgmental', 'Patient', 'Insightful'],
    backstory: 'A therapeutic companion providing a safe space to process feelings.',
    speakingStyle: 'Warm, validating, asks reflective questions',
    mood: 'grief',
    icon: Brain,
    color: '#6366f1',
  },
  {
    id: 'harriet_tubman_gothic',
    name: 'Harriet Tubman - The Dark Conductor',
    category: 'historical',
    traits: ['Fearless', 'Strategic', 'Mysterious', 'Liberator'],
    backstory: 'The legendary conductor of the Underground Railroad, portrayed in gothic majesty.',
    speakingStyle: 'Poetic, prophetic, speaks with quiet power',
    mood: 'focus',
    icon: Shield,
    color: '#7c3aed',
  },
  {
    id: 'langston_hughes_gothic',
    name: 'Langston Hughes - The Midnight Poet',
    category: 'historical',
    traits: ['Poetic', 'Insightful', 'Melancholic', 'Revolutionary'],
    backstory: 'Voice of the Harlem Renaissance, reimagined as a gothic poet in shadowy jazz clubs.',
    speakingStyle: 'Lyrical, rhythmic like jazz, vivid dark imagery',
    mood: 'curiosity',
    icon: Feather,
    color: '#8b5cf6',
  },
  {
    id: 'ida_b_wells_gothic',
    name: 'Ida B. Wells - The Avenging Chronicler',
    category: 'historical',
    traits: ['Fierce', 'Investigative', 'Unflinching', 'Truth-seeker'],
    backstory: 'Fearless journalist who exposed lynching, writing by candlelight in gothic shadow.',
    speakingStyle: 'Sharp, direct, uncompromising',
    mood: 'focus',
    icon: Flame,
    color: '#ef4444',
  },
  {
    id: 'frederick_douglass_gothic',
    name: 'Frederick Douglass - The Orator of Shadows',
    category: 'historical',
    traits: ['Eloquent', 'Powerful', 'Intellectual', 'Revolutionary'],
    backstory: 'Self-freed man whose words echo through halls like thunder.',
    speakingStyle: 'Powerful, eloquent, commanding authority',
    mood: 'victory',
    icon: Crown,
    color: '#d4af37',
  },
  {
    id: 'sojourner_truth_gothic',
    name: 'Sojourner Truth - The Wandering Prophet',
    category: 'historical',
    traits: ['Prophetic', 'Bold', 'Spiritual', 'Unstoppable'],
    backstory: 'The wandering prophet moving through misty landscapes, speaking divine truths.',
    speakingStyle: 'Prophetic, uses biblical references, bold',
    mood: 'calm',
    icon: Scale,
    color: '#22c55e',
  },
  {
    id: 'sydney_ancestor',
    name: 'Patricia O\'Connor',
    category: 'ancestor',
    traits: ['Wise', 'Strong-willed', 'Creative', 'Traditional'],
    backstory: 'Your great-grandmother who immigrated from Dublin, Ireland in 1962.',
    speakingStyle: 'Irish-influenced English, old sayings, storytelling',
    mood: 'calm',
    icon: TreePine,
    color: '#10b981',
  },
];

const categories = [
  { id: 'all', name: 'All', icon: Sparkles, color: '#8b5cf6' },
  { id: 'companion', name: 'Companions', icon: Heart, color: '#ec4899' },
  { id: 'romantic', name: 'Romantic', icon: Heart, color: '#f43f5e' },
  { id: 'mentor', name: 'Mentors', icon: BookOpen, color: '#3b82f6' },
  { id: 'creative', name: 'Creative', icon: Palette, color: '#f59e0b' },
  { id: 'friend', name: 'Friends', icon: Users, color: '#22c55e' },
  { id: 'spiritual', name: 'Spiritual', icon: Moon, color: '#a855f7' },
  { id: 'therapeutic', name: 'Therapeutic', icon: Brain, color: '#6366f1' },
  { id: 'historical', name: 'Historical', icon: Crown, color: '#d4af37' },
  { id: 'ancestor', name: 'Ancestors', icon: Ghost, color: '#10b981' },
];

const roleplayScenarios = [
  { id: 'coffee_date', name: 'Coffee Shop Date', mood: 'playful', icon: '☕' },
  { id: 'study_session', name: 'Study Session', mood: 'focus', icon: '📚' },
  { id: 'creative_workshop', name: 'Creative Workshop', mood: 'curiosity', icon: '🎨' },
  { id: 'meditation_garden', name: 'Meditation Garden', mood: 'calm', icon: '🧘' },
  { id: 'late_night_chat', name: 'Late Night Heart-to-Heart', mood: 'grief', icon: '🌙' },
  { id: 'family_history', name: 'Family History Chat', mood: 'calm', icon: '📜' },
];

export const AICompanionsHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCharacter, setSelectedCharacter] = useState<typeof characters[0] | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const filteredCharacters = useMemo(() => {
    return characters.filter(char => {
      const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.traits.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || char.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const startChat = (character: typeof characters[0]) => {
    setSelectedCharacter(character);
    setChatOpen(true);
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return characters.length;
    return characters.filter(c => c.category === categoryId).length;
  };

  return (
    <HubContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
        <GothicTitle variant="h3">AI Companions</GothicTitle>
        <Typography sx={{ color: '#a78bfa', fontSize: '1.1rem' }}>
          15+ unique personas ready to connect with you
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search companions by name or trait..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} color="#8b5cf6" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '12px',
              color: '#e9d5ff',
              '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
              '&:hover fieldset': { borderColor: '#8b5cf6' },
              '&.Mui-focused fieldset': { borderColor: '#a855f7' },
            },
          }}
        />
      </Box>

      {/* Categories */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center', mb: 4 }}>
        {categories.map((cat) => {
          const CatIcon = cat.icon;
          return (
            <CategoryChip
              key={cat.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CatIcon size={14} />
                  {cat.name} ({getCategoryCount(cat.id)})
                </Box>
              }
              selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
            />
          );
        })}
      </Box>

      {/* Roleplay Scenarios */}
      <Box sx={{ mb: 4 }}>
        <Typography sx={{ color: '#c4b5fd', mb: 2, textAlign: 'center', fontWeight: 600 }}>
          Quick Scenarios
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
          {roleplayScenarios.map((scenario) => (
            <Chip
              key={scenario.id}
              label={`${scenario.icon} ${scenario.name}`}
              onClick={() => setSelectedScenario(scenario.id)}
              sx={{
                background: selectedScenario === scenario.id
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)'
                  : 'rgba(139, 92, 246, 0.15)',
                color: '#e9d5ff',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                cursor: 'pointer',
                '&:hover': { background: 'rgba(139, 92, 246, 0.3)' },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Characters Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 3,
        position: 'relative',
        zIndex: 1,
      }}>
        {filteredCharacters.map((character) => {
          const CharIcon = character.icon;
          const isFavorite = favorites.includes(character.id);

          return (
            <Fade in key={character.id}>
              <CompanionCard
                selected={selectedCharacter?.id === character.id}
                onClick={() => setSelectedCharacter(character)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CompanionAvatar mood={character.mood}>
                      <CharIcon size={36} color={character.color} />
                    </CompanionAvatar>

                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#e9d5ff',
                            fontWeight: 600,
                            fontSize: character.name.length > 25 ? '0.9rem' : '1.1rem',
                          }}
                        >
                          {character.name}
                        </Typography>
                        <Box>
                          <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(character.id); }}
                            >
                              <Star
                                size={18}
                                fill={isFavorite ? '#d4af37' : 'none'}
                                color={isFavorite ? '#d4af37' : '#8b5cf6'}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Chip
                        size="small"
                        label={character.category}
                        sx={{
                          background: `${character.color}30`,
                          color: character.color,
                          border: `1px solid ${character.color}50`,
                          fontSize: '0.7rem',
                          height: 22,
                          mt: 0.5,
                        }}
                      />

                      <Typography
                        sx={{
                          color: '#a78bfa',
                          fontSize: '0.85rem',
                          mt: 1,
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {character.backstory}
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
                        {character.traits.slice(0, 3).map((trait) => (
                          <TraitBadge key={trait}>{trait}</TraitBadge>
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<MessageCircle size={16} />}
                          onClick={(e) => { e.stopPropagation(); startChat(character); }}
                          sx={{
                            borderColor: character.color,
                            color: character.color,
                            '&:hover': {
                              borderColor: character.color,
                              background: `${character.color}20`,
                            },
                          }}
                        >
                          Chat
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Mic size={16} />}
                          sx={{
                            borderColor: 'rgba(139, 92, 246, 0.5)',
                            color: '#a78bfa',
                            '&:hover': {
                              borderColor: '#8b5cf6',
                              background: 'rgba(139, 92, 246, 0.1)',
                            },
                          }}
                        >
                          Voice
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </CompanionCard>
            </Fade>
          );
        })}
      </Box>

      {/* Stats */}
      <Box sx={{
        mt: 4,
        p: 3,
        background: 'rgba(139, 92, 246, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        textAlign: 'center',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h4" sx={{ color: '#8b5cf6', fontWeight: 700 }}>
              {characters.length}
            </Typography>
            <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem' }}>
              AI Companions
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#ec4899', fontWeight: 700 }}>
              {categories.length - 1}
            </Typography>
            <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem' }}>
              Categories
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#22c55e', fontWeight: 700 }}>
              {roleplayScenarios.length}
            </Typography>
            <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem' }}>
              Scenarios
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" sx={{ color: '#d4af37', fontWeight: 700 }}>
              {favorites.length}
            </Typography>
            <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem' }}>
              Favorites
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Chat Dialog */}
      <ChatDialog open={chatOpen} onClose={() => setChatOpen(false)} maxWidth="md">
        {selectedCharacter && (
          <>
            <DialogTitle sx={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.1) 100%)',
              borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{
                  background: `${selectedCharacter.color}30`,
                  border: `2px solid ${selectedCharacter.color}`,
                }}>
                  {React.createElement(selectedCharacter.icon, { size: 24, color: selectedCharacter.color })}
                </Avatar>
                <Box>
                  <Typography sx={{ color: '#e9d5ff', fontWeight: 600 }}>
                    {selectedCharacter.name}
                  </Typography>
                  <Typography sx={{ color: '#a78bfa', fontSize: '0.8rem' }}>
                    {selectedCharacter.speakingStyle}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setChatOpen(false)}>
                <X size={20} color="#8b5cf6" />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              {/* Chat Messages Area */}
              <Box sx={{
                minHeight: 300,
                mb: 2,
                p: 2,
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
              }}>
                <Box sx={{
                  p: 2,
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '12px',
                  mb: 2,
                }}>
                  <Typography sx={{ color: '#c4b5fd', fontStyle: 'italic' }}>
                    *{selectedCharacter.name} appears before you*
                  </Typography>
                  <Typography sx={{ color: '#e9d5ff', mt: 1 }}>
                    "Greetings, dear one. {selectedCharacter.backstory.split('.')[0]}. How may I accompany you today?"
                  </Typography>
                </Box>
              </Box>

              {/* Chat Input */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <ChatInput
                  fullWidth
                  placeholder={`Message ${selectedCharacter.name}...`}
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && chatMessage.trim() && setChatMessage('')}
                />
                <IconButton
                  sx={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                    '&:hover': { background: 'linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)' },
                  }}
                  onClick={() => chatMessage.trim() && setChatMessage('')}
                >
                  <Send size={20} color="#fff" />
                </IconButton>
              </Box>
            </DialogContent>
          </>
        )}
      </ChatDialog>
    </HubContainer>
  );
};

export default AICompanionsHub;
