// Music Room Component
// Music listening, playlists, soundscapes, and the full music creation system

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Slider, Chip, Tabs, Tab } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  Music, Play, Pause, SkipForward, SkipBack, Volume2,
  Heart, ListMusic, Radio, Disc3, Headphones, Waves, Tv, Library,
  Sparkles, Home, Search
} from 'lucide-react';
import { GothicCard } from '../gothic/GothicCard';
import { GothicButton } from '../gothic/GothicButton';
import { PlaylistManager } from '../music/PlaylistManager';
import { MoodMixer } from '../music/MoodMixer';
import { MusicDiscovery } from '../music/MusicDiscovery';
import { RoomSoundtrack } from '../music/RoomSoundtrack';
import { Track, musicLibrary } from '../../data/music_library';

interface RoomProps {
  onRoomChange?: (roomId: string) => void;
}

type MusicTab = 'nowPlaying' | 'playlists' | 'moodMixer' | 'discover' | 'rooms';

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
`;

const equalizer = keyframes`
  0%, 100% { height: 10px; }
  50% { height: 30px; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const RoomContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #08080c 0%, #101020 50%, #08080c 100%)',
  padding: '32px',
  position: 'relative',
});

const HeaderSection = styled(Box)({
  textAlign: 'center',
  marginBottom: '32px',
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

const StyledTabs = styled(Tabs)({
  marginBottom: '24px',
  '& .MuiTabs-indicator': {
    backgroundColor: '#d4af37',
    height: '3px',
    borderRadius: '2px',
  },
  '& .MuiTab-root': {
    color: '#888888',
    textTransform: 'none',
    fontFamily: '"Cinzel", serif',
    fontSize: '1rem',
    minWidth: 'auto',
    padding: '12px 24px',
    '&.Mui-selected': {
      color: '#d4af37',
    },
    '&:hover': {
      color: '#a78bfa',
    },
  },
});

const NowPlayingCard = styled(GothicCard)({
  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(20, 20, 30, 0.9))',
  border: '1px solid rgba(168, 85, 247, 0.4)',
});

const AlbumArt = styled(Box)<{ isPlaying: boolean }>(({ isPlaying }) => ({
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: `
    radial-gradient(circle at 50% 50%, #1a1a1a 0%, #1a1a1a 15%,
    #2a2a3a 15%, #2a2a3a 20%,
    #1a1a2a 20%, #1a1a2a 30%,
    #2a2a3a 30%, #2a2a3a 35%,
    #1a1a2a 35%, #1a1a2a 45%,
    #2a2a3a 45%, #2a2a3a 100%)
  `,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: isPlaying ? `${spin} 8s linear infinite` : 'none',
  boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #d4af37, #b8860b)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: '#0a0a0a',
  },
}));

const EqualizerBar = styled(Box)<{ delay: number }>(({ delay }) => ({
  width: '4px',
  background: 'linear-gradient(to top, #a855f7, #ec4899)',
  borderRadius: '2px',
  animation: `${equalizer} 0.8s ease-in-out infinite`,
  animationDelay: `${delay}ms`,
}));

const soundscapes = [
  { name: 'Rain on Window', icon: '🌧️', active: true },
  { name: 'Fireplace', icon: '🔥', active: false },
  { name: 'Forest Birds', icon: '🐦', active: false },
  { name: 'Ocean Waves', icon: '🌊', active: true },
  { name: 'Thunder', icon: '⛈️', active: false },
  { name: 'Wind', icon: '💨', active: false },
];

