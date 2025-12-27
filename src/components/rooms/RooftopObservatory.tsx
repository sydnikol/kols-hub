// Rooftop Observatory Room Component
// Meditation, stargazing, and astronomy

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Slider } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Telescope, Moon, Star, Sun, Cloud, Wind,
  Heart, Brain, Timer, Play, Pause, RotateCcw, Sparkles, BedDouble
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const breathe = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #030308 0%, #0c0820 30%, #1a1040 100%)',
  padding: '32px',
  position: 'relative',
  overflow: 'hidden',
});

const StarField = styled(Box)({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  '& .star': {
    position: 'absolute',
    width: '2px',
    height: '2px',
    background: '#ffffff',
    borderRadius: '50%',
    animation: `${twinkle} 3s ease-in-out infinite`,
  },
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
  position: 'relative',
  zIndex: 1,
});

const RoomTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '3rem',
  fontWeight: 700,
  color: '#60a5fa',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(96, 165, 250, 0.4)',
  marginBottom: '8px',
});

const MeditationCard = styled(GothicCard)({
  background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.3), rgba(20, 20, 30, 0.9))',
  border: '1px solid rgba(96, 165, 250, 0.3)',
});

const BreathingCircle = styled(Box)<{ isActive: boolean }>(({ isActive }) => ({
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)',
  border: '2px solid rgba(96, 165, 250, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  animation: isActive ? `${breathe} 8s ease-in-out infinite` : 'none',
}));

const ConstellationCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 30px rgba(96, 165, 250, 0.3)',
  },
});

const meditations = [
  { id: 'grounding', name: 'Grounding', duration: 5, description: 'Connect with the earth below', icon: <Heart size={24} /> },
  { id: 'breathing', name: 'Box Breathing', duration: 10, description: '4-4-4-4 breath pattern', icon: <Wind size={24} /> },
  { id: 'body-scan', name: 'Body Scan', duration: 15, description: 'Release tension point by point', icon: <Brain size={24} /> },
  { id: 'stargazing', name: 'Stargazing', duration: 20, description: 'Contemplate the cosmos', icon: <Star size={24} /> },
];

const constellations = [
  { name: 'Orion', season: 'Winter', stars: 7 },
  { name: 'Ursa Major', season: 'Year-round', stars: 7 },
  { name: 'Cassiopeia', season: 'Year-round', stars: 5 },
  { name: 'Scorpius', season: 'Summer', stars: 18 },
];

const moonPhases = [
  { name: 'New Moon', icon: '🌑', date: 'Jan 29' },
  { name: 'First Quarter', icon: '🌓', date: 'Feb 5' },
  { name: 'Full Moon', icon: '🌕', date: 'Feb 12' },
  { name: 'Last Quarter', icon: '🌗', date: 'Feb 20' },
];

