// Gothic Dollhouse Main Page
// The central hub connecting all 16 rooms across 4 floors
// With integrated navigation, weather effects, achievement popups, and accessibility

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, IconButton, Tooltip, Badge, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled, keyframes, ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Menu, X, ChevronUp, ChevronDown, Home, Settings,
  Moon, Sun, Volume2, VolumeX, Bell, User, Building2, Layers,
  LayoutDashboard
} from 'lucide-react';
import { GothicCard } from '../components/gothic/GothicCard';
import { GothicButton } from '../components/gothic/GothicButton';
import { roomConfigs, getRoomsByFloor } from '../components/rooms';
import { RoomTransition } from '../components/dollhouse/RoomTransition';
import { AudioManager, AudioProvider, useAudio } from '../components/audio/AudioManager';
import { IsometricDollhouse } from '../components/dollhouse/IsometricDollhouse';
import { RoomPetCompanion } from '../components/pets/RoomPetCompanion';
import { AccessibilityProvider, useAccessibility } from '../components/accessibility/AccessibilityProvider';
import { AchievementPopup } from '../components/achievements/AchievementPopup';
import { GothicDashboard } from '../components/dashboard/GothicDashboard';
import { GothicNavigation } from '../components/navigation/GothicNavigation';
import { WeatherEffects, DayNightCycle } from '../components/effects';
import { integrationService } from '../services/IntegrationService';

// Import all room components
import { GrandFoyer } from '../components/rooms/GrandFoyer';
import { AncestorHall } from '../components/rooms/AncestorHall';
import { WardrobePalace } from '../components/rooms/WardrobePalace';
import { LibraryStudy } from '../components/rooms/LibraryStudy';
import { Apothecary } from '../components/rooms/Apothecary';
import { OfficeHub } from '../components/rooms/OfficeHub';
import { GamingDen } from '../components/rooms/GamingDen';
import { RooftopObservatory } from '../components/rooms/RooftopObservatory';
import { DreamArchives } from '../components/rooms/DreamArchives';
import { FortuneTellerAlcove } from '../components/rooms/FortuneTellerAlcove';
import { CloudGarden } from '../components/rooms/CloudGarden';
import { CreativeStudio } from '../components/rooms/CreativeStudio';
import { KitchenLab } from '../components/rooms/KitchenLab';
import { MusicRoom } from '../components/rooms/MusicRoom';
import { PetSanctuary } from '../components/rooms/PetSanctuary';
import { GuestQuarters } from '../components/rooms/GuestQuarters';

// ==========================================
// Animations
// ==========================================

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

// ==========================================
// Gothic Theme
// ==========================================

const gothicTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#6d28d9',
    },
    secondary: {
      main: '#d4af37',
      light: '#f5e6a3',
      dark: '#b8860b',
    },
    background: {
      default: '#0a0812',
      paper: '#1a1028',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#888888',
    },
  },
  typography: {
    fontFamily: '"Cormorant Garamond", "Georgia", serif',
    h1: {
      fontFamily: '"Cinzel Decorative", "Cinzel", serif',
    },
    h2: {
      fontFamily: '"Cinzel", serif',
    },
    h3: {
      fontFamily: '"Cinzel", serif',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Cinzel", serif',
          textTransform: 'none',
        },
      },
    },
  },
});

// ==========================================
// Styled Components
// ==========================================

const MainContainer = styled(Box)<{ enableEffects: boolean }>(({ enableEffects }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #0a0812 0%, #1a1028 50%, #0a0812 100%)',
  position: 'relative',
  overflow: 'hidden',
}));

const WeatherOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  zIndex: 5,
});

const TopBar = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  height: '60px',
  background: 'rgba(10, 8, 18, 0.95)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  zIndex: 1000,
});

const SideNav = styled(Box)({
  position: 'fixed',
  left: 0,
  top: '60px',
  bottom: 0,
  width: '280px',
  background: 'rgba(10, 8, 18, 0.98)',
  backdropFilter: 'blur(10px)',
  borderRight: '1px solid rgba(139, 92, 246, 0.3)',
  overflowY: 'auto',
  padding: '16px',
  zIndex: 999,
  transition: 'transform 0.3s ease',
});

const FloorSection = styled(Box)({
  marginBottom: '24px',
});

const FloorTitle = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '0.9rem',
  color: '#d4af37',
  letterSpacing: '0.1em',
  marginBottom: '12px',
  paddingLeft: '8px',
  borderLeft: '3px solid #d4af37',
});

const RoomItem = styled(Box)<{ active: boolean; roomColor: string }>(({ active, roomColor }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: active ? `${roomColor}20` : 'transparent',
  border: active ? `1px solid ${roomColor}50` : '1px solid transparent',
  marginBottom: '4px',
  '&:hover': {
    background: `${roomColor}15`,
    transform: 'translateX(4px)',
  },
}));

