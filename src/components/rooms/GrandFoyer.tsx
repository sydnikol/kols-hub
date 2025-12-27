// Grand Foyer Room Component
// Welcome dashboard and navigation hub for the Gothic Dollhouse

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Home, Calendar, Bell, Sun, Moon, CloudMoon, Sparkles,
  Heart, Brain, Wallet, Music, Book, Palette, Ghost,
  ChevronRight, Clock, Star, Flame, Shirt, Utensils,
  Gamepad2, Flower2, PawPrint, Users
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import historicalFigures from '../../data/historical_figures.json';

const candleFlicker = keyframes`
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.9; filter: brightness(0.95); }
`;

const gentleFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 50%, #0a0a0f 100%)',
  padding: '32px',
  position: 'relative',
  overflow: 'hidden',

  // Ambient candle glow
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(255, 200, 100, 0.1) 0%, transparent 70%)',
    animation: `${candleFlicker} 3s ease-in-out infinite`,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '20%',
    right: '10%',
    width: '150px',
    height: '150px',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
    animation: `${candleFlicker} 4s ease-in-out infinite`,
    animationDelay: '1s',
    pointerEvents: 'none',
  },
});

const WelcomeSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
});

const GreetingText = styled(Typography)({
  fontFamily: '"Playfair Display", serif',
  fontSize: '3.5rem',
  fontWeight: 400,
  color: '#e0e0e0',
  marginBottom: '8px',
  textShadow: '0 0 40px rgba(139, 92, 246, 0.3)',
});

const SubGreeting = styled(Typography)({
  fontSize: '1.2rem',
  color: '#a08060',
  fontStyle: 'italic',
  marginBottom: '16px',
});

const TimeDisplay = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 24px',
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '50px',
  border: '1px solid rgba(212, 175, 55, 0.3)',
});

const QuickAccessGrid = styled(Grid)({
  marginBottom: '48px',
});

const QuickAccessCard = styled(GothicCard)<{ accentColor: string }>(({ accentColor }) => ({
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
    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
  },

  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${accentColor}30`,

    '& .icon-wrapper': {
      animation: `${gentleFloat} 2s ease-in-out infinite`,
      background: `${accentColor}30`,
    },
  },
}));

const IconWrapper = styled(Box)<{ color: string }>(({ color }) => ({
  width: '56px',
  height: '56px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `${color}20`,
  color: color,
  marginBottom: '16px',
  transition: 'all 0.3s ease',
}));

const CardTitle = styled(Typography)({
  fontFamily: '"Playfair Display", serif',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: '#e0e0e0',
  marginBottom: '8px',
});

const CardDescription = styled(Typography)({
  fontSize: '0.9rem',
  color: '#888888',
  lineHeight: 1.6,
});

const DailyWisdomCard = styled(GothicCard)({
  background: 'linear-gradient(135deg, rgba(124, 45, 18, 0.2) 0%, rgba(20, 20, 30, 0.9) 100%)',
  border: '1px solid rgba(212, 175, 55, 0.3)',
  position: 'relative',
  overflow: 'hidden',

  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 4s infinite`,
    pointerEvents: 'none',
  },
});

const WisdomQuote = styled(Typography)({
  fontFamily: '"Playfair Display", serif',
  fontSize: '1.3rem',
  fontStyle: 'italic',
  color: '#d4af37',
  lineHeight: 1.8,
  marginBottom: '16px',
});

const WisdomSource = styled(Typography)({
  fontSize: '0.9rem',
  color: '#a08060',
});

const MoodSection = styled(Box)({
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginBottom: '48px',
});

