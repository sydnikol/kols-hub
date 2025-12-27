// Dollhouse View - 3D/2.5D Isometric Penthouse View
// Main navigation hub for all rooms in the Gothic Dollhouse

import React, { useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Home, Sofa, Bed, Bath, ChefHat, Briefcase, Gamepad2, Palette,
  Flower2, Book, Moon, Music, Star, Flame, Ghost, Telescope,
  Shirt, Users, Coffee, Sparkles
} from 'lucide-react';
import { GothicTheme, gothicDark } from '../../themes/GothicDollhouseTheme';

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 20px var(--glow-color, rgba(139, 92, 246, 0.3)); }
  50% { box-shadow: 0 0 40px var(--glow-color, rgba(139, 92, 246, 0.5)); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Room definition type
export interface Room {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ReactNode;
  floor: number;
  position: number;
  color: string;
  linkedFeatures: string[];
  locked?: boolean;
}

// Default rooms across 4 floors
export const DEFAULT_ROOMS: Room[] = [
  // Level 1 - Public Spaces
  { id: 'foyer', name: 'Grand Foyer', subtitle: 'Welcome Dashboard', icon: <Home size={24} />, floor: 1, position: 1, color: '#8b5cf6', linkedFeatures: ['/'] },
  { id: 'living', name: 'Living Room', subtitle: 'Entertainment & Ideas', icon: <Sofa size={24} />, floor: 1, position: 2, color: '#7c3aed', linkedFeatures: ['/entertainment', '/mental-health'] },
  { id: 'dining', name: 'Dining Room', subtitle: 'Food & Family', icon: <Coffee size={24} />, floor: 1, position: 3, color: '#d4af37', linkedFeatures: ['/food-hub', '/family'] },
  { id: 'kitchen', name: 'Kitchen Lab', subtitle: 'Cooking & Kitchen Witch', icon: <ChefHat size={24} />, floor: 1, position: 4, color: '#f59e0b', linkedFeatures: ['/cooking', '/kitchen-witch'] },

  // Level 2 - Personal Spaces
  { id: 'bedroom', name: 'Master Bedroom', subtitle: 'Sleep & Journaling', icon: <Bed size={24} />, floor: 2, position: 1, color: '#6366f1', linkedFeatures: ['/sleep', '/journaling'] },
  { id: 'wardrobe', name: 'Wardrobe Palace', subtitle: 'Virtual Closet & AI Scanner', icon: <Shirt size={24} />, floor: 2, position: 2, color: '#ec4899', linkedFeatures: ['/fashion', '/wardrobe'] },
  { id: 'bathroom', name: 'Spa Sanctuary', subtitle: 'Wellness & Self-Care', icon: <Bath size={24} />, floor: 2, position: 3, color: '#0d9488', linkedFeatures: ['/wellness', '/health'] },
  { id: 'guest', name: 'Guest Room', subtitle: 'Hospitality & Social', icon: <Users size={24} />, floor: 2, position: 4, color: '#14b8a6', linkedFeatures: ['/social'] },

  // Level 3 - Work & Create
  { id: 'office', name: 'Finance Hub', subtitle: 'Budgeting & Passive Income', icon: <Briefcase size={24} />, floor: 3, position: 1, color: '#10b981', linkedFeatures: ['/finance', '/passive-income'] },
  { id: 'studio', name: 'Creative Studio', subtitle: 'Art, Music, Sewing', icon: <Palette size={24} />, floor: 3, position: 2, color: '#f97316', linkedFeatures: ['/creative', '/sewing'] },
  { id: 'library', name: 'Library Study', subtitle: 'Learning & AI Teacher', icon: <Book size={24} />, floor: 3, position: 3, color: '#84cc16', linkedFeatures: ['/education', '/learning'] },
  { id: 'music', name: 'Music Room', subtitle: 'Production & Streaming', icon: <Music size={24} />, floor: 3, position: 4, color: '#be185d', linkedFeatures: ['/music'] },

  // Level 4 - Spiritual & Discovery
  { id: 'ancestor', name: 'Ancestor Hall', subtitle: 'Heritage & ChronoMuse', icon: <Ghost size={24} />, floor: 4, position: 1, color: '#7c2d12', linkedFeatures: ['/ancestry', '/chronomuse'] },
  { id: 'apothecary', name: 'Apothecary', subtitle: 'Spirituality & Hoodoo', icon: <Flame size={24} />, floor: 4, position: 2, color: '#dc2626', linkedFeatures: ['/hoodoo', '/spirituality'] },
  { id: 'gaming', name: 'Gaming Den', subtitle: 'D&D & Board Games', icon: <Gamepad2 size={24} />, floor: 4, position: 3, color: '#a855f7', linkedFeatures: ['/gaming', '/dnd'] },
  { id: 'rooftop', name: 'Rooftop Observatory', subtitle: 'Meditation & Stargazing', icon: <Telescope size={24} />, floor: 4, position: 4, color: '#1e3a8a', linkedFeatures: ['/meditation', '/astronomy'] },
];

interface DollhouseViewProps {
  theme?: GothicTheme;
  onRoomSelect?: (room: Room) => void;
  activeRoomId?: string;
  viewMode?: 'isometric' | 'grid' | 'list';
}

const DollhouseContainer = styled(Box)({
  width: '100%',
  minHeight: '100vh',
  background: 'var(--bg-primary, #0a0a0f)',
  padding: '24px',
  position: 'relative',
  overflow: 'hidden',

  // Ambient particles
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 40%)',
    pointerEvents: 'none',
  },
});

