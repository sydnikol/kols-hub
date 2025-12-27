// Wardrobe Palace Room Component
// Virtual closet with AI scanner and outfit builder

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Tabs, Tab } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Shirt, Camera, Sparkles, Heart, Calendar, Sun, Moon,
  Palette, Tag, Plus, Star, Wand2, Eye, User, Home
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { AvatarSystem } from '../avatar/AvatarSystem';
import { WardrobeManager } from '../wardrobe/WardrobeManager';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0f0a0c 0%, #1a0f14 50%, #0f0a0c 100%)',
  padding: '32px',
  position: 'relative',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
});

const RoomTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '3rem',
  fontWeight: 700,
  color: '#ec4899',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(236, 72, 153, 0.4)',
  marginBottom: '8px',
});

const RoomSubtitle = styled(Typography)({
  fontSize: '1.1rem',
  color: '#a08080',
  fontStyle: 'italic',
});

const StylePresetCard = styled(GothicCard)<{ active?: boolean }>(({ active }) => ({
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  border: active ? '2px solid #ec4899' : '1px solid rgba(236, 72, 153, 0.3)',
  background: active ? 'rgba(236, 72, 153, 0.15)' : 'rgba(20, 20, 30, 0.8)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)',
  },
}));

const OutfitCard = styled(GothicCard)({
  position: 'relative',
  height: '280px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  overflow: 'hidden',
  '&:hover': {
    '& .outfit-overlay': {
      opacity: 1,
    },
  },
});

const OutfitOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

const ScannerArea = styled(Box)({
  border: '2px dashed rgba(236, 72, 153, 0.5)',
  borderRadius: '16px',
  padding: '48px',
  textAlign: 'center',
  background: 'rgba(236, 72, 153, 0.05)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: '#ec4899',
    background: 'rgba(236, 72, 153, 0.1)',
  },
});