const MoodButton = styled(Box)<{ selected?: boolean; moodColor: string }>(({ selected, moodColor }) => ({
  padding: '16px 24px',
  borderRadius: '12px',
  background: selected ? `${moodColor}30` : 'rgba(20, 20, 30, 0.6)',
  border: `2px solid ${selected ? moodColor : 'transparent'}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',

  '&:hover': {
    background: `${moodColor}20`,
    borderColor: moodColor,
  },
}));

const SectionTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '1.5rem',
  color: '#d4af37',
  letterSpacing: '0.1em',
  marginBottom: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',

  '&::after': {
    content: '""',
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.5), transparent)',
  },
});

interface RoomChangeHandler {
  onRoomChange?: (roomId: string) => void;
}

export const GrandFoyer: React.FC<RoomChangeHandler> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [currentMood, setCurrentMood] = useState<string | null>(null);

  // Get random daily wisdom from historical figures
  const dailyWisdom = useMemo(() => {
    const figures = (historicalFigures as any).figures || [];
    const figuresWithQuotes = figures.filter((f: any) => f.quotes && f.quotes.length > 0);
    if (figuresWithQuotes.length === 0) return { quote: "Every journey begins with a single step.", source: "Ancient Wisdom" };

    // Use date as seed for consistent daily quote
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const figureIndex = seed % figuresWithQuotes.length;
    const figure = figuresWithQuotes[figureIndex];
    const quoteIndex = seed % figure.quotes.length;

    return {
      quote: figure.quotes[quoteIndex],
      source: `${figure.name}, ${figure.gothicTitle}`,
    };
  }, []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return { text: 'Good Morning', icon: <Sun size={24} color="#f59e0b" /> };
    if (hour >= 12 && hour < 17) return { text: 'Good Afternoon', icon: <Sun size={24} color="#fb923c" /> };
    if (hour >= 17 && hour < 21) return { text: 'Good Evening', icon: <CloudMoon size={24} color="#8b5cf6" /> };
    return { text: 'Good Night', icon: <Moon size={24} color="#6366f1" /> };
  };

  const timeOfDay = getTimeOfDay();
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const quickAccessItems = [
    { id: 'ancestor-hall', title: 'Ancestor Hall', description: 'Connect with historical spirits', icon: <Ghost size={28} />, color: '#7c2d12', roomId: 'ancestor-hall' },
    { id: 'wardrobe-palace', title: 'Wardrobe Palace', description: 'Your virtual closet', icon: <Shirt size={28} />, color: '#8b5cf6', roomId: 'wardrobe-palace' },
    { id: 'office-hub', title: 'Finance Hub', description: 'Review your treasury', icon: <Wallet size={28} />, color: '#10b981', roomId: 'office-hub' },
    { id: 'library-study', title: 'Library Study', description: 'Continue your studies', icon: <Book size={28} />, color: '#84cc16', roomId: 'library-study' },
    { id: 'music-room', title: 'Music Room', description: 'Your personal concert', icon: <Music size={28} />, color: '#a855f7', roomId: 'music-room' },
    { id: 'apothecary', title: 'The Apothecary', description: 'Spiritual practices', icon: <Sparkles size={28} />, color: '#dc2626', roomId: 'apothecary' },
    { id: 'gaming-den', title: 'Gaming Den', description: 'D&D and adventures', icon: <Gamepad2 size={28} />, color: '#a855f7', roomId: 'gaming-den' },
    { id: 'creative-studio', title: 'Creative Studio', description: 'Express your creativity', icon: <Palette size={28} />, color: '#ec4899', roomId: 'creative-studio' },
    { id: 'kitchen-lab', title: 'Kitchen Lab', description: 'Recipes and potions', icon: <Utensils size={28} />, color: '#f97316', roomId: 'kitchen-lab' },
    { id: 'pet-sanctuary', title: 'Pet Sanctuary', description: 'Your companions await', icon: <PawPrint size={28} />, color: '#ec4899', roomId: 'pet-sanctuary' },
    { id: 'rooftop-observatory', title: 'Rooftop', description: 'Meditation & stargazing', icon: <Star size={28} />, color: '#60a5fa', roomId: 'rooftop-observatory' },
    { id: 'cloud-garden', title: 'Cloud Garden', description: 'Tend your plants', icon: <Flower2 size={28} />, color: '#10b981', roomId: 'cloud-garden' },
  ];

  const handleRoomClick = (roomId: string) => {
    if (onRoomChange) {
      onRoomChange(roomId);
    }
  };

  const handleRandomRoom = () => {
    const randomIndex = Math.floor(Math.random() * quickAccessItems.length);
    handleRoomClick(quickAccessItems[randomIndex].roomId);
  };

  const moods = [
    { id: 'peaceful', label: 'Peaceful', icon: <Sparkles size={20} />, color: '#60a5fa' },
    { id: 'focused', label: 'Focused', icon: <Brain size={20} />, color: '#8b5cf6' },
    { id: 'creative', label: 'Creative', icon: <Palette size={20} />, color: '#f97316' },
    { id: 'reflective', label: 'Reflective', icon: <Moon size={20} />, color: '#6366f1' },
    { id: 'energized', label: 'Energized', icon: <Flame size={20} />, color: '#ef4444' },
  ];


  return (
    <RoomContainer>
      <WelcomeSection>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          {timeOfDay.icon}
          <GreetingText>{timeOfDay.text}, Sydney</GreetingText>
        </Box>
        <SubGreeting>Welcome to your digital sanctuary</SubGreeting>

        <TimeDisplay>
          <Clock size={18} color="#d4af37" />
          <Typography sx={{ color: '#e0e0e0', fontFamily: '"Cinzel", serif' }}>{currentTime}</Typography>
          <Box sx={{ width: '1px', height: '20px', background: 'rgba(212, 175, 55, 0.3)' }} />
          <Calendar size={18} color="#d4af37" />
          <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>{currentDate}</Typography>
        </TimeDisplay>
      </WelcomeSection>

      {/* Mood Check-in */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography sx={{ color: '#888888', mb: 2 }}>How are you feeling right now?</Typography>
        <MoodSection>
          {moods.map((mood) => (
            <MoodButton
              key={mood.id}
              selected={currentMood === mood.id}
              moodColor={mood.color}
              onClick={() => setCurrentMood(mood.id)}
            >
              <Box sx={{ color: mood.color }}>{mood.icon}</Box>
              <Typography sx={{ color: currentMood === mood.id ? mood.color : '#a0a0a0' }}>
                {mood.label}
              </Typography>
            </MoodButton>
          ))}
        </MoodSection>
      </Box>

      {/* Daily Wisdom */}
      <Box sx={{ mb: 6 }}>
        <SectionTitle>
          <Star size={20} />
          Wisdom from the Ancestors
        </SectionTitle>
        <DailyWisdomCard variant="elevated" ornate>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Ghost size={40} color="#7c2d12" style={{ flexShrink: 0 }} />
            <Box>
              <WisdomQuote>"{dailyWisdom.quote}"</WisdomQuote>
              <WisdomSource>— {dailyWisdom.source}</WisdomSource>
            </Box>
          </Box>
        </DailyWisdomCard>
      </Box>

      {/* Quick Access */}
      <Box sx={{ mb: 6 }}>
        <SectionTitle>
          <Home size={20} />
          Explore Your Penthouse
        </SectionTitle>
        <QuickAccessGrid container spacing={3}>
          {quickAccessItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <QuickAccessCard
                variant="glass"
                accentColor={item.color}
                onClick={() => handleRoomClick(item.roomId)}
              >
                <IconWrapper color={item.color} className="icon-wrapper">
                  {item.icon}
                </IconWrapper>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2, color: item.color }}>
                  <Typography sx={{ fontSize: '0.9rem' }}>Enter</Typography>
                  <ChevronRight size={18} />
                </Box>
              </QuickAccessCard>
            </Grid>
          ))}
        </QuickAccessGrid>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <GothicButton variant="primary" startIcon={<Heart size={18} />} onClick={() => navigate('/mental-health')}>
          Daily Check-in
        </GothicButton>
        <GothicButton variant="secondary" startIcon={<Bell size={18} />} onClick={() => navigate('/dashboard')}>
          View Dashboard
        </GothicButton>
        <GothicButton variant="ghost" startIcon={<Sparkles size={18} />} onClick={handleRandomRoom}>
          Random Room
        </GothicButton>
      </Box>
    </RoomContainer>
  );
};

export default GrandFoyer;
