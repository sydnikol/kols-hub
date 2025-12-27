// RoomSoundtrack Component
// Assign playlists to dollhouse rooms with auto-play and quick switch controls

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
  Switch,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Collapse,
  Slider,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  Volume2,
  VolumeX,
  Settings,
  Home,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Shuffle,
  Repeat,
  RefreshCw,
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import {
  Track,
  musicLibrary,
  roomMusicSuggestions,
  genreInfo,
  playlistCovers,
} from '../../data/music_library';
import { Playlist } from './PlaylistManager';

// Animations
const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const wave = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
`;

// Types
interface RoomSoundtrackProps {
  currentRoom?: string;
  onRoomChange?: (roomId: string) => void;
  onTrackPlay?: (track: Track) => void;
  compact?: boolean;
}

interface RoomConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  floor: number;
}

interface RoomPlaylistAssignment {
  roomId: string;
  playlistId: string | null;
  autoPlay: boolean;
  volume: number;
}

// Room configurations
const roomConfigs: RoomConfig[] = [
  { id: 'grand-foyer', name: 'Grand Foyer', icon: '🏛️', color: '#d4af37', floor: 1 },
  { id: 'ancestor-hall', name: 'Ancestor Hall', icon: '🖼️', color: '#8b4513', floor: 1 },
  { id: 'wardrobe-palace', name: 'Wardrobe Palace', icon: '👗', color: '#ec4899', floor: 1 },
  { id: 'library-study', name: 'Library Study', icon: '📚', color: '#8b5cf6', floor: 2 },
  { id: 'apothecary', name: 'Apothecary', icon: '🧪', color: '#10b981', floor: 2 },
  { id: 'office-hub', name: 'Office Hub', icon: '💼', color: '#3b82f6', floor: 2 },
  { id: 'gaming-den', name: 'Gaming Den', icon: '🎮', color: '#ef4444', floor: 2 },
  { id: 'rooftop-observatory', name: 'Rooftop Observatory', icon: '🔭', color: '#6366f1', floor: 4 },
  { id: 'dream-archives', name: 'Dream Archives', icon: '💭', color: '#a855f7', floor: 3 },
  { id: 'fortune-teller-alcove', name: 'Fortune Teller Alcove', icon: '🔮', color: '#7c3aed', floor: 3 },
  { id: 'cloud-garden', name: 'Cloud Garden', icon: '☁️', color: '#06b6d4', floor: 4 },
  { id: 'creative-studio', name: 'Creative Studio', icon: '🎨', color: '#f59e0b', floor: 3 },
  { id: 'kitchen-lab', name: 'Kitchen Lab', icon: '🍳', color: '#84cc16', floor: 1 },
  { id: 'music-room', name: 'Music Room', icon: '🎵', color: '#a855f7', floor: 2 },
  { id: 'pet-sanctuary', name: 'Pet Sanctuary', icon: '🐾', color: '#f472b6', floor: 3 },
  { id: 'guest-quarters', name: 'Guest Quarters', icon: '🛏️', color: '#94a3b8', floor: 4 },
];

// Styled Components
const Container = styled(Box)({
  padding: '24px',
  background: 'linear-gradient(180deg, rgba(10, 8, 18, 0.95) 0%, rgba(20, 16, 32, 0.98) 100%)',
  borderRadius: '20px',
  border: '1px solid rgba(139, 92, 246, 0.2)',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
});

const Title = styled(Typography)({
  fontFamily: '"Cinzel", serif',
  fontSize: '1.8rem',
  color: '#d4af37',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

const CurrentRoomCard = styled(GothicCard)<{ roomColor: string }>(({ roomColor }) => ({
  background: `linear-gradient(135deg, ${roomColor}20, rgba(20, 16, 32, 0.9))`,
  borderColor: `${roomColor}40`,
  padding: '20px',
  marginBottom: '24px',
}));

const RoomIcon = styled(Box)<{ roomColor: string }>(({ roomColor }) => ({
  width: '60px',
  height: '60px',
  borderRadius: '16px',
  background: `${roomColor}30`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  boxShadow: `0 0 20px ${roomColor}40`,
}));

const NowPlayingSection = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  borderRadius: '12px',
  background: 'rgba(26, 16, 40, 0.6)',
  marginTop: '16px',
});

const EqualizerBars = styled(Box)({
  display: 'flex',
  gap: '3px',
  alignItems: 'flex-end',
  height: '24px',
});

const EqualizerBar = styled(Box)<{ delay: number; isPlaying: boolean }>(({ delay, isPlaying }) => ({
  width: '3px',
  height: isPlaying ? '100%' : '8px',
  background: 'linear-gradient(to top, #8b5cf6, #d4af37)',
  borderRadius: '2px',
  animation: isPlaying ? `${wave} 0.6s ease-in-out infinite` : 'none',
  animationDelay: `${delay}ms`,
}));

const RoomGrid = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '16px',
});

const RoomCard = styled(Box)<{ roomColor: string; isActive: boolean }>(({ roomColor, isActive }) => ({
  padding: '16px',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: isActive
    ? `linear-gradient(135deg, ${roomColor}30, rgba(20, 16, 32, 0.9))`
    : 'rgba(26, 16, 40, 0.6)',
  border: isActive ? `2px solid ${roomColor}` : '2px solid transparent',
  '&:hover': {
    background: `${roomColor}20`,
    transform: 'translateY(-2px)',
  },
}));

const SuggestionChip = styled(Chip)<{ chipColor: string }>(({ chipColor }) => ({
  backgroundColor: `${chipColor}20`,
  color: chipColor,
  fontSize: '0.7rem',
  height: '22px',
  border: `1px solid ${chipColor}40`,
}));

const QuickControls = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px',
  borderRadius: '12px',
  background: 'rgba(26, 16, 40, 0.8)',
  marginTop: '16px',
});

const ControlButton = styled(IconButton)<{ active?: boolean }>(({ active }) => ({
  color: active ? '#d4af37' : '#888888',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: '#a78bfa',
    background: 'rgba(139, 92, 246, 0.1)',
  },
}));

const VolumeSlider = styled(Slider)({
  color: '#8b5cf6',
  width: '100px',
  '& .MuiSlider-thumb': {
    width: 14,
    height: 14,
  },
});

const FloorSection = styled(Box)({
  marginBottom: '24px',
});

const FloorTitle = styled(Typography)({
  color: '#d4af37',
  fontFamily: '"Cinzel", serif',
  fontSize: '1rem',
  marginBottom: '12px',
  paddingLeft: '8px',
  borderLeft: '3px solid #d4af37',
});

const DialogStyled = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: '#1a1028',
    borderRadius: '24px',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    maxWidth: '500px',
    width: '100%',
  },
});

// Storage key
const ROOM_ASSIGNMENTS_KEY = 'gothic-dollhouse-room-soundtracks';

// Helper functions
const loadAssignments = (): RoomPlaylistAssignment[] => {
  try {
    const stored = localStorage.getItem(ROOM_ASSIGNMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveAssignments = (assignments: RoomPlaylistAssignment[]) => {
  localStorage.setItem(ROOM_ASSIGNMENTS_KEY, JSON.stringify(assignments));
};

const loadPlaylists = (): Playlist[] => {
  try {
    const stored = localStorage.getItem('gothic-dollhouse-playlists');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const RoomSoundtrack: React.FC<RoomSoundtrackProps> = ({
  currentRoom = 'grand-foyer',
  onRoomChange,
  onTrackPlay,
  compact = false,
}) => {
  const [assignments, setAssignments] = useState<RoomPlaylistAssignment[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [globalVolume, setGlobalVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [selectedRoomForSettings, setSelectedRoomForSettings] = useState<string | null>(null);

  // Load data on mount
  useEffect(() => {
    setAssignments(loadAssignments());
    setPlaylists(loadPlaylists());
  }, []);

  // Save assignments when changed
  useEffect(() => {
    if (assignments.length > 0) {
      saveAssignments(assignments);
    }
  }, [assignments]);

  // Get current room config
  const currentRoomConfig = useMemo(
    () => roomConfigs.find(r => r.id === currentRoom) || roomConfigs[0],
    [currentRoom]
  );

  // Get assignment for current room
  const currentAssignment = useMemo(
    () => assignments.find(a => a.roomId === currentRoom),
    [assignments, currentRoom]
  );

  // Get playlist for current room
  const currentPlaylist = useMemo(
    () => playlists.find(p => p.id === currentAssignment?.playlistId),
    [playlists, currentAssignment]
  );

  // Get suggested tracks for current room
  const suggestedTracks = useMemo(() => {
    const suggestions = roomMusicSuggestions[currentRoom];
    if (!suggestions) return [];

    return musicLibrary
      .filter(
        track =>
          suggestions.genres.includes(track.genre) ||
          track.mood.some(m => suggestions.moods.includes(m))
      )
      .slice(0, 10);
  }, [currentRoom]);

  // Handle room change with auto-play
  useEffect(() => {
    const assignment = assignments.find(a => a.roomId === currentRoom);
    if (assignment?.autoPlay && assignment.playlistId) {
      const playlist = playlists.find(p => p.id === assignment.playlistId);
      if (playlist && playlist.tracks.length > 0) {
        const firstTrackId = shuffle
          ? playlist.tracks[Math.floor(Math.random() * playlist.tracks.length)]
          : playlist.tracks[0];
        const track = musicLibrary.find(t => t.id === firstTrackId);
        if (track) {
          setCurrentTrack(track);
          setIsPlaying(true);
          onTrackPlay?.(track);
        }
      }
    }
  }, [currentRoom, assignments, playlists, shuffle, onTrackPlay]);

  // Handle assignment update
  const handleAssignPlaylist = useCallback((roomId: string, playlistId: string | null) => {
    setAssignments(prev => {
      const existing = prev.find(a => a.roomId === roomId);
      if (existing) {
        return prev.map(a =>
          a.roomId === roomId ? { ...a, playlistId } : a
        );
      }
      return [...prev, { roomId, playlistId, autoPlay: true, volume: 70 }];
    });
  }, []);

  // Handle auto-play toggle
  const handleToggleAutoPlay = useCallback((roomId: string) => {
    setAssignments(prev => {
      const existing = prev.find(a => a.roomId === roomId);
      if (existing) {
        return prev.map(a =>
          a.roomId === roomId ? { ...a, autoPlay: !a.autoPlay } : a
        );
      }
      return [...prev, { roomId, playlistId: null, autoPlay: true, volume: 70 }];
    });
  }, []);

  // Handle room volume change
  const handleRoomVolumeChange = useCallback((roomId: string, volume: number) => {
    setAssignments(prev => {
      const existing = prev.find(a => a.roomId === roomId);
      if (existing) {
        return prev.map(a =>
          a.roomId === roomId ? { ...a, volume } : a
        );
      }
      return [...prev, { roomId, playlistId: null, autoPlay: true, volume }];
    });
  }, []);

  // Play next track
  const handleNextTrack = useCallback(() => {
    if (!currentPlaylist || currentPlaylist.tracks.length === 0) return;

    let nextIndex = 0;
    if (currentTrack) {
      const currentIndex = currentPlaylist.tracks.indexOf(currentTrack.id);
      if (shuffle) {
        nextIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
      } else {
        nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
      }
    }

    const nextTrackId = currentPlaylist.tracks[nextIndex];
    const track = musicLibrary.find(t => t.id === nextTrackId);
    if (track) {
      setCurrentTrack(track);
      onTrackPlay?.(track);
    }
  }, [currentPlaylist, currentTrack, shuffle, onTrackPlay]);

  // Generate suggested playlist for room
  const handleGenerateSuggested = useCallback(() => {
    if (suggestedTracks.length === 0) return;
    // Just play the first suggested track
    const track = suggestedTracks[0];
    setCurrentTrack(track);
    setIsPlaying(true);
    onTrackPlay?.(track);
  }, [suggestedTracks, onTrackPlay]);

  // Get playlist cover
  const getCover = (coverId: string) => {
    return playlistCovers.find(c => c.id === coverId) || playlistCovers[0];
  };

  // Group rooms by floor
  const roomsByFloor = useMemo(() => {
    const floors: Record<number, RoomConfig[]> = { 1: [], 2: [], 3: [], 4: [] };
    roomConfigs.forEach(room => {
      if (floors[room.floor]) {
        floors[room.floor].push(room);
      }
    });
    return floors;
  }, []);

  const floorNames = ['Ground Floor', 'First Floor', 'Second Floor', 'Attic'];

  return (
    <Container>
      <Header>
        <Title>
          <Home size={28} color="#d4af37" />
          {compact ? 'Room Music' : 'Room Soundtrack'}
        </Title>
        <GothicButton
          variant="ghost"
          startIcon={<Settings size={18} />}
          onClick={() => setShowAllRooms(!showAllRooms)}
        >
          {showAllRooms ? 'Hide Rooms' : 'All Rooms'}
        </GothicButton>
      </Header>

      {/* Current Room */}
      <CurrentRoomCard variant="elevated" roomColor={currentRoomConfig.color}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <RoomIcon roomColor={currentRoomConfig.color}>
            {currentRoomConfig.icon}
          </RoomIcon>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: '#e0e0e0', fontSize: '1.3rem', fontWeight: 600 }}>
              {currentRoomConfig.name}
            </Typography>
            <Typography sx={{ color: '#888888', fontSize: '0.9rem', mb: 1 }}>
              {currentPlaylist ? currentPlaylist.name : 'No playlist assigned'}
            </Typography>

            {/* Mood suggestions */}
            {roomMusicSuggestions[currentRoom] && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {roomMusicSuggestions[currentRoom].genres.slice(0, 3).map(genre => (
                  <SuggestionChip
                    key={genre}
                    label={genreInfo[genre]?.name || genre}
                    chipColor={genreInfo[genre]?.color || '#8b5cf6'}
                    size="small"
                  />
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={currentAssignment?.playlistId || ''}
                onChange={(e) => handleAssignPlaylist(currentRoom, e.target.value || null)}
                displayEmpty
                sx={{
                  backgroundColor: 'rgba(26, 16, 40, 0.8)',
                  color: '#e0e0e0',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                  },
                  '& .MuiSelect-icon': {
                    color: '#a78bfa',
                  },
                }}
              >
                <MenuItem value="">
                  <em>No playlist</em>
                </MenuItem>
                {playlists.map(playlist => (
                  <MenuItem key={playlist.id} value={playlist.id}>
                    {getCover(playlist.coverId).icon} {playlist.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>Auto-play</Typography>
              <Switch
                size="small"
                checked={currentAssignment?.autoPlay ?? true}
                onChange={() => handleToggleAutoPlay(currentRoom)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#10b981',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#10b981',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Now Playing */}
        {currentTrack && (
          <NowPlayingSection>
            <EqualizerBars>
              {[0, 80, 160, 40, 120].map((delay, i) => (
                <EqualizerBar key={i} delay={delay} isPlaying={isPlaying} />
              ))}
            </EqualizerBars>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#e0e0e0', fontSize: '0.95rem', fontWeight: 500 }}>
                {currentTrack.title}
              </Typography>
              <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                {currentTrack.artist}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <ControlButton onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </ControlButton>
              <ControlButton onClick={handleNextTrack}>
                <SkipForward size={20} />
              </ControlButton>
            </Box>
          </NowPlayingSection>
        )}

        {/* Quick Controls */}
        <QuickControls>
          <ControlButton onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </ControlButton>
          <VolumeSlider
            value={isMuted ? 0 : globalVolume}
            onChange={(_, value) => setGlobalVolume(value as number)}
            size="small"
          />
          <Box sx={{ flex: 1 }} />
          <Tooltip title="Shuffle">
            <ControlButton active={shuffle} onClick={() => setShuffle(!shuffle)}>
              <Shuffle size={18} />
            </ControlButton>
          </Tooltip>
          <Tooltip title="Repeat">
            <ControlButton active={repeat} onClick={() => setRepeat(!repeat)}>
              <Repeat size={18} />
            </ControlButton>
          </Tooltip>
          <Tooltip title="Play suggested music">
            <ControlButton onClick={handleGenerateSuggested}>
              <Sparkles size={18} />
            </ControlButton>
          </Tooltip>
        </QuickControls>
      </CurrentRoomCard>

      {/* Suggested Tracks */}
      {suggestedTracks.length > 0 && !showAllRooms && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: '#a78bfa', fontSize: '1rem', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Sparkles size={18} />
            Suggested for {currentRoomConfig.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {suggestedTracks.slice(0, 5).map(track => (
              <Chip
                key={track.id}
                label={`${track.title} - ${track.artist}`}
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                  onTrackPlay?.(track);
                }}
                sx={{
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  color: '#e0e0e0',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 92, 246, 0.3)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* All Rooms View */}
      <Collapse in={showAllRooms}>
        {Object.entries(roomsByFloor).map(([floor, rooms]) => (
          <FloorSection key={floor}>
            <FloorTitle>{floorNames[parseInt(floor) - 1]}</FloorTitle>
            <RoomGrid>
              {rooms.map(room => {
                const assignment = assignments.find(a => a.roomId === room.id);
                const playlist = playlists.find(p => p.id === assignment?.playlistId);
                const isActive = room.id === currentRoom;

                return (
                  <RoomCard
                    key={room.id}
                    roomColor={room.color}
                    isActive={isActive}
                    onClick={() => onRoomChange?.(room.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box
                        sx={{
                          fontSize: '1.5rem',
                          filter: `drop-shadow(0 0 8px ${room.color}50)`,
                        }}
                      >
                        {room.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: '#e0e0e0', fontWeight: 500 }}>
                          {room.name}
                        </Typography>
                        <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                          {playlist ? playlist.name : 'No playlist'}
                        </Typography>
                      </Box>
                      {isActive && (
                        <Box
                          sx={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#10b981',
                            animation: `${pulse} 1.5s ease-in-out infinite`,
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControl size="small" sx={{ flex: 1, mr: 1 }}>
                        <Select
                          value={assignment?.playlistId || ''}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleAssignPlaylist(room.id, e.target.value || null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          displayEmpty
                          sx={{
                            backgroundColor: 'rgba(26, 16, 40, 0.8)',
                            color: '#e0e0e0',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(139, 92, 246, 0.2)',
                            },
                            '& .MuiSelect-icon': {
                              color: '#888888',
                            },
                          }}
                        >
                          <MenuItem value="" sx={{ fontSize: '0.85rem' }}>
                            <em>None</em>
                          </MenuItem>
                          {playlists.map(p => (
                            <MenuItem key={p.id} value={p.id} sx={{ fontSize: '0.85rem' }}>
                              {getCover(p.coverId).icon} {p.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Tooltip title={assignment?.autoPlay ? 'Auto-play on' : 'Auto-play off'}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAutoPlay(room.id);
                          }}
                          sx={{
                            color: assignment?.autoPlay ? '#10b981' : '#888888',
                          }}
                        >
                          {assignment?.autoPlay ? <Check size={16} /> : <X size={16} />}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </RoomCard>
                );
              })}
            </RoomGrid>
          </FloorSection>
        ))}
      </Collapse>
    </Container>
  );
};

export default RoomSoundtrack;