const EraClosetCard = styled(GothicCard)({
  background: 'linear-gradient(135deg, rgba(124, 45, 18, 0.2), rgba(20, 20, 30, 0.9))',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

// Embedded component wrapper to override the component's own background/padding
const EmbeddedComponentWrapper = styled(Box)({
  '& > div': {
    minHeight: 'auto',
    background: 'transparent',
    padding: 0,
  },
});

const MainTabPanel = styled(Box)({
  marginTop: '24px',
});

const stylePresets = [
  { id: 'sensory-safe', name: 'Sensory Safe Now', icon: <Heart size={24} />, color: '#60a5fa' },
  { id: 'academic-goth', name: 'Academic Goth', icon: <Star size={24} />, color: '#8b5cf6' },
  { id: 'afrofuturist', name: 'Afrofuturist Royalty', icon: <Sparkles size={24} />, color: '#d4af37' },
  { id: 'cyberpunk-witch', name: 'Cyberpunk Witch', icon: <Wand2 size={24} />, color: '#ec4899' },
  { id: 'minimalist', name: 'Quiet Mode: Minimalist', icon: <Moon size={24} />, color: '#6b7280' },
  { id: 'sunday-best', name: 'Sunday Best', icon: <Sun size={24} />, color: '#f59e0b' },
  { id: 'cozy-spooky', name: 'Cozy Spooky', icon: <Eye size={24} />, color: '#7c2d12' },
  { id: 'power-pro', name: 'Power Professional', icon: <Shirt size={24} />, color: '#10b981' },
];

const eraClosets = [
  { id: 'victorian', name: 'Victorian Gothic', era: '1837-1901', color: '#581c87' },
  { id: 'harlem', name: 'Harlem Renaissance', era: '1920s-1930s', color: '#d4af37' },
  { id: 'civil-rights', name: 'Civil Rights Era', era: '1960s', color: '#1e3a8a' },
  { id: 'disco', name: 'Disco & Soul', era: '1970s', color: '#f97316' },
  { id: 'hip-hop', name: 'Hip Hop Golden Age', era: '1990s', color: '#dc2626' },
  { id: 'afrofuturist', name: 'Afrofuturist Sci-Fi', era: 'Future', color: '#8b5cf6' },
];

export const WardrobePalace: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState(0);
  const [roomNavTab, setRoomNavTab] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Shirt size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Wardrobe Palace
        </RoomTitle>
        <RoomSubtitle>
          Your virtual closet where fashion meets identity
        </RoomSubtitle>
      </HeaderSection>

      {/* Main Navigation Tabs */}
      <Tabs
        value={mainTab}
        onChange={(_, v) => setMainTab(v)}
        centered
        sx={{
          mb: 2,
          '& .MuiTab-root': {
            color: '#a0a0a0',
            fontFamily: '"Cinzel", serif',
            fontSize: '1.1rem',
            minWidth: '160px',
          },
          '& .Mui-selected': { color: '#ec4899' },
          '& .MuiTabs-indicator': { backgroundColor: '#ec4899', height: '3px' },
        }}
      >
        <Tab icon={<User size={20} />} iconPosition="start" label="Avatar Studio" />
        <Tab icon={<Shirt size={20} />} iconPosition="start" label="Wardrobe" />
        <Tab icon={<Home size={20} />} iconPosition="start" label="Room Navigation" />
      </Tabs>

      <MainTabPanel>
        {/* Avatar Studio Tab */}
        {mainTab === 0 && (
          <EmbeddedComponentWrapper>
            <AvatarSystem />
          </EmbeddedComponentWrapper>
        )}

        {/* Wardrobe Tab */}
        {mainTab === 1 && (
          <EmbeddedComponentWrapper>
            <WardrobeManager />
          </EmbeddedComponentWrapper>
        )}

        {/* Room Navigation Tab - Original Content */}
        {mainTab === 2 && (
          <Box>
            <Tabs
              value={roomNavTab}
              onChange={(_, v) => setRoomNavTab(v)}
              centered
              sx={{
                mb: 4,
                '& .MuiTab-root': { color: '#a0a0a0', fontFamily: '"Cinzel", serif' },
                '& .Mui-selected': { color: '#ec4899' },
                '& .MuiTabs-indicator': { backgroundColor: '#ec4899' },
              }}
            >
              <Tab label="Style Presets" />
              <Tab label="My Wardrobe" />
              <Tab label="AI Scanner" />
              <Tab label="Era Closets" />
            </Tabs>

            {roomNavTab === 0 && (
              <Box>
                <Typography sx={{ color: '#a0a0a0', mb: 3, textAlign: 'center' }}>
                  Quick style modes for any occasion or energy level
                </Typography>
                <Grid container spacing={3}>
                  {stylePresets.map((preset) => (
                    <Grid item xs={6} sm={4} md={3} key={preset.id}>
                      <StylePresetCard
                        active={selectedPreset === preset.id}
                        onClick={() => setSelectedPreset(preset.id)}
                      >
                        <Box sx={{ color: preset.color, mb: 2 }}>{preset.icon}</Box>
                        <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{preset.name}</Typography>
                      </StylePresetCard>
                    </Grid>
                  ))}
                </Grid>
                {selectedPreset && (
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <GothicButton variant="accent" startIcon={<Wand2 size={18} />}>
                      Generate Outfit Suggestions
                    </GothicButton>
                  </Box>
                )}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <GothicButton variant="primary" startIcon={<Shirt size={18} />} onClick={() => navigate('/wardrobe')}>
                    Open Virtual Wardrobe
                  </GothicButton>
                </Box>
              </Box>
            )}

            {roomNavTab === 1 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem' }}>
                    Your Scanned Wardrobe
                  </Typography>
                  <GothicButton variant="secondary" size="small" startIcon={<Plus size={16} />}>
                    Add Item
                  </GothicButton>
                </Box>
                <Grid container spacing={3}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Grid item xs={6} sm={4} md={3} key={i}>
                      <OutfitCard variant="glass">
                        <Shirt size={64} color="#666666" />
                        <Typography sx={{ color: '#888888', mt: 2 }}>Empty Slot</Typography>
                        <OutfitOverlay className="outfit-overlay">
                          <GothicButton variant="ghost" size="small">
                            <Camera size={18} />
                          </GothicButton>
                          <GothicButton variant="ghost" size="small">
                            <Tag size={18} />
                          </GothicButton>
                        </OutfitOverlay>
                      </OutfitCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {roomNavTab === 2 && (
              <Box sx={{ maxWidth: '600px', mx: 'auto' }}>
                <ScannerArea>
                  <Camera size={64} color="#ec4899" style={{ marginBottom: '16px' }} />
                  <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem', mb: 1 }}>
                    AI Clothing Scanner
                  </Typography>
                  <Typography sx={{ color: '#888888', mb: 3 }}>
                    Take a photo of your clothing to add it to your virtual wardrobe
                  </Typography>
                  <GothicButton variant="accent" startIcon={<Camera size={18} />}>
                    Open Camera
                  </GothicButton>
                </ScannerArea>
                <Box sx={{ mt: 4, p: 3, background: 'rgba(20, 20, 30, 0.6)', borderRadius: '12px' }}>
                  <Typography sx={{ color: '#d4af37', fontWeight: 600, mb: 2 }}>
                    <Sparkles size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                    AI Features
                  </Typography>
                  <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem', lineHeight: 1.8 }}>
                    • Automatic color and pattern detection<br />
                    • Fabric type identification<br />
                    • Style category tagging<br />
                    • Outfit compatibility suggestions<br />
                    • Weather-appropriate recommendations
                  </Typography>
                </Box>
              </Box>
            )}

            {roomNavTab === 3 && (
              <Box>
                <Typography sx={{ color: '#a0a0a0', mb: 3, textAlign: 'center' }}>
                  Explore fashion through history and culture
                </Typography>
                <Grid container spacing={3}>
                  {eraClosets.map((era) => (
                    <Grid item xs={12} sm={6} md={4} key={era.id}>
                      <EraClosetCard>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box
                            sx={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '12px',
                              background: `${era.color}30`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Palette size={24} color={era.color} />
                          </Box>
                          <Box>
                            <Typography sx={{ color: '#e0e0e0', fontWeight: 600 }}>{era.name}</Typography>
                            <Typography sx={{ color: '#888888', fontSize: '0.85rem' }}>{era.era}</Typography>
                          </Box>
                        </Box>
                      </EraClosetCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </MainTabPanel>
    </RoomContainer>
  );
};

export default WardrobePalace;