export const MusicRoom: React.FC<RoomProps> = ({ onRoomChange }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MusicTab>('nowPlaying');
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(70);
  const [progress, setProgress] = useState(35);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(
    musicLibrary.find(t => t.id === 'g3') || null // Default to "A Forest" by The Cure
  );
  const [queue, setQueue] = useState<Track[]>(
    musicLibrary.filter(t => ['g1', 'g5', 'l7', 'j7'].includes(t.id))
  );
  const [activeSoundscapes, setActiveSoundscapes] = useState<string[]>(['Rain on Window', 'Ocean Waves']);

  const handleTrackPlay = useCallback((track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  }, []);

  const handlePlaylistGenerated = useCallback((tracks: Track[], name: string) => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[0]);
      setQueue(tracks.slice(1, 5));
      setIsPlaying(true);
    }
  }, []);

  const handleNextTrack = useCallback(() => {
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      if (currentTrack) {
        setQueue([...rest, currentTrack]);
      } else {
        setQueue(rest);
      }
      setCurrentTrack(next);
      setProgress(0);
    }
  }, [queue, currentTrack]);

  const handlePrevTrack = useCallback(() => {
    // For simplicity, just restart the current track
    setProgress(0);
  }, []);

  const toggleSoundscape = useCallback((name: string) => {
    setActiveSoundscapes(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: MusicTab) => {
    setActiveTab(newValue);
  };

  return (
    <RoomContainer>
      <HeaderSection>
        <RoomTitle>
          <Music size={40} style={{ marginRight: '16px', verticalAlign: 'middle' }} />
          Music Room
        </RoomTitle>
        <Typography sx={{ color: '#8070a0', fontStyle: 'italic', fontSize: '1.1rem' }}>
          Soundscapes for every mood
        </Typography>
      </HeaderSection>

      {/* Navigation Tabs */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            value="nowPlaying"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Disc3 size={18} />
                Now Playing
              </Box>
            }
          />
          <Tab
            value="playlists"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ListMusic size={18} />
                Playlists
              </Box>
            }
          />
          <Tab
            value="moodMixer"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Sparkles size={18} />
                Mood Mixer
              </Box>
            }
          />
          <Tab
            value="discover"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Search size={18} />
                Discover
              </Box>
            }
          />
          <Tab
            value="rooms"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Home size={18} />
                Room Music
              </Box>
            }
          />
        </StyledTabs>
      </Box>

      {/* Now Playing Tab */}
      {activeTab === 'nowPlaying' && (
        <Grid container spacing={4}>
          {/* Now Playing */}
          <Grid item xs={12} md={8}>
            <NowPlayingCard variant="elevated" ornate>
              <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <AlbumArt isPlaying={isPlaying} />
                <Box sx={{ flex: 1, minWidth: '250px' }}>
                  <Typography sx={{ color: '#e0e0e0', fontSize: '1.8rem', fontWeight: 600, mb: 1 }}>
                    {currentTrack?.title || 'No Track Selected'}
                  </Typography>
                  <Typography sx={{ color: '#a0a0a0', fontSize: '1.1rem', mb: 3 }}>
                    {currentTrack?.artist || 'Unknown Artist'}
                  </Typography>

                  {/* Equalizer */}
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', height: '40px', alignItems: 'flex-end', mb: 3 }}>
                    {isPlaying && [0, 100, 200, 50, 150, 250, 100, 200].map((delay, i) => (
                      <EqualizerBar key={i} delay={delay} />
                    ))}
                    {!isPlaying && Array(8).fill(0).map((_, i) => (
                      <Box key={i} sx={{ width: '4px', height: '10px', background: '#a855f7', borderRadius: '2px' }} />
                    ))}
                  </Box>

                  {/* Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Slider
                      value={progress}
                      onChange={(_, v) => setProgress(v as number)}
                      sx={{
                        color: '#a855f7',
                        '& .MuiSlider-thumb': { width: 12, height: 12 },
                        '& .MuiSlider-rail': { backgroundColor: 'rgba(168, 85, 247, 0.2)' },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>
                        {Math.floor(progress * 0.045)}:{String(Math.floor((progress * 0.045 % 1) * 60)).padStart(2, '0')}
                      </Typography>
                      <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>4:32</Typography>
                    </Box>
                  </Box>

                  {/* Controls */}
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <GothicButton variant="ghost" sx={{ minWidth: 'auto', p: 1 }} onClick={handlePrevTrack}>
                      <SkipBack size={24} />
                    </GothicButton>
                    <Box
                      onClick={() => setIsPlaying(!isPlaying)}
                      sx={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'scale(1.1)' },
                      }}
                    >
                      {isPlaying ? <Pause size={28} /> : <Play size={28} style={{ marginLeft: '4px' }} />}
                    </Box>
                    <GothicButton variant="ghost" sx={{ minWidth: 'auto', p: 1 }} onClick={handleNextTrack}>
                      <SkipForward size={24} />
                    </GothicButton>
                  </Box>

                  {/* Volume */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3, maxWidth: '200px', mx: 'auto' }}>
                    <Volume2 size={20} color="#888888" />
                    <Slider
                      value={volume}
                      onChange={(_, v) => setVolume(v as number)}
                      sx={{
                        color: '#a855f7',
                        '& .MuiSlider-thumb': { width: 10, height: 10 },
                      }}
                    />
                  </Box>

                  {/* Track Info Chips */}
                  {currentTrack && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mt: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={currentTrack.genre}
                        size="small"
                        sx={{ backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }}
                      />
                      <Chip
                        label={currentTrack.decade}
                        size="small"
                        sx={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
                      />
                      {currentTrack.mood.slice(0, 2).map(m => (
                        <Chip
                          key={m}
                          label={m}
                          size="small"
                          sx={{ backgroundColor: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </NowPlayingCard>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Queue */}
            <GothicCard variant="glass" sx={{ mb: 3 }}>
              <Typography sx={{ color: '#a855f7', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
                <ListMusic size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Up Next
              </Typography>
              {queue.map((track, i) => (
                <Box
                  key={track.id}
                  onClick={() => handleTrackPlay(track)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    mb: 1,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    '&:hover': { background: 'rgba(168, 85, 247, 0.1)' },
                  }}
                >
                  <Box>
                    <Typography sx={{ color: '#e0e0e0', fontSize: '0.9rem' }}>{track.title}</Typography>
                    <Typography sx={{ color: '#888888', fontSize: '0.8rem' }}>{track.artist}</Typography>
                  </Box>
                  <Chip
                    label={track.tempo}
                    size="small"
                    sx={{ backgroundColor: 'rgba(139, 92, 246, 0.2)', color: '#a78bfa', fontSize: '0.7rem' }}
                  />
                </Box>
              ))}
            </GothicCard>

            {/* Soundscapes */}
            <GothicCard variant="glass">
              <Typography sx={{ color: '#10b981', fontFamily: '"Cinzel", serif', fontSize: '1.2rem', mb: 2 }}>
                <Waves size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Ambient Layer
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {soundscapes.map((sound) => (
                  <Chip
                    key={sound.name}
                    label={`${sound.icon} ${sound.name}`}
                    onClick={() => toggleSoundscape(sound.name)}
                    sx={{
                      background: activeSoundscapes.includes(sound.name) ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.1)',
                      color: activeSoundscapes.includes(sound.name) ? '#10b981' : '#888888',
                      cursor: 'pointer',
                      border: activeSoundscapes.includes(sound.name) ? '1px solid #10b981' : '1px solid transparent',
                      '&:hover': {
                        background: 'rgba(16, 185, 129, 0.2)',
                      },
                    }}
                  />
                ))}
              </Box>
            </GothicCard>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <GothicButton variant="primary" startIcon={<Radio size={18} />} onClick={() => setActiveTab('discover')}>
                Discover Music
              </GothicButton>
              <GothicButton variant="secondary" startIcon={<Heart size={18} />}>
                Liked Songs
              </GothicButton>
              <GothicButton variant="ghost" startIcon={<ListMusic size={18} />} onClick={() => setActiveTab('playlists')}>
                My Playlists
              </GothicButton>
            </Box>
          </Grid>
        </Grid>
      )}

      {/* Playlists Tab */}
      {activeTab === 'playlists' && (
        <PlaylistManager
          onTrackPlay={handleTrackPlay}
          onPlaylistSelect={(playlist) => {
            // Could load playlist tracks into queue
          }}
        />
      )}

      {/* Mood Mixer Tab */}
      {activeTab === 'moodMixer' && (
        <MoodMixer
          onPlaylistGenerated={handlePlaylistGenerated}
          onTrackPlay={handleTrackPlay}
        />
      )}

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <MusicDiscovery
          onTrackPlay={handleTrackPlay}
          onAddToPlaylist={(track) => {
            // Could open add to playlist dialog
            setQueue(prev => [...prev, track]);
          }}
        />
      )}

      {/* Room Music Tab */}
      {activeTab === 'rooms' && (
        <RoomSoundtrack
          currentRoom="music-room"
          onRoomChange={onRoomChange}
          onTrackPlay={handleTrackPlay}
        />
      )}

      {/* Navigation to Related Pages */}
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <GothicButton variant="primary" startIcon={<Tv size={18} />} onClick={() => navigate('/streaming')}>
          Streaming Hub
        </GothicButton>
        <GothicButton variant="secondary" startIcon={<Library size={18} />} onClick={() => navigate('/entertainment-library')}>
          Entertainment Library
        </GothicButton>
      </Box>
    </RoomContainer>
  );
};

export default MusicRoom;