const FloorContainer = styled(Box)<{ floor: number }>(({ floor }) => ({
  marginBottom: '32px',
  position: 'relative',

  // Floor shadow effect
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-16px',
    left: '10%',
    right: '10%',
    height: '16px',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)',
    borderRadius: '50%',
    filter: 'blur(8px)',
  },
}));

const FloorLabel = styled(Typography)({
  fontFamily: 'var(--font-accent, "Cinzel", serif)',
  fontSize: '0.875rem',
  color: 'var(--text-accent, #d4af37)',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  marginBottom: '12px',
  paddingLeft: '8px',
  borderLeft: '3px solid var(--color-accent, #d4af37)',
});

const RoomGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',

  '@media (max-width: 1024px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr',
  },
});

const RoomCard = styled(Box, {
  shouldForwardProp: (prop) => !['active', 'locked', 'roomColor'].includes(prop as string),
})<{ active?: boolean; locked?: boolean; roomColor: string }>(({ active, locked, roomColor }) => ({
  position: 'relative',
  padding: '24px',
  borderRadius: '16px',
  cursor: locked ? 'not-allowed' : 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  background: 'var(--bg-surface, rgba(20, 20, 30, 0.8))',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${active ? roomColor : 'var(--border-color, rgba(139, 92, 246, 0.3))'}`,
  opacity: locked ? 0.5 : 1,
  overflow: 'hidden',

  // Active state
  ...(active && {
    boxShadow: `0 0 30px ${roomColor}40`,
    animation: `${glowPulse} 2s ease-in-out infinite`,
    borderWidth: '2px',
  }),

  // Room color accent line
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: '3px',
    background: `linear-gradient(90deg, transparent, ${roomColor}, transparent)`,
    borderRadius: '0 0 4px 4px',
  },

  // Hover effects
  '&:hover': {
    transform: locked ? 'none' : 'translateY(-8px) scale(1.02)',
    boxShadow: locked ? 'none' : `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${roomColor}30`,
    borderColor: roomColor,

    '& .room-icon': {
      animation: `${floatAnimation} 2s ease-in-out infinite`,
      color: roomColor,
    },

    '&::after': {
      opacity: 1,
    },
  },

  // Shimmer on hover
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
    backgroundSize: '200% 100%',
    animation: `${shimmer} 2s infinite`,
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  },
}));

const RoomIcon = styled(Box)({
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(139, 92, 246, 0.2)',
  marginBottom: '16px',
  color: 'var(--color-primary, #8b5cf6)',
  transition: 'all 0.3s ease',
});

const RoomName = styled(Typography)({
  fontFamily: 'var(--font-heading, "Playfair Display", serif)',
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--text-primary, #e0e0e0)',
  marginBottom: '4px',
});

const RoomSubtitle = styled(Typography)({
  fontSize: '0.8rem',
  color: 'var(--text-muted, #666666)',
  fontStyle: 'italic',
});

const ActivityIndicator = styled(Box)<{ color: string }>(({ color }) => ({
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: color,
  boxShadow: `0 0 10px ${color}`,
  animation: `${glowPulse} 2s ease-in-out infinite`,
}));

const LockOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '16px',

  '& svg': {
    color: 'var(--text-muted, #666666)',
  },
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '48px',
  position: 'relative',
});

const MainTitle = styled(Typography)({
  fontFamily: 'var(--font-accent, "Cinzel", serif)',
  fontSize: '3rem',
  fontWeight: 700,
  color: 'var(--text-accent, #d4af37)',
  letterSpacing: '0.1em',
  textShadow: '0 0 40px rgba(212, 175, 55, 0.3)',
  marginBottom: '8px',

  '@media (max-width: 640px)': {
    fontSize: '2rem',
  },
});

const Subtitle = styled(Typography)({
  fontFamily: 'var(--font-family, sans-serif)',
  fontSize: '1rem',
  color: 'var(--text-secondary, #a0a0a0)',
  fontStyle: 'italic',
});

export const DollhouseView: React.FC<DollhouseViewProps> = ({
  theme = gothicDark,
  onRoomSelect,
  activeRoomId,
  viewMode = 'grid',
}) => {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  // Group rooms by floor
  const roomsByFloor = useMemo(() => {
    const floors: { [key: number]: Room[] } = { 1: [], 2: [], 3: [], 4: [] };
    DEFAULT_ROOMS.forEach(room => {
      if (floors[room.floor]) {
        floors[room.floor].push(room);
      }
    });
    return floors;
  }, []);

  const floorNames = {
    1: 'Level I - Public Spaces',
    2: 'Level II - Personal Chambers',
    3: 'Level III - Work & Creation',
    4: 'Level IV - Spiritual & Discovery',
  };

  const handleRoomClick = (room: Room) => {
    if (!room.locked && onRoomSelect) {
      onRoomSelect(room);
    }
  };

  return (
    <DollhouseContainer>
      <HeaderSection>
        <MainTitle>Gothic Penthouse</MainTitle>
        <Subtitle>Your Self-Evolving Digital Sanctuary</Subtitle>
      </HeaderSection>

      {[4, 3, 2, 1].map((floor) => (
        <FloorContainer key={floor} floor={floor}>
          <FloorLabel>{floorNames[floor as keyof typeof floorNames]}</FloorLabel>
          <RoomGrid>
            {roomsByFloor[floor]
              .sort((a, b) => a.position - b.position)
              .map((room) => (
                <RoomCard
                  key={room.id}
                  active={activeRoomId === room.id}
                  locked={room.locked}
                  roomColor={room.color}
                  onClick={() => handleRoomClick(room)}
                  onMouseEnter={() => setHoveredRoom(room.id)}
                  onMouseLeave={() => setHoveredRoom(null)}
                >
                  <RoomIcon className="room-icon" sx={{ background: `${room.color}20`, color: room.color }}>
                    {room.icon}
                  </RoomIcon>
                  <RoomName>{room.name}</RoomName>
                  <RoomSubtitle>{room.subtitle}</RoomSubtitle>

                  {/* Activity indicator */}
                  {!room.locked && (
                    <ActivityIndicator color={room.color} />
                  )}

                  {/* Lock overlay */}
                  {room.locked && (
                    <LockOverlay>
                      <Star size={32} />
                    </LockOverlay>
                  )}
                </RoomCard>
              ))}
          </RoomGrid>
        </FloorContainer>
      ))}
    </DollhouseContainer>
  );
};

export default DollhouseView;
