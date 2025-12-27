// Hoodoo Practice Hub
// Spiritual practice system with altar management, moon phases, and rituals

import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Grid, Chip, IconButton, Tooltip, Badge, LinearProgress } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Moon, Sun, Star, Sparkles, Flame, Droplets, Shield, Heart,
  DollarSign, Scale, Users, Eye, BookOpen, Calendar, Check,
  Clock, AlertCircle, Feather, Leaf, Home, Wind, Zap
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import hoodooData from '../../data/kols_hoodoo_library_200.json';

const candleFlicker = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

const moonGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.6); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const HubContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a0820 50%, #0a0812 100%)',
  padding: '32px',
});

const MoonPhaseDisplay = styled(Box)({
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 40% 40%, #fafafa, #c0c0c0, #808080)',
  margin: '0 auto',
  animation: `${moonGlow} 3s ease-in-out infinite`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
});

const AltarDisplay = styled(Box)({
  background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
  borderRadius: '20px',
  padding: '32px',
  border: '2px solid rgba(212, 175, 55, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '4px',
    background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
  },
});

const CandleIcon = styled(Box)<{ lit: boolean; candleColor: string }>(({ lit, candleColor }) => ({
  width: '40px',
  height: '60px',
  borderRadius: '4px 4px 8px 8px',
  background: `linear-gradient(180deg, ${lit ? candleColor : '#444'}, ${lit ? `${candleColor}80` : '#333'})`,
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&::before': lit ? {
    content: '""',
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '12px',
    height: '20px',
    borderRadius: '50% 50% 50% 50%',
    background: 'radial-gradient(circle at center, #fff, #ffd700, #ff6600)',
    animation: `${candleFlicker} 0.5s ease-in-out infinite`,
  } : {},
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const RitualCard = styled(Box)<{ categoryColor: string; completed?: boolean }>(({ categoryColor, completed }) => ({
  padding: '16px',
  borderRadius: '12px',
  background: completed ? `${categoryColor}15` : 'rgba(20, 20, 30, 0.8)',
  border: `1px solid ${completed ? categoryColor : 'rgba(100, 100, 120, 0.3)'}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: categoryColor,
  },
  '&:hover': {
    transform: 'translateX(4px)',
    borderColor: categoryColor,
  },
}));

const CategoryChip = styled(Chip)<{ selected: boolean; chipColor: string }>(({ selected, chipColor }) => ({
  margin: '4px',
  background: selected ? `${chipColor}30` : 'rgba(30, 30, 40, 0.6)',
  border: selected ? `2px solid ${chipColor}` : '1px solid rgba(100, 100, 120, 0.3)',
  color: selected ? chipColor : '#888888',
  cursor: 'pointer',
  '&:hover': {
    background: `${chipColor}20`,
    borderColor: chipColor,
  },
}));

// Category configurations
const categoryConfig: Record<string, { icon: React.ElementType; color: string; description: string }> = {
  protection: { icon: Shield, color: '#8b5cf6', description: 'Shield and guard' },
  money: { icon: DollarSign, color: '#22c55e', description: 'Prosperity and abundance' },
  health: { icon: Heart, color: '#ef4444', description: 'Healing and wellness' },
  court: { icon: Scale, color: '#6366f1', description: 'Justice and legal matters' },
  love: { icon: Heart, color: '#ec4899', description: 'Love and relationships' },
  peace: { icon: Feather, color: '#60a5fa', description: 'Calm and tranquility' },
  road_opener: { icon: Zap, color: '#f59e0b', description: 'Clear obstacles' },
  ancestors: { icon: Users, color: '#a855f7', description: 'Ancestor connection' },
  cleansing: { icon: Droplets, color: '#14b8a6', description: 'Purification' },
  focus: { icon: Eye, color: '#f97316', description: 'Mental clarity' },
};

// Moon phase calculator (simplified)
const getMoonPhase = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Simplified moon phase calculation
  const c = Math.floor(365.25 * year);
  const e = Math.floor(30.6 * month);
  const jd = c + e + day - 694039.09;
  const phase = jd / 29.53058867;
  const phaseIndex = Math.round((phase - Math.floor(phase)) * 8) % 8;

  const phases = [
    { name: 'New Moon', emoji: '🌑', energy: 'new beginnings, setting intentions' },
    { name: 'Waxing Crescent', emoji: '🌒', energy: 'building, attracting' },
    { name: 'First Quarter', emoji: '🌓', energy: 'action, decisions' },
    { name: 'Waxing Gibbous', emoji: '🌔', energy: 'refining, patience' },
    { name: 'Full Moon', emoji: '🌕', energy: 'manifestation, power' },
    { name: 'Waning Gibbous', emoji: '🌖', energy: 'gratitude, sharing' },
    { name: 'Last Quarter', emoji: '🌗', energy: 'release, forgiveness' },
    { name: 'Waning Crescent', emoji: '🌘', energy: 'rest, reflection' },
  ];

  return phases[phaseIndex];
};

// Altar items
const altarItems = [
  { id: 'water', name: 'Water Glass', emoji: '🥛', purpose: 'offerings, spirit communication' },
  { id: 'candle-white', name: 'White Candle', emoji: '🕯️', color: '#fafafa', purpose: 'purity, general work' },
  { id: 'candle-purple', name: 'Purple Candle', emoji: '🕯️', color: '#8b5cf6', purpose: 'spiritual power, wisdom' },
  { id: 'candle-green', name: 'Green Candle', emoji: '🕯️', color: '#22c55e', purpose: 'money, prosperity' },
  { id: 'candle-red', name: 'Red Candle', emoji: '🕯️', color: '#ef4444', purpose: 'passion, strength' },
  { id: 'incense', name: 'Incense', emoji: '🪔', purpose: 'cleansing, calling spirits' },
  { id: 'flowers', name: 'Fresh Flowers', emoji: '🌸', purpose: 'beauty, offerings' },
  { id: 'coins', name: 'Coins', emoji: '🪙', purpose: 'prosperity' },
];

export const HoodooPracticeHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [completedRituals, setCompletedRituals] = useState<Set<string>>(new Set());
  const [litCandles, setLitCandles] = useState<Set<string>>(new Set(['candle-white']));
  const [selectedRitual, setSelectedRitual] = useState<any>(null);
  const [dailyPracticeCount, setDailyPracticeCount] = useState(3);

  const moonPhase = getMoonPhase();
  const rituals = hoodooData.seed || [];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    rituals.forEach((r: any) => cats.add(r.category));
    return Array.from(cats);
  }, [rituals]);

  const filteredRituals = useMemo(() => {
    if (!selectedCategory) return rituals.slice(0, 20);
    return rituals.filter((r: any) => r.category === selectedCategory).slice(0, 20);
  }, [rituals, selectedCategory]);

  const toggleCandle = (candleId: string) => {
    setLitCandles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(candleId)) {
        newSet.delete(candleId);
      } else {
        newSet.add(candleId);
      }
      return newSet;
    });
  };

  const markComplete = (ritualId: string) => {
    setCompletedRituals(prev => {
      const newSet = new Set(prev);
      newSet.add(ritualId);
      return newSet;
    });
    setDailyPracticeCount(prev => prev + 1);
  };

  const getCategoryInfo = (category: string) => {
    return categoryConfig[category] || { icon: Sparkles, color: '#8b5cf6', description: 'Spiritual work' };
  };

  return (
    <HubContainer>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#d4af37',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
            mb: 1,
          }}
        >
          <Sparkles size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Hoodoo Practice Hub
        </Typography>
        <Typography sx={{ color: '#9080a0', fontStyle: 'italic' }}>
          "What you send out comes back threefold"
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Moon Phase Card */}
        <Grid item xs={12} md={4}>
          <GothicCard variant="elevated" ornate>
            <Typography sx={{ color: '#c4b5fd', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 3, textAlign: 'center' }}>
              <Moon size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Moon Phase
            </Typography>
            <MoonPhaseDisplay>
              <Typography sx={{ fontSize: '3rem' }}>{moonPhase.emoji}</Typography>
            </MoonPhaseDisplay>
            <Typography sx={{ color: '#e0e0e0', textAlign: 'center', mt: 2, fontWeight: 600 }}>
              {moonPhase.name}
            </Typography>
            <Typography sx={{ color: '#888888', textAlign: 'center', fontSize: '0.9rem', fontStyle: 'italic' }}>
              Energy: {moonPhase.energy}
            </Typography>

            {/* Daily Practice Progress */}
            <Box sx={{ mt: 3, p: 2, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
              <Typography sx={{ color: '#a78bfa', fontSize: '0.9rem', mb: 1 }}>Daily Practice</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(dailyPracticeCount * 20, 100)}
                  sx={{
                    flex: 1,
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#8b5cf6',
                    },
                  }}
                />
                <Typography sx={{ color: '#8b5cf6' }}>{dailyPracticeCount}/5</Typography>
              </Box>
            </Box>
          </GothicCard>
        </Grid>

        {/* Altar Display */}
        <Grid item xs={12} md={8}>
          <AltarDisplay>
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3, textAlign: 'center' }}>
              <Home size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Your Altar
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap', mb: 3 }}>
              {altarItems.filter(item => item.emoji === '🕯️').map(candle => (
                <Tooltip key={candle.id} title={`${candle.name} - ${candle.purpose}`}>
                  <Box sx={{ textAlign: 'center' }}>
                    <CandleIcon
                      lit={litCandles.has(candle.id)}
                      candleColor={candle.color || '#fafafa'}
                      onClick={() => toggleCandle(candle.id)}
                    />
                    <Typography sx={{ color: '#888888', fontSize: '0.7rem', mt: 1 }}>
                      {candle.name.replace('Candle', '').trim()}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              {altarItems.filter(item => item.emoji !== '🕯️').map(item => (
                <Tooltip key={item.id} title={`${item.name} - ${item.purpose}`}>
                  <Box
                    sx={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'rgba(30, 30, 40, 0.8)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      animation: `${float} 3s ease-in-out infinite`,
                      animationDelay: `${Math.random() * 2}s`,
                      '&:hover': {
                        transform: 'scale(1.1)',
                        borderColor: '#d4af37',
                      },
                    }}
                  >
                    {item.emoji}
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </AltarDisplay>
        </Grid>

        {/* Category Filters */}
        <Grid item xs={12}>
          <GothicCard variant="glass">
            <Typography sx={{ color: '#a78bfa', fontFamily: '"Cinzel", serif', fontSize: '1.1rem', mb: 2 }}>
              Practice Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              <CategoryChip
                label="All Practices"
                selected={!selectedCategory}
                chipColor="#d4af37"
                onClick={() => setSelectedCategory(null)}
              />
              {categories.map(category => {
                const config = getCategoryInfo(category);
                return (
                  <CategoryChip
                    key={category}
                    icon={<config.icon size={14} />}
                    label={category.replace('_', ' ')}
                    selected={selectedCategory === category}
                    chipColor={config.color}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  />
                );
              })}
            </Box>
          </GothicCard>
        </Grid>

        {/* Rituals List */}
        <Grid item xs={12}>
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            <BookOpen size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Practices & Rituals
          </Typography>
          <Grid container spacing={2}>
            {filteredRituals.map((ritual: any) => {
              const config = getCategoryInfo(ritual.category);
              const isCompleted = completedRituals.has(ritual.id);
              return (
                <Grid item xs={12} sm={6} md={4} key={ritual.id}>
                  <RitualCard
                    categoryColor={config.color}
                    completed={isCompleted}
                    onClick={() => setSelectedRitual(ritual)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <config.icon size={18} color={config.color} />
                        <Chip
                          size="small"
                          label={ritual.category.replace('_', ' ')}
                          sx={{
                            height: '20px',
                            fontSize: '0.7rem',
                            background: `${config.color}20`,
                            color: config.color,
                          }}
                        />
                      </Box>
                      {isCompleted && (
                        <Check size={18} color="#22c55e" />
                      )}
                    </Box>
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 500, mb: 1, fontSize: '0.95rem' }}>
                      {ritual.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        size="small"
                        icon={<Calendar size={10} />}
                        label={ritual.schedule_hint}
                        sx={{ height: '20px', fontSize: '0.65rem', background: 'rgba(100, 100, 120, 0.3)', color: '#888888' }}
                      />
                      {ritual.psalms?.length > 0 && (
                        <Chip
                          size="small"
                          icon={<BookOpen size={10} />}
                          label={`Psalm ${ritual.psalms[0]}`}
                          sx={{ height: '20px', fontSize: '0.65rem', background: 'rgba(100, 100, 120, 0.3)', color: '#888888' }}
                        />
                      )}
                    </Box>
                  </RitualCard>
                </Grid>
              );
            })}
          </Grid>
        </Grid>

        {/* Selected Ritual Detail */}
        {selectedRitual && (
          <Grid item xs={12}>
            <GothicCard variant="elevated" ornate>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.5rem' }}>
                    {selectedRitual.title}
                  </Typography>
                  {(() => {
                    const catInfo = getCategoryInfo(selectedRitual.category);
                    const CatIcon = catInfo.icon;
                    return (
                      <Chip
                        size="small"
                        icon={<CatIcon size={14} />}
                        label={catInfo.description}
                        sx={{
                          mt: 1,
                          background: `${catInfo.color}20`,
                          color: catInfo.color,
                        }}
                      />
                    );
                  })()}
                </Box>
                <GothicButton
                  variant="primary"
                  startIcon={<Check size={16} />}
                  onClick={() => {
                    markComplete(selectedRitual.id);
                    setSelectedRitual(null);
                  }}
                  disabled={completedRituals.has(selectedRitual.id)}
                >
                  {completedRituals.has(selectedRitual.id) ? 'Completed' : 'Mark Complete'}
                </GothicButton>
              </Box>

              {/* Ingredients */}
              {selectedRitual.ingredients?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#a78bfa', fontWeight: 600, mb: 1 }}>Ingredients:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedRitual.ingredients.map((ingredient: string, i: number) => (
                      <Chip
                        key={i}
                        label={ingredient}
                        sx={{ background: 'rgba(167, 139, 250, 0.2)', color: '#a78bfa' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Psalms */}
              {selectedRitual.psalms?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#ec4899', fontWeight: 600, mb: 1 }}>Psalms:</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {selectedRitual.psalms.map((psalm: string, i: number) => (
                      <Chip
                        key={i}
                        label={`Psalm ${psalm}`}
                        sx={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Steps */}
              {selectedRitual.steps?.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ color: '#22c55e', fontWeight: 600, mb: 1 }}>Steps:</Typography>
                  {selectedRitual.steps.map((step: string, i: number) => (
                    <Box key={i} sx={{ display: 'flex', gap: 2, mb: 1 }}>
                      <Box
                        sx={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(34, 197, 94, 0.2)',
                          color: '#22c55e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: '0.8rem',
                        }}
                      >
                        {i + 1}
                      </Box>
                      <Typography sx={{ color: '#e0e0e0' }}>{step}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Safety Notes */}
              {selectedRitual.safety_notes && (
                <Box sx={{ p: 2, background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <AlertCircle size={16} color="#ef4444" />
                    <Typography sx={{ color: '#ef4444', fontWeight: 600 }}>Safety Note:</Typography>
                  </Box>
                  <Typography sx={{ color: '#fca5a5', fontSize: '0.9rem' }}>
                    {selectedRitual.safety_notes}
                  </Typography>
                </Box>
              )}
            </GothicCard>
          </Grid>
        )}
      </Grid>
    </HubContainer>
  );
};

export default HoodooPracticeHub;
