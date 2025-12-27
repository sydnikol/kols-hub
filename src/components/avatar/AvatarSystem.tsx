// Avatar System Component
// Customizable user avatar with gothic styling options

import React, { useState } from 'react';
import { Box, Typography, Grid, Tabs, Tab, Slider, Chip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  User, Palette, Sparkles, Crown, Shirt, Eye,
  Scissors, Heart, Star, Wand2, Save, RotateCcw
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 60px rgba(212, 175, 55, 0.5); }
`;

const AvatarContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0a0f 0%, #14141f 50%, #0a0a0f 100%)',
  padding: '32px',
});

const AvatarPreview = styled(Box)({
  width: '250px',
  height: '250px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(139, 92, 246, 0.2))',
  border: '3px solid #d4af37',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  animation: `${float} 4s ease-in-out infinite, ${glow} 3s ease-in-out infinite`,
  position: 'relative',
  overflow: 'hidden',
});

const AvatarLayer = styled(Box)({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const OptionCard = styled(Box)<{ selected?: boolean }>(({ selected }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '12px',
  background: selected ? 'rgba(212, 175, 55, 0.2)' : 'rgba(20, 20, 30, 0.8)',
  border: selected ? '2px solid #d4af37' : '1px solid rgba(212, 175, 55, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#d4af37',
    transform: 'scale(1.05)',
  },
}));

const ColorSwatch = styled(Box)<{ color: string; selected?: boolean }>(({ color, selected }) => ({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: color,
  cursor: 'pointer',
  border: selected ? '3px solid #ffffff' : '2px solid rgba(255, 255, 255, 0.2)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

// Avatar customization options
const skinTones = [
  { id: 'light', color: '#fdd5b1', name: 'Light' },
  { id: 'medium-light', color: '#e8b893', name: 'Medium Light' },
  { id: 'medium', color: '#c68642', name: 'Medium' },
  { id: 'medium-dark', color: '#8d5524', name: 'Medium Dark' },
  { id: 'dark', color: '#5c3317', name: 'Dark' },
  { id: 'deep', color: '#3b1f0a', name: 'Deep' },
];

const hairStyles = [
  { id: 'long', icon: '💇‍♀️', name: 'Long Flowing' },
  { id: 'short', icon: '💇', name: 'Short Styled' },
  { id: 'locs', icon: '🧕', name: 'Locs' },
  { id: 'afro', icon: '👩‍🦱', name: 'Afro' },
  { id: 'braids', icon: '👸', name: 'Braids' },
  { id: 'bald', icon: '👩‍🦲', name: 'Bald' },
];

const hairColors = [
  { id: 'black', color: '#1a1a1a', name: 'Black' },
  { id: 'brown', color: '#4a2f1a', name: 'Brown' },
  { id: 'auburn', color: '#8b3a3a', name: 'Auburn' },
  { id: 'blonde', color: '#d4a574', name: 'Blonde' },
  { id: 'silver', color: '#c0c0c0', name: 'Silver' },
  { id: 'purple', color: '#8b5cf6', name: 'Purple' },
  { id: 'red', color: '#dc2626', name: 'Red' },
  { id: 'blue', color: '#60a5fa', name: 'Blue' },
];

const eyeStyles = [
  { id: 'round', icon: '👁️', name: 'Round' },
  { id: 'almond', icon: '👀', name: 'Almond' },
  { id: 'hooded', icon: '😊', name: 'Hooded' },
  { id: 'monolid', icon: '😌', name: 'Monolid' },
];

const eyeColors = [
  { id: 'brown', color: '#4a2f1a', name: 'Brown' },
  { id: 'hazel', color: '#8b7355', name: 'Hazel' },
  { id: 'green', color: '#228b22', name: 'Green' },
  { id: 'blue', color: '#4169e1', name: 'Blue' },
  { id: 'gray', color: '#708090', name: 'Gray' },
  { id: 'amber', color: '#ffbf00', name: 'Amber' },
  { id: 'violet', color: '#8b5cf6', name: 'Violet' },
];

const accessories = [
  { id: 'none', icon: '❌', name: 'None' },
  { id: 'glasses', icon: '👓', name: 'Glasses' },
  { id: 'earrings', icon: '✨', name: 'Earrings' },
  { id: 'tiara', icon: '👑', name: 'Tiara' },
  { id: 'veil', icon: '🧣', name: 'Veil' },
  { id: 'flowers', icon: '🌸', name: 'Flowers' },
];

const outfitStyles = [
  { id: 'victorian', name: 'Victorian Gothic', icon: '🖤', color: '#1a1a1a' },
  { id: 'romantic', name: 'Romantic Goth', icon: '🌹', color: '#8b0000' },
  { id: 'cyber', name: 'Cyber Goth', icon: '⚡', color: '#00ff00' },
  { id: 'ethereal', name: 'Ethereal', icon: '✨', color: '#e6e6fa' },
  { id: 'afrofuturist', name: 'Afrofuturist', icon: '🌍', color: '#d4af37' },
  { id: 'witchy', name: 'Witchy', icon: '🔮', color: '#8b5cf6' },
];

export interface AvatarConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeStyle: string;
  eyeColor: string;
  accessory: string;
  outfit: string;
  expression: string;
}

const defaultAvatar: AvatarConfig = {
  skinTone: 'medium',
  hairStyle: 'long',
  hairColor: 'black',
  eyeStyle: 'almond',
  eyeColor: 'brown',
  accessory: 'none',
  outfit: 'victorian',
  expression: 'serene',
};

export const AvatarSystem: React.FC = () => {
  const [avatar, setAvatar] = useState<AvatarConfig>(defaultAvatar);
  const [activeTab, setActiveTab] = useState(0);

  const updateAvatar = (key: keyof AvatarConfig, value: string) => {
    setAvatar((prev) => ({ ...prev, [key]: value }));
  };

  const resetAvatar = () => {
    setAvatar(defaultAvatar);
  };

  const selectedSkin = skinTones.find((s) => s.id === avatar.skinTone);
  const selectedHair = hairColors.find((h) => h.id === avatar.hairColor);
  const selectedEyes = eyeColors.find((e) => e.id === avatar.eyeColor);

  return (
    <AvatarContainer>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          sx={{
            fontFamily: '"Cinzel", serif',
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#d4af37',
            letterSpacing: '0.1em',
            textShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
            mb: 1,
          }}
        >
          <User size={36} style={{ marginRight: '12px', verticalAlign: 'middle' }} />
          Avatar Studio
        </Typography>
        <Typography sx={{ color: '#a0a0a0', fontStyle: 'italic' }}>
          Craft your digital self
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Preview */}
        <Grid item xs={12} md={5}>
          <GothicCard variant="elevated" ornate sx={{ textAlign: 'center' }}>
            <AvatarPreview>
              {/* Base Layer */}
              <AvatarLayer
                sx={{
                  background: `radial-gradient(circle at 50% 40%, ${selectedSkin?.color || '#c68642'} 0%, ${selectedSkin?.color || '#c68642'}90 100%)`,
                  borderRadius: '50%',
                }}
              />
              {/* Hair Layer */}
              <AvatarLayer sx={{ top: '-10%' }}>
                <Box
                  sx={{
                    width: '100%',
                    height: '60%',
                    background: selectedHair?.color || '#1a1a1a',
                    borderRadius: '50% 50% 0 0',
                    opacity: 0.9,
                  }}
                />
              </AvatarLayer>
              {/* Eyes Layer */}
              <AvatarLayer>
                <Box sx={{ display: 'flex', gap: 3, mt: -2 }}>
                  <Box
                    sx={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        background: selectedEyes?.color || '#4a2f1a',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        background: selectedEyes?.color || '#4a2f1a',
                      }}
                    />
                  </Box>
                </Box>
              </AvatarLayer>
            </AvatarPreview>

            <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem', fontWeight: 600, mb: 2 }}>
              Your Avatar
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
              <Chip
                label={outfitStyles.find((o) => o.id === avatar.outfit)?.name}
                sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
              />
              <Chip
                label={hairStyles.find((h) => h.id === avatar.hairStyle)?.name}
                sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <GothicButton variant="primary" startIcon={<Save size={18} />}>
                Save Avatar
              </GothicButton>
              <GothicButton variant="ghost" startIcon={<RotateCcw size={18} />} onClick={resetAvatar}>
                Reset
              </GothicButton>
            </Box>
          </GothicCard>
        </Grid>

        {/* Customization */}
        <Grid item xs={12} md={7}>
          <GothicCard variant="glass">
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 3,
                '& .MuiTab-root': { color: '#888888', fontFamily: '"Cinzel", serif' },
                '& .Mui-selected': { color: '#d4af37' },
                '& .MuiTabs-indicator': { backgroundColor: '#d4af37' },
              }}
            >
              <Tab icon={<User size={18} />} label="Skin" />
              <Tab icon={<Scissors size={18} />} label="Hair" />
              <Tab icon={<Eye size={18} />} label="Eyes" />
              <Tab icon={<Sparkles size={18} />} label="Accessories" />
              <Tab icon={<Shirt size={18} />} label="Outfit" />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                <Typography sx={{ color: '#d4af37', mb: 2 }}>Skin Tone</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {skinTones.map((skin) => (
                    <Box key={skin.id} sx={{ textAlign: 'center' }}>
                      <ColorSwatch
                        color={skin.color}
                        selected={avatar.skinTone === skin.id}
                        onClick={() => updateAvatar('skinTone', skin.id)}
                      />
                      <Typography sx={{ color: '#888888', fontSize: '0.75rem', mt: 1 }}>
                        {skin.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography sx={{ color: '#d4af37', mb: 2 }}>Hair Style</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                  {hairStyles.map((style) => (
                    <OptionCard
                      key={style.id}
                      selected={avatar.hairStyle === style.id}
                      onClick={() => updateAvatar('hairStyle', style.id)}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '2rem' }}>{style.icon}</Typography>
                        <Typography sx={{ color: '#888888', fontSize: '0.7rem' }}>{style.name}</Typography>
                      </Box>
                    </OptionCard>
                  ))}
                </Box>

                <Typography sx={{ color: '#d4af37', mb: 2 }}>Hair Color</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {hairColors.map((color) => (
                    <Box key={color.id} sx={{ textAlign: 'center' }}>
                      <ColorSwatch
                        color={color.color}
                        selected={avatar.hairColor === color.id}
                        onClick={() => updateAvatar('hairColor', color.id)}
                      />
                      <Typography sx={{ color: '#888888', fontSize: '0.75rem', mt: 1 }}>
                        {color.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography sx={{ color: '#d4af37', mb: 2 }}>Eye Shape</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                  {eyeStyles.map((style) => (
                    <OptionCard
                      key={style.id}
                      selected={avatar.eyeStyle === style.id}
                      onClick={() => updateAvatar('eyeStyle', style.id)}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '2rem' }}>{style.icon}</Typography>
                        <Typography sx={{ color: '#888888', fontSize: '0.7rem' }}>{style.name}</Typography>
                      </Box>
                    </OptionCard>
                  ))}
                </Box>

                <Typography sx={{ color: '#d4af37', mb: 2 }}>Eye Color</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {eyeColors.map((color) => (
                    <Box key={color.id} sx={{ textAlign: 'center' }}>
                      <ColorSwatch
                        color={color.color}
                        selected={avatar.eyeColor === color.id}
                        onClick={() => updateAvatar('eyeColor', color.id)}
                      />
                      <Typography sx={{ color: '#888888', fontSize: '0.75rem', mt: 1 }}>
                        {color.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Typography sx={{ color: '#d4af37', mb: 2 }}>Accessories</Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {accessories.map((acc) => (
                    <OptionCard
                      key={acc.id}
                      selected={avatar.accessory === acc.id}
                      onClick={() => updateAvatar('accessory', acc.id)}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ fontSize: '2rem' }}>{acc.icon}</Typography>
                        <Typography sx={{ color: '#888888', fontSize: '0.7rem' }}>{acc.name}</Typography>
                      </Box>
                    </OptionCard>
                  ))}
                </Box>
              </Box>
            )}

            {activeTab === 4 && (
              <Box>
                <Typography sx={{ color: '#d4af37', mb: 2 }}>Outfit Style</Typography>
                <Grid container spacing={2}>
                  {outfitStyles.map((style) => (
                    <Grid item xs={6} sm={4} key={style.id}>
                      <OptionCard
                        selected={avatar.outfit === style.id}
                        onClick={() => updateAvatar('outfit', style.id)}
                        sx={{ width: '100%', height: 'auto', p: 2, flexDirection: 'column' }}
                      >
                        <Typography sx={{ fontSize: '2rem', mb: 1 }}>{style.icon}</Typography>
                        <Typography sx={{ color: '#e0e0e0', fontSize: '0.85rem', fontWeight: 600 }}>
                          {style.name}
                        </Typography>
                        <Box
                          sx={{
                            width: '40px',
                            height: '4px',
                            background: style.color,
                            borderRadius: '2px',
                            mt: 1,
                          }}
                        />
                      </OptionCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </GothicCard>
        </Grid>
      </Grid>
    </AvatarContainer>
  );
};

export default AvatarSystem;