const RoomIcon = styled(Box)<{ color: string }>(({ color }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  background: `${color}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
}));

const ContentArea = styled(Box)<{ navOpen: boolean; useNewNav: boolean }>(({ navOpen, useNewNav }) => ({
  marginLeft: useNewNav ? 0 : (navOpen ? '280px' : 0),
  marginTop: '60px',
  minHeight: 'calc(100vh - 60px)',
  transition: 'margin-left 0.3s ease',
}));

const FloorIndicator = styled(Box)({
  position: 'fixed',
  right: '24px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  zIndex: 100,
});

const FloorDot = styled(Box)<{ active: boolean; floor: number }>(({ active, floor }) => {
  const colors = ['#d4af37', '#8b5cf6', '#ec4899', '#10b981'];
  return {
    width: active ? '14px' : '10px',
    height: active ? '14px' : '10px',
    borderRadius: '50%',
    background: active ? colors[floor - 1] : 'rgba(100, 100, 120, 0.5)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: active ? `${pulse} 2s ease-in-out infinite` : 'none',
    '&:hover': {
      transform: 'scale(1.3)',
      background: colors[floor - 1],
    },
  };
});

const SpoonMeter = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 16px',
  background: 'rgba(249, 115, 22, 0.1)',
  borderRadius: '20px',
  border: '1px solid rgba(249, 115, 22, 0.3)',
});

const Spoon = styled(Box)<{ filled: boolean }>(({ filled }) => ({
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  background: filled ? '#f97316' : 'rgba(249, 115, 22, 0.2)',
  transition: 'all 0.3s ease',
}));

const floorNames = ['Ground Floor', 'First Floor', 'Second Floor', 'Attic'];

// View Mode Toggle Styling
const ViewModeToggle = styled(ToggleButtonGroup)({
  background: 'rgba(20, 15, 30, 0.8)',
  borderRadius: '8px',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  padding: '2px',

  '& .MuiToggleButton-root': {
    color: '#888888',
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    gap: '6px',
    fontSize: '0.8rem',
    textTransform: 'none',
    fontFamily: '"Cinzel", serif',
    transition: 'all 0.3s ease',

    '&:hover': {
      background: 'rgba(139, 92, 246, 0.1)',
      color: '#a78bfa',
    },

    '&.Mui-selected': {
      background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(212, 175, 55, 0.2))',
      color: '#d4af37',
      boxShadow: '0 0 15px rgba(212, 175, 55, 0.3)',

      '&:hover': {
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(212, 175, 55, 0.3))',
      },
    },
  },
});

type ViewMode = 'isometric' | 'room' | 'dashboard';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

const roomComponentMap: Record<string, React.FC<RoomProps>> = {
  'grand-foyer': GrandFoyer,
  'ancestor-hall': AncestorHall,
  'wardrobe-palace': WardrobePalace,
  'library-study': LibraryStudy,
  'apothecary': Apothecary,
  'office-hub': OfficeHub,
  'gaming-den': GamingDen,
  'rooftop-observatory': RooftopObservatory,
  'dream-archives': DreamArchives,
  'fortune-teller-alcove': FortuneTellerAlcove,
  'cloud-garden': CloudGarden,
  'creative-studio': CreativeStudio,
  'kitchen-lab': KitchenLab,
  'music-room': MusicRoom,
  'pet-sanctuary': PetSanctuary,
  'guest-quarters': GuestQuarters,
};

// ==========================================
// Weather/Time State
// ==========================================

interface WeatherState {
  condition: 'clear' | 'rain' | 'snow' | 'storm' | 'fog' | 'aurora';
  intensity: number;
}

// ==========================================
// Inner Component with Audio Context
// ==========================================

const GothicDollhouseContent: React.FC = () => {
  const [navOpen, setNavOpen] = useState(true);
  const [useNewNav, setUseNewNav] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('grand-foyer');
  const [currentFloor, setCurrentFloor] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [spoons, setSpoons] = useState(7);
  const [viewMode, setViewMode] = useState<ViewMode>('room');
  const [weatherEnabled, setWeatherEnabled] = useState(true);
  const [notifications, setNotifications] = useState(3);

  const [weather, setWeather] = useState<WeatherState>({
    condition: 'clear',
    intensity: 0.5,
  });

  const maxSpoons = 10;

  const { state: audioState, toggleMute, applyRoomPreset } = useAudio();

  // Determine if it's night time
  const isNight = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 6 || hour >= 20;
  }, []);

  // Handle view mode change
  const handleViewModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
      integrationService.useFeature(`view-${newMode}`);
    }
  };

  const currentRoomConfig = roomConfigs.find(r => r.id === currentRoom);

  // Apply room preset when room changes
  useEffect(() => {
    applyRoomPreset(currentRoom);
  }, [currentRoom, applyRoomPreset]);

  // Track room visits
  useEffect(() => {
    integrationService.trackRoomVisit(currentRoom);
  }, [currentRoom]);

  const handleRoomChange = useCallback((roomId: string) => {
    if (roomId === currentRoom) return;

    const newRoom = roomConfigs.find(r => r.id === roomId);
    if (!newRoom) return;

    setTransitioning(true);

    setTimeout(() => {
      setCurrentRoom(roomId);
      setCurrentFloor(newRoom.floor);
      setTransitioning(false);
      setViewMode('room'); // Switch to room view when navigating
    }, 500);
  }, [currentRoom]);

  const handleFloorChange = useCallback((floor: number) => {
    const floorRooms = getRoomsByFloor(floor);
    if (floorRooms.length > 0) {
      handleRoomChange(floorRooms[0].id);
    }
  }, [handleRoomChange]);

  // Handle navigation from GothicNavigation or Dashboard
  const handleNavigation = useCallback((itemId: string, categoryId?: string) => {
    // Check if it's a room
    if (roomConfigs.some(r => r.id === itemId)) {
      handleRoomChange(itemId);
      return;
    }

    // Handle special navigation items
    switch (itemId) {
      case 'dashboard':
        setViewMode('dashboard');
        break;
      case 'rooms':
        setViewMode('isometric');
        break;
      case 'library':
        handleRoomChange('library-study');
        break;
      case 'games':
        handleRoomChange('gaming-den');
        break;
      case 'music':
        handleRoomChange('music-room');
        break;
      case 'creative':
        handleRoomChange('creative-studio');
        break;
      default:
        // Track feature usage
        integrationService.useFeature(itemId);
    }
  }, [handleRoomChange]);

  const CurrentRoomComponent = roomComponentMap[currentRoom] || GrandFoyer;

  // Render content based on view mode
  const renderContent = () => {
    switch (viewMode) {
      case 'dashboard':
        return (
          <GothicDashboard
            onNavigate={(dest) => handleNavigation(dest)}
            userName="Traveler"
          />
        );
      case 'isometric':
        return (
          <IsometricDollhouse
            onRoomChange={(roomId) => {
              handleRoomChange(roomId);
              setViewMode('room');
            }}
            currentRoom={currentRoom}
            roomActivities={{}}
          />
        );
      case 'room':
      default:
        return (
          <RoomTransition isTransitioning={transitioning}>
            <CurrentRoomComponent onRoomChange={handleRoomChange} />
          </RoomTransition>
        );
    }
  };

  return (
    <MainContainer enableEffects={weatherEnabled}>
      {/* Weather/Time Background Effects */}
      {weatherEnabled && (
        <WeatherOverlay>
          <DayNightCycle />
          {weather.condition !== 'clear' && (
            <WeatherEffects weather={weather.condition} intensity={weather.intensity} />
          )}
        </WeatherOverlay>
      )}

      {/* Achievement Popup System */}
      <AchievementPopup
        duration={5000}
        position={{ vertical: 'top', horizontal: 'right' }}
        maxVisible={3}
      />

      {/* Top Navigation Bar */}
      <TopBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => setNavOpen(!navOpen)} sx={{ color: '#a78bfa' }}>
            {navOpen ? <X size={24} /> : <Menu size={24} />}
          </IconButton>
          <Typography
            sx={{
              fontFamily: '"Cinzel", serif',
              fontSize: '1.4rem',
              color: '#d4af37',
              letterSpacing: '0.1em',
            }}
          >
            Gothic Dollhouse
          </Typography>

          {/* View Mode Toggle */}
          <ViewModeToggle
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
          >
            <ToggleButton value="dashboard" aria-label="dashboard view">
              <LayoutDashboard size={16} />
              Dashboard
            </ToggleButton>
            <ToggleButton value="isometric" aria-label="isometric view">
              <Layers size={16} />
              Isometric
            </ToggleButton>
            <ToggleButton value="room" aria-label="room view">
              <Building2 size={16} />
              Room
            </ToggleButton>
          </ViewModeToggle>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Spoon Meter */}
          <SpoonMeter>
            <Typography sx={{ color: '#f97316', fontSize: '0.85rem', mr: 1 }}>
              Spoons:
            </Typography>
            {Array.from({ length: maxSpoons }).map((_, i) => (
              <Spoon key={i} filled={i < spoons} />
            ))}
          </SpoonMeter>

          {/* Quick Actions */}
          <Tooltip title="Weather Effects">
            <IconButton
              onClick={() => setWeatherEnabled(!weatherEnabled)}
              sx={{ color: weatherEnabled ? '#60a5fa' : '#888888' }}
            >
              {weatherEnabled ? <Sun size={20} /> : <Moon size={20} />}
            </IconButton>
          </Tooltip>

          <Tooltip title={audioState.isMuted ? 'Unmute' : 'Mute'}>
            <IconButton onClick={toggleMute} sx={{ color: '#888888' }}>
              {audioState.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </IconButton>
          </Tooltip>

          <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
            <IconButton onClick={() => setDarkMode(!darkMode)} sx={{ color: '#888888' }}>
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Notifications">
            <IconButton sx={{ color: '#888888' }}>
              <Badge badgeContent={notifications} color="error">
                <Bell size={20} />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Profile">
            <IconButton sx={{ color: '#888888' }}>
              <User size={20} />
            </IconButton>
          </Tooltip>
        </Box>
      </TopBar>

      {/* Side Navigation - Using new GothicNavigation or legacy */}
      {useNewNav ? (
        <Box sx={{ position: 'fixed', left: 0, top: '60px', bottom: 0, zIndex: 999 }}>
          <GothicNavigation
            currentItem={currentRoom}
            onNavigate={handleNavigation}
            collapsed={navCollapsed}
            onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
            notifications={notifications}
          />
        </Box>
      ) : (
        <SideNav sx={{ transform: navOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
          {/* Current Room Info */}
          {currentRoomConfig && (
            <GothicCard variant="glass" sx={{ mb: 3, p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Box sx={{ fontSize: '2rem' }}>{currentRoomConfig.icon}</Box>
                <Box>
                  <Typography sx={{ color: currentRoomConfig.color, fontWeight: 600 }}>
                    {currentRoomConfig.name}
                  </Typography>
                  <Typography sx={{ color: '#888888', fontSize: '0.75rem' }}>
                    {floorNames[currentRoomConfig.floor - 1]}
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ color: '#666666', fontSize: '0.85rem' }}>
                {currentRoomConfig.description}
              </Typography>
            </GothicCard>
          )}

          {/* Floor Navigation */}
          {[1, 2, 3, 4].map((floor) => {
            const floorRooms = getRoomsByFloor(floor);
            return (
              <FloorSection key={floor}>
                <FloorTitle>{floorNames[floor - 1]}</FloorTitle>
                {floorRooms.map((room) => (
                  <RoomItem
                    key={room.id}
                    active={currentRoom === room.id}
                    roomColor={room.color}
                    onClick={() => handleRoomChange(room.id)}
                  >
                    <RoomIcon color={room.color}>{room.icon}</RoomIcon>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: currentRoom === room.id ? room.color : '#e0e0e0', fontSize: '0.95rem' }}>
                        {room.name}
                      </Typography>
                      <Typography sx={{ color: '#666666', fontSize: '0.75rem' }}>
                        {room.description}
                      </Typography>
                    </Box>
                  </RoomItem>
                ))}
              </FloorSection>
            );
          })}
        </SideNav>
      )}

      {/* Main Content Area */}
      <ContentArea navOpen={navOpen} useNewNav={useNewNav}>
        {renderContent()}
      </ContentArea>

      {/* Floor Indicator */}
      {viewMode === 'room' && (
        <FloorIndicator>
          <Tooltip title="Go Up" placement="left">
            <IconButton
              onClick={() => currentFloor < 4 && handleFloorChange(currentFloor + 1)}
              disabled={currentFloor >= 4}
              sx={{ color: currentFloor < 4 ? '#a78bfa' : '#444444', p: 0.5 }}
            >
              <ChevronUp size={20} />
            </IconButton>
          </Tooltip>

          {[4, 3, 2, 1].map((floor) => (
            <Tooltip key={floor} title={floorNames[floor - 1]} placement="left">
              <FloorDot
                active={currentFloor === floor}
                floor={floor}
                onClick={() => handleFloorChange(floor)}
              />
            </Tooltip>
          ))}

          <Tooltip title="Go Down" placement="left">
            <IconButton
              onClick={() => currentFloor > 1 && handleFloorChange(currentFloor - 1)}
              disabled={currentFloor <= 1}
              sx={{ color: currentFloor > 1 ? '#a78bfa' : '#444444', p: 0.5 }}
            >
              <ChevronDown size={20} />
            </IconButton>
          </Tooltip>
        </FloorIndicator>
      )}

      {/* Pet Companion - Floating Widget */}
      <RoomPetCompanion
        position="bottom-left"
        currentRoom={currentRoom}
        onNavigateToSanctuary={() => handleRoomChange('pet-sanctuary')}
      />

      {/* Audio Manager - Floating Panel */}
      <AudioManager />
    </MainContainer>
  );
};

// ==========================================
// Main Export with Providers
// ==========================================

export const GothicDollhousePage: React.FC = () => {
  return (
    <ThemeProvider theme={gothicTheme}>
      <AccessibilityProvider>
        <AudioProvider>
          <GothicDollhouseContent />
        </AudioProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
};

export default GothicDollhousePage;