// Generate random stars
const stars = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 60}%`,
  delay: `${Math.random() * 3}s`,
  size: Math.random() > 0.8 ? '3px' : '2px',
}));

export const RooftopObservatory: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [selectedMeditation, setSelectedMeditation] = useState<string | null>(null);

  return (
    <RoomContainer>
      <StarField>
        {stars.map((star) => (
          <Box
            key={star.id}
            className="star"
            sx={{
              left: star.left,
              top: star.top,
              animationDelay: star.delay,
              width: star.size,
              height: star.size,
            }}
          />
        ))}
      </StarField>

      <HeaderSection>
        <RoomTitle>
          <Telescope size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Rooftop Observatory
        </RoomTitle>
        <Typography sx={{ color: '#8090c0', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Where the stars meet stillness
        </Typography>
      </HeaderSection>

      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Breathing Exercise */}
        <Grid item xs={12} md={6}>
          <MeditationCard variant="elevated" ornate>
            <Typography sx={{ color: '#60a5fa', fontFamily: '"Cinzel", serif', fontSize: '1.5rem', mb: 3, textAlign: 'center' }}>
              <Wind size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Breathing Space
            </Typography>
            <BreathingCircle isActive={isBreathing}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 600 }}>
                  {isBreathing ? breathPhase : 'Ready'}
                </Typography>
                {isBreathing && (
                  <Typography sx={{ color: '#8090c0', fontSize: '0.9rem' }}>
                    Breathe with the circle
                  </Typography>
                )}
              </Box>
            </BreathingCircle>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
              <GothicButton
                variant={isBreathing ? 'danger' : 'accent'}
                startIcon={isBreathing ? <Pause size={18} /> : <Play size={18} />}
                onClick={() => setIsBreathing(!isBreathing)}
              >
                {isBreathing ? 'Pause' : 'Start'}
              </GothicButton>
              <GothicButton variant="ghost" startIcon={<RotateCcw size={18} />}>
                Reset
              </GothicButton>
            </Box>
          </MeditationCard>
        </Grid>

        {/* Moon Tracker */}
        <Grid item xs={12} md={6}>
          <MeditationCard variant="elevated" ornate>
            <Typography sx={{ color: '#60a5fa', fontFamily: '"Cinzel", serif', fontSize: '1.5rem', mb: 3, textAlign: 'center' }}>
              <Moon size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Lunar Calendar
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
              {moonPhases.map((phase, i) => (
                <Box key={phase.name} sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>{phase.icon}</Typography>
                  <Typography sx={{ color: i === 2 ? '#60a5fa' : '#888888', fontSize: '0.8rem' }}>
                    {phase.name}
                  </Typography>
                  <Typography sx={{ color: '#666666', fontSize: '0.75rem' }}>
                    {phase.date}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: '#a0a0a0', mb: 2 }}>
                Current Phase: <span style={{ color: '#60a5fa' }}>Waxing Gibbous</span>
              </Typography>
              <GothicButton variant="secondary" startIcon={<Sparkles size={18} />}>
                Moon Rituals
              </GothicButton>
            </Box>
          </MeditationCard>
        </Grid>
      </Grid>

      {/* Meditation Sessions */}
      <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
          <Brain size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Guided Meditations
        </Typography>
        <Grid container spacing={2}>
          {meditations.map((med) => (
            <Grid item xs={6} sm={3} key={med.id}>
              <ConstellationCard
                variant="glass"
                onClick={() => setSelectedMeditation(med.id)}
                sx={{ border: selectedMeditation === med.id ? '2px solid #60a5fa' : undefined }}
              >
                <Box sx={{ color: '#60a5fa', mb: 2 }}>{med.icon}</Box>
                <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 1 }}>{med.name}</Typography>
                <Typography sx={{ color: '#888888', fontSize: '0.8rem', mb: 1 }}>{med.description}</Typography>
                <Typography sx={{ color: '#60a5fa', fontSize: '0.85rem' }}>
                  <Timer size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {med.duration} min
                </Typography>
              </ConstellationCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Constellation Guide */}
      <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
          <Star size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Tonight's Sky
        </Typography>
        <Grid container spacing={2}>
          {constellations.map((constellation) => (
            <Grid item xs={6} sm={3} key={constellation.name}>
              <ConstellationCard variant="glass">
                <Star size={32} color="#d4af37" style={{ marginBottom: '12px' }} />
                <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{constellation.name}</Typography>
                <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>{constellation.season}</Typography>
                <Typography sx={{ color: '#60a5fa', fontSize: '0.85rem', mt: 1 }}>
                  {constellation.stars} main stars
                </Typography>
              </ConstellationCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Navigation Links */}
      <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
          <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Explore Related Features
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GothicButton variant="primary" startIcon={<Heart size={18} />} onClick={() => navigate('/wellness')}>
            Wellness Hub
          </GothicButton>
          <GothicButton variant="secondary" startIcon={<Brain size={18} />} onClick={() => navigate('/mental-health')}>
            Mental Health
          </GothicButton>
          <GothicButton variant="accent" startIcon={<BedDouble size={18} />} onClick={() => navigate('/sleep-tracking')}>
            Sleep Tracking
          </GothicButton>
        </Box>
      </Box>
    </RoomContainer>
  );
};

export default RooftopObservatory;
