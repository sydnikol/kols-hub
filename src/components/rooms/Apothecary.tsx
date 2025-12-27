// Apothecary Room Component
// Spirituality, Kitchen Witch, and Hoodoo practices

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Tabs, Tab, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Flame, Moon, Star, Sparkles, Leaf, Droplet,
  Book, Heart, Sun, Eye, Wind, CloudMoon, ExternalLink
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const candleFlicker = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
`;

const floatSmoke = keyframes`
  0% { opacity: 0.3; transform: translateY(0) rotate(0deg); }
  50% { opacity: 0.6; transform: translateY(-20px) rotate(5deg); }
  100% { opacity: 0; transform: translateY(-40px) rotate(-5deg); }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0c0806 0%, #1a0f08 50%, #0c0806 100%)',
  padding: '32px',
  position: 'relative',
  overflow: 'hidden',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: '100px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%)',
    animation: `${candleFlicker} 3s ease-in-out infinite`,
  },
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
});

const RoomTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '3rem',
  fontWeight: 700,
  color: '#dc2626',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(220, 38, 38, 0.4)',
  marginBottom: '8px',
});

const PracticeCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(220, 38, 38, 0.2)',
  },
});

const HerbCard = styled(Box)({
  background: 'rgba(20, 20, 30, 0.8)',
  borderRadius: '12px',
  padding: '16px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: '1px solid rgba(132, 204, 22, 0.2)',
  '&:hover': {
    borderColor: '#84cc16',
    background: 'rgba(132, 204, 22, 0.1)',
  },
});

const MoonPhaseCard = styled(Box)<{ active?: boolean }>(({ active }) => ({
  background: active ? 'rgba(139, 92, 246, 0.2)' : 'rgba(20, 20, 30, 0.6)',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: active ? '2px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#8b5cf6',
  },
}));

const practices = [
  { id: 'candle-magic', name: 'Candle Magic', icon: <Flame size={28} />, description: 'Color correspondences, dressing candles, fire spells', color: '#dc2626' },
  { id: 'ancestor-work', name: 'Ancestor Veneration', icon: <Heart size={28} />, description: 'Altar setup, offerings, communication', color: '#7c2d12' },
  { id: 'herbal-work', name: 'Herbal Preparations', icon: <Leaf size={28} />, description: 'Teas, baths, mojo bags, floor washes', color: '#84cc16' },
  { id: 'divination', name: 'Divination', icon: <Eye size={28} />, description: 'Tarot, bone reading, pendulum work', color: '#8b5cf6' },
  { id: 'cleansing', name: 'Spiritual Cleansing', icon: <Droplet size={28} />, description: 'Baths, smoke cleansing, egg cleanse', color: '#60a5fa' },
  { id: 'protection', name: 'Protection Work', icon: <Star size={28} />, description: 'Wards, shields, protective charms', color: '#d4af37' },
];

const herbs = [
  { name: 'Lavender', uses: 'Peace, sleep, love' },
  { name: 'Rosemary', uses: 'Protection, memory' },
  { name: 'Sage', uses: 'Cleansing, wisdom' },
  { name: 'Cinnamon', uses: 'Money, success' },
  { name: 'Bay Leaves', uses: 'Wishes, protection' },
  { name: 'Chamomile', uses: 'Calm, luck' },
];

const moonPhases = [
  { name: 'New Moon', icon: '🌑', energy: 'New beginnings, setting intentions' },
  { name: 'Waxing', icon: '🌒', energy: 'Growth, attraction, building' },
  { name: 'Full Moon', icon: '🌕', energy: 'Power, manifestation, charging' },
  { name: 'Waning', icon: '🌘', energy: 'Release, banishing, cleansing' },
];

