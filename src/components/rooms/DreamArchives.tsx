// Dream Archives Room Component
// Dream journal, interpretation, sleep tracking, and lucid dreaming tools

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Chip, TextField, Tabs, Tab } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  CloudMoon, Star, Eye, Book, Sparkles, Brain,
  Moon, Sun, Heart, Zap, Search, Plus, Image, Bed, Clock
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { GothicJournal } from '../journal/GothicJournal';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const dreamFloat = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-20px) rotate(3deg); opacity: 1; }
`;

const starPulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.3); }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0510 0%, #150a20 50%, #0a0510 100%)',
  padding: '32px',
  position: 'relative',
  overflow: 'hidden',
});

const DreamCloud = styled(Box)({
  position: 'absolute',
  width: '200px',
  height: '100px',
  background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
  borderRadius: '50%',
  animation: `${dreamFloat} 8s ease-in-out infinite`,
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
  color: '#a78bfa',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(167, 139, 250, 0.4)',
  marginBottom: '8px',
});

const DreamCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)',
  },
});

const SymbolCard = styled(Box)({
  background: 'rgba(139, 92, 246, 0.1)',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center',
  cursor: 'pointer',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#8b5cf6',
    background: 'rgba(139, 92, 246, 0.2)',
  },
});

const recentDreams = [
  { id: 1, title: 'Flying Over Mountains', date: 'Dec 24', mood: 'Liberating', symbols: ['Flying', 'Mountains', 'Freedom'] },
  { id: 2, title: 'The Old House', date: 'Dec 22', mood: 'Nostalgic', symbols: ['House', 'Childhood', 'Memory'] },
  { id: 3, title: 'Ocean Journey', date: 'Dec 20', mood: 'Mysterious', symbols: ['Water', 'Journey', 'Unknown'] },
];

const commonSymbols = [
  { symbol: 'Water', meaning: 'Emotions, unconscious, purification' },
  { symbol: 'Flying', meaning: 'Freedom, ambition, escape' },
  { symbol: 'Falling', meaning: 'Loss of control, anxiety, letting go' },
  { symbol: 'Teeth', meaning: 'Power, confidence, communication' },
  { symbol: 'House', meaning: 'Self, psyche, different aspects' },
  { symbol: 'Snake', meaning: 'Transformation, healing, hidden fears' },
];

const lucidTechniques = [
  { name: 'Reality Checks', description: 'Test if you\'re dreaming throughout the day', icon: <Eye size={24} /> },
  { name: 'Dream Journal', description: 'Record dreams immediately upon waking', icon: <Book size={24} /> },
  { name: 'MILD Technique', description: 'Mnemonic Induction of Lucid Dreams', icon: <Brain size={24} /> },
  { name: 'Wake Back to Bed', description: 'Wake after 5 hours, stay up, return to sleep', icon: <Moon size={24} /> },
];

// Sleep tracking data
const sleepData = [
  { day: 'Mon', hours: 7.5, quality: 'Good' },
  { day: 'Tue', hours: 6.5, quality: 'Fair' },
  { day: 'Wed', hours: 8, quality: 'Excellent' },
  { day: 'Thu', hours: 5.5, quality: 'Poor' },
  { day: 'Fri', hours: 7, quality: 'Good' },
  { day: 'Sat', hours: 9, quality: 'Excellent' },
  { day: 'Sun', hours: 8, quality: 'Good' },
];

const getQualityColor = (quality: string) => {
  switch (quality) {
    case 'Excellent': return '#10b981';
    case 'Good': return '#8b5cf6';
    case 'Fair': return '#f59e0b';
    case 'Poor': return '#ef4444';
    default: return '#888888';
  }
};

export const DreamArchives: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dreamjournal' | 'interpret' | 'sleep'>('dreamjournal');

  return (
    <RoomContainer>
      {/* Floating dream clouds */}
      <DreamCloud sx={{ top: '10%', left: '5%', animationDelay: '0s' }} />
      <DreamCloud sx={{ top: '30%', right: '10%', animationDelay: '2s' }} />
      <DreamCloud sx={{ bottom: '20%', left: '15%', animationDelay: '4s' }} />

      <HeaderSection>
        <RoomTitle>
          <CloudMoon size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Dream Archives
        </RoomTitle>
        <Typography sx={{ color: '#9080b0', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Where the unconscious speaks in symbols
        </Typography>
      </HeaderSection>

      {/* Navigation Tabs */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
        {[
          { key: 'dreamjournal', label: 'Dream Journal', icon: <Book size={18} /> },
          { key: 'interpret', label: 'Dream Interpretation', icon: <Eye size={18} /> },
          { key: 'sleep', label: 'Sleep Tracking', icon: <Bed size={18} /> },
        ].map((tab) => (
          <GothicButton
            key={tab.key}
            variant={activeTab === tab.key ? 'accent' : 'ghost'}
            startIcon={tab.icon}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </GothicButton>
        ))}
      </Box>

      {activeTab === 'dreamjournal' && (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Embedded Gothic Journal - Dream focused */}
          <Box sx={{
            '& > div': {
              minHeight: 'auto',
              padding: 0,
              background: 'transparent'
            }
          }}>
            <GothicJournal />
          </Box>
        </Box>
      )}

      {activeTab === 'interpret' && (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <GothicCard variant="elevated" ornate sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
            <Typography sx={{ color: '#a78bfa', fontFamily: '"Cinzel", serif', fontSize: '1.5rem', mb: 2, textAlign: 'center' }}>
              <Search size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Symbol Lookup
            </Typography>
            <TextField
              fullWidth
              placeholder="Search for a dream symbol..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#e0e0e0',
                  background: 'rgba(20, 20, 30, 0.8)',
                  '& fieldset': { borderColor: 'rgba(139, 92, 246, 0.3)' },
                  '&:hover fieldset': { borderColor: '#8b5cf6' },
                },
              }}
            />
          </GothicCard>

          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            Common Dream Symbols
          </Typography>
          <Grid container spacing={2}>
            {commonSymbols.map((item) => (
              <Grid item xs={6} sm={4} md={2} key={item.symbol}>
                <SymbolCard>
                  <Star size={24} color="#d4af37" style={{ marginBottom: '8px' }} />
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 1 }}>{item.symbol}</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{item.meaning}</Typography>
                </SymbolCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 'sleep' && (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Sleep Stats Overview */}
          <GothicCard variant="elevated" ornate sx={{ mb: 4 }}>
            <Typography sx={{ color: '#a78bfa', fontFamily: '"Cinzel", serif', fontSize: '1.5rem', mb: 3, textAlign: 'center' }}>
              <Bed size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Sleep Tracking
            </Typography>

            {/* Weekly Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
                  <Clock size={24} color="#8b5cf6" style={{ marginBottom: '8px' }} />
                  <Typography sx={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>7.4</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Avg Hours</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                  <Star size={24} color="#10b981" style={{ marginBottom: '8px' }} />
                  <Typography sx={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>Good</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Avg Quality</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px' }}>
                  <Moon size={24} color="#ec4899" style={{ marginBottom: '8px' }} />
                  <Typography sx={{ color: '#ec4899', fontSize: '1.5rem', fontWeight: 700 }}>11:30</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Avg Bedtime</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px' }}>
                  <Sun size={24} color="#f59e0b" style={{ marginBottom: '8px' }} />
                  <Typography sx={{ color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700 }}>7:15</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>Avg Wake Time</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Weekly Sleep Chart */}
            <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
              This Week's Sleep
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '150px', mb: 3 }}>
              {sleepData.map((day) => (
                <Box key={day.day} sx={{ textAlign: 'center', flex: 1 }}>
                  <Box
                    sx={{
                      width: '35px',
                      height: `${day.hours * 14}px`,
                      background: `linear-gradient(180deg, ${getQualityColor(day.quality)} 0%, ${getQualityColor(day.quality)}50 100%)`,
                      borderRadius: '4px 4px 0 0',
                      mx: 'auto',
                      mb: 1,
                      position: 'relative',
                      '&::after': {
                        content: `"${day.hours}h"`,
                        position: 'absolute',
                        top: '-20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#a0a0a0',
                        fontSize: '0.7rem',
                      }
                    }}
                  />
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>{day.day}</Typography>
                </Box>
              ))}
            </Box>

            {/* Sleep Quality Legend */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip label="Excellent" size="small" sx={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }} />
              <Chip label="Good" size="small" sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }} />
              <Chip label="Fair" size="small" sx={{ background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }} />
              <Chip label="Poor" size="small" sx={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }} />
            </Box>
          </GothicCard>

          {/* Lucid Dreaming Techniques */}
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Lucid Dreaming Techniques
          </Typography>
          <Grid container spacing={3}>
            {lucidTechniques.map((technique) => (
              <Grid item xs={12} sm={6} key={technique.name}>
                <DreamCard variant="glass">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#a78bfa',
                      }}
                    >
                      {technique.icon}
                    </Box>
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem' }}>
                      {technique.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#888888', mb: 2 }}>{technique.description}</Typography>
                  <GothicButton variant="ghost" size="small">Learn More</GothicButton>
                </DreamCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Navigation Links */}
      <Box sx={{ mt: 4, position: 'relative', zIndex: 1 }}>
        <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
          <Sparkles size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Explore Related Features
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <GothicButton variant="primary" startIcon={<Book size={18} />} onClick={() => navigate('/journaling')}>
            Journaling Hub
          </GothicButton>
          <GothicButton variant="secondary" startIcon={<Image size={18} />} onClick={() => navigate('/memories')}>
            Memories Hub
          </GothicButton>
        </Box>
      </Box>
    </RoomContainer>
  );
};

export default DreamArchives;
