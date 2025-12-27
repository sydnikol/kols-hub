// Cloud Garden Room Component
// Plant care, virtual garden, and nature connection

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Leaf, Droplets, Sun, Cloud, Flower2, TreePine,
  Wind, ThermometerSun, Clock, Heart, Sparkles, Plus, Wrench
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const sway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-15px); opacity: 1; }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a1510 0%, #102820 50%, #0a1510 100%)',
  padding: '32px',
  position: 'relative',
  overflow: 'hidden',
});

const FloatingCloud = styled(Box)({
  position: 'absolute',
  width: '150px',
  height: '60px',
  background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
  borderRadius: '50%',
  animation: `${float} 6s ease-in-out infinite`,
  pointerEvents: 'none',
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
  color: '#10b981',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
  marginBottom: '8px',
});

const PlantCard = styled(GothicCard)<{ health: number }>(({ health }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: health > 70 ? '#10b981' : health > 40 ? '#fbbf24' : '#ef4444',
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(16, 185, 129, 0.3)',
  },
}));

const PlantIcon = styled(Box)({
  animation: `${sway} 4s ease-in-out infinite`,
});

const WeatherCard = styled(Box)({
  background: 'rgba(16, 185, 129, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center',
  border: '1px solid rgba(16, 185, 129, 0.2)',
});

const plants = [
  { id: 'monstera', name: 'Monstera Deliciosa', health: 85, lastWatered: '2 days ago', light: 'Indirect', water: 'Weekly', icon: '🪴' },
  { id: 'pothos', name: 'Golden Pothos', health: 92, lastWatered: '3 days ago', light: 'Low-Medium', water: 'Weekly', icon: '🌿' },
  { id: 'snake', name: 'Snake Plant', health: 78, lastWatered: '1 week ago', light: 'Any', water: 'Bi-weekly', icon: '🌱' },
  { id: 'fiddle', name: 'Fiddle Leaf Fig', health: 45, lastWatered: '5 days ago', light: 'Bright', water: '10 days', icon: '🌳' },
  { id: 'peace', name: 'Peace Lily', health: 95, lastWatered: 'Today', light: 'Low', water: 'Weekly', icon: '🌸' },
  { id: 'succulent', name: 'Echeveria', health: 88, lastWatered: '2 weeks ago', light: 'Bright', water: 'Monthly', icon: '🌵' },
];

const gardenTasks = [
  { task: 'Water Fiddle Leaf Fig', priority: 'high', plant: 'fiddle' },
  { task: 'Rotate Monstera', priority: 'medium', plant: 'monstera' },
  { task: 'Mist Peace Lily', priority: 'low', plant: 'peace' },
  { task: 'Check Snake Plant soil', priority: 'medium', plant: 'snake' },
];

const weatherConditions = [
  { label: 'Humidity', value: '65%', icon: <Droplets size={24} />, optimal: true },
  { label: 'Temperature', value: '72°F', icon: <ThermometerSun size={24} />, optimal: true },
  { label: 'Light Level', value: 'Medium', icon: <Sun size={24} />, optimal: true },
  { label: 'Air Flow', value: 'Good', icon: <Wind size={24} />, optimal: true },
];

const plantKnowledge = [
  { title: 'Propagation Basics', difficulty: 'Beginner' },
  { title: 'Reading Plant Signals', difficulty: 'Intermediate' },
  { title: 'Pest Prevention', difficulty: 'Beginner' },
  { title: 'Seasonal Care Guide', difficulty: 'Advanced' },
];

