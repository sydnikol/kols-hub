// Isometric Dollhouse View Component
// A 2.5D cutaway view showing all 16 rooms across 4 floors

import React, { useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { roomConfigs, getRoomsByFloor, RoomConfig } from '../rooms';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 15px var(--room-color); }
  50% { box-shadow: 0 0 30px var(--room-color), 0 0 50px var(--room-color); }
`;

// Floor background tints
const floorTints = [
  'rgba(212, 175, 55, 0.08)',  // Floor 1 - Gold tint
  'rgba(139, 92, 246, 0.08)',  // Floor 2 - Purple tint
  'rgba(236, 72, 153, 0.08)',  // Floor 3 - Pink tint
  'rgba(16, 185, 129, 0.08)',  // Floor 4 - Emerald tint
];

const floorBorderColors = [
  '#d4af37',  // Floor 1 - Gold
  '#8b5cf6',  // Floor 2 - Purple
  '#ec4899',  // Floor 3 - Pink
  '#10b981',  // Floor 4 - Emerald
];

// Main container with centering
const DollhouseContainer = styled(Box)({
  width: '100%',
  minHeight: 'calc(100vh - 120px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  perspective: '1500px',
  perspectiveOrigin: '50% 50%',
  padding: '40px 20px',
  background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
});

// Floating wrapper for the whole dollhouse
const FloatingWrapper = styled(Box)({
  animation: `${float} 6s ease-in-out infinite`,
  transformStyle: 'preserve-3d',
});

// Isometric container - the main transform
const IsometricWrapper = styled(Box)({
  transformStyle: 'preserve-3d',
  transform: 'rotateX(60deg) rotateZ(-45deg)',
  position: 'relative',
});

// Floor container - stacked with depth
const FloorContainer = styled(Box)<{ floorNumber: number }>(({ floorNumber }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '8px',
  padding: '12px',
  marginBottom: '4px',
  background: floorTints[floorNumber - 1],
  borderRadius: '8px',
  border: `1px solid ${floorBorderColors[floorNumber - 1]}40`,
  boxShadow: `
    0 4px 20px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05)
  `,
  position: 'relative',
  transformStyle: 'preserve-3d',
  transform: `translateZ(${(floorNumber - 1) * 80}px)`,

  // Floor depth effect
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: '-20px',
    left: '0',
    right: '0',
    height: '20px',
    background: `linear-gradient(to bottom, ${floorBorderColors[floorNumber - 1]}30, transparent)`,
    transform: 'rotateX(90deg)',
    transformOrigin: 'top',
  },

  // Side depth effect
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '-20px',
    width: '20px',
    background: `linear-gradient(to right, ${floorBorderColors[floorNumber - 1]}20, transparent)`,
    transform: 'rotateY(-90deg)',
    transformOrigin: 'left',
  },
}));

// Floor label
const FloorLabel = styled(Typography)<{ floorNumber: number }>(({ floorNumber }) => ({
  position: 'absolute',
  left: '-80px',
  top: '50%',
  transform: 'translateY(-50%) rotateZ(45deg) rotateX(-60deg)',
  fontFamily: '"Cinzel", serif',
  fontSize: '0.75rem',
  color: floorBorderColors[floorNumber - 1],
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  textShadow: '0 0 10px rgba(0, 0, 0, 0.8)',
}));

// Individual room card
const RoomCard = styled(Box)<{
  roomColor: string;
  isActive: boolean;
  hasActivity: boolean;
}>(({ roomColor, isActive, hasActivity }) => ({
  '--room-color': roomColor,
  width: '100px',
  height: '100px',
  background: `linear-gradient(135deg, rgba(20, 15, 30, 0.95) 0%, rgba(30, 25, 45, 0.9) 100%)`,
  borderRadius: '8px',
  border: `2px solid ${roomColor}60`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  transformStyle: 'preserve-3d',

  // Subtle inner glow
  boxShadow: `
    inset 0 0 20px ${roomColor}10,
    0 4px 12px rgba(0, 0, 0, 0.4)
  `,

  // Activity indicator shimmer
  ...(hasActivity && {
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(90deg, transparent, ${roomColor}20, transparent)`,
      backgroundSize: '200% 100%',
      animation: `${shimmer} 2s infinite`,
    },
  }),

  // Corner decorations
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '4px',
    left: '4px',
    width: '12px',
    height: '12px',
    borderTop: `1px solid ${roomColor}`,
    borderLeft: `1px solid ${roomColor}`,
    borderTopLeftRadius: '2px',
    transition: 'all 0.3s ease',
  },

  // Hover effect
  '&:hover': {
    transform: 'scale(1.08) translateZ(20px)',
    borderColor: roomColor,
    boxShadow: `
      0 0 25px ${roomColor}50,
      0 0 50px ${roomColor}30,
      inset 0 0 30px ${roomColor}20,
      0 10px 30px rgba(0, 0, 0, 0.5)
    `,
    animation: `${glowPulse} 1.5s ease-in-out infinite`,
    background: `linear-gradient(135deg, rgba(30, 25, 45, 0.95) 0%, rgba(40, 35, 60, 0.9) 100%)`,

    '&::after': {
      width: '16px',
      height: '16px',
      borderColor: roomColor,
    },

    '& .room-icon': {
      transform: 'scale(1.2)',
      filter: `drop-shadow(0 0 8px ${roomColor})`,
    },

    '& .room-name': {
      color: roomColor,
    },
  },

  // Active state
  ...(isActive && {
    borderColor: roomColor,
    boxShadow: `
      0 0 30px ${roomColor}60,
      inset 0 0 25px ${roomColor}20
    `,
  }),
}));

