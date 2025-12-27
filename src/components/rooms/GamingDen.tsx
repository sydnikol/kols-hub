// Gaming Den Room Component
// D&D, board games, and gaming hub

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Chip, Avatar, AvatarGroup } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Gamepad2, Dice5, Users, Swords, Trophy, Clock,
  Wand2, Shield, Heart, Zap, Star, Crown, ExternalLink
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { MiniGamesHub } from '../games/MiniGamesHub';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
  50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6); }
`;

const diceRoll = keyframes`
  0% { transform: rotate(0deg); }
  25% { transform: rotate(90deg); }
  50% { transform: rotate(180deg); }
  75% { transform: rotate(270deg); }
  100% { transform: rotate(360deg); }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0c0814 0%, #1a1028 50%, #0c0814 100%)',
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
  color: '#a855f7',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(168, 85, 247, 0.4)',
  marginBottom: '8px',
});

const GameCard = styled(GothicCard)({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)',
  },
});

const CharacterCard = styled(GothicCard)<{ classColor: string }>(({ classColor }) => ({
  border: `2px solid ${classColor}`,
  background: `linear-gradient(135deg, ${classColor}15, rgba(20, 20, 30, 0.9))`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: `0 10px 30px ${classColor}40`,
  },
}));

const DiceButton = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    animation: `${diceRoll} 0.5s ease-out`,
    boxShadow: '0 0 30px rgba(168, 85, 247, 0.6)',
  },
});

const StatBar = styled(Box)<{ value: number; color: string }>(({ value, color }) => ({
  height: '8px',
  borderRadius: '4px',
  background: `${color}30`,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: `${value}%`,
    borderRadius: '4px',
    background: color,
  },
}));

const TabContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  gap: '8px',
  marginBottom: '32px',
  flexWrap: 'wrap',
});

const TabButton = styled(Box)<{ active: boolean }>(({ active }) => ({
  padding: '14px 28px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: '"Cinzel", serif',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  background: active
    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(124, 58, 237, 0.2))'
    : 'rgba(20, 20, 30, 0.6)',
  color: active ? '#a855f7' : '#888888',
  border: active ? '2px solid #a855f7' : '2px solid transparent',
  boxShadow: active ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: active ? 'linear-gradient(90deg, transparent, #a855f7, transparent)' : 'transparent',
  },
  '&:hover': {
    background: active
      ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.4), rgba(124, 58, 237, 0.3))'
      : 'rgba(30, 30, 45, 0.8)',
    color: active ? '#a855f7' : '#a080a0',
    transform: 'translateY(-2px)',
  },
}));

const MiniGamesWrapper = styled(Box)({
  margin: '-32px',
  marginTop: '0',
  '& > div': {
    minHeight: 'auto',
    paddingTop: '0',
  },
});

const campaigns = [
  { id: 'curse-strahd', name: 'Curse of Strahd', sessions: 12, nextSession: 'Saturday 7pm', players: 4 },
  { id: 'homebrew', name: 'Ancestral Echoes', sessions: 8, nextSession: 'TBD', players: 5 },
];

const characters = [
  { id: 'char1', name: 'Seraphina', class: 'Warlock', level: 8, race: 'Tiefling', color: '#dc2626', hp: 45, maxHp: 52 },
  { id: 'char2', name: 'Zephyr', class: 'Bard', level: 5, race: 'Half-Elf', color: '#ec4899', hp: 38, maxHp: 38 },
];

const boardGames = [
  { id: 'betrayal', name: 'Betrayal at House on the Hill', players: '3-6', time: '60min', category: 'Horror' },
  { id: 'gloomhaven', name: 'Gloomhaven', players: '1-4', time: '120min', category: 'Strategy' },
  { id: 'spirit-island', name: 'Spirit Island', players: '1-4', time: '90min', category: 'Cooperative' },
  { id: 'wingspan', name: 'Wingspan', players: '1-5', time: '60min', category: 'Engine Building' },
];

const diceTypes = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

type TabType = 'mini-games' | 'dnd' | 'board-games';