export const CloudGarden: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

  const getHealthColor = (health: number) => {
    if (health > 70) return '#10b981';
    if (health > 40) return '#fbbf24';
    return '#ef4444';
  };

  return (
    <RoomContainer>
      {/* Floating clouds */}
      <FloatingCloud sx={{ top: '10%', left: '10%', animationDelay: '0s' }} />
      <FloatingCloud sx={{ top: '20%', right: '15%', animationDelay: '2s' }} />
      <FloatingCloud sx={{ top: '40%', left: '20%', animationDelay: '4s' }} />

      <HeaderSection>
        <RoomTitle>
          <Leaf size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Cloud Garden
        </RoomTitle>
        <Typography sx={{ color: '#608060', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Where green life flourishes in the clouds
        </Typography>
      </HeaderSection>

      {/* Weather Dashboard */}
      <GothicCard variant="glass" sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
        <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3, textAlign: 'center' }}>
          <Cloud size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Garden Conditions
        </Typography>
        <Grid container spacing={2}>
          {weatherConditions.map((condition) => (
            <Grid item xs={6} sm={3} key={condition.label}>
              <WeatherCard>
                <Box sx={{ color: condition.optimal ? '#10b981' : '#fbbf24', mb: 1 }}>
                  {condition.icon}
                </Box>
                <Typography sx={{ color: '#e0e0e0', fontSize: '1.5rem', fontWeight: 700 }}>
                  {condition.value}
                </Typography>
                <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>
                  {condition.label}
                </Typography>
              </WeatherCard>
            </Grid>
          ))}
        </Grid>
      </GothicCard>

      <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Plants Grid */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem' }}>
              <Flower2 size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Your Plants ({plants.length})
            </Typography>
            <GothicButton variant="accent" startIcon={<Plus size={18} />}>
              Add Plant
            </GothicButton>
          </Box>
          <Grid container spacing={2}>
            {plants.map((plant) => (
              <Grid item xs={6} sm={4} key={plant.id}>
                <PlantCard
                  variant="glass"
                  health={plant.health}
                  onClick={() => setSelectedPlant(plant.id)}
                  sx={{ border: selectedPlant === plant.id ? '2px solid #10b981' : undefined }}
                >
                  <PlantIcon sx={{ fontSize: '3rem', textAlign: 'center', mb: 2 }}>
                    {plant.icon}
                  </PlantIcon>
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 600, textAlign: 'center', mb: 1 }}>
                    {plant.name}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>Health</Typography>
                      <Typography sx={{ color: getHealthColor(plant.health), fontSize: '0.8rem' }}>
                        {plant.health}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={plant.health}
                      sx={{
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        '& .MuiLinearProgress-bar': { backgroundColor: getHealthColor(plant.health) },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Chip
                      icon={<Droplets size={12} />}
                      label={plant.lastWatered}
                      size="small"
                      sx={{ background: 'rgba(96, 165, 250, 0.2)', color: '#60a5fa', fontSize: '0.7rem' }}
                    />
                  </Box>
                </PlantCard>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Care Tasks */}
          <GothicCard variant="elevated" ornate sx={{ mb: 3 }}>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <Clock size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Care Tasks
            </Typography>
            {gardenTasks.map((task, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 1.5,
                  mb: 1,
                  borderRadius: '8px',
                  background: 'rgba(20, 20, 30, 0.6)',
                  borderLeft: `3px solid ${
                    task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#fbbf24' : '#10b981'
                  }`,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{task.task}</Typography>
                </Box>
                <GothicButton variant="ghost" size="small">Done</GothicButton>
              </Box>
            ))}
          </GothicCard>

          {/* Plant Knowledge */}
          <GothicCard variant="glass">
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              <TreePine size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Plant Knowledge
            </Typography>
            {plantKnowledge.map((lesson, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 1.5,
                  mb: 1,
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.05)',
                  cursor: 'pointer',
                  '&:hover': { background: 'rgba(16, 185, 129, 0.1)' },
                }}
              >
                <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{lesson.title}</Typography>
                <Chip
                  label={lesson.difficulty}
                  size="small"
                  sx={{
                    background: lesson.difficulty === 'Beginner'
                      ? 'rgba(16, 185, 129, 0.2)'
                      : lesson.difficulty === 'Intermediate'
                      ? 'rgba(251, 191, 36, 0.2)'
                      : 'rgba(139, 92, 246, 0.2)',
                    color: lesson.difficulty === 'Beginner'
                      ? '#10b981'
                      : lesson.difficulty === 'Intermediate'
                      ? '#fbbf24'
                      : '#a78bfa',
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            ))}
          </GothicCard>
        </Grid>
      </Grid>

      {/* Garden Visualization */}
      <Box sx={{ mt: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <GothicCard variant="elevated" ornate>
          <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 2 }}>
            <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Virtual Garden View
          </Typography>
          <Box
            sx={{
              height: '200px',
              background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.1), rgba(20, 20, 30, 0.5))',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 4,
              pb: 3,
            }}
          >
            {plants.slice(0, 5).map((plant, i) => (
              <Box key={plant.id} sx={{ textAlign: 'center' }}>
                <PlantIcon sx={{ fontSize: '3rem' }}>{plant.icon}</PlantIcon>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
            <GothicButton variant="primary" startIcon={<Droplets size={18} />}>
              Water All
            </GothicButton>
            <GothicButton variant="secondary" startIcon={<Heart size={18} />}>
              Care Routine
            </GothicButton>
          </Box>
        </GothicCard>
      </Box>

      {/* Navigation Links */}
      <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3, textAlign: 'center' }}>
          <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Explore Related Features
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GothicButton variant="primary" startIcon={<Leaf size={18} />} onClick={() => navigate('/gardening')}>
            Gardening Hub
          </GothicButton>
          <GothicButton variant="secondary" startIcon={<Wrench size={18} />} onClick={() => navigate('/home-maintenance')}>
            Home Maintenance
          </GothicButton>
        </Box>
      </Box>
    </RoomContainer>
  );
};

export default CloudGarden;