// Room icon container
const RoomIconContainer = styled(Box)({
  fontSize: '2rem',
  marginBottom: '6px',
  transition: 'all 0.3s ease',
  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
});

// Room name
const RoomName = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '0.65rem',
  color: '#a0a0a0',
  textAlign: 'center',
  letterSpacing: '0.02em',
  transition: 'color 0.3s ease',
  maxWidth: '90%',
  lineHeight: 1.2,
});

// Activity indicator dot
const ActivityDot = styled(Box)<{ color: string }>(({ color }) => ({
  position: 'absolute',
  top: '6px',
  right: '6px',
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: color,
  animation: `${pulse} 1.5s ease-in-out infinite`,
  boxShadow: `0 0 8px ${color}`,
}));

// Roof decoration
const RoofDecoration = styled(Box)({
  position: 'absolute',
  top: '-40px',
  left: '50%',
  transform: 'translateX(-50%) rotateZ(45deg) rotateX(-60deg)',
  width: '60px',
  height: '60px',
  background: 'linear-gradient(135deg, #d4af37 0%, #b8942c 100%)',
  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
  boxShadow: '0 4px 20px rgba(212, 175, 55, 0.4)',

  '&::after': {
    content: '"\\2728"', // Sparkle emoji
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -30%) rotateX(60deg) rotateZ(-45deg)',
    fontSize: '1.2rem',
  },
});

// Title above the dollhouse
const DollhouseTitle = styled(Typography)({
  position: 'absolute',
  top: '-60px',
  left: '50%',
  transform: 'translateX(-50%) rotateZ(45deg) rotateX(-60deg)',
  fontFamily: '"Cinzel Decorative", "Cinzel", serif',
  fontSize: '1.2rem',
  color: '#d4af37',
  letterSpacing: '0.2em',
  textShadow: '0 0 20px rgba(212, 175, 55, 0.5), 0 2px 10px rgba(0, 0, 0, 0.8)',
  whiteSpace: 'nowrap',
});

// Floor names for display
const floorNames = ['Ground Floor', 'Personal Floor', 'Work Floor', 'Attic'];

interface IsometricDollhouseProps {
  onRoomChange: (roomId: string) => void;
  currentRoom?: string;
  roomActivities?: Record<string, boolean>; // Map of roomId -> hasActivity
}

export const IsometricDollhouse: React.FC<IsometricDollhouseProps> = ({
  onRoomChange,
  currentRoom = 'grand-foyer',
  roomActivities = {},
}) => {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

  // Get rooms organized by floor (reversed for visual stacking - floor 4 on top)
  const floors = [4, 3, 2, 1].map(floorNum => ({
    number: floorNum,
    name: floorNames[floorNum - 1],
    rooms: getRoomsByFloor(floorNum),
  }));

  const handleRoomClick = (roomId: string) => {
    onRoomChange(roomId);
  };

  return (
    <DollhouseContainer>
      <FloatingWrapper>
        <IsometricWrapper>
          <DollhouseTitle>Gothic Dollhouse</DollhouseTitle>

          {floors.map(floor => (
            <FloorContainer key={floor.number} floorNumber={floor.number}>
              <FloorLabel floorNumber={floor.number}>
                {floor.name}
              </FloorLabel>

              {floor.rooms.map(room => {
                const hasActivity = roomActivities[room.id] || false;
                const isActive = currentRoom === room.id;

                return (
                  <Tooltip
                    key={room.id}
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography sx={{ fontWeight: 600, color: room.color }}>
                          {room.name}
                        </Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: '#ccc' }}>
                          {room.description}
                        </Typography>
                        {hasActivity && (
                          <Typography sx={{ fontSize: '0.75rem', color: '#10b981', mt: 0.5 }}>
                            Activity in progress
                          </Typography>
                        )}
                      </Box>
                    }
                    placement="top"
                    arrow
                  >
                    <RoomCard
                      roomColor={room.color}
                      isActive={isActive}
                      hasActivity={hasActivity}
                      onClick={() => handleRoomClick(room.id)}
                      onMouseEnter={() => setHoveredRoom(room.id)}
                      onMouseLeave={() => setHoveredRoom(null)}
                    >
                      {hasActivity && <ActivityDot color={room.color} />}
                      <RoomIconContainer className="room-icon">
                        {room.icon}
                      </RoomIconContainer>
                      <RoomName className="room-name">
                        {room.name}
                      </RoomName>
                    </RoomCard>
                  </Tooltip>
                );
              })}
            </FloorContainer>
          ))}
        </IsometricWrapper>
      </FloatingWrapper>
    </DollhouseContainer>
  );
};

export default IsometricDollhouse;