export const GamingDen: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [lastRoll, setLastRoll] = useState<{ die: string; result: number } | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('mini-games');

  const rollDice = (die: string) => {
    const max = parseInt(die.substring(1));
    const result = Math.floor(Math.random() * max) + 1;
    setLastRoll({ die, result });
  };

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Gamepad2 size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Gaming Den
        </RoomTitle>
        <Typography sx={{ color: '#a080a0', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Where adventures unfold and legends are born
        </Typography>
      </HeaderSection>

      {/* Tab Navigation */}
      <TabContainer>
        <TabButton
          active={activeTab === 'mini-games'}
          onClick={() => setActiveTab('mini-games')}
        >
          <Gamepad2 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Mini-Games
        </TabButton>
        <TabButton
          active={activeTab === 'dnd'}
          onClick={() => setActiveTab('dnd')}
        >
          <Dice5 size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          D&D Adventures
        </TabButton>
        <TabButton
          active={activeTab === 'board-games'}
          onClick={() => setActiveTab('board-games')}
        >
          <Trophy size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Board Games
        </TabButton>
      </TabContainer>

      {/* Mini-Games Tab Content */}
      {activeTab === 'mini-games' && (
        <MiniGamesWrapper>
          <MiniGamesHub />
        </MiniGamesWrapper>
      )}

      {/* D&D Adventures Tab Content */}
      {activeTab === 'dnd' && (
        <>
          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4, flexWrap: 'wrap' }}>
            <GothicButton
              variant="primary"
              startIcon={<Gamepad2 size={18} />}
              onClick={() => navigate('/gaming')}
            >
              Gaming Hub
            </GothicButton>
            <GothicButton
              variant="secondary"
              startIcon={<Dice5 size={18} />}
              onClick={() => navigate('/dnd')}
            >
              D&D Campaign
            </GothicButton>
            <GothicButton
              variant="ghost"
              startIcon={<Swords size={18} />}
              onClick={() => navigate('/dnd-adventure-hooks')}
            >
              Adventure Hooks
            </GothicButton>
          </Box>

          {/* Quick Dice Roller */}
          <GothicCard variant="elevated" ornate sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography sx={{ color: '#a855f7', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 1 }}>
                  <Dice5 size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Quick Dice Roller
                </Typography>
                {lastRoll && (
                  <Typography sx={{ color: '#e0e0e0', fontSize: '2rem', fontWeight: 700 }}>
                    {lastRoll.die}: <span style={{ color: lastRoll.result === parseInt(lastRoll.die.substring(1)) ? '#10b981' : '#a855f7' }}>{lastRoll.result}</span>
                    {lastRoll.result === parseInt(lastRoll.die.substring(1)) && ' NAT!'}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {diceTypes.map((die) => (
                  <GothicButton
                    key={die}
                    variant="secondary"
                    size="small"
                    onClick={() => rollDice(die)}
                  >
                    {die}
                  </GothicButton>
                ))}
              </Box>
            </Box>
          </GothicCard>

          <Grid container spacing={4}>
            {/* Active Campaigns */}
            <Grid item xs={12} md={6}>
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <Swords size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Active Campaigns
              </Typography>
              {campaigns.map((campaign) => (
                <GameCard key={campaign.id} variant="glass" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography sx={{ color: '#e0e0e0', fontSize: '1.2rem', fontWeight: 600, mb: 1 }}>
                        {campaign.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, color: '#888888', fontSize: '0.85rem' }}>
                        <span><Clock size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{campaign.sessions} sessions</span>
                        <span><Users size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />{campaign.players} players</span>
                      </Box>
                      <Typography sx={{ color: '#a855f7', fontSize: '0.9rem', mt: 1 }}>
                        Next: {campaign.nextSession}
                      </Typography>
                    </Box>
                    <GothicButton variant="accent" size="small">Open</GothicButton>
                  </Box>
                </GameCard>
              ))}
              <GothicButton variant="ghost" startIcon={<Wand2 size={18} />} sx={{ mt: 2 }}>
                Start New Campaign
              </GothicButton>
            </Grid>

            {/* Characters */}
            <Grid item xs={12} md={6}>
              <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
                <Crown size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Your Characters
              </Typography>
              {characters.map((char) => (
                <CharacterCard key={char.id} classColor={char.color} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography sx={{ color: char.color, fontSize: '1.2rem', fontWeight: 600 }}>
                        {char.name}
                      </Typography>
                      <Typography sx={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                        Level {char.level} {char.race} {char.class}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Heart size={16} color="#ef4444" />
                        <Typography sx={{ color: '#e0e0e0' }}>{char.hp}/{char.maxHp}</Typography>
                      </Box>
                      <StatBar value={(char.hp / char.maxHp) * 100} color="#ef4444" />
                    </Box>
                  </Box>
                </CharacterCard>
              ))}
              <GothicButton variant="ghost" startIcon={<Shield size={18} />} sx={{ mt: 2 }}>
                Create Character
              </GothicButton>
            </Grid>
          </Grid>
        </>
      )}

      {/* Board Games Tab Content */}
      {activeTab === 'board-games' && (
        <Box>
          <Typography sx={{ color: '#d4af37', fontFamily: '"Cinzel", serif', fontSize: '1.3rem', mb: 3 }}>
            <Trophy size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            Board Game Collection
          </Typography>
          <Grid container spacing={2}>
            {boardGames.map((game) => (
              <Grid item xs={12} sm={6} md={3} key={game.id}>
                <GameCard variant="glass">
                  <Typography sx={{ color: '#e0e0e0', fontWeight: 600, mb: 1 }}>{game.name}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={game.players} size="small" sx={{ background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }} />
                    <Chip label={game.time} size="small" sx={{ background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }} />
                    <Chip label={game.category} size="small" sx={{ background: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa' }} />
                  </Box>
                </GameCard>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </RoomContainer>
  );
};

export default GamingDen;