export const Apothecary: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [activeMoonPhase, setActiveMoonPhase] = useState(2); // Full moon

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Flame size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          The Apothecary
        </RoomTitle>
        <Typography sx={{ color: '#a08060', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Where ancestral wisdom meets spiritual practice
        </Typography>
      </HeaderSection>

      {/* Navigation Links */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
        <GothicButton
          variant="primary"
          startIcon={<Sparkles size={18} />}
          onClick={() => navigate('/spirituality')}
        >
          Spirituality Hub
        </GothicButton>
        <GothicButton
          variant="secondary"
          startIcon={<Leaf size={18} />}
          onClick={() => navigate('/kitchen-witch')}
        >
          Kitchen Witch
        </GothicButton>
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        centered
        sx={{
          mb: 4,
          '& .MuiTab-root': { color: '#a0a0a0', fontFamily: '"Cinzel", serif' },
          '& .Mui-selected': { color: '#dc2626' },
          '& .MuiTabs-indicator': { backgroundColor: '#dc2626' },
        }}
      >
        <Tab label="Practices" />
        <Tab label="Herb Cabinet" />
        <Tab label="Moon Calendar" />
        <Tab label="Ancestor Altar" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Typography sx={{ color: '#a0a0a0', mb: 3, textAlign: 'center' }}>
            200+ spiritual practices rooted in Hoodoo and folk magic traditions
          </Typography>
          <Grid container spacing={3}>
            {practices.map((practice) => (
              <Grid item xs={12} sm={6} md={4} key={practice.id}>
                <PracticeCard variant="glass">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        background: `${practice.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: practice.color,
                      }}
                    >
                      {practice.icon}
                    </Box>
                    <Typography sx={{ color: '#e0e0e0', fontWeight: 600, fontSize: '1.1rem' }}>
                      {practice.name}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: '#888888', fontSize: '0.9rem', mb: 2 }}>
                    {practice.description}
                  </Typography>
                  <GothicButton variant="ghost" size="small">
                    Explore Practices
                  </GothicButton>
                </PracticeCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography sx={{ color: '#a0a0a0', mb: 3, textAlign: 'center' }}>
            Your magical herb collection with correspondences and uses
          </Typography>
          <Grid container spacing={2}>
            {herbs.map((herb) => (
              <Grid item xs={6} sm={4} md={2} key={herb.name}>
                <HerbCard>
                  <Leaf size={32} color="#84cc16" style={{ marginBottom: '8px' }} />
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 1 }}>{herb.name}</Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>{herb.uses}</Typography>
                </HerbCard>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <GothicButton variant="accent" startIcon={<Book size={18} />}>
              Full Herbal Grimoire
            </GothicButton>
          </Box>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <GothicCard variant="elevated" ornate sx={{ maxWidth: '600px', mx: 'auto', textAlign: 'center' }}>
            <Typography sx={{ color: '#8b5cf6', fontFamily: '"Cinzel", serif', fontSize: '1.5rem', mb: 3 }}>
              <Moon size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Current Moon Phase
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              {moonPhases.map((phase, i) => (
                <MoonPhaseCard
                  key={phase.name}
                  active={activeMoonPhase === i}
                  onClick={() => setActiveMoonPhase(i)}
                >
                  <Typography sx={{ fontSize: '1.5rem' }}>{phase.icon}</Typography>
                </MoonPhaseCard>
              ))}
            </Box>
            <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem', mb: 1 }}>
              {moonPhases[activeMoonPhase].name}
            </Typography>
            <Typography sx={{ color: '#a0a0a0', mb: 3 }}>
              {moonPhases[activeMoonPhase].energy}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <GothicButton variant="primary" startIcon={<Sparkles size={18} />}>
                Suggested Rituals
              </GothicButton>
              <GothicButton variant="secondary" startIcon={<Star size={18} />}>
                Plan Spellwork
              </GothicButton>
            </Box>
          </GothicCard>
        </Box>
      )}

      {activeTab === 3 && (
        <Box sx={{ maxWidth: '700px', mx: 'auto' }}>
          <GothicCard variant="elevated" ornate>
            <Typography sx={{ color: '#7c2d12', fontFamily: '"Cinzel", serif', fontSize: '1.5rem', mb: 3, textAlign: 'center' }}>
              <Heart size={24} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Ancestor Altar
            </Typography>
            <Typography sx={{ color: '#a0a0a0', mb: 3, textAlign: 'center' }}>
              A sacred space to honor and connect with those who came before
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {['Photos', 'Offerings', 'Candles', 'Water', 'Flowers', 'Incense'].map((item) => (
                <Grid item xs={4} key={item}>
                  <Box
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      background: 'rgba(124, 45, 18, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(124, 45, 18, 0.3)',
                    }}
                  >
                    <Typography sx={{ color: '#c08050', fontSize: '0.9rem' }}>{item}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <GothicButton variant="accent" startIcon={<Flame size={18} />}>
                Light Ancestor Candle
              </GothicButton>
              <GothicButton variant="secondary" startIcon={<Book size={18} />}>
                Veneration Guide
              </GothicButton>
            </Box>
          </GothicCard>
        </Box>
      )}
    </RoomContainer>
  );
};

export default Apothecary;
